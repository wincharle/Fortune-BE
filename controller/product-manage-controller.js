var config = require('../config');
var productService = require('../service/product-service');
var ProductModel = require('../models/product-model');
var util = require('../util/util');
var constant = require('../util/constant');
var STATUS = constant.STATUS;
var fs = require('fs');

class ProductManage {
    constructor() {
        this.productSave = this.productSave.bind(this);
        this.setSaleStatus = this.setSaleStatus.bind(this);
        this.getDetail = this.getDetail.bind(this);
        this.getList = this.getList.bind(this);
    }
    /**
     * 传递id，则是更新产品信息；没有传递id，则是新建产品
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async productSave(req, res, next) {
        var { categoryId, name, subtitle, subImages, detail, price, stock, status, id } = req.query;
        var product = {};
        id && (product.id = parseInt(id));
        categoryId && (product.categoryId = parseInt(categoryId));
        name && (product.name = name);
        subtitle && (product.subtitle = subtitle);
        subImages && (product.subImages = subImages.split(','));
        detail && (product.detail = detail);
        price && (product.price = price);
        stock && (product.stock = parseInt(stock));
        status && (product.status = status);

        if (product.subImages) {
            var subImageArray = product.subImages;
            if (subImageArray.length > 0) {
                product.mainImage = subImageArray[0];
            }
        }
        // 更新产品
        if (product.id !== undefined) {
            try {
                var result = await productService.updateProduct(product);
                if (result.n > 0) {
                    return res.json({ "status": STATUS.SUCCESS, "msg": '更新产品成功' });
                } else {
                    return res.json({ "status": STATUS.ERROR, "msg": '更新产品失败' });
                }
            } catch (err) {
                next(err);
            }
        }
        // 新增产品
        else {
            try {
                await productService.saveProduct(product);
                return res.json({ "status": STATUS.SUCCESS, "msg": '新增产品成功' });
            } catch (err) {
                return res.json({ "status": STATUS.ERROR, "msg": '新增产品失败' });
            }
        }
    }

    /**
     * 更新产品的销售状态
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async setSaleStatus(req, res, next) {
        var { productId, status } = req.query;
        // 更新产品的状态
        if (productId === undefined || status === undefined) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": '参数错误' });
        }
        try {
            var result = await productService.setSaleStatus(productId, status);
            if (result.n > 0) {
                return res.json({ "status": STATUS.SUCCESS, "msg": '修改产品销售状态成功' });
            } else {
                return res.json({ "status": STATUS.ERROR, "msg": '修改产品销售状态失败' });
            }
        } catch (err) {
            next(err);
        }
    }
    /**
     * 获取产品详情
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getDetail(req, res, next) {
        var productId = req.query.productId;
        // 获取项品信息
        if (productId === undefined) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": '参数错误' });
        }
        try {
            var product = await productService.getProductById(productId);
            if (product === null) {
                return res.json({ "status": STATUS.ERROR, "msg": '产品已经下架或者删除' });
            }
        } catch (err) {
            next(err);
        }
        // 从数据库中获取的数据并不是实际需要的，需要进行一层封装
        var result = await productService.getProductDetailVO(product);
        return res.json({ "status": STATUS.SUCCESS, "data": result });
    }

    /**
     * 获得所有产品列表
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getList(req, res, next) {
        var pageNum = parseInt(req.query.pageNum) || 1,
            pageSize = parseInt(req.query.pageSize) || 10;
        try {
            var result = await util.pagination(pageNum, pageSize, ProductModel);
            result.list = result.list.map(item => {
                return productService.getProductListVO(item);
            });
            return res.json({ "status": STATUS.SUCCESS, "data": result });
        } catch (err) {
            next(err);
        }

    }

    /**
     * 根据productName或者productId搜索产品
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async productSearch(req, res, next) {
        var { productName, productId } = req.query,
            pageNum = Number(req.query.pageNum) || 1,
            pageSize = Number(req.query.pageSize) || 10;
        // 查询条件
        var condition = {
            $or: [
                { name: { $regex: new RegExp(`(.)*${productName}(.)*`, 'i') } },
                { id: productId }
            ]
        };
        try {
            var result = await util.pagination(pageNum, pageSize, ProductModel, condition);
            result.list = result.list.map(item => {
                return productService.getProductListVO(item);
            });
            return res.json({ "status": STATUS.SUCCESS, "data": result });
        } catch (err) {
            next(err);
        }
    }
    /**
     * 图片上传
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    upload(req, res, next) {
        var files = req.files;
        var file = files[Object.keys(files)[0]];
        var filenameNew = file.path.substring(file.path.lastIndexOf('\\') + 1);
        fs.rename(file.path, config.images + '/' + filenameNew, (err) => {
            if (err) {
                next(err);
            }
        });
        return res.json({
            "status": STATUS.SUCCESS,
            "data": {
                uri: filenameNew,
                url: config.imageHost + '/' + filenameNew
            }
        });
    }
    /**
     * 富文本图片上传
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    richtextImgUpload(req, res, next) {
        var files = req.files;
        var file = files[Object.keys(files)[0]];
        var filenameNew = file.path.substring(file.path.lastIndexOf('\\') + 1);
        fs.rename(file.path, config.images + '/' + filenameNew, (err) => {
            if (err) {
                throw new Error(err);
            }
        });
        res.header('Access-Control-Allow-Headers', 'X-File-Name');
        return res.json({
            "success": true,
            "msg": '上传成功',
            "file_path": config.imageHost + '/' + filenameNew
        });
    }
}

module.exports = new ProductManage();