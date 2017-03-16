<?php

/**
 * set timezone
 * set the default timezone to use. Available since PHP 5.1
 */
date_default_timezone_set('Asia/Shanghai');

/**
 * require libs
 */
require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');
require_once( __DIR__.'/../../server/api/Msg.php');

/**
 * send Msg
 */
$msg = new Msg(null);

/**
 * recieve POST data
 */
$record = $_POST;

$resid    = $record['resid'];
$userid   = $record['userid'];
$result   = $record['result'];
$sequence = $record['sequence'];

$touser = []; // 通知收信人
$messageUrl = SERVER_HOST."/page/approval.html?resid=".$resid."&signature=".randomIdFactory(10); // 避免消息重复，url加上随机的特征码
$picUrl = IMAGE_ROOT."/icon/yeah.png";
$text = '';

/**
 * instance a new yangMysql class
 */
$aprQuery  = new yangMysql(); // 审批队列
$ccQuery   = new yangMysql(); // 抄送队列
$resQuery  = new yangMysql(); // 申请表单
$userQuery = new yangMysql(); // 用户

$aprQuery->selectDb(DB_DATABASE); $ccQuery->selectDb(DB_DATABASE); $resQuery->selectDb(DB_DATABASE); $userQuery->selectDb(DB_DATABASE);//
$aprQuery->selectTable("approval"); $ccQuery->selectTable("cc"); $resQuery->selectTable("reservation"); $userQuery->selectTable("user");

// 更新审批状态
$record['operateDt'] = date("Y-m-d H:i:s");
$condition = "resid = '".$resid."' and userid = '".$userid."'";
$apr = $aprQuery->update($record, $condition, null, null);

// 查询申请人个人信息
$condition = "resid="."'".$resid."'";
$reservation = $resQuery->simpleSelect(null, $condition, null, null);
$condition = "emplId="."'".$reservation[0]['applicant']."'";
$applicant = $userQuery->simpleSelect(null, $condition, null, null)[0];

// 如果更新失败
if( !$apr ){
  $records  = null;
  $error    = 1;
  $errorMsg = "审批失败！";
}
else{
  if($result == 1){ // 审批通过
    $sequence++;    // 查询是否存在下一个审批人
    $condition = "resid= '".$resid."' and sequence= '".$sequence."'";
    $apr = $aprQuery->simpleSelect(null, $condition, null,null);

    if( count($apr) == 0 ){ // 不存在下一个审批人，申请完成，通知申请人
      $condition = "resid="."'".$resid."'";
      $resQuery->update(['status'=>'1'], $condition, null, null);
      // send to applicant
      $respond = $msg->sendMsg([
      	"touser"  => $applicant['emplId'],
      	"agentid" => "76647142",
      	"msgtype" => "link",
      	"link"    => [
      					"messageUrl" => $messageUrl,
                "picUrl" => IMAGE_ROOT."/icon/yeah.png",
      					"title" => "用车审批",
      					"text" => "恭喜！您的用车申请顺利通过所有审批\n记得在".$reservation[0]['schedule-start']."准时出发哦~",
      				]
      ]);
      // send to cc
      $condition = "resid="."'".$resid."'";
      $cc = $ccQuery->simpleSelect(null, $condition, null, null);
      for($i=0;$i<count($cc);$i++){
        array_push( $touser, $cc[$i]['userid'] );
      }
      // send to cc
      $respond = $msg->sendMsg([
      	"touser"  => implode('|', $touser),
      	"agentid" => "76647142",
      	"msgtype" => "link",
      	"link"    => [
      					"messageUrl" => $messageUrl,
                "picUrl" => $applicant['avatar'],
      					"title" => "[抄送]用车审批",
      					"text" => $applicant['name']."的用车申请已经通过了所有审批，特此抄送给您~",
      				]
      ]);
    }
    else{ // 存在下一个审批人，审批进入下一位审批人
      $condition = "emplId = '".$apr[0]['userid']."'";
      $user = $userQuery->simpleSelect(null, $condition, null, null);
      // send message
      $respond = $msg->sendMsg([
      	"touser"  => $apr[0]['userid'],
      	"agentid" => "76647142",
      	"msgtype" => "link",
      	"link"    => [
                      "messageUrl" => SERVER_HOST."/page/approval.html?resid=".$resid."&signature=".randomIdFactory(10), // 避免消息重复，url加上随机的特征码
                      "picUrl"     => $applicant['avatar'],
                      "title"      => "用车审批",
                      "text"       => $applicant['name']."的用车申请需要您审批\n测试换行"
      				       ]
      ]);
    }
  }
  else{ // 申请被拒绝
    $aprQuery->selectTable("reservation");
    $condition = "resid="."'".$resid."'";
    $aprQuery->update(['status'=>'2'], $condition, null, null);

    // send message
    $respond = $msg->sendMsg([
      "touser"  => $applicant['emplId'],
      "agentid" => "76647142",
      "msgtype" => "link",
      "link"    => [
              "messageUrl" => SERVER_HOST."/page/approval.html?resid=".$resid."&signature=".randomIdFactory(10), // 避免消息重复，url加上随机的特征码
              "picUrl" => IMAGE_ROOT."/icon/moue.png",
              "title" => "用车审批",
              "text" => "很遗憾！\n您的用车申请被拒绝了！\n",
            ]
    ]);

  }
  $records  = null;
  $error    = 0;
  $errorMsg = null;
}

// return to browser
$result = [
  "records"  => $record,
  "error"    => $error,
  "errorMsg" => $errorMsg
];
echo json_encode( $result ); // 返回预约单单号

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
