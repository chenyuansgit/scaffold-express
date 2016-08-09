var colors = require('colors');
var trace = require('tracer');

var options = {
    format : "{{message}} ({{file}}:{{line}})",
    dateformat : "yy-m-d HH:MM:ss",
    filters : {
        //log : colors.black,
        trace : colors.magenta,
        debug : colors.blue,
        info : colors.green,
        warn : colors.yellow,
        error : [ colors.red, colors.bold ]
    }
};

var logger = trace.colorConsole(options);
//logger.log('hello, world!');

module.exports = logger;

