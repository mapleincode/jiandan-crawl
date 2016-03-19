var CronJob = require('cron').CronJob;
var crawl = require('./lib/crawl');
var down = require('./lib/down');

new CronJob('30 * * * * *', function () {
    crawl.done();
}, null, true);

new CronJob('60 * * * * *', function () {
    down.done();
}, null, true);