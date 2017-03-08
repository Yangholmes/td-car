$("#imageSrc").on("change", function(){
if (window.FileReader) {
		var reader = new FileReader();
	} else {
		alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
	}
    // Get a reference to the fileList
    var files = !!this.files ? this.files : [];
	var preview = $("#td-form-field-preview");
    // If no files were selected, or no FileReader support, return
    if (!files.length){
		alert("请选择文件！"); 
		//没有选择文件则要清空文件上一次load的文件域和预览的图片
		preview.css("height","0");
		return;
	}
<<<<<<< HEAD

	//读取完成
	reader.onload = function(e) {
		//获取图片dom
		var img = document.getElementById("td-form-field-preview");
		//图片路径设置为读取的图片
		img.src = e.target.result;
	};
	reader.readAsDataURL(file);
}
=======
 
    // Only proceed if the selected file is an image
    if (/^image/.test( files[0].type)){
 
        var reader = new FileReader();
        // Read the local file as a DataURL
        reader.readAsDataURL(files[0]);
 
        // When loaded, set image data as background of div
        reader.onloadend = function(){
			preview.css("height","80px");
			preview.attr("src", this.result);        
        }
 
    }else{
		alert("请选择图片！"); 
		return;
	}
});
>>>>>>> refs/remotes/origin/master
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
