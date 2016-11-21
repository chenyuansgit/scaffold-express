var port = 3100;
var io = require('socket.io').listen(port);
io.sockets.on('connection', function(socket){
    console.log('new connection...');
    socket.emit('server', {
        server: 'server1',
        port: port
    });
});