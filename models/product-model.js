/*
 * @Author: wincharle 
 * @Date: 2018-11-08 14:18:46 
 * @Last Modified by: wincharle
 * @Last Modified time: 2018-11-12 23:43:14
 */
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var productSchema = new mongoose.Schema({
    id: {type: Number, index: true},    // 商品id
    categoryId: Number,                  // 分类id
    name: String,                       // 类别名称
    subtitle: String,
    mainImage: String,
    subImages: [String],
    detail: String,
    price: Number,
    stock: Number,
    status: Boolean,                     // 类别状态true-表示可用
    sortOrder: Number                  // 排列序号
}, {timestamps: true});

productSchema.plugin(autoIncrement.plugin, {model: 'Product', field: 'id'});
var Product = mongoose.model('Product', productSchema);

module.exports = Product;