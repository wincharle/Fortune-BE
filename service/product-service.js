var ProductModel = require('../models/product-model');
var config = require('../config');
var CategoryModel = require('../models/category-model');

class ProductService {
    constructor() {

    }
    /**
     * 保存商品
     * @param {ProductModel} product 
     */
    async saveProduct(product) {
        var product = new ProductModel(product);
        var result = await product.save();
        return result;
    }
    /**
     * 更新商品信息
     * @param {ProductModel} product 
     */
    async updateProduct(product) {
        var result = await ProductModel.where('id').equals(product.id).update(product);
        return result;
    }
    /**
     * 更改商品的销售状态
     * @param {number} productId 
     * @param {boolean} status 
     */
    async setSaleStatus(productId, status) {
        var result = await ProductModel.where('id').equals(productId).update({ status: status });
        return result;
    }
    /**
     * 根据productId获取product
     * @param {number} productId 
     */
    async getProductById(productId) {
        var result = await ProductModel.findOne().where('id').equals(productId);
        return result;
    }
    getProductListVO(product){
        var productVO = {};
        productVO.id = product.id;
        productVO.categoryId = product.categoryId;
        productVO.name = product.name;
        productVO.subtitle = product.title;
        productVO.mainImage = product.mainImage;
        productVO.status = product.status;
        productVO.price = product.price;
        return productVO;
    }
    async getProductDetailVO(product) {
        var productVO = {};
        productVO.id = product.id;
        productVO.categoryId = product.categoryId;
        productVO.name = product.name;
        productVO.subtitle = product.subtitle;
        productVO.mainImage = product.mainImage;
        productVO.subImages = product.subImages;
        productVO.detail = product.detail;
        productVO.price = product.price;
        productVO.stock = product.stock;
        productVO.status = product.status;
        productVO.imageHost = config.imageHost;
        productVO.createdAt = product.createdAt;
        productVO.updatedAt = product.updatedAt;

        // parentCategoryId
        var category = await CategoryModel.findOne().where('id').equals(product.categoryId);
        if (category) {
            productVO.parentCategoryId = category.parent_id;
        } else {
            productVO.parentCategoryId = 0;
        }
        return productVO;
    }
}

module.exports = new ProductService();