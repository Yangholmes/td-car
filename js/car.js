$(document).ready(function() {
    //使用ajax方法读取json数据,
    //注意：info.json可以是不同类型文件，只要其中的数据为json类型即可
    $.ajax({
        url: '../server/car-management/car-load.php',
        dataType: 'json',
        success: function(data) {
			if(!data.error){
				var html_resultinfo;
				$.each(data["records"], function(i, item) {
					html_resultinfo = '';
					html_resultinfo += '<div class="single-member effect-' + item['carid'] + '"><div class="member-info"><h3 class="plateNumber">' +
						item['plateNumber'] + '</h3><h5 class="model">' + item['model'] +
						'</h5></div><div class="member-image"><img src="' +
						item["imageSrc"] + '" alt="Member"></div><div class="more-info"><p>品牌：<span class="brand">' +
						item['brand'] + '</span></br>座位数：<span class="seating">' + item['seating'] +
						'</span>座</br>级别：<span class="level">' + item['level'] + '</span></br>变速箱：<span class="gearbox">' + item['gearbox'] +
						'</span></br>汽油：<span class="gasoline">' + item['gasoline'] + '</span></p><div class="social-touch icon-colored"><button class="fa fa-trash-o" id="delete-effect-' +
						item['carid'] + '"></button><button class="fa fa-pencil" id="edit-effect-' +
						item['carid'] + '"></button></div></div></div>';
					$('.row').append(html_resultinfo); //after方法:在每个匹配的元素之后插入内容。
					setLocalStorage("car"+item['carid'], item);
				});

				$('.fa-trash-o').click(function(e) {
          $.tdConfirm("真的要删除吗?",function(i){
            if(i){
              var effectId = (e.target.id).slice(14);
    					var carid = {"carid":effectId};
    					$.ajax({
    						url: '../server/car-management/car-delete.php',
    						type: "POST",
    						data: carid,
    						dataType: 'json',
    						//这两个参数是传送form的
    						// processData: false, // 告诉jQuery不要去处理发送的数据
    						// contentType : false, //必须false才会自动加上正确的Content-Type
    						cache: false,
    						success: function(data) {
    							if(!data.error){
    								$.tdAlert('恭喜！删除成功！');
    							}else{
    								$.tdAlert('删除失败！'+data.errorMsg);
    							}
    						},
    						error: function() {
    							$.tdAlert('很遗憾！删除失败！');
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
    					$('.effect-' + effectId).remove();
            }
          });


				});
				$('.fa-pencil').click(function(e) {
					var effectId = (e.target.id).slice(12);
					window.location.href = 'detial.html?carid='+effectId;
				});
			}else{
				$.tdAlert('读取失败！');
			}

        },
        error: function(xhr, textStatus) {
            console.log('错误');
            console.log(xhr);
            console.log(textStatus);
        }
    });
});

function setLocalStorage (name, value)
{
    if(!window.localStorage){
		$.tdAlert("浏览器不支持localstorage");
	}else{
		var storage=window.localStorage;
		var d=JSON.stringify(value);
		storage.setItem(name,d);
	}
}
