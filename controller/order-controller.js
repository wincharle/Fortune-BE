var AlipaySdk = require('alipay-sdk').default;
var config = require('../config');
var qr = require('qr-image');
var fs = require('fs');
var orderService = require('../service/order-service');
var cartService = require('../service/cart-service');
var constant = require('../util/constant');
var STATUS = constant.STATUS;

var alipaySdk = new AlipaySdk({
    appId: config.appId,
    privateKey: config.privateKey,
    alipayPublicKey: config.alipayPublicKey,
    gateway: config.open_api_domain
});
class Order {
    constructor() {
        this.create = this.create.bind(this);
    }
    /**
     * 支付
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async pay(req, res, next) {
        var username = req.session.user.username;
        var orderNo = req.query.orderNo;
        if(!orderNo){
            return res.json({"status": STATUS.PARAMERROR, "msg": "参数错误"});
        }
        orderNo = parseInt(orderNo);
        try {
            var order = await orderService.selectByUsernameAndOrderNo(username, orderNo);
            if (!order) {
                return res.json({ "status": STATUS.ERROR, "msg": "用户没有改订单" });
            }
            var orderItemList = order.orderList;
            var goodsDetail = [];
            orderItemList.forEach(item => {
                goodsDetail.push({
                    goodsId: item.productId,
                    goodsName: item.productName,
                    quantity: item.quantity,
                    price: item.currentUnitPrice
                });
            });

            var result = await alipaySdk.exec('alipay.trade.precreate', {
                notifyUrl: config.notifyUrl,
                bizContent: {
                    outTradeNo: order.orderNo + '',
                    subject: 'tongfu扫码支付，订单号：' + order.orderNo,
                    totalAmount: order.payment + '',
                    body: '订单' + order.orderNo + '购买商品共' + order.payment + '元',
                    goodsDetail: goodsDetail,
                }
            });
            if (result.msg === 'Success') {
                var qrImage = qr.image(result.qrCode, { type: 'png' });
                var qrName = 'qr-' + order.orderNo + '.png';
                qrImage.pipe(fs.createWriteStream('./public/qrcode/' + qrName));
                var qrUrl = config.qrHost + qrName;
                return res.json({ "status": STATUS.SUCCESS, "data": { "orderNo": order.orderNo, "qrUrl": qrUrl } });
            } else {
                return res.json({ "status": STATUS.ERROR, "msg": "支付宝生成订单失败" });
            }
        } catch (err) {
            next(err);
        }
    }
    /**
     * 处理支付宝的回调
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async alipayCallback(req, res, next) {
        var orderNo = req.fields.out_trade_no;
        var tradeNo = req.fields.trade_no;
        var tradeStatus = req.fields.trade_status;
        // 验证回调，并避免重复通知
        var isSuccess = alipaySdk.checkNotifySign(req.fields);
        if (isSuccess) {
            var order = await orderService.selectByOrderNo(orderNo);
            if (!order) {
                return res.json({ "status": STATUS.ERROR, "msg": "非本站订单，忽略" });
            }
            // 0-已取消，10-未支付，20-已付款，30-已发货，40-订单完成，50-订单关闭
            if (order.status >= 20) {
                return res.json({ "status": STATUS.ERROR, "msg": "支付宝重复调用" });
            }
            // WAIT_BUYER_PAY, TRADE_SUCCESS
            if (tradeStatus === 'TRADE_SUCCESS') {
                order.status = 20;
                order.paymentTime = req.fields.gmt_payment;
                await orderService.updateOrder(order);
            }
            var payInfo = {
                username: order.username,
                orderNo: order.orderNo,
                platformNumber: tradeNo,
                plateformStatus: tradeStatus
            }
            await orderService.insertPayInfo(payInfo);
            return res.send('success');
        } else {
            return res.json({ "status": STATUS.ERROR, "msg": "非法请求，验证不通过" });
        }
    }
    /**
     * 查询订单的状态
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async queryOrderPayStatus(req, res, next) {
        var username = req.session.user.username;
        var orderNo = req.query.orderNo;
        if(!orderNo){
            return res.json({"status": STATUS.PARAMERROR, "msg": "参数错误"});
        }
        orderNo = parseInt(orderNo);
        var order = await orderService.selectByUsernameAndOrderNo(username, orderNo);
        if (!order) {
            return res.json({ "status": STATUS.ERROR, "msg": "用户没有改订单" });
        }
        if (order.status >= 20) {
            return res.json({ "status": STATUS.SUCCESS, "data": true });
        } else {
            return res.json({ "status": STATUS.SUCCESS, "data": false });
        }
    }

    /**
     * 根据shippingId和username创建订单
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async create(req, res, next) {
        var username = req.session.user.username,
            shippingId = req.query.shippingId;
        if (!shippingId) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": "参数错误" });
        }
        shippingId = parseInt(shippingId);
        var cartList = await cartService.selectCheckedCartByUsername(username);
        if (cartList.length === 0) {
            return res.json({ "status": STATUS.ERROR, "msg": "购物车为空" });
        }
        // 根据cartList中的信息，获取orderList中所需的数据
        var orderList;
        var result = await orderService.getCartOrderItem(cartList);
        if (!Array.isArray(result)) {
            return res.json(result);
        } else {
            orderList = result;
        }
        var payment = 0;
        orderList.forEach(orderItem => {
            payment += orderItem.totalPrice;
        });

        // 生成订单
        var order = {
            orderNo: orderService.generateOrderNo(),
            status: 10,                             // 未支付状态
            postage: 0,
            paymentType: 1,                         // 在线支付
            payment: payment,
            username: username,
            shippingId: shippingId,
            orderList: orderList
        };
        try {
            var order = await orderService.insertOrder(order);
        } catch (err) {
            return res.json({ "status": STATUS.ERROR, "msg": "生成订单错误" });
        }
        // 减少产品库存和清空购物车
        try {
            await orderService.reduceProductStock(orderList);
            await orderService.cleanCart(cartList);
        } catch (err) {
            next(err);
        }
        var orderVo = await orderService.getOrderVo(order);
        return res.json({ "status": STATUS.SUCCESS, "data": orderVo });
    }
    /**
     * 根据orderNo取消订单
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async cancel(req, res, next) {
        var username = req.session.user.username,
            orderNo = req.query.orderNo;
        if(!orderNo){
            return res.json({"status": STATUS.PARAMERROR, "msg": "参数错误"});
        }
        orderNo = parseInt(orderNo);
        var order = await orderService.selectByUsernameAndOrderNo(username, orderNo);
        if (!order) {
            return res.json({ "status": STATUS.ERROR, "msg": "订单不存在" });
        }
        if (order.status != 10) {
            return res.json({ "status": STATUS.ERROR, "msg": "已经付款，无法取消订单" });
        }
        order.status = 0;
        var result = await orderService.updateOrder(order);
        if (result.n) {
            return res.json({ "status": STATUS.SUCCESS, "msg": "取消成功" });
        } else {
            return res.json({ "status": STATUS.ERROR, "msg": "取消失败" });
        }
    }
    async getOrderCartProduct(req, res, next) {
        var username = req.session.user.username;
        var cartList = await cartService.selectCheckedCartByUsername(username);
        if (cartList.length === 0) {
            return res.json({ "status": STATUS.ERROR, "msg": "购物车为空" });
        }

        var orderList;
        var result = await orderService.getCartOrderItem(cartList);
        if (!Array.isArray(result)) {
            return res.json(result);
        } else {
            orderList = result;
        }

        var payment = 0;
        orderList.forEach(orderItem => {
            payment += orderItem.totalPrice;
        });

        var orderProductVo = {
            payment: payment,
            orderList: orderList,
            imageHost: config.imageHost
        }
        return res.json({"status": STATUS.SUCCESS, "data": orderProductVo});
    }
    /**
     * 根据orderNo查看订单详情
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async detail(req, res, next){
        var username = req.session.user.username,
            orderNo = req.query.orderNo;
        if(!orderNo){
            return res.json({"status": STATUS.PARAMERROR, "msg": "参数错误"});
        }
        orderNo = parseInt(orderNo);
        var order = await orderService.selectByUsernameAndOrderNo(username, orderNo);
        if (!order) {
            return res.json({ "status": STATUS.ERROR, "msg": "订单不存在" });
        }
        var orderVo = await orderService.getOrderVo(order);
        return res.json({"status": STATUS.SUCCESS, "data": orderVo});
    }
    /**
     * 查看订单list
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async list(req, res, next){
        var username = req.session.user.username;
        var pageNum = parseInt(req.query.pageNum) || 1;
        var pageSize = parseInt(req.query.pageSize) || 10;

        // 根据用户名进行查询，并根据创建时间进行降序排列
        var condition = {'username': username};
        var orderBy = '-createdAt';
        var result = await orderService.getOrderList(pageNum, pageSize, condition, orderBy);
        return res.json({"status": 0,  "data": result});
    }
}

module.exports = new Order();