var shippingService = require('../service/shipping-service');
var util = require('../util/util');
var ShippingModel = require('../models/shipping-model');
var constant = require('../util/constant');
var STATUS = constant.STATUS;

class Shipping {
    constructor() {

    }
    /**
     * 新增收货地址
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async add(req, res, next) {
        var username = req.session.user.username;
        var { receiverName, receiverPhone, receiverProvince, receiverCity, receiverAddress, receiverZip } = req.query;
        if (!receiverName || !receiverPhone  || !receiverProvince || !receiverCity || !receiverAddress) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": "参数错误" });
        }
        var shipping = {
            username: username,
            receiverName: receiverName,
            receiverPhone: receiverPhone,
            receiverProvince: receiverProvince,
            receiverCity: receiverCity,
            receiverAddress: receiverAddress,
            receiverZip: receiverZip,
        }
        
        try {
            var result = await shippingService.addShipping(shipping);
            return res.json({
                "status": STATUS.SUCCESS,
                "msg": "新建地址成功",
                "data": {
                    shippingId: result.id
                }
            });
        } catch (err) {
            return res.json({ "status": STATUS.ERROR, "msg": "新建地址失败" });
        }
    }
    /**
     * 删除收货地址
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async delete(req, res, next) {
        var username = req.session.user.username;
        var shippingId = req.query.shippingId;

        if (!shippingId) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": "参数错误" });
        }
        try {
            var result = await shippingService.deleteShipping(username, shippingId);
            if (result) {
                return res.json({ "status": STATUS.SUCCESS, "msg": "删除地址成功" });
            }
            return res.json({ "status": STATUS.ERROR, "msg": "删除地址失败" });
        } catch (err) {
            next(err);
        }

    }
    /**
     * 更新收货地址
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async update(req, res, next) {
        var username = req.session.user.username;
        var { id, receiverName, receiverPhone, receiverMobile, receiverProvince, receiverCity, receiverDistrict, receiverAddress, receiverZip } = req.query;
        if (!id) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": "参数错误" });
        }
        var shipping = {};
        receiverName && (shipping.receiverName = receiverName);
        receiverPhone && (shipping.receiverPhone = receiverPhone);
        receiverMobile && (shipping.receiverMobile = receiverMobile);
        receiverProvince && (shipping.receiverProvince = receiverProvince);
        receiverCity && (shipping.receiverCity = receiverCity);
        receiverDistrict && (shipping.receiverDistrict = receiverDistrict);
        receiverAddress && (shipping.receiverAddress = receiverAddress);
        receiverZip && (shipping.receiverZip = receiverZip);
        try {
            var result = await shippingService.updateShipping(username, id, shipping);
        } catch (err) {
            next(err);
        }

        if (result.n) {
            return res.json({ "status": STATUS.SUCCESS, "msg": "更新地址成功" });
        }
        return res.json({ "status": STATUS.ERROR, "msg": "更新地址失败" });
    }
    /**
     * 查询收货地址
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async select(req, res, next) {
        var username = req.session.user.username;
        var shippingId = req.query.shippingId;

        if (!shippingId) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": "参数错误" });
        }

        try {
            var result = await shippingService.selectShipping(username, shippingId);
            if (result) {
                return res.json({ "status": STATUS.SUCCESS, "data": result });
            }
            return res.json({ "status": STATUS.ERROR, "msg": "无法查询到该地址" });
        } catch (err) {
            next(err);
        }
    }
    /**
     * 收货地址列表，需要分页
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async list(req, res, next) {
        var pageNum = (req.query.pageNum - 0) || 1;
        var pageSize = (req.query.pageSize - 0) || 10;
        var username = req.session.user.username;

        var condition = {
            username: username
        }

        var result = await util.pagination(pageNum, pageSize, ShippingModel, condition);
        return res.json({ "status": STATUS.SUCCESS, "data": result });
    }
}


module.exports = new Shipping();