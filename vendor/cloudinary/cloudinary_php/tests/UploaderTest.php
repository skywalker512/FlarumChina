<?php
namespace Cloudinary {
  $base = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR;
  require_once($base .'Cloudinary.php');
  require_once($base . 'Uploader.php');
  require_once($base . 'Api.php');
  require_once( 'TestHelper.php');
  use Cloudinary;
  use Exception;

  class UploaderTest extends \PHPUnit\Framework\TestCase {

    public $url_prefix;
    public static function setUpBeforeClass() {
      Curl::$instance = new Curl();
    }
    public function setUp() {
          \Cloudinary::reset_config();
          if (!Cloudinary::config_get("api_secret")) {
              $this->markTestSkipped('Please setup environment for Upload test to run');
          }
          $this->url_prefix = Cloudinary::config_get("upload_prefix", "https://api.cloudinary.com");

      }

      public function tearDown() {
          Curl::$instance = new Curl();
      }

	  public function test_upload() {
		  $result = Uploader::upload( TEST_IMG );
		  switch ( $result["resource_type"] ) {
			  case "image":
				  // generate image tag
				  break;
			  case "video":
				  // generate video tag
				  break;
		  }

          $this->assertEquals($result["width"], 241);
          $this->assertEquals($result["height"], 51);
          $expected_signature = Cloudinary::api_sign_request(array("public_id"=>$result["public_id"], "version"=>$result["version"]), Cloudinary::config_get("api_secret"));
          $this->assertEquals($result["signature"], $expected_signature);
		  Curl::mockUpload($this);

		  Uploader::upload(TEST_IMG, array("ocr"=>"adv_ocr"));
		  $fields = Curl::$instance->fields();
		  $this->assertArraySubset(array("ocr"=>"adv_ocr"),$fields);

	  }
  
      public function test_rename() {
        Curl::mockUpload($this);
        Uploader::rename("foobar", "foobar2", array("overwrite" => TRUE));
        assertUrl($this, "/image/rename");
        assertParam($this, "overwrite", 1);
        assertParam($this, "from_public_id", "foobar");
        assertParam($this, "to_public_id", "foobar2");
      }
  
      public function test_rename_to_type() {
        Curl::mockUpload($this);
        Uploader::rename("foobar", "foobar", array("to_type" => "private"));
        assertUrl($this, "/image/rename");
        assertParam($this, "to_type", "private");
        assertParam($this, "from_public_id", "foobar");
        assertParam($this, "to_public_id", "foobar");
      }

      public function test_explicit() {
        Curl::mockUpload($this);

        Uploader::explicit("cloudinary", array("type"=>"twitter_name", "eager"=>array("crop"=>"scale", "width"=>"2.0")));
        $fields = Curl::$instance->fields();
        $this->assertArraySubset(array("type"=>"twitter_name", "eager"=> "c_scale,w_2.0"),$fields);
        Uploader::explicit("cloudinary", array("ocr" => "adv_ocr"));
        $fields = Curl::$instance->fields();
        $this->assertArraySubset(array("ocr" => "adv_ocr"),$fields);
      }

	  public function test_build_eager() {
		  $eager = array(
			  "0" => array(
				  "0" => array(
					  "width" => 3204,
					  "crop"  => "scale"
				  ),
			  ),
			  "1" => array(
				  "angle" => array(
					  "0" => 127
				  ),

				  "format" => "jpg"
			  )


		  );
		  $this->assertEquals("c_scale,w_3204|a_127/jpg",Cloudinary::build_eager($eager));
	  }

      public function test_eager() {
        Curl::mockUpload($this);
        Uploader::upload(TEST_IMG, array("eager"=>array("crop"=>"scale", "width"=>"2.0")));
        $fields = Curl::$instance->fields();
        $this->assertArraySubset(array("eager"=> "c_scale,w_2.0"),$fields);
      }
  
      public function test_upload_async() {
        Curl::mockUpload($this);
        Uploader::upload(TEST_IMG, array("transformation"=>array("crop"=>"scale", "width"=>"2.0"), "async"=>TRUE));
        $fields = Curl::$instance->fields();
        $this->assertArraySubset(array("async"=> TRUE),$fields);
      }
  
