<?php

/**
 * require Auth api
 */
 require_once( __DIR__.'/../../server/api/Auth.php');

/**
 * [Dept description]
 * yangholmes 2017-06-08
 */
class Dept {

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
   * [getDepartmentList description]
   * @param  [type] $accessToken [description]
   * @return [type]              [description]
   */
  public function getDepartmentList($accessToken) {
    $url = OAPI_HOST."/department/list?access_token=".$accessToken;
    $this->request->set_url($url);
    $raw_departmentList = $this->request->request('GET');
    return $raw_departmentList;
  }

  /**
   * [getDepartment description]
   * @param  [type] $accessToken [description]
   * @param  [type] $id          [description]
   * @return [type]              [description]
   */
  public function getDepartment($accessToken, $id) {
    $url = OAPI_HOST."/department/get?access_token=".$accessToken."&id=".$id;
    $this->request->set_url($url);
    $raw_department = $this->request->request('GET');
    return $raw_department;
  }
}
