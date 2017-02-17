;

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
