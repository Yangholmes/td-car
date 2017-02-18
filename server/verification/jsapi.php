<?php

// require_once('../api/auth.php');

// /**
//  * get GET
//  */
// $debug = _GET['debug'];

// if(!$debug)
//   $debug = 1;

// $auth = new auth('../config/dd.config.xml', $debug);
// echo $auth->get_signature;

$dictionary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  $noncestr = '';
  for($i=0; $i<100; $i++){
    $noncestr .= $dictionary[ mt_rand(0, 61) ];
  }
echo $noncestr;

?>
