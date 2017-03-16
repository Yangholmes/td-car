<?php

/**
 * in: new reservation form
 * out: result object
 */

/**
 * set timezone
 * set the default timezone to use. Available since PHP 5.1
 */
date_default_timezone_set('Asia/Shanghai');
$currentTime = time(); // unused

/**
 * 最终审批人
 */
$finalApprover = [
  "avatar" => "http://static.dingtalk.com/media/lADOC8otZ8ylzKU_165_165.jpg",
  "emplId" => "03401806572466",
  "name"   => "卢威",
];

/**
 * require libs
 */
require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');
require_once( __DIR__.'/../../server/api/Msg.php');

/**
 * recieve POST data
 */
$record = $_POST;

$record['driver']    = json_decode( $record['driver'] );
$record['approver']  = json_decode( $record['approver'] );
$record['cc']        = json_decode( $record['cc'] );
$record['applicant'] = json_decode( $record['applicant'] );
// 插入最终审批人
array_push($record['approver'], $finalApprover);

$record['car']       = preg_replace('/(td-car-item-)(\d*)$/', '$2', $record['car']);
$record['usage']     = preg_replace('/(td-usage-)(\d*)$/',    '$2', $record['usage']);

/**
 * users store all user in this query
 * [array]
 */
$users = [];
array_push( $users, object2array($record['driver']), object2array($record['applicant']) );

/**
 * instance a new yangMysql class
 */
$resQuery = new yangMysql(); // instantiation
$resQuery->selectDb(DB_DATABASE); //
$resQuery->selectTable("reservation");

// 数据安全检查
carFilter($record);

/**
 * reserve date time conflict checking
 */
// 冲突检测条件
$condition = "( `car` = '".$record['car']."' )
              and
              (
                ( `schedule-start` between '".$record['schedule-start']."' and '".$record['schedule-end']."' )
      					or
      					( `schedule-end` between '".$record['schedule-start']."' and '".$record['schedule-end']."' )
      					or
      					( `schedule-start` <= '".$record['schedule-start']."' and `schedule-end`>='".$record['schedule-end']."' )
              )
              and
              ( `status` <> '2' )";

$res = $resQuery->simpleSelect(null, $condition, null, null ); // 查询时刻表
$conflict = count($res);

if($conflict) {
  $error = '1';
  $errorMsg = '该时段已经被预约';
}
else{
  $newRes = [
    'resid'          => randomIdFactory(20),
    'createDt'       => date("Y-m-d H:i:s"),
    'applicant'      => $record['applicant']->emplId,
    'car'            => $record['car'],
    'usage'          => $record['usage'],
    'driver'         => $record['driver']->emplId,
    'accompanist'    => $record['accompanist'],
    'startpoint'     => $record['startpoint'],
    'endpoint'       => $record['endpoint'],
    'schedule-start' => $record['schedule-start'],
    'schedule-end'   => $record['schedule-end'],
    'remark'         => $record['remark'],
    'status'         => '0',
  ];

  // echo json_encode( $newRes );

  /**
   * 插入新数据
   */
  $res = $resQuery->insert($newRes);

  if(!$res){
      $error = '2';
      $errorMsg = '本次申请失败';
  }
  else{
    $res = $resQuery->query('select @@IDENTITY');
    $condition = "id = ".$res[0]['@@IDENTITY'];
    $res = $resQuery->simpleSelect(null, $condition, null, null ); // 查询新的预约单号

    $record['resid'] = $res[0]['resid'];

    /**
     * 插入新的审批流程
     * 插入新的抄送
     * 同时更新user table
     */
    // approval
    $resQuery->selectTable("approval");
    for($i=0; $i<count($record['approver']); $i++){
      $approver = object2array( $record['approver'][$i] );
      array_push( $users, $approver );
      // echo json_encode($approver);
      $newApr = [
        'resid'    => $record['resid'],
        'userid'   => $approver['emplId'],
        'sequence' => $i,
        'result'  => '0',
      ];
      $resQuery->insert($newApr);
    }
    // cc
    $resQuery->selectTable("cc");
    for($i=0; $i<count($record['cc']); $i++){
      $cc = object2array( $record['cc'][$i] );
      array_push( $users, $cc );
      $newCc = [
        'resid' => $record['resid'],
        'userid' => $cc['emplId'],
      ];
      $resQuery->insert($newCc);
    }

    $error = '0';
    $errorMsg = 'success';

  }
}

// return to browser
$result = [
  "records"  => $record,
  "error"    => $error,
  "errorMsg" => $errorMsg
];
echo json_encode( $result ); // 返回预约单单号

if($error == '0'){
  /**
   * send Msg
   */
  $msg = new Msg(null);
  $respond = $msg->sendMsg([
  	"touser"  => object2array($record['approver'][0])['emplId'],
  	"agentid" => "76647142",
  	"msgtype" => "link",
  	"link"    => [
  					// "messageUrl" => "http://www.gdrtc.org/car/page/approval.html?resid=".$record['resid']."&signature=".randomIdFactory(10), // 避免消息重复，url加上随机的特征码
            "messageUrl" => SERVER_HOST."/page/approval.html?resid=".$record['resid']."&signature=".randomIdFactory(10), // 避免消息重复，url加上随机的特征码
            "picUrl" => object2array($record['applicant'])['avatar'],
  					"title" => "用车审批",
  					"text" => object2array($record['applicant'])['name']."的用车申请需要您审批"
  				]
  ]);
  // echo $respond;
}

/**
 * Update user table
 */
$resQuery->selectTable("user");
for($i=0; $i<count($users); $i++){
  $condition = "emplId='".$users[$i]['emplId']."'";
  $user = $resQuery->simpleSelect(null, $condition, null, null );
  if(!count($user)){
    $resQuery->insert($users[$i]);
  }
}

/**
 * data filter
 */
function carFilter(&$car){

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

 /**
  * 对象/数组 相互转换
  */
  function array2object($array) {
      if (is_array($array)) {
          $obj = new StdClass();
          foreach ($array as $key => $val){
              $obj->$key = $val;
          }
      }
      else { $obj = $array; }
      return $obj;
  }
  function object2array($object) {
      if (is_object($object)) {
          foreach ($object as $key => $value) {
              $array[$key] = $value;
          }
      }
      else {
          $array = $object;
      }
      return $array;
  }
