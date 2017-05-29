<?php

namespace Cloudinary {
  $base = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR;
  require_once($base .'Cloudinary.php');
  require_once($base . 'Uploader.php');
  require_once($base . 'Api.php');
  require_once( 'TestHelper.php');

  use Cloudinary;
  use Exception;

  class ApiTest extends \PHPUnit\Framework\TestCase {
  static $api_test_tag = "cloudinary_php_test";
  static $initialized = FALSE;
  static $timestamp_tag;
  static $api_test;
  static $api_test_2;
  static $api_test_3;
  static $api_test_4;
  static $api_test_5;

  static $api_test_upload_preset;
  static $api_test_upload_preset_2;
  static $api_test_upload_preset_3;

  static $api_test_transformation = "api_test_transformation";
  static $api_test_transformation_2 = "api_test_transformation2";
  static $api_test_transformation_3 = "api_test_transformation3";
  const URL_QUERY_REGEX = "\??(\w+=\w*&?)*";

	  /** @var  \Cloudinary\Api $api */
  private $api;

  public static function setUpBeforeClass()
  {
    Curl::$instance = new Curl();
    if (Cloudinary::config_get("api_secret")) {
      self::$api_test_tag = self::$api_test_tag . "_". SUFFIX;
      self::$api_test_upload_preset = "api_test_upload_preset" . SUFFIX;
      self::$api_test_upload_preset_2 = "api_test_upload_preset2" . SUFFIX;
      self::$api_test_upload_preset_3 = "api_test_upload_preset3" . SUFFIX;

      self::$api_test = "api_test" . SUFFIX;
      self::$api_test_2 = "api_test2" . SUFFIX;
      self::$api_test_3 = "api_test,3" . SUFFIX;
      self::$api_test_4 = "api_test4" . SUFFIX;
      self::$api_test_5 = "api_test5" . SUFFIX;

      self::$api_test_transformation = "api_test_transformation" . SUFFIX;
      self::$api_test_transformation_2 = "api_test_transformation2" . SUFFIX;
      self::$api_test_transformation_3 = "api_test_transformation3" . SUFFIX;

      self::$timestamp_tag = self::$api_test_tag . "_" . time();
      self::upload_sample_resources();
    } else {
      self::markTestSkipped('Please setup environment for Api test to run');
    }
  }

  public function tearDown(){
    Curl::$instance = new Curl();

  }
  public static function tearDownAfterClass()
  {
    if (Cloudinary::config_get("api_secret")) {

      $api = new Cloudinary\Api();


      self::delete_resources($api);
      self::delete_transformations($api);
      self::delete_presets($api);

    } else {
      self::fail("You need to configure the cloudinary api for the tests to work.");
    }

  }


  /**
   * Delete all test related resources
   * @param \Cloudinary\Api $api an initialized api object
   */
  protected static function delete_resources($api)
  {
    try {
      $api->delete_resources(array(self::$api_test, self::$api_test_2, self::$api_test_3, self::$api_test_5));
      $api->delete_resources_by_tag(self::$api_test_tag);
    } catch (Exception $e) {
    }
  }

  /**
   * Delete all test related transformations
   * @param \Cloudinary\Api $api an initialized api object
   */
  protected static function delete_transformations($api ){
    $transformations = array(
        self::$api_test_transformation,
        self::$api_test_transformation_2,
        self::$api_test_transformation_3
    );

    foreach ($transformations as $t) {
      try {
        $api->delete_transformation($t);
      } catch (Exception $e) {}

    }



  }

  /**
   * Delete all test related presets
   * @param \Cloudinary\Api $api
   */
  protected static function delete_presets($api) {
    $presets = array(self::$api_test_upload_preset,
      self::$api_test_upload_preset_2,
      self::$api_test_upload_preset_3,
        "api_test_upload_preset4"
    );
    foreach ($presets as $p) {
      try {
        $api->delete_upload_preset($p);
      } catch (Exception $e) {
      }
    }


  }

