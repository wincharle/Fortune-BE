var express = require('express');
var router = express.Router();
var shipping = require('../controller/shipping-controller');
var middleware = require('../middleware/middleware');

router.get('/add.do', middleware.checkLogin, shipping.add);
router.get('/del.do', middleware.checkLogin, shipping.delete);
router.get('/update.do', middleware.checkLogin, shipping.update);
router.get('/select.do', middleware.checkLogin, shipping.select);
router.get('/list.do', middleware.checkLogin, shipping.list);

module.exports = router;