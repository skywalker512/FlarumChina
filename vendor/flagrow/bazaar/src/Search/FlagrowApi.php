<?php

namespace Flagrow\Bazaar\Search;

use Flarum\Extension\ExtensionManager;
use Flarum\Settings\SettingsRepositoryInterface;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\CurlHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Middleware;
use Illuminate\Support\Arr;
use Psr\Http\Message\ResponseInterface;

/**
 * Class FlagrowApi
 * @package Flagrow\Bazaar\Search
 *
 * @info Contextually binding the Guzzle client wasn't working. Something was very off, this works though.
 */
class FlagrowApi extends Client
{
    /**
     * @var array
     */
    protected static $flarumConfig;

    public function __construct(array $config = [])
    {
        static::$flarumConfig = app('flarum.config');

        $headers = [];

        if ($token = static::getToken()) {
            $headers['Authorization'] = "Bearer $token";
        }

        $stack = new HandlerStack();
        $stack->setHandler(new CurlHandler());

        $this->readBazaarConnectedState($stack);

        parent::__construct(array_merge([
            'handler' => $stack,
            'base_uri' => sprintf("%s/api/", static::getFlagrowHost()),
            'headers' => array_merge([
                'Accept' => 'application/vnd.api+json, application/json',
                'Bazaar-From' => static::getFlarumHost(),
                'Flarum-Version' => app()->version(),
                'Bazaar-Version' => static::getBazaarVersion()
            ], $headers)
        ], $config));
    }

    /**
     * The hostname to connect with Flagrow.io.
     *
     * @return string
     */
    public static function getFlagrowHost()
    {
        return Arr::get(static::$flarumConfig, 'flagrow', 'https://flagrow.io');
    }

    /**
     * The url specified in the config.php.
     *
     * @return string
     */
    public static function getFlarumHost()
    {
        return Arr::get(static::$flarumConfig, 'url');
    }

    /**
     * @return null|string
     */
    public static function getBazaarVersion()
    {
        /** @var ExtensionManager $extensions */
        $extensions = app(ExtensionManager::class);
        $bazaar = $extensions->getExtension('flagrow-bazaar');

        return $bazaar ? $bazaar->getVersion() : null;
    }

    /**
     * Injects updating the connected state for calls to Flagrow.
     *
     * @param HandlerStack $stack
     */
    protected function readBazaarConnectedState(HandlerStack &$stack)
    {
        $stack->push(Middleware::mapResponse(function (ResponseInterface $response) {
            if ($response->getStatusCode() > 200) {
                return $response;
            }

            if ($response->hasHeader('Bazaar-Connected')) {
                app()->make(SettingsRepositoryInterface::class)->set('flagrow.bazaar.connected', 1);
            } else {
                app()->make(SettingsRepositoryInterface::class)->set('flagrow.bazaar.connected', 0);
            }

            return $response;
        }));
    }

    /**
     * @return string|null
     */
    public static function getToken()
    {
        return app()->make(SettingsRepositoryInterface::class)->get('flagrow.bazaar.api_token');
    }
}
