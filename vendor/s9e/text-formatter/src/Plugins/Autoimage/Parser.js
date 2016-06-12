var tagName  = config.tagName,
	attrName = config.attrName;

matches.forEach(function(m)
{
	var tag = addSelfClosingTag(tagName, m[0][1], m[0][0].length);
	tag.setAttribute(attrName, m[0][0]);
	tag.setSortPriority(-1);
});