// 将表的修改写入search缓存中

var LiveSQL = require("live-sql"); //依赖于live-sql, zongji

var searchModule = require('./Module/searchModule.js');
var co = require('co');

// mysql服务器
var mysqlConfig = require('./Config/searchConfig.js').server;
var databaseConfig = require('./Config/searchConfig.js').database;

// 监听的数据库
var databaseName = databaseConfig.name;
var tables = databaseConfig.tables;

var monitorPath = databaseName + ".*.*";

var events = []; // 消息队列


var manager = new LiveSQL(mysqlConfig);
manager.subscribe(databaseName);

// 监听binlog事件
manager.on(monitorPath, function (event) {
    console.log('event coming...', event);

    // 只监听处理指定的表
    var tableName = event.tableName();

    var bMonitor = false;
    for(var i = 0; i< tables.length; i++) {
        if(tableName == tables[i].tableName) {
            bMonitor = true;
        }
    }
    if (!bMonitor) {
        return;
    }

    // 监听发生更改的类型: write, update, delete
    var eventType = event.type();
    if (eventType != 'write' && eventType != 'update' && eventType != 'delete') {
        return;
    } else {
        // 将消息加入消息队列中
        events.unshift(event);
    }
});

// 循环遍历消息队列
(function(){
    var args = arguments;
    // 从队列中取出第一个事件
    var event = events.pop();
    // 同步索引的缓存
    if(event) {
        co(function*(){
            var eventType = event.type();
            var tableName = event.tableName();
            var rows = event.rows();

            if (eventType == "write") {
                console.log('table write ...');
                yield searchModule.add(tableName,rows);
            }
            if (eventType == "update") {
                console.log('table update ...');
                yield searchModule.update(tableName, rows);
            }
            if (eventType == "delete") {
                console.log('table delete ...');
                yield searchModule.delete(tableName, rows);
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

manager.start(); // 开始监听