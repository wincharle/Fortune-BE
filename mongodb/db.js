/*
 * @Author: wincharle 
 * @Date: 2018-11-05 10:33:03 
 * @Last Modified by: wincharle
 * @Last Modified time: 2018-11-08 15:59:32
 */
var mongoose = require('mongoose');
var config = require('../config');
var chalk = require('chalk');
var autoIncrement = require('mongoose-auto-increment');

mongoose.connect(config.mongodb);

var db = mongoose.connection;
autoIncrement.initialize(db);


db.on('error', (err) => {
    console.error(chalk.red('Error in Mongodb connection: ' + err));
    mongoose.disconnect();
});

db.once('open', () => {
    console.log(chalk.green('连接数据库成功'));
});

db.on('close', () => {
    console.log(chalk.red('数据库连接断开，重新连接数据库'));
    mongoose.connect(config.mongodb);
});

module.exports = db;