var co = require('co');

var searchModule = require('../Module/searchModule.js');


// 查询单个表的作品
describe('single artist查询接口', function () {
    this.timeout(3000);

    var galleryId = 2;
    var tableName = 'oa_artist';

    var keyword = 'test';
    var ids = [];

    // 根据关键字查询艺术家信息
    it('search artist', function (done) {
        co(function*(){
            // 查询结果
            var result = yield searchModule.searchSingle(galleryId, tableName, keyword);
            // 获取id集合信息
            for (var i = 0; i < result.length; i++) {
                ids.push(result[i].id);
            }
            done();

        });

    });

    // 根据id集合获取艺术家详情
    it('research artist', function (done) {
        // 在数据库中查询id集合中的数据
        var sql = `SELECT * FROM oa_artist 
                    WHERE oa.id in  (614) 
                    GROUP BY id  
                    ORDER BY id DESC  
                    LIMIT 0,100;`;
        // [TODO]执行sql查询
        done();
    });

});


// 查询数据

// 返查