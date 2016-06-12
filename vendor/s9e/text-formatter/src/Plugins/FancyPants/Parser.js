var hasSingleQuote = (text.indexOf("'") >= 0),
	hasDoubleQuote = (text.indexOf('"') >= 0);

// Do apostrophes ’ after a letter or at the beginning of a word or a couple of digits
if (hasSingleQuote)
{
	parseSingleQuotes(text);
}

// Do symbols found after a digit:
//  - apostrophe ’ if it's followed by an "s" as in 80's
//  - prime ′ and double prime ″
//  - multiply sign × if it's followed by an optional space and another digit
if (hasSingleQuote || hasDoubleQuote || text.indexOf('x') >= 0)
{
	parseSymbolsAfterDigits(text);
}

// Do quote pairs ‘’ and “” -- must be done separately to handle nesting
if (hasSingleQuote)
{
	parseSingleQuotePairs();
}
if (hasDoubleQuote)
{
	parseDoubleQuotePairs();
}

// Do en dash –, em dash — and ellipsis …
if (text.indexOf('...') >= 0 || text.indexOf('--')  >= 0)
{
	parseDashesAndEllipses();
}

// Do symbols ©, ® and ™
if (text.indexOf('(') >= 0)
{
	parseSymbolsInParentheses();
}

/**
* Add a fancy replacement tag
*
* @param  {!number} tagPos
* @param  {!number} tagLen
* @param  {!string} chr
* @return {!Tag}
*/
function addTag(tagPos, tagLen, chr)
{
	var tag = addSelfClosingTag(config.tagName, tagPos, tagLen);
	tag.setAttribute(config.attrName, chr);

	return tag;
}

/**
* Parse dashes and ellipses
*/
function parseDashesAndEllipses()
{
	var chrs = {
			'--'  : "\u2013",
			'---' : "\u2014",
			'...' : "\u2026"
		},
		regexp = /---?|\.\.\./g,
		m;
	while (m = regexp.exec(text))
	{
		addTag(+m['index'], m[0].length, chrs[m[0]]);
	}
}

/**
* Parse pairs of double quotes
*/
function parseDoubleQuotePairs()
{
	parseQuotePairs('"', /(?:^|\W)".+?"(?!\w)/g, "\u201c", "\u201d");
}

/**
* Parse pairs of quotes
*
* @param {!string} q          ASCII quote character 
* @param {!RegExp} regexp     Regexp used to identify quote pairs
* @param {!string} leftQuote  Fancy replacement for left quote
* @param {!string} rightQuote Fancy replacement for right quote
*/
function parseQuotePairs(q, regexp, leftQuote, rightQuote)
{
	var m;
	while (m = regexp.exec(text))
	{
		var left  = addTag(+m['index'] + m[0].indexOf(q), 1, leftQuote),
			right = addTag(+m['index'] + m[0].length - 1, 1, rightQuote);

		// Cascade left tag's invalidation to the right so that if we skip the left quote,
		// the right quote is left untouched
		left.cascadeInvalidationTo(right);
	}
}

/**
* Parse pairs of single quotes
*/
function parseSingleQuotePairs()
{
	parseQuotePairs("'", /(?:^|\W)'.+?'(?!\w)/g, "\u2018", "\u2019");
}

/**
* Parse single quotes in general
*/
function parseSingleQuotes(text)
{
	var m, regexp = /[a-z]'|(?:^|\s)'(?=[a-z]|[0-9]{2})/gi;
	while (m = regexp.exec(text))
	{
		var tag = addTag(+m['index'] + m[0].indexOf("'"), 1, "\u2019");

		// Give this tag a worse priority than default so that quote pairs take precedence
		tag.setSortPriority(10);
	}
}

/**
* Parse symbols found after digits
*/
function parseSymbolsAfterDigits(text)
{
	var c, chr, m, regexp = /[0-9](?:'s|["']? ?x(?= ?[0-9])|["'])/g;
	while (m = regexp.exec(text))
	{
		// Test for a multiply sign at the end
		if (m[0].charAt(m[0].length - 1) === 'x')
		{
			addTag(+m['index'] + m[0].length - 1, 1, "\u00d7");
		}

		// Test for a apostrophe/prime right after the digit
		c = m[0].charAt(1);
		if (c === "'" || c === '"')
		{
			if (m[0].substr(1, 2) === "'s")
			{
				// 80's -- use an apostrophe
				chr = "\u2019";
			}
			else
			{
				// 12' or 12" -- use a prime
				chr = (c === "'") ? "\u2032" : "\u2033";
			}

			addTag(+m['index'] + 1, 1, chr);
		}
	}
}

/**
* Parse symbols found in parentheses such as (c)
*/
function parseSymbolsInParentheses()
{
	var chrs = {
			'(c)'  : "\u00A9",
			'(r)'  : "\u00AE",
			'(tm)' : "\u2122"
		},
		regexp = /\((?:c|r|tm)\)/gi,
		m;
	while (m = regexp.exec(text))
	{
		addTag(+m['index'], m[0].length, chrs[m[0].toLowerCase()]);
	}
}