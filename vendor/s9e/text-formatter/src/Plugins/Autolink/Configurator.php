<?php

/*
* @package   s9e\TextFormatter
* @copyright Copyright (c) 2010-2016 The s9e Authors
* @license   http://www.opensource.org/licenses/mit-license.php The MIT License
*/
namespace s9e\TextFormatter\Plugins\Autolink;
use s9e\TextFormatter\Configurator\Helpers\RegexpBuilder;
use s9e\TextFormatter\Plugins\ConfiguratorBase;
class Configurator extends ConfiguratorBase
{
	protected $attrName = 'url';
	protected $matchWww = \false;
	protected $tagName = 'URL';
	protected function setUp()
	{
		if (isset($this->configurator->tags[$this->tagName]))
			return;
		$tag = $this->configurator->tags->add($this->tagName);
		$filter = $this->configurator->attributeFilters->get('#url');
		$tag->attributes->add($this->attrName)->filterChain->append($filter);
		$tag->template = '<a href="{@' . $this->attrName . '}"><xsl:apply-templates/></a>';
	}
	public function asConfig()
	{
		$anchor = RegexpBuilder::fromList($this->configurator->urlConfig->getAllowedSchemes()) . '://';
		if ($this->matchWww)
			$anchor = '(?:' . $anchor . '|www\.)';
		$config = array(
			'attrName'   => $this->attrName,
			'regexp'     => '#' . $anchor . '\\S(?>[^\\s\\[\\]]*(?>\\[\\w*\\])?)++#iS',
			'tagName'    => $this->tagName
		);
		if (!$this->matchWww)
			$config['quickMatch'] = '://';
		return $config;
	}
}