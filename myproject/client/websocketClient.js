var ws = require("nodejs-websocket");

var conn = ws.connect("ws://127.0.0.1:3009", function () {
    console.log('connection success...');
});

conn.on("text", function (str) {
    console.log("Received " + str);
    conn.sendText(str.toLowerCase() + "!!!");
});

conn.on("close", function (code, reason) {
    console.log("Connection closed");
});

conn.on("error", function (error) {
    console.log("Connection error");
});

