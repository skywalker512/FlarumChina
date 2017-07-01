<?php
/*
 * Stanley Song <sxhuan@gmail.com>
 */

namespace StanleySong\Auth\Wechat;

use Flarum\Forum\AuthenticationResponseFactory;
use Flarum\Forum\Controller\AbstractOAuth2Controller;
use Flarum\Settings\SettingsRepositoryInterface;
use League\OAuth2\Client\Provider\ResourceOwnerInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Zend\Diactoros\Response\RedirectResponse;
use Henter\WeChat\OAuth;

class WechatAuthController extends AbstractOAuth2Controller
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param AuthenticationResponseFactory $authResponse
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(AuthenticationResponseFactory $authResponse, SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
        $this->authResponse = $authResponse;
    }


    /**
     * override
     * @param Request $request
     * @return \Psr\Http\Message\ResponseInterface|RedirectResponse
     */
    public function handle(Request $request)
    {
        $callback_url = $this->settings->get('stanleysong-auth-wechat.callback_url');
        $this->provider = $this->getProvider($callback_url);
        $session = $request->getAttribute('session');
        $code = $_GET['code'];
        if (!isset($_GET['code'])) {
            if ($this->is_wechat_open()) {
                $url = $this->provider->getWeChatAuthorizeURL($callback_url);
            } else {
                $url = $this->provider->getAuthorizeURL($callback_url);
            }

            $_SESSION['oauth2state'] = $this->generateRandomString();
            $session->set('oauth2state', $_SESSION['oauth2state']);

            return new RedirectResponse($url.'&state='.$_SESSION['oauth2state'].'&display=popup');
        }  elseif (empty($_GET['state']) || (isset($_SESSION['oauth2state']) && $_GET['state'] !== $_SESSION['oauth2state'])) {
            $session->forget('oauth2state');
            if (isset($_SESSION['oauth2state'])) {
                unset($_SESSION['oauth2state']);
            }   
            exit('Invalid state. Please close the window and try again.');
        }  else {
            /* wait redirect back */
            if($access_token = $this->provider->getAccessToken('code', $code)){
                $refresh_token = $this->provider->getRefreshToken();
                $expires_in = $this->provider->getExpiresIn();
                $openid = $this->provider->getOpenid();
                $access_token = $this->provider->refreshAccessToken($refresh_token);

                $this->provider = new OAuth($appid, $appkey, $access_token);
                $userinfo = $this->provider->api('sns/userinfo', array('openid'=>$openid));
            }else{
                echo $this->provider->error();
            }
        }

        $identification = $this->getId($userinfo);
        $suggestions = $this->getSuggestion($userinfo);

        return $this->authResponse->make($request, $identification, $suggestions);
    }

    /**
     * {@inheritdoc}
     */
    protected function getProvider($redirectUri)
    {
        $appid = $this->settings->get('stanleysong-auth-wechat.app_id');
        $appkey = $this->settings->get('stanleysong-auth-wechat.app_secret');
        return new OAuth($appid, $appkey);
    }

    /**
     * {@inheritdoc}
     */
    protected function getAuthorizationUrlOptions()
    {
        return null;
    }

    /**
     * {@inheritdoc}
     */
    protected function getIdentification(ResourceOwnerInterface $resourceOwner)
    {
        return null;
    }

    /**
     * {@inheritdoc}
     */
    protected function getSuggestions(ResourceOwnerInterface $resourceOwner)
    {
        return null;
    }

    /* customize */
    protected function getId($userinfo)
    {
        return [
            'email' => $userinfo['openid'].'@change2uremail.com'
        ];
    }

    protected function getSuggestion($userinfo)
    {
        $username = preg_replace('/[^a-z0-9-_]/i', '', $userinfo['nickname']);
        if ($username == '')
        {
            $username = $userinfo['openid'];
        }
        return [
            'username' =>  $username,
            'avatarUrl' => $userinfo['headimgurl']
        ];
    }

    protected function generateRandomString($length = 32) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    protected function is_wechat_open()
    {
        if (strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false) {
            return true;
        } else {
            return false;
        }
    }
}
