<?php

namespace League\OAuth2\Client\Test\Provider;

use Mockery as m;
use League\OAuth2\Client\Provider\Facebook;
use League\OAuth2\Client\Token\AccessToken;
use League\OAuth2\Client\Provider\Exception\IdentityProviderException;

class FooFacebookProvider extends Facebook
{
    protected function fetchResourceOwnerDetails(AccessToken $token)
    {
        return json_decode('{"id": 12345, "name": "mock_name", "username": "mock_username", "first_name": "mock_first_name", "last_name": "mock_last_name", "email": "mock_email", "Location": "mock_home", "bio": "mock_description", "link": "mock_facebook_url"}', true);
    }
}

class FacebookTest extends \PHPUnit_Framework_TestCase
{
    /**
     * @const string The version of the Graph API we want to use for tests.
     */
    const GRAPH_API_VERSION = 'v2.3';

    /**
     * @var Facebook
     */
    protected $provider;

    protected function setUp()
    {
        $this->provider = new Facebook([
            'clientId' => 'mock_client_id',
            'clientSecret' => 'mock_secret',
            'redirectUri' => 'none',
            'graphApiVersion' => static::GRAPH_API_VERSION,
        ]);
    }

    public function tearDown()
    {
        m::close();
        parent::tearDown();
    }

    public function testAuthorizationUrl()
    {
        $url = $this->provider->getAuthorizationUrl();
        $uri = parse_url($url);
        parse_str($uri['query'], $query);

        $this->assertArrayHasKey('client_id', $query);
        $this->assertArrayHasKey('redirect_uri', $query);
        $this->assertArrayHasKey('state', $query);
        $this->assertArrayHasKey('scope', $query);
        $this->assertArrayHasKey('response_type', $query);
        $this->assertArrayHasKey('approval_prompt', $query);
        $this->assertNotNull($this->provider->getState());
    }

    public function testGetBaseAccessTokenUrl()
    {
        $url = $this->provider->getBaseAccessTokenUrl([]);
        $uri = parse_url($url);
        $graphVersion = static::GRAPH_API_VERSION;

        $this->assertEquals('/'.$graphVersion.'/oauth/access_token', $uri['path']);
    }

    public function testGraphApiVersionCanBeCustomized()
    {
        $graphVersion = 'v13.37';
        $provider = new Facebook([
            'graphApiVersion' => $graphVersion,
        ]);
        $fooToken = new AccessToken(['access_token' => 'foo_token']);

        $urlAuthorize = $provider->getBaseAuthorizationUrl();
        $urlAccessToken = $provider->getBaseAccessTokenUrl([]);
        $urlUserDetails = parse_url($provider->getResourceOwnerDetailsUrl($fooToken), PHP_URL_PATH);

        $this->assertEquals('https://www.facebook.com/'.$graphVersion.'/dialog/oauth', $urlAuthorize);
        $this->assertEquals('https://graph.facebook.com/'.$graphVersion.'/oauth/access_token', $urlAccessToken);
        $this->assertEquals('/'.$graphVersion.'/me', $urlUserDetails);
    }

    public function testGraphApiVersionWillFallbackToDefault()
    {
        $graphVersion = static::GRAPH_API_VERSION;
        $fooToken = new AccessToken(['access_token' => 'foo_token']);

        $urlAuthorize = $this->provider->getBaseAuthorizationUrl();
        $urlAccessToken = $this->provider->getBaseAccessTokenUrl([]);
        $urlUserDetails = parse_url($this->provider->getResourceOwnerDetailsUrl($fooToken), PHP_URL_PATH);

        $this->assertEquals('https://www.facebook.com/'.$graphVersion.'/dialog/oauth', $urlAuthorize);
        $this->assertEquals('https://graph.facebook.com/'.$graphVersion.'/oauth/access_token', $urlAccessToken);
        $this->assertEquals('/'.$graphVersion.'/me', $urlUserDetails);
    }

    public function testTheBetaTierCanBeEnabled()
    {
        $provider = new Facebook([
          'graphApiVersion' => 'v0.0',
          'enableBetaTier' => true,
        ]);
        $fooToken = new AccessToken(['access_token' => 'foo_token']);

        $urlAuthorize = parse_url($provider->getBaseAuthorizationUrl(), PHP_URL_HOST);
        $urlAccessToken = parse_url($provider->getBaseAccessTokenUrl([]), PHP_URL_HOST);
        $urlUserDetails = parse_url($provider->getResourceOwnerDetailsUrl($fooToken), PHP_URL_HOST);

        $this->assertEquals('www.beta.facebook.com', $urlAuthorize);
        $this->assertEquals('graph.beta.facebook.com', $urlAccessToken);
        $this->assertEquals('graph.beta.facebook.com', $urlUserDetails);
    }

