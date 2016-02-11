<?php
namespace Cloudinary {
    class PreloadedFile {
        public static $PRELOADED_CLOUDINARY_PATH = "/^([^\/]+)\/([^\/]+)\/v(\d+)\/([^#]+)#([^\/]+)$/";
        
        public $filename, $version, $public_id, $signature, $resource_type, $type;
        
        public function __construct($file_info) {
            if (preg_match(\Cloudinary\PreloadedFile::$PRELOADED_CLOUDINARY_PATH, $file_info, $matches)) {
                $this->resource_type = $matches[1]; 
                $this->type = $matches[2];
                $this->version = $matches[3];
                $this->filename = $matches[4];
                $this->signature = $matches[5];
                $public_id_and_format = $this->split_format($this->filename);
                $this->public_id = $public_id_and_format[0];
                $this->format = $public_id_and_format[1]; 
            } else {
                throw new \InvalidArgumentException("Invalid preloaded file info"); 
            }     
        }
        
        public function is_valid() {
            $public_id = $this->resource_type == "raw" ? $this->filename : $this->public_id;
            $expected_signature = \Cloudinary::api_sign_request(array("public_id" => $public_id, "version" => $this->version), \Cloudinary::config_get("api_secret")); 
            return $this->signature == $expected_signature;     
        }
    
        protected function split_format($identifier) {
            $last_dot = strrpos($identifier, ".");
          
            if ($last_dot === false) {
                return array($identifier, NULL);
            } 
            $public_id = substr($identifier, 0, $last_dot); 
            $format = substr($identifier, $last_dot+1);
            return array($public_id, $format);    
        }
    
        public function identifier() {
            return "v" . $this->version . "/" . $this->filename;
        }
        
        public function extended_identifier() {
            return $this->resource_type . "/" . $this->type . "/" . $this->identifier();
        }
    
        public function __toString() {
            return $this->resource_type . "/" . $this->type . "/v" . $this->version . "/" . $this->filename . "#" . $this->signature;
        }    
    }
}
