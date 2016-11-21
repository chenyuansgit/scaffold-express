var port = 3101;
var io = require('socket.io').listen(port);
io.sockets.on('connection', function(socket){
    console.log('new connection...');
    socket.emit('server', {
        server: 'server2',
        port: port
    });
});