# jiandan-crawl

>[煎蛋网-妹纸专栏](https://jandan.net/ooxx)图片爬取

## 使用`MySQL`的原因
1. 觉得写文件存储好麻烦哦好麻烦哦。
2. 脚本可以长期运行(我是跑在树莓派上的啊哈哈哈哈哈哈)。

## 使用方法

* 在数据库中导入`mysql.sql`文件。
* 修改`config.js`( 参照`config.js.default` )添加`MySQL`先关配置。
* `cnpm install -d`
* `node index.js`

## 爬取频率调整

* 修改`index.js`里面的设置。
* 如果觉得用`node-crontab`不能接口, 也可以修改`crontab -e`来添加系统调用的配置（包括脚本爬取和文件下载两个脚本）。

----------
感觉没人会去用系列_(:з」∠)_ by maple
