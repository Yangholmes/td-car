<?php

/**
 * require Auth api
 */
 require_once( __DIR__.'/../../server/api/Auth.php');

/**
 * Yangholmes 2017-03-03
 */
class Msg{

  private $accessToken;
  private $request;
  private $conversationMsg;

  /**
   * @param $accessToken: could be null.
   */
  public function __construct($accessToken = null){
    if( is_string($accessToken) )
      $this->accessToken = $accessToken;
    else {
      $auth = new Auth(1);  // debug: 1表示本地调试；0表示远程服务器。使用本地调试时，请注意修改config文件
      $this->accessToken = $auth->get_acess_token();
    }
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
      $request->set_header([
                          	"Content-Type" => "application/json",
                          	"Accept"=>"*/*",
                          	"Accept-Charset"=>"utf-8",
                          	"Content-Encoding"=>"utf-8",
                        	]);
      $this->request = $request;
      return $request;
  }

  /**
   * @param $msg: must be a associate array
   * Yangholmes
   */
  private function _corpMsgFilter($msg){
    if( !is_array($msg) )
      return false;
    if( !is_string($msg["touser"]) || !is_string($msg["agentid"]) || !is_string($msg["msgtype"]) )
      return false;
    $this->conversationMsg = json_encode($msg);
    return true;
  }

  /**
   * @param $msg: must be a associate array
   */
  public function sendMsg($msg){
    if( !$this->_corpMsgFilter($msg) )
      return false;
    $url = OAPI_HOST."/message/send?access_token=".$this->accessToken;
    $this->request->set_url($url);
    $this->request->set_data($this->conversationMsg);
    $respond = $this->request->request('POST'); // $raw_response is json
    return $respond;
  }

}


/**
 * test
 */

$msg = new Msg(null);
$respond = $msg->sendMsg([
	"touser"  => "03424264076698",
	"agentid" => "76417678",
	"msgtype" => "oa",
	"oa"    =>	[
					"message_url" => "http://www.gdrtc.org/car/index.php",
					"head" => [
						"bgcolor" => "FFBBBB",
						"text" => "头部标题", // 向普通会话发送时有效，向企业会话发送时会被替换为微应用的名字
					],
					"body" => [
						"title" => "正文标题",
						"content" => "大段文本",
						"author" => "©通导研发  2017",
						"image"=> "http://static.dingtalk.com/media/lADOC8otZ8ylzKU_165_165.jpg",
						"form" =>	[

									],
					],
				]
]);

echo $respond;