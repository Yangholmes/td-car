<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
 * recieve POST data
 */
$record = $_POST;
$image = $_FILES['imageSrc'];

if( $image['name'] ){
  $imageName = time().substr( $image['name'], strrpos($image['name'],'.') ); // 重新命名图片
  $record['imageSrc'] = IMAGE_ROOT.'/cars-pics/'.$imageName;
	copy($image['tmp_name'], __DIR__.'/../../img/cars-pics/'.$imageName); // 以指定名称保存到服务器
}

$carQuery = new yangMysql(); // instantiation
// $carQuery->getCharset(); //test queryCharset()
$carQuery->selectDb(DB_DATABASE); //
$carQuery->selectTable("car");

$condition = "plateNumber="."'".$record['plateNumber']."'";
$car = $carQuery->simpleSelect(null, $condition, null, null ); // 车牌号不能重复

// 数据库已经存在这个车牌号 放弃保存并提示
if( count($car)>0 ){
  $result = [
    "records" => null,
    "error" => 1,
    "errorMsg" => "车牌号重复"
  ];
}
// 新车牌号 保存
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
}
