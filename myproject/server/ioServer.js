var serverConfig = require('../Config/serverConfig.js');
var port = serverConfig.io.port;

// 创建io服务器
var ioServer = require('socket.io')(port);

console.log('io server  Listening on  port', port);
//var app = require('./app.js');
//var ioServer = require('socket.io')(app);

// 连接的socket列表
var sockets = [];

// 监听到socket连接
ioServer.on('connection', function(socket){
    console.log('new connection..');

    // 加入socket列表
    sockets.push(socket);

    // 监听事件请求
    socket.on('join', function(message){
        console.log('1. join:',message);
        // 添加组
        socket.join(message.groupName);
        // 返回消息
        socket.emit('join result', {message:'join ok'});
    });

    // 监听推送请求
    socket.on('push', function(message){
        console.log('2. push',message);
        // 向该组推送消息
        ioServer.to(message.groupName).emit("push message",message.data);
    });


    // socket断开连接
    socket.on('disconnect', function(){
        console.log('socket disconnect');

        // 从socket列表移除
        var index = sockets.indexOf(socket);
        sockets.splice(index, 1);
    });

});