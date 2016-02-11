<?php

/*
* @package   s9e\TextFormatter
* @copyright Copyright (c) 2010-2016 The s9e Authors
* @license   http://www.opensource.org/licenses/mit-license.php The MIT License
*/
namespace s9e\TextFormatter\Plugins\MediaEmbed\Configurator;
use InvalidArgumentException;
use RuntimeException;
abstract class SiteDefinitionProvider
{
	public function get($siteId)
	{
		$siteId = $this->normalizeId($siteId);
		if (!$this->hasSiteConfig($siteId))
			throw new RuntimeException("Unknown media site '" . $siteId . "'");
		return $this->getSiteConfig($siteId);
	}
	abstract public function getIds();
	public function has($siteId)
	{
		return $this->hasSiteConfig($this->normalizeId($siteId));
	}
	abstract protected function getSiteConfig($siteId);
	abstract protected function hasSiteConfig($siteId);
	protected function normalizeId($siteId)
	{
		$siteId = \strtolower($siteId);
		if (!\preg_match('(^[a-z0-9]+$)', $siteId))
			throw new InvalidArgumentException('Invalid site ID');
		return $siteId;
	}
}