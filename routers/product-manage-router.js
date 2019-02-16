var express = require('express');
var router = express.Router();
var productManage = require('../controller/product-manage-controller');
var middleware = require('../middleware/middleware');

router.get('/save.do', middleware.checkLogin, middleware.checkAdminUser, productManage.productSave);
router.get('/set_sale_status.do', middleware.checkLogin, middleware.checkAdminUser, productManage.setSaleStatus);
router.get('/detail.do', middleware.checkLogin, middleware.checkAdminUser, productManage.getDetail);
router.get('/list.do', middleware.checkLogin, middleware.checkAdminUser, productManage.getList);
router.get('/search.do', middleware.checkLogin, middleware.checkAdminUser, productManage.productSearch);
router.post('/upload.do', middleware.checkLogin, middleware.checkAdminUser, productManage.upload);
router.post('/richtext_img_upload.do', middleware.checkLogin, middleware.checkAdminUser, productManage.richtextImgUpload);


module.exports = router;