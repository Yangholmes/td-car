<?php

require_once( __DIR__.'/../../server/api/Auth.php');
require_once( __DIR__.'/../../server/api/User.php');


$accessToken = $_GET['access_token'];
$code = $_GET['code'];

$user = new User();

$userInfo = $user->getUserInfo($accessToken, $code);

echo $userInfo;
