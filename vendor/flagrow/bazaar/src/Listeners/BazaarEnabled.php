<?php

namespace Flagrow\Bazaar\Listeners;

use Flagrow\Bazaar\Events\TokenSet;
use Flagrow\Bazaar\Search\FlagrowApi;
use Flarum\Event\ConfigureWebApp;
use Flarum\Extension\ExtensionManager;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Psr\Http\Message\ResponseInterface;

class BazaarEnabled
{
    /**
     * @var ExtensionManager
     */
    protected $extensions;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var FlagrowApi
     */
    protected $client;
    /**
     * @var Dispatcher
     */
    protected $events;

    public function __construct(ExtensionManager $extensions, SettingsRepositoryInterface $settings, FlagrowApi $client, Dispatcher $events)
    {
        $this->extensions = $extensions;
        $this->settings = $settings;
        $this->client = $client;
        $this->events = $events;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureWebApp::class, [$this, 'authenticate']);
    }

    /**
     * @param ConfigureWebApp $event
     */
    public function authenticate(ConfigureWebApp $event)
    {
        if (!$event->isAdmin()) {
            return;
        }

        $token = $this->settings->get('flagrow.bazaar.api_token');

        if (empty($token) && $this->extensions->isEnabled('flagrow-bazaar')) {
            $response = $this->client->post('bazaar/beckons');

            $this->storeTokenFromRequest($response);

            $event->view->setVariable('settings', $this->settings->all());
        }
    }

    /**
     * @param ResponseInterface $response
     */
    protected function storeTokenFromRequest(ResponseInterface $response)
    {
        if ($response->getStatusCode() !== 201) {
            return;
        }

        $tokens = $response->getHeader('Access-Token');
        $token = array_pop($tokens);

        if (empty($token)) {
            return;
        }

        $this->settings->set('flagrow.bazaar.api_token', $token);

        $this->events->fire(new TokenSet($token));
    }
}
