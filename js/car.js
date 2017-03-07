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
                html_resultinfo += '<div class="single-member effect-' + item['carid'] + '"><div class="member-info"><h3>' +
                    item['plateNumber'] + '</h3><h5>' + item['model'] +
                    '</h5></div><div class="member-image"><img src="' +
                    item["imageSrc"] + '" alt="Member"></div><div class="more-info"><p>品牌：' +
                    item['brand'] + '</br>座位数：' + item['seating'] +
                    '座</br>级别：' + item['level'] + '</br>变速箱：' + item['gearbox'] +
                    '</br>汽油：' + item['gasoline'] + '</p><div class="social-touch icon-colored"><button class="fa fa-trash-o" id="delete-effect-' +
                    item['carid'] + '"></button><button class="fa fa-pencil" id="edit-effect-' +
                    item['carid'] + '"></button></div></div></div>';
                $('.row').append(html_resultinfo); //after方法:在每个匹配的元素之后插入内容。
            });
            $('.fa-trash-o').click(function(e) {
                var effectId = (e.target.id).substr(7, 8);
                $('.' + effectId).remove();
            });
            $('.fa-pencil').click(function(e) {
                var id = (e.target.id).substr(12, 1);
                console.log(id);
                window.location.href = 'detial.html?carid=' + id;
            });
        },
        error: function(xhr, textStatus) {
            console.log('错误');
            console.log(xhr);
            console.log(textStatus);
        }
    });
});
