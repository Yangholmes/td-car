$(document).ready(function() {
  var thisUser = localStorage.getItem('thisUser');

  if( !thisUser ){
  window.location.href = 'http://www.gdrtc.org/dd-verification/index.php';
  }
  else if( thisUser == 'error' ){
    $('body').html('');
    window.localStorage.removeItem('thisUser');
    window.close();
  }

  if (thisUser) {
      var userId = JSON.parse(thisUser).userid;
      // var userId = '0607666063848651';
      tdCarInit({"userId": userId});
  }
});

var _car = [];
var formJsons = [];
/**
 * Initial all
 */
var tdCarInit = function(userId){
  $.ajax({
    // url: 'server/car-management/car-load.php',
    url: 'server/reservation/application-init.php',
    method: 'POST',
    dataType: 'json',
    data: userId,
    error: function(respond, status, error){
      // console.log(respond);
    },
    success: function(data, status, respond){
      if( data.error == '0' ){
        _car = data.records;
        tdFormData();
        tdFormController();
      }else if(data.error == '2'){
        $.tdAlert(data.errorMsg);
        $("#canot-operate-mask").show();
      }
      else
        $.tdAlert('车辆初始化失败\n请重试');
    },
  });
};

/**
 * UI control view
 */
 var showAddBtn = function(){
   $('.add-button').show();
   $('body').css("overflow","auto");
 }

/**
 * UI control data
 */
var tdFormData = function(car){
  $('.add-button').on('touchend', function(e) {
      $('#volet_clos').slideDown();
      $('.add-button').hide();
      $('body').css("overflow","hidden");
  });

  $('.cancel-button').on('touchend', function(e) {
      $('#volet_clos').slideUp('nomal', showAddBtn());

  });

  /**
   * init td-form-comb-img-text data
   */
  var list = $('ul.td-form-comb-img-text-list');
  var itemHtml = '<li class="td-form-comb-img-text-item"><div class="td-form-comb-img-text-item-img"><img src="" ></div><div class="td-form-comb-img-text-item-text"></div><!-- 点击查看详情按钮 --><div class="td-form-field-detail fa fa-hand-pointer-o"></div></li><div class="td-form-comb-img-text-item-detial" id=""><div class="td-car-info"><div>车牌号：<span class="td-car-info-plate-number"></span></div><div>座位数：<span class="td-car-info-seating"></span></div></div><div class="td-car-status"><div>剩余油量：<span class="td-car-status-fuel-indicator"></span>%</div><div>粤通卡余额：<span class="td-car-status-unitollGD"></span>元</div></div><table class="td-car-reservation"><tbody><tr><td class="td-car-reservation-data">近日已约</td><td class="td-car-reservation-time"></td></tr></tbody></table></div>';

  _car.map(function(car, i, cars){
    var item = $(itemHtml),
        recentRes = [];

    // recent reservation
    car.reservation.map(function(res){
      recentRes.push( res.applicant + res['schedule-start'].replace(/^\d{4}-/, '') + "<span style='color:red'>~</span>" + res['schedule-end'].replace(/^\d{4}-/, '') );
    });
    car.suspend.map(function(res){
      recentRes.push( res.applicant + res['schedule-start'].replace(/^\d{4}-/, '') + "<span style='color:red'>~</span>" + res['schedule-end'].replace(/^\d{4}-/, '') + " 未还" );
    });

    item.eq(0).attr('id', 'td-car-item-'+car.carid);
    item.eq(1).attr('id', 'td-car-detail-'+car.carid);
    item.find('img').attr('src', car.imageSrc);
    item.find('.td-form-comb-img-text-item-text').html(car.model);
    item.find('.td-car-info-plate-number').html(car.plateNumber);
    item.find('.td-car-info-seating').html(car.seating);
    item.find('.td-car-status-fuel-indicator').html(car.carStatus[0].fuelIndicator);
    item.find('.td-car-status-unitollGD').html(car.carStatus[0].unitollGD);
    item.find('.td-car-reservation-time').html(recentRes.length===0?'近日无约车记录':recentRes.join('<br>'));

    item.appendTo(list);
  });

}

/**
 * UI control handlers
 */
