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
else{
  $record['imageSrc'] = 'https://static.dingtalk.com/media/lALObKjV5M0Bo80Byw_459_419.png'; // 默认图片
}

$carQuery = new yangMysql(); // instantiation
$carQuery->selectDb(DB_DATABASE); //
$carQuery->selectTable("car");

// 数据安全检查
carFilter($record);

// 查重
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
                      "error" => 2,
                      "errorMsg" => "插入失败"
                    ];
}

echo json_encode( $result );

/**
 * data filter
 */
function carFilter(&$car){
  foreach ($car as &$value) {
    $value = trim($value);
  }
  unset($value);
}
