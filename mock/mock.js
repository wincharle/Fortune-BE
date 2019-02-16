/*
 * @Author: wincharle 
 * @Date: 2018-11-05 15:49:14 
 * @Last Modified by: wincharle
 * @Last Modified time: 2018-11-06 17:50:21
 */

//数据库里模拟一些数据
var db = require('../mongodb/db');
var mongoose = require('mongoose');

let myschema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true
        },
        expire: {
            type: Date,
            index: {expireAfterSeconds: 30},           
        }
    });
let MyModel = db.model('MyModel', myschema);

new MyModel({
    token: 'abc',
    expire: Date.now(),
}).save();
