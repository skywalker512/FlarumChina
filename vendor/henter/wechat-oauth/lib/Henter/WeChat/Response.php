<?php

namespace Henter\WeChat;

class Response
{
    public $code;
    public $protocol;
    public $message;
    public $body;
    public $error;
    public $headers = array();
    public $cookies = array();
    public $data = array();

    /**
     * @param string      $response
     * @param bool|string $error
     */
    public function __construct($response, $error = false)
    {
        if (is_string($response) && ($parsed = $this->parse($response))) {
            foreach ($parsed as $key => $value) {
                $this->{$key} = $value;
            }
        }
        $this->error = $error;
    }

    /**
     * Parse response
     *
     * @param $response
     * @return array
     */
    public static function parse($response)
    {
        $body_pos = strpos($response, "\r\n\r\n");
        $header_string = substr($response, 0, $body_pos);
        if ($header_string == 'HTTP/1.1 100 Continue') {
            $head_pos = $body_pos + 4;
            $body_pos = strpos($response, "\r\n\r\n", $head_pos);
            $header_string = substr($response, $head_pos, $body_pos - $head_pos);
        }
        $header_lines = explode("\r\n", $header_string);

        $headers = array();
        $code = false;
        $body = false;
        $protocol = null;
        $message = null;
        $data = array();
        $cookie_lines = array();

        foreach ($header_lines as $index => $line) {
            if ($index === 0) {
                preg_match("/^(HTTP\/\d\.\d) (\d{3}) (.*?)$/", $line, $match);
                list(, $protocol, $code, $message) = $match;
                $code = (int)$code;
                continue;
            }
            list($key, $value) = explode(":", $line, 2);
            $headers[strtolower(trim($key))] = trim($value);
            if(strtolower(trim($key)) == 'set-cookie'){
                $cookie_lines[] = trim($value);
            }
        }

        if (is_numeric($code)) {
            $body_string = substr($response, $body_pos + 4);

            $body = (string)$body_string;
            $result['header'] = $headers;
        }

        $data = json_decode($body, true);
        $cookies = static::parse_cookies($cookie_lines);

        return $code ? array(
            'code'     => $code,
            'body'     => $body,
            'headers'  => $headers,
            'cookies'  => $cookies,
            'message'  => $message,
            'protocol' => $protocol,
            'data'     => $data
        ) : false;
    }

    public static function parse_cookies($cookie_lines = array()){
        $data = array();
        foreach($cookie_lines as $line){
            $tmp = explode(';', $line);
            if($tmp){
                list($name, $value) = explode('=', $tmp[0]);
                $data[trim($name)] = trim($value);
            }
        }
        return $data;
    }

    /**
     * Get header
     *
     * @param string $key
     * @param string $default
     * @return string
     */
    public function header($key, $default = null)
    {
        $key = strtolower($key);
        return isset($this->headers[$key]) ? $this->headers[$key] : $default;
    }

    /**
     * Is error?
     *
     * @return bool
     */
    public function error()
    {
        return !!$this->error;
    }

    /**
     * @return string
     */
    public function body(){
        return $this->body;
    }

    /**
     * @return array
     */
    public function toArray()
    {
        if(is_array($this->data) || is_array($this->data = json_decode($this->body, true)))
            return $this->data;

        return null;
    }

    /**
     * Is 200 ok?
     *
     * @return bool
     */
    public function ok()
    {
        return $this->code === 200;
    }

    /**
     * Is successful?
     *
     * @return bool
     */
    public function success()
    {
        return $this->code >= 200 && $this->code < 300;
    }

    /**
     * Is redirect?
     *
     * @return bool
     */
    public function redirect()
    {
        return in_array($this->code, array(301, 302, 303, 307));
    }

    /**
     * Is client error?
     *
     * @return bool
     */
    public function clientError()
    {
        return $this->code >= 400 && $this->code < 500;
    }

    /**
     * Is server error?
     *
     * @return bool
     */
    public function serverError()
    {
        return $this->code >= 500 && $this->code < 600;
    }

}
