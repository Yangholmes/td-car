<?php
/**
 * 车辆状态查询服务
 * 输入: reservation
 * 输出: 错误代码, 错误信息, 包含车辆状态信息的record对象
 * Yangholmes 2017/07/31
 */

header("Access-Control-Allow-Origin:*"); // cross domain

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

// retrieve car status
$carStatusQuery->selectTable("carstatus");
$condition = "reservation = '".$record['reservation']."'";
$result = $carStatusQuery->simpleSelect(null, $condition, null, null);

$result = $result!==false ?  [
                    "records" => $result,
                    "error" => 0,
                    "errorMsg" => ""
                  ] : [
                    "records" => null,
                    "error" => 2,
                    "errorMsg" => "查询失败"
                  ];

echo json_encode( $result );

// 数据安全检查
dataFilter($record);

/**
 * data filter
 */
function dataFilter(&$record){
  foreach ($record as &$value) {
    $value = trim($value);
  }
  unset($value);
}
