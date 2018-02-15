<?php

namespace Flagrow\Analytics\Piwik;

class RawExpression
{
    public $value;

    public function __construct($value)
    {
        $this->value = $value;
    }
}
