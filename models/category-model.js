var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var categorySchema = new mongoose.Schema({
    id: {type: Number, index: true},    // 类别id
    parent_id: Number,                  // 父类id，id=0表示根节点
    name: String,                       // 类别名称
    status: Boolean,                     // 类别状态true-表示可用
    sort_order: Number                  // 排列序号
}, {timestamps: true});

categorySchema.plugin(autoIncrement.plugin, {model: 'Category', field: 'id', startAt: 10000});
var Category = mongoose.model('Category', categorySchema);

module.exports = Category;