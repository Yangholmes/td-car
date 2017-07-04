<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
 * recieve POST data
 */
$record = $_POST;
$image = $_FILES['imageSrc'];

if( $image['name'] ){
  $imageName = 'car'.time().substr( $image['name'], strrpos($image['name'],'.') ); // 重新命名图片
  $record['imageSrc'] = IMAGE_ROOT.'/cars-pics/'.$imageName;
	$image = copy($image['tmp_name'], __DIR__.'/../../img/cars-pics/'.$imageName); // 以指定名称保存到服务器
}

$carQuery = new yangMysql(); // instantiation
$carQuery->selectDb(DB_DATABASE); //
$carQuery->selectTable("car");

// 数据安全检查
carFilter($record);

$condition = "carid="."'".$record['carid']."'";
$car = $carQuery->update($record, $condition, null, null);

$result = $car ?  [
                    "records" => $record,
                    "error" => 0,
                    "errorMsg" => ""
                  ] : [
                    "records" => null,
                    "error" => 2,
                    "errorMsg" => "修改失败"
                  ];

echo json_encode( $result );

/**
 * data filter
 */
function carFilter(&$car){

}
