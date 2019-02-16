var express = require('express');
var router = express.Router();
var category = require('../controller/category-controller');
var middleware = require('../middleware/middleware');

router.get('/add-category.do', middleware.checkLogin, middleware.checkAdminUser, category.addCategory);
router.get('/set_category_name.do', middleware.checkLogin, middleware.checkAdminUser, category.setCategoryName);
router.get('/get_category.do', middleware.checkLogin, middleware.checkAdminUser, category.getCategory);
router.get('/get_deep_category.do', middleware.checkLogin, middleware.checkAdminUser, category.getDeepCategory);




module.exports = router;