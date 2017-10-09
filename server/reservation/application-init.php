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

/**
 * recieve POST data
 */
$record = $_POST;
$userId = $record['userId'];
$resQuery = new yangMysql(); // instantiation
$resQuery->selectDb(DB_DATABASE); //
$resQuery->selectTable("reservation");
$condition = "select * from reservation where `applicant` = '".$userId."' and `status` = '1'"; // 检查是否有车辆未还
$res1 = $resQuery->query($condition);

$condition = "select * from reservation where `applicant` = '".$userId."' and `status` = '0'"; // 检查是否有车辆审批未完
$res2 = $resQuery->query($condition);
if(count($res1)>0 || count($res2)>0){
  $errorMsg = "";
  if(count($res1)>0){
    $errorMsg = "您还有车辆未还，请还车后重试";
  }else{
    $errorMsg = "您还有车辆车辆正在审批，不能再继续借了哦";
  }
  $result = [
    "records"  => [],
    "error"    => 2,
    "errorMsg" => $errorMsg
  ];
  echo json_encode( $result );
}else{
  $carQuery = new yangMysql(); // instantiation
  $carQuery->selectDb(DB_DATABASE); //
  $carQuery->selectTable("car");
  $condition = " `disable` <> 1 "; // 筛除停用车辆
  $car = $carQuery->simpleSelect(null,$condition,null,null);

  for($i=0;$i<count($car);$i++){
  $carQuery->selectTable("reservation");
    // 近两日预约状况
    $condition = "
                  SELECT
                  r.`id`        AS `id`,
                  r.`createDt`    AS `createDt`,
                  r.`startpoint`    AS `startpoint` ,
                  r.`endpoint`    AS `endpoint` ,
                  r.`schedule-start`  AS `schedule-start` ,
                  r.`schedule-end`  AS `schedule-end` ,
                  u.`name`      AS `applicant`,
                  r.`accompanist`   AS `accompanist`,
                  r.`returnDt`    AS `returnDt`,
                  r.`status` AS `status`
                  FROM
                    `reservation` AS r
                      INNER JOIN `user` AS u ON r.applicant = u.emplId
                  WHERE
                    ( `car` = '".$car[$i]['carid']."' )
                    and
                    (
                        ( `schedule-start` between '".date('Y-m-d H:i:s')."' and '".date('Y-m-d 00:00:00', time()+2*24*60*60)."' )
                        or
                        ( `schedule-end` between '".date('Y-m-d H:i:s')."' and '".date('Y-m-d 00:00:00', time()+2*24*60*60)."' )
                        or
                        ( `schedule-start` <= '".date('Y-m-d H:i:s')."' and `schedule-end` >= '".date('Y-m-d 00:00:00', time()+2*24*60*60)."' )
                    )
                    and
                    ( `status` <> '2' )
                  ";

    // $reservation = $carQuery->simpleSelect(null,$condition,['`schedule-start`', 'ASC'],null);
    $reservation = $carQuery->query($condition);
    $car[$i]['reservation'] =  $reservation ;
    // 逾期未归还
    $condition = "
                  SELECT
                  r.`id`        AS `id`,
                  r.`createDt`    AS `createDt`,
                  r.`startpoint`    AS `startpoint` ,
                  r.`endpoint`    AS `endpoint` ,
                  r.`schedule-start`  AS `schedule-start` ,
                  r.`schedule-end`  AS `schedule-end` ,
                  u.`name`      AS `applicant`,
                  r.`accompanist`   AS `accompanist`,
                  r.`returnDt`    AS `returnDt`,
                  r.`status` AS `status`
                  FROM
                    `reservation` AS r
                      INNER JOIN `user` AS u ON r.applicant = u.emplId
                  WHERE
                    ( `car` = '".$car[$i]['carid']."' )
                    and
                    ( `schedule-end` < '".date('Y-m-d H:i:s')."' )
                    and
                    ( `status` = 1 )
                  ";
    // $reservation = $carQuery->simpleSelect(null,$condition,['`schedule-start`', 'ASC'],null);
    $reservation = $carQuery->query($condition);
    $car[$i]['suspend'] =  $reservation ;

    $carQuery->selectTable("carstatus");
    // 车辆状态
    $condition = "
                  SELECT * from `carstatus`
                  WHERE id=(
                    SELECT MAX(id)
                    FROM `carstatus`
                    WHERE `carid` = '".$car[$i]['carid']."')
                  ";
    $carStatus = $carQuery->query($condition);
    $car[$i]['carStatus'] = $carStatus;
  }

  $result = [
    "records"  => $car,
    "error"    => 0,
    "errorMsg" => ""
  ];
  echo json_encode( $result );
}
