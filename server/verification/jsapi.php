<?php

require_once('../api/auth.php');

/**
 * get GET
 */
$debug = _GET['debug'];

if(!$debug)
  $debug = 1;

$auth = new auth('../config/dd.config.xml', $debug);
echo $auth->get_signature;

?>
