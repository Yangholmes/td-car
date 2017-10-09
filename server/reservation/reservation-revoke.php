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

$resid = $record['reservationId'];

$resQuery = new yangMysql();
$resQuery->selectTable("reservation");

$condition = "update reservation set `status` = '4' WHERE id = '".$record['reservationId']."'";

$carStatus = $resQuery->query($condition);


$result = [
  "records"  => [],
  "error"    => 0,
  "errorMsg" => '',
];


echo json_encode( $result ); // 返回预约单单号
