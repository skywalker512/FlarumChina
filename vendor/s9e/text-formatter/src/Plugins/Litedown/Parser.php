<?php

/*
* @package   s9e\TextFormatter
* @copyright Copyright (c) 2010-2016 The s9e Authors
* @license   http://www.opensource.org/licenses/mit-license.php The MIT License
*/
namespace s9e\TextFormatter\Plugins\Litedown;
use s9e\TextFormatter\Parser as Rules;
use s9e\TextFormatter\Parser\Tag;
use s9e\TextFormatter\Plugins\ParserBase;
class Parser extends ParserBase
{
	protected $hasEscapedChars;
	protected $links;
	protected $text;
	public function parse($text, array $matches)
	{
		$this->init($text);
		$this->matchBlockLevelMarkup();
		$this->matchInlineCode();
		$this->matchImages();
		$this->matchLinks();
		$this->matchStrikethrough();
		$this->matchSuperscript();
		$this->matchEmphasis();
		$this->matchForcedLineBreaks();
		unset($this->text);
	}
	protected function closeList(array $list, $textBoundary)
	{
		$this->parser->addEndTag('LIST', $textBoundary, 0)->pairWith($list['listTag']);
		$this->parser->addEndTag('LI',   $textBoundary, 0)->pairWith($list['itemTag']);
		if ($list['tight'])
			foreach ($list['itemTags'] as $itemTag)
				$itemTag->removeFlags(Rules::RULE_CREATE_PARAGRAPHS);
	}
	protected function computeQuoteIgnoreLen($str, $maxQuoteDepth)
	{
		$remaining = $str;
		while (--$maxQuoteDepth >= 0)
			$remaining = \preg_replace('/^ *> ?/', '', $remaining);
		return \strlen($str) - \strlen($remaining);
	}
	protected function decode($str)
	{
		if ($this->config['decodeHtmlEntities'] && \strpos($str, '&') !== \false)
			$str = \html_entity_decode($str, \ENT_QUOTES, 'UTF-8');
		$str = \stripslashes(\str_replace("\x1A", '', $str));
		if ($this->hasEscapedChars)
			$str = \strtr(
				$str,
				array(
					"\x1B0" => '!', "\x1B1" => '"', "\x1B2" => ')',
					"\x1B3" => '*', "\x1B4" => '[', "\x1B5" => '\\',
					"\x1B6" => ']', "\x1B7" => '^', "\x1B8" => '_',
					"\x1B9" => '`', "\x1BA" => '~'
				)
			);
		return $str;
	}
	protected function decodeQuotedString($str)
	{
		return $this->decode(\preg_replace('/^([\'"])(.*)\\1$/', '$2', \trim($str)));
	}
	protected function encode($str)
	{
		return \strtr(
			$str,
			array(
				'\\!' => "\x1B0", '\\"' => "\x1B1", '\\)'  => "\x1B2",
				'\\*' => "\x1B3", '\\[' => "\x1B4", '\\\\' => "\x1B5",
				'\\]' => "\x1B6", '\\^' => "\x1B7", '\\_'  => "\x1B8",
				'\\`' => "\x1B9", '\\~' => "\x1BA"
			)
		);
	}
	protected function getAtxHeaderEndTagLen($startPos, $endPos)
	{
		$content = \substr($this->text, $startPos, $endPos - $startPos);
		\preg_match('/[ \\t]*#*[ \\t]*$/', $content, $m);
		return \strlen($m[0]);
	}
	protected function getReferenceLinkAttributes($label)
	{
		if (!isset($this->links))
			$this->matchLinkReferences();
		$label = \strtolower($label);
		return (isset($this->links[$label])) ? $this->links[$label] : array();
	}
	protected function getSetextLines()
	{
		$setextLines = array();
		if (\strpos($this->text, '-') === \false && \strpos($this->text, '=') === \false)
			return $setextLines;
		$regexp = '/^(?=[-=>])(?:> ?)*(?=[-=])(?:-+|=+) *$/m';
		if (\preg_match_all($regexp, $this->text, $matches, \PREG_OFFSET_CAPTURE))
			foreach ($matches[0] as $_f570d26d)
			{
				list($match, $matchPos) = $_f570d26d;
				$endTagPos = $matchPos - 1;
				while ($endTagPos > 0 && $this->text[$endTagPos - 1] === ' ')
					--$endTagPos;
				$setextLines[$matchPos - 1] = array(
					'endTagLen'  => $matchPos + \strlen($match) - $endTagPos,
					'endTagPos'  => $endTagPos,
					'quoteDepth' => \substr_count($match, '>'),
					'tagName'    => ($match[0] === '=') ? 'H1' : 'H2'
				);
			}
		return $setextLines;
	}
	protected function getEmphasisByBlock($regexp, $pos)
	{
		$block    = array();
		$blocks   = array();
		$breakPos = \strpos($this->text, "\x17", $pos);
		\preg_match_all($regexp, $this->text, $matches, \PREG_OFFSET_CAPTURE, $pos);
		foreach ($matches[0] as $m)
		{
			$matchPos = $m[1];
			$matchLen = \strlen($m[0]);
			if ($matchPos > $breakPos)
			{
				$blocks[] = $block;
				$block    = array();
				$breakPos = \strpos($this->text, "\x17", $matchPos);
			}
			if (!$this->ignoreEmphasis($matchPos, $matchLen))
				$block[] = array($matchPos, $matchLen);
		}
		$blocks[] = $block;
		return $blocks;
	}
	protected function getInlineLinkAttributes(array $m)
	{
		$attrValues = array($this->decode($m[3][0]));
		if (!empty($m[4][0]))
		{
			$title = $this->decodeQuotedString($m[4][0]);
			if ($title > '')
				$attrValues[] = $title;
		}
		return $attrValues;
	}
	protected function ignoreEmphasis($matchPos, $matchLen)
	{
		if ($this->text[$matchPos] === '_' && $matchLen === 1 && $this->isSurroundedByAlnum($matchPos, $matchLen))
			return \true;
		return \false;
	}
	protected function init($text)
	{
		if (\strpos($text, '\\') === \false || !\preg_match('/\\\\[!")*[\\\\\\]^_`~]/', $text))
			$this->hasEscapedChars = \false;
		else
		{
			$this->hasEscapedChars = \true;
			$text = $this->encode($text);
		}
		$text .= "\n\n\x17";
		$this->text = $text;
		unset($this->links);
	}
	protected function isAlnum($chr)
	{
		return (\strpos(' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', $chr) > 0);
	}
	protected function isSurroundedByAlnum($matchPos, $matchLen)
	{
		return ($matchPos > 0 && $this->isAlnum($this->text[$matchPos - 1]) && $this->isAlnum($this->text[$matchPos + $matchLen]));
	}
	protected function markBoundary($pos)
	{
		$this->text[$pos] = "\x17";
	}
	protected function matchBlockLevelMarkup()
	{
		$codeFence    = \null;
		$codeIndent   = 4;
		$codeTag      = \null;
		$lineIsEmpty  = \true;
		$lists        = array();
		$listsCnt     = 0;
		$newContext   = \false;
		$quotes       = array();
		$quotesCnt    = 0;
		$setextLines  = $this->getSetextLines();
		$textBoundary = 0;
		$regexp = '/^(?:(?=[-*+\\d \\t>`~#_])((?: {0,3}> ?)+)?([ \\t]+)?(\\* *\\* *\\*[* ]*$|- *- *-[- ]*$|_ *_ *_[_ ]*$|=+$)?((?:[-*+]|\\d+\\.)[ \\t]+(?=\\S))?[ \\t]*(#{1,6}[ \\t]+|```+[^`\\n]*$|~~~+[^~\\n]*$)?)?/m';
		\preg_match_all($regexp, $this->text, $matches, \PREG_OFFSET_CAPTURE | \PREG_SET_ORDER);
		foreach ($matches as $m)
		{
			$matchPos   = $m[0][1];
			$matchLen   = \strlen($m[0][0]);
			$ignoreLen  = 0;
			$quoteDepth = 0;
			$continuation = !$lineIsEmpty;
			$lfPos       = \strpos($this->text, "\n", $matchPos);
			$lineIsEmpty = ($lfPos === $matchPos + $matchLen && empty($m[3][0]) && empty($m[4][0]) && empty($m[5][0]));
			$breakParagraph = ($lineIsEmpty && $continuation);
			if (!empty($m[1][0]))
			{
				$quoteDepth = \substr_count($m[1][0], '>');
				$ignoreLen  = \strlen($m[1][0]);
				if (isset($codeTag) && $codeTag->hasAttribute('quoteDepth'))
				{
					$quoteDepth = \min($quoteDepth, $codeTag->getAttribute('quoteDepth'));
					$ignoreLen  = $this->computeQuoteIgnoreLen($m[1][0], $quoteDepth);
				}
			}
			if ($quoteDepth < $quotesCnt && !$continuation && !$lineIsEmpty)
			{
				$newContext = \true;
				do
				{
					$this->parser->addEndTag('QUOTE', $textBoundary, 0)
					             ->pairWith(\array_pop($quotes));
				}
				while ($quoteDepth < --$quotesCnt);
			}
			if ($quoteDepth > $quotesCnt && !$lineIsEmpty)
			{
				$newContext = \true;
				do
				{
					$tag = $this->parser->addStartTag('QUOTE', $matchPos, 0);
					$tag->setSortPriority($quotesCnt);
					$quotes[] = $tag;
				}
				while ($quoteDepth > ++$quotesCnt);
			}
			$indentWidth = 0;
			$indentPos   = 0;
			if (!empty($m[2][0]) && !$codeFence)
			{
				$indentStr = $m[2][0];
				$indentLen = \strlen($indentStr);
				do
				{
					if ($indentStr[$indentPos] === ' ')
						++$indentWidth;
					else
						$indentWidth = ($indentWidth + 4) & ~3;
				}
				while (++$indentPos < $indentLen && $indentWidth < $codeIndent);
			}
			if (isset($codeTag) && !$codeFence && $indentWidth < $codeIndent && !$lineIsEmpty)
				$newContext = \true;
			if ($newContext)
			{
				$newContext = \false;
				if (isset($codeTag))
				{
					$this->overwrite($codeTag->getPos(), $textBoundary - $codeTag->getPos());
					$endTag = $this->parser->addEndTag('CODE', $textBoundary, 0);
					$endTag->pairWith($codeTag);
					$endTag->setSortPriority(-1);
					$codeTag = \null;
					$codeFence = \null;
				}
				foreach ($lists as $list)
					$this->closeList($list, $textBoundary);
				$lists    = array();
				$listsCnt = 0;
				if ($matchPos)
					$this->markBoundary($matchPos - 1);
			}
			if ($indentWidth >= $codeIndent)
			{
				if (isset($codeTag) || !$continuation)
				{
					$ignoreLen += $indentPos;
					if (!isset($codeTag))
						$codeTag = $this->parser->addStartTag('CODE', $matchPos + $ignoreLen, 0);
					$m = array();
				}
			}
			else
			{
				$hasListItem = !empty($m[4][0]);
				if (!$indentWidth && !$continuation && !$hasListItem && !$lineIsEmpty)
					$listIndex = -1;
				elseif ($continuation && !$hasListItem)
					$listIndex = $listsCnt - 1;
				elseif (!$listsCnt)
					if ($hasListItem && (!$continuation || $this->text[$matchPos - 1] === "\x17"))
						$listIndex = 0;
					else
						$listIndex = -1;
				else
				{
					$listIndex = 0;
					while ($listIndex < $listsCnt && $indentWidth > $lists[$listIndex]['maxIndent'])
						++$listIndex;
				}
				while ($listIndex < $listsCnt - 1)
				{
					$this->closeList(\array_pop($lists), $textBoundary);
					--$listsCnt;
				}
				if ($listIndex === $listsCnt && !$hasListItem)
					--$listIndex;
				if ($hasListItem && $listIndex >= 0)
				{
					$breakParagraph = \true;
					$tagPos = $matchPos + $ignoreLen + $indentPos;
					$tagLen = \strlen($m[4][0]);
					$itemTag = $this->parser->addStartTag('LI', $tagPos, $tagLen);
					$this->overwrite($tagPos, $tagLen);
					if ($listIndex < $listsCnt)
					{
						$this->parser->addEndTag('LI', $textBoundary, 0)
						             ->pairWith($lists[$listIndex]['itemTag']);
						$lists[$listIndex]['itemTag']    = $itemTag;
						$lists[$listIndex]['itemTags'][] = $itemTag;
					}
					else
					{
						++$listsCnt;
						if ($listIndex)
						{
							$minIndent = $lists[$listIndex - 1]['maxIndent'] + 1;
							$maxIndent = \max($minIndent, $listIndex * 4);
						}
						else
						{
							$minIndent = 0;
							$maxIndent = $indentWidth;
						}
						$listTag = $this->parser->addStartTag('LIST', $tagPos, 0);
						if (\strpos($m[4][0], '.') !== \false)
						{
							$listTag->setAttribute('type', 'decimal');
							$start = (int) $m[4][0];
							if ($start !== 1)
								$listTag->setAttribute('start', $start);
						}
						$lists[] = array(
							'listTag'   => $listTag,
							'itemTag'   => $itemTag,
							'itemTags'  => array($itemTag),
							'minIndent' => $minIndent,
							'maxIndent' => $maxIndent,
							'tight'     => \true
						);
					}
				}
				if ($listsCnt && !$continuation && !$lineIsEmpty)
					if (\count($lists[0]['itemTags']) > 1 || !$hasListItem)
					{
						foreach ($lists as &$list)
							$list['tight'] = \false;
						unset($list);
					}
				$codeIndent = ($listsCnt + 1) * 4;
			}
			if (isset($m[5]))
			{
				if ($m[5][0][0] === '#')
				{
					$startTagLen = \strlen($m[5][0]);
					$startTagPos = $matchPos + $matchLen - $startTagLen;
					$endTagLen   = $this->getAtxHeaderEndTagLen($matchPos + $matchLen, $lfPos);
					$endTagPos   = $lfPos - $endTagLen;
					$this->parser->addTagPair('H' . \strspn($m[5][0], '#', 0, 6), $startTagPos, $startTagLen, $endTagPos, $endTagLen);
					$this->markBoundary($startTagPos);
					$this->markBoundary($lfPos);
					if ($continuation)
						$breakParagraph = \true;
				}
				elseif ($m[5][0][0] === '`' || $m[5][0][0] === '~')
				{
					$tagPos = $matchPos + $ignoreLen;
					$tagLen = $lfPos - $tagPos;
					if (isset($codeTag) && $m[5][0] === $codeFence)
					{
						$endTag = $this->parser->addEndTag('CODE', $tagPos, $tagLen);
						$endTag->pairWith($codeTag);
						$endTag->setSortPriority(-1);
						$this->parser->addIgnoreTag($textBoundary, $tagPos - $textBoundary);
						$this->overwrite($codeTag->getPos(), $tagPos + $tagLen - $codeTag->getPos());
						$codeTag = \null;
						$codeFence = \null;
					}
					elseif (!isset($codeTag))
					{
						$codeTag   = $this->parser->addStartTag('CODE', $tagPos, $tagLen);
						$codeFence = \substr($m[5][0], 0, \strspn($m[5][0], '`~'));
						$codeTag->setAttribute('quoteDepth', $quoteDepth);
						$this->parser->addIgnoreTag($tagPos + $tagLen, 1);
						$lang = \trim(\trim($m[5][0], '`~'));
						if ($lang !== '')
							$codeTag->setAttribute('lang', $lang);
					}
				}
			}
			elseif (!empty($m[3][0]) && !$listsCnt && $this->text[$matchPos + $matchLen] !== "\x17")
			{
				$this->parser->addSelfClosingTag('HR', $matchPos + $ignoreLen, $matchLen - $ignoreLen);
				$breakParagraph = \true;
				$this->markBoundary($lfPos);
			}
			elseif (isset($setextLines[$lfPos]) && $setextLines[$lfPos]['quoteDepth'] === $quoteDepth && !$lineIsEmpty && !$listsCnt && !isset($codeTag))
			{
				$this->parser->addTagPair(
					$setextLines[$lfPos]['tagName'],
					$matchPos + $ignoreLen,
					0,
					$setextLines[$lfPos]['endTagPos'],
					$setextLines[$lfPos]['endTagLen']
				);
				$this->markBoundary($setextLines[$lfPos]['endTagPos'] + $setextLines[$lfPos]['endTagLen']);
			}
			if ($breakParagraph)
			{
				$this->parser->addParagraphBreak($textBoundary);
				$this->markBoundary($textBoundary);
			}
			if (!$lineIsEmpty)
				$textBoundary = $lfPos;
			if ($ignoreLen)
				$this->parser->addIgnoreTag($matchPos, $ignoreLen)->setSortPriority(1000);
		}
	}
	protected function matchEmphasis()
	{
		$this->matchEmphasisByCharacter('*', '/\\*+/');
		$this->matchEmphasisByCharacter('_', '/_+/');
	}
	protected function matchEmphasisByCharacter($character, $regexp)
	{
		$pos = \strpos($this->text, $character);
		if ($pos === \false)
			return;
		foreach ($this->getEmphasisByBlock($regexp, $pos) as $block)
			$this->processEmphasisBlock($block);
	}
	protected function matchForcedLineBreaks()
	{
		$pos = \strpos($this->text, "  \n");
		while ($pos !== \false)
		{
			$this->parser->addBrTag($pos + 2);
			$pos = \strpos($this->text, "  \n", $pos + 3);
		}
	}
	protected function matchImages()
	{
		$pos = \strpos($this->text, '![');
		if ($pos === \false)
			return;
		\preg_match_all(
			'/!\\[([^\\x17]*?(?=] ?\\()|[^\\x17\\]]*)](?: ?\\[([^\\x17\\]]+)\\]| ?\\(([^\\x17 ")]+)( *(?:"[^\\x17"]*"|\'[^\\x17\']*\'|[^\\x17\\)]*))?\\))?/',
			$this->text,
			$matches,
			\PREG_OFFSET_CAPTURE | \PREG_SET_ORDER,
			$pos
		);
		foreach ($matches as $m)
		{
			$matchPos    = $m[0][1];
			$matchLen    = \strlen($m[0][0]);
			$contentLen  = \strlen($m[1][0]);
			$startTagPos = $matchPos;
			$startTagLen = 2;
			$endTagPos   = $startTagPos + $startTagLen + $contentLen;
			$endTagLen   = $matchLen - $startTagLen - $contentLen;
			$tag = $this->parser->addTagPair('IMG', $startTagPos, $startTagLen, $endTagPos, $endTagLen);
			$tag->setAttribute('alt', $this->decode($m[1][0]));
			$this->setLinkAttributes($tag, $m, array('src', 'title'));
			$this->overwrite($matchPos, $matchLen);
		}
	}
	protected function matchInlineCode()
	{
		$pos = \strpos($this->text, '`');
		if ($pos === \false)
			return;
		\preg_match_all(
			'/((`+)(?!`)\\s*)(?:[^\\x17]*?[^`\\s])?(\\s*\\2)(?!`)/',
			$this->text,
			$matches,
			\PREG_OFFSET_CAPTURE | \PREG_SET_ORDER,
			$pos
		);
		foreach ($matches as $m)
		{
			$matchLen    = \strlen($m[0][0]);
			$matchPos    = $m[0][1];
			$startTagLen = \strlen($m[1][0]);
			$endTagLen   = \strlen($m[3][0]);
			$this->parser->addTagPair('C', $matchPos, $startTagLen, $matchPos + $matchLen - $endTagLen, $endTagLen);
			$this->overwrite($matchPos, $matchLen);
		}
	}
	protected function matchLinkReferences()
	{
		$this->links = array();
		$regexp = '/^(?:> ?)* {0,3}\\[([^\\x17\\]]+)\\]: *([^\\s\\x17]+)([^\\n\\x17]*)\\n?/m';
		\preg_match_all($regexp, $this->text, $matches, \PREG_OFFSET_CAPTURE | \PREG_SET_ORDER);
		foreach ($matches as $m)
		{
			$this->parser->addIgnoreTag($m[0][1], \strlen($m[0][0]))->setSortPriority(-2);
			$label = \strtolower($m[1][0]);
			if (isset($this->links[$label]))
				continue;
			$this->links[$label] = array($this->decode($m[2][0]));
			$title = $this->decodeQuotedString($m[3][0]);
			if ($title > '')
				$this->links[$label][] = $title;
		}
	}
	protected function matchLinks()
	{
		$pos = \strpos($this->text, '[');
		if ($pos === \false)
			return;
		\preg_match_all(
			'/\\[([^\\x17]*?(?=]\\()|[^\\x17\\]]*)](?: ?\\[([^\\x17\\]]+)\\]|\\(([^\\x17 ()]+(?:\\([^\\x17 ()]+\\)[^\\x17 ()]*)*[^\\x17 )]*)( *(?:"[^\\x17"]*"|\'[^\\x17\']*\'|[^\\x17\\)]*))?\\))?/',
			$this->text,
			$matches,
			\PREG_OFFSET_CAPTURE | \PREG_SET_ORDER,
			$pos
		);
		foreach ($matches as $m)
		{
			$matchPos    = $m[0][1];
			$matchLen    = \strlen($m[0][0]);
			$contentLen  = \strlen($m[1][0]);
			$startTagPos = $matchPos;
			$startTagLen = 1;
			$endTagPos   = $startTagPos + $startTagLen + $contentLen;
			$endTagLen   = $matchLen - $startTagLen - $contentLen;
			$tag = $this->parser->addTagPair('URL', $startTagPos, $startTagLen, $endTagPos, $endTagLen);
			$this->setLinkAttributes($tag, $m, array('url', 'title'));
			$tag->setSortPriority(-1);
			$this->overwrite($startTagPos, $startTagLen);
			$this->overwrite($endTagPos,   $endTagLen);
		}
	}
	protected function matchStrikethrough()
	{
		$pos = \strpos($this->text, '~~');
		if ($pos === \false)
			return;
		\preg_match_all(
			'/~~[^\\x17]+?~~/',
			$this->text,
			$matches,
			\PREG_OFFSET_CAPTURE,
			$pos
		);
		foreach ($matches[0] as $_4b034d25)
		{
			list($match, $matchPos) = $_4b034d25;
			$matchLen = \strlen($match);
			$this->parser->addTagPair('DEL', $matchPos, 2, $matchPos + $matchLen - 2, 2);
		}
	}
	protected function matchSuperscript()
	{
		$pos = \strpos($this->text, '^');
		if ($pos === \false)
			return;
		\preg_match_all(
			'/\\^[^\\x17\\s]++/',
			$this->text,
			$matches,
			\PREG_OFFSET_CAPTURE,
			$pos
		);
		foreach ($matches[0] as $_4b034d25)
		{
			list($match, $matchPos) = $_4b034d25;
			$matchLen    = \strlen($match);
			$startTagPos = $matchPos;
			$endTagPos   = $matchPos + $matchLen;
			$parts = \explode('^', $match);
			unset($parts[0]);
			foreach ($parts as $part)
			{
				$this->parser->addTagPair('SUP', $startTagPos, 1, $endTagPos, 0);
				$startTagPos += 1 + \strlen($part);
			}
		}
	}
	protected function overwrite($pos, $len)
	{
		$this->text = \substr($this->text, 0, $pos) . \str_repeat("\x1A", $len) . \substr($this->text, $pos + $len);
	}
	protected function processEmphasisBlock(array $block)
	{
		$buffered  = 0;
		$emPos     = -1;
		$strongPos = -1;
		foreach ($block as $_aab3a45e)
		{
			list($matchPos, $matchLen) = $_aab3a45e;
			$closeLen     = \min(3, $matchLen);
			$closeEm      = $closeLen & $buffered & 1;
			$closeStrong  = $closeLen & $buffered & 2;
			$emEndPos     = $matchPos;
			$strongEndPos = $matchPos;
			if ($buffered > 2 && $emPos === $strongPos)
				if ($closeEm)
					$emPos += 2;
				else
					++$strongPos;
			if ($closeEm && $closeStrong)
				if ($emPos < $strongPos)
					$emEndPos += 2;
				else
					++$strongEndPos;
			$remaining = $matchLen;
			if ($closeEm)
			{
				--$buffered;
				--$remaining;
				$this->parser->addTagPair('EM', $emPos, 1, $emEndPos, 1);
			}
			if ($closeStrong)
			{
				$buffered  -= 2;
				$remaining -= 2;
				$this->parser->addTagPair('STRONG', $strongPos, 2, $strongEndPos, 2);
			}
			$remaining = \min(3, $remaining);
			if ($remaining & 1)
				$emPos = $matchPos + $matchLen - $remaining;
			if ($remaining & 2)
				$strongPos = $matchPos + $matchLen - $remaining;
			$buffered += $remaining;
		}
	}
	protected function setLinkAttributes(Tag $tag, array $m, array $attrNames)
	{
		if (isset($m[3]))
			$attrValues = $this->getInlineLinkAttributes($m);
		else
		{
			$label      = (isset($m[2])) ? $m[2][0] : $m[1][0];
			$attrValues = $this->getReferenceLinkAttributes($label);
		}
		foreach ($attrValues as $k => $attrValue)
			$tag->setAttribute($attrNames[$k], $attrValue);
	}
}