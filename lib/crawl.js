var CrawlModel = require('../models/jiandan_crawl');
var ImageModel = require('../models/jiandan_image');

var async = require('async');
var iconv = require('iconv-lite');
var moment = require('moment');
var request = require('request');
var zlib = require('zlib');


var cookie = '3303342409=69';
const BEGIN_NUMBER = 1500;

var url = 'http://jandan.net/ooxx/page-%d#comments';
var lastNumber;
var retryNumber;
var restartStatus = false; 

var increateImage = function(newP, oldP, count) {
    var c = [];
    for(var p of newP) {
        if (oldP.indexOf(p) === -1) {
            c.push(p);
        }
    }
    return  c;
};

var executePage = function(pageUrl, callback) {
    if (!pageUrl) return callback(new Error('page url 不存在'));
    console.log(pageUrl);
    // if (cookie) request.cookie(cookie);
    request.get({
        url: pageUrl,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, sdch', 
            'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Host': 'jandan.net',
            'Pragma': 'no-cache',
            'Cookie': cookie + '; _gat=1; Hm_lvt_fd93b7fb546adcfbcf80c4fc2b54da2c=1458105738,1458407788,1458407791,1458420053; Hm_lpvt_fd93b7fb546adcfbcf80c4fc2b54da2c=1458420118; _ga=GA1.2.1628318494.1457889888',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36'
        },
        gzip: true
    }, function(err, resp, body) {
        if (err) return callback(err);
        body = body.replace(/[ \r\n\t]/g, '');
        try {
            cookie = resp.headers['set-cookie'][0];
        }
        catch(e) {
            console.log(e);
        }
        try {
            var number = body.match(/\[[0-9]{4}\]/)[0].slice(1, 5);
            var array = body.match(/(查看原图).+?\<\/\p\>/g);
        }
        catch(e) {
            return callback(new Error('页面出了未知 BUG'));
        }
        
        
        if(!array || !array.length) return callback(new Error('非图片页'));
        var urls = array.map(function(url) { 
            var uri = '';
            try {
               if(/org_src/.test(url)) {
                   return url.match(/org_src=".+?"/)[0].replace(/"/g, '').replace('org_src=', '').replace(/cn\/\w+?\//g, 'cn/large/');
               }
               return url.match(/http.+?"/)[0].replace('"', '').replace(/cn\/\w+?\//g, 'cn/large/'); 
            }
            catch(e) {
                console.log(e);
                return null;
            }
             
        });
        urls = urls.filter(function(url) { return !!url });
        if (!urls.length) return callback(new Error('没有有效的 image url'));
        return callback(undefined, urls, parseInt(number));
    });
};

var getImageUrl = function(callback) {
    var number;
    var c;
    async.waterfall([
        function(callback) {
            CrawlModel.orderBy({ id: -1 }).findOne(function(err, crawl) {
                if(crawl && !restartStatus) {
                    restartStatus = true;
                    retryNumber = crawl.number;
                } // 用户如果重启之后 重新爬取最后一条
                callback(err, crawl);
            });
        },
        function(crawl, callback) {
            if (retryNumber) {
                number = retryNumber;
                var pageUrl = url.replace('%d', number);
                return CrawlModel.where({ number: number }).findOne(function(err, crawl) {
                    if(err) return callback(err);
                    if(!crawl) return callback(new Error('retry number 不存在! '));
                    c = crawl;
                    callback(undefined, pageUrl);
                });
            }
            if(!crawl) {
                number = BEGIN_NUMBER;
            }
            else {
                c = crawl;
                number = crawl.number + 1;
            }
            var pageUrl = url.replace('%d', number);
            process.nextTick(function(){
                callback(undefined, pageUrl);
            });
        },
        function(pageUrl, callback) {
            executePage(pageUrl, function(err, images, number) {
                if (err) return callback(err);
                retryNumber = undefined; // 以免拉取失败了啦啦啦~
                return callback(err, images, number);
            });
        },
        function(images, number, callback) {
            if (lastNumber && lastNumber !== number) {
                retryNumber = lastNumber;
                // (前提之前已经在重复更新, 否则影响正常爬取效率) 页面刷到新的一页后，上一页可能也刷了新的图
                // 所以需要设置 retryNumber 保证下次可以重新爬取原来的一次
            }
            if(c && number === c.number) {
                // 说明是在重复更新
                if (lastNumber <= number) {
                    // 如果 number < lastNumber  说明本身就已经是在 retry 了
                    lastNumber = number;
                }
                 
                var increates = increateImage(images, JSON.parse(c.images));
                if (increates.length === 0) return callback(new Error('页数为' + number + '但未有增长'));
                return callback(undefined, increates, images, number);
            }

            callback(undefined, images, images, number);
        },
        function(images, imagesAll, currentNumber, callback) {
            var list = [];
            for (var image of images) {
                list.push(ImageModel.build({
                    image: image,
                    status: 0,
                    retryTimes: 0,
                    createdAt: moment(),
                    updatedAt: moment(),
                    number: currentNumber
                }));
            }
            async.eachLimit(list, 1, function(i, callback) {
                i.save(function(err) {
                    callback(err);
                });
            }, function(err) {
                callback(err, imagesAll, currentNumber);
            });
        },
        function(images, currentNumber, callback) {
            if (currentNumber === number && c.number !== number) {
                var test = CrawlModel.build({
                    date: moment(),
                    number: number,
                    images: JSON.stringify(images),
                    createdAt: moment()
                });
                test.save(function(err) {
                    callback(err, images);
                });
            }
            else {
                c.updateByJson({
                    date: moment(),
                    images: JSON.stringify(images),
                    createdAt: moment()
                }, function(err) {
                    callback(err);
                });
            }
            
        }
    ], function(err, images) {
        callback(err, images);
    });
};

// getImageUrl(getImageUrl);

exports.done = function() {
    getImageUrl(function(err) {
        if (err) {
            console.log(err);
        }
    });
}