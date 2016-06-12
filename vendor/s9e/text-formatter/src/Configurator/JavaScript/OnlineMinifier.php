<?php

/*
* @package   s9e\TextFormatter
* @copyright Copyright (c) 2010-2016 The s9e Authors
* @license   http://www.opensource.org/licenses/mit-license.php The MIT License
*/
namespace s9e\TextFormatter\Configurator\JavaScript;
use s9e\TextFormatter\Utils\Http;
abstract class OnlineMinifier extends Minifier
{
	public $client;
	public $timeout = 10;
	protected function getHttpClient()
	{
		if (!isset($this->client))
			$this->client = Http::getClient();
		$this->client->timeout = $this->timeout;
		return $this->client;
	}
}