  /**
   * Upload sample resources. These resources need to be present for some of the tests to work.
   */
  protected static function upload_sample_resources()
  {
    Uploader::upload(TEST_IMG,
                                 array("public_id" => self::$api_test, "tags" => array(self::$api_test_tag, self::$timestamp_tag), "context" => "key=value", "eager" => array("transformation" => array("width" => 100, "crop" => "scale"))));
    Uploader::upload(TEST_IMG,
                                 array("public_id" => self::$api_test_2, "tags" => array(self::$api_test_tag, self::$timestamp_tag), "context" => "key=value", "eager" => array("transformation" => array("width" => 100, "crop" => "scale"))));
  }


  protected function setUp() {
    if (!Cloudinary::config_get("api_secret")) {
      $this->markTestSkipped('Please setup environment for API test to run');
    }
    if (!isset($this->api)) {
      $this->api = new Api();
    }

  }

  function find_by_attr($elements, $attr, $value) {
    foreach ($elements as $element) {
      if ($element[$attr] == $value) return $element;
    }
    return NULL;
  }

  function test01_resource_types() {
    // should allow listing resource_types
    $result = $this->api->resource_types();
    $this->assertContains("image", $result["resource_types"]);
  }

  function test02_resources() {
    // should allow listing resources
    Curl::mockApi($this);
    $this->api->resources();
    Curl::$instance->fields();
    assertUrl($this, "/resources/image");
  }

  function test03_resources_cursor() {
    // should allow listing resources with cursor
    $result = $this->api->resources(array("max_results"=>1));
    $this->assertNotEquals($result["resources"], NULL);
    $this->assertEquals(count($result["resources"]), 1);
    $this->assertNotEquals($result["next_cursor"], NULL);

    $result2 = $this->api->resources(array("max_results"=>1, "next_cursor"=>$result["next_cursor"]));
    $this->assertNotEquals($result2["resources"], NULL);
    $this->assertEquals(count($result2["resources"]), 1);
    $this->assertNotEquals($result2["resources"][0]["public_id"], $result["resources"][0]["public_id"]);
  }

  function test04_resources_by_type() {
    // should allow listing resources by type
    Curl::mockApi($this);
    $this->api->resources(array("type"=>"upload", "context" => true, "tags" => true));
    assertUrl($this, "/resources/image/upload");
    assertParam($this, "context", 1);
    assertParam($this, "tags", 1);
  }

  function test05_resources_by_prefix() {
    // should allow listing resources by prefix
    Curl::mockApi($this);
    $this->api->resources(array("type"=>"upload", "prefix"=> "api_test", "context" => true, "tags" => true));
    assertUrl($this, "/resources/image/upload");
    assertParam($this, "prefix", "api_test");
    assertParam($this, "context", 1);
    assertParam($this, "tags", 1);
  }

  function test_resources_by_public_ids() {
    // should allow listing resources by public ids
    Curl::mockApi($this);
    $public_ids = array(self::$api_test, self::$api_test_2, self::$api_test_3);
    $this->api->resources_by_ids($public_ids, array("context" => true, "tags" => true));
    assertParam($this, "public_ids", $public_ids);
    assertParam($this, "context", 1);
    assertParam($this, "tags", 1);
  }

    function test_resources_direction() {
        // should allow listing resources and specify direction
      Curl::mockApi($this);
      $this->api->resources_by_tag("foobar",
                                   array("type" => "upload", "direction" => "asc"));
      assertGet($this);
      assertUrl($this, "/resources/image/tags/foobar");
      assertParam($this, "direction", "asc");
      $this->api->resources_by_tag("foobar",
                                   array("type" => "upload", "direction" => "desc"));
      assertGet($this);
      assertUrl($this, "/resources/image/tags/foobar");
      assertParam($this, "direction", "desc");
    }

  function test06_resources_tag() {
    // should allow listing resources by tag
    Curl::mockApi($this);
    $this->api->resources_by_tag("foobar");
    assertUrl($this, "/resources/image/tags/foobar");
    assertGet($this);
  }

