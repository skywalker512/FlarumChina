<?php
namespace Cloudinary {
  $base = realpath(dirname(__FILE__).DIRECTORY_SEPARATOR.'..');
  require_once(join(DIRECTORY_SEPARATOR, array($base, 'src', 'Cloudinary.php')));
  require_once(join(DIRECTORY_SEPARATOR, array($base, 'src', 'Uploader.php')));
  require_once(join(DIRECTORY_SEPARATOR, array($base, 'src', 'Api.php')));
  require_once( 'TestHelper.php');
  use PHPUnit_Framework_TestCase;

  class ArchiveTest extends PHPUnit_Framework_TestCase {
    public static function setUpBeforeClass() {
      Curl::$instance = new Curl();
    }

    public function setUp() {
          \Cloudinary::reset_config();
          if (!\Cloudinary::config_get("api_secret")) {
            $this->markTestSkipped('Please setup environment for Upload test to run');
          }
          $this->tag = "php_test_" . rand(11111, 99999);

          Uploader::upload("tests/logo.png", array("tags"=>array($this->tag)));
          Uploader::upload("tests/logo.png", array("tags"=>array($this->tag), "width"=>10, "crop"=>"scale"));
      }

      public function tearDown() {
          Curl::$instance = new Curl();
          $api = new \Cloudinary\Api();
          $api->delete_resources_by_tag($this->tag);
    }

      public function test_create_zip() {
          $result = Uploader::create_zip(array("tags"=>$this->tag));
          $this->assertEquals(2, $result["file_count"]);
      }

      public function test_expire_at() {
        Curl::mockUpload($this);
        Uploader::create_zip(array("tags"=>$this->tag, "expire_at"=> date('Y-m-d H:i:s', time() + 3600)));
        assertUrl($this, '/image/generate_archive');
        assertParam($this, "target_format", "zip");
        assertParam($this, "tags[0]", $this->tag);
        assertParam($this, "expire_at", NULL, "should support the 'expire_at' parameter");
      }

      public function test_skip_transformation_name() {
        Curl::mockUpload($this);
        Uploader::create_zip(array("tags"=>$this->tag, "skip_transformation_name"=> TRUE));
        assertUrl($this, '/image/generate_archive');
        assertParam($this, "tags[0]", $this->tag);
        assertParam($this, "skip_transformation_name", 1, "should support the 'skip_transformation_name' parameter");
      }

      public function test_allow_missing() {
        Curl::mockUpload($this);
        Uploader::create_zip(array("tags"=>$this->tag, "allow_missing"=> TRUE));
        assertUrl($this, '/image/generate_archive');
        assertParam($this, "tags[0]", $this->tag);
        assertParam($this, "allow_missing", 1, "should support the 'allow_missing' parameter");
      }

      public function test_download_zip_url() {
          $result = \Cloudinary::download_zip_url(array("tags"=>$this->tag));
          $file = tempnam("tmp", "zip");
          file_put_contents($file, file_get_contents($result));
          $zip = new \ZipArchive();
          $zip->open($file);
          $this->assertEquals(2, $zip->numFiles);
          unlink($file);
      }
  }
}
?>