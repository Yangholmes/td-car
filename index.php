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

    <div class="td-form-field td-form-datetime-picker">
      <label for="">日期时间</label>
      <output name="datetime-output">2017-02-23 11:13</output>
      <input type="datetime-local">
    </div>

    <div class="td-form-field td-form-textarea">
      <label for="">大段文本</label>
      <textarea placeholder="提示语示意(最多可以输入140个字符)" maxlength="140"></textarea>
    </div>

    <div class="td-form-field td-form-comb td-form-comb-text">
      <label for="">下拉列表<br>不带图片</label>
      <div class="td-form-comb-text-selected">
        <div class="td-form-comb-text-item">
          <div class="td-form-comb-text-item-text">选项一</div>
        </div>
      </div>
      <ul class="td-form-comb-text-list">
        <li class="td-form-comb-text-item">
          <div class="td-form-comb-text-item-text">选项一</div>
        </li>
        <li class="td-form-comb-text-item">
          <div class="td-form-comb-text-item-text">选项二</div>
        </li>
      </ul>
    </div>

    <div class="td-form-field td-form-comb td-form-comb-img-text">
      <label for="">下拉列表<br>带图片</label>
      <div class="td-form-comb-img-text-selected">
        <div class="td-form-comb-img-text-item">
          <div class="td-form-comb-img-text-item-img"><img src="./img/cars-pics/白奥.jpg" ></div>
          <div class="td-form-comb-img-text-item-text">白色奥德赛</div>
          <div class="td-form-field-detail fa fa-car"></div>
        </div>
      </div>
      <ul class="td-form-comb-img-text-list">
        <li class="td-form-comb-img-text-item">
          <div class="td-form-comb-img-text-item-img"><img src="./img/cars-pics/白奥.jpg" ></div>
          <div class="td-form-comb-img-text-item-text">白色奥德赛</div>
          <div class="td-form-field-detail fa fa-car"></div>
        </li>
        <li class="td-form-comb-img-text-item">
          <div class="td-form-comb-img-text-item-img"><img src="./img/cars-pics/白福.jpg" ></div>
          <div class="td-form-comb-img-text-item-text">白色福特</div>
          <div class="td-form-field-detail fa fa-car"></div>
        </li>
      </ul>
    </div>

    <div class="td-form-field td-form-approver-picker">
      <label for="">审批人</label>
      <ul class="td-form-approver-picker-list">
        <li class="td-form-approver-picker-item">
          <div class="td-form-approver-picker-item-avatar fa fa-arrow-right">
            <img src="https://static.dingtalk.com/media/lADOCtdeBs0C7s0C7g_750_750.jpg">
          </div>
          <div class="td-form-approver-picker-item-name">陈楚娜</div>
        </li>
        <li class="td-form-approver-picker-item">
          <div class="td-form-approver-picker-item-avatar fa fa-arrow-right">
            <img src="https://static.dingtalk.com/media/lADOCtdeBs0C7s0C7g_750_750.jpg">
          </div>
          <div class="td-form-approver-picker-item-name">陈楚娜</div>
        </li>
        <div class="td-form-approver-picker-add">
          <div class="td-form-approver-picker-add-icon fa fa-plus"></div>
        </div>
      </ul>
    </div>

    <div class="td-form-field td-form-cc-picker">
      <label for="">抄送</label>
      <ul class="td-form-cc-picker-list">
        <li class="td-form-cc-picker-item">
          <div class="td-form-cc-picker-item-avatar">
            <img src="https://static.dingtalk.com/media/lADOCtdeBs0C7s0C7g_750_750.jpg">
          </div>
          <div class="td-form-cc-picker-item-name">陈楚娜</div>
        </li>
        <li class="td-form-cc-picker-item">
          <div class="td-form-cc-picker-item-avatar">
            <img src="https://static.dingtalk.com/media/lADOCtdeBs0C7s0C7g_750_750.jpg">
          </div>
          <div class="td-form-cc-picker-item-name">陈楚娜</div>
        </li>
        <div class="td-form-cc-picker-add">
          <div class="td-form-cc-picker-add-icon fa fa-plus"></div>
        </div>
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
    <script src="./js/dd-init.js"></script>
    <script src="./index.js"></script>
    <!-- script end -->
</body>

</html>
