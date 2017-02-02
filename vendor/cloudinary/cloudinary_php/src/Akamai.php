<?php
/**
 * Created by PhpStorm.
 * User: amir
 * Date: 26/01/2017
 * Time: 15:16
 */

namespace Cloudinary;


trait Akamai {

	public static function generate_akamai_token($options=array()){
		$key = \Cloudinary::option_get($options, "key", \Cloudinary::config_get("akamai_key"));
		if(!isset($key)) throw new \Cloudinary\Error("Missing akamai_key configuration");
		$name = \Cloudinary::option_get($options, "token_name", "__cld_token__");
		$start = \Cloudinary::option_get($options, "start_time");
		$expiration = \Cloudinary::option_get($options, "end_time");
		$ip = \Cloudinary::option_get($options, "ip");
		$acl = \Cloudinary::option_get($options, "acl");
		$window  = \Cloudinary::option_get($options, "window");

		if(!strcasecmp($start, "now")) {
			$start = time();
		} elseif (is_numeric($start)) {
			$start = 0 + $start;
		}
		if(!isset($expiration)){
			if(isset($window)){
				$expiration = (isset($start) ? $start : time()) + $window;
			} else {
				throw new \Cloudinary\Error("Must provide 'end_time' or 'window'.");
			}
		}
		$token = array();
		if(isset($ip)) array_push($token, "ip=$ip");
		if(isset($start)) array_push($token, "st=$start");
		array_push($token, "exp=$expiration");
		array_push($token, "acl=$acl");
		$auth = self::digest(join("~", $token), $key);
		array_push($token, "hmac=$auth");
		return "$name=" . join("~", $token);
	}

	private static function digest($message, $key = NULL) {
		if(!isset($key)) $key = \Cloudinary::config_get("akamai_key");
		$bin_key = pack("H*", $key);
		return hash_hmac( "sha256", $message, $bin_key);
	}
}