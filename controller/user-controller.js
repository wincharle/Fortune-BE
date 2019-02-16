var uuidv1 = require('uuid/v1');
var userService = require('../service/user-service');
var util = require('../util/util');
var config = require('../config');
var STATUS = require('../util/constant').STATUS;

class User {
    constructor() {
    }
    /**
     * 用户登录
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {Function} next 
     */
    async login(req, res, next) {
        var username = req.fields.username,
            password = req.fields.password;

        try {
            var userCount = await userService.checkUserName(username);
            if (userCount === 0) {
                return res.json({ "status": STATUS.ERROR, "msg": '用户名不存在' });
            }
        } catch (err) {
            next(err);
        }
        try {
            password = util.md5(password);
            var user = await userService.selectLogin(username, password);
            if (user === null) {
                return res.json({ "status": STATUS.ERROR, "msg": "密码错误" });
            }
        } catch (err) {
            next(err);
        }

        user = userService.getUserVO(user);
        req.session.user = user;
        return res.json({ "status": STATUS.SUCCESS, "msg": '登录成功', "data": user });
    }

    // 登出
    logout(req, res, next) {
        delete req.session.user;
        return res.json({ "status": STATUS.SUCCESS, "msg": '退出成功' });
    }

    /**
     * 注册，用户名和邮箱需要进行唯一性校验
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {Function} next 
     */
    async register(req, res, next) {
        // 校验用户名是否已经存在，校验email是否已经存在
        var { username, password, email, phone, question, answer } = req.fields;
        if (!username || !password || !email || !phone || !question || !answer) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": "参数错误" });
        }
        try {
            var userCount = await userService.checkUserName(username);
            var emailCount = await userService.checkEmail(email);
        } catch (err) {
            next(err);
        }
        if (userCount > 0) {
            return res.json({ "status": STATUS.ERROR, "msg": '用户名已经存在' });
        }
        if (emailCount > 0) {
            return res.json({ "status": STATUS.ERROR, "msg": '邮箱已经存在' });
        }
        var user = {};
        user.username = username;
        user.password = util.md5(password);
        user.email = email;
        user.phone = phone;
        user.question = question;
        user.answer = answer;
        try {
            user = await userService.insert(user);
            req.session.user = userService.getUserVO(user);
            return res.json({ "status": STATUS.SUCCESS, "msg": "注册成功" });
        } catch (err) {
            next(err);
        }
    }

    /**
     * 校验用户名和邮箱是否已经存在，注册的时候，当用户填写完成用户名或者邮箱的时候进行校验
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {Function} next 
     */
    async checkValid(req, res, next) {
        var { str, type } = req.fields;
        var types = ['username', 'email'];
        if (type && str && (types.indexOf(type) > -1)) {
            try {
                var count = await userService.checkValid(str, type);
            } catch (err) {
                next(err);
            }
            if (type === 'username' && count > 0) {
                return res.json({ "status": STATUS.ERROR, "msg": '用户名已经存在' });
            }
            if (type === 'email' && count > 0) {
                return res.json({ "status": STATUS.ERROR, "msg": '邮箱已经存在' });
            }
        } else {
            return res.json({ "status": STATUS.PARAMERROR, "msg": '参数错误' });
        }
        return res.json({ "status": STATUS.SUCCESS, "msg": '校验通过' });
    }

    /**
     * 根据session信息获取user
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {Function} next 
     */
    getUserInfo(req, res, next) {
        var user = req.session.user;
        if (user) {
            return res.json({ "status": STATUS.SUCCESS, "data": user });
        } else {
            return res.json({ "status": STATUS.ERROR, "msg": '用户未登录，无法获取当前用户信息' });
        }
    }

    /**
     * 根据用户名获得密码提示问题，注：用户未登录状态
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {Function} next 
     */
    async forgetGetQuestion(req, res, next) {
        var username = req.fields.username;
        try {
            var count = await userService.checkUserName(username);
        } catch (err) {
            next(err);
        }
        if (count === 0) {
            return res.json({ "status": STATUS.ERROR, "msg": '用户名不存在' });
        }
        // 获取问题
        try {
            var question = await userService.selectQuestion(username);
        } catch (err) {
            next(err);
        }
        if (question) {
            return res.json({ "status": STATUS.SUCCESS, "data": question });
        } else {
            return res.json({ "status": STATUS.ERROR, "msg": "找回密码的提示问题是空的" });
        }

    }

    /**
     * 检查密码提示问题答案是否正确,如果正确返回一个token,5分钟有效期
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {Function} next 
     */
    async forgetCheckAnswer(req, res, next) {
        var { username, question, answer } = req.fields;
        try {
            var count = await userService.checkAnswer(username, question, answer);
        } catch (err) {
            next(err);
        }
        if (count > 0) {
            var token = uuidv1();
            util.setCache('token_' + username, token, config.tokenTime);
            return res.json({ "status": STATUS.SUCCESS, "data": token });
        } else {
            return res.json({ "status": STATUS.ERROR, "msg": '问题答案错误' });
        }
    }

    /**
     * 根据token和username修改密码
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {Function} next 
     */
    async forgetResetPassword(req, res, next) {
        var { username, passwordNew, forgetToken } = req.fields;
        if (!forgetToken) {
            return res.json({ "status": STATUS.PARAMERROR, "msg": '参数错误，需要传递token' });
        }
        // 校验用户名
        try {
            var count = await userService.checkUserName(username);
        } catch (err) {
            next(err);
        }
        if (count === 0) {
            return res.json({ "status": STATUS.ERROR, "msg": '用户名不存在' });
        }
        var token = util.getCache('token_' + username);
        // 校验cache中的token
        if (!token) {
            return res.json({ "status": STATUS.ERROR, "msg": 'token无效或者已经过期' });
        }
        // 校验token是否相等
        if (token === forgetToken) {
            // 更新密码
            var md5Password = util.md5(passwordNew);
            try {
                var result = await userService.updatePasswordByUsername(username, md5Password);
                if (result.n) {
                    return res.json({ "status": STATUS.SUCCESS, "msg": '修改密码成功' });
                }
            } catch (err) {
                next(err);
            }
        } else {
            return res.json({ "status": STATUS.ERROR, "msg": 'token错误，请重新获取token' });
        }
        return res.json({ "status": STATUS.ERROR, "msg": '修改密码失败' });
    }

    /**
     * 登录状态下修改密码，需要提供旧密码
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {Function} next 
     */
    async resetPassword(req, res, next) {
        var { passwordNew, passwordOld } = req.fields;
        var user = req.session.user;
        var md5PasswordOld = util.md5(passwordOld);

        try {
            var count = await userService.checkPassword(user.username, md5PasswordOld);
            if (count === 0) {
                return res.json({ "status": STATUS.ERROR, "msg": '旧密码错误' });
            }
        } catch (err) {
            next(err);
        }
        // 更新密码
        var md5PasswordNew = util.md5(passwordNew);
        try {
            var result = await userService.updatePasswordByUsername(user.username, md5PasswordNew);
            if (result.n) {
                return res.json({ "status": STATUS.SUCCESS, "msg": '密码更新成功' });
            }
            return res.json({ "status": STATUS.ERROR, "msg": '密码更新失败' });
        } catch (err) {
            next(err);
        }
    }
    /**
     * 更新用户信息，用户名不能更新
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {Function} next 
     */
    async updateInformation(req, res, next) {
        var { email, phone, question, answer } = req.fields;
        var user = req.session.user;
        // 校验email,检查范围不包过传进去的username
        try {
            var count = await userService.checkEmailByUsername(email, user.username);
        } catch (err) {
            next(err);
        }
        if (count > 0) {
            return res.json({ "status": STATUS.ERROR, "msg": 'email已经存在，请更换email' });
        }
        user.email = email ? email : user.email;
        user.phone = phone ? phone : user.phone;
        user.question = question ? question : user.question;
        user.answer = answer ? answer : user.answer;
        try {
            var result = await userService.updateUser(user);
            if (result.n > 0) {
                var user = await userService.getUser(user.username);
                user = userService.getUserVO(user);
                req.session.user = user;
                return res.json({ "status": STATUS.SUCCESS, "msg": '更新个人信息成功', "data": user });
            } else {
                return res.json({ "status": STATUS.ERROR, "msg": '更新个人信息失败' });
            }
        } catch (err) {
            next(err);
        }
    }

    /**
     * 获得用户信息，并强制登录
     * @param {HttpRequest} req 
     * @param {HttpResponse} res 
     * @param {Function} next 
     */
    async getInformation(req, res, next) {
        var user = req.session.user;
        if (user) {
            try {
                var user = await userService.getUser(user.username);
            } catch (err) {
                next(err)
            }
            return res.json({ "status": STATUS.SUCCESS, "data": userService.getUserVO(user) });
        }
        return res.json({ "status": STATUS.NEEDLOGIN, "msg": '用户未登录，无法获取当前用户信息' })
    }
}

module.exports = new User();