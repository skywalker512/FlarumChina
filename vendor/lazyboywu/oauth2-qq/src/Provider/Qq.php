<?php

namespace League\OAuth2\Client\Provider;

use League\OAuth2\Client\Provider\Exception\IdentityProviderException;
use League\OAuth2\Client\Token\AccessToken;
use League\OAuth2\Client\Tool\BearerAuthorizationTrait;
use Psr\Http\Message\ResponseInterface;

class Qq extends AbstractProvider
{
    use BearerAuthorizationTrait;

    /**
     * Domain
     *
     * @var string
     */
    public $domain = 'https://graph.qq.com';

    /**
     * OpenId
     *
     * @see http://wiki.open.qq.com/wiki/website/%E8%8E%B7%E5%8F%96%E7%94%A8%E6%88%B7OpenID_OAuth2.0
     * @var string
     */
    protected $openId;

    /**
     * Get authorization url to begin OAuth flow
     *
     * @return string
     */
    public function getBaseAuthorizationUrl()
    {
        return $this->domain.'/oauth2.0/authorize';
    }

    /**
     * Get access token url to retrieve token
     *
     * @param  array $params
     *
     * @return string
     */
    public function getBaseAccessTokenUrl(array $params)
    {
        return $this->domain.'/oauth2.0/token';
    }

    /**
     * Get open id from access token
     *
     * @param  array $params
     *
     * @return string
     */
    public function getOpenId(AccessToken $token)
    {
        $request = $this->getAuthenticatedRequest(self::METHOD_GET, $this->domain.'/oauth2.0/me?access_token='.(string)$token);

        $response = $this->getResponse($request);

        return isset($response['openid']) ? $response['openid'] : null;
    }

    /**
     * Requests and returns the resource owner of given access token.
     *
     * @param  AccessToken $token
     * @return ResourceOwnerInterface
     */
    public function getResourceOwner(AccessToken $token)
    {
        $this->openId = $this->getOpenId($token);

        return parent::getResourceOwner($token);
    }

    /**
     * Get provider url to fetch user details
     *
     * @param  AccessToken $token
     *
     * @return string
     */
    public function getResourceOwnerDetailsUrl(AccessToken $token)
    {
        return $this->domain.'/user/get_user_info?access_token=' . (string)$token . '&openid=' . $this->openId . '&oauth_consumer_key=' . $this->clientId;
    }

    /**
     * Get the default scopes used by this provider.
     *
     * This should not be a complete list of all scopes, but the minimum
     * required for the provider user interface!
     *
     * @return array
     */
    protected function getDefaultScopes()
    {
        return ['get_user_info'];
    }

    /**
     * Returns an authenticated PSR-7 request instance.
     *
     * @param  string $method
     * @param  string $url
     * @param  null
     * @param  null
     * @return RequestInterface
     */
    public function getAuthenticatedRequest($method, $url, $token = null, array $options = null)
    {
        return $this->getRequestFactory()->getRequest($method, $url);
    }

    /**
     * Parses the response according to its content-type header.
     *
     * @throws UnexpectedValueException
     * @param  ResponseInterface $response
     * @return array
     */
    protected function parseResponse(ResponseInterface $response)
    {
        $content = (string) $response->getBody();

        if(strpos($content, "callback") !== false){
            $lpos = strpos($content, "(");
            $rpos = strrpos($content, ")");
            $content  = substr($content, $lpos + 1, $rpos - $lpos -1);

            return $this->parseJson($content);
        } else if(strpos($content, "access_token=") !== false) {
            $result = array();
            parse_str($content, $result);
            return $result;
        } else {
            return parent::parseResponse($response);
        }
    }

    /**
     * Check a provider response for errors.
     *
     * @link   http://wiki.open.qq.com/wiki/website/%E5%85%AC%E5%85%B1%E8%BF%94%E5%9B%9E%E7%A0%81%E8%AF%B4%E6%98%8E#100000-100031.EF.BC.9APC.E7.BD.91.E7.AB.99.E6.8E.A5.E5.85.A5.E6.97.B6.E7.9A.84.E5.85.AC.E5.85.B1.E8.BF.94.E5.9B.9E.E7.A0.81
     * @throws IdentityProviderException
     * @param  ResponseInterface $response
     * @param  string $data Parsed response data
     * @return void
     */
    protected function checkResponse(ResponseInterface $response, $data)
    {
        if ($response->getStatusCode() != 200) {
            throw new IdentityProviderException(
                'can not access',
                0,
                $response
            );
        }

        if (isset($data['code']) || isset($data['ret'])) {
            // fix code to ret
            $data['ret'] = isset($data['code']) ? $data['code'] : $data['ret'];

            if ($data['ret'] > 0) {
                throw new IdentityProviderException(
                    $data['msg'],
                    $data['ret'],
                    $response
                );
            }
        }

    }

    /**
     * Generate a user object from a successful user details request.
     *
     * @param array $response
     * @param AccessToken $token
     * @return League\OAuth2\Client\Provider\ResourceOwnerInterface
     */
    protected function createResourceOwner(array $response, AccessToken $token)
    {
        $user = new QqResourceOwner($response);

        $user->setOpenId($this->openId);

        return $user;
    }
}
