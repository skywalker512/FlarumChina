<?php
$base = realpath(dirname(__FILE__).DIRECTORY_SEPARATOR.'..');
require_once(join(DIRECTORY_SEPARATOR, array($base, 'src', 'Cloudinary.php')));
require_once(join(DIRECTORY_SEPARATOR, array($base, 'src', 'Uploader.php')));
require_once(join(DIRECTORY_SEPARATOR, array($base, 'src', 'Api.php')));

class ApiTest extends PHPUnit_Framework_TestCase {
  static $initialized = FALSE;  
  static $timestamp_tag;
  /** @var  \Cloudinary\Api $api */
  private $api;
  
  public static function setUpBeforeClass()
  {
    if (Cloudinary::config_get("api_secret")) {

      $api = new \Cloudinary\Api();


      self::delete_resources($api);
      self::delete_transformations($api);
      self::delete_presets($api);

      self::$timestamp_tag = "api_test_tag_" . time();
      self::upload_sample_resources();
    } else {
      self::markTestSkipped('Please setup environment for Api test to run');
    }
  }

  public static function tearDownAfterClass()
  {
    if (Cloudinary::config_get("api_secret")) {

      $api = new \Cloudinary\Api();


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
      $api->delete_resources(array("api_test", "api_test2", "api_test3", "api_test5"));
      $api->delete_resources_by_tag('api_test_tag');
    } catch (Exception $e) {
    }
  }