var tdFormController = function(){
  /**
   * when touch is moving, prevent touchend event
   */
  var touchMoving = false, // true is to prevent default event handler when touch is moving
      preventMoving = false;
  $('body').on('touchstart', function(e) {
      touchMoving = false;
  });
  $('body').on('touchmove', function(e) {
      touchMoving = true;
  });

  /**
   * td-form-datetime-picker
   */
  $('.td-form-datetime-picker input').on('focus', function(e) {
    if (touchMoving) return; //
    e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
    $(e.currentTarget).blur();
    dd.biz.util.datetimepicker({
        format: 'yyyy-MM-dd HH:mm',
        value: '', //默认显示
        onSuccess : function(result) {
          $(e.currentTarget).val(result.value).blur(); // notice: must format datetime value
        },
        onFail : function() {
          $(e.currentTarget).blur();
        }
    });
  });

  /**
   * td-form-comb-text
   * td-form-comb-img-text
   */
  // popup list
  $('.td-form-comb').on('touchend', function(e) {
      if (touchMoving) return; // prevent popup while touch is moving
      // $(e.currentTarget).find('ul').addClass('popup');
      // $('.transparent-mask').addClass('popup');
      popup.call($(e.currentTarget).find('ul'), true);
      preventMoving = true;
  });
  // select item
  $('.td-form-comb ul li').on('touchend', function(e) {
    if (touchMoving) return; //
    e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
    var selectedId = e.currentTarget.id;
    //car和usage的id位置不一样。例如用途td-usage-2和车辆选择td-car-item-97，id一个是item[2],一个是item[3]
    var item = selectedId.split('-');

    //限制用户一辆车只能选一次
    if(item[1] == 'car'){
      var carId = item[3];
      for(var index = 0; index< formJsons.length; index++){
        if(formJsons[index].car == carId){
          $.tdAlert('这辆车你已经选过了哦');
          return;
        }
      }
    }

    var selectedDiv = $(e.currentTarget).parent('ul').prev('.td-form-comb-selected').find('.td-form-comb-item'),
        selectedCtx = $(e.currentTarget).html();
    selectedDiv.html(selectedCtx).attr('id', selectedId).find('.td-form-field-detail').removeClass('fa fa-hand-pointer-o');
    if(item[1] == 'car'){
      $(e.currentTarget).parent('ul').prevAll('input').val(item[3]);
    }else{$(e.currentTarget).parent('ul').prevAll('input').val(item[2]);}

    // $('.popup').removeClass('popup');
    popup.call($(e.currentTarget).parent('ul'));
    preventMoving = false;
  });
  // toggle details
  $('.td-form-field-detail').on('touchend', function(e) {
    if (touchMoving) return; //
    e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
    var detailDiv = $(e.currentTarget).parent('li').next('.td-form-comb-img-text-item-detial');
    $('.td-form-comb-img-text-item-detial').slideUp();
    if( detailDiv.css('display') == 'none' )
      detailDiv.slideDown();
  });
  // popup method
  function popup(action){
    if(action){
      $('.transparent-mask').addClass('popup').show();
      this.addClass('popup').fadeIn(200);
      $('body').addClass('fixed');
    }
    else{
      this.addClass('popup').fadeOut(450);
      $('.transparent-mask').addClass('popup').hide();
      $('body').removeClass('fixed');
    }
  }

  /**
   * td-form-easy-picker
   */
  $('.td-form-easy-picker').on('touchend', function(e) {
    if (touchMoving) return; //
    e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
    contactChoose(0, false, [], [], function(data) {
      console.log(data);
      $(e.currentTarget).find('output').val(data[0].name);
      $(e.currentTarget).find('input').val(JSON.stringify(data[0]));
    });
  });

  /**
   * td-form-approver-picker
   */
  // add
  $('.td-form-approver-picker').on('upload', formatUserList)
    .find('ul div.td-form-approver-picker-add').on('touchend', function(e) {
      if (touchMoving) return; //
      e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
      contactChoose(0, false, [], [], function(data) {
        // if(data[0].emplId == _user.userid){
        //   $.tdAlert('不能够自己审批自己哦~');
        //   return false;
        // }
        var approverPickerList = $(e.currentTarget).parents('.td-form-approver-picker').find('ul div.td-form-approver-picker-add'),
            newApproverHtml = '<li class="td-form-approver-picker-item">' +
                              '<input type="hidden" class="td-form-input-hidden">' +
                              '<div class="td-form-approver-picker-item-avatar fa fa-arrow-right">' +
                              '<img src=' +
                              data[0].avatar +
                              '>' +
                              '</div>' +
                              '<div class="td-form-approver-picker-item-name">' +
                              data[0].name +
                              '</div></li>',
            newApprover = $(newApproverHtml);
        newApprover.on('touchend', deleteApprover).find('input').val(JSON.stringify(data[0]));
        approverPickerList.before( newApprover );
      });
    });
  // delete
  var deleteApprover = function(e){
    console.log(e);
    if (touchMoving) return; //
    e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
    $(e.currentTarget).remove();
  };
  // delete default approver
  $('ul.td-form-approver-picker-list li').on('touchend', deleteApprover);

  /**
   * td-form-cc-picker
   */
  // add
  $('.td-form-cc-picker').on('upload', formatUserList)
    .find('ul div.td-form-cc-picker-add').on('touchend', function(e) {
      if (touchMoving) return; //
      e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
      contactChoose(0, false, [], [_user.userid], function(data) {
                if(data[0].emplId == _user.userid){
                  $.tdAlert('不能够抄送给自己哦~');
                  return false;
                }
                var ccPickerList = $(e.currentTarget).parents('.td-form-cc-picker').find('ul div.td-form-cc-picker-add'),
                    newCcHtml = '<li class="td-form-cc-picker-item">' +
                                '<input type="hidden" class="td-form-input-hidden">' +
                                '<div class="td-form-cc-picker-item-avatar">' +
                                '<img src=' +
                                data[0].avatar +
                                '>' +
                                '</div>' +
                                '<div class="td-form-cc-picker-item-name">' +
                                data[0].name +
                                '</div></li>',
                    newCc = $(newCcHtml);
                newCc.on('touchend', deleteCc).find('input').val(JSON.stringify(data[0]));
                ccPickerList.before( newCc );
            });
    });
  // delete
  function deleteCc(e){
    if (touchMoving) return; //
    e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
    $(e.currentTarget).remove();
  }

  /**
   * dd.biz.contact.choose
   */
   function contactChoose(startWithDepartmentId, multiple, defaultUsers, disabledUsers, callback){
     dd.biz.contact.choose({
           startWithDepartmentId: startWithDepartmentId, //-1表示打开的通讯录从自己所在部门开始展示, 0表示从企业最上层开始，(其他数字表示从该部门开始:暂时不支持)
           multiple: multiple, //是否多选： true多选 false单选； 默认true
           users: defaultUsers, //默认选中的用户列表，userid；成功回调中应包含该信息
           disabledUsers: disabledUsers, // 不能选中的用户列表，员工userid
           corpId: _config.corpId, //企业id
           // max: , //人数限制，当multiple为true才生效，可选范围1-1500
           limitTips: "挑太多啦！", //超过人数限制的提示语可以用这个字段自定义
           isNeedSearch: true, // 是否需要搜索功能
           title: "挑个人呗~", // 如果你需要修改选人页面的title，可以在这里赋值
           local: "false", // 是否显示本地联系人，默认false
           onSuccess: function(data) {
             callback(data);
           },
           onFail: function(err) {
             $.tdAlert('非常抱歉！\n您的通信录打不开。。。');
           }
      });
   }

  /**
   * upload event handler
   * td-form-approver-picker
   * td-form-cc-picker
   */
  function formatUserList(e){
    var input = $(e.currentTarget).children('input'),
        liInputs = $(e.currentTarget).find('ul li input'),
        users = [];
    for( value of liInputs.toArray() ){
       users.push(JSON.parse( value.value ));
    }
    input.val( JSON.stringify(users) );
  }

  /**
   * td-form-field td-form-button
   */
   var serializeForm=function(form){
        var parts={},
            field=null,
            i,
            len,
            j,
            optLen,
            option,
            optValue;
        for(i = 0, len = form.elements.length;i<len;i++){
            field=form.elements[i];
            switch (field.type){
                case 'select-one':
                case 'select-multiple':
                    break;
                case undefined: //字段集
                case 'file':
                case 'submit':
                case 'reset':
                case 'button':
                    break;
                case 'radio':
                case 'checkbox':
                    if(!field.checked){
                        break;
                    }
                default :
                    if(field.name.length){
                        parts[field.name]=field.value;
                    }
            }
        }
        return JSON.stringify(parts);
    }

  $('.td-form-button .td-button').on('touchend', function(e) {
      $('.td-form-approver-picker').trigger('upload');
      $('.td-form-cc-picker').trigger('upload');
      $('input#applicant').val( JSON.stringify({
        "avatar": _user.avatar,
        "emplId": _user.userid,
        "name": _user.name,
      }) );

      var form = $('form'),
          formData = new FormData(form[0]),
          requiredFields = form.find('*[required]');

          for( var field of requiredFields ){
            if(!field.value){
              // todo
              $.tdAlert(
                $(field).prev('label').css('color', 'red').animate({opacity: 0}, 500, function(){
                  $(this).css({'opacity': '1', 'color': 'black'})
                }).html() + "必填哦~"
              );
              return false;
            }
          }

          var formJson = $.parseJSON(serializeForm(form[0]));
          formJsons.push(formJson);
          formJson.carName = $('.td-form-comb-img-text-item-text')[0].innerHTML;
          formJson.driverName = $('#driver')[0].value;
          var usageName = '';
          switch (formJson.usage) {
            case "0": usageName = '出差'; break;
            case "1": usageName = '接待'; break;
            case "2": usageName = '外勤'; break;
            case "3": usageName = '车辆维修'; break;
            case "4": usageName = '其他'; break;
          }
          //用车辆id当作table的id，作为删除时依据
          var htmlParam = '<div class="td-table-div" id="table-'+formJson.car+'"><table class="td-approval-table">'+
          '<tr><td class="table-left">车辆：</td><td>'+formJson.carName+'</td></tr>'+
          '<tr><td class="table-left">用车事由：</td><td>'+usageName+'</td></tr>'+
  				'<tr><td class="table-left">司机：</td><td>'+formJson.driverName+'</td></tr>'+
  				'<tr><td class="table-left">随行人员：</td><td>'+formJson.accompanist+'</td></tr>'+
  				'<tr><td class="table-left">出发地点：</td><td>'+formJson.startpoint+'</td></tr>'+
  				'<tr><td class="table-left">目的地点：</td><td>'+formJson.endpoint+'</td></tr>'+
  				'<tr><td class="table-left">出发时刻：</td><td>'+formJson['schedule-start']+'</td></tr>'+
  				'<tr><td class="table-left">返回时刻：</td><td>'+formJson['schedule-end']+'</td></tr>'+
  				'<tr><td class="table-left">备注：</td><td>'+formJson.remark+'</td></tr>'+
    			'</table><button class="fa fa-trash-o app-delete"></button></div>';
          $('#has-apply').append(htmlParam);
          $('#volet_clos').slideUp('nomal', showAddBtn());

          resetForm(form[0]);
  });

  var resetForm = function(form){
    form.reset();
    $('form').find('.td-form-comb-selected').children().remove();
//两个默认选择框要还原。一个是车辆，一个是用途。他们class不一样
    var htmlParam = '<div class="td-form-comb-item td-form-comb-text-item"><span class="td-form-field-tips">请选择</span></div>';
    var htmlParam2 = '<div class="td-form-comb-item td-form-comb-img-text-item"><span class="td-form-field-tips">请选择</span></div>';
    $('#selected-car').append(htmlParam2);
    $('#selected-usage').append(htmlParam);

    $('form').find('input[type=hidden]').attr("value",'');
  }


};
//动态生成的节点直接绑定监听没用，需要绑到父节点或body等现有的
$("body").on('touchend','.app-delete',function(e){
  var parent = $(e.currentTarget).parent('div')[0];
  var carId = parent.id.split("-")[1];
  for(var i=0; i<formJsons.length; i++){
    if(formJsons[i].car == carId){
      formJsons.splice(i, 1);
      break;
    }
  }
  parent.remove();
});
$("#submit-all").on('touchend', function(e){
  console.log(formJsons);
  if(formJsons.length>0){
    if($('ul.td-form-approver-picker-list li').length == 0){
      $.tdAlert('至少选择一位审批人');
      return false;
    }
    var approvers = [];
    $('ul.td-form-approver-picker-list input').each(function(){
        approvers.push(this.value);
    });
    var fromData={'formData':formJsons, 'approvers':approvers};
    var ccs = [];//一点要先初始化
    if($('ul.td-form-cc-picker-list li').length > 0){
      $('ul.td-form-cc-picker-list input').each(function(){
          ccs.push(this.value);
      });
    }
    fromData.ccs = ccs;
    $.ajax({
        url: 'server/reservation/multi-apply.php',
        type: "POST",
        data: JSON.stringify(fromData),
        dataType: 'json',
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: "application/json; charset=utf-8",// 必须false才会自动加上正确的Content-Type
        cache: false,
        beforeSend: function(){
          dd.device.notification.showPreloader({
            text: "正在使劲提交申请...", //loading显示的字符，空表示不显示文字
            showIcon: true, //是否显示icon，默认true
            onSuccess : function(result) {},
            onFail : function(err) {}
        })
        },
        success: function(data, status, respond) {
          dd.device.notification.hidePreloader({
              onSuccess : function(result) {},
              onFail : function(err) {}
          });
          if( data.error == 0 ){
            $.tdAlert('恭喜，提交成功！');
            window.location.reload();
          }
          else{
            $.tdAlert(data.errorMsg);
          }
        },
        error: function(respond, status, error) {
          dd.device.notification.hidePreloader({
              onSuccess : function(result) {},
              onFail : function(err) {}
          });
          $.tdAlert('申请失败！T.T');
        },
    });
  }else{
    $.tdAlert('请新增申请再提交~');
  }
});
