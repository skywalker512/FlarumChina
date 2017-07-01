<?php
namespace Henter\WeChat;


class OAuthErrorTest extends \PHPUnit_Framework_TestCase
{
    public function testError()
    {

        $oauth = new OAuth('wx229aa24fa4a2xxxx', 'error_secret');

        $oauth->getAccessToken('code', 'error_authorization_code');
        $this->assertStringStartsWith('get access token failed: system error', $oauth->error());

        $oauth = new OAuth('wx229aa24fa4a2xxxx', 'error_secret', 'error_access_token');
        $oauth->api('sns/userinfo', array('openid'=>'error_openid'));
        $this->assertStringStartsWith('request failed: invalid credential, access_token is invalid or not latest', $oauth->error());

    }
}
