jQuery(function($){
    // 保存选中的文件信息
    var selectFiles = {};

    // 监听事件:选中文件
    $('#choose-file').on('change', function() {
        // 清空以前的上传记录
        selectFiles = {};

        var files = document.getElementById('choose-file').files;

        // 保存选中文件
        $.each(files,function() {
            // 保存单个文件信息到变量
            selectFiles[this.name] = {
                currentFile: this,
                currentFileReader: null
            };
        });
    });

    // 上传文件
    $('#uploader').on('click', function() {
        // 依次上传文件
        for(var key in selectFiles){
            var file = selectFiles[key].currentFile;
            console.log('file:', file);
             // 断点上传文件
            var uploadFile = new UploadFile(file);
            uploadFile.startUploader();
        }
        // 清空上传记录
        //selectFiles = {};
    });

});