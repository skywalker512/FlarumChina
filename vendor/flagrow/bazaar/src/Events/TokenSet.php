<?php

namespace Flagrow\Bazaar\Events;

class TokenSet
{
    /**
     * @var string
     */
    public $token;

    public function __construct(string $token)
    {
        $this->token = $token;
    }
}
