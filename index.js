;

$(function() {
  tdCarInit();
});

/**
 * super global variables
 * _config  °
 * _user    °
 * _car     √
 */
var _car = [];

/**
 * Initial all
 */
var tdCarInit = function(){
  $.ajax({
    // url: 'server/car-management/car-load.php',
    url: 'server/reservation/application-init.php',
    method: 'GET',
    dataType: 'json',
    data: 'keyword=yangholmes',
    error: function(respond, status, error){
      // console.log(respond);
    },
    success: function(data, status, respond){
      if( data.error == 0 ){
        _car = data.records;
        tdFormView();
        tdFormData();
        tdFormController();
      }
      else
        $.tdAlert('车辆初始化失败\n请重试');
    },
  });
};

/**
 * UI control view
 */
var tdFormView = function(){
  // iOS can not render fixed style correctly, so block it in iOS.
  if( /[Aa]ndroid/.test(navigator.userAgent) ){
    $('div.td-form-button').css('position', 'fixed').css('bottom', '0');
    $('div.td-form-field:nth-last-child(2)').eq(-1).css('margin-bottom', 'calc( 3em + 1em )');
  };
};

/**
 * UI control data
 */
var tdFormData = function(car){

  /**
   * init td-form-comb-img-text data
   */
  var list = $('ul.td-form-comb-img-text-list'),
      itemHtml = '<li class="td-form-comb-img-text-item"><div class="td-form-comb-img-text-item-img"><img src="" ></div><div class="td-form-comb-img-text-item-text"></div><div class="td-form-field-detail fa fa-hand-pointer-o"></div></li><div class="td-form-comb-img-text-item-detial" id=""><div class="td-car-info"><div>车牌号：<span class="td-car-info-plate-number"></span></div><div>座位数：<span class="td-car-info-seating"></span></div></div><table class="td-car-reservation"><tbody><tr><td class="td-car-reservation-data">近日已约</td><td class="td-car-reservation-time"></td></tr></tbody></table></div>';

  _car.map(function(car, i, cars){
    var item = $(itemHtml),
        recentRes = [];

    console.log(car);

    // recent reservation
    car.reservation.map(function(res){
      recentRes.push( res['schedule-start'].replace(/^\d{4}-/, '') + " ~ " + res['schedule-end'].replace(/^\d{4}-/, '') );
    });
    car.suspend.map(function(res){
      recentRes.push( res['schedule-start'].replace(/^\d{4}-/, '') + " ~ " + res['schedule-end'].replace(/^\d{4}-/, '') + "未归还" );
    });

    item.eq(0).attr('id', 'td-car-item-'+car.carid);
    item.eq(1).attr('id', 'td-car-detail-'+car.carid);
    item.find('img').attr('src', car.imageSrc);
    item.find('.td-form-comb-img-text-item-text').html(car.model);
    item.find('.td-car-info-plate-number').html(car.plateNumber);
    item.find('.td-car-info-seating').html(car.seating);
    item.find('.td-car-reservation-time').html(recentRes.length==0?'近日无约车记录':recentRes.join('<br>'));

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
    var selectedDiv = $(e.currentTarget).parent('ul').prev('.td-form-comb-selected').find('.td-form-comb-item'),
        selectedCtx = $(e.currentTarget).html(),
        selectedId = e.currentTarget.id;
    selectedDiv.html(selectedCtx).attr('id', selectedId).find('.td-form-field-detail').removeClass('fa fa-hand-pointer-o');
    $(e.currentTarget).parent('ul').prevAll('input').val(selectedId);
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
      this.addClass('popup').fadeOut(200);
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
    contactChoose(0, false, [_user.userid], [], function(data) {
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
      contactChoose(0, false, [], [_user.userid], function(data) {
        if(data[0].emplId == _user.userid){
          $.tdAlert('不能够自己审批自己哦~');
          return false;
        }
        var approverPickerList = $(e.currentTarget).parents('.td-form-approver-picker').find('ul li#admin'),
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
    if (touchMoving) return; //
    e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
    $(e.currentTarget).remove();
  }

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
  $('.td-form-button .td-button').on('touchstart', function(e) {
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

          for( field of requiredFields ){
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

          $.ajax({
              url: 'server/reservation/apply.php',
              type: "POST",
              data: formData,
              dataType: 'json',
              processData: false, // 告诉jQuery不要去处理发送的数据
              contentType : false, // 必须false才会自动加上正确的Content-Type
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
                  localStorage.setItem(data.records.resid, JSON.stringify(data.records));
                  dd.device.notification.alert({
                      message: "已经发送通知了~\n泡杯茶等领导审批吧！",
                      title: "恭喜！提交成功",//可传空
                      buttonName: "好！",
                      onSuccess : function() {},
                      onFail : function(err) {}
                  });
                  window.location.href = 'page/approval.html?resid=' + data.records.resid;
                  // location.reload(false);
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
  });

  /**
   * mask
   */
  $('.transparent-mask').on('touchend', function(e) {
      $('.popup').fadeOut(200);
      $('body').removeClass('fixed');
      preventMoving = false;
  });

  $('body').on('touchmove', function(e){
    // console.log(e);
  })

};
