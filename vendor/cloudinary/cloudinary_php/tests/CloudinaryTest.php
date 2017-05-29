<?php
$base = realpath(dirname(__FILE__).DIRECTORY_SEPARATOR.'..');
use PHPUnit\Framework\TestCase;
require_once(join(DIRECTORY_SEPARATOR, array($base, 'src', 'Cloudinary.php')));
class CloudinaryTest extends \PHPUnit\Framework\TestCase {

  const DEFAULT_ROOT_PATH = 'http://res.cloudinary.com/test123/';
  const DEFAULT_UPLOAD_PATH = 'http://res.cloudinary.com/test123/image/upload/';
  const VIDEO_UPLOAD_PATH = 'http://res.cloudinary.com/test123/video/upload/';

  public function setUp() {
      Cloudinary::reset_config();
    Cloudinary::config(array("cloud_name"=>"test123", "api_key" => "a", "api_secret"=>"b",  "secure_distribution" => NULL, "private_cdn" => FALSE));
  }

  public function test_cloud_name() {
    // should use cloud_name from config
    $result = Cloudinary::cloudinary_url("test");
    $this->assertEquals(CloudinaryTest::DEFAULT_UPLOAD_PATH . "test", $result);
  }

  public function test_cloud_name_options() {
    // should allow overriding cloud_name in $options
    $options = array("cloud_name" => "test321");
    $this->cloudinary_url_assertion("test", $options, "http://res.cloudinary.com/test321/image/upload/test");
  }

    public function test_user_agent() {
        $tmp = \Cloudinary::$USER_PLATFORM;
        $platform_information       = 'TestPlatformInformation (From \"CloudinaryTest.php\")';
        \Cloudinary::$USER_PLATFORM = $platform_information;
        $userAgent = \Cloudinary::userAgent();
        \Cloudinary::$USER_PLATFORM = $tmp; // reset value
        $this->assertRegExp("/CloudinaryPHP\/\d+\.\d+\.\d+/", $userAgent);
        $this->assertContains($platform_information, $userAgent, "USER_AGENT should include platform information if set");
    }

  public function test_secure_distribution() {
    // should use default secure distribution if secure=TRUE
    $options = array("secure" => TRUE);
    $this->cloudinary_url_assertion("test", $options, "https://res.cloudinary.com/test123/image/upload/test");
  }

  public function test_secure_distribution_overwrite() {
    // should allow overwriting secure distribution if secure=TRUE
    $options = array("secure" => TRUE, "secure_distribution" => "something.else.com");
    $this->cloudinary_url_assertion("test", $options, "https://something.else.com/test123/image/upload/test");
  }

  public function test_secure_distibution() {
    // should take secure distribution from config if secure=TRUE
    Cloudinary::config(array("secure_distribution" => "config.secure.distribution.com"));
    $options = array("secure" => TRUE);
    $this->cloudinary_url_assertion("test", $options, "https://config.secure.distribution.com/test123/image/upload/test");
  }

  public function test_secure_akamai() {
    // should default to akamai if secure is given with private_cdn and no secure_distribution
    $options = array("secure" => TRUE, "private_cdn" => TRUE);
    $this->cloudinary_url_assertion("test", $options, "https://test123-res.cloudinary.com/image/upload/test");
  }

  public function test_secure_non_akamai() {
    // should not add cloud_name if private_cdn and secure non akamai secure_distribution
    $options = array("secure" => TRUE, "private_cdn" => TRUE, "secure_distribution" => "something.cloudfront.net");
    $this->cloudinary_url_assertion("test", $options, "https://something.cloudfront.net/image/upload/test");
  }

  public function test_http_private_cdn() {
    // should not add cloud_name if private_cdn and not secure
    $options = array("private_cdn" => TRUE);
    $this->cloudinary_url_assertion("test", $options, "http://test123-res.cloudinary.com/image/upload/test");
  }

  public function test_secure_shared_subdomain() {
    // should support cdn_subdomain with secure on if using shared_domain
    $options = array("cdn_subdomain" => TRUE, "secure" => TRUE);
    $this->cloudinary_url_assertion("test", $options, "https://res-2.cloudinary.com/test123/image/upload/test");
  }

  public function test_secure_shared_subdomain_false() {
    // should support secure_cdn_subdomain false override with secure
    $options = array("cdn_subdomain" => TRUE, "secure" => TRUE, "secure_cdn_subdomain" => FALSE);
    $this->cloudinary_url_assertion("test", $options, "https://res.cloudinary.com/test123/image/upload/test");
  }

  public function test_secure_subdomain_true() {
    // should support secure_cdn_subdomain true override with secure
    $options = array("cdn_subdomain" => TRUE, "secure" => TRUE, "secure_cdn_subdomain" => TRUE, "private_cdn" => TRUE);
    $this->cloudinary_url_assertion("test", $options, "https://test123-res-2.cloudinary.com/image/upload/test");
  }

