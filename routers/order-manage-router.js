/*
 * @Author: wincharle 
 * @Date: 2018-11-20 21:34:45 
 * @Last Modified by: wincharle
 * @Last Modified time: 2018-11-20 22:20:25
 */
var express = require('express');
var orderManage = require('../controller/order-manage-controller');
var middleware = require('../middleware/middleware');
var router = express.Router();

router.get('/list.do', middleware.checkLogin, middleware.checkAdminUser, orderManage.list);
router.get('/detail.do', middleware.checkLogin, middleware.checkAdminUser, orderManage.detail);
router.get('/search.do', middleware.checkLogin, middleware.checkAdminUser, orderManage.serach);
router.get('/send_goods.do', middleware.checkLogin, middleware.checkAdminUser, orderManage.sendGoods);

module.exports = router;