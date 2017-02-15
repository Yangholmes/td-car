;

/**
 * jsapi权限验证配置
 */
dd.config({
    agentId: '', // this app ID
    corpId: '',
    timeStamp: '',
    nonceStr: '',
    signature: '',
    jsApiList: [ // 需要调用的jsapi列表
				'runtime.info',
        'biz.contact.choose',
        'device.notification.confirm',
        'device.notification.alert',
        'device.notification.prompt',
        'biz.ding.post',
        'biz.util.openLink'
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

});

dd.error(function(err) {
    alert('错误信息: ' + JSON.stringify(err));
});
