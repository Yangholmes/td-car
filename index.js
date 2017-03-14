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
var _car = {};

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
      console.log(respond);
    },
    success: function(data, status, respond){
      if( data.error == 0 ){
        _car = data.records;
        tdFormData();
        tdFormController();
      }
      else
        alert('车辆初始化失败\n请重试');
    },
  });
}

/**
 * UI control data
 */
var tdFormData = function(car){

  /**
   * init td-form-comb-img-text data
   */
  var list = $('ul.td-form-comb-img-text-list'),
      itemHtml = '<li class="td-form-comb-img-text-item"><div class="td-form-comb-img-text-item-img"><img src="" ></div><div class="td-form-comb-img-text-item-text"></div><div class="td-form-field-detail fa fa-hand-pointer-o"></div></li><div class="td-form-comb-img-text-item-detial" id=""><div class="td-car-info"><div>车牌号：<span class="td-car-info-plate-number"></span></div><div>座位数：<span class="td-car-info-seating"></span></div></div><table class="td-car-reservation"><tbody><tr><td class="td-car-reservation-data">近日已约</td><td class="td-car-reservation-time"></td></tr></tbody></table></div>';
  for(var i=0; i<_car.length; i++){
    var car = _car[i],
        item = $(itemHtml),
        recentRes = [];

    // recent reservation
    for( var reservation of car.reservation ){
      recentRes.push( reservation['schedule-start'] + "~" + reservation['schedule-end'] );
    }

    item.eq(0).attr('id', 'td-car-item-'+car.carid);
    item.eq(1).attr('id', 'td-car-detail-'+car.carid);
    item.find('img').attr('src', car.imageSrc);
    item.find('.td-form-comb-img-text-item-text').html(car.model);
    item.find('.td-car-info-plate-number').html(car.plateNumber);
    item.find('.td-car-info-seating').html(car.seating);
    item.find('.td-car-reservation-time').html(recentRes.join(' '));

    item.appendTo(list);
  }

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
    dd.biz.contact.choose({
          startWithDepartmentId: 0, //-1表示打开的通讯录从自己所在部门开始展示, 0表示从企业最上层开始，(其他数字表示从该部门开始:暂时不支持)
          multiple: false, //是否多选： true多选 false单选； 默认true
          users: [_user.userid], //默认选中的用户列表，userid；成功回调中应包含该信息
          disabledUsers: [], // 不能选中的用户列表，员工userid
          corpId: _config.corpId, //企业id
          // max: , //人数限制，当multiple为true才生效，可选范围1-1500
          limitTips: "挑太多啦！", //超过人数限制的提示语可以用这个字段自定义
          isNeedSearch: true, // 是否需要搜索功能
          title: "挑个人呗~", // 如果你需要修改选人页面的title，可以在这里赋值
          local: "false", // 是否显示本地联系人，默认false
          onSuccess: function(data) {
            $(e.currentTarget).find('output').val(data[0].name);
            $(e.currentTarget).find('input').val(JSON.stringify(data[0]));
          },
          onFail: function(err) {
            alert('你的通信录打不开。。。');
          }
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
      dd.biz.contact.choose({
            startWithDepartmentId: 0, //-1表示打开的通讯录从自己所在部门开始展示, 0表示从企业最上层开始，(其他数字表示从该部门开始:暂时不支持)
            multiple: false, //是否多选： true多选 false单选； 默认true
            users: [], //默认选中的用户列表，userid；成功回调中应包含该信息
            disabledUsers: [_user.userid], // 不能选中的用户列表，员工userid
            corpId: _config.corpId, //企业id
            // max: , //人数限制，当multiple为true才生效，可选范围1-1500
            limitTips: "挑太多啦！", //超过人数限制的提示语可以用这个字段自定义
            isNeedSearch: true, // 是否需要搜索功能
            title: "挑个人呗~", // 如果你需要修改选人页面的title，可以在这里赋值
            local: "false", // 是否显示本地联系人，默认false
            onSuccess: function(data) {
              console.log(data);
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
            },
            onFail: function(err) {
              alert('你的通信录打不开。。。');
            }
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
      dd.biz.contact.choose({
            startWithDepartmentId: 0, //-1表示打开的通讯录从自己所在部门开始展示, 0表示从企业最上层开始，(其他数字表示从该部门开始:暂时不支持)
            multiple: false, //是否多选： true多选 false单选； 默认true
            users: [], //默认选中的用户列表，userid；成功回调中应包含该信息
            disabledUsers: [_user.userid], // 不能选中的用户列表，员工userid
            corpId: _config.corpId, //企业id
            // max: , //人数限制，当multiple为true才生效，可选范围1-1500
            limitTips: "挑太多啦！", //超过人数限制的提示语可以用这个字段自定义
            isNeedSearch: true, // 是否需要搜索功能
            title: "挑个人呗~", // 如果你需要修改选人页面的title，可以在这里赋值
            local: "false", // 是否显示本地联系人，默认false
            onSuccess: function(data) {
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
            },
            onFail: function(err) {
              alert('你的通信录打不开。。。');
            }
        });
    });
  // delete
  function deleteCc(e){
    if (touchMoving) return; //
    e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
    $(e.currentTarget).remove();
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
              alert(
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
              success: function(data, status, respond) {
                if( data.error == 0 ){
                  localStorage.setItem(data.records.resid, JSON.stringify(data.records));
                  window.location.href = 'page/approval.html?resid=' + data.records.resid;
                }
                else{
                  alert('提交失败');
                }
              },
              error: function(respond, status, error) {
                alert(status);
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


}
