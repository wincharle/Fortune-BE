var OrderModel = require('../models/order-model');
var PayInfoModel = require('../models/payInfo-model');
var productService = require('../service/product-service');
var cartService = require('../service/cart-service');
var shippingService = require('../service/shipping-service');
var config = require('../config');
var moment = require('moment');

class OrderService {
    constructor() {
        this.getOrderList = this.getOrderList.bind(this);
    }
    async selectByUsernameAndOrderNo(username, orderNo) {
        var result = await OrderModel.findOne().where('username').equals(username)
            .where('orderNo').equals(orderNo);
        return result;
    }
    async selectByOrderNo(orderNo) {
        var result = OrderModel.findOne().where('orderNo').equals(orderNo);
        return result;
    }
    async updateOrder(order) {
        var result = await OrderModel.where('orderNo').equals(order.orderNo).update(order);
        return result;
    }
    async insertPayInfo(payInfo) {
        var payInfo = new PayInfoModel(payInfo);
        var result = await payInfo.save();
        return result;
    }
    async insertOrder(order) {
        var order = new OrderModel(order);
        var result = await order.save();
        return result;
    }
    generateOrderNo() {
        return Date.now() + Math.round(Math.random() * 100);
    }
    async reduceProductStock(orderList) {
        for (var orderItem of orderList) {
            var product = await productService.getProductById(orderItem.productId);
            product.stock = product.stock - orderItem.quantity;
            await productService.updateProduct(product);
        }
    }
    // 根据cart中的数据，生成orderList中的数据
    async getCartOrderItem(cartList){
        var orderList = [];
        for (var cartItem of cartList) {
            var orderItem = {};
            var product = await productService.getProductById(cartItem.productId);

            // 判断产品是否在售
            if (product.status === false) {
                return { "status": 1, "msg": `产品${product.productName}不是在售状态` };
            }
            // 判断产品的库存
            if (cartItem.quantity > product.stock) {
                return { "status": 1, "msg": `产品${product.productName}库存不足` };
            }
            orderItem = {
                productId: product.id,
                productName: product.name,
                productImage: product.mainImage,
                currentUnitPrice: product.price,
                quantity: cartItem.quantity,
                totalPrice: product.price * cartItem.quantity
            }
            orderList.push(orderItem);
        }
        return orderList;
    }
    async cleanCart(cartList) {
        for (var cart of cartList) {
            await cartService.deleteByCartId(cart.id);
        }
    }
    async getOrderVo(order) {
        var orderVo = {};
        var shippingVo = {};
        orderVo.orderNo = order.orderNo;
        orderVo.payment = order.payment;
        orderVo.paymentType = order.paymentType;
        orderVo.paymentTypeDesc = order.paymentTypeDesc;
        orderVo.postage = order.postage;
        orderVo.status = order.status;
        orderVo.shippingId = order.shippingId;
        orderVo.paymentTime = order.paymentTime;
        orderVo.sendTime = order.sendTime ? moment(order.sendTime).format('YYYY-MM-DD HH:mm:ss') : null;
        orderVo.endTime = order.endTime ? moment(order.endTime).format('YYYY-MM-DD HH:mm:ss') : null;
        orderVo.createTime = order.createdAt ? moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss') : null;
        orderVo.closeTime = order.closeTime ? moment(order.closeTime).format('YYYY-MM-DD HH:mm:ss') : null;
        orderVo.imageHost = config.imageHost;
        orderVo.orderList = order.orderList;
        var shipping = await shippingService.selectShipping(order.username, order.shippingId);
        if (shipping) {
            orderVo.receiverName = shipping.receiverName;
            shippingVo.receiverName = shipping.receiverName;
            shippingVo.receiverPhone = shipping.receiverPhone;
            shippingVo.receiverMobile = shipping.receiverMobile;
            shippingVo.receiverProvince = shipping.receiverProvince;
            shippingVo.receiverCity = shipping.receiverCity;
            shippingVo.receiverDistrict = shipping.receiverDistrict;
            shippingVo.receiverAddress = shipping.receiverAddress;
            shippingVo.receiverZip = shipping.receiverZip;
            orderVo.shippingVo = shippingVo;
        }
        return orderVo;
    }
    async getOrderList(pageNum, pageSize, condition, orderBy) {
        var orderBy = orderBy || 'id';
        var condition = condition || {},
            total = await OrderModel.count(),
            list = await OrderModel.find(condition).sort(orderBy).skip((pageNum - 1) * pageSize).limit(pageSize),
            size = list.length,
            pages = Math.floor((total / pageSize)) + 1,
            firstPage = 1,
            lastPage = Math.floor((total / pageSize)) + 1,
            isFirstPage = (pageNum == firstPage) ? true : false,
            isLastPage = (pageNum == lastPage) ? true : false,
            hasPreviousPage = (isFirstPage == true) ? false : true,
            hasNextPage = (isLastPage == true) ? false : true;

        // list页不需要所有的数据，对数据进行选择处理
        var resultList = [];
        for (var item of list) {
            var result = await this.getOrderVo(item);
            resultList.push(result);
        }
        return {
            pageNum: pageNum,
            pageSize: pageSize,
            size: size,
            orderBy: null,
            total: total,
            pages: pages,
            list: resultList,
            firstPage: firstPage,
            lastPage: lastPage,
            isFirstPage: isFirstPage,
            isLastPage: isLastPage,
            hasNextPage: hasNextPage,
            hasPreviousPage: hasPreviousPage
        }
    }
}

module.exports = new OrderService();