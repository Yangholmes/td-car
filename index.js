;

/**
 * jsapi权限验证配置
 */
dd.config({
    agentId: '76775472', // this app ID
    corpId: 'ding8ddf91e46c80e26435c2f4657eb6378f',
    timeStamp: 1440678945,
    nonceStr: 'abcdefg',
    signature: '4af5b42704b887f3b641c436e7eddfaa326e8782', // jsapi signature
    type: 0,   //选填。0表示微应用的jsapi,1表示服务窗的jsapi。
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
        onSuccess: function() {},
        onFail: function() {}
    }) // pull to refresh

    dd.biz.navigation.setMenu({
        items: [{
                id: "此处可以设置帮助", //字符串
                // "iconId":"file",//字符串，图标命名
                text: "帮助"
            },
            {
                "id": "2",
                "iconId": "photo",
                "text": "我们"
            },
            {
                "id": "3",
                "iconId": "file",
                "text": "你们"
            },
            {
                "id": "4",
                "iconId": "time",
                "text": "他们"
            }
        ],
        onSuccess: function(data) {
            alert(JSON.stringify(data));

        },
        onFail: function(err) {
            alert(JSON.stringify(err));
        }
    });

});

dd.error(function(err) {
    console.log('错误信息: ' + JSON.stringify(err));
    alert('错误信息: ' + JSON.stringify(err));
});
