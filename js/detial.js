$.fn.setForm = function(jsonValue){
  var obj = this;
  $.each(jsonValue,function(name,ival){
	obj.find("[id="+name+"]").val(ival);
  })
}
$(document).ready(function(){
	var thisURL = document.URL;    
	var carId =thisURL.split('?')[1]; 
	console.log(carId);
	$.ajax({
	   url: '../data/carform.json',
	   dataType: 'json',
	   success: function(data) {
		$("#td-detial-form").setForm(data);
	  }
	});
	$.ajax({
	   url: '../data/history.json',
	   dataType: 'json',
	   success: function(data) {
		var html_resultinfo;
		$.each(data["records"],function(i,item){
		html_resultinfo='';
		html_resultinfo += '<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"><img src="'+
			item['imageSrc']+'" alt="Picture"></div><div class="cd-timeline-content"><h2>'+ 
			item['personname'] + '</h2><p>起点：' + item['start'] +
			' 目的地：' +item["end"] + '</p><p>约'+ item['appointmentt1'] + '-' +item['appointmentt2']+
			'</p><span class="cd-date">借' + item['borrowt1'] + '-'+item['borrowt2']+
			'</span><p>备注：'+item['remark']+'</p></div></div>';
		$('.cd-container').append(html_resultinfo);//after方法:在每个匹配的元素之后插入内容。
		});
	  },
	  error:function(xhr,textStatus){
		console.log('错误');
		console.log(xhr);
		console.log(textStatus);
	  }
	});
});	