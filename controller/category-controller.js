var categoryService = require('../service/category-service');
var STATUS = require('../util/constant').STATUS;

class Caterory {
    constructor() {
    }
    /**
     * 添加分类，需要传递父分类的id和分类名字
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {Function} next 
     */
    async addCategory(req, res, next) {
        var categoryName = req.query.categoryName,
            parentId = parseInt(req.query.parentId) || 0;

        if (!categoryName) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": '添加品类参数错误' });
        }
        try {
            var result = await categoryService.addCategory(categoryName, parentId);
            if (result) {
                return res.json({ "status": STATUS.SUCCESS, "msg": '添加品类成功' });
            } else {
                return res.json({ "status": STATUS.ERROR, "msg": '添加品类失败' });
            }
        } catch (err) {
            next(err);
        }
    }
    /**
     * 根据品类categoryId修改categoryName
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async setCategoryName(req, res, next) {
        var categoryName = req.query.categoryName,
            categoryId = pareInt(req.query.categoryId);

        if (!categoryName || !categoryId) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": '更新品类参数错误' });
        }
        try {
            var result = await categoryService.updateCategoryName(categoryId, categoryName);
            if (result.n) {
                return res.json({ "status": STATUS.SUCCESS, "msg": '更新品类名字成功' });
            } else {
                return res.json({ "status": STATUS.ERROR, "msg": '更新品类名字失败' });
            }
        } catch (err) {
            next(err);
        }

    }
    /**
     * 根据categoryId获取子分类
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getCategory(req, res, next) {
        var categoryId = parseInt(req.query.categoryId) || 0;
        try{
            var result = await categoryService.getChildCategory(categoryId);
            if(result.length === 0){
                return res.json({"status": STATUS.ERROR, "msg": "没有子分类"});
            }
            return res.json({ "status": STATUS.SUCCESS, "data": result });
        }catch(err){
            next(err);
        }

    }
    /**
     * 获得所有的后代分类
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async getDeepCategory(req, res, next) {
        var categoryId = parseInt(req.query.categoryId) || 0;

        try{
            var result = await categoryService.getDescendantCategory([], categoryId);
        }catch(err){
            next(err);
        }      
        var data = [categoryId,];
        for (var item of result) {
            data.push(item.id);
        }
        return res.json({ "status": STATUS.SUCCESS, "data": data });
    }
}


module.exports = new Caterory();