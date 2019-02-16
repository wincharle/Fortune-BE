/*
 * @Author: wincharle 
 * @Date: 2018-11-20 21:37:24 
 * @Last Modified by: wincharle
 * @Last Modified time: 2018-11-20 22:24:15
 */
var orderService = require('../service/order-service');

class OrderManage {
    constructor() {

    }
    async list(req, res, next) {
        var pageNum = parseInt(req.query.pageNum) || 1;
        var pageSize = parseInt(req.query.pageSize) || 10;

        var condition = {};
        var orderBy = '-createdAt';
        var result = await orderService.getOrderList(pageNum, pageSize, condition, orderBy);
        return res.json({ "status": 0, "data": result });
    }
    async detail(req, res, next) {
        var orderNo = req.query.orderNo;
        var order = await orderService.selectByOrderNo(orderNo);
        if (!order) {
            return res.json({ "status": 1, "msg": "订单不存在" });
        }
        var orderVo = await orderService.getOrderVo(order);
        return res.json({ "status": 0, "data": orderVo });
    }
    // 暂时是精确搜索，所以只有单个数据
    async serach(req, res, next) {
        var pageNum = parseInt(req.query.pageNum) || 1;
        var pageSize = parseInt(req.query.pageSize) || 10;
        var orderNo = req.query.orderNo;
        var order = await orderService.selectByOrderNo(orderNo);
        if (!order) {
            return res.json({ "status": 1, "msg": "订单不存在" });
        }
        var condition = { 'orderNo': orderNo };
        var orderBy = '-createdAt';
        var result = await orderService.getOrderList(pageNum, pageSize, condition, orderBy);
        return res.json({ "status": 0, "data": result });
    }
    async sendGoods(req, res, next) {
        console.log(1111);
        var orderNo = req.query.orderNo;
        var order = await orderService.selectByOrderNo(orderNo);
        if (!order) {
            return res.json({ "status": 1, "msg": "订单不存在" });
        }
        // 订单已付款，更新为已发货
        if (order.status === 20) {
            order.status = 30;
            order.sendTime = Date.now();
            await orderService.updateOrder(order);
            return res.json({ "status": 0, "msg": "发货成功" });
        } else {
            return res.json({ "status": 1, "msg": "未付款，无法发货" });
        }
    }
}

module.exports = new OrderManage();