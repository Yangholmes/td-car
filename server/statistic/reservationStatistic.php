<?php

header("Access-Control-Allow-Origin:*");
// header("Access-Control-Allow-Credentials: true"); 
// header('Access-Control-Allow-Headers: X-Requested-With');
// header('Access-Control-Allow-Headers: Content-Type');
// header('Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT'); 

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
$key = $_POST;

$car = $key['car'] == '' ? '%' : $key['car'];
$applicant = $key['applicant'] == '' ? '%' : '%'.$key['applicant'].'%';
$driver = $key['driver'] == '' ? '%' : '%'.$key['driver'].'%';
$accompanist = $key['accompanist'] == '' ? '%' : '%'.$key['accompanist'].'%';

$resQuery = new yangMysql(); // instantiation
// $resQuery->getCharset(); //test queryCharset()
$resQuery->selectDb(DB_DATABASE); //
$resQuery->selectTable("reservation");

$condition = "
				SELECT
				r.`id`				AS `id`,
				r.`createDt`		AS 'createDt',
				r.`startpoint`		AS `startpoint` ,
				r.`endpoint` 		AS `endpoint` ,
				r.`schedule-start` 	AS `schedule-start` ,
				r.`schedule-end` 	AS `schedule-end` ,
				c.`model` 			AS `car`,
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
				r.`status` = 3
				AND
				c.`carid` like '$car'
				AND
				r.`applicant` = ua.`emplId` AND ua.`name` like '$applicant'
				AND
				r.`driver` = ud.`emplId` AND ud.`name` like '$driver'
				AND
				( r.`accompanist` like '$accompanist' OR r.`accompanist`is NULL )
			";

// echo $condition;

$res = $resQuery->query($condition);

sleep(1); // 假装网络很卡

echo json_encode( $res );