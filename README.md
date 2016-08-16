# 脚手架 － Express
保存了项目中常用的代码

1. myproject : Express项目

        Config/mysqlConfig.js: Mysql数据库的配置文件
        Config/serverConfig.js: 服务器配置文件(端口等)

        Common/database/Mysql.js: Mysql数据库连接与请求
        Common/log/SystemLog.js: 打印日志:颜色
        Common/log/traceLog.js:  打印日志:所在文件与行

        Common/util/util.js: 常用的功能函数
        Common/util/middleware.js: 自定义中间件函数

        server/httpServer.js: 创建http服务器
        server/httpsServer.js: 创建https服务器
        server/ioServer.js: 创建io.socket服务器
        server/tcpServer.js: 创建tcp服务器
        server/udpServer.js: 创建udp服务器

        document: 存放说明文档

        test/ioClient.html: 创建socket.io客户端
        test/tcpClient.js: tcp客户端
        test/udpClient.js: udp客户端


        actions/globalSearch: 全局搜索
        actions/globalSearch/Module/searchModule.js: 查询的功能模块

        actions/globalSearch/monitorMysql.js: 监听数据库变动,同步search缓存
        acticns/globalSearch/test/search.single.test.js: 测试用例





