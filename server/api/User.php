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

  /**
   *
   */
  private function getUserId($accessToken, $code){
    $url = OAPI_HOST."/user/getuserinfo?access_token=".$accessToken."&code=".$code;
    $this->request->set_url($url);
    $raw_userInfo = $this->request->request('GET');
    return $raw_userInfo;
  }

  public function getUserInfo($accessToken, $code){
      $userInfo = json_decode( $this->getUserId($accessToken, $code) );
      $userId = $userInfo->userid;
      $url = OAPI_HOST."/user/get?access_token=".$accessToken."&userid=".$userId;
      $this->request->set_url($url);
      $raw_user = $this->request->request('GET');
      $user = json_decode($raw_user);

      $user->deviceId = $userInfo->deviceId;
      $user->admin_level = $userInfo->sys_level; //级别，0：非管理员 1：超级管理员（主管理员） 2：普通管理员（子管理员） 100：老板
      return json_encode( $user );
  }

}
