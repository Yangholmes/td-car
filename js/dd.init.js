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
        title: '用车管理',
        onSuccess: function(data) {},
        onFail: function(err) {
            log.e(JSON.stringify(err));
        }
    }); // set navigation title

    dd.runtime.info({
        onSuccess: function(info) {
            logger.e('runtime info: ' + JSON.stringify(info));
        },
        onFail: function(err) {
            logger.e('fail: ' + JSON.stringify(err));
        }
    }); // runtime info

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
