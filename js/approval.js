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

    var param = getUrlParam();
    if (param != null || param != "") {
        userId = JSON.parse(thisUser).userid;
        getJson({"resid": param});
    }
});

function getJson(param) {
    $.ajax({
        url: '../server/reservation/reservation-load.php',
        dataType: 'json',
        type: "POST",
        data: param,
        cache: false,
        success: function(data) {
            if (data.error == 0) {
                var result = data.records.reservation[0];
                resStatus = result.status;
                carStatus = data.records.carStatus;
                reservation = result.id;
                var applicantId = result.applicant.emplId;
                //status代表申请表状态 0为审批中，1为审批全部通过，2为有审批人没同意，申请表被拒绝，3为已经用完车还了显示归还时间状态, 4为已撤销
                if (resStatus == "0") {
                  if(userId == applicantId){//只有当前用户是申请人才能撤销
                    $('.td-revoke-div').css("display", "block");
                  }
                }else{
                  $('.td-approval-submit').css("display", "none");
                  if (resStatus == "1") {
                      $('.td-return-div').css("display", "block");
                    } else if (resStatus == "3") {
                        $('.td-return-div').css("display", "block");
                        $('#td-return-car')[0].textContent = result.returnDt;
                    }else if (resStatus == "4") {
                        $('.td-revoke-div').css("display", "block");
                        $('#td-revoke-res')[0].textContent = "已撤销";
                    }
                }
                switch (result.usage) {
                    case "0": result.usage = "出差"; break;
                    case "1": result.usage = "接待"; break;
                    case "2": result.usage = "外勤"; break;
                    case "3": result.usage = "车辆维修"; break;
                    case "4": result.usage = "其他"; break;
                }
                carid=result.car.carid;
                result.plateNumber = result.car.plateNumber;
                result.model = result.car.model;
                result.driver = result.driver.name;
                result.name = result.applicant.name;
                $("#applicant-avatar").attr('src', result.applicant.avatar);;
                if (result != null && result != "") {
                    $(".td-approval-container").setData(result);
                }
                if(carStatus.length){addCarStatus();}
                var html_resultinfo;
                var html_commentcss;
                $.each(result.approval, function(i, item) {
                    html_resultinfo = '';
                    if (item["comment"] != null) {
                        html_commentcss = 'style="display:block"'
                    } else {
                        html_commentcss = 'style="display:none"';
                    }
                    html_resultinfo += '<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"><img src="' +
                        item['approver'].avatar + '" alt="Picture"></div><div class="cd-timeline-content"><div class="cd-timeline-name"><h2>' +
                        item['approver'].name + '</h2><div><span class="cd-date">' + item['operateDt'] +
                        '</span></div></div><p class="approval-result" id="approval-result-' + i + '">' + item["result"] +
                        '</p><p class="approval-comment"' + html_commentcss + '>' + item["comment"] + '</p><span class="approval-sequence">' + item['sequence'] + '</span><span class="approval-userid">' +
                        item['userid'] + '</span></div></div>';
                    $('.cd-container').append(html_resultinfo); //after方法:在每个匹配的元素之后插入内容。
                    var setResult = $('#approval-result-' + i);
                    switch (item["result"]) {
                        case "0":
                            setResult.text("未审批");
                            break;
                        case "1":
                            setResult.text("已同意");
                            setResult.css("color", "green");
                            break;
                        case "2":
                            setResult.text("已拒绝");
                            setResult.css("color", "red");
                            break;
                    }
                });
            } else {
                $.tdAlert("很遗憾！加载失败");
            }
            var sign = getApproval();
            if (sign == -1) {
                console.log("error!no approver or have pass!");
            } else {
                var approvalId = $(appDiv[sign]).find(".approval-userid")[0].textContent;
                if (approvalId != userId)
                    $('.td-approval-submit').css("display", "none");
            }

        },
        error: function(xhr, textStatus) {
            $.tdAlert("很遗憾！传送错误");
            console.log(xhr);console.log(textStatus);
        }
    });
}
$('#td-agree-submit').click(function(e) {
    setApproval("1");

});
$('#td-disagree-submit').click(function(e) {
    setApproval("2");
});
$('#td-revoke-res').click(function(e) {
  if (resStatus == "0"){
    $.tdConfirm("真的要撤销吗?",function(i){
      if(i){
        showMask();
        var resIdParam = {"reservationId":reservation};
        $.ajax({
          url: '../server/reservation/reservation-revoke.php',
          type: "POST",
          data: resIdParam,
          dataType: 'json',
          cache: false,
          success: function(data) {
            if(!data.error){
              $.tdAlert('恭喜！撤销成功！');
              $('#td-revoke-res')[0].textContent = "已撤销";
              resStatus = 4;
            }else{
              $.tdAlert('撤销失败！'+data.errorMsg);
            }
            $("#td-mask").hide();
          },
          error: function() {
            $.tdAlert('很遗憾！撤销失败！');
            $("#td-mask").hide();
          },
        });
      }
    });
  }
});
function setApproval(appResult) {
    var sign = getApproval();
    if (sign == -1) {
        console.log("error!no approver!");
    } else {
        $.tdPrompt("", function(i, comment) {
            if (i) {
                var sequence = $(appDiv[sign]).find(".approval-sequence")[0].textContent;
                var time = $(appDiv[sign]).find(".cd-date")[0];
                var send = {
                    "sequence": sequence,
                    "resid": getUrlParam(),
                    "result": appResult,
                    "userid": userId,
                    "comment": comment
                };
                showMask();
                $.ajax({
                    url: '../server/approval/approve.php',
                    type: "POST",
                    data: send,
                    cache: false,
                    success: function(data) {
                        if (!data.error) {
                            var myDate = new Date();
                            time.textContent = myDate.toLocaleTimeString(); //获取当前时间
                            if (appResult == "1") {
                                $(appDiv[sign]).find(".approval-result")[0].textContent = "已同意";
                                $(appDiv[sign]).find(".approval-result").css("color", "green");
                            } else {
                                $(appDiv[sign]).find(".approval-result")[0].textContent = "已拒绝";
                                $(appDiv[sign]).find(".approval-result").css("color", "red");
                            }
                            if (comment) {
                                $(appDiv[sign]).find(".approval-comment").css("display", "block")
                                $(appDiv[sign]).find(".approval-comment")[0].textContent = comment;
                            }
                            $('.td-approval-submit').css("display", "none");
                        } else {
                            $.tdAlert('修改审批状态失败！' + data.errorMsg);
                        }
                        $("#td-mask").hide();
                    },
                    error: function(xhr, textStatus) {
                        $.tdAlert("很遗憾！审批失败！");
                        console.log(xhr);console.log(textStatus);
                    },
                });
            }
        }, '审批意见', '请输入审批意见（可以为空）');

    }
}

