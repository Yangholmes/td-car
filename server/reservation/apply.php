<?php

require_once( __DIR__.'/../../server/config/server-config.php');
require_once( __DIR__.'/../../server/lib/yang-lib/yang-class-mysql.php');

/**
 * recieve POST data
 */
$record = $_POST;

$record['driver'] = json_decode( $record['driver'] );
$record['approver'] = json_decode( $record['approver'] );
$record['cc'] = json_decode( $record['cc'] );

echo json_encode( $record );