    public function testGetAccessToken()
    {
        $response = m::mock('Psr\Http\Message\ResponseInterface');
        $response->shouldReceive('getHeader')
            ->times(1)
            ->andReturn('application/json');
        $response->shouldReceive('getBody')
            ->times(1)
            ->andReturn('{"access_token":"mock_access_token","token_type":"bearer","expires_in":3600}');

        $client = m::mock('GuzzleHttp\ClientInterface');
        $client->shouldReceive('send')->times(1)->andReturn($response);
        $this->provider->setHttpClient($client);

        $token = $this->provider->getAccessToken('authorization_code', ['code' => 'mock_authorization_code']);

        $this->assertEquals('mock_access_token', $token->getToken());
        $this->assertLessThanOrEqual(time() + 3600, $token->getExpires());
        $this->assertGreaterThanOrEqual(time(), $token->getExpires());
        $this->assertNull($token->getRefreshToken(), 'Facebook does not support refresh tokens. Expected null.');
        $this->assertNull($token->getResourceOwnerId(), 'Facebook does not return user ID with access token. Expected null.');
    }

    public function testCanGetALongLivedAccessTokenFromShortLivedOne()
    {
        $response = m::mock('Psr\Http\Message\ResponseInterface');
        $response->shouldReceive('getHeader')
            ->times(1)
            ->andReturn('application/json');
        $response->shouldReceive('getBody')
            ->times(1)
            ->andReturn('{"access_token":"long-lived-token","token_type":"bearer","expires_in":3600}');

        $client = m::mock('GuzzleHttp\ClientInterface');
        $client->shouldReceive('send')->times(1)->andReturn($response);
        $this->provider->setHttpClient($client);

        $token = $this->provider->getLongLivedAccessToken('short-lived-token');

        $this->assertEquals('long-lived-token', $token->getToken());
    }

    /**
     * @expectedException \League\OAuth2\Client\Provider\Exception\FacebookProviderException
     */
    public function testTryingToRefreshAnAccessTokenWillThrow()
    {
        $this->provider->getAccessToken('foo', ['refresh_token' => 'foo_token']);
    }

    public function testScopes()
    {
        $this->assertEquals(['public_profile', 'email'], $this->provider->getDefaultScopes());
    }

    public function testUserData()
    {
        $provider = new FooFacebookProvider([
          'graphApiVersion' => static::GRAPH_API_VERSION,
        ]);

        $token = m::mock('League\OAuth2\Client\Token\AccessToken');
        $user = $provider->getResourceOwner($token);

        $this->assertEquals(12345, $user->getId($token));
        $this->assertEquals('mock_name', $user->getName($token));
        $this->assertEquals('mock_first_name', $user->getFirstName($token));
        $this->assertEquals('mock_last_name', $user->getLastName($token));
        $this->assertEquals('mock_email', $user->getEmail($token));
    }

    /**
     * @expectedException \InvalidArgumentException
     */
    public function testNotSettingADefaultGraphApiVersionWillThrow()
    {
        new Facebook([
          'clientId' => 'mock_client_id',
          'clientSecret' => 'mock_secret',
          'redirectUri' => 'none',
        ]);
    }

    public function testOldVersionsOfGraphWillParseStringResponse()
    {
        $provider = new Facebook([
          'clientId' => 'mock_client_id',
          'clientSecret' => 'mock_secret',
          'redirectUri' => 'none',
          'graphApiVersion' => 'v2.2',
        ]);

        $response = m::mock('Psr\Http\Message\ResponseInterface');
        $response->shouldReceive('getHeader')
                 ->times(1)
                 ->andReturn('application/x-www-form-urlencoded');
        $response->shouldReceive('getBody')
                 ->times(1)
                 ->andReturn('access_token=mock_access_token&expires=3600&refresh_token=mock_refresh_token');

        $client = m::mock('GuzzleHttp\ClientInterface');
        $client->shouldReceive('send')->times(1)->andReturn($response);
        $provider->setHttpClient($client);

        $token = $provider->getAccessToken('authorization_code', ['code' => 'mock_authorization_code']);

        $this->assertEquals('mock_access_token', $token->getToken());
        $this->assertLessThanOrEqual(time() + 3600, $token->getExpires());
        $this->assertGreaterThanOrEqual(time(), $token->getExpires());
        $this->assertEquals('mock_refresh_token', $token->getRefreshToken());
    }

    public function testProperlyHandlesErrorResponses()
    {
        $postResponse = m::mock('Psr\Http\Message\ResponseInterface');
        $postResponse->shouldReceive('getHeader')
                 ->times(1)
                 ->andReturn('application/json');
        $postResponse->shouldReceive('getBody')
                     ->times(1)
                     ->andReturn('{"error":{"message":"Foo auth error","type":"OAuthException","code":191}}');

        $client = m::mock('GuzzleHttp\ClientInterface');
        $client->shouldReceive('send')->times(1)->andReturn($postResponse);
        $this->provider->setHttpClient($client);

        $errorMessage = '';
        $errorCode = 0;

        try {
            $this->provider->getAccessToken('authorization_code', ['code' => 'mock_authorization_code']);
        } catch (IdentityProviderException $e) {
            $errorMessage = $e->getMessage();
            $errorCode = $e->getCode();
        }

        $this->assertEquals('OAuthException: Foo auth error', $errorMessage);
        $this->assertEquals(191, $errorCode);
    }
}