  function test07_resource_metadata() {
    // should allow get resource metadata
    $resource = $this->api->resource(self::$api_test);
    $this->assertNotEquals($resource, NULL);
    $this->assertEquals($resource["public_id"], self::$api_test);
    $this->assertEquals($resource["bytes"], LOGO_SIZE);
    $this->assertEquals(count($resource["derived"]), 1);
  }

  function test08_delete_derived() {
    // should allow deleting derived resource
    // Following commented code provided as reference

//    Uploader::upload(self::LOGO_PNG, array("public_id"=>self::$api_test_3, "eager"=>array("transformation"=>array("width"=> 101,"crop" => "scale"))));
//    $resource = $this->api->resource(self::$api_test_3);
//    $this->assertNotEquals($resource, NULL);
//    $this->assertEquals(count($resource["derived"]), 1);
//    $derived_resource_id = $resource["derived"][0]["id"];

    $derived_resource_id = "foobar";
    Curl::mockApi($this);
    $this->api->delete_derived_resources(array($derived_resource_id));
    assertDelete($this);
    assertUrl($this, "/derived_resources");
    assertParam($this, "derived_resource_ids[0]", $derived_resource_id);

//    $resource = $this->api->resource(self::$api_test_3);
//    $this->assertNotEquals($resource, NULL);
//    $this->assertEquals(count($resource["derived"]), 0);
  }

  function test09_delete_resources() {
    // should allow deleting resources

    Curl::mockApi($this);
    $this->api->delete_resources(array("apit_test", self::$api_test_2, self::$api_test_3), array("transformation"=>"c_crop,w_100"));
    assertUrl($this, "/resources/image/upload");
    $this->assertEquals("DELETE", Curl::$instance->http_method(), "http method should be DELETE");
    assertParam($this, "public_ids[0]", "apit_test");
    assertParam($this, "transformation", "c_crop,w_100");

  }

  function test09a_delete_resources_by_prefix() {
    // should allow deleting resources
    Curl::mockApi($this);
    $this->api->delete_resources_by_prefix("fooba");
    assertUrl($this, "/resources/image/upload");
    assertDelete($this);
    assertParam($this, "prefix", "fooba");
  }

  function test09b_delete_resources_by_tag() {
    // should allow deleting resources
    Curl::mockApi($this);
    $this->api->delete_resources_by_tag("api_test_tag_for_delete");
    assertUrl($this, "/resources/image/tags/api_test_tag_for_delete");
    assertDelete($this);
  }

  function test10_tags() {
    // should allow listing tags
    Curl::mockApi($this);
    $this->api->tags();
    assertUrl($this, "/tags/image");
    assertGet($this);
  }

  function test11_tags_prefix() {
    // should allow listing tag by prefix
    Curl::mockApi($this);
    $this->api->tags(array("prefix" => "fooba"));
    assertUrl($this, "/tags/image");
    assertGet($this);
    assertParam($this, "prefix", "fooba");
  }

  function test12_transformations() {
    // should allow listing transformations
    $result = $this->api->transformations(array("max_results" => "500"));
    $transformation = $this->find_by_attr($result["transformations"], "name", "c_scale,w_100");

    $this->assertNotEquals($transformation, NULL);
    $this->assertEquals($transformation["used"], TRUE);
  }

  function test_transformation_cursor() {
    Curl::mockApi($this);
    $this->api->transformation("c_scale,w_100", array( "next_cursor"=>"234123132345"));
    assertUrl($this, "/transformations/c_scale,w_100");
    assertParam($this, "next_cursor", "234123132345", "api->transformation should pass the next_cursor paramter");
  }

