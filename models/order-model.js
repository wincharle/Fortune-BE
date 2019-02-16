/*
 * @Author: wincharle 
 * @Date: 2018-11-17 20:53:39 
 * @Last Modified by: wincharle
 * @Last Modified time: 2018-11-20 17:17:11
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

// 订单表
var orderSchema = new mongoose.Schema({
    id: {type: Number, index: true},
    orderNo: Number,
    username: String,
    orderList: [mongoose.Schema.Types.Mixed],    //productId, productName,currentUnitPrice,quanity,totalPrice
    shippingId: Number,
    payment: Number,                    // 支付金额
    paymentType: Number,                // 支付类型，1-在线支付
    paymentTypeDesc: {type: String, default: '在线支付'},
    postage: Number,                    // 运费
    status: Number,                     // 0-已取消，10-未支付，20-已付款，30-已发货，40-订单完成，50-订单关闭
    paymentTime: {type: Date, default: null},
    sendTime: {type: Date, default: null},
    endTime: {type: Date, default: null},
    closeTime: {type: Date, default: null},
}, {timestamps: true});

orderSchema.plugin(autoIncrement.plugin, {model: 'Order', field: 'id'});
var Order = mongoose.model('Order', orderSchema);

module.exports = Order;