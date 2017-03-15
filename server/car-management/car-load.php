<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');


$carQuery = new yangMysql(); // instantiation
$carQuery->selectDb(DB_DATABASE); //
$carQuery->selectTable("car");
$car = $carQuery->simpleSelect(null,null,null,null);

for($i=0;$i<count($car);$i++){
  $carQuery->selectTable("reservation");
  $condition = "( `car` = '".$car[$i]['carid']."' )
                and
                ( `status` <> '1' or `status` <> '3' )";
  $reservation = $carQuery->simpleSelect(null,$condition,['`schedule-start`', 'ASC'],[0,5]);
  for($j=0;$j<count($reservation);$j++){
    $carQuery->selectTable("user");
    $condition = " `emplId` = '".$reservation[$j]['applicant']."' ";
    $applicant = $carQuery->simpleSelect(null,$condition,null,null);
    $reservation[$j]['applicant'] = $applicant[0];
    $condition = " `emplId` = '".$reservation[$j]['driver']."' ";
    $driver = $carQuery->simpleSelect(null,$condition,null,null);
    $reservation[$j]['driver'] = $driver[0];
  }
  $car[$i]['reservation'] =  $reservation ;
}

$result = [
  "records"  => $car,
  "error"    => 0,
  "errorMsg" => ""
];
echo json_encode( $result );
