<?php

/**
 * 从xml文件中读取xml数据
 * example: $host = (string)xmlFileRead($url)->usrConfig->host; //"localhost"
 */
function xmlFileRead($url){
	if( !file_exists($url) ){
		$xmlObj = "File didn't exit!";
	}
	else{
		$xmlObj = simpleXmlRead($url, true);
	}
	return $xmlObj;
}

/**
 * 简化SimpleXMLElement类的使用
 * SimpleXMLElement 类
 * __construct ( string $data [, int $options = 0 [, bool $data_is_url = false [, string $ns = "" [, bool $is_prefix = false ]]]] )
 * @param data: A well-formed XML string or the path or URL to an XML document if data_is_url is TRUE.
 * @param isUrl: whether $data is a url or a well-format XML string
 */
function simpleXmlRead( $data, $isUrl = false ){
	if( is_string($data) && is_bool($isUrl) ){
		return new SimpleXMLElement($data, null, $isUrl);
	}
	else{
		return false;
	}
}

/**
 * 其他编码转换成utf8
 * @param $datas: datas or data being convert
 * @param $charset: current encoding
 */
function convert2UTF8($datas, $charset){
	$chartype = ($charset == 'utf8') ? 1 : 0; //if $datas current encoding is utf8, do not convert
	if(!is_array($datas))
		$datas = $chartype ? $datas : iconv( $charset,"utf-8", $datas );
	else{
		while(list($i,$element) = each($datas))
			$datas[$i] = $chartype ? $datas[$i] : iconv( $charset,"utf-8", $datas[$i] );
	}
	return $datas;
}
