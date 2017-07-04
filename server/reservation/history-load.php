<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
 * recieve POST data
 */
$record = $_POST;

$offset = isset( $record['offset'] ) ? $record['offset'] : 0;
$rowCount = isset( $record['rowCount'] ) ? $record['rowCount'] : 1;
$car = $record['car'];

$resQuery = new yangMysql(); // instantiation
$resQuery->selectDb(DB_DATABASE); //

$resQuery->selectTable("reservation");
$condition = "( `car` = '".$car['carid']."' )
              and
              ( `status` <> '2' or `status` <> '3' )";
$reservation = $resQuery->simpleSelect(null,$condition,['`schedule-start`', 'ASC'],[$offset, $rowCount]);
for($j=0;$j<count($reservation);$j++){
  $resQuery->selectTable("user");
  $condition = " `emplId` = '".$reservation[$j]['applicant']."' ";
  $applicant = $resQuery->simpleSelect(null,$condition,null,null);
  $reservation[$j]['applicant'] = $applicant[0];
  $condition = " `emplId` = '".$reservation[$j]['driver']."' ";
  $driver = $resQuery->simpleSelect(null,$condition,null,null);
  $reservation[$j]['driver'] = $driver[0];
}

$result = [
  "records"  => $reservation,
  "error"    => 0,
  "errorMsg" => ""
];
echo json_encode( $result );
