<?php namespace League\OAuth2\Client\Provider;

class QqResourceOwner implements ResourceOwnerInterface
{
    /**
     * OpenId
     *
     * @var string
     */
    protected $openId;

    /**
     * Raw response
     *
     * @var array
     */
    protected $response;

    /**
     * Creates new resource owner.
     *
     * @param array  $response
     */
    public function __construct(array $response = array())
    {
        $this->response = $response;
    }

    /**
     * Get resource owner id
     *
     * @return string|null
     */
    public function getId()
    {
        return null;
    }

    /**
     * Get resource owner email
     *
     * @return string|null
     */
    public function getEmail()
    {
        return null;
    }

    /**
     * Get resource owner name
     *
     * @return string|null
     */
    public function getName()
    {
        return null;
    }

    /**
     * Get resource owner nickname
     *
     * @return string|null
     */
    public function getNickname()
    {
        return $this->response['nickname'] ?: null;
    }

    /**
     * Get resource owner OpenID
     *
     * @return string|null
     */
    public function getOpenId()
    {
        return $this->openId;
    }

    /**
     * Get resource owner figure url
     *
     * @return string|null
     */
    public function getFigureUrl()
    {
        return $this->response['figureurl'] ?: null;
    }

    /**
     * Set resource owner OpenID
     *
     * @param  string $openId
     *
     * @return ResourceOwner
     */
    public function setOpenId($openId)
    {
        $this->openId = $openId;
        $this->response['openid'] = $openId;

        return $this;
    }

    /**
     * Return all of the owner details available as an array.
     *
     * @return array
     */
    public function toArray()
    {
        return $this->response;
    }
}
