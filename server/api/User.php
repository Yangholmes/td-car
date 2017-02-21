<?php

class User{

  private $request;

  public function __construct(){
      $this->_instance_http_request();
  }

  public function __destruct(){
      $this->request = null;
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

  public function getUserInfo($accessToken, $code){
      $url = OAPI_HOST."/user/getuserinfo?access_token=".$accessToken."&code=".$code;
      $this->request->set_url($url);
      $raw_userlist = $this->request->request('GET');
      return $raw_userlist;
  }

}

?>
