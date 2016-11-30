var mysql = require('mysql');
var fs = require('fs');
var mysqlConfig = require('../../config/mysqlConfig.js');

// 创建连接池
var pool = mysql.createPool(mysqlConfig);

var query = function(sql, options, callback) {
    if (typeof options == "function") {
        throw "第二个参数不能是回调函数";
    }
    // 从连接池中拿到连接
    pool.getConnection(function(err, conn) {
        if (err) {
            callback(err, null, null);
            return;
        }
        // 请求数据库
        var query = conn.query(sql, options, function(err, vals, field) {
            //console.log('sql:', sql, options);
            // 释放连接
            conn.release();
            callback(err, vals, field);
        });

        fs.appendFileSync('sql.txt', query.sql + '\n', {encoding: 'utf8'});
        //console.log(query.sql);

    });
};

exports.query = query;