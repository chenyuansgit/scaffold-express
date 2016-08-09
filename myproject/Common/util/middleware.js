var middleware = {

    // 自定义登录验证中间件
    checkLogin: function (req, res, next) {
        //console.log(req.cookies);
        //console.log(req.headers);
        if (!req.cookies.account) {
            res.send({code: 1, message: '用户未登录'});
            res.end();
            return;
        }
        next();
    },

};

module.exports = middleware;