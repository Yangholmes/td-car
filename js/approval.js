$(document).ready(function(){

	var thisUser = localStorage.getItem('thisUser');

	console.log(thisUser);

	if( !thisUser ){
		window.location.href = 'http://www.gdrtc.org/dd-verification/index.php';
	}
	else if( thisUser == 'error' ){
		$('body').html('');
		window.close();
	}

	var param = JSON.parse(thisUser);
	
	if(param!="error")
	{
		getJson({"resid":param});
	}
});

$.fn.setData = function(jsonValue){
  var obj = this;
  var findobj;
  $.each(jsonValue,function(name,ival){
	findobj = obj.find("[id="+name+"]")[0];
	if(findobj){
		findobj.textContent=ival;
	}
  })
}
function getJson(param)
{
	$.ajax({
		url: '../server/reservation/reservation-load.php',
		dataType: 'json',
		type: "POST",
		data: param,
		dataType: 'json',
		cache: false,
		success: function(data) {
			if(!data.error){
				var result = data.records[0];
				if(result.status!="0") {$('.td-approval-button-div').css("display","none");}
				var usage = '';
				switch(result.usage){
					case "0":
						usage="出差";
						break;
					case "1":
						usage="接待";
						break;
					case "2":
						usage="外勤";
						break;
					case "3":
						usage="车辆维修";
						break;
					case "4":
						usage="其他";
						break;
				}
				result.usage = usage;
				result.plateNumber = result.car.plateNumber;
				result.model = result.car.model;
				result.driver = result.driver.name;
				result.name = result.applicant.name;
				$("#applicant-avatar").attr('src',result.applicant.avatar); ;
				if(result!=null && result!="")
				{
					$(".td-approval-container").setData(result);
				}

				var html_resultinfo;
				$.each(result.approval,function(i,item){
					html_resultinfo='';
					html_resultinfo += '<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"><img src="'+
						item['approver'].avatar+'" alt="Picture"></div><div class="cd-timeline-content"><h2>'+
						item['approver'].name + '</h2><span class="cd-date" id="cd-date-'+item['userid']+'">' + item['operateDt'] +
						'</span><p class="approval-result" id="approval-result-'+item['userid']+'">'+item["result"] +
						' </p><span class="approval-hidden">'+item['sequence']+'</span></div></div>';
					$('.cd-container').append(html_resultinfo);//after方法:在每个匹配的元素之后插入内容。
					var setResult = $('#approval-result-'+item['userid']);
					switch(item["result"]){
						case "0":
							setResult.text("未审批");
							break;
						case "1":
							setResult.text("已同意");
							setResult.css("color","green");
							break;
						case "2":
							setResult.text("已拒绝");
							setResult.css("color","red");
							break;
					}
				});
			}else{
				alert("很遗憾！加载失败");
			}


		},
		error:function(xhr,textStatus){
		console.log('错误');
		console.log(xhr);
		console.log(textStatus);
		}
	});
}
$('#td-agree-submit').click(function(e) {
	var appDiv=$("section>div");
	var sign=-1;
	for(var i=0; i<appDiv.length; i++)
	{
		if($(appDiv[i]).find(".approval-result")[0].textContent == '未审批'){
			sign = i;
			break;
		}
	}
	if(sign == -1){
		console.log("error");
	}else{
		var sequence = $(appDiv[sign]).find(".approval-hidden")[0].textContent;
		var time = $(appDiv[sign]).find(".cd-date")[0];
		var send={"sequence":sequence, "resid":getUrlParam(), "result":"1", "userid":time.id.slice(8)};
		showMask();
		$.ajax({
        url: '../server/approval/approve.php',
        type: "POST",
        data: send,
        cache: false,
        success: function(data) {
			if(!data.error){
				var myDate = new Date();
				time.textContent=myDate.toLocaleTimeString();     //获取当前时间
				$(appDiv[sign]).find(".approval-result")[0].textContent = "已同意";
				$(appDiv[sign]).find(".approval-result").css("color","green");
				$('.td-approval-button-div').css("display","none");
			}else{
				alert('修改审批状态失败！'+data.errorMsg);
			}
			$("#td-mask").hide();
        },
        error: function() {
            alert('很遗憾！审批失败！');
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

});
$('#td-disagree-submit').click(function(e) {
	var appDiv=$("section>div");
	var sign=-1;
	for(var i=0; i<appDiv.length; i++)
	{
		if($(appDiv[i]).find(".approval-result")[0].textContent == '未审批'){
			sign = i;
			break;
		}
	}
	if(sign == -1){
		console.log("error");
	}else{
		var sequence = $(appDiv[sign]).find(".approval-hidden")[0].textContent;
		var time = $(appDiv[sign]).find(".cd-date")[0];

		var send={"sequence":sequence, "resid":getUrlParam(), "result":"2", "userid":time.id.slice(8)};
		showMask();
		$.ajax({
        url: '../server/approval/approve.php',
        type: "POST",
        data: send,
        cache: false,
        success: function(data) {
			if(!data.error){
				var myDate = new Date();
				time.textContent=myDate.toLocaleTimeString();     //获取当前时间
				$(appDiv[sign]).find(".approval-result")[0].textContent = "已拒绝";
				$(appDiv[sign]).find(".approval-result").css("color","red");
				$('.td-approval-button-div').css("display","none");
			}else{
				alert('修改审批状态失败！'+data.errorMsg);
			}
			$("#td-mask").hide();     
        },
        error: function() {
            alert('很遗憾！审批失败！');
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

});
function showMask(){     
	$("#td-mask").css("height",$(document).height());     
	$("#td-mask").css("width",$(document).width());     
	$("#td-mask").show();
	$("#td-mask img").show();	
}