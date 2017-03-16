$(document).ready(function(){
	var thisURL = document.URL;   
	//split("=")将url分为两部分，取第二部分
	var param= {"resid":thisURL.split("=")[1].split("&")[0]};
	if(param!=null || param!="")
	{  	
		getJson(param);
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
				console.log(result);
				var html_resultinfo;
				$.each(result.approval,function(i,item){
					switch(item["result"]){
						case "0":
							item["result"]="未审批";
							break;
						case "1":
							item["result"]="已同意";
							break;
						case "2":
							item["result"]="拒绝";
							break;
					}
					html_resultinfo='';
					html_resultinfo += '<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"><img src="'+
						item['approver'].avatar+'" alt="Picture"></div><div class="cd-timeline-content"><h2>'+ 
						item['approver'].name + '</h2><span class="cd-date">' + item['operateDt'] +
						'</span><p>' +item["result"] +' </p></div></div>';
					$('.cd-container').append(html_resultinfo);//after方法:在每个匹配的元素之后插入内容。
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