/** @const */
var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

matches.forEach(function(m)
{
	// Make sure that the URL is not preceded by an alphanumeric character
	var matchPos = m[0][1];
	if (matchPos > 0 && chars.indexOf(text.charAt(matchPos - 1)) > -1)
	{
		return;
	}

	// Linkify the trimmed URL
	linkifyUrl(matchPos, trimUrl(m[0][0]));
});

/**
* Linkify given URL at given position
*
* @param {!number} tagPos URL's position in the text
* @param {!string} url    URL
*/
function linkifyUrl(tagPos, url)
{
	// Ensure that the anchor (scheme/www) is still there
	if (!/^www\.|^[^:]+:/i.test(url))
	{
		return;
	}

	// Create a zero-width end tag right after the URL
	var endTag = addEndTag(config.tagName, tagPos + url.length, 0);

	// If the URL starts with "www." we prepend "http://"
	if (url.charAt(3) === '.')
	{
		url = 'http://' + url;
	}

	// Create a zero-width start tag right before the URL
	var startTag = addStartTag(config.tagName, tagPos, 0);
	startTag.setAttribute(config.attrName, url);

	// Give this tag a slightly lower priority than default to allow specialized plugins
	// to use the URL instead
	startTag.setSortPriority(1);

	// Pair the tags together
	startTag.pairWith(endTag);
};

/**
* Trim any trailing punctuation from given URL
*
* Removes trailing punctuation and right angle brackets. We preserve right parentheses
* if there's a balanced number of parentheses in the URL, e.g.
*   http://en.wikipedia.org/wiki/Mars_(disambiguation)
*
* @param  {!string} url Original URL
* @return {!string}     Trimmed URL
*/
function trimUrl(url)
{
	// Remove trailing punctuation and right angle brackets. We preserve right parentheses
	// if there's a balanced number of parentheses in the URL, e.g.
	//   http://en.wikipedia.org/wiki/Mars_(disambiguation)
	while (1)
	{
		// We remove some common ASCII punctuation and whitespace. We don't have access to Unicode
		// properties, so we try to cover the most common usage
		url = url.replace(/[\s!"',.<>?]+$/, '');

		if (url.substr(-1) === ')' && url.replace(/[^(]+/g, '').length < url.replace(/[^)]+/g, '').length)
		{
			url = url.substr(0, url.length - 1);
			continue;
		}
		break;
	}

	return url;
}