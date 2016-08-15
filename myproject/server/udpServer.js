//https://nodejs.org/api/dgram.html

var dgram = require('dgram');
var serverConfig = require('../Config/serverConfig.js');

var port = serverConfig.udp.port;

// 创建udp服务器
var udpServer = dgram.createSocket('udp4');

// 监听端口
udpServer.bind(port);

// 监听事件
udpServer.on('listening', function () {
    var address = udpServer.address();
    console.log('udp server listening: ', address.address, ':', address.port);
});

udpServer.on('message', function (msg, rinfo) {
    console.log("Server got: ", msg.toString(), " from ", rinfo.address, ":", rinfo.port);

    var message = new Buffer('server received the message');
    // 向客户端发送消息
    udpServer.send(message, 0, message.length, rinfo.port, rinfo.address);
});

udpServer.on('error', function (error) {
    console.log('udp server error:', error.toString());
    udpServer.close();
});


udpServer.on('close', function () {
    console.log('udp server closed!');
});
