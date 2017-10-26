/* jshint esversion: 6 */

/**
 * [description]
 * @param  {[type]} jsonValue [description]
 * @return {[type]}           [description]
 */
$.fn.setForm = function(jsonValue){
  var obj = this;
  $.each(jsonValue,function(name,ival){
	findobj = obj.find("[id="+name+"]");
	//findobj存在并且不能为imageSrc，因为input type=file不能直接赋值，会报错
	if(findobj[0] && findobj[0].id!='imageSrc'){
		findobj.val(ival);
	}
  })
};
$(document).ready(function(){
	//从上一个页面获取cookie转为JSON
	var storage=window.localStorage;
	var carid = getCarId();
	var selectCar=storage.getItem("car"+carid);
	if(selectCar!=null && selectCar!="")
	{
		var carjson = JSON.parse(selectCar);
		$("#td-detail-form").setForm(carjson);
	}else{
		$.tdAlert("读取数据失败！请返回重新尝试");
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
		  $.tdAlert(
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
				$.tdAlert('恭喜！修改成功！');
			}else{
				$.tdAlert('修改失败！'+jsonResult.errorMsg);
			}
        },
        error: function() {
            $.tdAlert('很遗憾！修改失败！');
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
	var thisURL = decodeURI( document.URL );
	//split("=")将url分为两部分，取第二部分
	var showval= thisURL.split("=")[1];
	return showval;
}
function showMask() {
    $("#td-mask").css("height", $(document).height());
    $("#td-mask").css("width", $(document).width());
    $("#td-mask").show();
    $("#td-mask i.fa").show();
}
