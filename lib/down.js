var ImageModel = require('../models/jiandan_image');
var config = require('../config');
var path = require('path');

var async = require('async');
var moment = require('moment');
var wmdl = require('wmdl').wmdl;

var save = config.crawled.save || './images';

var realPath = path.resolve(__dirname.slice(0, __dirname.length - 4), save);

console.log('下载保存位置为: ' + realPath);

var lockStatus;

var downAndSaveStatus = function(image, callback) {
    wmdl(image.image, {
        defaultLocation: realPath, 
        timeout: config.crawled.timeout,
        retryTime: config.crawled.retryTimes
    }, function(err) {
        if(err) {
            image.errorMessage = err.message;
            image.retryTimes ++;
            if (image.retryTimes === 5) {
                image.status = -1;
            }
        }
        else {
            image.status = 1;
        }
        image.updatedAt = moment();
        image.save(function(err) {
            callback(err);
        });
    });
}

var getImage = function(callback) {
    if (lockStatus && parseInt(new Date().getTime() - lockStatus) < 10000) {
        return callback('已有执行的进程');
    }
    async.waterfall([
        function(callback) {
            ImageModel.where({
                status: 0
            }).orderBy({ updatedAt: 1 }).limit([0, 30]).find(function(err, list) {
                if(!list || !list.length) return callback(new Error('未存在未下载的 url '));
                callback(err, list);
            });
        },
        function(list, callback) {
            async.eachLimit(list, 1, function(image, callback) {
                lockStatus = new Date().getTime();
                downAndSaveStatus(image, function(err) {
                    if (err) {
                        console.log('下载url: ' + image.image + '; error: ' +  err.message);
                    }
                    callback();
                });
            }, function() {
                callback();
            });
        }
    ], callback);

};


exports.done = function() {
    getImage(function() {});
};