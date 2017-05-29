<?php
$base = realpath(dirname(__FILE__).DIRECTORY_SEPARATOR.'..');
use PHPUnit\Framework\TestCase;
require_once(join(DIRECTORY_SEPARATOR, array($base, 'src', 'Cloudinary.php')));
require_once(join(DIRECTORY_SEPARATOR, array($base, 'src', 'CloudinaryField.php')));

class CloudinaryFieldTest extends TestCase {
    public function setUp() {
        Cloudinary::config(array("cloud_name"=>"test123", "secure_distribution" => NULL, "private_cdn" => FALSE));
    }

    public function test_cloudinary_url_from_cloudinary_field() {
        // should use cloud_name from config
        $result = Cloudinary::cloudinary_url(new CloudinaryField("test"));
        $this->assertEquals("http://res.cloudinary.com/test123/image/upload/test", $result);

        // should ignore signature
        $result = Cloudinary::cloudinary_url(new CloudinaryField("test#signature"));
        $this->assertEquals("http://res.cloudinary.com/test123/image/upload/test", $result);

        $result = Cloudinary::cloudinary_url(new CloudinaryField("rss/imgt/v123/test.jpg"));
        $this->assertEquals("http://res.cloudinary.com/test123/rss/imgt/v123/test.jpg", $result);
    }
}
    // [<resource_type>/][<image_type>/][v<version>/]<public_id>[.<format>][#<signature>]