  function test13_transformation_metadata() {
    // should allow getting transformation metadata
    $transformation = $this->api->transformation("c_scale,w_100");
    $this->assertNotEquals($transformation, NULL);
    $this->assertEquals($transformation["info"], array(array("crop"=> "scale", "width"=> 100)));
    $transformation = $this->api->transformation(array("crop"=> "scale", "width"=> 100));
    $this->assertNotEquals($transformation, NULL);
    $this->assertEquals($transformation["info"], array(array("crop"=> "scale", "width"=> 100)));
  }

  function test14_transformation_update() {
    // should allow updating transformation allowed_for_strict
    Curl::mockApi($this);
    $this->api->update_transformation("c_scale,w_100", array("allowed_for_strict" => TRUE));
    assertUrl($this, "/transformations/c_scale,w_100");
    assertPut($this);
    assertParam($this, "allowed_for_strict", 1);
  }

  function test15_transformation_create() {
    // should allow creating named transformation
    Curl::mockApi($this);
    $this->api->create_transformation(self::$api_test_transformation, array("crop" => "scale", "width" => 102));
    assertUrl($this, "/transformations/" . self::$api_test_transformation);
    assertPost($this);
    assertParam($this, "transformation", "c_scale,w_102");

  }

  function test15a_transformation_unsafe_update() {
    // should allow unsafe update of named transformation
    $this->api->create_transformation(self::$api_test_transformation_3, array("crop" => "scale", "width" => 102));
    $this->api->update_transformation(self::$api_test_transformation_3, array("unsafe_update"=>array("crop"=>"scale", "width"=>103)));
    $transformation = $this->api->transformation(self::$api_test_transformation_3);
    $this->assertNotEquals($transformation, NULL);
    $this->assertEquals($transformation["info"], array(array("crop"=> "scale", "width"=> 103)));
    $this->assertEquals($transformation["used"], FALSE);
  }

  function test16a_transformation_delete() {
    // should allow deleting named transformation
    $this->api->create_transformation(self::$api_test_transformation_2, array("crop" => "scale", "width" => 103));
    $this->api->transformation(self::$api_test_transformation_2);
    $this->api->delete_transformation(self::$api_test_transformation_2);
  }

  function test17a_transformation_delete_implicit() {
    // should allow deleting implicit transformation
    Curl::mockApi($this);
    $this->api->delete_transformation("c_scale,w_100");
    assertUrl($this, "/transformations/c_scale,w_100");
    assertDelete($this);

  }

  function test_transformation_delete_with_invalidate() {
    // should allow deleting and invalidating a transformation
    Curl::mockApi($this);

    // should pass 'invalidate' param when 'invalidate' is set to true
    $this->api->delete_transformation("c_scale,w_100,a_90", array("invalidate" => true));
    assertUrl($this, "/transformations/c_scale,w_100,a_90");
    assertDelete($this);
    assertParam($this, "invalidate", "1");

    // should pass 'invalidate' param when 'invalidate' is set to false
    $this->api->delete_transformation("c_scale,w_100,a_90", array("invalidate" => false));
    assertUrl($this, "/transformations/c_scale,w_100,a_90");
    assertDelete($this);
    assertParam($this, "invalidate", "");

    // should not pass 'invalidate' param if not set
    $this->api->delete_transformation("c_scale,w_100,a_90");
    assertUrl($this, "/transformations/c_scale,w_100,a_90");
    assertDelete($this);
    assertNoParam($this, "invalidate");
  }

  function test18_usage() {
    // should allow listing resource_types
    $result = $this->api->usage();
    $this->assertNotEquals($result["last_updated"], NULL);
  }

  function test19_delete_derived() {
    // should allow deleting all resources
    $this->markTestSkipped("Not enabled by default - remove this line to test");
    Uploader::upload(TEST_IMG, array("public_id"=> self::$api_test_5, "eager"=>array("transformation"=>array("width"=> 101,"crop" => "scale"))));
    $resource = $this->api->resource(self::$api_test_5);
    $this->assertNotEquals($resource, NULL);
    $this->assertEquals(count($resource["derived"]), 1);
    $this->api->delete_all_resources(array("keep_original" => True));
    $resource = $this->api->resource(self::$api_test_5);
    $this->assertNotEquals($resource, NULL);
    $this->assertEquals(count($resource["derived"]), 0);
  }


