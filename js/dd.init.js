;
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
        },
        onFail: function(err) {
            console.log('微应用免登授权码, 错误: ', err);
        }

    })

    /**
     * 业务
     */

    /**
     *
     */
    dd.ui.pullToRefresh.enable({
        onSuccess: function() {
            setTimeout(function() {
                //todo 相关数据更新操作
                dd.ui.pullToRefresh.stop();
            }, 2000);
        },
        onFail: function() {}
    }) // pull to refresh

});

dd.error(function(err) {
    console.log('错误信息: ' + JSON.stringify(err));
    alert('错误信息: ' + JSON.stringify(err));
});
