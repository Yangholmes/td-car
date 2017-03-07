<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
 * recieve POST data
 */
$record = $_POST['car'];
$image = $_FILE[''];

carFilter($record);
duplicatCheck($record);

$carQuery = new yangMysql(); // instantiation
// $carQuery->getCharset(); //test queryCharset()
$carQuery->selectDb(DB_DATABASE); //
$carQuery->selectTable("car");

if( count($car)>0 ){
  $result = [
    "records" => null,
    "error" => 1,
    "errorMsg" => "车牌号重复"
  ];
}
else{
  $car = $carQuery->insert($record);
  $result = $car ?  [
                      "records" => $record,
                      "error" => 0,
                      "errorMsg" => ""
                    ] : [
                      "records" => null,
                      "error" => 1,
                      "errorMsg" => "插入失败"
                    ];
}

echo json_encode( $result );

/**
 *
 */
function carFilter(&$car){

}

/**
 * 查重
 */
function duplicatCheck($record){
  $condition = "plateNumber="."'".$record['plateNumber']."'";
  $car = $carQuery->simpleSelect(null, $condition, null, null ); // 车牌号不能重复
}
