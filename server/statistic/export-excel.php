<?php

header("Access-Control-Allow-Origin:*"); // cross domain
/**
 * set timezone
 * set the default timezone to use. Available since PHP 5.1
 */

date_default_timezone_set('Asia/Shanghai');
$now = new DateTime();

/**
 * require libs
 */
require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');
require_once( __DIR__.'/../../server/lib/php-excel/PHPExcel.php');

require_once( __DIR__.'/../../server/statistic/reservationStatistic.php' );
/**
 * [$dataArray description]
 * @var []
 */
$dataArray = $res;

$resStatistic = new PHPExcel();

/**
 * Set document properties
 */
$resStatistic	->getProperties()->setCreator("Yangholmes")
							 ->setLastModifiedBy("Yangholmes")
							 ->setTitle($now->format('Y-m-d')."用车统计表")
							 ->setSubject("用车统计表")
							 ->setDescription($now->format('Y-m-d')."生成用车统计表")
							 ->setKeywords("用车统计表")
							 ->setCategory("用车统计表");
$resStatistic ->setActiveSheetIndex(0);

/**
 * set row head
 */
$rowhead = [ "序号", "创建时间", "出发地点", "目的地点", "预计出发时刻", "预计返回时刻", "车辆型号", "预约人", "司机", "随行人员", "实际返回时刻" ];
$columnWidth = [5, 20, 20, 20, 20, 20, 15, 10, 10, 20, 20];
for($i=0; $i<count($rowhead); $i++){
	$coordinate = indexToCoordinate($i).'1';
	$resStatistic->getActiveSheet()->setCellValue($coordinate, $rowhead[$i]);
	$resStatistic->getActiveSheet()->getColumnDimension(indexToCoordinate($i))->setWidth($columnWidth[$i]);
}

/**
 * Set data
 */
for($i=0; $i<count($dataArray); $i++){
	$j = 0;
	foreach ($dataArray[$i] as $key => $value) {
		$coordinate = indexToCoordinate($j).($i+2);
		$resStatistic->getActiveSheet()->setCellValue($coordinate, $value);
		$j++;
	}
}

/**
 * Save as Excel 2007↥ format
 */
 $objWriter = PHPExcel_IOFactory::createWriter($resStatistic, 'Excel2007');
 $objWriter->save(__DIR__."/export-file/".$now->format('Y-m-d*H:m:s')."reservation.xlsx");

 echo "downloadfrom"."http://www.gdrtc.org/car/server/statistic/export-file/".$now->format('Y-m-d*H:m:s')."reservation.xlsx";

/**
 * [indexToCoordinate: convert 2D numerical index to Excel alphabet index ]
 * @param  [type] $index [数字索引]
 * @param  string $tmp   [缓存的Excel字母索引]
 * @return [type]        [输出Excel字母索引]
 */
function indexToCoordinate( $index, $tmp = '' ){
	$alphabet 	= ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	$quotient	= floor( $index / 26 ); // 商
	$remainder	= floor( $index % 26 ); // 余数
	if( $quotient > 0 )
		$tmp = indexToCoordinate( $quotient-1, $tmp );
	$tmp .= $alphabet[$remainder];
	return $tmp;
}
