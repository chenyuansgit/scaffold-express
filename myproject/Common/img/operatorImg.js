var images = require('images');
var fs = require('fs');

var operatorImg = {

    // 对图片进行缩放: toWidth, toHeight存在
    zoomImage: function (sourceUrl, destUrl, img, toWidth, toHeight, quality, fillColor) {

        return new Promise(function (resolve, reject) {
            var width = img.width();
            var height = img.height();
            var newWidth = 0;
            var newHeight = 0;


            var xscale = width / toWidth;
            var yscale = height / toHeight;

            if (yscale > xscale) {
                newWidth = Math.round(width * (1 / yscale));
                newHeight = Math.round(height * (1 / yscale));
            }
            else {
                newWidth = Math.round(width * (1 / xscale));
                newHeight = Math.round(height * (1 / xscale));
            }

            // 缩放图片
            img.size(newWidth, newHeight);
            img.save(destUrl, {
                quality: quality
            });
            resolve('');
        });
    },

    // 对图片进行裁剪
    clipImage: function (sourceUrl, destUrl, img, toWidth, toHeight, quality, fillColor, single) {


        return new Promise(function (resolve, reject) {

            // 图片实际的宽高
            var width = img.width();
            var height = img.height();

            // 计算比率
            var crop = 'x';
            var newWidth = 0;
            var newHeight = 0;

            var xscale = width / toWidth;
            var yscale = height / toHeight;
            if (yscale > xscale) {
                newWidth = Math.round(width * (1 / xscale));
                newHeight = Math.round(height * (1 / xscale));
                crop = 'y';
            } else {
                newWidth = Math.round(width * (1 / yscale));
                newHeight = Math.round(height * (1 / yscale));
                crop = 'x';
            }

            var x = 0;
            var y = 0;
            if (crop == "x") {
                x = (newWidth / 2) - (toWidth / 2);
                y = 0;
            } else {
                y = (newHeight / 2) - (toHeight / 2);
                x = 0;
            }

            if (single === true) { //如果是大高图，直接裁剪上半部分
                y = 0;
            }


            // 裁剪图片
            img.size(newWidth);
            var image2 = images(img, parseInt(x), parseInt(y), parseInt(toWidth), parseInt(toHeight));

            image2.save(destUrl, {
                quality: quality
            });
            image2 = null;
            resolve('');

        });
    },

    // 缩放图片后进行补白
    zoomImageFix: function (sourceUrl, destUrl, img, toWidth, toHeight, quality, fillColor) {

        return new Promise(function (resolve, reject) {
            var width = img.width();
            var height = img.height();
            var newWidth = 0;
            var newHeight = 0;
            var draw = 'x';

            var xscale = width / toWidth;
            var yscale = height / toHeight;

            if (yscale > xscale) {
                draw = 'x';
                newWidth = Math.round(width * (1 / yscale));
                newHeight = Math.round(height * (1 / yscale));
            }
            else {
                draw = 'y';
                newWidth = Math.round(width * (1 / xscale));
                newHeight = Math.round(height * (1 / xscale));
            }

            // 缩放图片
            img.size(newWidth, newHeight);
            // 背景图片
            var bgImage = images(toWidth, toHeight);
            bgImage.fill(fillColor[0], fillColor[1], fillColor[2], fillColor[3]);

            var x =  y = 0;  // 坐标点
            if (draw == "x") {
                if (toWidth - newWidth <= 0) {
                    x = 0;
                } else {
                    x = parseInt((toWidth - newWidth) / 2);
                }
                y = 0;
            } else {
                if (toHeight - newHeight <= 0) {
                    y = 0;
                } else {
                    y = parseInt((toHeight - newHeight) / 2);
                }
                x = 0;
            }

            bgImage.draw(img, x, y);

            //在(10,10)处绘制Logo
            bgImage.save(destUrl, {
                quality: quality
            });
            img = null;
            bgImage = null;

            resolve('');
        });
    },

    // 给图片添加水印
    watermarkImage: function (sourceUrl, destUrl, img, watermarkUrl, pointX, pointY, quality) {

        return new Promise(function (resolve, reject) {

            var watermarkImg = images(watermarkUrl);

            img.draw(watermarkImg, pointX, pointY);
            
            img.save(destUrl, {
                quality: quality
            });

            img = null;
            watermarkImg = null;
            resolve('');
        });
    },

};

module.exports = operatorImg;