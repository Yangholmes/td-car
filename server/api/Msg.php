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
  // message template
  private $msg = [
				 "touser"  => "",
				 "agentid" => "76647142",
				 "msgtype" => "oa",
  				 "oa" =>	[
								"message_url" => "",
								"head" => [
									"bgcolor" => "ff4da9eb",
									"text" => "", // 向普通会话发送时有效，向企业会话发送时会被替换为微应用的名字
								],
								"body" => [
									"content" => "",
									"author" => "© 通导研发 ",
									"image"=> "",
									"rich" => [ "num" => "", "unit" => "的申请" ],
								]
							]
				];

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
   * @param $msg: must be a associate array[]
   *
   * @param touser: [],
   * @param message_url: string,
   * @param image: string,
   * @param rich: string,
   * @param content: string
   * Yangholmes
   */
  private function _corpMsgFilter($msg){
    if( !is_array($msg) )
      return false;
    if( !is_array($msg["touser"]) || !is_string($msg["title"]) || !is_string($msg["image"]) || !is_string($msg["rich"]) || !is_string($msg["content"]) )
      return false;

    $this->msg['touser']                    = join( '|', $msg['touser'] );
    $this->msg['oa']['message_url']         = $msg['message_url'];
    $this->msg['oa']['body']['title']       = $msg['title'];
    $this->msg['oa']['body']['image']       = $msg['image'];
    $this->msg['oa']['body']['content']     = $msg['content'];
    $this->msg['oa']['body']['rich']['num'] = $msg['rich'];

    $this->conversationMsg = json_encode($this->msg);
    return true;
  }

  /**
   * @param $msg: must be a associate array
   * touser, img, rich, content
   * yangholmes
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

/*$msg = new Msg(null);
$respond = $msg->sendMsg([
	"title" => "有一条用车申请需要您的审批",
	"touser"  => ["03401806572466", "03424264076698"],
	"message_url" => "http://www.gdrtc.org/car/page/approval.html?resid=o4nDzipENvF53dzsK4Nw%7B1496645809%7D&signature=aE2v8phFmy%7B1496645809%7D",
	"image"=> "", // 图片
	"rich" => "方淑斐",
	"content" => 	"出发地点："."公司"."\n".
	                "目的地点："."广州东站"."\n".
	                "预计出发："."2017-06-06 09:30:00"."\n".
	                "预计返回："."2017-06-06 20:00:00"
]);

echo $respond;*/
