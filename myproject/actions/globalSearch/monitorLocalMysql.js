// 监听程序和mysql运行在一台服务器

var LiveSQL = require("live-sql"); //依赖于live-sql, zongji
var monitorConfig = require('./Config/searchConfig.js');

// 1. 连接到socket.io服务器
var io = require('socket.io-client');

var socket = io.connect(monitorConfig.noticeServer);
var isConnect = false;

socket.on('connect', function () {
    isConnect = true;
    console.log('io client connect to server', isConnect);
});

socket.on("disconnect", function () {
    isConnect = false;
    console.log('io client disconnect');
});

socket.on("error", function (err) {
    console.log('io client error:', err);
});

// 2.监听指定的表的更改消息
var tables = monitorConfig.database.tables;
var manager = new LiveSQL(monitorConfig.server);

manager.subscribe(monitorConfig.database.name);

// 监听binlog事件
manager.on(monitorConfig.database.name + '.*.*', function (event) {
    var tableName = event.tableName();

    // 只监听处理指定的表
    var bMonitor = false;
    for (var i = 0; i < tables.length; i++) {
        if (tableName == tables[i].tableName) {
            bMonitor = true;
        }
    }

    if (!bMonitor) {
        return;
    }

    // 更改类型: write, update, delete
    var eventType = event.type();
    if (eventType != 'write' && eventType != 'update' && eventType != 'delete') {
        return;
    } else {
        // 将事件发送给消息队列
        var message = {
            type: event.type(),
            tableName: event.tableName(),
            rows: event.rows()
        };
        console.log('send event:', message);
        if (isConnect) {
            socket.emit('event', message);
        }
    }
});

manager.start();
