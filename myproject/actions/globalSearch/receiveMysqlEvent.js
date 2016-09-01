// 将表的修改写入search缓存中

var LiveSQL = require("live-sql"); //依赖于live-sql, zongji

var searchModule = require('./Module/searchModule.js');
var co = require('co');

// mysql服务器
var searchConfig = require('./Config/searchConfig.js');

// 1. 创建socket服务器,维护event消息队列
var events = []; // 消息队列
var ioPort = searchConfig.ioPort;
var ioServer = require('socket.io')(ioPort);

console.log('io server(monitoring mysql)  Listening on  port', ioPort);

// 监听到socket连接
ioServer.on('connection', function(socket){
    console.log('new connection..');

    // 监听事件请求
    socket.on('event', function(event){
        events.push(event);
    });

    // socket断开连接
    socket.on('disconnect', function(){
        console.log('socket disconnect');
    });

});


// 2.循环遍历消息队列
(function(){
    console.log('loop', events.length);
    var args = arguments;
    // 从队列中取出第一个事件
    var event = events.pop();
    // 同步索引
    if(event) {
        co(function*(){
            var eventType = event.type;
            var tableName = event.tableName;
            var rows = event.rows;

            if (eventType == "write") {
                console.log('table write ...');
                yield searchModule.add(tableName, event.rows);
            }
            if (eventType == "update") {
                console.log('table update ...');
                //yield searchModule.delete(tableName, event.rows);
                yield searchModule.update(tableName, event.rows);
            }
            if (eventType == "delete") {
                console.log('table delete ...');
                yield searchModule.delete(tableName, event.rows);
            }
        }).then(function(){
            // 执行完成才可处理下一个事件
            args.callee();
        }).catch(function(err){
            console.log('monitorEventsLoop Err:', err.toString());
        });
    } else {
        setTimeout(function(){ // 每隔5s钟检查一次事件列表
            args.callee();
        }, 5000);
    }
})();