<?php

/*
* @package   s9e\TextFormatter
* @copyright Copyright (c) 2010-2016 The s9e Authors
* @license   http://www.opensource.org/licenses/mit-license.php The MIT License
*/
namespace s9e\TextFormatter\Plugins\FancyPants;
use s9e\TextFormatter\Plugins\ParserBase;
class Parser extends ParserBase
{
	protected $text;
	public function parse($text, array $matches)
	{
		$this->text = $text;
		$hasSingleQuote = (\strpos($text, "'") !== \false);
		$hasDoubleQuote = (\strpos($text, '"') !== \false);
		if ($hasSingleQuote)
			$this->parseSingleQuotes();
		if ($hasSingleQuote || $hasDoubleQuote || \strpos($text, 'x') !== \false)
			$this->parseSymbolsAfterDigits();
		if ($hasSingleQuote)
			$this->parseSingleQuotePairs();
		if ($hasDoubleQuote)
			$this->parseDoubleQuotePairs();
		if (\strpos($text, '...') !== \false || \strpos($text, '--')  !== \false)
			$this->parseDashesAndEllipses();
		if (\strpos($text, '(') !== \false)
			$this->parseSymbolsInParentheses();
		unset($this->text);
	}
	protected function addTag($tagPos, $tagLen, $chr)
	{
		$tag = $this->parser->addSelfClosingTag($this->config['tagName'], $tagPos, $tagLen);
		$tag->setAttribute($this->config['attrName'], $chr);
		return $tag;
	}
	protected function parseDashesAndEllipses()
	{
		$chrs = array(
			'--'  => "\xE2\x80\x93",
			'---' => "\xE2\x80\x94",
			'...' => "\xE2\x80\xA6"
		);
		$regexp = '/---?|\\.\\.\\./S';
		\preg_match_all($regexp, $this->text, $matches, \PREG_OFFSET_CAPTURE);
		foreach ($matches[0] as $m)
			$this->addTag($m[1], \strlen($m[0]), $chrs[$m[0]]);
	}
	protected function parseDoubleQuotePairs()
	{
		$this->parseQuotePairs(
			'/(?<![0-9\\pL])"[^"\\n]+"(?![0-9\\pL])/uS',
			"\xE2\x80\x9C",
			"\xE2\x80\x9D"
		);
	}
	protected function parseQuotePairs($regexp, $leftQuote, $rightQuote)
	{
		\preg_match_all($regexp, $this->text, $matches, \PREG_OFFSET_CAPTURE);
		foreach ($matches[0] as $m)
		{
			$left  = $this->addTag($m[1], 1, $leftQuote);
			$right = $this->addTag($m[1] + \strlen($m[0]) - 1, 1, $rightQuote);
			$left->cascadeInvalidationTo($right);
		}
	}
	protected function parseSingleQuotePairs()
	{
		$this->parseQuotePairs(
			"/(?<![0-9\\pL])'[^'\\n]+'(?![0-9\\pL])/uS",
			"\xE2\x80\x98",
			"\xE2\x80\x99"
		);
	}
	protected function parseSingleQuotes()
	{
		$regexp = "/(?<=\\pL)'|(?<!\\S)'(?=\\pL|[0-9]{2})/uS";
		\preg_match_all($regexp, $this->text, $matches, \PREG_OFFSET_CAPTURE);
		foreach ($matches[0] as $m)
		{
			$tag = $this->addTag($m[1], 1, "\xE2\x80\x99");
			$tag->setSortPriority(10);
		}
	}
	protected function parseSymbolsAfterDigits()
	{
		$regexp = '/[0-9](?>\'s|["\']? ?x(?= ?[0-9])|["\'])/S';
		\preg_match_all($regexp, $this->text, $matches, \PREG_OFFSET_CAPTURE);
		foreach ($matches[0] as $m)
		{
			if (\substr($m[0], -1) === 'x')
				$this->addTag($m[1] + \strlen($m[0]) - 1, 1, "\xC3\x97");
			$c = $m[0][1];
			if ($c === "'" || $c === '"')
			{
				if (\substr($m[0], 1, 2) === "'s")
					$chr = "\xE2\x80\x99";
				else
					$chr = ($c === "'") ? "\xE2\x80\xB2" : "\xE2\x80\xB3";
				$this->addTag($m[1] + 1, 1, $chr);
			}
		}
	}
	protected function parseSymbolsInParentheses()
	{
		$chrs = array(
			'(c)'  => "\xC2\xA9",
			'(r)'  => "\xC2\xAE",
			'(tm)' => "\xE2\x84\xA2"
		);
		$regexp = '/\\((?>c|r|tm)\\)/i';
		\preg_match_all($regexp, $this->text, $matches, \PREG_OFFSET_CAPTURE);
		foreach ($matches[0] as $m)
			$this->addTag($m[1], \strlen($m[0]), $chrs[\strtr($m[0], 'CMRT', 'cmrt')]);
	}
}