      public function test_headers() {
          Uploader::upload(TEST_IMG, array("headers"=>array("Link: 1")));
          Uploader::upload(TEST_IMG, array("headers"=>array("Link" => "1")));
      }
  
      public function test_text() {
          $result = Uploader::text("hello world");
          $this->assertGreaterThan(1, $result["width"]);
          $this->assertGreaterThan(1, $result["height"]);
      }
  
      public function test_tags() {
          $api = new \Cloudinary\Api();      
          $result = Uploader::upload(TEST_IMG);
        Curl::mockUpload($this);
        Uploader::add_tag("tag1", "foobar");
        assertUrl($this, "/image/tags");
        assertPost($this);
        assertParam($this, "public_ids[0]", "foobar");
        assertParam($this, "command", "add");
        assertParam($this, "tag", "tag1");

        Uploader::remove_tag("tag1", "foobar");
        assertUrl($this, "/image/tags");
        assertPost($this);
        assertParam($this, "public_ids[0]", "foobar");
        assertParam($this, "command", "remove");
        assertParam($this, "tag", "tag1");

        Uploader::replace_tag("tag3", "foobar");
        assertUrl($this, "/image/tags");
        assertPost($this);
        assertParam($this, "public_ids[0]", "foobar");
        assertParam($this, "command", "replace");
        assertParam($this, "tag", "tag3");
      }
  
      /**
       * Test issue #33 - HTTP 502 when providing a large public ID list
       */
      public function test_huge_public_id_list() {
          $api = new \Cloudinary\Api();
          $ids = array();
          for( $i=1; $i < 200; $i++){
              $ids[] = "foobarfoobarfoobarfoobarfoobar";
          }
          Uploader::add_tag("huge_list", $ids);
  
      }
      public function test_use_filename() {
          $api = new \Cloudinary\Api();      
          $result = Uploader::upload(TEST_IMG, array("use_filename"=>TRUE));
          $this->assertRegExp('/logo_[a-zA-Z0-9]{6}/', $result["public_id"]);
          $result = Uploader::upload(TEST_IMG, array("use_filename"=>TRUE, "unique_filename"=>FALSE));
          $this->assertEquals("logo", $result["public_id"]);
      }
      
      public function test_allowed_formats() {
          //should allow whitelisted formats if allowed_formats
          $formats = array("png"); 
          $result = Uploader::upload(TEST_IMG, array("allowed_formats" => $formats));
          $this->assertEquals($result["format"], "png");
      }
  
      public function test_allowed_formats_with_illegal_format() {
          //should prevent non whitelisted formats from being uploaded if allowed_formats is specified
          $error_found = FALSE;
          $formats = array("jpg"); 
          try{
            Uploader::upload(TEST_IMG, array("allowed_formats" => $formats));
          } catch (Exception $e) {
            $error_found = TRUE;
          }
          $this->assertTrue($error_found);
      }
      
      public function test_allowed_formats_with_format() {
          //should allow non whitelisted formats if type is specified and convert to that type
          $formats = array("jpg"); 
          $result = Uploader::upload(TEST_IMG, array("allowed_formats" => $formats, "format" => "jpg"));
          $this->assertEquals("jpg", $result["format"]);
      }
      
      public function test_face_coordinates() {
          //should allow sending face and custom coordinates
          $face_coordinates = array(array(120, 30, 109, 51), array(121, 31, 110, 51));
          $result = Uploader::upload(TEST_IMG, array("face_coordinates" => $face_coordinates, "faces" => TRUE));
          $this->assertEquals($face_coordinates, $result["faces"]);
  
          $different_face_coordinates = array(array(122, 32, 111, 152));
          $custom_coordinates = array(1,2,3,4);
          Uploader::explicit($result["public_id"], array("face_coordinates" => $different_face_coordinates, "custom_coordinates" => $custom_coordinates, "faces" => TRUE, "type" => "upload"));
          $api = new \Cloudinary\Api();
          $info = $api->resource($result["public_id"], array("faces" => true, "coordinates" => true));
          $this->assertEquals($info["faces"], $different_face_coordinates);
          $this->assertEquals($info["coordinates"], array("faces"=>$different_face_coordinates, "custom"=>array($custom_coordinates)));
      }
      
