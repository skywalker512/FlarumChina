matches.forEach(function(m)
{
	var url = m[0][0],
		pos = m[0][1],
		len = url.length,
		tag = addSelfClosingTag('MEDIA', pos, len);

	tag.setAttribute('url', url);

	// Give that tag priority over other tags such as Autolink's
	tag.setSortPriority(-10);
});