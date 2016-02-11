<?php
/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Flarum\Auth\GitHub;

use Flarum\Forum\Controller\AuthenticateUserTrait;
use Flarum\Forum\UrlGenerator;
use Flarum\Http\Controller\ControllerInterface;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Bus\Dispatcher;
use League\OAuth2\Client\Provider\Github;
use Psr\Http\Message\ServerRequestInterface as Request;
use Zend\Diactoros\Response\RedirectResponse;

class GitHubAuthController implements ControllerInterface
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

        $provider = new Github([
            'clientId'     => $this->settings->get('flarum-auth-github.client_id'),
            'clientSecret' => $this->settings->get('flarum-auth-github.client_secret'),
            'redirectUri'  => $this->url->toRoute('auth.github')
        ]);

        if (! isset($_GET['code'])) {
            $authUrl = $provider->getAuthorizationUrl([
                'scope' => ['user:email']
            ]);
            $_SESSION['oauth2state'] = $provider->getState();

            return new RedirectResponse($authUrl);
        } elseif (empty($_GET['state']) || ($_GET['state'] !== $_SESSION['oauth2state'])) {
            unset($_SESSION['oauth2state']);
            echo 'Invalid state.';
            exit;
        }

        $token = $provider->getAccessToken('authorization_code', [
            'code' => $_GET['code']
        ]);

        $owner = $provider->getResourceOwner($token);

        $email = $owner->getEmail();
        $username = preg_replace('/[^a-z0-9-_]/i', '', $owner->getNickname());

        return $this->authenticate(compact('email'), compact('username'));
    }
}
