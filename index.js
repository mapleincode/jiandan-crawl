var CronJob = require('cron').CronJob;
var crawl = require('./lib/crawl');
var down = require('./lib/down');
var config = require('./config');

var intervalTime = config.crawled.intervalTime;

new CronJob('*/30 * * * * *', function () {
    crawl.done();
}, null, true);

new CronJob('60 * * * * *', function () {
    down.done();
}, null, true);