  function test20_manual_moderation() {
    // should support setting manual moderation status
    $resource = Uploader::upload(TEST_IMG, array("moderation"=>"manual"));
    $this->assertEquals($resource["moderation"][0]["status"], "pending");
    $this->assertEquals($resource["moderation"][0]["kind"], "manual");

    $api_result = $this->api->update($resource["public_id"], array("moderation_status" => "approved"));
    $this->assertEquals($api_result["moderation"][0]["status"], "approved");
    $this->assertEquals($api_result["moderation"][0]["kind"], "manual");
  }

  /**
   * @expectedException \Cloudinary\Api\BadRequest
   * @expectedExceptionMessage Illegal value
   */
  function test22_raw_conversion() {
    // should support requesting raw_convert
    $resource = Uploader::upload(RAW_FILE, array("resource_type"=>"raw"));
    $this->api->update($resource["public_id"], array("raw_convert" => "illegal", "resource_type"=>"raw"));
  }

  /**
   * @expectedException \Cloudinary\Api\BadRequest
   * @expectedExceptionMessage Illegal value
   */
  function test23_categorization() {
    // should support requesting categorization
    $this->api->update(self::$api_test, array("categorization" => "illegal"));
  }

  /**
   * @expectedException \Cloudinary\Api\BadRequest
   * @expectedExceptionMessage Illegal value
   */
  function test24_detection() {
    // should support requesting detection
    $this->api->update(self::$api_test, array("detection" => "illegal"));
  }

  /**
   * @expectedException \Cloudinary\Api\BadRequest
   * @expectedExceptionMessage Illegal value
   */
  function test25_background_removal() {
    // should support requesting background_removal
    $this->api->update(self::$api_test, array("background_removal" => "illegal"));
  }

  function test26_auto_tagging() {
    // should support requesting auto_tagging
    Curl::mockApi($this);
    $this->api->update("foobar", array("auto_tagging" => 0.5));
    assertUrl($this, "/resources/image/upload/foobar");
    assertPost($this);
    assertParam($this, "auto_tagging", 0.5);
  }

  function test26_1_ocr() {
    // should support requesting auto_tagging
    Curl::mockApi($this);
    $this->api->update("foobar", array("ocr" => "adv_ocr"));
    assertParam($this, "ocr", "adv_ocr");
  }

  function test27_start_at() {
      // should allow listing resources by start date
    Curl::mockApi($this);
    $dateTime = new \DateTime();
    $start_at = $dateTime->format(\DateTime::ISO8601);
    $this->api->resources(array("type"=>"upload", "start_at"=>$start_at, "direction"=>"asc"));
    assertUrl($this, "/resources/image/upload");
    assertParam($this, "start_at", $start_at);
    assertParam($this, "direction", "asc");
  }

  function test28_create_upload_presets() {
    // should allow creating and listing upload_presets
    Curl::mockApi($this);
    $this->api->create_upload_preset(array("name" => self::$api_test_upload_preset, "folder" => "folder"));
    assertUrl($this, "/upload_presets");
    assertPost($this);
    assertParam($this, "name", self::$api_test_upload_preset);
    assertParam($this, "folder", "folder");
  }
  
  function test28a_list_upload_presets() {
    // should allow creating and listing upload_presets
    Curl::mockApi($this);
    $this->api->upload_presets();
    assertUrl($this, "/upload_presets");
    assertGet($this);
  }

