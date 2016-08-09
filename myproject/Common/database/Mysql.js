var mysql = require('mysql');
var mysqlConfig = require('../../Config/mysqlConfig.js');


// 创建连接池
var pool = mysql.createPool(mysqlConfig);

var query = function(sql, options, callback){
    // 从连接池中拿到连接
    pool.getConnection(function(err, conn){
        if(err) {
            callback(err, null, null);
            return;
        }
        // 请求数据库
        conn.query(sql, options, function(err, vals, field ){
            //console.log('sql:', sql, options);
            // 释放连接
            conn.release();
            callback(err, vals, field);
        });
    });
};

exports.query = query;