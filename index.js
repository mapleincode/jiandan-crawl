var CronJob = require('cron').CronJob;
var crawl = require('./lib/crawl');

new CronJob('30 * * * * *', function () {
    crawl.done();
}, null, true);
