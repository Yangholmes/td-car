<?php

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

$resQuery  = new yangMysql(); // 申请表单
$resQuery->selectTable("reservation");

$record['returnDt'] = date("Y-m-d H:i:s");
$record['status'] = '4';

$condition = "resid= '".$record['resid']."'";
$resQuery->update($record, $condition, null, null);

// send to applicant
$msg['touser'] = [$applicant['emplId']];
$msg['rich'] = $applicant['name'];
$msg['content'] = "下次再来哦~";

// return to browser
$result = [
  "records"  => $records,
  "error"    => 0,
  "errorMsg" => '',
];
echo json_encode( $result ); // 返回预约单单号

/**
 * send Msg
 */
$newMsg = new Msg(null);
$respond = $newMsg->sendMsg($msg);
