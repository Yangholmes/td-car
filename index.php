<!DOCTYPE html>

<?php require_once(__DIR__.'/server/api/Auth.php'); ?>

<html>

<head>
    <title>通导用车</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
    <link type="text/css" rel="stylesheet" href="index.css">
</head>

<body>

  <!-- 用车申请表单(开始) -->
  <form id="">
    <div class="td-form-field">
      <label>标题示意</label>
      <input type="text" placeholder="提示语示意">
    </div>
    <div class="td-form-field">
      <label>长标题示意长标题示意</label>
      <input type="text" placeholder="提示语示意">
    </div>

    <div class="td-form-field td-form-button">
      <input type="submit">
    </div>
  </form>
  <!-- 用车申请表单(结束) -->


    <!-- script start -->
    <script>
      var _config =
        <?php
          $auth = new Auth(1);  // debug: 1表示本地调试；0表示远程服务器。使用本地调试时，请注意修改config文件
          echo json_encode($auth->get_signature());
        ?>
    </script>

    <script src="http://g.alicdn.com/dingding/open-develop/1.0.0/dingtalk.js"></script>
    <script src="./lib/jquery/jquery-3.1.1.js"></script>
    <script src="./js/dd.init.js"></script>
    <script src="./index.js"></script>
    <!-- script end -->
</body>

</html>
