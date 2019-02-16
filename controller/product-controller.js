var productService = require('../service/product-service');
var ProductModel = require('../models/product-model');
var CategoryModel = require('../models/category-model');
var categoryService = require('../service/category-service');
var util = require('../util/util');
var constant = require('../util/constant');
var STATUS = constant.STATUS;
var PRODUCTSTATUS = constant.PRODUCTSTATUS;

class Product {
    constructor() {

    }
    /**
     * 根据productId获取product详情
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async detail(req, res, next) {
        var productId = parseInt(req.query.productId);
        if (!productId) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": '参数错误' });
        }
        try {
            var product = await productService.getProductById(productId);
            if (product === null) {
                return res.json({ "status": STATUS.ERROR, "msg": '产品已经删除' });
            }
            if (product.status === PRODUCTSTATUS.UNSALE) {
                return res.json({ "status": STATUS.ERROR, "msg": '产品已经下架' });
            }
        } catch (err) {
            next(err);
        }
        var productVO = await productService.getProductDetailVO(product);
        return res.json({ "status": STATUS.SUCCESS, "data": productVO });
    }
    /**
     * 获取产品list,需要进行分页，pageNum默认是1，pageSize默认是10
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async list(req, res, next) {
        var keyword = req.query.keyword,
            orderBy = req.query.orderBy,
            pageNum = parseInt(req.query.pageNum) || 1,
            pageSize = parseInt(req.query.pageSize) || 10,
            categoryId = parseInt(req.query.categoryId),
            condition = {};

        if (keyword === undefined && categoryId === undefined) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": '参数错误' });
        }
        // 获得所有的后代分类
        if (categoryId !== undefined) {
            var result = await categoryService.getDescendantCategory([], categoryId);
            var categoryIdArr = result.map(item => { return item.id });
            categoryIdArr.push(categoryId)
        }
        // 根据传递的参数不同，组装查询条件
        if (categoryId !== undefined && keyword === undefined) {
            var category = await CategoryModel.findOne().where('id').equals(categoryId);
            if (category === null) {
                return res.json({ "status": STATUS.ERROR, "msg": '查无此分类' });
            }
            condition = { categoryId: { $in: categoryIdArr } }
        }
        if (categoryId === undefined && keyword !== undefined) {
            condition = { name: { $regex: new RegExp(`(.)*${keyword}(.)*`, 'i') } };
        }
        if (categoryId !== undefined && keyword !== undefined) {
            condition = {
                $and: [
                    { name: { $regex: new RegExp(`(.)*${keyword}(.)*`, 'i') } },
                    { categoryId: { $in: categoryIdArr } }
                ]
            };
        }
        // orderBy
        switch (orderBy) {
            case 'price_desc':
                orderBy = '-price';
                break;
            case 'price_asc':
                orderBy = 'price';
                break;
            default:
                orderBy = 'id';
                break;
        }
        try {
            var result = await util.pagination(pageNum, pageSize, ProductModel, condition, orderBy);
            result.list = result.list.map(item => {
                return productService.getProductListVO(item);
            });
            return res.json({ "status": STATUS.SUCCESS, "data": result });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new Product();