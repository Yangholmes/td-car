<?php

header("Access-Control-Allow-Origin:*"); // cross domain
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
$car 					= $_POST['car'] 					? $_POST['car'] 				: '%';
$applicant 		= $_POST['applicant'] 		? '%'.$_POST['applicant'].'%' 	: '%';
$driver 			= $_POST['driver'] 				? '%'.$_POST['driver'].'%' 		: '%';
$accompanist 	= $_POST['accompanist']		? '%'.$_POST['accompanist'].'%'	: '%';
$fuzzyName		= $_POST['fuzzyName']			? '%'.$_POST['fuzzyName'].'%' 	: NULL;
$month 				= $_POST['month']					? $_POST['month']		 		: '';

$month 			= new DateTime($month);
$dateFloor 	= $month->format('Y-m-26');
$month			= $month->sub(new DateInterval('P1M')); // 减少一个月, P represent 'period', If the duration contains time elements, that portion of the specification is preceded by the letter T.
$dateUp 		= $month->format('Y-m-26');

$resQuery = new yangMysql(); // instantiation
$resQuery->selectDb(DB_DATABASE); //
$resQuery->selectTable("reservation");

$condition = !$fuzzyName ?
			"
				SELECT
				r.`id`				AS `id`,
				r.`createDt`		AS `createDt`,
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
				AND
				(
					( r.`schedule-start` >= '$dateUp' AND r.`schedule-start` < '$dateFloor' )
					OR
					( r.`schedule-end` >= '$dateUp' AND r.`schedule-end` < '$dateFloor' )
				)
			" : "
				SELECT
				r.`id`				AS `id`,
				r.`createDt`		AS `createDt`,
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
				(
					r.`applicant` = ua.`emplId` AND ua.`name` like '$fuzzyName'
					OR
					r.`driver` = ud.`emplId` AND ud.`name` like '$fuzzyName'
					OR
					( r.`accompanist` like '$fuzzyName' )
				)
				AND
				(
					( r.`schedule-start` >= '$dateUp' AND r.`schedule-start` < '$dateFloor' )
					OR
					( r.`schedule-end` >= '$dateUp' AND r.`schedule-end` < '$dateFloor' )
				)
			";

// echo $condition;

$condition = iconv("utf-8", "gbk", $condition );

$res = $resQuery->query($condition);

// sleep(1); // 假装网络很卡

echo json_encode( $res );
