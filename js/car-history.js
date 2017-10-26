/* jshint esversion: 6 */

/**
 * [description]
 * @param  {[type]} jsonValue [description]
 * @return {[type]}           [description]
 */
var _car = [];
var carid = '';//记录当前选择车辆
$(document).ready(function(){

  $.ajax({
      url: '../server/car-management/car-load.php',
      dataType: 'json',
      success: function(data) {
        if( data.error == '0' ){
          _car = data.records;
          tdFormData();
          tdFormController();
        }else{
          $.tdAlert('读取失败！');
        }

      },
      error: function(xhr, textStatus) {
          console.log('错误');
          console.log(xhr);
          console.log(textStatus);
      }
  });

});
/**
 * UI control data
 */
var tdFormData = function(car){
  /**
   * init td-form-comb-img-text data
   */
  var list = $('ul.td-form-comb-img-text-list');
  var itemHtml = '<li class="td-form-comb-img-text-item"><div class="td-form-comb-img-text-item-img"><img src="" ></div><div class="td-form-comb-img-text-item-text"></div></li><div class="td-form-comb-img-text-item-detial" id=""><div>车牌号：<span class="td-car-info-plate-number"></span></div><div>座位数：<span class="td-car-info-seating"></span></div></div>';
  _car.map(function(car, i, cars){
    var item = $(itemHtml);
    item.eq(0).attr('id', 'td-car-item-'+car.carid);
    item.eq(1).attr('id', 'td-car-detail-'+car.carid);
    item.find('img').attr('src', car.imageSrc);
    item.find('.td-form-comb-img-text-item-text').html(car.model);
    item.find('.td-car-info-plate-number').html(car.plateNumber);
    item.find('.td-car-info-seating').html(car.seating);
    item.appendTo(list);
  });
}

/**
 * UI control handlers
 */
var tdFormController = function(){
  slide("#td-history-container", function (e) {
      getHistory(false);
  });
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
    //车辆选择td-car-item-97，id是item[3]
    var item = selectedId.split('-');
    carid = item[3];

    var selectedDiv = $(e.currentTarget).parent('ul').prev('.td-form-comb-selected').find('.td-form-comb-item'),
        selectedCtx = $(e.currentTarget).html();
    selectedDiv.html(selectedCtx).attr('id', selectedId);
    // $('.popup').removeClass('popup');
    popup.call($(e.currentTarget).parent('ul'));
    preventMoving = false;
    $("#td-history-container").show();
    //重新选车前将页面还原
    $(".cd-timeline>div").remove();
    $("#pullTOLoad").text("上拉加载更多......");
    getHistory(true);
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
  var pageH=0,winH=0;

  // $(document.body).on('touchend',function(e) {
  //   pageH = $(document.body).height(); //页面总高度
  //   winH = $(window).height(); //页面可视区域高度
  //   var scrollT = $(document.body).scrollTop(); //滚动条top
  //   var aa = scrollT-(pageH-winH);
  //   //console.log(aa);
  //   if(aa >= 21 && scrollT > 0){
  //     // getHistory(false);
  //       console.log(aa);
  //   }
  // });
//loadStatus1标识变量，用于判断是否查询status=1的申请单，即查询未完成的申请单
  function getHistory(loadStatus1){
    showMask();
    var param = {"offset":$("section>div").length, "car":{"carid":carid}, "rowCount":"5", "loadStatus1" : loadStatus1};
    $.ajax({
      url: '../server/reservation/history-load.php',
      type: "POST",
      data: param,
      dataType: 'json',
      cache: false,
      success: function(data) {
        if(!data.error){
          if(loadStatus1){
            var unfinished = data["records"]["resUnfinished"];
            var html_unfinished;
            $.each(unfinished,function(i,item){
              html_unfinished = '<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"><img src="'+
                item['applicant'].avatar+'" alt="Picture"></div><div class="cd-timeline-content"><h2>'+
                item['applicant'].name + '</h2><p>起点：' + item['startpoint'] +
                ' 目的地：' +item["endpoint"] +' 用途：'+item['usage']+ '</p><p>约 '+ item['schedule-start'] + '<br>至 ' +item['schedule-end']+
                '<br>备注：'+item['remark']+'</p></div></div>';
              $('div.cd-timeline').append(html_unfinished);//after方法:在每个匹配的元素之后插入内容。
            });
            if(unfinished.length===0){ html_unfinished = '<div class="cd-timeline-block">无</div>'; $('div.cd-timeline').append(html_unfinished); }
          }
          var html_resultinfo;
          var history = data["records"]["carStatus"];
          $.each(history,function(i,item){
            if(item['noReservation']){
              html_resultinfo = '<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"><img src="http://www.gdrtc.org/car/img/icon/用车申请-图标.png" alt="Picture"></div><div class="cd-timeline-content"><h2>管理员'+
                ' <span style="font-size:14px;">设置<span></h2><p>剩余油量：' + item['fuelIndicator'] +
                '<br>粤通卡余额：' +item["unitollGD"] +'</p></div></div>';
            }else{
              html_resultinfo = '<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"><img src="'+
                item['applicant'].avatar+'" alt="Picture"></div><div class="cd-timeline-content"><h2>'+
                item['applicant'].name + '</h2><p>起点：' + item['startpoint'] +
                ' 目的地：' +item["endpoint"] +' 用途：'+item['usage']+ '</p><p>约 '+ item['schedule-start'] + '<br>至 ' +item['schedule-end']+
                '<br><span class="cd-date">归还时间：' + item['returnDt'] +
                '</span><br>备注：'+item['remark']+'</p><p>剩余油量：' + item['fuelIndicator'] +
                ' 粤通卡余额：' +item["unitollGD"] +'<br>损坏情况：' +item["damageType"]+'<br>车辆损坏详情：' +item["damageDetails"] +'</p></div></div>';
            }

            $('section').append(html_resultinfo);//after方法:在每个匹配的元素之后插入内容。
          });
          if(history.length<5){
            $("#pullTOLoad").text("加载完成，没有更多数据");
          }
        }else{
          $.tdAlert('加载失败！'+data.errorMsg);
        }
        $("#td-mask").hide();
      },
      error: function() {
        $.tdAlert('很遗憾！加载失败！');
      },
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener("progress", function (e) {
          console.log(e.lengthComputable);
          if (e.lengthComputable) {
            100 * e.loaded / e.total;
          }
        }, false);
        return xhr;
      },
    });
  }

  function showMask() {
      $("#td-mask").css("height", $(document).height());
      $("#td-mask").css("width", $(document).width());
      $("#td-mask").show();
      $("#td-mask i.fa").show();
  }
};

