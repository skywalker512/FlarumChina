<?php
/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Flarum\Auth\Twitter;

use Flarum\Forum\Controller\AuthenticateUserTrait;
use Flarum\Forum\UrlGenerator;
use Flarum\Http\Controller\ControllerInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Bus\Dispatcher;
use League\OAuth1\Client\Server\Twitter;
use Psr\Http\Message\ServerRequestInterface as Request;
use Zend\Diactoros\Response\RedirectResponse;

class TwitterAuthController implements ControllerInterface
{
    use AuthenticateUserTrait;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var UrlGenerator
     */
    protected $url;

    /**
     * @param SettingsRepositoryInterface $settings
     * @param UrlGenerator $url
     * @param Dispatcher $bus
     */
    public function __construct(SettingsRepositoryInterface $settings, UrlGenerator $url, Dispatcher $bus)
    {
        $this->settings = $settings;
        $this->url = $url;
        $this->bus = $bus;
    }

    /**
     * @param Request $request
     * @param array $routeParams
     * @return \Psr\Http\Message\ResponseInterface|RedirectResponse
     */
    public function handle(Request $request, array $routeParams = [])
    {
        session_start();

        $server = new Twitter(array(
            'identifier'   => $this->settings->get('flarum-auth-twitter.api_key'),
            'secret'       => $this->settings->get('flarum-auth-twitter.api_secret'),
            'callback_uri' => $this->url->toRoute('auth.twitter')
        ));

        if (! isset($_GET['oauth_token']) || ! isset($_GET['oauth_verifier'])) {
            $temporaryCredentials = $server->getTemporaryCredentials();

            $_SESSION['temporary_credentials'] = serialize($temporaryCredentials);
            session_write_close();

            // Second part of OAuth 1.0 authentication is to redirect the
            // resource owner to the login screen on the server.
            $server->authorize($temporaryCredentials);
            exit;
        }

        // Retrieve the temporary credentials we saved before
        $temporaryCredentials = unserialize($_SESSION['temporary_credentials']);

        // We will now retrieve token credentials from the server
        $tokenCredentials = $server->getTokenCredentials($temporaryCredentials, $_GET['oauth_token'], $_GET['oauth_verifier']);

        $user = $server->getUserDetails($tokenCredentials);

        return $this->authenticate(
            ['twitter_id' => $user->uid],
            ['username' => $user->nickname]
        );
    }
}
