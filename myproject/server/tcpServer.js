var net = require('net');
var fs = require('fs');
var path = require('path');
var serverConfig = require('../Config/serverConfig.js');

var port = serverConfig.tcp.port;

var tcpServer = net.createServer();
tcpServer.listen(port);

tcpServer.on('listening', function () {
    console.log('tcp server  Listening on  port', port);
});

tcpServer.on('close', function () {
    console.log('tcp Server is now closed');
});

tcpServer.on('error', function (err) {
    console.log('tcp Server Has Error :', err.message);
});

tcpServer.on('connection', function (socket) {
    // 接受新的客户端连接
    console.log('tcp Server has a new connection');
    socket.setEncoding('utf8');
    //socket.setTimeout(60000); // 1 minute
    //socket.setKeepAlive(true);

    socket.write("Hello! You can start typing. Type 'quit' to exit.\n");


    // 监听data事件
    socket.on('data', function (data) {

        console.log('server got data:', data.toString());

        // 服务端主动断开客户端连接
        if (data.trim().toLowerCase() === 'quit') {
            socket.write('Bye bye!');
            return socket.end();
        }

        // 服务器端向客户端发送文件
        if (data.trim().toLowerCase() === 'file') {
            var filePath = path.join(__dirname, '../test/hello.txt');
            //console.log('path:',__dirname);
            var rs = fs.createReadStream(filePath);
            rs.pipe(socket);
        }

        // 闲置socket超时则关闭该socket
        socket.on('timeout', function () {
            socket.write('idle timeout, disconnecting, bye!');
            socket.end();
        });

        //反馈回客户端
        socket.write('server return data: ' + data);
    });

    // 监听连接结束事件
    socket.on('end', function () {
        console.log('Client connection ended');
    });

});