;

/**
 * super global variables
 * _config  √
 * _user    √
 * _car     °
 */
var _user = {}, // user info
    _config = _config; // dd config

/**
 * jsapi权限验证配置
 * _config 是保存dd配置的全局变量
 */
dd.config({
    agentId: _config.agentId[0], // this app ID
    corpId: _config.corpId[0],
    timeStamp: _config.timeStamp,
    nonceStr: _config.nonceStr,
    signature: _config.signature, // jsapi signature
    type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi。
    jsApiList: [ // 需要调用的jsapi列表
        'runtime.info',
        'biz.contact.choose',
        'device.notification.confirm',
        'device.notification.alert',
        'device.notification.prompt',
        'biz.ding.post',
        'biz.util.openLink',
        'ui.pullToRefresh.enable',
        'ui.pullToRefresh.stop',
        'biz.util.openLink',
        'biz.navigation.setLeft',
        'biz.navigation.setTitle',
        'biz.navigation.setRight'
    ]
}); // jsapi permission

/**
 * 钉钉入口
 */
dd.ready(function() {

    /**
     * 容器
     */
    // 获取容器信息
    dd.runtime.info({
        onSuccess: function(info) {
            console.log('runtime info: ' + JSON.stringify(info));
        },
        onFail: function(err) {
            console.log('fail: ' + JSON.stringify(err));
        }
    }); // runtime info

    // 获取微应用免登授权码、登陆用户信息
    dd.runtime.permission.requestAuthCode({
        corpId: _config.corpId[0],
        onSuccess: function(result) {
            console.log('微应用免登授权码: ', result);
            $.ajax({
                url: "server/verification/get-user-info.php?access_token=" + _config.accessToken + "&code=" + result.code,
                method: 'GET',
                dataType: 'json',
                success: function(respond) {
                    console.log(respond);
                    _user = respond; //
                },
                error: function() {}
            });
        },
        onFail: function(err) {
            console.log('微应用免登授权码, 错误: ', err);
        }

    });

    /**
     * 下拉刷新
     */
    dd.ui.pullToRefresh.disable();

    /**
     * 标题栏
     */
    dd.biz.navigation.setTitle({
        title: '通导用车',
        onSuccess: function(data) {
            console.log(data);
        },
        onFail: function(err) {
            console.log(JSON.stringify(err));
        }
    }); // set navigation title

    /**
     * 导航栏设置
     */
    dd.biz.navigation.setMenu({
        items: [/*{
            "id": "1",
            "text": "我的历史",
        },*/{
            "id": "2",
            "text": "车的管理",
        },{
            "id": "3",
            "text": "添加车辆",
        }],
        onSuccess: function(data) {
          // $.tdAlert(_user.name);
          switch(data.id){
            case '1':
              $.tdAlert('即将推出\n敬请期待');
              break;
            case '2': // open a new page in current page
              dd.biz.util.openLink({
                url: 'http://www.gdrtc.org/car/page/car.html',
                onSuccess : function(result) {},
                onFail : function() {}
              });
              // window.location.href = 'page/car.html' + '?userid=' + _user.userid, 'carManager';
              break;
            case '3':
              if( _user.admin_level == '0' ){
                $.tdAlert('这个操作需要管理员权限');
                return false;
              }
              dd.biz.util.openLink({
                url: 'http://www.gdrtc.org/car/page/car-add.html' + '?userid=' + _user.userid,
                onSuccess : function(result) {},
                onFail : function() {}
              });
              // window.location.href = 'page/car-add.html' + '?userid=' + _user.userid;
              break;
            default:
              break;
          }
        },
        onFail: function(err) {
          $.tdAlert(err);
        }
    });

    /**
     * 其他业务
     */

});

dd.error(function(err) {
    console.log('错误信息: ' + JSON.stringify(err));
    $.tdAlert('错误信息: ' + JSON.stringify(err));
});
