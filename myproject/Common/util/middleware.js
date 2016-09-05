var middleware = {

    // 自定义登录验证中间件
    checkLoginOfCookie: function (req, res, next) {
        //console.log(req.cookies);
        //console.log(req.headers);
        if (!req.cookies.account) {
            res.send({code: 1, message: '用户未登录'});
            res.end();
            return;
        }
        next();
    },

    checkLoginOfSession: function (req, res, next) {
        // 获取session
        if (!req.session.username) {
            res.redirect('/login');
        }
        next();
    },

    // 用户未登录验证
    checkNotLogin: function (req, res, next) {
        if (req.session.username) {
            //res.redirect('back'); // 返回之前的页面
        }
        next();
    }


};

module.exports = middleware;