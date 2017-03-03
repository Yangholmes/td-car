;

/**
 * UI control handlers
 */

$(function() {

    /**
     * when touch is moving, prevent touchend event
     */
    var touchMoving = false;
    $('body').on('touchstart', function(e) {
        touchMoving = false;
    });
    $('body').on('touchmove', function(e) {
        touchMoving = true;
    });

    /**
     * td-form-datetime-picker
     */
    $('.td-form-datetime-picker input').change(function(e) {
        $(e.target).prev('output').val(e.target.value); // notice: must format datetime value
    });

    /**
     * td-form-comb-text
     * td-form-comb-img-text
     */
    // popup list
    $('.td-form-comb').on('touchend', function(e) {
        if (touchMoving) return; // prevent popup while touch is moving
        $(e.currentTarget).find('ul').addClass('popup');
        $('.transparent-mask').addClass('popup');
    });
    // select item
    $('.td-form-comb ul li').on('touchend', function(e) {
        if (touchMoving) return; //
        e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
        var carId = (e.currentTarget.id).substr(20, 1);
		console.log(carId);
		if(e.target.className == "td-form-field-detail fa fa-car"){
			$('#td-form-field-car'+carId).toggle();
		}else{
			var selectedDiv = $(e.currentTarget).parent('ul').prev('.td-form-comb-selected').find('.td-form-comb-item');
			var selectedCtx = $(e.currentTarget).find('.td-form-comb-block').html();
			selectedDiv.html(selectedCtx);
			$('.popup').removeClass('popup');
		}
    });

    /**
     * td-form-easy-picker
     */
    $('.td-form-easy-picker').on('touchend', function(e) {
      if (touchMoving) return; //
      e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
      var that = e.currentTarget;
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
              $(that).find('.td-form-easy-picker-selected').html(data[0].name);
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
    $('.td-form-approver-picker ul div.td-form-approver-picker-add').on('touchend', function(e) {
      if (touchMoving) return; //
      e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
      var that = e.currentTarget;
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
                var approverPickerList = $(that).parents('.td-form-approver-picker').find('ul li#admin'),
                    newApproverHtml = '<li class="td-form-approver-picker-item">' +
                                      '<div class="td-form-approver-picker-item-avatar fa fa-arrow-right">' +
                                      '<img src=' +
                                      data[0].avatar +
                                      '>' +
                                      '</div>' +
                                      '<div class="td-form-approver-picker-item-name">' +
                                      data[0].name +
                                      '</div></li>',
                    newApprover = $(newApproverHtml);
                newApprover.on('touchend', deleteApprover);
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
    $('.td-form-cc-picker ul div.td-form-cc-picker-add').on('touchend', function(e) {
      if (touchMoving) return; //
      e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
      var that = e.currentTarget;
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
                var ccPickerList = $(that).parents('.td-form-cc-picker').find('ul div.td-form-cc-picker-add'),
                    newCcHtml = '<li class="td-form-cc-picker-item">' +
                                '<div class="td-form-cc-picker-item-avatar">' +
                                '<img src=' +
                                data[0].avatar +
                                '>' +
                                '</div>' +
                                '<div class="td-form-cc-picker-item-name">' +
                                data[0].name +
                                '</div></li>',
                    newCc = $(newCcHtml);
                newCc.on('touchend', deleteCc);
                ccPickerList.before( newCc );
            },
            onFail: function(err) {
              alert('你的通信录打不开。。。');
            }
        });
    });
    // delete
    var deleteCc = function(e){
      if (touchMoving) return; //
      e.stopPropagation(); // Prevents the event from bubbling up the DOM tree, preventing any parent handlers from being notified of the event.
      $(e.currentTarget).remove();
    }

    /**
     * mask
     */
    $('.transparent-mask').on('touchend', function(e) {
        $('.popup').removeClass('popup');
    });


})