var slide = function (obj, callback) {
        var start, end,
            isCanDo = false,//是否移动滑块
            isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
            hasTouch = 'ontouchstart' in window && !isTouchPad;


        //将对象转换为jquery的对象
        obj = $(obj);
        pageH = obj.height();//页面总高度
        winH = $(window).height(); //页面可视区域高度
        var objparent = obj.parent();
        var fn =
            {
                //移动容器
                translate: function (diff) {
                    obj.css({
                        "-webkit-transform": "translate(0,-" + diff + "px)",
                        "transform": "translate(0,-" + diff + "px)"
                    });
                },

                //设置效果时间
                setTranslition: function (time) {
                    obj.css({
                        "-webkit-transition": "all " + time + "s",
                        "transition": "all " + time + "s"
                    });
                },


            };

        //滑动开始
        obj.bind("touchstart", function (e) {
          pageH = obj.height();//页面总高度要更新
            if ((objparent.scrollTop()-(pageH-winH)>=0)) {
                var even = typeof event == "undefined" ? e : event;
                //标识操作进行中
                isCanDo = true;
                //保存当前鼠标Y坐标
                start = hasTouch ? even.touches[0].pageY : even.pageY;
                //消除滑块动画时间
                fn.setTranslition(0);
            }
        });

        //滑动中

        obj.bind("touchmove", function (e) {
            if ((objparent.scrollTop()-(pageH-winH)>=0) && isCanDo) {
                var even = typeof event == "undefined" ? e : event;
                //保存当前鼠标Y坐标
                end = hasTouch ? even.touches[0].pageY : even.pageY;
                if (start > end) {
                    even.preventDefault();
                    //移动滑块
                    fn.translate(start - end);
                }
            }
        });
        //滑动结束
        obj.bind("touchend", function (e) {
            if (isCanDo) {
                isCanDo = false;
                var _touch = e.originalEvent.changedTouches[0];
　　             end= _touch.pageY;//此处更新end，防止点击没有touchmove事件导致end不更新
                //判断滑动距离是否大于等于指定值
                if (start - end >0) {
                    //设置滑块回弹时间
                    fn.setTranslition(0.5);
                    //保留提示部分
                    fn.translate(0);
                    //执行回调函数
                    if (typeof callback == "function") {
                        callback.call(fn, e);
                    }
                } else {
                    //返回初始状态
                    fn.translate(0);
                }

            }

        });

    }
