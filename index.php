<!DOCTYPE html>

<?php require_once(__DIR__.'/server/api/Auth.php'); ?>

<html>

<head>
    <title>通导用车</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
    <link rel="stylesheet" href="font/font-awesome-4.4.0/css/font-awesome.min.css">
    <link type="text/css" rel="stylesheet" href="index.css">
</head>

<body>

  <!-- 用车申请表单(开始) -->
  <form id="">
    <div class="td-form-field">
      <label for="">标题示意</label>
      <input id="" type="text" placeholder="提示语示意">
    </div>
    <div class="td-form-field">
      <label for="">长标题示意长标题示意</label>
      <input id="" type="text" placeholder="提示语示意">
    </div>

    <div class="td-form-field td-form-comb">
      <label for="">下拉列表</label>
      <div class="td-form-comb-selected">
        <div class="td-form-comb-item">
          <div class="td-form-comb-item-img"><img src="./img/cars-pics/白奥.jpg" ></div>
          <div class="td-form-comb-item-text">白色奥德赛</div>
          <div class="td-form-field-detail fa fa-car"></div>
        </div>
      </div>
      <ul class="td-form-comb-list">
        <li class="td-form-comb-item">
          <div class="td-form-comb-item-img"><img src="./img/cars-pics/白奥.jpg" ></div>
          <div class="td-form-comb-item-text">白色奥德赛</div>
          <div class="td-form-field-detail fa fa-car"></div>
        </li>
        <li class="td-form-comb-item">
          <div class="td-form-comb-item-img"><img src="./img/cars-pics/白福.jpg" ></div>
          <div class="td-form-comb-item-text">白色福特</div>
          <div class="td-form-field-detail fa fa-car"></div>
        </li>
      </ul>
    </div>

    <div class="td-form-field td-form-button">
      <div class="td-button">按钮示例</div>
    </div>
  </form>
  <!-- 用车申请表单(结束) -->

  <!-- transparent mask (start) -->
  <div class="transparent-mask">
  </div>
  <!-- transparent mask (end) -->

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
