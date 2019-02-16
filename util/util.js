var crypto = require('crypto');
var cache = require('memory-cache');
var moment = require('moment');


exports.md5 = function (password) {
    const md5 = crypto.createHash('md5');
    return md5.update(password).digest('base64');
}
exports.setCache = function (name, value, time) {
    cache.put(name, value, time);
}
exports.getCache = function (name) {
    return cache.get(name);
}
exports.moment = function (str) {
    return moment(str).format('YYYY-MM-DD HH:mm:ss');
}
// 分页函数
exports.pagination = async function (pageNum, pageSize, model, condition, orderBy) {
    var condition = condition || {},
        orderBy = orderBy || 'id',
        total = await model.count(condition),
        list = await model.find(condition).sort(orderBy).skip((pageNum - 1) * pageSize).limit(pageSize),
        size = list.length,
        pages = Math.floor((total / pageSize)) + 1,
        firstPage = 1,
        lastPage = Math.floor((total / pageSize)) + 1,
        isFirstPage = (pageNum == firstPage) ? true : false,
        isLastPage = (pageNum == lastPage) ? true : false,
        hasPreviousPage = (isFirstPage == true) ? false : true,
        hasNextPage = (isLastPage == true) ? false : true;

    return {
        pageNum: pageNum,
        pageSize: pageSize,
        size: size,
        orderBy: orderBy,
        total: total,
        pages: pages,
        list: list,
        firstPage: firstPage,
        lastPage: lastPage,
        isFirstPage: isFirstPage,
        isLastPage: isLastPage,
        hasNextPage: hasNextPage,
        hasPreviousPage: hasPreviousPage
    }
}
