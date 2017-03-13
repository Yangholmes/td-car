$.fn.setForm = function(jsonValue){
  var obj = this;
  $.each(jsonValue,function(name,ival){
	obj.find("[id="+name+"]").val(ival);
  })
}
$(document).ready(function(){
	//从上一个页面获取cookie转为JSON
	var selectCar = getCookie('selectCar');
	if(selectCar!=null && selectCar!="")
	{
		$("#td-detial-form").setForm(JSON.parse(selectCar));
	}
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
			' 目的地：' +item["end"] +' 用途：出差'+ '</p><p>约'+ item['appointmentt1'] + '-' +item['appointmentt2']+
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
function getCookie(c_name)
{
	if (document.cookie.length>0)
		{
			c_start=document.cookie.indexOf(c_name + "=");
			if (c_start!=-1)
			{ 
				c_start=c_start + c_name.length+1;
				c_end=document.cookie.indexOf(";",c_start);
				if (c_end==-1) c_end=document.cookie.length;
				return unescape(document.cookie.substring(c_start,c_end));
			} 
		}
	return "";
}

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
        success: function() {
            alert('恭喜！修改成功！');
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

