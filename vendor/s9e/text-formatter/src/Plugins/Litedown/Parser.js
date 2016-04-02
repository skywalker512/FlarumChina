var hasEscapedChars, links, startTagLen, startTagPos, endTagPos, endTagLen;

// Unlike the PHP parser, init() must not take an argument
init();

// Match block-level markup as well as forced line breaks
matchBlockLevelMarkup();

// Inline code must be done first to avoid false positives in other markup
matchInlineCode();

// Images must be matched before links
matchImages();

// Do the rest of inline markup
matchLinks();
matchStrikethrough();
matchSuperscript();
matchEmphasis();
matchForcedLineBreaks();

/**
* Close a list at given offset
*
* @param  {!Array}  list
* @param  {!number} textBoundary
*/
function closeList(list, textBoundary)
{
	addEndTag('LIST', textBoundary, 0).pairWith(list.listTag);
	addEndTag('LI',   textBoundary, 0).pairWith(list.itemTag);

	if (list.tight)
	{
		list.itemTags.forEach(function(itemTag)
		{
			itemTag.removeFlags(RULE_CREATE_PARAGRAPHS);
		});
	}
}

/**
* Compute the amount of text to ignore at the start of a quote line
*
* @param  {!string} str           Original quote markup
* @param  {!number} maxQuoteDepth Maximum quote depth
* @return {!number}               Number of characters to ignore
*/
function computeQuoteIgnoreLen(str, maxQuoteDepth)
{
	var remaining = str;
	while (--maxQuoteDepth >= 0)
	{
		remaining = remaining.replace(/^ *> ?/, '');
	}

	return str.length - remaining.length;
}

/**
* Decode a chunk of encoded text to be used as an attribute value
*
* Decodes escaped literals and removes slashes and 0x1A characters
*
* @param  {!string}  str Encoded text
* @return {!string}      Decoded text
*/
function decode(str)
{
	if (HINT.LITEDOWN_DECODE_HTML_ENTITIES && config.decodeHtmlEntities && str.indexOf('&') > -1)
	{
		str = html_entity_decode(str);
	}
	str = str.replace(/[\\\x1A]/g, '');

	if (hasEscapedChars)
	{
		str = str.replace(
			/\x1B./g,
			function (seq)
			{
				return {
					"\x1B0": '!', "\x1B1": '"',  "\x1B2": ')', "\x1B3": '*',
					"\x1B4": '[', "\x1B5": '\\', "\x1B6": ']', "\x1B7": '^',
					"\x1B8": '_', "\x1B9": '`',  "\x1BA": '~'
				}[seq];
			}
		);
	}

	return str;
}

