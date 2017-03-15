$.fn.setForm = function(jsonValue){
  var obj = this;
  $.each(jsonValue,function(name,ival){
	findobj = obj.find("[id="+name+"]");
	//findobj存在并且不能为imageSrc，因为input type=file不能直接赋值，会报错
	if(findobj[0] && findobj[0].id!='imageSrc'){
		findobj.val(ival);
	}
  })
}
$(document).ready(function(){
	//从上一个页面获取cookie转为JSON
	var storage=window.localStorage;
	var selectCar=storage.getItem("car"+getCarId());
	if(selectCar!=null && selectCar!="")
	{
		var carjson = JSON.parse(selectCar);
		$("#td-detial-form").setForm(carjson);
		var history = carjson.reservation;
		var html_resultinfo;
		$.each(history,function(i,item){
		html_resultinfo='';
		html_resultinfo += '<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"><img src="'+
			item['applicant'].avatar+'" alt="Picture"></div><div class="cd-timeline-content"><h2>'+ 
			item['applicant'].name + '</h2><p>起点：' + item['startpoint'] +
			' 目的地：' +item["endpoint"] +' 用途：'+item['usage']+ '</p><p>约'+ item['schedule-start'] + '-' +item['schedule-end']+
			'</p><span class="cd-date">借' + item['borrowt1'] + '-'+item['borrowt2']+
			'</span><p>备注：'+item['remark']+'</p></div></div>';
		$('.cd-container').append(html_resultinfo);//after方法:在每个匹配的元素之后插入内容。
		});
		//console.log($("section>div").length);
		var pageH=0,winH=0;
		$(document.body).on('touchend',function(e) {
			pageH = $(document.body).height(); //页面总高度
			winH = $(window).height(); //页面可视区域高度
			var scrollT = $(document.body).scrollTop(); //滚动条top
			var aa = scrollT-(pageH-winH);
			//console.log(aa);
			if(aa >= 64 && scrollT > 0){
				$.each(history,function(i,item){
				html_resultinfo='';
				html_resultinfo += '<div class="cd-timeline-block"><div class="cd-timeline-img cd-picture"><img src="'+
					item['applicant'].avatar+'" alt="Picture"></div><div class="cd-timeline-content"><h2>'+ 
					item['applicant'].name + '</h2><p>起点：' + item['startpoint'] +
					' 目的地：' +item["endpoint"] +' 用途：'+item['usage']+ '</p><p>约'+ item['schedule-start'] + '-' +item['schedule-end']+
					'</p><span class="cd-date">借' + item['borrowt1'] + '-'+item['borrowt2']+
					'</span><p>备注：'+item['remark']+'</p></div></div>';
				$('.cd-container').append(html_resultinfo);//after方法:在每个匹配的元素之后插入内容。
				});
			}
		});
	}else{
		alert("读取数据失败！请返回重新尝试");
	}
	storage.clear();
});	

$('#td-edit-submit').click(function(e) {
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
        url: '../server/car-management/car-update.php',
        type: "POST",
        data: formData,
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType : false, //必须false才会自动加上正确的Content-Type
        cache: false,
        success: function(data) {
            var jsonResult = JSON.parse(data);
			if(!jsonResult.error){
				alert('恭喜！修改成功！');
			}else{
				alert('修改失败！'+jsonResult.errorMsg);
			}
        },
        error: function() {
            alert('很遗憾！修改失败！');
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
});
function  getCarId(){
	var thisURL = document.URL;   
	//split("=")将url分为两部分，取第二部分
	var showval= thisURL.split("=")[1];  	
	return showval;
}