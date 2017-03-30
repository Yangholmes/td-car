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

$carQuery = new yangMysql(); // instantiation
// $carQuery->getCharset(); //test queryCharset()
$carQuery->selectDb(DB_DATABASE); //
$carQuery->selectTable("car");
$car = $carQuery->simpleSelect(null,null,null,null);

$carQuery->selectTable("reservation");
for($i=0;$i<count($car);$i++){
  // 近两日预约状况
  $condition = "( `car` = '".$car[$i]['carid']."' )
                and
                (
                    ( `schedule-start` between '".date('Y-m-d H:i:s')."' and '".date('Y-m-d 00:00:00', time()+2*24*60*60)."' )
                    or
                    ( `schedule-end` between '".date('Y-m-d H:i:s')."' and '".date('Y-m-d 00:00:00', time()+2*24*60*60)."' )
                    or
                    ( `schedule-start` <= '".date('Y-m-d H:i:s')."' and `schedule-end` >= '".date('Y-m-d 00:00:00', time()+2*24*60*60)."' )
                )
                and
                ( `status` <> '2' )";
  $reservation = $carQuery->simpleSelect(null,$condition,['`schedule-start`', 'ASC'],null);
  $car[$i]['reservation'] =  $reservation ;
  // 逾期未归还
  $condition = "( `car` = '".$car[$i]['carid']."' )
                and
                ( `schedule-end` < '".date('Y-m-d H:i:s')."' )
                and
                ( `status` = 1 )";
  $reservation = $carQuery->simpleSelect(null,$condition,['`schedule-start`', 'ASC'],null);
  $car[$i]['suspend'] =  $reservation ;
}

$result = [
  "records"  => $car,
  "error"    => 0,
  "errorMsg" => ""
];
echo json_encode( $result );
