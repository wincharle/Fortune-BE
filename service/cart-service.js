var CartModel = require('../models/cart-model');
var ProductModel = require('../models/product-model');
var config = require('../config');

class CartService{
    constructor(){
        this.getCartVo = this.getCartVo.bind(this);
    }
    /**
     * 根据username和producId选择购物车
     * @param {string} username 
     * @param {number} productId 
     */
    async selectCartByUsernameProductId(username, productId){
        var result = await CartModel.findOne().where('username').equals(username)
            .where('productId').equals(productId);
        return result;
    }
    /**
     * 新建一个购物车
     * @param {object} cart 
     */
    async insert(cart){
        var cart = new CartModel(cart);
        var result = await cart.save();
        return result;
    }
    /**
     * 更新购物车中的信息
     * @param {string} username 
     * @param {object} updateContent 
     */
    async update(username, updateContent){
        var result = await CartModel.where('username').equals(username).update(updateContent);
        return result;
    }
    /**
     * 根据用户名选择购物车
     * @param {string} username 
     */
    async selectCartByUsername(username){
        var result = CartModel.find().where('username').equals(username);
        return result;
    }
    /**
     * 根据购物车中的productId，获取product相关的信息。
     * 注意购物车中的quanity和product中的stock
     * @param {object} cart 
     */
    async getCartProductVo(cart) {
        var product = await ProductModel.findOne().where('id').equals(cart.productId);   
        var buyLimitCount = 0;
        var limitQuantity = '';
        if (product.stock >= cart.quantity) {
            buyLimitCount = cart.quantity;
            limitQuantity = 'LIMIT_NUM_SUCCESS';
        } else {
            buyLimitCount = product.stock;
            limitQuantity = 'LIMIT_NUM_FAIL';
            await CartModel.where('username').equals(cart.username).where('productId').equals(cart.productId).update({"quantity": product.stock});
        }
    
        return {
            id: cart.id,
            username: cart.username,
            productId: cart.productId,
            quantity: buyLimitCount,
            productName: product.name,
            productSubtitle: product.subtitle,
            productMainImage: product.mainImage,
            productPrice: product.price,
            productStatus: product.status,
            productTotalPrice: buyLimitCount * product.price,
            productStock: product.stock,
            productChecked: cart.checked,
            limitQuantity: limitQuantity
        }
    }
    /**
     * 根据username获取所有的购物车信息（包括购物车中产品的信息）
     * @param {string} username 
     */
    async getCartVo(username) {
        var carts = await CartModel.find().where('username').equals(username);
        var cartProductVoList = [];
        var allChecked = true;
        var cartTotalPrice = 0;
        for(var cart of carts){
            var cartProductVo = await this.getCartProductVo(cart);
            cartProductVoList.push(cartProductVo);
    
            if(cart.checked === true){
                cartTotalPrice += cartProductVo.productTotalPrice;
            }
            allChecked = allChecked && cart.checked;
        }
        return {
            cartTotalPrice: cartTotalPrice,
            cartProductVoList: cartProductVoList,
            allChecked: allChecked,
            imageHost: config.imageHost
        }
    }
    /**
     * 根据username和productId删除购物车
     * @param {string} username 
     * @param {array} productIdAttr 
     */
    async delteByUsernameProductIds(username, productIdAttr){
        for(var item of productIdAttr){
            await CartModel.findOneAndDelete().where('username').equals(username)
                .where('productId').equals(item);
        }
    }
    /**
     * 全选或者全不选
     * @param {string} username 
     * @param {boolean} checked 
     */
    async selectOrUnSelectAll(username, checked){
        var result = await CartModel.where('username').equals(username).updateMany({checked: checked});
        return result;
    }
    /**
     * 根据username和productId选择一个产品或者不选择一个产品
     * @param {string} username 
     * @param {boolean} checked 
     * @param {number} productId 
     */
    async selectOrUnSelectProduct(username, checked, productId){
        var result = await CartModel.where('username').equals(username).where('productId').equals(productId)
            .updateMany({checked: checked});
    }
    /**
     * 根据username获取购物车中的产品数量
     * @param {string} username 
     */
    async selectCartProductCount(username){
        var result = await CartModel.find().where('username').equals(username);
        var sum = 0;
        for(var item of result){
            sum += item.quantity;
        }
        return sum;
    }
    /**
     * 根据username选择购物车中的checked的购物车
     * @param {string} username 
     */
    async selectCheckedCartByUsername(username){
        var result = await CartModel.find().where('username').equals(username)
            .where('checked').equals(true);
        return result;
    }
    /**
     * 根据id删除购物车
     * @param {number} cartId 
     */
    async deleteByCartId(cartId){
        var result = await CartModel.findOneAndDelete().where('id').equals(cartId);
        return result;
    }
}

module.exports = new CartService();