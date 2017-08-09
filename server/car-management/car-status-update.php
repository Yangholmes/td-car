<?php
/**
 * 车辆状态更新服务
 * 输入: 车辆id, 车辆状态associate array
 * 输出: 错误代码, 错误信息, 包含车辆状态信息的record对象
 * Yangholmes 2017/07/25
 */

// require mysql lib
require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
* recieve POST data
*/
$record = $_POST; //
$carStatusInfo = ['fuelIndicator', 'unitollGD', 'carid', 'reservation', 'damageType', 'damageDetails'];

// instantiation
$carStatusQuery = new yangMysql();
$carStatusQuery->selectDb(DB_DATABASE); //

// 数据安全检查
dataFilter($record);

// update car status
$carStatusQuery->selectTable("carstatus");
$result = $carStatusQuery->insert($record);

$result = $result ?  [
                    "records" => $record,
                    "error" => 0,
                    "errorMsg" => ""
                  ] : [
                    "records" => null,
                    "error" => 2,
                    "errorMsg" => "更新失败"
                  ];

echo json_encode( $result );

/**
 * data filter
 */
function dataFilter(&$record){
  foreach ($record as &$value) {
    $value = trim($value);
  }
  unset($value);
}
