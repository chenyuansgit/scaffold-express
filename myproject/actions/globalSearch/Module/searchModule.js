var searchIndex = require('search-index');
var path = require('path');
var co = require('co');

var Segment = require('segment');
// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

var monitorConfig = require('../Config/searchConfig.js');

var rootPath = monitorConfig.si.rootPath;

var tables = monitorConfig.database.tables;
var limit = monitorConfig.database.limit;

var opt = {
    batchName: 'my batch'
};

// 查询索引
class SearchEngine {
    constructor() { //构造函数
        this.m_indexs = {}; // 保存现有的索引
    }

    // 处理单个字符串的中文和英文分词
    _parseLine(str) {
        var self = this;
        // 使用中文分词
        //var strArr = nodejieba.cut(str);
        var strArr =  segment.doSegment(str, {
            simple: true
        });
        if(strArr.length > 0) {
            strArr.push(str);
        }
        //console.log('strArr:',strArr);
        return strArr;
    }


    // 处理整个json对象指定key的分词
    _parseData(jsonData, tableName) {
        var self = this;
        // 根据表名获取要分词的字段名
        var fields = [];
        for (var i = 0; i < tables.length; i++) {
            if (tables[i].tableName == tableName) {
                fields = tables[i].zhDivisiField;
                break;
            }
        }
        // 对该字段的数据进行分词
        for (var i = 0; i < fields.length; i++) {
            var key = fields[i];
            var data = jsonData[key];
            jsonData[key] = self._parseLine(data);
        }
        return jsonData;
    }

    // 获取options参数
    _getOption(galleryId, tableName) {
        var indexPath = path.join(rootPath, galleryId + '+' + tableName);

        console.log('indexPath:',indexPath);

        var options = {
            deletable: true,
            fieldedSearch: true,
            indexPath: indexPath,
            logLevel: 'error',
            nGramLength: 1,
            stopwords: ['zh', 'en'],
            store: true
        };

        return options;
    }

    // 获取查询的请求
    _getQuery(keyword) {
        // 获取查询的分词
        var words_str = this._parseLine(keyword);
        var words_arr = words_str.split(' ');
        words_arr.push(keyword);

        var q = {};
        var qArr = [];
        for(var i = 0; i< words_arr.length; i++) {
            var qItem = {
                AND: [{'*': [words_arr[i]]}]
            };
            qArr.push(qItem);
        }
        q.query = qArr;

        /*if (bLimit) {
         q.offset = 0;
         q.pageSize = limit;
         }*/

        return q;
    }

    // 获取索引对象
    _getSi(galleryId, tableName) {
        var self = this;
        var key = galleryId + '+' + tableName;

        return new Promise(function (resolve, reject) {
            if (self.m_indexs[key]) { // 索引存在则直接返回
                resolve(self.m_indexs[key]);
                return;
            } else { // 索引不存在则创建
                var options = self._getOption(galleryId, tableName);

                searchIndex(options, function (err, si) {
                    if (err) {
                        reject('创建索引出现错误' + err.toString());
                        return;
                    } else {
                        // 将索引保存到数组中
                        self.m_indexs[key] = si;
                        resolve(si);
                        return;
                    }
                });
            }
        });
    }


    // 往search缓存添加数据
    add(tableName, data) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var addData = self._parseData(data[0], tableName);
            var galleryId = addData.G_Id;

            co(function*() {
                var si = yield self._getSi(galleryId, tableName);
                si.add(addData, opt, function (err) {
                    if (err) {
                        reject('add err:' + err.toString());
                    } else {
                        resolve('add ok');
                    }
                });
            }).catch(function (error) {
                reject('catch exception:' + error.toString());
            });
        });
    }

    // 更新数据
    update(tableName, data) {
        var self = this;

        return new Promise(function (resolve, reject) {

            var updateData = self._parseData(data[0].after, tableName);
            var galleryId = updateData.G_Id;

            co(function*() {
                var si = yield self._getSi(galleryId, tableName);
                si.add(updateData, opt, function (err) {
                    if (err) {
                        reject('update err:', err.toString());
                    } else {
                        resolve('update ok');
                    }
                });
            }).catch(function (error) {
                reject('catch exception:' + error.toString());
            });
        });
    }

    // 删除数据
    delete(tableName, data) {
        var self = this;

        return new Promise(function (resovle, reject) {
            var docId = data[0].id;
            var galleryId = data[0].G_Id;
            co(function*() {
                var si = yield self._getSi(galleryId, tableName);
                si.del(docId, function (err) {
                    if (err) {
                        reject('del err:' + err.toString());
                    } else {
                        resovle('del ok');
                    }
                })
            }).catch(function (error) {
                reject('catch exception:' + error.toString());
            });
        });
    }

    // 查询单表数据
    searchSingle(galleryId, tableName, keyword) {
        var self = this;
        return new Promise(function (resolve, reject) {
            co(function*() {
                if(!keyword) {
                    reject('关键字不能为null');
                    return;
                }

                var q = self._getQuery(keyword);
                var si = yield self._getSi(galleryId, tableName);
                si.search(q, function (err, searchResults) {
                    if (err) { // 当该索引暂时还没有建立时会出错
                        console.log('single search warning:', err.toString());
                        resolve([]);
                    } else {
                        var res = [];
                        if (searchResults && searchResults.hits) {
                            // 提取需要的结果
                            for (var i = 0; i < searchResults.hits.length; i++) {
                                var doc = searchResults.hits[i].document;
                                if(doc) {
                                    res.push(doc);
                                }

                            }
                        }
                        console.log('res:',tableName, res);
                        resolve(res);
                    }
                }).catch(function (error) {
                    console.log('查询单个表de索引时出错', error);
                });
            });
        })
    }

    // 查询所有数据
    searchAll(galleryId, keyword) {
        var self = this;
        return new Promise(function (resolve, reject) {
            co(function*() {
                var result = [];
                if(!keyword) {
                    reject('关键字不能为null');
                    return;
                }

                for (var i = 0; i < tables.length; i++) {
                    var tableName = tables[i].tableName;
                    var singleResult = yield self.searchSingle(galleryId, tableName, keyword, true);

                    // 加入最终返回结果
                    result.push({
                        tableName: tableName,
                        data: singleResult
                    });
                }
                resolve(result);
            }).catch(function (error) {
                console.log('查询所有表de索引时出错', error);
            });
        });

    }
}

module.exports = new SearchEngine();