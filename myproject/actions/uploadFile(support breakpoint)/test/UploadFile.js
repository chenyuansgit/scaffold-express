function UploadFile(file) {
    this.url = 'http://192.168.63.17:3009';

    this.file = file;

    // 文件读取方法
    this.fileReader = new FileReader();

    // 文件分割方法
    this.blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;

    // 创建md5对象（基于SparkMD5）
    this.spark = new SparkMD5();

    // 文件每块的大小(2M)
    //this.chunkSize = 2097152;
    this.chunkSize = 1024*10;
    this.chunksNumber = Math.ceil(this.file.size / this.chunkSize);
    this.currentChunkIndex = 0;
};

// 获取上传文件名
UploadFile.prototype.getTmpFileName = function (file) {
    var tmpFileName = file.lastModified + file.size + file.name;
    return tmpFileName;
};

// 读取单片文件内容
UploadFile.prototype.readSlice = function () {
    var self = this;

    var start = self.currentChunkIndex * self.chunkSize;
    var end = (start + self.chunkSize >= self.file.size) ? self.file.size : (start + self.chunkSize);
    // 切割文件
    var sliceData = self.blobSlice.call(self.file, start, end);
    // 读取内容
    self.fileReader.readAsBinaryString(sliceData);
};


// 获取服务器的缓存文件的大小
UploadFile.prototype.getTmpFileSize = function (socket, filename) {
    return new Promise(function (resolve, reject) {
        socket.emit('get file size', {
            filename: filename
        });

        socket.on("file size", function (message) {
            resolve(message['size']);
        });

    });
};

// 向数据库发送文件
UploadFile.prototype.saveFileContent = function (socket) {
    var self = this;

    return new Promise(function (resolve, reject) {

        // 读取单片文件内容
        self.readSlice();
        // 上传文件到临时路径
        self.fileReader.onload = function(e){
            console.log("读取文件", self.currentChunkIndex + 1, "/", self.chunksNumber);
            // 每块计算md5值
            self.spark.appendBinary(e.target.result);

            console.log(e);
            // 增加块偏移量
            self.currentChunkIndex++;

            // 上传文件
            socket.emit('upload file', {
                content: e.target.result
            });

            socket.on("upload result", function (message) {
                // 判断是否上传成功
                if(message.code != 0) {
                    reject('上传文件失败');
                    return;
                }
                // 判断是否到文件结尾
                if(self.currentChunkIndex < self.chunksNumber) {
                    self.readSlice();
                } else {
                    resolve('传输完成');
                }
            });


        };
    });
};

// 上传文件内容
UploadFile.prototype.startUploader = function () {
    var self = this;

    // 创建socket客户端
    var socket = io.connect(this.url);

    socket.on("connect", function () {
        console.log('client connection');

        // 1.获取服务端缓存中同名文件的大小
        var tmpFileName = self.getTmpFileName(self.file);
        self.getTmpFileSize(socket, tmpFileName)
            .then(function (tmpFileSize) {
                // 定义开始传输的位置
                self.currentChunkIndex = Math.ceil(tmpFileSize / self.chunkSize);
                // 读取文件内容
                // 发送文件内容

                return self.saveFileContent(socket);
            })
            .then(function (result) {
                // 校验传输的md5
                console.log('finally result:', result);

            })
            .then(function (result) {
                // 移动文件到最终路径
            })
            .catch(function (error) {
                console.log('上传文件发生错误:', error);
            });

    });
    socket.on("error", function (error) {

    });

};