  /**
   * Delete all test related transformations
   * @param \Cloudinary\Api $api an initialized api object
   */
  protected static function delete_transformations($api ){
    $transformations = array(
        "api_test_transformation",
        "api_test_transformation2",
        "api_test_transformation3"
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
    $presets = array("api_test_upload_preset",
        "api_test_upload_preset2",
        "api_test_upload_preset3",
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
    \Cloudinary\Uploader::upload("tests/logo.png",
        array("public_id" => "api_test", "tags" => array("api_test_tag", self::$timestamp_tag), "context" => "key=value", "eager" => array("transformation" => array("width" => 100, "crop" => "scale"))));
    \Cloudinary\Uploader::upload("tests/logo.png",
        array("public_id" => "api_test2", "tags" => array("api_test_tag", self::$timestamp_tag), "context" => "key=value", "eager" => array("transformation" => array("width" => 100, "crop" => "scale"))));
  }


  public function setUp() {
    if (!Cloudinary::config_get("api_secret")) {
      $this->markTestSkipped('Please setup environment for API test to run');
    }
    if (!isset($this->api)) {
      $this->api = new \Cloudinary\Api();
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
    $result = $this->api->resources();
    $resource = $this->find_by_attr($result["resources"], "public_id", "api_test"); 
    $this->assertNotEquals($resource, NULL);    
    $this->assertEquals($resource["type"], "upload");
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
    $result = $this->api->resources(array("type"=>"upload", "context" => true, "tags" => true));
    $resource = $this->find_by_attr($result["resources"], "public_id", "api_test"); 
    $context_map = function($resource) {
      if (array_key_exists("context", $resource) && array_key_exists("key", $resource["context"]["custom"])) {
        return $resource["context"]["custom"]["key"];
      } else {
        return NULL;
      }
    };
    $tags_map = function($resource) {
        return $resource["tags"] == array("api_test_tag", ApiTest::$timestamp_tag);
    };
    $context_values = array_map($context_map, $result["resources"]);  
    $tags = array_map($tags_map, $result["resources"]);  
    $this->assertNotEquals($resource, NULL);
    $this->assertContains("value", $context_values);
    $this->assertContains(TRUE, $tags);
  }

  function test05_resources_by_prefix() {
    // should allow listing resources by prefix 
    $result = $this->api->resources(array("type"=>"upload", "prefix"=>"api_test", "context" => true, "tags" => true));
    $func = function($resource) {
        return $resource["public_id"];
    };
    $context_map = function($resource) {
      if (array_key_exists("context", $resource)) {
        return $resource["context"]["custom"]["key"];
      } else {
        return NULL;
      }
    };
    $tags_map = function($resource) {
        return $resource["tags"] == array("api_test_tag", ApiTest::$timestamp_tag);
    };
    $context_values = array_map($context_map, $result["resources"]);  
    $tags = array_map($tags_map, $result["resources"]);  
    $public_ids = array_map($func, $result["resources"]);  
    $this->assertContains("api_test", $public_ids);
    $this->assertContains("api_test2", $public_ids);
    $this->assertContains("value", $context_values);
    $this->assertContains(TRUE, $tags);
  }
  
  function test_resources_by_public_ids() {
    // should allow listing resources by public ids 
    $result = $this->api->resources_by_ids(array("api_test", "api_test2", "api_test3"), array("context" => true, "tags" => true));
    $id_map = function($resource) {
        return $resource["public_id"];
    };
    $context_map = function($resource) {
        return $resource["context"]["custom"]["key"];
    };
    $tags_map = function($resource) {
        return $resource["tags"] == array("api_test_tag", ApiTest::$timestamp_tag);
    };
    $public_ids = array_map($id_map, $result["resources"]); 
    $context_values = array_map($context_map, $result["resources"]);  
    $tags = array_map($tags_map, $result["resources"]);  
    $this->assertContains("api_test", $public_ids);
    $this->assertContains("api_test2", $public_ids);
    $this->assertContains("value", $context_values);
    $this->assertNotContains(FALSE, $tags);
  }
  
  function test_resources_direction() {
    // should allow listing resources and specify direction 
    $asc_resources = $this->api->resources_by_tag(ApiTest::$timestamp_tag, array("type"=>"upload", "direction"=>"asc"))["resources"];
    $desc_resources = $this->api->resources_by_tag(ApiTest::$timestamp_tag, array("type"=>"upload", "direction"=>"desc"))["resources"];
    $this->assertEquals(array_reverse($asc_resources), $desc_resources);
    $asc_resources_alt = $this->api->resources_by_tag(ApiTest::$timestamp_tag, array("type"=>"upload", "direction"=>1))["resources"];
    $desc_resources_alt = $this->api->resources_by_tag(ApiTest::$timestamp_tag, array("type"=>"upload", "direction"=>-1))["resources"];
    $this->assertEquals(array_reverse($asc_resources_alt), $desc_resources_alt);
    $this->assertEquals($asc_resources_alt, $asc_resources);
  }
  
  function test06_resources_tag() {
    // should allow listing resources by tag 
    $result = $this->api->resources_by_tag("api_test_tag");
    $resource = $this->find_by_attr($result["resources"], "public_id", "api_test"); 
    $this->assertNotEquals($resource, NULL);
  }
  
  function test07_resource_metadata() {
    // should allow get resource metadata 
    $resource = $this->api->resource("api_test");
    $this->assertNotEquals($resource, NULL); 
    $this->assertEquals($resource["public_id"], "api_test");
    $this->assertEquals($resource["bytes"], 3381);
    $this->assertEquals(count($resource["derived"]), 1);
  }
  
  function test08_delete_derived() {
    // should allow deleting derived resource 
    \Cloudinary\Uploader::upload("tests/logo.png", array("public_id"=>"api_test3", "eager"=>array("transformation"=>array("width"=> 101,"crop" => "scale"))));    
    $resource = $this->api->resource("api_test3");
    $this->assertNotEquals($resource, NULL);    
    $this->assertEquals(count($resource["derived"]), 1);
    $derived_resource_id = $resource["derived"][0]["id"];
    $this->api->delete_derived_resources(array($derived_resource_id));
    $resource = $this->api->resource("api_test3");
    $this->assertNotEquals($resource, NULL);    
    $this->assertEquals(count($resource["derived"]), 0);
  }
  
  /**
   * @expectedException \Cloudinary\Api\NotFound
   */
  function test09_delete_resources() {
    // should allow deleting resources 
    \Cloudinary\Uploader::upload("tests/logo.png", array("public_id"=>"api_test3"));
    $resource = $this->api->resource("api_test3");
    $this->assertNotEquals($resource, NULL);    
    $this->api->delete_resources(array("apit_test", "api_test2", "api_test3"));
    $this->api->resource("api_test3");
  }

  /**
   * @expectedException \Cloudinary\Api\NotFound
   */
  function test09a_delete_resources_by_prefix() {
    // should allow deleting resources 
    \Cloudinary\Uploader::upload("tests/logo.png", array("public_id"=>"api_test_by_prefix"));
    $resource = $this->api->resource("api_test_by_prefix");
    $this->assertNotEquals($resource, NULL);    
    $this->api->delete_resources_by_prefix("api_test_by");
    $this->api->resource("api_test_by_prefix");
  }

  /**
   * @expectedException \Cloudinary\Api\NotFound
   */
  function test09b_delete_resources_by_tag() {
    // should allow deleting resources 
    \Cloudinary\Uploader::upload("tests/logo.png", array("public_id"=>"api_test4", "tags"=>array("api_test_tag_for_delete")));
    $resource = $this->api->resource("api_test4");
    $this->assertNotEquals($resource, NULL);    
    $this->api->delete_resources_by_tag("api_test_tag_for_delete");
    $this->api->resource("api_test4");
  }
  
  function test10_tags() {
    // should allow listing tags
    $result = $this->api->tags(); 
    $tags = $result["tags"];
    $this->assertContains("api_test_tag", $tags);
  }
  
  function test11_tags_prefix() {
    // should allow listing tag by prefix
    $result = $this->api->tags(array("prefix"=>"api_test")); 
    $tags = $result["tags"];
    $this->assertContains("api_test_tag", $tags);
    $result = $this->api->tags(array("prefix"=>"api_test_no_such_tag"));
    $tags = $result["tags"];
    $this->assertEquals(count($tags), 0);
  }

  function test12_transformations() {
    // should allow listing transformations 
    $result = $this->api->transformations();    
    $transformation = $this->find_by_attr($result["transformations"], "name", "c_scale,w_100");

    $this->assertNotEquals($transformation, NULL);    
    $this->assertEquals($transformation["used"], TRUE);
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
    $this->api->update_transformation("c_scale,w_100", array("allowed_for_strict"=>TRUE));
    $transformation = $this->api->transformation("c_scale,w_100");
    $this->assertNotEquals($transformation, NULL);    
    $this->assertEquals($transformation["allowed_for_strict"], TRUE);
    $this->api->update_transformation("c_scale,w_100", array("allowed_for_strict"=>FALSE));
    $transformation = $this->api->transformation("c_scale,w_100");
    $this->assertNotEquals($transformation, NULL);
    $this->assertEquals($transformation["allowed_for_strict"], FALSE);
  }

  function test15_transformation_create() {
    // should allow creating named transformation 
    $this->api->create_transformation("api_test_transformation", array("crop" => "scale", "width" => 102));
    $transformation = $this->api->transformation("api_test_transformation");
    $this->assertNotEquals($transformation, NULL);    
    $this->assertEquals($transformation["allowed_for_strict"], TRUE);
    $this->assertEquals($transformation["info"], array(array("crop"=> "scale", "width"=> 102)));
    $this->assertEquals($transformation["used"], FALSE);
  }

  function test15a_transformation_unsafe_update() {
    // should allow unsafe update of named transformation 
    $this->api->create_transformation("api_test_transformation3", array("crop" => "scale", "width" => 102));
    $this->api->update_transformation("api_test_transformation3", array("unsafe_update"=>array("crop"=>"scale", "width"=>103)));
    $transformation = $this->api->transformation("api_test_transformation3");
    $this->assertNotEquals($transformation, NULL);    
    $this->assertEquals($transformation["info"], array(array("crop"=> "scale", "width"=> 103)));
    $this->assertEquals($transformation["used"], FALSE);
  }
  
  function test16a_transformation_delete() {
    // should allow deleting named transformation 
    $this->api->create_transformation("api_test_transformation2", array("crop" => "scale", "width" => 103));
    $this->api->transformation("api_test_transformation2");
    $this->api->delete_transformation("api_test_transformation2");
  }
  
  /**
   * @expectedException \Cloudinary\Api\NotFound
   */
  function test16b_transformation_delete() {
    $this->api->transformation("api_test_transformation2");
  }
  
  function test17a_transformation_delete_implicit() {
    // should allow deleting implicit transformation 
    $this->api->transformation("c_scale,w_100");
    $this->api->delete_transformation("c_scale,w_100");
  }
  
  /**
   * @expectedException \Cloudinary\Api\NotFound
   */
  function test17b_transformation_delete_implicit() {  
    $this->api->transformation("c_scale,w_100");
  }
  
  function test18_usage() {
    // should allow listing resource_types
    $result = $this->api->usage(); 
    $this->assertNotEquals($result["last_updated"], NULL);
  }
  
  function test19_delete_derived() {
    // should allow deleting all resources 
    $this->markTestSkipped("Not enabled by default - remove this line to test");
    \Cloudinary\Uploader::upload("tests/logo.png", array("public_id"=>"api_test5", "eager"=>array("transformation"=>array("width"=> 101,"crop" => "scale"))));    
    $resource = $this->api->resource("api_test5");
    $this->assertNotEquals($resource, NULL);    
    $this->assertEquals(count($resource["derived"]), 1);
    $this->api->delete_all_resources(array("keep_original" => True));
    $resource = $this->api->resource("api_test5");
    $this->assertNotEquals($resource, NULL);    
    $this->assertEquals(count($resource["derived"]), 0);
  }
  
  
  function test20_manual_moderation() {
    // should support setting manual moderation status
    $resource = \Cloudinary\Uploader::upload("tests/logo.png", array("moderation"=>"manual"));    
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
    $resource = \Cloudinary\Uploader::upload("tests/docx.docx", array("resource_type"=>"raw"));    
    $this->api->update($resource["public_id"], array("raw_convert" => "illegal", "resource_type"=>"raw"));
  }

  /**
   * @expectedException \Cloudinary\Api\BadRequest
   * @expectedExceptionMessage Illegal value
   */
  function test23_categorization() {
    // should support requesting categorization 
    $this->api->update("api_test", array("categorization" => "illegal"));
  }

  /**
   * @expectedException \Cloudinary\Api\BadRequest
   * @expectedExceptionMessage Illegal value
   */
  function test24_detection() {
    // should support requesting detection 
    $this->api->update("api_test", array("detection" => "illegal"));
  }

  /**
   * @expectedException \Cloudinary\Api\BadRequest
   * @expectedExceptionMessage Illegal value
   */
  function test25_background_removal() {
    // should support requesting background_removal 
    $this->api->update("api_test", array("background_removal" => "illegal"));
  }

  /**
   * @expectedException \Cloudinary\Api\BadRequest
   * @expectedExceptionMessage Must use
   */
  function test26_auto_tagging() {
    // should support requesting auto_tagging 
    $this->api->update("api_test", array("auto_tagging" => 0.5));
  }

  function test27_start_at() {
      // should allow listing resources by start date
      sleep(2);
      $start_at = (new DateTime())->format(DateTime::ISO8601);
      sleep(2);
      $response = \Cloudinary\Uploader::upload("tests/logo.png");
      $api_repsonse = $this->api->resources(array("type"=>"upload", "start_at"=>$start_at, "direction"=>"asc"));
      $resources = $api_repsonse["resources"];
      $this->assertEquals(count($resources), 1);
      $this->assertEquals($resources[0]["public_id"], $response["public_id"]);
  }

  function test28_create_list_upload_presets() {
      // should allow creating and listing upload_presets
      $this->api->create_upload_preset(array("name"=>"api_test_upload_preset", "folder"=>"folder"));
      $this->api->create_upload_preset(array("name"=>"api_test_upload_preset2", "folder"=>"folder2"));
      $this->api->create_upload_preset(array("name"=>"api_test_upload_preset3", "folder"=>"folder3"));
      $api_response = $this->api->upload_presets();
      $presets = $api_response["presets"];
      $this->assertGreaterThanOrEqual(3, count($presets));
      $this->assertEquals($presets[0]["name"], "api_test_upload_preset3");
      $this->assertEquals($presets[1]["name"], "api_test_upload_preset2");
      $this->assertEquals($presets[2]["name"], "api_test_upload_preset");
      $this->api->delete_upload_preset("api_test_upload_preset");
      $this->api->delete_upload_preset("api_test_upload_preset2");
      $this->api->delete_upload_preset("api_test_upload_preset3");
  }

  function test29_get_upload_presets() {
      // should allow getting a single upload_preset
      $result = $this->api->create_upload_preset(array("unsigned"=>TRUE, "folder"=>"folder", "width"=>100, "crop"=>"scale", "tags"=>array("a","b","c"), "context"=>array("a"=>"b","c"=>"d")));
      $name = $result["name"];
      $preset = $this->api->upload_preset($name);
      $this->assertEquals($preset["name"], $name);
      $this->assertEquals($preset["unsigned"], TRUE);
      $settings = $preset["settings"];
      $this->assertEquals($settings["folder"], "folder");
      $this->assertEquals($settings["transformation"], array(array("width"=>100,"crop"=>"scale")));
      $this->assertEquals($settings["context"], array("a"=>"b", "c"=>"d"));
      $this->assertEquals($settings["tags"], array("a","b","c"));
      $this->api->delete_upload_preset($name);
  }

  function test30_delete_upload_presets() {
      // should allow deleting upload_presets
      $this->api->create_upload_preset(array("name"=>"api_test_upload_preset4", "folder"=>"folder"));
      $preset = $this->api->upload_preset("api_test_upload_preset4");
      $this->api->delete_upload_preset("api_test_upload_preset4");
      try {
        $preset = $this->api->upload_preset("api_test_upload_preset4");
        $this->fail();
      } catch (\Cloudinary\Api\NotFound $expected) {
      }
  }

  function test31_update_upload_presets() {
      // should allow getting a single upload_preset
      $result = $this->api->create_upload_preset(array("folder"=>"folder"));
      $name = $result["name"];
      $preset = $this->api->upload_preset($name);
      $this->api->update_upload_preset($name, array_merge($preset["settings"], array("colors"=>TRUE, "unsigned"=>TRUE, "disallow_public_id"=>TRUE)));
      $preset = $this->api->upload_preset($name);
      $this->assertEquals($preset["unsigned"], TRUE);
      $this->assertEquals($preset["settings"], array("folder"=>"folder", "colors"=>TRUE, "disallow_public_id"=>TRUE));
      $this->api->delete_upload_preset($name);
  }

  function test32_folder_listing() {
    $this->markTestSkipped("For this test to work, 'Auto-create folders' should be enabled in the Upload Settings, and the account should be empty of folders. Comment out this line if you really want to test it.");
    \Cloudinary\Uploader::upload("tests/logo.png", array("public_id" => "test_folder1/item"));
    \Cloudinary\Uploader::upload("tests/logo.png", array("public_id" => "test_folder2/item"));
    \Cloudinary\Uploader::upload("tests/logo.png", array("public_id" => "test_folder1/test_subfolder1/item"));
    \Cloudinary\Uploader::upload("tests/logo.png", array("public_id" => "test_folder1/test_subfolder2/item"));
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
    $this->api->subfolders("test_folder");
  }

  function test34_restore() {
    \Cloudinary\Uploader::upload("tests/logo.png", array("public_id" => "api_test_restore", "backup"=>TRUE));
    $resource = $this->api->resource("api_test_restore");
    $this->assertNotEquals($resource, NULL);
    $this->assertEquals($resource["bytes"], 3381);
    $this->api->delete_resources(array("api_test_restore"));
    $resource = $this->api->resource("api_test_restore");
    $this->assertNotEquals($resource, NULL);
    $this->assertEquals($resource["bytes"], 0);
    $this->assertEquals($resource["placeholder"], TRUE);
    $response = $this->api->restore(array("api_test_restore"));
    $info = $response["api_test_restore"];
    $this->assertNotEquals($info, NULL);
    $this->assertEquals($info["bytes"], 3381);
    $resource = $this->api->resource("api_test_restore");
    $this->assertNotEquals($resource, NULL);
    $this->assertEquals($resource["bytes"], 3381);
  }

  function test35_upload_mapping() {
    try{$this->api->delete_upload_mapping("api_test_upload_mapping");} catch (Exception $e) {}
    $this->api->create_upload_mapping("api_test_upload_mapping", array("template"=>"http://cloudinary.com"));
    $result = $this->api->upload_mapping("api_test_upload_mapping");
    $this->assertEquals($result["template"], "http://cloudinary.com");
    $this->api->update_upload_mapping("api_test_upload_mapping", array("template"=>"http://res.cloudinary.com"));
    $result = $this->api->upload_mapping("api_test_upload_mapping");
    $this->assertEquals($result["template"], "http://res.cloudinary.com");
    $result = $this->api->upload_mappings();
    $this->assertContains(array("folder"=>"api_test_upload_mapping","template"=>"http://res.cloudinary.com"), $result["mappings"]);
    $this->api->delete_upload_mapping("api_test_upload_mapping");
    $result = $this->api->upload_mappings();
    $this->assertNotContains("api_test_upload_mapping", $result["mappings"]);
  }
}