  function test29_get_upload_presets() {
      // should allow getting a single upload_preset
      $result = $this->api->create_upload_preset(array("unsigned"=>TRUE, "folder"=>"folder", "width"=>100, "crop"=>"scale", "tags"=>array("a","b","c"), "context"=>array("a"=>"b","c"=>"d")));
      $name = $result["name"];
      $preset = $this->api->upload_preset($name);
      $this->assertEquals($preset["name"], $name);
      $this->assertEquals($preset["unsigned"], TRUE);
      $settings = $preset["settings"];
      $this->api->delete_upload_preset($name);
      $this->assertEquals($settings["folder"], "folder");
      $this->assertEquals($settings["transformation"], array(array("width"=>100,"crop"=>"scale")));
      $this->assertEquals($settings["context"], array("a"=>"b", "c"=>"d"));
      $this->assertEquals($settings["tags"], array("a","b","c"));
  }

  function test30_delete_upload_presets() {
      // should allow deleting upload_presets
    Curl::mockApi($this);
    $this->api->delete_upload_preset(self::$api_test_upload_preset);
    assertUrl($this, "/upload_presets/" . self::$api_test_upload_preset);
    assertDelete($this);
  }

  function test31_update_upload_presets() {
    Curl::mockApi($this);
    $this->api->update_upload_preset("foobar", array("colors" => TRUE, "unsigned" => TRUE, "disallow_public_id" => TRUE));
    assertPut($this);
    assertUrl($this, "/upload_presets/foobar");
    assertParam($this, "colors", 1);
    assertParam($this, "unsigned", 1);
    assertParam($this, "disallow_public_id", 1);
  }

  function test32_folder_listing() {
    $this->markTestSkipped("For this test to work, 'Auto-create folders' should be enabled in the Upload Settings, and the account should be empty of folders. Comment out this line if you really want to test it.");
    Uploader::upload(TEST_IMG, array("public_id" => "test_folder1/item"));
    Uploader::upload(TEST_IMG, array("public_id" => "test_folder2/item"));
    Uploader::upload(TEST_IMG, array("public_id" => "test_folder1/test_subfolder1/item"));
    Uploader::upload(TEST_IMG, array("public_id" => "test_folder1/test_subfolder2/item"));
    $result = $this->api->root_folders();
    $this->assertContains(array("name" => "test_folder1", "path" => "test_folder1"), $result["folders"]);
    $this->assertContains(array("name" => "test_folder2", "path" => "test_folder2"), $result["folders"]);
    $result = $this->api->subfolders("test_folder1");
    $this->assertContains(array("name" => "test_subfolder1", "path" => "test_folder1/test_subfolder1"), $result["folders"]);
    $this->assertContains(array("name" => "test_subfolder2", "path" => "test_folder1/test_subfolder2"), $result["folders"]);
  }

  /**
   * @expectedException \Cloudinary\Api\NotFound
   */
  function test33_folder_listing_error() {
    $this->api->subfolders("I-do-not-exist");
  }

  function test34_restore() {
    Curl::mockApi($this);
    $this->api->restore(array("api_test_restore"));
    assertPost($this);
    assertUrl($this, "/resources/image/upload/restore");
    assertParam($this, "public_ids[0]", "api_test_restore");
    
  }

  function test35_upload_mapping() {
    Curl::mockApi($this);

    $this->api->create_upload_mapping("api_test_upload_mapping", array("template"=>"http://cloudinary.com"));
    assertUrl($this, "/upload_mappings");
    assertPost($this);
    assertParam($this, "folder", "api_test_upload_mapping");
    assertParam($this, "template", "http://cloudinary.com");

    $result = $this->api->upload_mapping("api_test_upload_mapping");
    assertUrl($this, "/upload_mappings");
    assertGet($this);
    assertParam($this, "folder", "api_test_upload_mapping");

    $this->api->update_upload_mapping("api_test_upload_mapping", array("template"=>"http://res.cloudinary.com"));
    assertUrl($this, "/upload_mappings");
    assertPut($this);
    assertParam($this, "folder", "api_test_upload_mapping");
    assertParam($this, "template", "http://res.cloudinary.com");

    $this->api->delete_upload_mapping("api_test_upload_mapping");
    assertUrl($this, "/upload_mappings");
    assertDelete($this);
    assertParam($this, "folder", "api_test_upload_mapping");

  }

