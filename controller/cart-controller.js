var cartService = require('../service/cart-service');
var constant = require('../util/constant');
var STATUS = constant.STATUS;

class Cart {
    constructor() {

    }
    /**
     * 添加购物车,根据username和productId查询是否已经有了改购物车，如果已经有了改购物车，则count相加
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async add(req, res, next) {
        var username = req.session.user.username;
        var productId = req.query.productId;
        var count = req.query.count;

        if (productId == undefined || count == undefined) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": "参数错误" });
        }

        productId = productId - 0;
        count = count - 0;
        try {
            var cart = await cartService.selectCartByUsernameProductId(username, productId);
            if (cart === null) {
                result = await cartService.insert({ username: username, productId: productId, quantity: count, checked: true });
            }
            else {
                count = cart.quantity + count;
                await cartService.update(username, { "quantity": count });
            }
        } catch (err) {
            next(err);
        }
        try {
            var result = await cartService.getCartVo(username);
            return res.json({ "status": STATUS.SUCCESS, data: result });
        } catch (err) {
            next(err);
        }
    }
    /**
     * 更新购物车
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async update(req, res, next) {
        var username = req.session.user.username;
        var productId = req.query.productId;
        var count = req.query.count;

        if (productId == undefined || count == undefined) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": "参数错误" });
        }

        productId = productId - 0;
        count = count - 0;

        try {
            var cart = await cartService.selectCartByUsernameProductId(username, productId);
            if (cart != null) {
                await cartService.update(username, { "quantity": count });
            }
        } catch (err) {
            next(err);
        }
        var result = await cartService.getCartVo(username);
        return res.json({ "status": STATUS.SUCCESS, data: result });
    }
    /**
     * 删除购物车中的某些产品
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async delete(req, res, next) {
        var username = req.session.user.username;
        var productIds = req.query.productIds;
        if (productIds == undefined) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": "参数错误" });
        }
        var productIdArr = productIds.split(',');
        try {
            await cartService.delteByUsernameProductIds(username, productIdArr);
        } catch (err) {
            next(err);
        }

        var result = await cartService.getCartVo(username);
        return res.json({ "status": STATUS.SUCCESS, data: result });
    }
    /**
     * 根据用户名获得购物车列表
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async list(req, res, next) {
        var username = req.session.user.username;
        var result = await cartService.getCartVo(username);
        return res.json({ "status": STATUS.SUCCESS, data: result });
    }
    /**
     * 全选
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async selectAll(req, res, next) {
        var username = req.session.user.username;
        try {
            await cartService.selectOrUnSelectAll(username, true);
        } catch (err) {
            next(err);
        }
        var result = await cartService.getCartVo(username);
        return res.json({ "status": 0, data: result });
    }
    /**
     * 全不选
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async unSelectAll(req, res, next) {
        var username = req.session.user.username;
        try {
            await cartService.selectOrUnSelectAll(username, false);
        } catch (err) {
            next(err);
        }
        var result = await cartService.getCartVo(username);
        return res.json({ "status": STATUS.SUCCESS, data: result });
    }
    /**
     * 选择一个产品
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async selectProduct(req, res, next) {
        var username = req.session.user.username,
            productId = req.query.productId;
        if (!productId) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": "参数错误" });
        }
        productId = parseInt(productId);
        try {
            await cartService.selectOrUnSelectProduct(username, true, productId);
        } catch (err) {
            next(err);
        }
        var result = await cartService.getCartVo(username);
        return res.json({ "status": 0, data: result });
    }
    /**
     * 不选择一个产品
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async unSelectProduct(req, res, next) {
        var username = req.session.user.username,
            productId = req.query.productId;
        if (!productId) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": "参数错误" });
        }
        productId = parseInt(productId);
        try {
            await cartService.selectOrUnSelectProduct(username, false, productId);
        } catch (err) {
            next(err);
        }
        var result = await cartService.getCartVo(username);
        return res.json({ "status": 0, data: result });
    }
    /**
     * 购物车的数量
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getCartProductCount(req, res, next) {
        if (!req.session.user) {
            return res.json({ "status": STATUS.SUCCESS, "data": 0 });
        }
        var username = req.session.user.username;
        try{
            var count = await cartService.selectCartProductCount(username);
        }catch(err){
            next(err);
        }       
        return res.json({ "status": STATUS.SUCCESS, "data": count });
    }
}

module.exports = new Cart();