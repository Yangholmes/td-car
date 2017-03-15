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

/**
 * recieve POST data
 */
$record = $_POST;

$resid    = $record['resid'];
$userid   = $record['userid'];
$result   = $record['result'];
$sequence = $record['sequence'];

/**
 * instance a new yangMysql class
 */
$aprQuery = new yangMysql(); // instantiation
$aprQuery->selectDb(DB_DATABASE); //
$aprQuery->selectTable("approval");

$condition = "resid="."'".$resid."'";
$apr = $aprQuery->update($record, $condition, null, null);

if( !$apr ){
  $records  = null;
  $error    = 1;
  $errorMsg = "审批失败！";
}
else{
  if($result == 1){
    $sequence++;
    $condition = "resid= '".$resid."' and sequence= '".$sequence."'";
    $apr = $aprQuery->simpleSelect(null, $condition, null,null);

    if( count($apr) == 0 ){
      $aprQuery->selectTable("reservation");
      $condition = "resid="."'".$resid."'";
      $aprQuery->update(['status'=>'1'], $condition, null, null);
    }
  }
  else{
    $aprQuery->selectTable("reservation");
    $condition = "resid="."'".$resid."'";
    $aprQuery->update(['status'=>'2'], $condition, null, null);
  }
}
