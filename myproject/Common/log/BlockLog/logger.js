/**
 * 日志模块
 * 对tracer的功能进行了限制，只输出特定格式的日志。
 */

var tracer = require('tracer');
var mkdir = require('mkdir').mkdirsSync;

var config = {
    logRoot: './logsfile', // 日志文件存放的路径(路径必须存在)
    envType: 'dev'  // 标志当前开发环境
};

mkdir(config.logRoot); // 创建日志的根文件夹

// 创建每一种类型日志的格式
function createLogHandler(fname, maxLogFiles) {
    var logOption = {
        root: config.logRoot,
        format: "{{timestamp}} {{message}}",
        dateformat: 'HH:MM:ss',
        splitFormat: 'yyyymmdd',
        allLogsFileName: fname,
        maxLogFiles: maxLogFiles || 25,
        filters: function (s, d) {
            //d.title = fname; // 日志文件名
            if (config['envType'] != 'prod') {
                console.log(fname + ': ' + s); //开发环境:写入文件 +  输出到控制台
            }
            return s;
        }
    };

    return tracer.dailyfile(logOption);
}

// 预先创建好相应类型的日志
[
    'info',
    'error',
    'debug',
    'task',
    'node',
    'notify'
]
    .forEach(function (name) {
        module.exports[name] = createLogHandler(name).log; // 导出预定义的格式
    });


// 导出创建方法
module.exports['createLogHandler'] = createLogHandler;
