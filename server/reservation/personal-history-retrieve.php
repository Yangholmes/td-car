<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
 * recieve POST data
 */
$user = $_POST['user'];
$offset = $_POST['offset'];

/**
 * response data
 */
$response = [
  'reservation' => [],
];

/**
 * 获取5条预约单
 * @var yangMysql
 */
$resQuery = new yangMysql(); // instantiation
$resQuery->selectDb(DB_DATABASE); //

$condition = "
      SELECT
        r.`id`				AS `id`,
        r.`createDt`		AS `createDt`,
        r.`startpoint`		AS `startpoint` ,
        r.`endpoint` 		AS `endpoint` ,
        r.`schedule-start` 	AS `schedule-start` ,
        r.`schedule-end` 	AS `schedule-end` ,
        c.`model` 			AS `carModel`,
        c.`imageSrc` 			AS `carImageSrc`,
        ua.`name` 			AS `applicant`,
        ud.`name` 			AS `driver`,
        r.`accompanist`		AS `accompanist`,
        r.`returnDt`		AS `returnDt`
      FROM
        reservation AS r
          INNER JOIN `user` 	AS ua 	ON r.applicant = ua.emplId
          INNER JOIN `car` 	AS c 	ON r.car = c.carid
          INNER JOIN `user` 	AS ud 	ON r.driver = ud.`emplId`
      WHERE
      `applicant`='$user'
      LIMIT 5 OFFSET $offset
";

$reservation = $resQuery->query($condition);

$response['reservation'] = $reservation;

echo json_encode($response);
