<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');


$carQuery = new yangMysql(); // instantiation
// $carQuery->getCharset(); //test queryCharset()
$carQuery->selectDb(DB_DATABASE); //
$carQuery->selectTable("car");
$car = $carQuery->simpleSelect(null,null,null,null);

$carQuery->selectTable("reservation");
for($i=0;$i<count($car);$i++){
  $condition = "( `car` = '".$car[$i]['carid']."' )
                and
                ( `status` <> '1' or `status` <> '3' )";
  $reservation = $carQuery->simpleSelect(null,$condition,['`schedule-start`', 'ASC'],[0,5]);
  $car[$i]['reservation'] =  $reservation ;
}

$result = [
  "records"  => $car,
  "error"    => 0,
  "errorMsg" => ""
];
echo json_encode( $result );
