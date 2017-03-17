<?php

/**
 * require http request class
 * require xml function
 */
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-http-request.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-xml.php');


$request = new yang_HTTP_request(null); //
$request->ssl_verification(false);

$url = "https://oapi.dingtalk.com/sns/gettoken?appid=dingoaz82gwdsb3u5xkiel&appsecret=K9F-jTKf8gO3UZqlnUt_FmlSbcg2z_9YrIVNOta7ohvWVxcQ3TbSQ4YEW6j8O2-p";
$request->set_url($url);
$raw_access_token = $request->request('GET'); // $raw_response is json

echo $raw_access_token;