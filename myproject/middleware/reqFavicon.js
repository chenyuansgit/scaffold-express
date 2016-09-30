// 请求网站图标

var reqFavicon = function (req, res, next) {
    if (req.url == "/favicon.ico") {
        res.writeHead(404, {
            'Content-Type': 'text/plain',
            'Error-Message': 'request favicon'
        });
        res.end();
        return;
    }
    next();

};

module.exports = reqFavicon;