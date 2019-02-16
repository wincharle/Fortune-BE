var express = require('express');
var router = express.Router();
var cart = require('../controller/cart-controller');
var middleware = require('../middleware/middleware');

router.get('/add.do', middleware.checkLogin, cart.add);
router.get('/update.do', middleware.checkLogin, cart.update);
router.get('/delete.do', middleware.checkLogin, cart.delete);
router.get('/list.do', middleware.checkLogin, cart.list);
router.get('/select_all.do', middleware.checkLogin, cart.selectAll);
router.get('/un_select_all.do', middleware.checkLogin, cart.unSelectAll);
router.get('/select.do', middleware.checkLogin, cart.selectProduct);
router.get('/un_select.do', middleware.checkLogin, cart.unSelectProduct);
router.get('/get_cart_product_count.do', cart.getCartProductCount);

module.exports = router;


