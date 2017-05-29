<?php

namespace Flagrow\Bazaar\Api\Controllers;

use Flagrow\Bazaar\Search\FlagrowApi;
use Flarum\Http\Controller\ControllerInterface;
use Psr\Http\Message\ServerRequestInterface;

class ConnectController implements ControllerInterface
{
    /**
     * @var FlagrowApi
     */
    private $api;

    function __construct(FlagrowApi $api)
    {
        $this->api = $api;
    }

    /**
     * @param ServerRequestInterface $request
     * @return string
     * @throws \Exception
     */
    public function handle(ServerRequestInterface $request)
    {
        $response = $this->api->get('bazaar/connect');

        if ($response->getStatusCode() == 200) {
            return $response;
        }

        throw new \Exception('Connecting failed');
    }
}
