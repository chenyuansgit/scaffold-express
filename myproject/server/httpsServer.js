var app = require('./app.js');
var https = require('https');
var fs = require('fs');
var path = require('path');

var serverConfig = require('../Config/serverConfig.js');
var middleware = require('../Common/util/middleware.js');


var port = serverConfig.https.port;
app.set('port', port);

// 创建https server
var options = {
    key: fs.readFileSync(path.join(__dirname, "../","key", "privatekey.pem")),
    cert: fs.readFileSync(path.join(__dirname, "../","key", "certificate.pem"))
};

var server = https.createServer(options, app);

server.listen(port);
server.on('error', function(error){
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.on('listening', function(){
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    //debug('Listening on ' + bind);
    console.log('HTTPS server Listening on ', bind);
});
