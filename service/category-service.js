var CategoryModel = require('../models/category-model');

class CategoryService{
    constructor(){
        this.getDescendantCategory = this.getDescendantCategory.bind(this);
    }
    /**
     * 根据categoryName和parentId创建分类
     * @param {string} categoryName 
     * @param {number} parentId 
     */
    async addCategory(categoryName, parentId){
        var category = new CategoryModel({
            parent_id: parentId,
            name: categoryName,
            status: true,
        });
        var result = await category.save();
        return result;
    }
    /**
     * 根据categoryId修改categoryName
     * @param {number} categoryId 
     * @param {string} categoryName 
     */
    async updateCategoryName(categoryId, categoryName){
        var result = await CategoryModel.where('id').equals(categoryId).update({ 'name': categoryName });
        return result;
    }
    /**
     * 根据categoryId获取子分类
     * @param {number} categoryId 
     */
    async getChildCategory(categoryId){
        var result = await CategoryModel.find().where('parent_id').equals(categoryId);
        return result;
    }
    /**
     * 根据categoryId获取所有的后代分类
     * @param {array} categoryResult 
     * @param {number} categoryId 
     */
    async getDescendantCategory(categoryResult, categoryId) {
        var category = await CategoryModel.find().where('parent_id').equals(categoryId);

        if (category.length) {
            categoryResult = categoryResult.concat(category);
            for (var item of category) {
                categoryResult = await this.getDescendantCategory(categoryResult, item.id);
            }
        }
        return categoryResult;
    }
}

module.exports = new CategoryService();