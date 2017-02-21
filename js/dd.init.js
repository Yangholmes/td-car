;

/**
 * super global variables
 * _config
 * _user
 */
var _user = {
              'userId': null,
              'deviceId': null,
              'isSys': null,
              'sysLevel': null,
            }; // user info

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
     * 容器
     */
    dd.runtime.info({ // 获取容器信息
        onSuccess: function(info) {
            console.log('runtime info: ' + JSON.stringify(info));
        },
        onFail: function(err) {
            console.log('fail: ' + JSON.stringify(err));
        }
    }); // runtime info

    dd.runtime.permission.requestAuthCode({ // 获取微应用免登授权码
        corpId: _config.corpId[0],
        onSuccess: function(result) {
            console.log('微应用免登授权码: ', result);
            $.ajax({
              url: "server/verification/get-user-info.php?access_token=" + _config.accessToken + "&code=" + result.code,
              method: 'GET',
              dataType: 'json',
              success: function(respond){
                console.log(respond);
                _user.userId = respond.userid;
                _user.deviceId = respond.deviceId;
                _user.isSys = respond.isSys;
                _user.sysLevel = respond.sysLevel;
              },
              error: function(){
              }
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
     * 导航栏设置
     */
     dd.biz.navigation.setRight({
     show: false,//控制按钮显示， true 显示， false 隐藏， 默认true
     control: true,//是否控制点击事件，true 控制，false 不控制， 默认false
     text: '更多',//控制显示文本，空字符串表示显示默认文本
     onSuccess : function(result) {
       alert('没有更多了~');
     },
     onFail : function(err) {}
 });

    /**
     * UI控件
     */

});

dd.error(function(err) {
    console.log('错误信息: ' + JSON.stringify(err));
    alert('错误信息: ' + JSON.stringify(err));
});
