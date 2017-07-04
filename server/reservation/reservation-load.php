<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
 * recieve POST data
 */
$record = $_POST;

$resid = $record['resid'];
// $resid = '7ly7Ih2P5Y5pPm0MPMzU{1489491785}';

$resQuery = new yangMysql(); // instantiation
$resQuery->selectDb(DB_DATABASE);

$resQuery->selectTable("reservation");
$condition = " `resid` = '".$resid."'";
$reservation = $resQuery->simpleSelect(null, $condition, null, null);

$resQuery->selectTable("user");
$condition = " `emplId` = '".$reservation[0]['applicant']."' ";
$applicant = $resQuery->simpleSelect(null,$condition,null,null);
$reservation[0]['applicant'] = $applicant[0];
$condition = " `emplId` = '".$reservation[0]['driver']."' ";
$driver = $resQuery->simpleSelect(null,$condition,null,null);
$reservation[0]['driver'] = $driver[0];

$resQuery->selectTable("approval");
$condition = " `resid` = '".$resid."'";
$approval = $resQuery->simpleSelect(null, $condition, ['`sequence`', 'ASC'], null);

for($j=0;$j<count($approval);$j++){
  $resQuery->selectTable("user");
  $condition = " `emplId` = '".$approval[$j]['userid']."' ";
  $approver = $resQuery->simpleSelect(null,$condition,null,null);
  $approval[$j]['approver'] = $approver[0];
}
$reservation[0]['approval'] = $approval;

$resQuery->selectTable("car");
$condition = " `carid` = '".$reservation[0]['car']."'";
$car = $resQuery->simpleSelect(null,$condition,null,null);
$reservation[0]['car'] = $car[0];

$result = [
  "records"  => $reservation,
  "error"    => 0,
  "errorMsg" => ""
];
echo json_encode( $result );
