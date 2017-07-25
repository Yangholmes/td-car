<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
 * recieve POST data
 */
$record = $_POST;
$image = $_FILES['imageSrc'];
$carInfo = ['carid', 'plateNumber', 'brand', 'imageSrc', 'model', 'seating', 'level', 'gearbox', 'gasoline'];
$carStatusInfo = ['fuelIndicator', 'unitollGD', 'carid', 'reservation', 'damageType', 'damageDetails'];

if( $image['name'] ){
  $imageName = 'car'.time().substr( $image['name'], strrpos($image['name'],'.') ); // 重新命名图片
  $record['imageSrc'] = IMAGE_ROOT.'/cars-pics/'.$imageName;
	$image = copy($image['tmp_name'], __DIR__.'/../../img/cars-pics/'.$imageName); // 以指定名称保存到服务器
}

$carQuery = new yangMysql(); // instantiation
$carQuery->selectDb(DB_DATABASE); //

// 数据安全检查
carFilter($record);

// 分离车辆信息和车辆状态信息
foreach ($carInfo as &$value) {
  if( isset($record[$value]) )
    $car[$value] = $record[$value];
}
unset($value);
foreach ($carStatusInfo as &$value) {
  if( isset($record[$value]) )
    $carStatus[$value] = $record[$value];
  else
    $carStatus[$value] = 0;
}
unset($value);

// update car
$carQuery->selectTable("car");
$condition = "carid="."'".$car['carid']."'";
$result = $carQuery->update($car, $condition, null, null);
// update car status
$carQuery->selectTable("carStatus");
$result = $carQuery->insert($carStatus);

$result = $result ?  [
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
function carFilter(&$record){
  foreach ($record as &$value) {
    $value = trim($value);
  }
  unset($value);
}