function getApproval() {
    appDiv = $("section>div");
    var sign = -1;
    for (var i = 0; i < appDiv.length; i++) {
        if ($(appDiv[i]).find(".approval-result")[0].textContent == '未审批') {
            sign = i;
            break;
        }
    }
    return sign;
}

$('#td-return-car').on('touchend', function(e) {
    if (resStatus != "3") {
        //有carStatus时是已经还完车之后，有车辆状态纪录了
        if (carStatus.length>0) {
          if(userId == '03401806572466'){//姐姐才能完成还车
            var send = {"resid": getUrlParam(), "userid": userId};
            showMask();
            $.ajax({
                url: '../server/return/return.php',
                type: "POST",
                data: send,
                cache: false,
                success: function(data) {
                    if (JSON.parse(data).error == 0) {
                        $('#td-return-car')[0].textContent = JSON.parse(data).records.returnDt;
                        $.tdAlert('确认还车成功！');
                    } else {
                        $.tdAlert('确认还车失败！' + JSON.parse(data).errorMsg);
                    }
                    $("#td-mask").hide();
                },
                error: function(xhr, textStatus) {
                    $.tdAlert("很遗憾！还车失败！");
                    console.log(xhr);console.log(textStatus);
                },
            });
          }else{
            $.tdAlert("您已经还完车了哦，请等待管理员确认！");
          }

        }//如果纪录不存在，则显示还车申请表单
				else {
          showMask();
          $("#mask-return-div").show();
        }
    }
});

