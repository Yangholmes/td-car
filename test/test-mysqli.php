<?php

error_reporting(E_ALL);

/**
 * mysqli 兼容性测试
 */

// $testMysql = new mysqli("sdm218631467.my3w.com", "sdm218631467", "Gdrtc750", "sdm218631467_db");
$testMysql = new mysqli("localhost", "root", "random2to666", "td_car");

// echo $testMysql->query("SHOW VARIABLES LIKE 'character_set_connection'");

$query = "select * from car";

$result = $testMysql->query($query);

$rows = $result->num_rows;

$resultRows = [
	"rows" => $rows
];

// echo "\n"."fetch rows is: \n".json_encode( $resultRows )."\n";

// echo "\n"."fetch rows is: \n".json_encode( $resultRows )."\n"

// $resultAssoc = $result->fetch_assoc();

// echo "\n"."fetch_assoc is: \n".json_encode( $resultAssoc )."\n";

// $result = $testMysql->query($query);

// $resultAll = $result->fetch_all(MYSQLI_ASSOC);

// echo "\n"."fetch_all(MYSQLI_ASSOC) is: \n".json_encode( $resultAll )."\n";

// $query = "SHOW VARIABLES LIKE 'character_set_server'";

/*$query = "select * from reservation where
					( `schedule-start` between '2017-03-13 10:00' and '2017-03-17 10:00' )
					or 
					( `schedule-end` between '2017-03-13 10:00' and '2017-03-17 10:00' )
					or
					( `schedule-start` <= '2017-03-13 10:00' and `schedule-end`>='2017-03-17 10:00' )";*/

$query = "select reservation.*, user.*, approval.userid from reservation, user, approval where reservation.applicant = user.emplId and reservation.resid = approval.resid";

$result = $testMysql->query($query);

echo "\n"."type is: \n".gettype( $result )."\n";

/* fetch associative array */
$resultAssocs = [];
while ($row = $result->fetch_assoc()) {
	// array_push($resultAssocs, arryConvertEncoding($row, "GBK"));
	array_push($resultAssocs, $row);
}
echo "\n"."total rows is: \n".$result->num_rows."\n";
echo "\n"."fetch_assocs are: \n".json_encode( $resultAssocs )."\n";


/**
 * 其他编码转换成utf8
 * @param $array: data being convert
 * @param $charset: current encoding
 */
function arryConvertEncoding($array, $charset){
	$chartype = ($charset == 'utf8') ? 1 : 0; // if $array encoding is utf8, do not convert
	while(list($i,$element) = each($array)){
		// echo $array[$i]."\n";
		$array[$i] = $chartype ? $array[$i] : iconv( $charset, "utf-8", $array[$i] );
		// echo $array[$i]."\n";
	}
	return $array;
}
