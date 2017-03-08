function imgPreview(fileDom){
	//判断是否支持FileReader
	if (window.FileReader) {
		var reader = new FileReader();
	} else {
		alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
	}

	//获取文件
	var file = fileDom.files[0];
	var imageType = /^image\//;
	//是否是图片
	if (!imageType.test(file.type)) {
		alert("请选择图片！");
		return;
	}

	//读取完成
	reader.onload = function(e) {
		//获取图片dom
		var img = document.getElementById("td-form-field-preview");
		//图片路径设置为读取的图片
		img.src = e.target.result;
	};
	reader.readAsDataURL(file);
}
$('#td-add-submit').click(function(e) {
	var $form = $('form');
	var formData = new FormData($form[0]);

	$.ajax({
		url: '../server/car-management/car-add.php',
		type: "POST",
		data: formData,
		processData: false,  // 告诉jQuery不要去处理发送的数据
  	contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
		success: function(){
			alert('恭喜！添加成功！');
		},
		error: function(){
			alert('很遗憾！添加失败！');
		}
	});
});