$("#return-title-close").on('touchend', function(e) {
  $("#td-mask").hide();
});
$("form").submit(function(e){
  var damageType = $("form #damageType")[0].value;
  var damageDetails = $("form #damageDetails")[0].value;
  var unitollGD = $("form #unitollGD")[0].value;
  //正则匹配金额是否为非负数
  var check= /^\d+(\.{0,1}\d+){0,1}$/;
  if(!check.test(unitollGD))
  {
    $.tdAlert("请输入格式正确的剩余金额！(金额应为非负数)");
    return false;
  }
  if(damageType != '0' && !damageDetails){
    $.tdAlert('车辆若有损伤，请填写详情~');
    return false;
  }
  var formData = {"carid":carid, "reservation":reservation, "fuelIndicator":parseInt($("form #fuelIndicator")[0].value),
                  "unitollGD":unitollGD, "damageType":parseInt(damageType), "damageDetails":damageDetails};
  $("#mask-return-div").hide();//隐藏表单
    $.ajax({
        url: '../server/car-management/car-status-update.php',
        type: "POST",
        data: formData,
        cache: false,
        success: function(data) {
            if (JSON.parse(data).error == 0) {
                carStatus.push(JSON.parse(data).records);
                addCarStatus();
                $.tdAlert('申请还车成功！');
            } else {
                $.tdAlert('申请失败！' + JSON.parse(data).errorMsg);
            }
            $("#td-mask").hide();
        },
        error: function(xhr, textStatus) {
            $.tdAlert("很遗憾！申请还车失败！请刷新重试");
            console.log(xhr);console.log(textStatus);
        },
    });
    return false;
});
// $("#td-return-submit").on('touchend', function(e) {
//
// })

$.fn.setData = function(jsonValue) {
    var obj = this;
    var findobj;
    $.each(jsonValue, function(name, ival) {
        findobj = obj.find("[id=" + name + "]")[0];
        if (findobj) {
            findobj.textContent = ival;
        }
    })
}

function addCarStatus(){
  var fuelIndicator = carStatus[0].fuelIndicator+'%';
  var transDamageType;
  switch (carStatus[0].damageType) {
    case "0": transDamageType="无"; break;
    case "1": transDamageType="车身损伤"; break;
    case "2": transDamageType="零部件损坏"; break;
    case "3": transDamageType="设备损坏"; break;
    case "4": transDamageType="其他"; break;
    default:transDamageType="";
  }
  var html_carStatus = '<tr><td class="table-left">剩余油量：</td><td id="fuelIndicator">'+fuelIndicator+
                        '</td></tr><tr><td class="table-left">粤通卡：</td><td id="unitollGD">'+carStatus[0].unitollGD+
                        '元</td></tr><tr><td class="table-left">车辆状况：</td><td id="damageType">'+transDamageType+
                        '</td></tr><tr><td class="table-left">损坏详情：</td><td id="damageDetails">'+carStatus[0].damageDetails+'</td></tr>';
  $(".td-detial-table").append(html_carStatus);
}

function getUrlParam() {
    var thisURL = decodeURI(document.URL);
    //split("=")将url分为两部分，取第二部分
    var a = thisURL.split("=")[1].split("&")[0];
    return a;
}

function showMask() {
    $("#td-mask").css("height", $(document).height());
    $("#td-mask").css("width", $(document).width());
    $("#td-mask").show();
    $("#td-mask i.fa").show();
}
