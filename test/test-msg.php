<?php

$Msg = array(
	"touser"  => "03424264076698",
	"agentid" => "76417678",
	"msgtype" => "link",
	"link"    => array(
					"messageUrl" => "http://www.gdrtc.org/car/index.php",
					"picUrl" => "http://img.hb.aicdn.com/69def232a7a29b52d9ccf26e1ad789926279eac3241c2c-e7p4gY",
					"title" => "测试",
					"text" => "测试"
				)
);

$msgString = json_encode($Msg);

echo "\n send msg is: ".$msgString."\n";

/**
 * require Auth api
 */
require_once( __DIR__.'/../server/api/Auth.php');

$auth = new Auth(1);
$accessToken = $auth->get_acess_token();

echo "\n access token is: ".$accessToken."\n";

$url = OAPI_HOST."/message/send?access_token=".$accessToken;

$request = new yang_HTTP_request(null); //
$request->set_header([
	"Content-Type" => "application/json",
	"Accept"=>"*/*",
	"Accept-Charset"=>"utf-8",
	"Content-Encoding"=>"utf-8",
	]);
$request->ssl_verification(false);
$request->set_url($url);

$request->set_data( $msgString );
$respond = $raw_access_token = $request->request('POST');

echo "\n".json_encode($respond)."\n";