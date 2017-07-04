<?php

header("Access-Control-Allow-Origin:*"); // cross domain

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
 * recieve POST data
 */
$record = $_POST;

$car = $record['car'];
$startDate = $record['startDate'];
$endDate = $record['endDate'];

$resQuery = new yangMysql(); // instantiation
$resQuery->selectDb(DB_DATABASE); //
$resQuery->selectTable("reservation");

$condition = "
				SELECT
					r.`resid`			AS `resid`,
					r.`startpoint`		AS `startpoint` ,
					r.`endpoint` 		AS `endpoint` ,
					r.`schedule-start` 	AS `schedule-start` ,
					r.`schedule-end` 	AS `schedule-end` ,
					r.`status` 			AS `status`,
					r.`returnDt` 		AS `returnDt` ,
					c.`model` 			AS `car`,
					ua.`name` 			AS `applicant`,
					ua.`avatar`			AS `avatar`,
					ud.`name` 			AS `driver`
				FROM
					reservation AS r 
					INNER JOIN `user` 	AS ua 	ON r.applicant = ua.emplId
					INNER JOIN `car` 	AS c 	ON r.car = c.carid
					INNER JOIN `user` 	AS ud 	ON r.driver = ud.`emplId`
				WHERE
				r.`car` = '$car'
				AND
				(
					(r.`schedule-start` >= '$startDate' AND r.`schedule-start` <= '$endDate')
					OR
					(r.`returnDt` >= '$startDate' AND r.`returnDt` <= '$endDate')
				)
				";

// echo $condition;

$condition = iconv("utf-8", "gbk", $condition );

$res = $resQuery->query($condition);

// sleep(1); // 假装网络很卡

echo json_encode( $res );