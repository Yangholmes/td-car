<!DOCTYPE html>
<?php require_once(__DIR__.'/server/api/auth-multi.php'); ?>
<html lang="zh">
<head>
		<meta charset="utf-8">
		<title>批量申请</title>
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0">
    <link rel="stylesheet" href="./font/font-awesome-4.4.0/css/font-awesome.min.css">
		<link type="text/css" rel="stylesheet" href="./index.min.css">
    <link type="text/css" rel="stylesheet" href="./css/multi-apply.css">
    <link rel="icon" type="image/x-icon" href="./img/icon/car.ico" />
</head>
<body>
	<button class="add-button">新增</button>
		<!-- 已申请表单(开始) -->
		<div id="has-apply">
		</div>
		<!-- 已申请表单(结束) -->
		<div id="volet_clos">
			<button class="cancel-button fa fa-times"></button>
			<div id="volet">
				<div class="td-car-reservation">
			    <!-- 用车申请表单(开始) -->
			    <form id="reservation-form" enctype="multipart/form-data" autocomplete="on" >

			      <!-- This user -->
			      <input type="hidden" class="td-form-input-hidden" name="applicant" id="applicant">
			      <!-- This user -->

			      <!-- choose a car -->
			      <div class="td-form-field td-form-comb td-form-comb-img-text" id="car-comb">
			        <label for="">车辆选择</label>
			        <input type="hidden" class="td-form-input-hidden" name="car" required="required">
			        <div class="td-form-comb-selected td-form-comb-img-text-selected" id="selected-car">
			          <div class="td-form-comb-item td-form-comb-img-text-item">
			            <span class="td-form-field-tips">请选择</span>
			          </div>
			        </div>
			        <ul class="td-form-comb-img-text-list">
			        </ul>
			      </div>
			      <!-- choose a car -->

			      <!-- usage -->
			      <div class="td-form-field td-form-comb td-form-comb-text" id="usage-comb">
			        <label for="">用车事由</label>
			        <input type="hidden" class="td-form-input-hidden" name="usage" required="required">
			        <div class="td-form-comb-selected td-form-comb-text-selected" id="selected-usage">
			          <div class="td-form-comb-item td-form-comb-text-item">
			            <span class="td-form-field-tips">请选择</span>
			          </div>
			        </div>
			        <ul class="td-form-comb-text-list">
			          <li class="td-form-comb-text-item" id="td-usage-0">
			            <div class="td-form-comb-text-item-text">出差</div>
			          </li>
			          <li class="td-form-comb-text-item" id="td-usage-1">
			            <div class="td-form-comb-text-item-text">接待</div>
			          </li>
			          <li class="td-form-comb-text-item" id="td-usage-2">
			            <div class="td-form-comb-text-item-text">外勤</div>
			          </li>
			          <li class="td-form-comb-text-item" id="td-usage-3">
			            <div class="td-form-comb-text-item-text">车辆维修</div>
			          </li>
			          <li class="td-form-comb-text-item" id="td-usage-4">
			            <div class="td-form-comb-text-item-text">其他</div>
			          </li>
			        </ul>
			      </div>
			      <!-- usage -->

			      <!-- driver -->
			      <div class="td-form-field td-form-easy-picker" id="driver-picker">
			        <label for="driver">司机</label>
			        <input type="hidden" class="td-form-input-hidden" name="driver" required="required">
			        <output class="td-form-easy-picker-selected" id="driver">
			          <span class="td-form-field-tips">请选择</span>
			        </output>
			      </div>
			      <!-- driver -->

			      <!-- accompanist -->
			      <div class="td-form-field td-form-textarea" id="accompanist-input">
			        <label for="accompanist">随行人员</label>
			        <textarea placeholder="输入随行人员的姓名，多人请用空格区分" maxlength="140" id="accompanist" name="accompanist"></textarea>
			      </div>
			      <!-- accompanist -->

			      <!-- startpoint & endpoint -->
			      <fieldset class="td-form-field-set">
			        <!-- startpoint -->
			        <div class="td-form-field" id="startpoint-input">
			          <label for="startpoint">出发地点</label>
			          <input type="text" placeholder="输入出发地点" id="startpoint" name="startpoint" required="required">
			        </div>
			        <!-- startpoint -->

			        <!-- endpoint -->
			        <div class="td-form-field" id="endpoint-input">
			          <label for="endpoint">目的地点</label>
			          <input type="text" placeholder="输入目的地" id="endpoint" name="endpoint" required="required">
			        </div>
			        <!-- endpoint -->
			    </fieldset>
			    <!-- startpoint & endpoint -->

			    <!-- startpoint & endpoint -->
			    <fieldset class="td-form-field-set">
			      <!-- schedule-start -->
			      <div class="td-form-field td-form-datetime-picker" id="schedule-start-input">
			        <label for="schedule-start">出发时刻</label>
			        <input placeholder="请选择" id="schedule-start" name="schedule-start" required="required">
			      </div>
			      <!-- schedule-start -->

			      <!-- schedule-end -->
			      <div class="td-form-field td-form-datetime-picker" id="schedule-end-input">
			        <label for="schedule-end">返回时刻</label>
			        <input placeholder="请选择" id="schedule-end" name="schedule-end" required="required">
			      </div>
			      <!-- schedule-end -->
			    </fieldset>
			    <!-- startpoint & endpoint -->


			      <!-- remark -->
			      <div class="td-form-field td-form-textarea" id="remark-input">
			        <label for="remark">备注</label>
			        <textarea placeholder="输入备注(最多可以输入140个字符)" maxlength="140" id="remark" name="remark"></textarea>
			      </div>
			      <!-- remark -->

			      <!-- submit -->
			      <div class="td-form-field td-form-button" id="submit">
			        <div class="td-button">确定</div>
			      </div>
			      <!-- submit -->
			    </form>
			    <!-- 用车申请表单(结束) -->
			  </div>
				<!-- transparent mask (start) -->
			  <div class="transparent-mask">
			  </div>

			</div>
		</div>
		<!-- approver -->
		<div class="td-form-field td-form-approver-picker" id="approver-picker">
			<label for="">审批人</label>
			<input type="hidden" class="td-form-input-hidden" name="approver">
			<ul class="td-form-approver-picker-list">
				<li class="td-form-approver-picker-item" id="liurong">
					<input type="hidden" class="td-form-input-hidden" value="{&quot;name&quot;:&quot;刘荣&quot;,&quot;avatar&quot;:&quot;http://static.dingtalk.com/media/lADOCshBgM0C7s0C7g_750_750.jpg&quot;,&quot;emplId&quot;:&quot;03402113147517&quot;}">
					<div class="td-form-approver-picker-item-avatar fa fa-arrow-right">
						<img src="http://static.dingtalk.com/media/lADOCshBgM0C7s0C7g_750_750.jpg">
					</div>
					<div class="td-form-approver-picker-item-name">刘荣</div>
				</li>
				<li class="td-form-approver-picker-item" id="admin">
					<input type="hidden" class="td-form-input-hidden" value="{&quot;name&quot;:&quot;卢威&quot;,&quot;avatar&quot;:&quot;http://static.dingtalk.com/media/lADOC8otZ8ylzKU_165_165.jpg&quot;,&quot;emplId&quot;:&quot;03401806572466&quot;}">
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
		<div class="td-form-field td-form-cc-picker" id="cc-picker">
			<label for="">抄送</label>
			<input type="hidden" class="td-form-input-hidden" name="cc">
			<ul class="td-form-cc-picker-list">
				<div class="td-form-cc-picker-add">
					<div class="td-form-cc-picker-add-icon fa fa-plus"></div>
				</div>
			</ul>
		</div>
		<!-- cc -->
		<div style="text-align:center; padding-bottom:10px;"><button class="button-submit" id="submit-all">提交</button><div>
		<div id="canot-operate-mask">
			<div class = "canot-operate-tip">当前不可操作</div>
		</div>
		<script>
			var _config =
				<?php
					$auth = new Auth1(0);  // debug: 1表示本地调试；0表示远程服务器。使用本地调试时，请注意修改config文件
					echo json_encode($auth->get_signature());
				?>
		</script>
		<script src="http://g.alicdn.com/dingding/open-develop/1.0.0/dingtalk.js"></script>
			<script src="./lib/jquery/jquery-3.1.1.min.js"></script>
			<script src="./js/dd-init.js"></script>
			<script src="./js/multi-apply.js"></script>

</body>
</html>
