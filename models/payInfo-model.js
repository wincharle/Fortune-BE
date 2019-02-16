/*
 * @Author: wincharle 
 * @Date: 2018-11-15 21:28:37 
 * @Last Modified by: wincharle
 * @Last Modified time: 2018-11-18 23:10:01
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

// 支付信息表
var payInfoSchema = new mongoose.Schema({
    id: {type: Number, index: true},
    username: String,
    orderNo: Number,
    payPlatform: {type: Number, default: 1},        //支付平台：1-支付宝，2-微信
    platformNumber: String,     // 支付流水号
    plateformStatus: String,    // 支付状态
}, {timestamps: true});

payInfoSchema.plugin(autoIncrement.plugin, {model: 'PayInfo', field: 'id'});
var PayInfo = mongoose.model('PayInfo', payInfoSchema);

module.exports = PayInfo;