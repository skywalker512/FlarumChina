<?php

/*
* @package   s9e\TextFormatter
* @copyright Copyright (c) 2010-2016 The s9e Authors
* @license   http://www.opensource.org/licenses/mit-license.php The MIT License
*/
namespace s9e\TextFormatter\Plugins\MediaEmbed\Configurator;
use DOMDocument;
use DOMElement;
use DOMXPath;
use InvalidArgumentException;
class LiveSiteDefinitionProvider extends SiteDefinitionProvider
{
	protected $path;
	public function __construct($path)
	{
		if (!\file_exists($path) || !\is_dir($path))
			throw new InvalidArgumentException('Invalid site directory');
		$this->path = $path;
	}
	public function getIds()
	{
		$siteIds = array();
		foreach (\glob($this->path . '/*.xml') as $filepath)
			$siteIds[] = \basename($filepath, '.xml');
		return $siteIds;
	}
	protected function getConfigFromXmlFile($filepath)
	{
		$dom = new DOMDocument;
		$dom->load($filepath);
		return $this->getElementConfig($dom->documentElement);
	}
	protected function getElementConfig(DOMElement $element)
	{
		$config = array();
		foreach ($element->attributes as $attribute)
			$config[$attribute->name] = $attribute->value;
		$childNodes = array();
		foreach ($element->childNodes as $childNode)
		{
			if ($childNode->nodeType !== \XML_ELEMENT_NODE)
				continue;
			if (!$childNode->attributes->length && $childNode->childNodes->length === 1)
				$value = $childNode->nodeValue;
			else
				$value = $this->getElementConfig($childNode);
			$childNodes[$childNode->nodeName][] = $value;
		}
		foreach ($childNodes as $nodeName => $childNodes)
			if (\count($childNodes) === 1)
				$config[$nodeName] = \end($childNodes);
			else
				$config[$nodeName] = $childNodes;
		return $config;
	}
	protected function getFilePath($siteId)
	{
		return $this->path . '/' . $siteId . '.xml';
	}
	protected function getSiteConfig($siteId)
	{
		return $this->getConfigFromXmlFile($this->getFilePath($siteId));
	}
	protected function hasSiteConfig($siteId)
	{
		return \file_exists($this->getFilePath($siteId));
	}
}