/**
* Decode the optional attribute portion of a link
*
* @param  {!string} str Encoded string, possibly surrounded by quotes and whitespace
* @return {!string}     Decoded string
*/
function decodeQuotedString(str)
{
	return decode(str.replace(/^\s*(.*?)\s*$/, '$1').replace(/^(['"])(.*)\1$/, '$2'));
}

/**
* Encode escaped literals that have a special meaning
*
* @param  {!string}  str Original text
* @return {!string}      Encoded text
*/
function encode(str)
{
	return str.replace(
		/\\[!")*[\\\]^_`~]/g,
		function (str)
		{
			return {
				'\\!': "\x1B0", '\\"': "\x1B1", '\\)':  "\x1B2",
				'\\*': "\x1B3", '\\[': "\x1B4", '\\\\': "\x1B5",
				'\\]': "\x1B6", '\\^': "\x1B7", '\\_':  "\x1B8",
				'\\`': "\x1B9", '\\~': "\x1BA"
			}[str];
		}
	);
}

/**
* Return the length of the markup at the end of an ATX header
*
* @param  {!number} startPos Start of the header's text
* @param  {!number} endPos   End of the header's text
* @return {!number}
*/
function getAtxHeaderEndTagLen(startPos, endPos)
{
	var content = text.substr(startPos, endPos - startPos),
		m = /[ \t]*#*[ \t]*$/.exec(content);

	return m[0].length;
}

/**
* Get emphasis markup split by block
*
* @param  {!RegExp} regexp Regexp used to match emphasis
* @param  {!number} pos    Position in the text of the first emphasis character
* @return {!Array}         Each array contains a list of [matchPos, matchLen] pairs
*/
function getEmphasisByBlock(regexp, pos)
{
	var block    = [],
		blocks   = [],
		breakPos = breakPos  = text.indexOf("\x17", pos),
		m;

	regexp.lastIndex = pos;
	while (m = regexp.exec(text))
	{
		var matchPos = m['index'],
			matchLen = m[0].length;

		// Test whether we've just passed the limits of a block
		if (matchPos > breakPos)
		{
			blocks.push(block);
			block    = [];
			breakPos = text.indexOf("\x17", matchPos);
		}

		// Test whether we should ignore this markup
		if (!ignoreEmphasis(matchPos, matchLen))
		{
			block.push([matchPos, matchLen]);
		}
	}
	blocks.push(block);

	return blocks;
}

/**
* Get the attribute values of an inline link or image
*
* @param  {!Object}         m Regexp captures
* @return {!Array<!string>}   List of attribute values
*/
function getInlineLinkAttributes(m)
{
	var attrValues = [decode(m[3])];
	if (m[4])
	{
		var title = decodeQuotedString(m[4]);
		if (title > '')
		{
			attrValues.push(title);
		}
	}

	return attrValues;
}

/**
* Get the attribute values from given reference
*
* @param  {!string}          label Link label
* @return {!Array.<!string>}
*/
function getReferenceLinkAttributes(label)
{
	if (typeof links === 'undefined')
	{
		matchLinkReferences();
	}

	label = label.toLowerCase();

	return links[label] || [];
}

/**
* Capture lines that contain a Setext-tyle header
*
* @return {!Object}
*/
function getSetextLines()
{
	var setextLines = {};

	// Capture the underlines used for Setext-style headers
	if (text.indexOf('-') === -1 && text.indexOf('=') === -1)
	{
		return setextLines;
	}

	// Capture the any series of - or = alone on a line, optionally preceded with the
	// angle brackets notation used in blockquotes
	var m, regexp = /^(?=[-=>])(?:> ?)*(?=[-=])(?:-+|=+) *$/gm;

	while (m = regexp.exec(text))
	{
		var match    = m[0],
			matchPos = m['index'];

		// Compute the position of the end tag. We start on the LF character before the
		// match and keep rewinding until we find a non-space character
		var endTagPos = matchPos - 1;
		while (endTagPos > 0 && text[endTagPos - 1] === ' ')
		{
			--endTagPos;
		}

		// Store at the offset of the LF character
		setextLines[matchPos - 1] = {
			endTagLen  : matchPos + match.length - endTagPos,
			endTagPos  : endTagPos,
			quoteDepth : match.length - match.replace(/>/g, '').length,
			tagName    : (match.charAt(0) === '=') ? 'H1' : 'H2'
		};
	}

	return setextLines;
}

/**
* Test whether emphasis should be ignored at the given position in the text
*
* @param  {!number}  matchPos Position of the emphasis in the text
* @param  {!number}  matchLen Length of the emphasis
* @return {!boolean}
*/
function ignoreEmphasis(matchPos, matchLen)
{
	// Ignore single underscores between alphanumeric characters
	if (text[matchPos] === '_' && matchLen === 1 && isSurroundedByAlnum(matchPos, matchLen))
	{
		return true;
	}

	return false;
}

/**
* Initialize this parser
*/
function init()
{
	if (text.indexOf('\\') < 0)
	{
		hasEscapedChars = false;
	}
	else
	{
		hasEscapedChars = true;

		// Encode escaped literals that have a special meaning otherwise, so that we don't have
		// to take them into account in regexps
		text = encode(text);
	}

	// We append a couple of lines and a non-whitespace character at the end of the text in
	// order to trigger the closure of all open blocks such as quotes and lists
	text += "\n\n\x17";

	links = undefined;
}

/**
* Test whether given character is alphanumeric
*
* @param  {!string}  chr
* @return {!boolean}
*/
function isAlnum(chr)
{
	return (' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.indexOf(chr) > 0);
}

/**
* Test whether a length of text is surrounded by alphanumeric characters
*
* @param  {!number}  matchPos Start of the text
* @param  {!number}  matchLen Length of the text
* @return {!boolean}
*/
function isSurroundedByAlnum(matchPos, matchLen)
{
	return (matchPos > 0 && isAlnum(text[matchPos - 1]) && isAlnum(text[matchPos + matchLen]));
}

/**
* Mark the boundary of a block in the original text
*
* @param {!number} pos
*/
function markBoundary(pos)
{
	text = text.substr(0, pos) + "\x17" + text.substr(pos + 1);
}

/**
* Match block-level markup, as well as forced line breaks and headers
*/
function matchBlockLevelMarkup()
{
	var codeFence,
		codeIndent   = 4,
		codeTag,
		lineIsEmpty  = true,
		lists        = [],
		listsCnt     = 0,
		newContext   = false,
		quotes       = [],
		quotesCnt    = 0,
		setextLines  = getSetextLines(),
		textBoundary = 0,
		breakParagraph,
		continuation,
		endTag,
		ignoreLen,
		indentStr,
		indentLen,
		lfPos,
		listIndex,
		maxIndent,
		minIndent,
		quoteDepth,
		tagPos,
		tagLen;

	// Capture all the lines at once so that we can overwrite newlines safely, without preventing
	// further matches
	var matches = [],
		m,
		regexp = /^(?:(?=[-*+\d \t>`~#_])((?: {0,3}> ?)+)?([ \t]+)?(\* *\* *\*[* ]*$|- *- *-[- ]*$|_ *_ *_[_ ]*$)?((?:[-*+]|\d+\.)[ \t]+(?=\S))?[ \t]*(#{1,6}[ \t]+|```+[^`\n]*$|~~~+[^~\n]*$)?)?/gm;
	while (m = regexp.exec(text))
	{
		matches.push(m);

		// Move regexp.lastIndex if the current match is empty
		if (m['index'] === regexp['lastIndex'])
		{
			++regexp['lastIndex'];
		}
	}

	matches.forEach(function(m)
	{
		var matchPos = m['index'],
			matchLen = m[0].length;

		ignoreLen  = 0;
		quoteDepth = 0;

		// If the last line was empty then this is not a continuation, and vice-versa
		continuation = !lineIsEmpty;

		// Capture the position of the end of the line and determine whether the line is empty
		lfPos       = text.indexOf("\n", matchPos);
		lineIsEmpty = (lfPos === matchPos + matchLen && !m[3] && !m[4] && !m[5]);

		// If the match is empty we need to move the cursor manually
		if (!matchLen)
		{
			++regexp.lastIndex;
		}

		// If the line is empty and it's the first empty line then we break current paragraph.
		breakParagraph = (lineIsEmpty && continuation);

		// Count quote marks
		if (m[1])
		{
			quoteDepth = m[1].length - m[1].replace(/>/g, '').length;
			ignoreLen  = m[1].length;
			if (codeTag && codeTag.hasAttribute('quoteDepth'))
			{
				quoteDepth = Math.min(quoteDepth, codeTag.getAttribute('quoteDepth'));
				ignoreLen  = computeQuoteIgnoreLen(m[1], quoteDepth);
			}
		}

		// Close supernumerary quotes
		if (quoteDepth < quotesCnt && !continuation && !lineIsEmpty)
		{
			newContext = true;

			do
			{
				addEndTag('QUOTE', textBoundary, 0).pairWith(quotes.pop());
			}
			while (quoteDepth < --quotesCnt);
		}

		// Open new quotes
		if (quoteDepth > quotesCnt && !lineIsEmpty)
		{
			newContext = true;

			do
			{
				var tag = addStartTag('QUOTE', matchPos, 0);
				tag.setSortPriority(quotesCnt);

				quotes.push(tag);
			}
			while (quoteDepth > ++quotesCnt);
		}

		// Compute the width of the indentation
		var indentWidth = 0,
			indentPos   = 0;
		if (m[2] && !codeFence)
		{
			indentStr = m[2];
			indentLen = indentStr.length;

			do
			{
				if (indentStr.charAt(indentPos) === ' ')
				{
					++indentWidth;
				}
				else
				{
					indentWidth = (indentWidth + 4) & ~3;
				}
			}
			while (++indentPos < indentLen && indentWidth < codeIndent);
		}

		// Test whether we're out of a code block
		if (codeTag && !codeFence && indentWidth < codeIndent && !lineIsEmpty)
		{
			newContext = true;
		}

		if (newContext)
		{
			newContext = false;

			// Close the code block if applicable
			if (codeTag)
			{
				// Overwrite the whole block
				overwrite(codeTag.getPos(), textBoundary - codeTag.getPos());

				endTag = addEndTag('CODE', textBoundary, 0);
				endTag.pairWith(codeTag);
				endTag.setSortPriority(-1);
				codeTag = null;
				codeFence = null;
			}

			// Close all the lists
			lists.forEach(function(list)
			{
				closeList(list, textBoundary);
			});
			lists    = [];
			listsCnt = 0;

			// Mark the block boundary
			if (matchPos)
			{
				markBoundary(matchPos - 1);
			}
		}

		if (indentWidth >= codeIndent)
		{
			if (codeTag || !continuation)
			{
				// Adjust the amount of text being ignored
				ignoreLen = (m[1] || '').length + indentPos;

				if (!codeTag)
				{
					// Create code block
					codeTag = addStartTag('CODE', matchPos + ignoreLen, 0);
				}

				// Clear the captures to prevent any further processing
				m = {};
			}
		}
		else
		{
			var hasListItem = !!m[4];

			if (!indentWidth && !continuation && !hasListItem && !lineIsEmpty)
			{
				// Start of a new paragraph
				listIndex = -1;
			}
			else if (continuation && !hasListItem)
			{
				// Continuation of current list item or paragraph
				listIndex = listsCnt - 1;
			}
			else if (!listsCnt)
			{
				// We're not inside of a list already, we can start one if there's a list item
				// and it's either not in continuation of a paragraph or immediately after a
				// block
				if (hasListItem && (!continuation || text.charAt(matchPos - 1) === "\x17"))
				{
					// Start of a new list
					listIndex = 0;
				}
				else
				{
					// We're in a normal paragraph
					listIndex = -1;
				}
			}
			else
			{
				// We're inside of a list but we need to compute the depth
				listIndex = 0;
				while (listIndex < listsCnt && indentWidth > lists[listIndex].maxIndent)
				{
					++listIndex;
				}
			}

			// Close deeper lists
			while (listIndex < listsCnt - 1)
			{
				closeList(lists.pop(), textBoundary);
				--listsCnt;
			}

			// If there's no list item at current index, we'll need to either create one or
			// drop down to previous index, in which case we have to adjust maxIndent
			if (listIndex === listsCnt && !hasListItem)
			{
				--listIndex;
			}

			if (hasListItem && listIndex >= 0)
			{
				breakParagraph = true;

				// Compute the position and amount of text consumed by the item tag
				tagPos = matchPos + ignoreLen + indentPos
				tagLen = m[4].length;

				// Create a LI tag that consumes its markup
				var itemTag = addStartTag('LI', tagPos, tagLen);

				// Overwrite the markup
				overwrite(tagPos, tagLen);

				// If the list index is within current lists count it means this is not a new
				// list and we have to close the last item. Otherwise, it's a new list that we
				// have to create
				if (listIndex < listsCnt)
				{
					addEndTag('LI', textBoundary, 0).pairWith(lists[listIndex].itemTag);

					// Record the item in the list
					lists[listIndex].itemTag = itemTag;
					lists[listIndex].itemTags.push(itemTag);
				}
				else
				{
					++listsCnt;

					if (listIndex)
					{
						minIndent = lists[listIndex - 1].maxIndent + 1;
						maxIndent = Math.max(minIndent, listIndex * 4);
					}
					else
					{
						minIndent = 0;
						maxIndent = indentWidth;
					}

					// Create a 0-width LIST tag right before the item tag LI
					var listTag = addStartTag('LIST', tagPos, 0);

					// Test whether the list item ends with a dot, as in "1."
					if (m[4].indexOf('.') > -1)
					{
						listTag.setAttribute('type', 'decimal');

						var start = +m[4];
						if (start !== 1)
						{
							listTag.setAttribute('start', start);
						}
					}

					// Record the new list depth
					lists.push({
						listTag   : listTag,
						itemTag   : itemTag,
						itemTags  : [itemTag],
						minIndent : minIndent,
						maxIndent : maxIndent,
						tight     : true
					});
				}
			}

			// If we're in a list, on a non-empty line preceded with a blank line...
			if (listsCnt && !continuation && !lineIsEmpty)
			{
				// ...and this is not the first item of the list...
				if (lists[0].itemTags.length > 1 || !hasListItem)
				{
					// ...every list that is currently open becomes loose
					lists.forEach(function(list)
					{
						list.tight = false;
					});
				}
			}

			codeIndent = (listsCnt + 1) * 4;
		}

		if (m[5])
		{
			// Headers
			if (m[5].charAt(0) === '#')
			{
				startTagLen = m[5].length;
				startTagPos = matchPos + matchLen - startTagLen;
				endTagLen   = getAtxHeaderEndTagLen(matchPos + matchLen, lfPos);
				endTagPos   = lfPos - endTagLen;

				addTagPair('H' + /#{1,6}/.exec(m[5])[0].length, startTagPos, startTagLen, endTagPos, endTagLen);

				// Mark the start and the end of the header as boundaries
				markBoundary(startTagPos);
				markBoundary(lfPos);

				if (continuation)
				{
					breakParagraph = true;
				}
			}
			// Code fence
			else if (m[5].charAt(0) === '`' || m[5].charAt(0) === '~')
			{
				tagPos = matchPos + ignoreLen;
				tagLen = lfPos - tagPos;

				if (codeTag && m[5] === codeFence)
				{
					endTag = addEndTag('CODE', tagPos, tagLen);
					endTag.pairWith(codeTag);
					endTag.setSortPriority(-1);

					addIgnoreTag(textBoundary, tagPos - textBoundary);

					// Overwrite the whole block
					overwrite(codeTag.getPos(), tagPos + tagLen - codeTag.getPos());
					codeTag = null;
					codeFence = null;
				}
				else if (!codeTag)
				{
					// Create code block
					codeTag   = addStartTag('CODE', tagPos, tagLen);
					codeFence = m[5].replace(/[^`~]+/, '');
					codeTag.setAttribute('quoteDepth', quoteDepth);

					// Ignore the next character, which should be a newline
					addIgnoreTag(tagPos + tagLen, 1);

					// Add the language if present, e.g. ```php
					var lang = m[5].replace(/^[`~\s]*/, '').replace(/\s+$/, '');
					if (lang !== '')
					{
						codeTag.setAttribute('lang', lang);
					}
				}
			}
		}
		else if (m[3] && !listsCnt && text.charAt(matchPos + matchLen) !== "\x17")
		{
			// Horizontal rule
			addSelfClosingTag('HR', matchPos + ignoreLen, matchLen - ignoreLen);
			breakParagraph = true;

			// Mark the end of the line as a boundary
			markBoundary(lfPos);
		}
		else if (setextLines[lfPos] && setextLines[lfPos].quoteDepth === quoteDepth && !lineIsEmpty && !listsCnt && !codeTag)
		{
			// Setext-style header
			addTagPair(
				setextLines[lfPos].tagName,
				matchPos + ignoreLen,
				0,
				setextLines[lfPos].endTagPos,
				setextLines[lfPos].endTagLen
			);

			// Mark the end of the Setext line
			markBoundary(setextLines[lfPos].endTagPos + setextLines[lfPos].endTagLen);
		}

		if (breakParagraph)
		{
			addParagraphBreak(textBoundary);
			markBoundary(textBoundary);
		}

		if (!lineIsEmpty)
		{
			textBoundary = lfPos;
		}

		if (ignoreLen)
		{
			addIgnoreTag(matchPos, ignoreLen).setSortPriority(1000);
		}
	});
}

/**
* Match all forms of emphasis (emphasis and strong, using underscores or asterisks)
*/
function matchEmphasis()
{
	matchEmphasisByCharacter('*', /\*+/g);
	matchEmphasisByCharacter('_', /_+/g);
}

/**
* Match emphasis and strong applied using given character
*
* @param  {!string} character Markup character, either * or _
* @param  {!RegExp} regexp    Regexp used to match the series of emphasis character
*/
function matchEmphasisByCharacter(character, regexp)
{
	var pos = text.indexOf(character);
	if (pos === -1)
	{
		return;
	}

	getEmphasisByBlock(regexp, pos).forEach(processEmphasisBlock);
}

/**
* Match forced line break
*/
function matchForcedLineBreaks()
{
	var pos = text.indexOf("  \n");
	while (pos !== -1)
	{
		addBrTag(pos + 2);
		pos = text.indexOf("  \n", pos + 3);
	}
}

/**
* Match images markup
*/
function matchImages()
{
	if (text.indexOf('![') === -1)
	{
		return;
	}

	var m, regexp = /!\[([^\x17]*?(?=] ?\()|[^\x17\]]*)](?: ?\[([^\x17\]]+)\]| ?\(([^\x17 ")]+)( *(?:"[^\x17"]*"|\'[^\x17\']*\'|[^\x17\)]*))?\))?/g;
	while (m = regexp.exec(text))
	{
		var matchPos    = m['index'],
			matchLen    = m[0].length,
			contentLen  = m[1].length,
			startTagPos = matchPos,
			startTagLen = 2,
			endTagPos   = startTagPos + startTagLen + contentLen,
			endTagLen   = matchLen - startTagLen - contentLen;

		var tag = addTagPair('IMG', startTagPos, startTagLen, endTagPos, endTagLen);
		tag.setAttribute('alt', decode(m[1]));
		setLinkAttributes(tag, m, ['src', 'title']);

		// Overwrite the markup
		overwrite(matchPos, matchLen);
	}
}

/**
* Match inline code
*/
function matchInlineCode()
{
	if (text.indexOf('`') === -1)
	{
		return;
	}

	var m, regexp = /((`+)(?!`)\s*)(?:[^\x17]*?[^`\s])?(\s*\2)(?!`)/g;
	while (m = regexp.exec(text))
	{
		var matchPos    = m['index'],
			matchLen    = m[0].length,
			startTagLen = m[1].length,
			endTagLen   = m[3].length;

		addTagPair('C', matchPos, startTagLen, matchPos + matchLen - endTagLen, endTagLen);

		// Overwrite the markup
		overwrite(matchPos, matchLen);
	}
}

/**
* Capture link reference definitions in current text
*/
function matchLinkReferences()
{
	links = {};

	var m, regexp = /^(?:> ?)* {0,3}\[([^\x17\]]+)\]: *([^\s\x17]+)([^\n\x17]*)\n?/gm;
	while (m = regexp.exec(text))
	{
		addIgnoreTag(m['index'], m[0].length).setSortPriority(-2);

		// Ignore the reference if it already exists
		var label = m[1].toLowerCase();
		if (links[label])
		{
			continue;
		}

		links[label] = [decode(m[2])];
		var title = decodeQuotedString(m[3]);
		if (title > '')
		{
			links[label].push(title);
		}
	}
}

/**
* Match inline and reference links
*/
function matchLinks()
{
	if (text.indexOf('[') === -1)
	{
		return;
	}

	var m, regexp = /\[([^\x17]*?(?=]\()|[^\x17\]]*)](?: ?\[([^\x17\]]+)\]|\(([^\x17 ()]+(?:\([^\x17 ()]+\)[^\x17 ()]*)*[^\x17 )]*)( *(?:"[^\x17"]*"|\'[^\x17\']*\'|[^\x17\)]*))?\))?/g;
	while (m = regexp.exec(text))
	{
		var matchPos    = m['index'],
			matchLen    = m[0].length,
			contentLen  = m[1].length,
			startTagPos = matchPos,
			startTagLen = 1,
			endTagPos   = startTagPos + startTagLen + contentLen,
			endTagLen   = matchLen - startTagLen - contentLen;

		var tag = addTagPair('URL', startTagPos, startTagLen, endTagPos, endTagLen);
		setLinkAttributes(tag, m, ['url', 'title']);

		// Give the link a slightly better priority to give it precedence over
		// possible BBCodes such as [b](https://en.wikipedia.org/wiki/B)
		tag.setSortPriority(-1);

		// Overwrite the markup without touching the link's text
		overwrite(startTagPos, startTagLen);
		overwrite(endTagPos,   endTagLen);
	}
}

/**
* Match strikethrough
*/
function matchStrikethrough()
{
	if (text.indexOf('~~') === -1)
	{
		return;
	}

	var m, regexp = /~~[^\x17]+?~~/g;
	while (m = regexp.exec(text))
	{
		var match    = m[0],
			matchPos = m['index'],
			matchLen = match.length;

		addTagPair('DEL', matchPos, 2, matchPos + matchLen - 2, 2);
	}
}

/**
* Match superscript
*/
function matchSuperscript()
{
	if (text.indexOf('^') === -1)
	{
		return;
	}

	var m, regexp = /\^[^\x17\s]+/g;
	while (m = regexp.exec(text))
	{
		var match       = m[0],
			matchPos    = m['index'],
			matchLen    = match.length,
			startTagPos = matchPos,
			endTagPos   = matchPos + matchLen;

		var parts = match.split('^');
		parts.shift();

		parts.forEach(function(part)
		{
			addTagPair('SUP', startTagPos, 1, endTagPos, 0);
			startTagPos += 1 + part.length;
		});
	}
}

/**
* Overwrite part of the text with substitution characters ^Z (0x1A)
*
* @param  {!number} pos Start of the range
* @param  {!number} len Length of text to overwrite
*/
function overwrite(pos, len)
{
	text = text.substr(0, pos) + new Array(1 + len).join("\x1A") + text.substr(pos + len);
}

/**
* Process a list of emphasis markup strings
*
* @param {!Array<!Array<!number>>} block List of [matchPos, matchLen] pairs
*/
function processEmphasisBlock(block)
{
	var buffered  = 0,
		emPos     = -1,
		strongPos = -1,
		pair,
		remaining;

	block.forEach(function(pair)
	{
		var matchPos     = pair[0],
			matchLen     = pair[1],
			closeLen     = Math.min(3, matchLen),
			closeEm      = closeLen & buffered & 1,
			closeStrong  = closeLen & buffered & 2,
			emEndPos     = matchPos,
			strongEndPos = matchPos;

		if (buffered > 2 && emPos === strongPos)
		{
			if (closeEm)
			{
				emPos += 2;
			}
			else
			{
				++strongPos;
			}
		}

		if (closeEm && closeStrong)
		{
			if (emPos < strongPos)
			{
				emEndPos += 2;
			}
			else
			{
				++strongEndPos;
			}
		}

		remaining = matchLen;
		if (closeEm)
		{
			--buffered;
			--remaining;
			addTagPair('EM', emPos, 1, emEndPos, 1);
		}
		if (closeStrong)
		{
			buffered  -= 2;
			remaining -= 2;
			addTagPair('STRONG', strongPos, 2, strongEndPos, 2);
		}

		remaining = Math.min(3, remaining);
		if (remaining & 1)
		{
			emPos = matchPos + matchLen - remaining;
		}
		if (remaining & 2)
		{
			strongPos = matchPos + matchLen - remaining;
		}
		buffered += remaining;
	});
}

/**
* Set a URL tag's attributes
*
* @param {!Tag}             tag       URL tag
* @param {!Object}          m         Regexp captures
* @param {!Array.<!string>} attrNames List of attribute names
*/
function setLinkAttributes(tag, m, attrNames)
{
	var attrValues;
	if (m[3])
	{
		attrValues = getInlineLinkAttributes(m);
	}
	else
	{
		var label  = m[2] || m[1];
		attrValues = getReferenceLinkAttributes(label);
	}

	attrValues.forEach(function(attrValue, k)
	{
		tag.setAttribute(attrNames[k], attrValue);
	});
}