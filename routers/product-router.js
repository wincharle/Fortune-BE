var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var product = require('../controller/product-controller');

router.get('/detail.do', product.detail);
router.get('/list.do', product.list);

module.exports = router;