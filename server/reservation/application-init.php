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
                SELECT
                  *,
                  MAX(id)
                AS
                  `id`
                FROM
                  `carstatus`
                WHERE
                  `carid` = '".$car[$i]['carid']."'
                HAVING
                  MAX(id)
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
