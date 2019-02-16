var userService = require('../service/user-service');
var util = require('../util/util');
var constant = require('../util/constant');
var STATUS = constant.STATUS;
var ROLE = constant.ROLE;

class UserMange {
    constructor() {
    }
    /**
     * 管理员登录
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {Function} next 
     */
    async login(req, res, next) {
        var username = req.fields.username,
            password = req.fields.password;

        try{
            var userCount = await userService.checkUserName(username);
        }catch(err){
            next(err);
        }        
        if (userCount === 0) {
            return res.json({ "status": STATUS.ERROR, "msg": '用户名不存在' });
        }

        password = util.md5(password);
        try{
            var user = await userService.selectLogin(username, password);
        }catch(err){
            next(err);
        }       
        if (user === null) {
            return res.json({ "status": STATUS.ERROR, "msg": "密码错误" });
        }
        if (user.role === ROLE.ADMIN) {
            user = userService.getUserVO(user);
            req.session.user = user;
            return res.json({ "status": STATUS.SUCCESS, "msg": '登录成功', "data": user });
        } else {
            return res.json({ "status": STATUS.ERROR, "msg": "不是管理员，无法登录" });
        }
    }
}

module.exports = new UserMange();