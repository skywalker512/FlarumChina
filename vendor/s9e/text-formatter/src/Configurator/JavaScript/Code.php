<?php

/*
* @package   s9e\TextFormatter
* @copyright Copyright (c) 2010-2016 The s9e Authors
* @license   http://www.opensource.org/licenses/mit-license.php The MIT License
*/
namespace s9e\TextFormatter\Configurator\JavaScript;
class Code
{
	public $code;
	public function __construct($code)
	{
		$this->code = $code;
	}
	public function __toString()
	{
		return $this->code;
	}
}