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
require_once( __DIR__.'/../../server/api/Msg.php');

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

// get reservation
$carStatusQuery->selectTable("reservation");
$condition = "id='".$record['reservation']."'";
$reservation = $carStatusQuery->simpleSelect(null, $condition, null, null)[0];
$resid = $reservation['resid'];

// get applicant
$carStatusQuery->selectTable("user");
$condition = "emplId='".$reservation['applicant']."'";
$user = $carStatusQuery->simpleSelect(null, $condition, null, null)[0];
$applicant = $user['name'];

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

// 消息模板
$msg = [
  "title" => "有一条新的完成用车申请",
  "touser" => ['0607666063848651', '03413921065005'], // 通知收信人
  "message_url" => SERVER_HOST."/page/approval.html?resid=".$resid."&signature=".randomIdFactory(10), // 避免消息重复，url加上随机的特征码
  "image"=> "", // 图片
  "rich" => $applicant,
  "content" =>  "剩余油量：".$record['fuelIndicator']."%\n".
                "粤通卡余额：".$record['unitollGD']."元\n".
                "车况：".["无", "车身损伤（包括外观，内饰）", "损伤零部件（损伤动力制动系统等）", "设备损坏（例如空调）", "其他"][$record['damageType']]."\n",
];

/**
 * send Msg
 */
$newMsg = new Msg(null);
$respond = $newMsg->sendMsg($msg);


/**
 * data filter
 */
function dataFilter(&$record){
  foreach ($record as &$value) {
    $value = trim($value);
  }
  unset($value);
}
/**
 * 随即编号生成器
 */
function randomIdFactory($length){
 if(!$length || !is_numeric($length)){
   $length = 15;
 }
 $dictionary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
 $id = '';
 for($i=0; $i<$length; $i++){ // $i define the length of noncestr
   $id .= $dictionary[ mt_rand(0, 61) ];
 }
 $id .= '{'.time().'}';
 return $id;
}
