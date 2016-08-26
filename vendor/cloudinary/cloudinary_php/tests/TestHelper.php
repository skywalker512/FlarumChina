<?php
/**
 * Created by PhpStorm.
 * User: amir
 * Date: 02/06/2016
 * Time: 08:32
 */
namespace Cloudinary {
  /**
   * Class Curl
   * Allows mocking Curl operations in the tests
   *
   * @package Cloudinary
   */
  class Curl {
    /** @var  Curl the instance used in the tests. Either the original Curl object or a stubbed version */
    public static $instance;
    /** @var array|null collects all the parameters of the curl request */
    public $parameters = null;
    /** @var array|null keeps the result of `curl_exec` */
    public $result = null;
    public $okResponse ;
    public $url;

    public function __construct() {
      $this->parameters = array();
      $this->okResponse = <<<END
HTTP/1.1 100 Continue

HTTP/1.1 200 OK
Cache-Control: max-age=0, private, must-revalidate
Content-Type: application/json; charset=utf-8
Date: Wed, 01 Jun 2016 19:44:32 GMT
ETag: "ed198f38b655b997725facd2ad4a8341"
Server: cloudinary
Status: 200 OK
X-FeatureRateLimit-Limit: 5000
X-FeatureRateLimit-Remaining: 4931
X-FeatureRateLimit-Reset: Wed, 01 Jun 2016 20:00:00 GMT
X-Request-Id: ed5691d50f137e37
X-UA-Compatible: IE=Edge,chrome=1
Content-Length: 482
Connection: keep-alive

{"public_id":"oej8n7ezhwmk1fp1xqfd"}
END;
      $this->okResponse = str_replace("\n", "\r\n",$this->okResponse);
    }

    public static function mock($test) {
      Curl::$instance = $test->getMockBuilder("\\Cloudinary\\Curl")
        ->setMethods(array("exec", "getinfo"))
        ->getMock();
      Curl::$instance->method("exec")
        ->will($test->returnValue(Curl::$instance->okResponse));
      Curl::$instance->method("getinfo")
        ->will($test->returnValue(200));
    }

    public function exec($ch) {
      $this->result = \curl_exec($ch);
      return $this->result;
    }

    public function setopt($ch, $option, $value) {
      $this->parameters[$option] = $value;
      return $this->globalSetopt($ch, $option, $value);
    }

    public function globalSetopt($ch, $option, $value) {
      return \curl_setopt($ch, $option, $value);
    }

    /**
     * When stubbing exec() this function must be stubbed too to return code
     *
     * @inheritdoc
     */
    public function getinfo($ch, $opt) {
      return \curl_getinfo($ch, $opt);
    }

    public function init($url = null) {
      $this->url = $url;
      return \curl_init($url);
    }

  }

// Override global curl functions

  function curl_init($url = null){
    return Curl::$instance->init($url);
  }
  function curl_exec($ch) {
    $result = Curl::$instance->exec($ch);
    return $result;
  }

  function curl_setopt($ch, $option, $value) {
    return Curl::$instance->setopt($ch, $option, $value);
  }

  function curl_getinfo($ch, $opt) {
    return Curl::$instance->getinfo($ch, $opt);
  }


}