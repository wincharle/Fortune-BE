/*
 * @Author: wincharle 
 * @Date: 2018-11-16 13:15:51 
 * @Last Modified by: wincharle
 * @Last Modified time: 2018-11-16 13:21:21
 */
var log4js = require('log4js');
log4js.configure({
    appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
    categories: { default: { appenders: ['cheese'], level: 'error' } }
  });
   
var logger = log4js.getLogger('cheese');

module.exports = logger;