/*
 * @Author: wincharle 
 * @Date: 2018-11-17 21:02:44 
 * @Last Modified by: wincharle
 * @Last Modified time: 2018-11-20 21:14:01
 */
var order = require('../controller/order-controller');
var express = require('express');
var middleware = require('../middleware/middleware');
var router = express.Router();


router.get('/pay.do', middleware.checkLogin, order.pay);
router.post('/alipay_callback.do', order.alipayCallback);
router.get('/query_order_pay_status.do', middleware.checkLogin, order.queryOrderPayStatus);
router.get('/create.do', middleware.checkLogin, order.create);
router.get('/cancel.do', middleware.checkLogin, order.cancel);
router.get('/get_order_cart_product.do', middleware.checkLogin, order.getOrderCartProduct);
router.get('/detail.do', middleware.checkLogin, order.detail);
router.get('/list.do', middleware.checkLogin, order.list);


module.exports = router;