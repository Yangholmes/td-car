<?php

header("Access-Control-Allow-Origin:*");

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
 * recieve POST data
 */
$record = $_POST;

$offset = isset( $record['offset'] ) ? $record['offset'] : 0;
$rowCount = isset( $record['rowCount'] ) ? $record['rowCount'] : 5;

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
					r.`status` = '1'";

$reservation = $resQuery->query($condition);

sleep(1); // 假装网络很卡

echo json_encode($reservation);
