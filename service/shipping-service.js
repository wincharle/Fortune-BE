var ShippingMolel = require('../models/shipping-model');

class ShippingService {
    constructor() {

    }
    /**
     * 新增收货地址
     * @param {object} shipping 
     */
    async addShipping(shipping) {
        var shipping = new ShippingMolel(shipping);
        var result = await shipping.save();
        return result;
    }
    /**
     * 删除收货地址
     * @param {string} username 
     * @param {number} shippingId 
     */
    async deleteShipping(username, shippingId) {
        var result = await ShippingMolel.findOneAndDelete().where('id').equals(shippingId)
            .where('username').equals(username);
        return result;
    }
    /**
     * 更新收货地址
     * @param {string} username 
     * @param {number} id 
     * @param {object} shipping 
     */
    async updateShipping(username, id, shipping) {
        var result = await ShippingMolel.where('id').equals(id).where('username').equals(username)
            .update(shipping);
        return result;
    }
    /**
     * 选择收货地址
     * @param {string} username 
     * @param {object} shippingId 
     */
    async selectShipping(username, shippingId) {
        var result = await ShippingMolel.findOne().where('username').equals(username)
            .where('id').equals(shippingId);
        return result;
    }
}

module.exports = new ShippingService();