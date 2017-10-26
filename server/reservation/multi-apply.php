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
 * require libs
 */
require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');
require_once( __DIR__.'/../../server/api/Msg.php');

/**
 * recieve POST data
 */
$record = file_get_contents("php://input");

$record  = json_decode( $record );
$formDatas = $record->formData;
$users = [];//用于更新新用户到数据库
//将审批人从字符串数组转成对象
$appLength = count($record->approvers);
for($i = 0; $i < $appLength; $i++){
    $record->approvers[$i] = json_decode($record->approvers[$i]);
    array_push( $users, object2array($record->approvers[$i]) );
}
$approvers = $record->approvers;
$ccLength = count($record->ccs);
for($i=0; $i<$ccLength; $i++){
    $record->ccs[$i] = json_decode($record->ccs[$i]);
    array_push( $users, object2array($record->ccs[$i]) );
}
$ccs = $record->ccs;

$resQuery = new yangMysql(); // instantiation
$resQuery->selectDb(DB_DATABASE); //
$resQuery->selectTable("reservation");
/**
 * reserve date time conflict checking
 */
// 冲突检测条件
$arrlength=count($formDatas);
$conflictFlag = 0;
for($i=0; $i<$arrlength; $i++){
  $formData=$formDatas[$i];
  $condition = "( `car` = '".$formData->car."' )
                and
                (
                  ( `schedule-start` between '".$formData->{'schedule-start'}."' and '".$formData->{'schedule-end'}."' )
        					or
        					( `schedule-end` between '".$formData->{'schedule-start'}."' and '".$formData->{'schedule-end'}."' )
        					or
        					( `schedule-start` <= '".$formData->{'schedule-start'}."' and `schedule-end`>='".$formData->{'schedule-end'}."' )
                )
                and `status` between 0 and 1";

  $res = $resQuery->simpleSelect(null, $condition, null, null ); // 查询时刻表
  $conflict = count($res);
  if($conflict>0){
    $conflictFlag = $i+1;
    break;
  }
}

if($conflictFlag != 0){
    $error = '1';
    $errorMsg = "第".$conflictFlag."辆车在该时段已经被预约，请删除后重新填写~";

}else{
  $insertFlag = 0;
  $resIdList = [];//保存插入记录的id的list
  for($i=0; $i<$arrlength; $i++){
    $formData=$formDatas[$i];
    //将司机和申请人从字符串数组转成对象，这样才能取出中间的emlId
    $formDatas[$i]->applicant = json_decode( $formDatas[$i]->applicant );
    $formDatas[$i]->driver = json_decode( $formDatas[$i]->driver );

    array_push( $users, object2array($formData->driver) );
    $newRes = [
      'resid'          => randomIdFactory(20),
      'createDt'       => date("Y-m-d H:i:s"),
      'applicant'      => $formData->applicant->emplId,
      'car'            => $formData->car,
      'usage'          => $formData->usage,
      'driver'         => $formData->driver->emplId,
      'accompanist'    => $formData->accompanist,
      'startpoint'     => $formData->startpoint,
      'endpoint'       => $formData->endpoint,
      'schedule-start' => $formData->{'schedule-start'},
      'schedule-end'   => $formData->{'schedule-end'},
      'remark'         => $formData->remark,
      'status'         => '0',
    ];

    /**
     * 插入新数据
     */
     $res = $resQuery->insert($newRes);
     if(!$res){
         $insertFlag = $i+1;
         break;
     }
     else{
       $res = $resQuery->query('select @@IDENTITY');
       $condition = "id = ".$res[0]['@@IDENTITY'];
       $res = $resQuery->simpleSelect(null, $condition, null, null ); // 查询新的预约单号
       $formDatas[$i]->resid = $res[0]['resid'];
       $formDatas[$i]->id = $res[0]['id'];
       array_push($resIdList,$res[0]['id']);
     }
  }

  if($insertFlag!=0){
    if(count($resIdList)>0){
      //有一条未成功插入则撤销之前插入的记录
      $condition = '
            update reservation set status=4 WHERE id in ('.implode(",", $resIdList).')
      ';
      $reservation = $resQuery->query($condition);
    }

    $error = '2';
    $errorMsg = '本次申请失败';
  }else{
    for($j=0; $j<$arrlength; $j++){
      $formData=$formDatas[$j];
      /**
       * 插入新的审批流程
       * 插入新的抄送, 不要在这里更新user table，因为这里比单条申请多了一层循环
       */
      // approval
      $resQuery->selectTable("approval");
      for($i = 0; $i < $appLength; $i++){
        // echo json_encode($approver);
        $newApr = [
          'resid'    => $formData->resid,
          'userid'   => $approvers[$i]->emplId,
          'sequence' => $i,
          'result'  => '0',
        ];
        $resQuery->insert($newApr);
      }
      // cc
      $resQuery->selectTable("cc");
      for($i=0; $i<$ccLength; $i++){
        $newCc = [
          'resid' => $formData->resid,
          'userid' => $ccs[$i]->emplId,
        ];
        $resQuery->insert($newCc);
      }
    }
    $error = '0';
    $errorMsg = 'success';

  }

}
// return to browser
$result = [
  "records"  => $formDatas,
  "error"    => $error,
  "errorMsg" => $errorMsg
];
echo json_encode( $result ); // 返回预约单单号

if($error == '0'){
  /**
   * send Msg
   */
   $msg = new Msg(null);
   for($j=0; $j<$arrlength; $j++){
     $formData=$formDatas[$j];
     $index = $j+1;
     $toApprover = [
       "title" => "有".$arrlength."条用车申请需要您的审批，这是第".$index."条",
       "touser" => [$approvers[0]->emplId],
       	"message_url" => SERVER_HOST."/page/approval.html?resid=".$formData->resid."&signature=".randomIdFactory(10),
       	"image"=> "", // 图片
       	"rich" => $formData->applicant->name,
       	"content" =>  "出发地点：".$formData->startpoint."\n".
                       "目的地点：".$formData->endpoint."\n".
                       "预计出发：".$formData->{'schedule-start'}."\n".
                       "预计返回：".$formData->{'schedule-end'},
     ];
     $toApplicant = [
       "title" => "这是您的新申请，一共".$arrlength."条，这是第".$index."条",
       "touser" => [$formData->applicant->emplId, '0607666063848651'],
       	"message_url" => SERVER_HOST."/page/approval.html?resid=".$formData->resid."&signature=".randomIdFactory(10),
       	"image"=> "", // 图片
       	"rich" => $formData->applicant->name,
       	"content" =>  "出发地点：".$formData->startpoint."\n".
                       "目的地点：".$formData->endpoint."\n".
                       "预计出发：".$formData->{'schedule-start'}."\n".
                       "预计返回：".$formData->{'schedule-end'},
                       ">>点击查看审批进度及详情>>",
     ];
     $respond = $msg->sendMsg($toApprover);
     $respond = $msg->sendMsg($toApplicant);
   }

}


//更新user table
$resQuery->selectTable("user");
for($i=0; $i<count($users); $i++){
  $condition = "emplId='".$users[$i]['emplId']."'";
  $user = $resQuery->simpleSelect(null, $condition, null, null );
  if(!count($user)){
    $resQuery->insert($users[$i]);
  }
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
