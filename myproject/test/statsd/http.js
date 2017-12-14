var SDC = require('statsd-client');
var express = require('express');

var app = express();
sdc = new SDC({
    host: 'http://127.0.0.1',
    port: '3306',
    debug: true
});

app.get('/',
    //sdc.helpers.getExpressMiddleware('otherPrefix'),
    function (req, res, next) {
        sdc.increment('some.counter');
        req.pipe(res);
    });

app.listen(5555);