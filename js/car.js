$(document).ready(function() {
    //使用ajax方法读取json数据,
    //注意：info.json可以是不同类型文件，只要其中的数据为json类型即可
    $.ajax({
        url: '../server/car-management/car-load.php',
        dataType: 'json',
        success: function(data) {
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
            });
            $('.fa-trash-o').click(function(e) {
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
							alert('恭喜！删除成功！');
						}else{
							alert('删除失败！'+data.errorMsg);
						}
					},
					error: function() {
						alert('很遗憾！删除失败！');
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
            });
            $('.fa-pencil').click(function(e) {
                var effectId = (e.target.id).slice(12);
				var effect = $('.effect-' + effectId);
				var selectCar = '{"carid":"'+effectId+
					'","plateNumber":"'+effect.find('.plateNumber')[0].textContent+
					'","model":"' + effect.find('.model')[0].textContent+
					'","brand":"' + effect.find('.brand')[0].textContent+
					'","seating":"' + effect.find('.seating')[0].textContent+
					'","level":"' + effect.find('.level')[0].textContent+
					'","gearbox":"' + effect.find('.gearbox')[0].textContent+
				'","gasoline":"' + effect.find('.gasoline')[0].textContent+'"}';
				//var jsonStr = JSON.stringify(selectCar);
				//coolie只能传递string,所以selectCar是string类型的json字符串，方便下一个界面转为json
				setcookie('selectCar',selectCar);
				window.location.href = 'detial.html';
            });
        },
        error: function(xhr, textStatus) {
            console.log('错误');
            console.log(xhr);
            console.log(textStatus);
        }
    });
});
function setcookie (name, value)
{ 
    //设置名称为name,值为value的Cookie
    //var expdate = new Date();   //初始化时间
    //expdate.setTime(expdate.getTime() + 30 * 60 * 1000);   //时间
    document.cookie = name+"="+value+";expires="+";path='detial.html";

   //即document.cookie= name+"="+value+";path=/";   时间可以不要，但路径(path)必须要填写，因为JS的默认路径是当前页，如果不填，此cookie只在当前页面生效！~
}
