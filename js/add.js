$("#imageSrc").on("change", function(){
	if (window.FileReader) {
			var reader = new FileReader();
	} else {
			$.tdAlert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
	}
	// Get a reference to the fileList
	var files = !!this.files ? this.files : [];
	var preview = $("#td-form-field-preview");

	// If no files were selected, or no FileReader support, return
	if (!files.length){
		//没有选择文件则要清空文件上一次load的文件域和预览的图片
		preview.css("height","0");
		$.tdAlert("请选择文件！");
		return;
	}
    // Only proceed if the selected file is an image
    if (/^image/.test( files[0].type)){
		if(files[0].size < 1000000){
			var reader = new FileReader();
			// Read the local file as a DataURL
			reader.readAsDataURL(files[0]);

			// When loaded, set image data as background of div
			reader.onloadend = function(){
				preview.css("height","80px");
				preview.attr("src", this.result);
			}
		}else{
			preview.css("height","0");
			resetFileInput();
			$.tdAlert("图片大小限制在1M！");
			return;
		}

    }else{
		preview.css("height","0");
		resetFileInput();
		$.tdAlert("请选择图片！");
		return;
	}
});

$('#td-form-field-preview').click(function(e){
	$("#td-form-field-preview").css("height","0");
	resetFileInput();
});

function resetFileInput(){
	var file = $("#imageSrc");
	file[0].value = '';

}

$('#td-add-submit').click(function(e) {
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

	let y = new yang();
	y.ajax('../server/car-management/car-add.php', {
		type: "POST",
		data: formData,
		processData: false, // 告诉jQuery不要去处理发送的数据
		contentType : false, //必须false才会自动加上正确的Content-Type
		progress: {
			uploadProgress: ()=>{ console.log(arguments) },
			downloadProgress: ()=>{ console.log(arguments) }
		}
	}).then( (res)=>{ console.log(res) }, (res)=>{ console.log(res) } );
  /*  $.ajax({
        url: '../server/car-management/car-add.php',
        type: "POST",
        data: formData,
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType : false, //必须false才会自动加上正确的Content-Type
        cache: false,
        success: function(data) {
			var jsonResult = JSON.parse(data);
			if(!jsonResult.error){
				$.tdAlert('恭喜！添加成功！');
			}else{
				$.tdAlert('添加失败！'+jsonResult.errorMsg);
			}
        },
        error: function() {
            $.tdAlert('很遗憾！添加失败！');
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
    });*/
});