      public function test_context() {
          //should allow sending context
          $context = array("caption" => "cap=caps", "alt" => "alternative|alt=a");
          $result = Uploader::upload(TEST_IMG, array("context" => $context));

          $api = new \Cloudinary\Api();
          $info = $api->resource($result["public_id"]);
          $this->assertEquals($context, $info["context"]["custom"]);

          $fields = Curl::$instance->parameters[CURLOPT_POSTFIELDS];
          $this->assertEquals('caption=cap\=caps|alt=alternative\|alt\=a', $fields['context']);
      }

      public function test_context_api() {
        $api = new \Cloudinary\Api();
        $result = Uploader::upload(TEST_IMG);
        Uploader::add_context('alt=testAlt|custom=testCustom', $result['public_id']);
        // fwrite(STDERR, print_r($result['public_id'], TRUE));
        assertUrl($this, "/image/context");
        assertPost($this);
        assertParam($this, "public_ids[0]", $result['public_id']);
        assertParam($this, "command", "add");
        assertParam($this, "context", "alt=testAlt|custom=testCustom");

        $info = $api->resource($result["public_id"]);
        $this->assertEquals(array("custom" => array("alt" => "testAlt", "custom" => "testCustom")), $info["context"]);

        Uploader::remove_all_context($result['public_id']);
        assertUrl($this, "/image/context");
        assertGet($this);

        $info = $api->resource($result["public_id"]);
        $this->assertEquals(false, isset($info["context"]));
      }
      
      public function test_cl_form_tag() {
          Cloudinary::config(array("cloud_name"=>"test123", "secure_distribution" => NULL, "private_cdn" => FALSE, "api_key" => "1234"));
  
          $form = cl_form_tag("http://callback.com", array("public_id"=>"hello", "form"=>array("class"=>"uploader")));
          $this->assertRegExp(<<<TAG
#<form enctype='multipart\/form-data' action='{$this->url_prefix}\/v1_1\/test123\/image\/upload' method='POST' class='uploader'>
<input name='timestamp' type='hidden' value='\d+'\/>
<input name='public_id' type='hidden' value='hello'\/>
<input name='signature' type='hidden' value='[0-9a-f]+'\/>
<input name='api_key' type='hidden' value='1234'\/>
<\/form>#
TAG
, $form);
      }
      public function test_cl_image_upload_tag() {
          Cloudinary::config(array("cloud_name"=>"test123", "secure_distribution" => NULL, "private_cdn" => FALSE, "api_key" => "1234"));
  
          $tag = cl_image_upload_tag("image", array("public_id"=>"hello", "html"=>array("class"=>"uploader")));
          $this->assertRegExp("#<input class='uploader cloudinary-fileupload' data-cloudinary-field='image' data-form-data='{\"timestamp\":\d+,\"public_id\":\"hello\",\"signature\":\"[0-9a-f]+\",\"api_key\":\"1234\"}' data-url='{$this->url_prefix}\/v1_1\/test123\/auto\/upload' name='file' type='file'\/>#", $tag);
      }
    
      function test_manual_moderation() {
          // should support setting manual moderation status
          $resource = Uploader::upload(TEST_IMG, array("moderation"=>"manual"));
          $this->assertEquals($resource["moderation"][0]["status"], "pending");
          $this->assertEquals($resource["moderation"][0]["kind"], "manual");
      }
      
      /**
       * @expectedException \Cloudinary\Error
       * @expectedExceptionMessage illegal is not a valid
       */
      function test_raw_conversion() {
          // should support requesting raw_convert 
          Uploader::upload("tests/docx.docx", array("resource_type"=>"raw", "raw_convert" => "illegal"));
      }
    
      /**
       * @expectedException \Cloudinary\Error
       * @expectedExceptionMessage invalid
       */
      function test_categorization() {
          // should support requesting categorization 
          Uploader::upload(TEST_IMG, array("categorization" => "illegal"));
      }
    
      /**
       * @expectedException \Cloudinary\Error
       * @expectedExceptionMessage illegal is not a valid
       */
      function test_detection() {
          // should support requesting detection 
          Uploader::upload(TEST_IMG, array("detection" => "illegal"));
      }
    
      /**
       * @expectedException \Cloudinary\Error
       * @expectedExceptionMessage Must use
       */
      function test_auto_tagging() {
          // should support requesting auto_tagging 
          Uploader::upload(TEST_IMG, array("auto_tagging" => 0.5));
      }
      
