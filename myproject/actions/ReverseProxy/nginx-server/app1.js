var port = 3100;
var io = require('socket.io').listen(port);

var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));


io.sockets.on('connection', function(socket){
    console.log('new connection...');
    socket.emit('server', {
        server: 'server1',
        port: port,
        time: new Date()
    });
});