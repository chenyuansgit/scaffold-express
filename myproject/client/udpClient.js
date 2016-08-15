var dgram = require('dgram');

var serverConfig = require('../Config/serverConfig.js');

var clientPort = serverConfig.udp.clientPort;

var serverPort = serverConfig.udp.port;
var serverHost = serverConfig.udp.host;

// 创建udp客户端
var socket = dgram.createSocket('udp4');

// 监听端口
socket.bind(/*clientPort*/);

// 监听事件
socket.on('listening', function () {
    var address = socket.address();
    console.log('udp client listening: ', address.address, ':', address.port);

    // 开启广播功能
    socket.setBroadcast(true);
});


var message = new Buffer('Hi, this is client');


// 向指定ip(服务器)发送消息
socket.send(message, 0, message.length, serverPort, serverHost, function (error, bytes) {
    //socket.close();
});

// 广播消息
socket.send(message, 0, message.length, serverPort, '255.255.255.255', function (error, bytes) {
    //socket.close();
});

// 接收消息
socket.on('message', function (msg) {
    console.info('client got the message:', msg.toString());
});