      /**
       * @expectedException \Cloudinary\Error
       * @expectedExceptionMessage Background removal is invalid
       */
      function test_background_removal() {
          // should support requesting background_removal 
          Uploader::upload(TEST_IMG, array("background_removal" => "illegal"));
      }
  
      function test_large_upload() {
          $temp_file_name = tempnam(sys_get_temp_dir(), 'cldupload.test.');
          $temp_file = fopen($temp_file_name, 'w');
          fwrite($temp_file, "BMJ\xB9Y\x00\x00\x00\x00\x00\x8A\x00\x00\x00|\x00\x00\x00x\x05\x00\x00x\x05\x00\x00\x01\x00\x18\x00\x00\x00\x00\x00\xC0\xB8Y\x00a\x0F\x00\x00a\x0F\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xFF\x00\x00\xFF\x00\x00\xFF\x00\x00\x00\x00\x00\x00\xFFBGRs\x00\x00\x00\x00\x00\x00\x00\x00T\xB8\x1E\xFC\x00\x00\x00\x00\x00\x00\x00\x00fff\xFC\x00\x00\x00\x00\x00\x00\x00\x00\xC4\xF5(\xFF\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00");
          for ($i = 1; $i <= 588000; $i++) {
            fwrite($temp_file, "\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF");
          }
          fclose($temp_file);
          $this->assertEquals(5880138, filesize($temp_file_name));
  
          $resource = Uploader::upload_large($temp_file_name, array("chunk_size" => 5243000, "tags" => array("upload_large_tag")));
          $this->assertEquals($resource["tags"], array("upload_large_tag"));
          $this->assertEquals($resource["resource_type"], "raw");
  
          $resource = Uploader::upload_large($temp_file_name, array("chunk_size" => 5243000, "tags" => array("upload_large_tag"), "resource_type" => "image"));
          $this->assertEquals($resource["tags"], array("upload_large_tag"));
          $this->assertEquals($resource["resource_type"], "image");
          $this->assertEquals($resource["width"], 1400);
          $this->assertEquals($resource["height"], 1400);
  
          #where chunk size equals file size
          $resource = Uploader::upload_large($temp_file_name, array("chunk_size" => 5880138, "tags" => array("upload_large_tag"), "resource_type" => "image"));
          $this->assertEquals($resource["tags"], array("upload_large_tag"));
          $this->assertEquals($resource["resource_type"], "image");
          $this->assertEquals($resource["width"], 1400);
          $this->assertEquals($resource["height"], 1400);
      }
  
      function test_upload_preset() {
        // should support unsigned uploading using presets
        $api = new \Cloudinary\Api();
          $preset = $api->create_upload_preset(array("folder"=>"upload_folder", "unsigned"=>TRUE));
          $result = Uploader::unsigned_upload(TEST_IMG, $preset["name"]);
          $this->assertRegExp('/^upload_folder\/[a-z0-9]+$/', $result["public_id"]);
          $api->delete_upload_preset($preset["name"]);
  
      }

      /**
       * @expectedException Cloudinary\Error
       * @expectedExceptionMessage timed out
       */
      function test_upload_timeout()
      {
          $timeout = Cloudinary::config_get("timeout");
          Cloudinary::config(array( "timeout" => 1 ));
          $this->assertEquals(Cloudinary::config_get("timeout"), 1);
          try {
            // Use a lengthy PNG transformation
            $transformation = array("crop" => "scale", "width" => "2.0", "angle" => 33);
            Uploader::upload(TEST_IMG, array("eager"=>array("transformation"=>array($transformation, $transformation))));
          } catch ( Exception $e ) {
              // Finally not supported in PHP 5.3
              Cloudinary::config(array( "timeout", $timeout ));
              throw $e;
          }
  
      }
  
      function test_upload_responsive_breakpoints()
      {
          $response = Uploader::upload(TEST_IMG, array("responsive_breakpoints"=>array(array("create_derived"=>FALSE))));
          $this->assertArrayHasKey("responsive_breakpoints", $response, "Should return responsive_breakpoints information");
          $this->assertEquals(2, count($response["responsive_breakpoints"][0]["breakpoints"]));
      }
  
  }
}