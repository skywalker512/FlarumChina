<?php
$base = realpath(dirname(__FILE__).DIRECTORY_SEPARATOR.'..');
require_once(join(DIRECTORY_SEPARATOR, array($base, 'src', 'Cloudinary.php')));
require_once(join(DIRECTORY_SEPARATOR, array($base, 'src', 'Uploader.php')));
require_once(join(DIRECTORY_SEPARATOR, array($base, 'src', 'Api.php')));

class ArchiveTest extends PHPUnit_Framework_TestCase {
    public function setUp() {
        Cloudinary::reset_config();
        if (!Cloudinary::config_get("api_secret")) {
          $this->markTestSkipped('Please setup environment for Upload test to run');
        }
        $this->tag = "php_test_" . time();

        Cloudinary\Uploader::upload("tests/logo.png", array("tags"=>array($this->tag)));
        Cloudinary\Uploader::upload("tests/logo.png", array("tags"=>array($this->tag), "width"=>10, "crop"=>"scale"));                
    }

    public function tearDown() {
        $api = new \Cloudinary\Api();
        $api->delete_resources_by_tag($this->tag);
    }

    public function test_create_zip() {
        $result = Cloudinary\Uploader::create_zip(array("tags"=>$this->tag));
        $this->assertEquals(2, $result["file_count"]);        
    }

    public function test_download_zip_url() {
        $result = Cloudinary::download_zip_url(array("tags"=>$this->tag));
        $file = tempnam("tmp", "zip");
        file_put_contents($file, file_get_contents($result));
        $zip = new ZipArchive();
        $zip->open($file);
        $this->assertEquals(2, $zip->numFiles);
        unlink($file);
    }
}
?>