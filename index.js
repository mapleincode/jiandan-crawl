var CronJob = require('cron').CronJob;
var crawl = require('./lib/crawl');

new CronJob('*/5 * * * * *', function () {
    crawl.done();
}, null, true);
