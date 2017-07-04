<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');
require_once( __DIR__.'/../../server/api/Auth.php');
require_once( __DIR__.'/../../server/api/Dept.php');

/**
 * recieve POST data
 */
$user = $_POST['user'];
$department = $_POST['department'];

/**
 * response data
 */
$response = [
  'department' => [],
  'reservationSum' => '',
  'reservation' => [],
];

/**
 * 获取部门信息
 * @var Dept
 */
$dept = new Dept();
$auth = new Auth(1); $accessToken = $auth->get_acess_token();

for($i=0;$i<count($department);$i++){
  $department[$i] = $dept->getDepartment( $accessToken, $department[$i]);
  $department[$i] = json_decode($department[$i])->name;
}

/**
 * 获取预约单总数
 * @var yangMysql
 */
$resQuery = new yangMysql(); // instantiation
$resQuery->selectDb(DB_DATABASE); //

$resQuery->selectTable("reservation");
$condition = "SELECT count(id) FROM `reservation` WHERE `applicant`='$user'";
$reservationSum = $resQuery->query($condition)[0]['count(id)'];

/**
 * 获取前五条预约单
 * @var string
 */
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
      LIMIT 5 OFFSET 0
";
$reservation = $resQuery->query($condition);

$response['department'] = $department;
$response['reservationSum'] = $reservationSum;
$response['reservation'] = $reservation;

echo json_encode($response);
