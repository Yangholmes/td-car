<!DOCTYPE html>

<?php require_once('./server/api/auth.php'); ?>

<html>

<head>
    <title>通导用车</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
    <link type="text/css" rel="stylesheet" href="index.css">
</head>

<body>
    <p>施工中，请绕行。</p>

    <!-- script start -->
    <script>var _config = <?php $auth = new auth('server/config/dd.config.xml', 1); echo json_encode($auth->get_signature()); ?></script>
    <script src="http://g.alicdn.com/dingding/open-develop/1.0.0/dingtalk.js"></script>
    <script src="./lib/jquery/jquery-3.1.1.js"></script>
    <script src="./js/dd.init.js"></script>
    <script src="./index.js"></script>
    <!-- script end -->
</body>

</html>
