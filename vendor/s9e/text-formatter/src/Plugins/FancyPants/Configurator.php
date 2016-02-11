<?php

/*
* @package   s9e\TextFormatter
* @copyright Copyright (c) 2010-2016 The s9e Authors
* @license   http://www.opensource.org/licenses/mit-license.php The MIT License
*/
namespace s9e\TextFormatter\Plugins\FancyPants;
use s9e\TextFormatter\Plugins\ConfiguratorBase;
class Configurator extends ConfiguratorBase
{
	protected $attrName = 'char';
	protected $tagName = 'FP';
	protected function setUp()
	{
		if (isset($this->configurator->tags[$this->tagName]))
			return;
		$tag = $this->configurator->tags->add($this->tagName);
		$tag->attributes->add($this->attrName);
		$tag->template
			= '<xsl:value-of select="@' . \htmlspecialchars($this->attrName) . '"/>';
	}
	public function asConfig()
	{
		return array(
			'attrName' => $this->attrName,
			'tagName'  => $this->tagName
		);
	}
}