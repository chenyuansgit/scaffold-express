var net = require('net');

var serverConfig = require('../Config/serverConfig.js');

var host = serverConfig.tcp.host;
var port = serverConfig.tcp.port;

var tcpClient = new net.Socket();


// 连接tcp服务器端
tcpClient.connect({host: host, port: port}, function () {
    console.log('client connect to: ', host, port);
    // 建立连接后立即向服务器发送数据，服务器将收到这些数据
    tcpClient.write('I am Chuck Norris!');
    //tcpClient.write('quit');
    //tcpClient.write('file');
});


// 监听数据
tcpClient.on('data', function (data) {
    console.log('client received data: ' + data);
    // 完全关闭连接
    tcpClient.destroy();

});

// 监听连接关闭事件
tcpClient.on('close', function () {
    console.log('client connection closed');
});