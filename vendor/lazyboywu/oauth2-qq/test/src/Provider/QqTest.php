<?php namespace League\OAuth2\Client\Test\Provider;

use Mockery as m;

class QqTest extends \PHPUnit_Framework_TestCase
{
    protected $provider;

    protected function setUp()
    {
        $this->provider = new \League\OAuth2\Client\Provider\Qq([
            'clientId' => 'mock_client_id',
            'clientSecret' => 'mock_secret',
            'redirectUri' => 'none',
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


    public function testScopes()
    {
        $options = ['scope' => [uniqid(),uniqid()]];

        $url = $this->provider->getAuthorizationUrl($options);

        $this->assertContains(urlencode(implode(',', $options['scope'])), $url);
    }

    protected function makeMockResponse($body, $header, $statusCode) {
        $response = m::mock('Psr\Http\Message\ResponseInterface');
        $response->shouldReceive('getBody')->andReturn($body);
        $response->shouldReceive('getHeader')->andReturn($header);
        $response->shouldReceive('getStatusCode')->andReturn($statusCode);

        return $response;
    }

    public function testGetAccessToken()
    {
        
        $mockBody = 'access_token=mock_access_token&otherKey={1234}';

        $postResponse = $this->makeMockResponse(
            $mockBody,
            ['content-type' => 'text/html'],
            200
        );

        $client = m::mock('GuzzleHttp\ClientInterface');
        $client->shouldReceive('send')->times(1)->andReturn($postResponse);

        $this->provider->setHttpClient($client);

        $token = $this->provider->getAccessToken('authorization_code', ['code' => 'mock_authorization_code']);

        $this->assertEquals('mock_access_token', $token->getToken());
        $this->assertNull($token->getExpires());
        $this->assertNull($token->getRefreshToken());
        $this->assertNull($token->getResourceOwnerId());
    }

    public function testGetOpenId()
    {
        $mockBody = array(
            'code' => 0,
            'msg' => '',
            'openid' => 'mock_openid'
        );

        $postResponse = $this->makeMockResponse(
            'access_token=mock_access_token&expires=3600&refresh_token=mock_refresh_token&otherKey={1234}',
            ['content-type' => 'text/html'],
            200
        );

        $openIdResponse = $this->makeMockResponse(
            'callback(' . json_encode($mockBody) . ')',
            ['content-type' => 'text/html'],
            200
        );

        $client = m::mock('GuzzleHttp\ClientInterface');
        $client->shouldReceive('send')
            ->times(2)
            ->andReturn($postResponse, $openIdResponse);
        $this->provider->setHttpClient($client);

        $token = $this->provider->getAccessToken('authorization_code', ['code' => 'mock_authorization_code']);
        $openid = $this->provider->getOpenId($token);

        $this->assertEquals('mock_openid', $openid);
    }

    /**
     * @expectedException League\OAuth2\Client\Provider\Exception\IdentityProviderException
     **/
    public function testGetOpenIdWithExceptionThrown()
    {
        $mockBody = array(
            'code' => 1002,
            'msg' => '',
            'openid' => 'mock_openid'
        );

        $postResponse = $this->makeMockResponse(
            'access_token=mock_access_token&expires=3600&refresh_token=mock_refresh_token&otherKey={1234}',
            ['content-type' => 'application/x-www-form-urlencoded'],
            200
        );

        $openIdResponse = $this->makeMockResponse(
            'callback(' . json_encode($mockBody) . ')',
            ['content-type' => 'text/html'],
            200
        );

        $client = m::mock('GuzzleHttp\ClientInterface');
        $client->shouldReceive('send')
            ->times(2)
            ->andReturn($postResponse, $openIdResponse);
        $this->provider->setHttpClient($client);

        $token = $this->provider->getAccessToken('authorization_code', ['code' => 'mock_authorization_code']);
        $openid = $this->provider->getOpenId($token);
    }

    /**
     * @expectedException League\OAuth2\Client\Provider\Exception\IdentityProviderException
     **/
    public function testGetOpenIdWithStatusCodeExceptionThrown()
    {
        $mockBody = array();

        $postResponse = $this->makeMockResponse(
            'access_token=mock_access_token&expires=3600&refresh_token=mock_refresh_token&otherKey={1234}',
            ['content-type' => 'application/x-www-form-urlencoded'],
            200
        );

        $openIdResponse = $this->makeMockResponse(
            'callback(' . json_encode($mockBody) . ')',
            ['content-type' => 'text/html'],
            400
        );

        $client = m::mock('GuzzleHttp\ClientInterface');
        $client->shouldReceive('send')
            ->times(2)
            ->andReturn($postResponse, $openIdResponse);
        $this->provider->setHttpClient($client);

        $token = $this->provider->getAccessToken('authorization_code', ['code' => 'mock_authorization_code']);
        $openid = $this->provider->getOpenId($token);
    }

    public function testUserData()
    {
        $mockOpenIdBody = array(
            'code' => 0,
            'msg' => '',
            'openid' => uniqid()
        );

        $mockUserBody = array(
            'ret' => 0,
            'msg' => '',
            'nickname' => uniqid(),
            'figureurl' => uniqid()
        );

        $postResponse = $this->makeMockResponse(
            'access_token=mock_access_token&expires=3600&refresh_token=mock_refresh_token&otherKey={1234}',
            ['content-type' => 'application/x-www-form-urlencoded'],
            200
        );

        $openIdResponse = $this->makeMockResponse(
            json_encode($mockOpenIdBody),
            ['content-type' => 'json'],
            200
        );

        $userResponse = $this->makeMockResponse(
            json_encode($mockUserBody),
            ['content-type' => 'json'],
            200
        );

        $client = m::mock('GuzzleHttp\ClientInterface');
        $client->shouldReceive('send')
            ->times(3)
            ->andReturn($postResponse, $openIdResponse, $userResponse);
        $this->provider->setHttpClient($client);

        $token = $this->provider->getAccessToken('authorization_code', ['code' => 'mock_authorization_code']);
        $user = $this->provider->getResourceOwner($token);

        $this->assertEquals($mockOpenIdBody['openid'], $user->getOpenId());
        $this->assertEquals($mockOpenIdBody['openid'], $user->toArray()['openid']);
        $this->assertEquals($mockUserBody['nickname'], $user->getNickname());
        $this->assertEquals($mockUserBody['nickname'], $user->toArray()['nickname']);
        $this->assertEquals($mockUserBody['figureurl'], $user->getFigureUrl());
        $this->assertEquals($mockUserBody['figureurl'], $user->toArray()['figureurl']);
        $this->assertNull($user->getId());
        $this->assertNull($user->getEmail());
        $this->assertNull($user->getName());
    }

    /**
     * @expectedException League\OAuth2\Client\Provider\Exception\IdentityProviderException
     **/
    public function testUserDataWithExceptionThrown()
    {
        $mockOpenIdBody = array(
            'code' => 0,
            'msg' => '',
            'openid' => uniqid()
        );

        $mockUserBody = array(
            'ret' => 1200,
            'msg' => '',
            'nickname' => uniqid()
        );

        $postResponse = $this->makeMockResponse(
            'access_token=mock_access_token&expires=3600&refresh_token=mock_refresh_token&otherKey={1234}',
            ['content-type' => 'application/x-www-form-urlencoded'],
            200
        );

        $openIdResponse = $this->makeMockResponse(
            json_encode($mockOpenIdBody),
            ['content-type' => 'json'],
            200
        );

        $userResponse = $this->makeMockResponse(
            json_encode($mockUserBody),
            ['content-type' => 'json'],
            200
        );

        $client = m::mock('GuzzleHttp\ClientInterface');
        $client->shouldReceive('send')
            ->times(3)
            ->andReturn($postResponse, $openIdResponse, $userResponse);
        $this->provider->setHttpClient($client);

        $token = $this->provider->getAccessToken('authorization_code', ['code' => 'mock_authorization_code']);
        $user = $this->provider->getResourceOwner($token);

        $this->assertEquals($mockOpenIdBody['openid'], $user->getOpenId());
        $this->assertEquals($mockOpenIdBody['openid'], $user->toArray()['openid']);
        $this->assertEquals($mockUserBody['nickname'], $user->getNickname());
        $this->assertEquals($mockUserBody['nickname'], $user->toArray()['nickname']);
    }
    
}
