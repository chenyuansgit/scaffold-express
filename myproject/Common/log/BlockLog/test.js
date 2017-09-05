const Koa = require('koa');
const app = new Koa();
const BlockLog = require('./blocklog.js');


// response
app.use(ctx => {
    var urls = ctx.url.split('/');

    var logfile = urls.join('.').substr(1);

    // 创建日志对象
    ctx.logs = new BlockLog(logfile);
    // 加入日志队列
    ctx.logs.push('reqParams', JSON.stringify(ctx.params));
    ctx.logs.end('testEnd');
    ctx.body = 'Hello Koa';
});

app.listen(3000);


/*
测试：
node test.js

http://localhost:3000/user/list
http://localhost:3000/user/detail

查看生成的日志文件
查看日志内容
 */