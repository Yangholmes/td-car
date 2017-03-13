$(document).ready(function(){
	if(!window.localStorage){
            alert("浏览器不支持localstorage");
			getJson();
    }else{
		var storage=window.localStorage;
		//将JSON字符串转换成为JSON对象输出
		var json=storage.getItem("approval");
		if(json!=null && json!=""){
			var jsonObj=JSON.parse(json);
		}else{
			getJson();
		}
    }
	
});	
$.fn.setTable = function(jsonValue){
  var obj = this;
  $.each(jsonValue,function(name,ival){
	obj.find("[id="+name+"]")[0].textContent=ival;
  })
}
function getJson()
{
	$.ajax({
		url: '../data/approval.json',
		dataType: 'json',
		success: function(data) {
			if(data!=null && data!="")
			{
				$(".td-approval-table").setTable(data);
			}

		},
		error:function(xhr,textStatus){
		console.log('错误');
		console.log(xhr);
		console.log(textStatus);
		}
	});
}