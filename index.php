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

    <!-- choose a car -->
    <div class="td-form-field td-form-comb td-form-comb-img-text" id="car">
      <label for="">车辆选择</label>
      <div class="td-form-comb-selected td-form-comb-img-text-selected">
        <div class="td-form-comb-item td-form-comb-img-text-item">
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
        <div class="td-form-comb-img-text-item-detial" id="car1">
          <div class="td-car-info">
            <div>车牌号：<span class="td-car-info-plate-number">粤A.XXXXXX</span></div>
            <div>座位数：<span class="td-car-info-seating">7座</span></div>
          </div>
          <table class="td-car-reservation">
            <tbody>
              <tr>
                <td class="td-car-reservation-data">今日：</td>
                <td class="td-car-reservation-time">08:00-12:00|18:00-19:00|18:00-19:00</td>
              </tr>
              <tr>
                <td class="td-car-reservation-data">明日：</td>
                <td class="td-car-reservation-time">08:00-12:00</td>
              </tr>
            </tbody>
          </table>
        </div>
        <li class="td-form-comb-img-text-item">
          <div class="td-form-comb-img-text-item-img"><img src="./img/cars-pics/白福.jpg" ></div>
          <div class="td-form-comb-img-text-item-text">白色福特</div>
          <div class="td-form-field-detail fa fa-car"></div>
        </li>
        <div class="td-form-comb-img-text-item-detial" id="car2">
          <div class="td-car-info">
            <div>车牌号：<span class="td-car-info-plate-number">粤A.XXXXXX</span></div>
            <div>座位数：<span class="td-car-info-seating">7座</span></div>
          </div>
          <table class="td-car-reservation">
            <tbody>
              <tr>
                <td class="td-car-reservation-data">今日：</td>
                <td class="td-car-reservation-time">08:00-12:00|18:00-19:00|18:00-19:00</td>
              </tr>
              <tr>
                <td class="td-car-reservation-data">明日：</td>
                <td class="td-car-reservation-time">08:00-12:00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ul>
    </div>
    <!-- choose a car -->

    <!-- usage -->
    <div class="td-form-field td-form-comb td-form-comb-text" id="usage">
      <label for="">用车事由</label>
      <div class="td-form-comb-selected td-form-comb-text-selected">
        <div class="td-form-comb-item td-form-comb-text-item">
          <div class="td-form-comb-text-item-text">外勤</div>
        </div>
      </div>
      <ul class="td-form-comb-text-list">
        <li class="td-form-comb-text-item">
          <div class="td-form-comb-text-item-text">出差</div>
        </li>
        <li class="td-form-comb-text-item">
          <div class="td-form-comb-text-item-text">接待</div>
        </li>
        <li class="td-form-comb-text-item">
          <div class="td-form-comb-text-item-text">外勤</div>
        </li>
        <li class="td-form-comb-text-item">
          <div class="td-form-comb-text-item-text">车辆维修</div>
        </li>
        <li class="td-form-comb-text-item">
          <div class="td-form-comb-text-item-text">其他</div>
        </li>
      </ul>
    </div>
    <!-- usage -->

    <!-- driver -->
    <div class="td-form-field td-form-easy-picker" id="driver">
      <label for="">司机</label>
      <output class="td-form-easy-picker-selected"></div>
    </div>
    <!-- driver -->

    <!-- accompanist -->
    <div class="td-form-field td-form-textarea" id="accompanist">
      <label for="">随行人员</label>
      <textarea placeholder="输入随行人员的姓名" maxlength="140"></textarea>
    </div>
    <!-- accompanist -->

    <!-- startpoint -->
    <div class="td-form-field" id="startpoint">
      <label for="">起点</label>
      <input id="" type="text" placeholder="输入出发地点">
    </div>
    <!-- startpoint -->

    <!-- endpoint -->
    <div class="td-form-field" id="endpoint">
      <label for="">终点</label>
      <input id="" type="text" placeholder="输入目的地">
    </div>
    <!-- endpoint -->

    <!-- schedule-start -->
    <div class="td-form-field td-form-datetime-picker" id="schedule-start">
      <label for="">出发时刻</label>
      <output name="datetime-output"></output>
      <input type="datetime-local">
    </div>
    <!-- schedule-start -->

    <!-- schedule-end -->
    <div class="td-form-field td-form-datetime-picker" id="schedule-end">
      <label for="">返回时刻</label>
      <output name="datetime-output"></output>
      <input type="datetime-local">
    </div>
    <!-- schedule-end -->

    <!-- remark -->
    <div class="td-form-field td-form-textarea">
      <label for="">备注</label>
      <textarea placeholder="输入备注(最多可以输入140个字符)" maxlength="140"></textarea>
    </div>
    <!-- remark -->

    <!-- approver -->
    <div class="td-form-field td-form-approver-picker">
      <label for="">审批人</label>
      <ul class="td-form-approver-picker-list">
        <li class="td-form-approver-picker-item" id="admin">
          <div class="td-form-approver-picker-item-avatar fa fa-arrow-right">
            <img src="http://static.dingtalk.com/media/lADOC8otZ8ylzKU_165_165.jpg">
          </div>
          <div class="td-form-approver-picker-item-name">卢威</div>
        </li>
        <div class="td-form-approver-picker-add">
          <div class="td-form-approver-picker-add-icon fa fa-plus"></div>
        </div>
      </ul>
    </div>
    <!-- approver -->

    <!-- cc -->
    <div class="td-form-field td-form-cc-picker">
      <label for="">抄送</label>
      <ul class="td-form-cc-picker-list">
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
    <!-- cc -->

    <!-- submit -->
    <div class="td-form-field td-form-button">
      <div class="td-button">提交申请</div>
    </div>
    <!-- submit -->
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
