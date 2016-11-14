//  https://github.com/sitegui/nodejs-websocket

var ws = require("nodejs-websocket");

var serverConfig = require('../Config/serverConfig.js');

var host = serverConfig.websocket.host;
var port = serverConfig.websocket.port;

var websocketServer = ws.createServer();
websocketServer.listen(port, host);

websocketServer.on("listening", function () {
    console.log("websocketServer listening " + port);
});

websocketServer.on('connection', function (conn) {
    console.log('new websocket connection...');
    conn.sendText("hello, websocket");
    
    conn.on("text", function (str) {
        console.log("Received " + str);
        conn.sendText(str.toUpperCase() + "!!!");
    });

    conn.on("close", function (code, reason) {
        console.log("Connection closed");
    });

    conn.on("error", function (error) {
        console.log("Connection error");
    });

});

websocketServer.on("close", function () {
    console.log("websocketServer close");
});

websocketServer.on("error", function (error) {
    console.log("websocketServer error");
});