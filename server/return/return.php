<?php

header("Access-Control-Allow-Origin:*");

/**
 * set timezone
 * set the default timezone to use. Available since PHP 5.1
 */
date_default_timezone_set('Asia/Shanghai');

/**
 * require libs
 */
require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');
require_once( __DIR__.'/../../server/api/Msg.php');

/**
 * recieve POST data
 */
$record = $_POST;

$resid = $record['resid'];

$msg = [
  "title" => "呼呼~车已经还了~",
  "touser" => [], // 通知收信人
  "message_url" => SERVER_HOST."/index.php",
  // "message_url" => SERVER_HOST."/page/approval.html?resid=".$resid."&signature=".randomIdFactory(10), // 避免消息重复，url加上随机的特征码
  "image"=> "", // 图片
  "rich" => "",
  "content" => '',
];

if( $record['userid'] != '03401806572466' ){
  $result = [
    "records"  => $record,
    "error"    => 1,
    "errorMsg" => '您没有权限执行这个操作!',
  ];
}
else{
  $record = array_diff_key($record, ["userid"=>'']);

  $resQuery = new yangMysql(); $userQuery = new yangMysql();
  $resQuery->selectTable("reservation");
  $userQuery->selectTable("user");

  $record['returnDt'] = date("Y-m-d H:i:s");
  $record['status'] = '3';

  $condition = "resid= '".$record['resid']."'";
  $resQuery->update($record, $condition, null, null);

  $reservation = $resQuery->simpleSelect(null, $condition, null, null);
  $applicant = $userQuery->simpleSelect(null, "emplId = '".$reservation[0]['applicant']."'", null, null);

  // send to applicant
  $msg['touser'] = [$applicant[0]['emplId']];
  $msg['rich'] = $applicant[0]['name'];
  $msg['content'] = "下次再来哦~";

  $result = [
    "records"  => $record,
    "error"    => 0,
    "errorMsg" => '',
  ];

  /**
   * send Msg
   */
  $newMsg = new Msg(null);
}

echo json_encode( $result ); // 返回预约单单号

if(isset($newMsg))
  // $respond = $newMsg->sendMsg($msg);
;