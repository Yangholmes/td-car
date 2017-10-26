<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
 * recieve POST data
 */
$record = $_POST;

$offset = isset( $record['offset'] ) ? $record['offset'] : 0;
$rowCount = isset( $record['rowCount'] ) ? $record['rowCount'] : 1;
$loadStatus1 = isset( $record['loadStatus1'] ) ? $record['loadStatus1'] : false;
$car = $record['car'];

$resQuery = new yangMysql(); // instantiation
$resQuery->selectDb(DB_DATABASE); //

$resUnfinished = [];
//查询未还车辆或已还但管理员未确认车辆
if($loadStatus1 === 'true'){
  $resQuery->selectTable("reservation");
  $condition = "( `car` = '".$car['carid']."' )
                and `status` = '1'";
  $res = $resQuery->simpleSelect(null,$condition,['`schedule-start`', 'DESC'],null);
  $arrLength = count($res);
  for($j=0;$j<$arrLength;$j++){
    $resQuery->selectTable("carstatus");
    $condition = " `reservation` = '".$res[$j]['id']."' ";
    $carstatus = $resQuery->simpleSelect(null,$condition,null,null);
    if(count($carstatus)===0){
      $resQuery->selectTable("user");
      $condition = " `emplId` = '".$res[$j]['applicant']."' ";
      $applicant = $resQuery->simpleSelect(null,$condition,null,null);
      $res[$j]['applicant'] = $applicant[0];
      $condition = " `emplId` = '".$res[$j]['driver']."' ";
      $driver = $resQuery->simpleSelect(null,$condition,null,null);
      $res[$j]['driver'] = $driver[0];
      switch($res[$j]['usage']){
        case "0":
          $res[$j]['usage']="出差";
          break;
        case "1":
          $res[$j]['usage']="接待";
          break;
        case "2":
          $res[$j]['usage']="外勤";
          break;
        case "3":
          $res[$j]['usage']="车辆维修";
          break;
        case "4":
          $res[$j]['usage']="其他";
          break;
      }
      array_push( $resUnfinished, $res[$j]);
    }

  }
}


$resQuery->selectTable("carstatus");
$condition = "select r.*,c.fuelIndicator,c.unitollGD,c.damageType,c.damageDetails from carstatus c left join reservation r on c.reservation=r.id where `carid`='".$car['carid']."'order by c.`id` DESC limit ".$offset.",".$rowCount;
$carStatus = $resQuery->query($condition);
if($carStatus === false){
  $error = 1;
  $errorMsg = "查询失败，请重试";
}else{
  $arrLength = count($carStatus);
  for($j=0;$j<$arrLength;$j++){
    if($carStatus[$j]['id']!=null){
      $resQuery->selectTable("user");
      $condition = " `emplId` = '".$carStatus[$j]['applicant']."' ";
      $applicant = $resQuery->simpleSelect(null,$condition,null,null);
      $carStatus[$j]['applicant'] = $applicant[0];
      $condition = " `emplId` = '".$carStatus[$j]['driver']."' ";
      $driver = $resQuery->simpleSelect(null,$condition,null,null);
      $carStatus[$j]['driver'] = $driver[0];

    }else{
      $carStatus[$j]['noReservation'] = true;
    }
    if($carStatus[$j]['status'] == 1){$carStatus[$j]['returnDt'] = "等待管理员确认";}
    switch($carStatus[$j]['usage']){
      case "0":
        $carStatus[$j]['usage']="出差";
        break;
      case "1":
        $carStatus[$j]['usage']="接待";
        break;
      case "2":
        $carStatus[$j]['usage']="外勤";
        break;
      case "3":
        $carStatus[$j]['usage']="车辆维修";
        break;
      case "4":
        $carStatus[$j]['usage']="其他";
        break;
    }
    switch($carStatus[$j]['damageType']){
      case "0":
        $carStatus[$j]['damageType']="无";
        break;
      case "1":
        $carStatus[$j]['damageType']="车身损伤（包括外观，内饰）";
        break;
      case "2":
        $carStatus[$j]['damageType']="损伤零部件（损伤动力制动系统等）";
        break;
      case "3":
        $carStatus[$j]['damageType']="设备损坏（例如空调）";
        break;
      case "4":
        $carStatus[$j]['damageType']="其他";
        break;
    }
  }
  $error = 0;
  $errorMsg = "success";

}

$records['resUnfinished'] = $resUnfinished;
$records['carStatus'] = $carStatus;

$result = [
  "records"  => $records,
  "error"    => $error,
  "errorMsg" => $errorMsg
];
echo json_encode( $result );
