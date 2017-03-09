<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
 * recieve POST data
 */
$record = $_POST;
// $record = 	[
// 				"carid" => 74
// 			];

$carQuery = new yangMysql(); // instantiation
$carQuery->selectDb(DB_DATABASE); //
$carQuery->selectTable("car");

// 数据安全检查
carFilter($record);

$condition = "carid="."'".$record['carid']."'";
$car = $carQuery->simpleSelect(null, $condition, null, null );

if( count($car)==1 ){
	$car = $car[0];
	$imageName = preg_replace('/(.+)\/(car\d+\.\w{3,4})$/', '$2', $car['imageSrc']);
	@ $image = unlink(__DIR__.'/../../img/cars-pics/'.$imageName); // delete image, ignore default image
}

$condition = "carid="."'".$record['carid']."'";
$car = $carQuery->delete($condition);

if($car){
	$condition = "carid="."'".$record['carid']."'";
	$car = $carQuery->simpleSelect(null, $condition, null, null ); // 查查看删除是否成功
	$result = count($car) == 0 ? 	[
										"records" => null,
										"error" => 0,
										"errorMsg" => ""
									] : [
										"records" => null,
										"error" => 1,
										"errorMsg" => "删除失败"
									];
}
else{
	$result = 	[
					"records" => null,
					"error" => 2,
					"errorMsg" => "删除失败"
				];
}

echo json_encode( $result );

/**
 * data filter
 */
function carFilter(&$car){

}
