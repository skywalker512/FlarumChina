<?php
use Cloudinary\AuthToken;

$base = realpath( dirname( __FILE__ ) . DIRECTORY_SEPARATOR . '..' );
require_once( join( DIRECTORY_SEPARATOR, array( $base, 'src', 'Cloudinary.php' ) ) );

use PHPUnit\Framework\TestCase;

class AuthTokenTest extends TestCase {
	const KEY = "00112233FF99";
	const ALT_KEY = "CCBB2233FF00";

	private $url_backup;

	protected function setUp() {
		parent::setUp();
		$this->url_backup = getenv( "CLOUDINARY_URL" );
		\Cloudinary::config_from_url( "cloudinary://a:b@test123?auth_token[duration]=300&auth_token[start_time]=11111111&auth_token[key]=" . AuthTokenTest::KEY );
		\Cloudinary::config( array( "private_cdn" => TRUE ) );
	}

	protected function tearDown() {
		parent::tearDown();
		putenv( "CLOUDINARY_URL=" . $this->url_backup );
		\Cloudinary::config_from_url( $this->url_backup );
	}

	function test_generate_with_start_time_and_duration() {
		$message = "should generate with start and duration";
		$token   = \Cloudinary::generate_auth_token( array(
			                                             "start_time" => 1111111111,
			                                             "acl"        => "/image/*",
			                                             "duration"   => 300
		                                             ) );
		$this->assertEquals( '__cld_token__=st=1111111111~exp=1111111411~acl=%2fimage%2f%2a~hmac=0d5b0c9c1485ee162c459879fe62e06caa23bc26fec92d58bd100f2e1592eac6', $token, $message );
	}

	function test_should_add_token_if_authToken_is_globally_set_and_signed_is_True() {
		$message = "should add token if authToken is globally set and signed = true";
		$options = array(
			"sign_url"      => TRUE,
			"resource_type" => "image",
			"type"          => "authenticated",
			"version"       => "1486020273"
		);
		$url     = \Cloudinary::cloudinary_url( "sample.jpg", $options );
		$this->assertEquals( "http://test123-res.cloudinary.com/image/authenticated/v1486020273/sample.jpg?__cld_token__=st=11111111~exp=11111411~hmac=8db0d753ee7bbb9e2eaf8698ca3797436ba4c20e31f44527e43b6a6e995cfdb3", $url, $message );


	}

	function test_should_add_token_for_public_resource() {
		$message = "should add token for 'public' resource";
		$options = array(
			"sign_url"      => TRUE,
			"resource_type" => "image",
			"type"          => "public",
			"version"       => "1486020273"
		);
		$url     = \Cloudinary::cloudinary_url( "sample.jpg", $options );
		$this->assertEquals( "http://test123-res.cloudinary.com/image/public/v1486020273/sample.jpg?__cld_token__=st=11111111~exp=11111411~hmac=c2b77d9f81be6d89b5d0ebc67b671557e88a40bcf03dd4a6997ff4b994ceb80e", $url, $message );


	}

	function test_should_not_add_token_if_signed_is_false() {
		$message = "should not add token if signed is null";
		$options = array( "type" => "authenticated", "version" => "1486020273" );
		$url     = \Cloudinary::cloudinary_url( "sample.jpg", $options );
		$this->assertEquals( "http://test123-res.cloudinary.com/image/authenticated/v1486020273/sample.jpg", $url, $message );


	}

	function test_null_token() {
		$message = "should not add token if authToken is globally set but null auth token is explicitly set and signed = true";
		$options = array(
			"auth_token" => FALSE,
			"sign_url"   => TRUE,
			"type"       => "authenticated",
			"version"    => "1486020273"
		);
		$url     = \Cloudinary::cloudinary_url( "sample.jpg", $options );
		$this->assertEquals( "http://test123-res.cloudinary.com/image/authenticated/s--v2fTPYTu--/v1486020273/sample.jpg", $url, $message );


	}

	function test_explicit_authToken_should_override_global_setting() {
		$message = "explicit authToken should override global setting";
		$options = array(
			"sign_url"       => TRUE,
			"auth_token"     => array(
				"key"        => AuthTokenTest::ALT_KEY,
				"start_time" => 222222222,
				"duration"   => 100
			),
			"type"           => "authenticated",
			"transformation" => array(
				"crop"  => "scale",
				"width" => 300
			)
		);
		$url     = \Cloudinary::cloudinary_url( "sample.jpg", $options );
		$this->assertEquals( "http://test123-res.cloudinary.com/image/authenticated/c_scale,w_300/sample.jpg?__cld_token__=st=222222222~exp=222222322~hmac=7d276841d70c4ecbd0708275cd6a82e1f08e47838fbb0bceb2538e06ddfa3029", $url, $message );


	}

	function test_should_compute_expiration_as_start_time_plus_duration() {
		$message = "should compute expiration as start time + duration";
		$token   = array( "key" => AuthTokenTest::KEY, "start_time" => 11111111, "duration" => 300 );
		$options = array(
			"sign_url"      => TRUE,
			"auth_token"    => $token,
			"resource_type" => "image",
			"type"          => "authenticated",
			"version"       => "1486020273"
		);
		$url     = \Cloudinary::cloudinary_url( "sample.jpg", $options );
		$this->assertEquals( "http://test123-res.cloudinary.com/image/authenticated/v1486020273/sample.jpg?__cld_token__=st=11111111~exp=11111411~hmac=8db0d753ee7bbb9e2eaf8698ca3797436ba4c20e31f44527e43b6a6e995cfdb3", $url, $message );

	}

	/**
	 * @expectedException \Cloudinary\Error
	 */
	function test_must_provide_expiration_or_duration() {

		$message = "should throw if expiration and duration are not provided";
		$token   = array( "key" => AuthTokenTest::KEY, "expiration" => null, "duration" => null );
		AuthToken::generate( $token );
		$this->fail($message);
	}



}

