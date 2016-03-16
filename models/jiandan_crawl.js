var toshihiko = require('../toshihiko');
var CrawlModel = toshihiko.define('jiandan_crawl', [
	{ name: 'id', column: 'id', primaryKey: true, type: toshihiko.TYPE.Integer },
	{ name: 'date', column: 'date' ,type: toshihiko.TYPE.String },
	{ name: 'number', column: 'number', type: toshihiko.TYPE.Integer },
	{ name: 'images', column: 'images', type: toshihiko.TYPE.String },
	{ name: 'createdAt', column: 'created_at', type: toshihiko.TYPE.Datetime }
]);

module.exports = CrawlModel;