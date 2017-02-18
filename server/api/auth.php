<?php

/**
 * require http request class
 * require xml function
 */
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-http-request.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-xml.php');
// require_once( '../lib/yang-lib/yang-class-http-request.php');
// require_once( '../lib/yang-lib/yang-xml.php');

/**
 * Yangholmes 2017-02-17
 */
class Auth{
    private $config;
    private $access_token;
    private $jsapi_ticket;
    private $signature_result;
    private $request;
    private $noncestr;

    public function __construct($debug=-1){
      $path = 'server/config/dd.config.xml';
      if( !is_string($path) )
        return false;
      if($debug == -1)
        $debug = 1; // set in local debug mode
      $this->_instance_http_request();

      $this->_noncestr_rand(); // generate noncestr
      $this->_load_dd_config($path, $debug); // load config
      $this->_get_access_token(); //
      $this->_get_jsapi_ticket();
      $this->_calc_signature();
  	}

  	public function __destruct(){

  	}

   /**
    * load dd config
    * @param $path: path of the config xml doc. '../config/dd.config.xml'
    * @return $config: a config object
    */
    private function _load_dd_config($path, $debug){
        $config = xmlFileRead($path);
        $config = $debug==0 ? $config->remote : $config->local;
        // echo json_encode( $config )."<br>";
        $this->config = $config;
        return $config;
    }

    /**
     * generate a random string as noncestr
     */
    private function _noncestr_rand(){
      $dictionary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      $noncestr = '';
      for($i=0; $i<15; $i++){ // $i define the length of noncestr
        $noncestr .= $dictionary[ mt_rand(0, 61) ];
      }
      $this->noncestr = $noncestr;
      return $noncestr;
    }

    /**
     * instance http class
     */
    private function _instance_http_request(){
        $request = new yang_HTTP_request(null); //
        $request->ssl_verification(false);
        $this->request = $request;
        return $request;
    }

    /**
     * get access_token
     */
    private function _get_access_token(){
        $url = "https://oapi.dingtalk.com/gettoken?corpid=".$this->config->corpId."&corpsecret=".$this->config->corpSecret;
        $this->request->set_url($url);
        $raw_access_token = $this->request->request('GET'); // $raw_response is json
        $access_token = json_decode($raw_access_token);
        // echo "url is $url, access_token is ".json_encode( $access_token )."<br>";
        $this->access_token = $access_token;
        return $access_token;
    }
    public function get_acess_token(){
      return $this->access_token;
    }

    /**
     * get jsapi_ticket
     */
    private function _get_jsapi_ticket(){
        $url = "https://oapi.dingtalk.com/get_jsapi_ticket?access_token=".$this->access_token->access_token;
        $this->request->set_url($url);
        $raw_jsapi_ticket = $this->request->request('GET'); // $raw_response is json
        $jsapi_ticket = json_decode($raw_jsapi_ticket);
        // echo json_encode( $jsapi_ticket )."<br>";
        $this->jsapi_ticket = $jsapi_ticket;
        return $jsapi_ticket;
    }
    public function get_jsapi_ticket(){
      return $this->jsapi_ticket;
    }

    /**
     * calculate signature
     */
    private function _calc_signature(){
        $timestamp = time();
        $str =
              "jsapi_ticket=".$this->jsapi_ticket->ticket."&".
              "noncestr=".$this->noncestr."&".
              "timestamp=".$timestamp."&".
              "url=".$this->config->url;
        // echo $str."<br>";
        $signature = sha1($str);

        $signature_result = [
                  "agentId" => $this->config->agentId,
                  "corpId" => $this->config->corpId,
                  "timeStamp" => $timestamp,
                  "nonceStr" => $this->noncestr,
                  "signature" => $signature
              ];
        // echo json_encode( $signature_result );
        $this->signature_result = $signature_result;
        return $signature_result;
    }
    public function get_signature(){
      return $this->signature_result;
    }
}

/**
 * test
 */
// $auth = new auth('../config/dd.config.xml', 1);
// echo json_encode( $auth->get_signature() );
