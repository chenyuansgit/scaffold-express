var path = require('path');

var uploadConfig = {
    'port': "3009",
    'domain': "http://192.168.63.17:4444", // 服务器所在域名
    'rootPath': '/uploader', // 根路径
    'destPath':'/store/',    // 文件最终目录
    'tempPath':'/temp/'      // 文件临时目录
};

module.exports = uploadConfig;