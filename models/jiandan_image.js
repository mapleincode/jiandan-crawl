var toshihiko = require('../toshihiko');
var ImageModel = toshihiko.define('jiandan_image', [
    { name: 'id', column: 'id', primaryKey: true, type: toshihiko.TYPE.Integer },
    { name: 'image', column: 'image' ,type: toshihiko.TYPE.String},
    { name: 'errorMessage', column: 'error_message' ,type: toshihiko.TYPE.String},
    { name: 'status', column: 'status', type: toshihiko.TYPE.Integer, defaultValue: 0  },
    { name: 'retryTimes', column: 'retry_times', type: toshihiko.TYPE.Integer, defaultValue: 0 },
    { name: 'createdAt', column: 'created_at', type: toshihiko.TYPE.Datetime },
    { name: 'updatedAt', column: 'updated_at', type: toshihiko.TYPE.Datetime },
    { name: 'number', column: 'number', type: toshihiko.TYPE.Integer }
]);

// var test = ImageModel.build({
//     image: '2016-03-17',
//     status: 0,
//     images: '3',
//     retryTimes: 0,
//     createdAt: new Date(),
//     updatedAt: new Date()
// });

// test.save(console.log);

module.exports = ImageModel;