  static $predefined_profiles = array("4k", "full_hd", "hd", "sd", "full_hd_wifi", "full_hd_lean", "hd_lean");

  function test_create_streaming_profile() {

    $name = self::$api_test . "_streaming_profile";
    $result = $this->api->create_streaming_profile($name, array(
      "representations"=> array(
        array( "transformation" => array("bit_rate"=>"5m", "height"=>1200, "width"=>1200, "crop"=>"limit")))));
    $this->assertArrayHasKey("representations",
                          $result["data"]);
    $reps = $result["data"]["representations"];
    $this->assertTrue(is_array($reps));
    // "transformation is returned as an array
    $this->assertTrue(is_array($reps[0]["transformation"]));

    $tr = $reps[0]["transformation"][0];
    $expected = array("bit_rate" => "5m", "height" => 1200, "width" => 1200, "crop" => "limit");
    $this->assertEquals($expected, $tr);

  }

  function test_update_delete_streaming_profile() {

    $name = self::$api_test . "_streaming_profile_delete";
    try {
      $result = $this->api->create_streaming_profile($name, array(
        "representations"=> array(
          array( "transformation" => array("bit_rate"=>"5m", "height"=>1200, "width"=>1200, "crop"=>"limit")))));
    } catch (Cloudinary\Api\AlreadyExists $e) {

    }
    $result = $this->api->update_streaming_profile($name, array(
      "representations"=> array(
        array( "transformation" => array("bit_rate"=>"5m", "height"=>1000, "width"=>1000, "crop"=>"scale")))));
    $this->assertArrayHasKey("representations",
                          $result["data"]);
    $reps = $result["data"]["representations"];
    $this->assertTrue(is_array($reps));
    // "transformation is returned as an array
    $this->assertTrue(is_array($reps[0]["transformation"]));

    $tr = $reps[0]["transformation"][0];
    $expected = array("bit_rate" => "5m", "height" => 1000, "width" => 1000, "crop" => "scale");
    $this->assertEquals($expected, $tr);

    $result = $this->api->delete_streaming_profile($name);
    $result = $this->api->list_streaming_profiles();
    $this->assertArrayNotHasKey($name,array_map(function($profile){
      return $profile["name"];
    }, $result["data"]));
  }

  function test_get_streaming_profile() {

    $result = $this->api->get_streaming_profile(self::$predefined_profiles[0]);
    $this->assertArrayHasKey("representations",
                          $result["data"]);
    $reps = $result["data"]["representations"];
    $this->assertTrue(is_array($reps));
    // "transformation is returned as an array
    $this->assertTrue(is_array($reps[0]["transformation"]));

    $tr = $reps[0]["transformation"][0];
    $this->assertArrayHasKey("bit_rate", $tr);
    $this->assertArrayHasKey("height", $tr);
    $this->assertArrayHasKey("width", $tr);
    $this->assertArrayHasKey("crop", $tr);
  }

  function test_list_streaming_profile() {

    $result = $this->api->list_streaming_profiles();
    $names = array_map(function ($profile) {
      return $profile["name"];
    }, $result["data"]);
    $this->assertEmpty(array_diff(self::$predefined_profiles, $names));
  }

  function test_update_parameters(){
    Curl::mockApi($this);

    $this->api->update(self::$api_test, array("auto_tagging" => 0.5));
    assertUrl($this, '/resources/image/upload/' . self::$api_test);
    assertParam($this, "auto_tagging", 0.5);
    $fields = Curl::$instance->fields();
    $this->assertArrayNotHasKey("face_coordinates", $fields, "update() should not send empty parameters");
    $this->assertArrayNotHasKey("tags", $fields, "update() should not send empty parameters");
    $this->assertArrayNotHasKey("context", $fields, "update() should not send empty parameters");
    $this->assertArrayNotHasKey("face_coordinates", $fields, "update() should not send empty parameters");
    $this->assertArrayNotHasKey("custom_coordinates", $fields, "update() should not send empty parameters");
  }

}
}