  public function test_format() {
    // should use format from $options
    $options = array("format" => "jpg");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "test.jpg");
  }

  public function test_crop() {
    // should use width and height from $options even if crop is not given
    $options = array("width" => 100, "height" => 100);
    $result = Cloudinary::cloudinary_url("test", $options);
    $this->assertEquals(CloudinaryTest::DEFAULT_UPLOAD_PATH . "h_100,w_100/test", $result);
    $this->assertEquals(array("width" => 100, "height" => 100), $options);
    $options = array("width" => 100, "height" => 100, "crop" => "crop");
    $result = Cloudinary::cloudinary_url("test", $options);
    $this->assertEquals(array("width" => 100, "height" => 100), $options);
    $this->assertEquals(CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_crop,h_100,w_100/test", $result);
  }

  public function test_various_options() {
    // should use x, y, radius, prefix, gravity and quality from $options
    $options = array("x" => 1, "y" => 2, "radius" => 3, "gravity" => "center", "quality" => 0.4, "prefix" => "a", "opacity" => 20);
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "g_center,o_20,p_a,q_0.4,r_3,x_1,y_2/test");
	  $options = array("gravity" => "auto", "crop" => "crop", "width" => 0.5);
	  $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_crop,g_auto,w_0.5/test");
	  $options = array("gravity" => "auto:ocr_text", "crop" => "crop", "width" => 0.5);
	  $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_crop,g_auto:ocr_text,w_0.5/test");
	  $options = array("gravity" => "ocr_text", "crop" => "crop", "width" => 0.5);
	  $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_crop,g_ocr_text,w_0.5/test");
  }

    public function test_quality() {
        $this->cloudinary_url_assertion("test", array("x" => 1, "y" => 2, "radius" => 3, "gravity" => "center", "quality" => 80, "prefix" => "a"), CloudinaryTest::DEFAULT_UPLOAD_PATH . "g_center,p_a,q_80,r_3,x_1,y_2/test");
        $this->cloudinary_url_assertion("test", array("x" => 1, "y" => 2, "radius" => 3, "gravity" => "center", "quality" => "80:444", "prefix" => "a"), CloudinaryTest::DEFAULT_UPLOAD_PATH . "g_center,p_a,q_80:444,r_3,x_1,y_2/test");
        $this->cloudinary_url_assertion("test", array("x" => 1, "y" => 2, "radius" => 3, "gravity" => "center", "quality" => "auto", "prefix" => "a"), CloudinaryTest::DEFAULT_UPLOAD_PATH . "g_center,p_a,q_auto,r_3,x_1,y_2/test");
        $this->cloudinary_url_assertion("test", array("x" => 1, "y" => 2, "radius" => 3, "gravity" => "center", "quality" => "auto:good", "prefix" => "a"), CloudinaryTest::DEFAULT_UPLOAD_PATH . "g_center,p_a,q_auto:good,r_3,x_1,y_2/test");
    }


  public function test_no_empty_options() {
    // should use x, y, width, height, crop, prefix and opacity from $options
    $options = array("x" => 0, "y" => '0', "width" => '', "height" => "", "crop" => ' ', "prefix" => false, "opacity" => null);
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "x_0,y_0/test");
  }

  public function test_transformation_simple() {
    // should support named transformation
    $options = array("transformation" => "blip");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "t_blip/test");
  }

  public function test_transformation_array() {
    // should support array of named transformations
    $options = array("transformation" => array("blip", "blop"));
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "t_blip.blop/test");
  }

  public function test_base_transformations() {
    // should support base transformation
    $options = array("transformation" => array("x" => 100, "y" => 100, "crop" => "fill"), "crop" => "crop", "width" => 100);
    $result = Cloudinary::cloudinary_url("test", $options);
    $this->assertEquals(array("width" => 100), $options);
    $this->assertEquals(CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_fill,x_100,y_100/c_crop,w_100/test", $result);
  }

  public function test_base_transformation_array() {
    // should support array of base transformations
    $options = array("transformation" => array(array("x" => 100, "y" => 100, "width" => 200, "crop" => "fill"), array("radius" => 10)), "crop" => "crop", "width" => 100);
    $result = Cloudinary::cloudinary_url("test", $options);
    $this->assertEquals(array("width" => 100), $options);
    $this->assertEquals(CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_fill,w_200,x_100,y_100/r_10/c_crop,w_100/test", $result);
  }

  public function test_no_empty_transformation() {
    // should not include empty transformations
    $options = array("transformation" => array(array(), array("x" => 100, "y" => 100, "crop" => "fill"), array()));
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_fill,x_100,y_100/test");
  }

  public function test_size() {
    // should support size
    $options = array("size" => "10x10", "crop" => "crop");
    $result = Cloudinary::cloudinary_url("test", $options);
    $this->assertEquals(array("width" => "10", "height" => "10"), $options);
    $this->assertEquals(CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_crop,h_10,w_10/test", $result);
  }

  public function test_type() {
    // should use type from $options
    $options = array("type" => "facebook");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_ROOT_PATH . "image/facebook/test");
  }

  public function test_resource_type() {
    // should use resource_type from $options
    $options = array("resource_type" => "raw");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_ROOT_PATH . "raw/upload/test");
  }

  public function test_ignore_http() {
    // should ignore http links only if type is not given
    $options = array();
    $this->cloudinary_url_assertion("http://test", $options, "http://test");
    $options = array("type" => "fetch");
    $this->cloudinary_url_assertion("http://test", $options, CloudinaryTest::DEFAULT_ROOT_PATH . "image/fetch/http://test");
  }

  public function test_fetch() {
    // should escape fetch urls
    $options = array("type" => "fetch");
    $this->cloudinary_url_assertion("http://blah.com/hello?a=b", $options, CloudinaryTest::DEFAULT_ROOT_PATH . "image/fetch/http://blah.com/hello%3Fa%3Db");
  }

  public function test_cname() {
    // should support extenal cname
    $options = array("cname" => "hello.com");
    $this->cloudinary_url_assertion("test", $options, "http://hello.com/test123/image/upload/test");
  }

  public function test_cname_subdomain() {
    // should support extenal cname with cdn_subdomain on
    $options = array("cname" => "hello.com", "cdn_subdomain" => TRUE);
    $this->cloudinary_url_assertion("test", $options, "http://a2.hello.com/test123/image/upload/test");
  }

  public function test_http_escape() {
    // should escape http urls
    $options = array("type" => "youtube");
    $result = $this->cloudinary_url_assertion("http://www.youtube.com/watch?v=d9NF2edxy-M", $options, CloudinaryTest::DEFAULT_ROOT_PATH . "image/youtube/http://www.youtube.com/watch%3Fv%3Dd9NF2edxy-M");
  }

  public function test_background() {
    // should support background
    $options = array("background" => "red");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "b_red/test");
    $options = array("background" => "#112233");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "b_rgb:112233/test");
  }

  public function test_default_image() {
    // should support default_image
    $options = array("default_image" => "default");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "d_default/test");
  }

  public function test_angle() {
    // should support angle
    $options = array("angle" => 12);
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "a_12/test");
    $options = array("angle" => array("auto", 12));
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "a_auto.12/test");
  }

  public function test_overlay() {
    // should support overlay
    $options = array("overlay" => "text:hello");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "l_text:hello/test");
    // should not pass width/height to html if overlay
    $options = array("overlay" => "text:hello", "width"=>100, "height"=>100);
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "h_100,l_text:hello,w_100/test");
  }

  public function test_underlay() {
    // should support underlay
    $options = array("underlay" => "text:hello");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "u_text:hello/test");
    // should not pass width/height to html if underlay
    $options = array("underlay" => "text:hello", "width"=>100, "height"=>100);
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "h_100,u_text:hello,w_100/test");
  }

  public function test_overlay_fetch() {
    // should support overlay from a fetch url
    $options = array("overlay" => "fetch:http://cloudinary.com/images/old_logo.png");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "l_fetch:aHR0cDovL2Nsb3VkaW5hcnkuY29tL2ltYWdlcy9vbGRfbG9nby5wbmc=/test");
  }

  public function test_underlay_fetch() {
    // should support underlay from a fetch url
    $options = array("underlay" => "fetch:http://cloudinary.com/images/old_logo.png");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "u_fetch:aHR0cDovL2Nsb3VkaW5hcnkuY29tL2ltYWdlcy9vbGRfbG9nby5wbmc=/test");
  }

  public function test_fetch_format() {
    // should support format for fetch urls
    $options = array("format" => "jpg", "type" => "fetch");
    $this->cloudinary_url_assertion("http://cloudinary.com/images/logo.png", $options, CloudinaryTest::DEFAULT_ROOT_PATH . "image/fetch/f_jpg/http://cloudinary.com/images/logo.png");
  }

  public function test_effect() {
    // should support effect
    $options = array("effect" => "sepia");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "e_sepia/test");
  }

  public function test_effect_with_array() {
    // should support effect with array
    $options = array("effect" => array("sepia", -10));
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "e_sepia:-10/test");
  }

  public function test_density() {
    // should support density
    $options = array("density" => 150);
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "dn_150/test");
  }

  public function test_page() {
    // should support page
    $options = array("page" => 5);
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "pg_5/test");
  }

  public function test_border() {
    // should support border
    $options = array("border" => array("width" => 5));
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "bo_5px_solid_black/test");
    $options = array("border" => array("width" => 5, "color"=>"#ffaabbdd"));
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "bo_5px_solid_rgb:ffaabbdd/test");
    $options = array("border" => "1px_solid_blue");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "bo_1px_solid_blue/test");
  }

  public function test_flags() {
    // should support flags
    $options = array("flags" => "abc");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "fl_abc/test");
    $options = array("flags" => array("abc", "def"));
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "fl_abc.def/test");
  }

  public function test_cl_image_tag() {
    $tag = cl_image_tag("test", array("width"=>10, "height"=>10, "crop"=>"fill", "format"=>"png"));
    $this->assertEquals("<img src='http://res.cloudinary.com/test123/image/upload/c_fill,h_10,w_10/test.png' height='10' width='10'/>", $tag);
  }

  public function test_responsive_width() {
    // should add responsive width transformation
    $tag = cl_image_tag("hello", array("responsive_width"=>True, "format"=>"png"));
    $this->assertEquals("<img class='cld-responsive' data-src='http://res.cloudinary.com/test123/image/upload/c_limit,w_auto/hello.png'/>", $tag);

    $options = array("width"=>100, "height"=>100, "crop"=>"crop", "responsive_width"=>TRUE);
    $result = Cloudinary::cloudinary_url("test", $options);
    $this->assertEquals($options, array("responsive"=> TRUE));
    $this->assertEquals($result, CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_crop,h_100,w_100/c_limit,w_auto/test");
    Cloudinary::config(array("responsive_width_transformation"=>array("width"=>"auto:breakpoints", "crop"=>"pad")));
    $options = array("width"=>100, "height"=>100, "crop"=>"crop", "responsive_width"=>TRUE);
    $result = Cloudinary::cloudinary_url("test", $options);
    $this->assertEquals($options, array("responsive"=> TRUE));
    $this->assertEquals($result, CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_crop,h_100,w_100/c_pad,w_auto:breakpoints/test");
  }

  public function test_width_auto() {
    // should support width=auto
    $tag = cl_image_tag("hello", array("width"=>"auto", "crop"=>"limit", "format"=>"png"));
    $this->assertEquals("<img class='cld-responsive' data-src='http://res.cloudinary.com/test123/image/upload/c_limit,w_auto/hello.png'/>", $tag);
    $tag = cl_image_tag("hello", array("width"=>"auto:breakpoints", "crop"=>"limit", "format"=>"png"));
    $this->assertEquals("<img class='cld-responsive' data-src='http://res.cloudinary.com/test123/image/upload/c_limit,w_auto:breakpoints/hello.png'/>", $tag);
      $this->cloudinary_url_assertion("test", array( "width" => "auto:20", "crop" => 'fill' ), CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_fill,w_auto:20/test", array ('responsive' => true));
      $this->cloudinary_url_assertion("test", array( "width" => "auto:20:350", "crop" => 'fill' ), CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_fill,w_auto:20:350/test", array ('responsive' => true));
      $this->cloudinary_url_assertion("test", array( "width" => "auto:breakpoints", "crop" => 'fill' ), CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_fill,w_auto:breakpoints/test", array ('responsive' => true));
      $this->cloudinary_url_assertion("test", array( "width" => "auto:breakpoints_100_1900_20_15", "crop" => 'fill' ), CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_fill,w_auto:breakpoints_100_1900_20_15/test", array ('responsive' => true));
      $this->cloudinary_url_assertion("test", array( "width" => "auto:breakpoints:json", "crop" => 'fill' ), CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_fill,w_auto:breakpoints:json/test", array ('responsive' => true));
  }

  public function test_initial_width_and_height() {
    $options = array("crop" => "crop", "width"=> "iw", "height"=>"ih");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_crop,h_ih,w_iw/test");
  }

    public function shared_client_hints($options, $message = ''){
        $tag = cl_image_tag('sample.jpg', $options);
        $this->assertEquals("<img src='http://res.cloudinary.com/test/image/upload/c_scale,dpr_auto,w_auto/sample.jpg' />", $tag, $message);
        $tag = cl_image_tag('sample.jpg', array_merge(array( "responsive" => true ), $options));
        $this->assertEquals("<img src='http://res.cloudinary.com/test/image/upload/c_scale,dpr_auto,w_auto/sample.jpg' />", $tag, $message);
    }
    public function test_client_hints_as_option() {
        $this->shared_client_hints(array(
                                       "dpr" => "auto",
                                       "cloud_name" => "test",
                                       "width" => "auto",
                                       "crop" => "scale",
                                       "client_hints" => TRUE
                                   ), "support client_hints as an option");
    }

    public function test_client_hints_as_global() {
        Cloudinary::config(array("client_hints" => TRUE));
        $this->shared_client_hints(array(
            "dpr" => "auto",
            "cloud_name" => "test",
            "width" => "auto",
            "crop" => "scale"
        ), "support client hints as global configuration");
    }

    public function test_client_hints_false() {
        Cloudinary::config(array("responsive" => TRUE));
        $tag = cl_image_tag('sample.jpg', array(
            "width" => "auto",
            "crop" => "scale",
            "cloud_name" => "test123",
            "client_hints" => FALSE
        ));
        $this->assertEquals("<img class='cld-responsive' data-src='" . CloudinaryTest::DEFAULT_UPLOAD_PATH . "c_scale,w_auto/sample.jpg'/>",
                            $tag,
                            "should use normal responsive behaviour");
    }


    public function test_aspect_ratio() {
        // should support background
        $options = array("aspect_ratio" => "1.0");
        $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "ar_1.0/test");
        $options = array("aspect_ratio" => "3:2");
        $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_UPLOAD_PATH . "ar_3:2/test");
    }

    public function test_dpr_auto() {
    // should support width=auto
    $tag = cl_image_tag("hello", array("dpr"=>"auto", "format"=>"png"));
    $this->assertEquals("<img class='cld-hidpi' data-src='http://res.cloudinary.com/test123/image/upload/dpr_auto/hello.png'/>", $tag);
  }

  public function test_e_art_incognito() {
    $tag = cl_image_tag("hello", array("effect"=>"art:incognito", "format"=>"png"));
    $this->assertEquals("<img src='http://res.cloudinary.com/test123/image/upload/e_art:incognito/hello.png' />", $tag);
  }

  public function test_folder_version() {
    // should add version if public_id contains /
    $this->cloudinary_url_assertion("folder/test", array(), CloudinaryTest::DEFAULT_UPLOAD_PATH . "v1/folder/test");
    $this->cloudinary_url_assertion("folder/test", array("version"=>123), CloudinaryTest::DEFAULT_UPLOAD_PATH . "v123/folder/test");
    $this->cloudinary_url_assertion("v1234/test", array(), CloudinaryTest::DEFAULT_UPLOAD_PATH . "v1234/test");
  }

  public function test_shorten() {
    $options = array("shorten"=>TRUE);
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_ROOT_PATH . "iu/test");

    $options = array("shorten"=>TRUE, "type"=>"private");
    $this->cloudinary_url_assertion("test", $options, CloudinaryTest::DEFAULT_ROOT_PATH . "image/private/test");
  }

  public function test_cl_sprite_tag() {
    $url = cl_sprite_tag("mytag", array("crop"=>"fill", "width"=>10, "height"=>10));
    $this->assertEquals("<link rel='stylesheet' type='text/css' href='http://res.cloudinary.com/test123/image/sprite/c_fill,h_10,w_10/mytag.css'>", $url);
  }

  public function test_signed_url() {
    // should correctly sign a url
    $this->cloudinary_url_assertion("image.jpg", array("version"=> 1234, "transformation"=> array("crop"=> "crop", "width"=> 10, "height"=> 20), "sign_url"=> TRUE), CloudinaryTest::DEFAULT_UPLOAD_PATH . "s--Ai4Znfl3--/c_crop,h_20,w_10/v1234/image.jpg");
    $this->cloudinary_url_assertion("image.jpg", array("version"=> 1234, "sign_url"=> TRUE), CloudinaryTest::DEFAULT_UPLOAD_PATH . "s----SjmNDA--/v1234/image.jpg");
    $this->cloudinary_url_assertion("image.jpg", array("transformation"=> array("crop"=> "crop", "width"=> 10, "height"=> 20), "sign_url"=> TRUE), CloudinaryTest::DEFAULT_UPLOAD_PATH . "s--Ai4Znfl3--/c_crop,h_20,w_10/image.jpg");
    $this->cloudinary_url_assertion("image.jpg", array("transformation"=> array("crop"=> "crop", "width"=> 10, "height"=> 20), "type"=> "authenticated", "sign_url"=> TRUE), CloudinaryTest::DEFAULT_ROOT_PATH . "image/authenticated/s--Ai4Znfl3--/c_crop,h_20,w_10/image.jpg");
    $this->cloudinary_url_assertion("http://google.com/path/to/image.png", array("type"=> "fetch", "version"=> 1234, "sign_url"=> TRUE), CloudinaryTest::DEFAULT_ROOT_PATH . "image/fetch/s--hH_YcbiS--/v1234/http://google.com/path/to/image.png");
  }

  public function test_escape_public_id() {
    //should escape public_ids
    $tests = array(
      "a b" => "a%20b",
      "a+b" => "a%2Bb",
      "a%20b" => "a%20b",
      "a-b" => "a-b",
      "a??b" => "a%3F%3Fb",
      "parentheses(interject)" => "parentheses%28interject%29");
    foreach ($tests as $source => $target) {
      $url = Cloudinary::cloudinary_url($source);
      $this->assertEquals(CloudinaryTest::DEFAULT_UPLOAD_PATH . "$target", $url);
    }
  }

  /**
   * @expectedException InvalidArgumentException
   */
  public function test_disallow_url_suffix_in_shared() {
    // should disallow url_suffix in shared distribution
    $options = array("url_suffix"=>"hello");
    Cloudinary::cloudinary_url("test", $options);
  }

  /**
   * @expectedException InvalidArgumentException
   */
  public function test_disallow_url_suffix_with_non_upload_types() {
    //should disallow url_suffix in non upload types
    $options = array("url_suffix"=>"hello", "private_cdn"=>TRUE, "type"=>"facebook");
    Cloudinary::cloudinary_url("test", $options);
  }

  /**
   * @expectedException InvalidArgumentException
   */
  public function test_disallow_suffix_with_dot(){
    //should disallow url_suffix with .
    $options = array("url_suffix"=>"hello/world", "private_cdn"=>TRUE);
    Cloudinary::cloudinary_url("test", $options);
  }

  /**
   * @expectedException InvalidArgumentException
   */
  public function test_disallow_suffix_with_slash(){
    //should disallow url_suffix with /
    $options = array("url_suffix"=>"hello/world", "private_cdn"=>TRUE);
    Cloudinary::cloudinary_url("test", $options);
  }


  public function test_url_suffix_for_private_cdn(){
    //should support url_suffix for private_cdn
    $this->cloudinary_url_assertion("test", array("url_suffix"=>"hello", "private_cdn"=>TRUE), "http://test123-res.cloudinary.com/images/test/hello");
    $this->cloudinary_url_assertion("test", array("url_suffix"=>"hello", "transformation" => array("angle"=>0), "private_cdn"=>TRUE), "http://test123-res.cloudinary.com/images/a_0/test/hello");
  }

  public function test_format_after_url_suffix(){
    //should put format after url_suffix
    $this->cloudinary_url_assertion("test", array("url_suffix"=>"hello", "private_cdn"=>TRUE, "format"=>"jpg"), "http://test123-res.cloudinary.com/images/test/hello.jpg");
  }

  public function test_dont_sign_the_url_suffix(){
    //should not sign the url_suffix
    $options = array("format"=>"jpg", "sign_url"=>TRUE);
    preg_match('/s--[0-9A-Za-z_-]{8}--/', Cloudinary::cloudinary_url("test", $options), $matches);
    $this->cloudinary_url_assertion("test", array("url_suffix"=>"hello", "private_cdn"=>TRUE, "format"=>"jpg", "sign_url"=>TRUE), "http://test123-res.cloudinary.com/images/" . $matches[0] . "/test/hello.jpg");

    $options = array("format"=>"jpg", "angle"=>0, "sign_url"=>TRUE);
    preg_match('/s--[0-9A-Za-z_-]{8}--/', Cloudinary::cloudinary_url("test", $options), $matches);
    $this->cloudinary_url_assertion("test", array("url_suffix"=>"hello", "private_cdn"=>TRUE, "format"=>"jpg", "transformation" => array("angle"=>0), "sign_url"=>TRUE), "http://test123-res.cloudinary.com/images/" . $matches[0] . "/a_0/test/hello.jpg");
  }

  public function test_url_suffix_for_raw(){
    //should support url_suffix for raw uploads
    $this->cloudinary_url_assertion("test", array("url_suffix"=>"hello", "private_cdn"=>TRUE, "resource_type"=>"raw"), "http://test123-res.cloudinary.com/files/test/hello");
  }

  public function test_url_suffix_for_private(){
    //should support url_suffix for private uploads
    $this->cloudinary_url_assertion("test",
      array("url_suffix"=>"hello", "private_cdn"=>TRUE, "resource_type"=>"image", "type" => "private"),
      "http://test123-res.cloudinary.com/private_images/test/hello");

    $this->cloudinary_url_assertion("test",
      array("url_suffix"=>"hello", "private_cdn"=>TRUE, "format" => "jpg", "resource_type"=>"image", "type" => "private"),
      "http://test123-res.cloudinary.com/private_images/test/hello.jpg");
  }

  public function test_allow_use_root_path_in_shared() {

    $this->cloudinary_url_assertion("test", array("use_root_path"=>TRUE, "private_cdn"=>FALSE), CloudinaryTest::DEFAULT_ROOT_PATH . "test");
    $this->cloudinary_url_assertion("test", array("use_root_path"=>TRUE, "private_cdn"=>FALSE, "transformation"=>array("angle"=>0)), CloudinaryTest::DEFAULT_ROOT_PATH . "a_0/test");
  }

  public function test_use_root_path_for_private_cdn() {
    //should support use_root_path for private_cdn
    $this->cloudinary_url_assertion("test", array("use_root_path"=>TRUE, "private_cdn"=>TRUE), "http://test123-res.cloudinary.com/test");
    $this->cloudinary_url_assertion("test", array("use_root_path"=>TRUE, "private_cdn"=>TRUE, "transformation"=>array("angle"=>0)), "http://test123-res.cloudinary.com/a_0/test");
  }

  public function test_use_root_path_with_url_suffix_for_private_cdn() {
    //should support use_root_path together with url_suffix for private_cdn
    $this->cloudinary_url_assertion("test", array("use_root_path"=>TRUE, "url_suffix"=>"hello", "private_cdn"=>TRUE), "http://test123-res.cloudinary.com/test/hello");
  }

  /**
   * @expectedException InvalidArgumentException
   */
  public function test_disallow_use_root_path_if_not_image_upload_1() {
    //should disallow use_root_path if not image/upload
    $options = array("use_root_path"=>TRUE, "private_cdn"=>TRUE, "type"=>"facebook");
    Cloudinary::cloudinary_url("test", $options);
  }

  /**
   * @expectedException InvalidArgumentException
   */
  public function test_disallow_use_root_path_if_not_image_upload_2() {
    //should disallow use_root_path if not image/upload
    $options = array("use_root_path"=>TRUE, "private_cdn"=>TRUE, "resource_type"=>"raw");
    Cloudinary::cloudinary_url("test", $options);
  }

  public function test_norm_range_value() {
    $method = new ReflectionMethod('Cloudinary', 'norm_range_value');
    $method->setAccessible(true);
    // should parse integer range values
    $this->assertEquals($method->invoke(NULL, "200"), "200");
    // should parse float range values
    $this->assertEquals($method->invoke(NULL, "200.0"), "200.0");
    // should parse a percent range value
    $this->assertEquals($method->invoke(NULL, "20p"), "20p");
    $this->assertEquals($method->invoke(NULL, "20P"), "20p");
    $this->assertEquals($method->invoke(NULL, "20%"), "20p");
    $this->assertNull($method->invoke(NULL, "p"));
  }

  public function test_video_codec(){
    // should support a string value
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'video_codec' => 'auto' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "vc_auto/video_id");
    // should support a hash value
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'video_codec' => array('codec' => 'h264', 'profile' => 'basic', 'level' => '3.1' )),
                          CloudinaryTest::VIDEO_UPLOAD_PATH . "vc_h264:basic:3.1/video_id");
  }

  public function test_audio_codec(){
    // should support a string value
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'audio_codec' => 'acc' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "ac_acc/video_id");
  }

  public function test_bit_rate(){
    // should support an integer value
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'bit_rate' => 2048 ), CloudinaryTest::VIDEO_UPLOAD_PATH . "br_2048/video_id");
    // should support "<integer>k"
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'bit_rate' => '44k' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "br_44k/video_id");
    // should support "<integer>m"
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'bit_rate' => '1m' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "br_1m/video_id");
  }

  public function test_audio_frequency(){
    // should support an integer value
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'audio_frequency' => 44100 ), CloudinaryTest::VIDEO_UPLOAD_PATH . "af_44100/video_id");
  }

  public function test_video_sampling(){
    // should support an integer value
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'video_sampling' => 20 ), CloudinaryTest::VIDEO_UPLOAD_PATH . "vs_20/video_id");
    // should support an string value in the a form of '<float>s'
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'video_sampling' => "2.3s" ), CloudinaryTest::VIDEO_UPLOAD_PATH . "vs_2.3s/video_id");
  }

  public function test_start_offset(){
    // should support decimal seconds
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'start_offset' => 2.63 ), CloudinaryTest::VIDEO_UPLOAD_PATH . "so_2.63/video_id");
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'start_offset' => '2.63' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "so_2.63/video_id");
    // should support percents of the video length as "<number>p"
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'start_offset' => '35p' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "so_35p/video_id");
    // should support percents of the video length as "<number>%"
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'start_offset' => '35%' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "so_35p/video_id");
  }

  public function test_end_offset(){
    // should support decimal seconds
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'end_offset' => 2.63 ), CloudinaryTest::VIDEO_UPLOAD_PATH . "eo_2.63/video_id");
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'end_offset' => '2.63' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "eo_2.63/video_id");
    // should support percents of the video length as "<number>p"
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'end_offset' => '35p' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "eo_35p/video_id");
    // should support percents of the video length as "<number>%"
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'end_offset' => '35%' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "eo_35p/video_id");
  }

  public function test_duration(){
    // should support decimal seconds
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'duration' => 2.63 ), CloudinaryTest::VIDEO_UPLOAD_PATH . "du_2.63/video_id");
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'duration' => '2.63' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "du_2.63/video_id");
    // should support percents of the video length as "<number>p"
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'duration' => '35p' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "du_35p/video_id");
    // should support percents of the video length as "<number>%"
    $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'duration' => '35%' ), CloudinaryTest::VIDEO_UPLOAD_PATH . "du_35p/video_id");
  }

  public function test_offset(){
    foreach(
        array(
        'eo_3.21,so_2.66' => '2.66..3.21',
        'eo_3.22,so_2.67' => array(2.67, 3.22),
        'eo_70p,so_35p' => array('35%', '70%'),
        'eo_71p,so_36p' => array('36p', '71p'),
        'eo_70.5p,so_35.5p' => array('35.5p', '70.5p')
      ) as $transformation => $offset
    ) {
      $this->cloudinary_url_assertion("video_id", array('resource_type' => 'video', 'offset' => $offset ), CloudinaryTest::VIDEO_UPLOAD_PATH . $transformation . "/video_id");
    }
  }

  public function test_cl_video_thumbnail_path() {
    $this->assertEquals(cl_video_thumbnail_path('movie_id'), CloudinaryTest::VIDEO_UPLOAD_PATH. "movie_id.jpg");
    $this->assertEquals(cl_video_thumbnail_path('movie_id', array('width' => 100)), CloudinaryTest::VIDEO_UPLOAD_PATH. "w_100/movie_id.jpg");
  }

  public function test_cl_video_thumbnail_tag() {
    $expected_url = CloudinaryTest::VIDEO_UPLOAD_PATH. "movie_id.jpg";
    $this->assertEquals(cl_video_thumbnail_tag('movie_id'),
      "<img src='$expected_url' />");

    $expected_url = CloudinaryTest::VIDEO_UPLOAD_PATH. "w_100/movie_id.jpg";
    $this->assertEquals(cl_video_thumbnail_tag('movie_id', array('width' => 100)),
      "<img src='$expected_url' width='100'/>");

  }

  public function test_cl_video_tag(){
    //default
    $expected_url = CloudinaryTest::VIDEO_UPLOAD_PATH. "movie";
    $this->assertEquals(cl_video_tag('movie'), "<video poster='$expected_url.jpg'>" .
      "<source src='$expected_url.webm' type='video/webm'>" .
      "<source src='$expected_url.mp4' type='video/mp4'>" .
      "<source src='$expected_url.ogv' type='video/ogg'>" .
      "</video>");
  }

  public function test_cl_video_tag_with_attributes(){
    //test video attributes
    $expected_url = CloudinaryTest::VIDEO_UPLOAD_PATH. "movie";
    $this->assertEquals(cl_video_tag('movie', array('autoplay' => TRUE, 'controls', 'loop', 'muted' => "true", 'preload', 'style' => 'border: 1px')),
      "<video autoplay='1' controls loop muted='true' poster='$expected_url.jpg' preload style='border: 1px'>" .
      "<source src='$expected_url.webm' type='video/webm'>" .
      "<source src='$expected_url.mp4' type='video/mp4'>" .
      "<source src='$expected_url.ogv' type='video/ogg'>" .
      "</video>");
  }

  public function test_cl_video_tag_with_transformation(){
    //test video attributes
    $options = array(
          'source_types' => "mp4",
          'html_height'  => "100",
          'html_width'   => "200",
          'video_codec'  => array( 'codec' => 'h264' ),
          'audio_codec'  => 'acc',
          'start_offset' => 3);
    $expected_url = CloudinaryTest::VIDEO_UPLOAD_PATH . "ac_acc,so_3,vc_h264/movie";
    $this->assertEquals(cl_video_tag('movie', $options),
      "<video height='100' poster='$expected_url.jpg' src='$expected_url.mp4' width='200'></video>");

    unset($options['source_types']);
    $this->assertEquals(cl_video_tag('movie', $options),
      "<video height='100' poster='$expected_url.jpg' width='200'>" .
      "<source src='$expected_url.webm' type='video/webm'>" .
      "<source src='$expected_url.mp4' type='video/mp4'>" .
      "<source src='$expected_url.ogv' type='video/ogg'>" .
      "</video>");

    unset($options['html_height']);
    unset($options['html_width']);
    $options['width'] = 250;
    $expected_url = CloudinaryTest::VIDEO_UPLOAD_PATH . "ac_acc,so_3,vc_h264,w_250/movie";
    $this->assertEquals(cl_video_tag('movie', $options),
      "<video poster='$expected_url.jpg' width='250'>" .
      "<source src='$expected_url.webm' type='video/webm'>" .
      "<source src='$expected_url.mp4' type='video/mp4'>" .
      "<source src='$expected_url.ogv' type='video/ogg'>" .
      "</video>");

    $expected_url = CloudinaryTest::VIDEO_UPLOAD_PATH . "ac_acc,c_fit,so_3,vc_h264,w_250/movie";
    $options['crop'] = 'fit';
    $this->assertEquals(cl_video_tag('movie', $options),
      "<video poster='$expected_url.jpg'>" .
      "<source src='$expected_url.webm' type='video/webm'>" .
      "<source src='$expected_url.mp4' type='video/mp4'>" .
      "<source src='$expected_url.ogv' type='video/ogg'>" .
      "</video>");
  }

  public function test_cl_video_tag_with_fallback(){
    $expected_url = CloudinaryTest::VIDEO_UPLOAD_PATH. "movie";
    $fallback = "<span id='spanid'>Cannot display video</span>";
    $this->assertEquals(cl_video_tag('movie', array('fallback_content' => $fallback)),
      "<video poster='$expected_url.jpg'>" .
      "<source src='$expected_url.webm' type='video/webm'>" .
      "<source src='$expected_url.mp4' type='video/mp4'>" .
      "<source src='$expected_url.ogv' type='video/ogg'>" .
      $fallback .
      "</video>");
    $this->assertEquals(cl_video_tag('movie', array('fallback_content' => $fallback, 'source_types' => "mp4")),
      "<video poster='$expected_url.jpg' src='$expected_url.mp4'>" .
      $fallback .
      "</video>");

  }

  public function test_cl_video_tag_with_source_types(){
    $expected_url = CloudinaryTest::VIDEO_UPLOAD_PATH. "movie";
    $this->assertEquals(cl_video_tag('movie', array('source_types' => array('ogv', 'mp4'))),
      "<video poster='$expected_url.jpg'>" .
      "<source src='$expected_url.ogv' type='video/ogg'>" .
      "<source src='$expected_url.mp4' type='video/mp4'>" .
      "</video>");
  }

  public function test_cl_video_tag_with_source_transformation(){
    $expected_url = CloudinaryTest::VIDEO_UPLOAD_PATH. "q_50/w_100/movie";
    $expected_ogv_url = CloudinaryTest::VIDEO_UPLOAD_PATH. "q_50/q_70,w_100/movie";
    $expected_mp4_url = CloudinaryTest::VIDEO_UPLOAD_PATH. "q_50/q_30,w_100/movie";
    $this->assertEquals(cl_video_tag('movie', array('width' => 100, 'transformation' => array(array('quality' => 50)), 'source_transformation' => array(
      'ogv' => array('quality' => 70),
      'mp4' => array('quality' => 30)))),
      "<video poster='$expected_url.jpg' width='100'>" .
      "<source src='$expected_url.webm' type='video/webm'>" .
      "<source src='$expected_mp4_url.mp4' type='video/mp4'>" .
      "<source src='$expected_ogv_url.ogv' type='video/ogg'>" .
      "</video>");

    $this->assertEquals(cl_video_tag('movie', array('width' => 100, 'transformation' => array(array('quality' => 50)), 'source_transformation' => array(
      'ogv' => array('quality' => 70),
      'mp4' => array('quality' => 30)),
      'source_types' => array('webm', 'mp4'))),
      "<video poster='$expected_url.jpg' width='100'>" .
      "<source src='$expected_url.webm' type='video/webm'>" .
      "<source src='$expected_mp4_url.mp4' type='video/mp4'>" .
      "</video>");
  }

  public function test_cl_video_tag_with_poster(){
    $expected_url = CloudinaryTest::VIDEO_UPLOAD_PATH . "movie";

    $expected_poster_url = 'http://image/somewhere.jpg';
    $this->assertEquals(cl_video_tag('movie', array('poster' => $expected_poster_url, 'source_types' => "mp4")),
      "<video poster='$expected_poster_url' src='$expected_url.mp4'></video>");

    $expected_poster_url = CloudinaryTest::VIDEO_UPLOAD_PATH . "g_north/movie.jpg";
    $this->assertEquals(cl_video_tag('movie', array('poster' => array('gravity' => 'north'), 'source_types' => "mp4")),
      "<video poster='$expected_poster_url' src='$expected_url.mp4'></video>");

    $expected_poster_url = CloudinaryTest::DEFAULT_UPLOAD_PATH . "g_north/my_poster.jpg";
    $this->assertEquals(cl_video_tag('movie', array('poster' => array('gravity' => 'north', 'public_id' => 'my_poster', 'format' => 'jpg'), 'source_types' => "mp4")),
      "<video poster='$expected_poster_url' src='$expected_url.mp4'></video>");

    $this->assertEquals(cl_video_tag('movie', array('poster' => NULL, 'source_types' => "mp4")),
      "<video src='$expected_url.mp4'></video>");

    $this->assertEquals(cl_video_tag('movie', array('poster' => FALSE, 'source_types' => "mp4")),
      "<video src='$expected_url.mp4'></video>");
  }

  public function test_upload_tag(){
    $pattern = "/<input class='cloudinary-fileupload' ".
      "data-cloudinary-field='image' ".
      "data-form-data='{\"timestamp\":\d+,\"signature\":\"\w+\",\"api_key\":\"a\"}' ".
      "data-url='http[^']+\/v1_1\/test123\/auto\/upload' ".
      "name='file' type='file'\/>/";
    $this->assertRegExp( $pattern, cl_upload_tag('image'));
    $this->assertRegExp( $pattern, cl_image_upload_tag('image'));

    $pattern =  "/<input class='cloudinary-fileupload' ".
      "data-cloudinary-field='image' ".
      "data-form-data='{\"timestamp\":\d+,\"signature\":\"\w+\",\"api_key\":\"a\"}' ".
      "data-max-chunk-size='5000000' ".
      "data-url='http[^']+\/v1_1\/test123\/auto\/upload_chunked' ".
      "name='file' type='file'\/>/";
    $this->assertRegExp( $pattern,
      cl_upload_tag('image', array('chunk_size' => 5000000)));

     $pattern =  "/<input class='classy cloudinary-fileupload' ".
      "data-cloudinary-field='image' ".
      "data-form-data='{\"timestamp\":\d+,\"signature\":\"\w+\",\"api_key\":\"a\"}' ".
      "data-url='http[^']+\/v1_1\/test123\/auto\/upload' ".
      "name='file' type='file'\/>/";
    $this->assertRegExp( $pattern,
      cl_upload_tag('image', array("html" => array('class' => 'classy'))));
  }

    public function layers_options() {
        return array(
            "public_id" => array(array("public_id"=>"logo"),"logo"),
            "public_id with folder" => array(array("public_id"=>"folder/logo"),"folder:logo"),
            "private" => array(array("public_id"=>"logo","type"=>"private"),"private:logo"),
            "format" => array(array("public_id"=>"logo","format"=>"png"),"logo.png"),
            "video" => array(array("resource_type"=>"video","public_id"=>"cat"),"video:cat"),
            "text" => array(array("public_id"=>"logo","text"=>"Hello World, Nice to meet you?"),"text:logo:Hello%20World%252C%20Nice%20to%20meet%20you%3F"),
            "text with slash" => array(array("text"=>"Hello World, Nice/ to meet you?", "font_family"=>"Arial", "font_size"=>"18"),"text:Arial_18:Hello%20World%252C%20Nice%252F%20to%20meet%20you%3F"),
            "text with font family and size" => array(array("text"=>"Hello World, Nice to meet you?", "font_family"=>"Arial", "font_size"=>"18"),"text:Arial_18:Hello%20World%252C%20Nice%20to%20meet%20you%3F"),
            "text with style" => array(array("text"=>"Hello World, Nice to meet you?", "font_family"=>"Arial", "font_size"=>"18", "font_weight"=>"bold", "font_style"=>"italic", "letter_spacing"=>4),"text:Arial_18_bold_italic_letter_spacing_4:Hello%20World%252C%20Nice%20to%20meet%20you%3F"),
            "subtitles" => array(array("resource_type"=>"subtitles","public_id"=>"sample_sub_en.srt"),"subtitles:sample_sub_en.srt"),
            "subtitles with font family and size" => array(array("resource_type"=>"subtitles","public_id"=>"sample_sub_he.srt", "font_family"=>"Arial", "font_size"=>"40"),"subtitles:Arial_40:sample_sub_he.srt"),
            "fetch" => array(array("public_id"=>"logo",'fetch' => 'https://cloudinary.com/images/old_logo.png'), 'fetch:aHR0cHM6Ly9jbG91ZGluYXJ5LmNvbS9pbWFnZXMvb2xkX2xvZ28ucG5n'),

        );
    }

    /**
     * @dataProvider layers_options
     */
  public function test_overlay_options($options, $expected) {
    $reflector = new ReflectionClass('Cloudinary');
    $process_layer = $reflector->getMethod('process_layer');
    $process_layer->setAccessible(true);
      $result = $process_layer->invoke(NULL, $options, "overlay");
      $this->assertEquals($expected, $result);
  }

  public function test_ignore_default_values_in_overlay_options() {
      $options = array("public_id"=>"logo","type"=>"upload", "resource_type"=>"image");
      $expected= "logo";
    $reflector = new ReflectionClass('Cloudinary');
    $process_layer = $reflector->getMethod('process_layer');
    $process_layer->setAccessible(true);
      $result = $process_layer->invoke(NULL, $options, "overlay");
      $this->assertEquals($expected, $result);
  }


  /**
   * @expectedException InvalidArgumentException
   * @expectedExceptionMessage Must supply either style parameters or a public_id when providing text parameter in a text overlay
   */
    public function test_text_require_public_id_or_style(){
        $options = array("overlay"=>array("text"=>"text"));
        Cloudinary::cloudinary_url("test", $options);
    }

  /**
   * @expectedException InvalidArgumentException
   * @expectedExceptionMessage Must supply font_family for text in overlay
   */
  public function test_overlay_style_requires_font_family() {
    $options = array("overlay"=>array("text"=>"text", "font_style"=>"italic"));
    Cloudinary::cloudinary_url("test", $options);
  }

    public function resource_types() {
        return array(
            "image" => array("image"),
            "video" => array("video"),
            "raw" => array("raw"),
            "subtitles" => array("subtitles"),
        );
    }

  /**
   * @expectedException InvalidArgumentException
   * @expectedExceptionMessageRegExp #Must supply public_id for .* underlay#
   * @dataProvider resource_types
   */
  public function test_underlay_require_public_id_for_non_text($resource_type) {
    $options = array("underlay"=>array("resource_type"=>$resource_type));
    Cloudinary::cloudinary_url("test", $options);
  }

  /**
    * should support and translate operators: '=', '!=', '<', '>', '<=', '>=', '&&', '||'
    * and variables: width, height, pages, faces, aspect_ratio
    */
  public function test_translate_if() {
      $allOperators =
          'if_'           .
          'w_eq_0_and'    .
          '_h_ne_0_or'    .
          '_ar_lt_0_and'   .
          '_pc_gt_0_and'   .
          '_fc_lte_0_and'  .
          '_w_gte_0'      .
          ',e_grayscale';
      $condition = "width = 0 && height != 0 || aspect_ratio < 0 && page_count > 0 and face_count <= 0 and width >= 0";
      $options = array("if"=>$condition, "effect"=>"grayscale");
      $transformation = Cloudinary::generate_transformation_string($options);
      $this->assertEquals($allOperators, $transformation);
      $this->assertEquals(array(), $options);
      $options = array("if"=>"aspect_ratio > 0.3 && aspect_ratio < 0.5", "effect"=>"grayscale");
      $transformation = Cloudinary::generate_transformation_string($options);
      $this->assertEquals("if_ar_gt_0.3_and_ar_lt_0.5,e_grayscale", $transformation);
      $this->assertEquals(array(), $options);

  }


  public function test_array_should_define_set_of_variables() {
    $options = array(
      'if' => "face_count > 2",
      'crop' => "scale",
      'width' => '$foo * 200',
      'variables' => array(
        '$z' => 5,
        '$foo' => '$z * 2'
      ),
    );

    $t = Cloudinary::generate_transformation_string($options);
    $this->assertEquals('if_fc_gt_2,$z_5,$foo_$z_mul_2,c_scale,w_$foo_mul_200', $t);
  }

  public function test_key_should_define_variable() {
    $options = array(
      'transformation' => array(
          array('$foo' => 10),
          array('if' => "face_count > 2"),
          array('crop' => "scale", 'width' => '$foo * 200 / face_count'),
          array('if' => "end"),
        )
    );

    $t = Cloudinary::generate_transformation_string($options);
    $this->assertEquals('$foo_10/if_fc_gt_2/c_scale,w_$foo_mul_200_div_fc/if_end', $t);
  }

  public function test_should_sort_defined_variable() {
    $options = array(
          '$second' => 1,
          '$first' => 2,
    );

    $t = Cloudinary::generate_transformation_string($options);
    $this->assertEquals('$first_2,$second_1', $t);
  }

  public function test_should_place_defined_variables_before_ordered(){
      $options = array(
          'variables' => array(
              '$z' => 5,
              '$foo' => '$z * 2'
          ),
          '$second' => 1,
          '$first' => 2,
      );

      $t = Cloudinary::generate_transformation_string($options);
      $this->assertEquals('$first_2,$second_1,$z_5,$foo_$z_mul_2', $t);
  }

  public function test_should_support_text_values() {
    $e =  array(
      'effect' => '$efname:100',
      '$efname' => '!blur!'
    );
    $t = Cloudinary::generate_transformation_string($e);

    $this->assertEquals('$efname_!blur!,e_$efname:100', $t);
  }

  public function test_should_support_string_interpolation() {
    $this->cloudinary_url_assertion(
      "sample",
      array(
        'crop' => 'scale',
        'overlay' => array(
          'text' => '$(start)Hello $(name)$(ext), $(no ) $( no)$(end)',
          'font_family' => "Arial",
          'font_size' => "18",
        ),
      ),
      CloudinaryTest::DEFAULT_UPLOAD_PATH . 'c_scale,l_text:Arial_18:$(start)Hello%20$(name)$(ext)%252C%20%24%28no%20%29%20%24%28%20no%29$(end)/sample'
    );
  }


  private function cloudinary_url_assertion($source, $options, $expected, $expected_options = array()) {
    $url = Cloudinary::cloudinary_url($source, $options);
    $this->assertEquals($expected_options, $options);
    $this->assertEquals($expected, $url);
  }

}
?>

