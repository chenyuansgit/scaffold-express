var path = require('path');

var searchConfig = {
    // 要监听的mysql服务器地址
    server: {
        'host': '192.168.63.17',
        'user': 'chenyuan',
        'password': '123456',
        'database': 'oa_gallery',
        'port': "3306"
    },
    database: {
        name: 'oa_gallery', // 监听的数据库名称
        tables: [
            {
                tableName: 'oa_artist', // 监听的表名
                zhDivisiField: ['Name'] // 需要分词的字段
            }
        ]
    },
    si: {
        rootPath : path.join(__dirname, '../', 'si')
    }
};

module.exports = searchConfig;