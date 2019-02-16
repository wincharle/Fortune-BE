/*
 * @Author: wincharle 
 * @Date: 2018-11-10 13:13:53 
 * @Last Modified by: wincharle
 * @Last Modified time: 2018-11-21 17:22:40
 */
var STATUS = require('../util/constant').STATUS;
var ROLE = require('../util/constant').ROLE;
exports.checkLogin = function(req, res, next){
    if(!req.session.user){
        return res.json({"status": STATUS.NEEDLOGIN, "msg": "用户未登录，请登录"});
    }
    next();
}
exports.checkAdminUser = function(req, res, next){
    if(req.session.user.role !== ROLE.ADMIN){
        return res.json({"status": STATUS.ERROR, "msg": "无权限操作，需要管理员权限"});
    }
    next();
}
