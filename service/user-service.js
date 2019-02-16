var UserModel = require('../models/user-model');
var util = require('../util/util');

class UserService {
    cosntructor() {
        this.checkEmail = this.checkEmail.bind(this);
        this.checkUserName = this.checkUserName.bind(this);
    }
    /**
     * 判断username是否已经注册
     * @param {string} username
     */
    async checkUserName(username) {
        var count = 0;
        count = await this.checkValid(username, 'username');
        return count;
    }
    /**
     * 根据用户名和密码查询用户
     * @param {string} username 
     * @param {string} password md5加密
     */
    async selectLogin(username, password) {
        var user = await UserModel.findOne().where('username').equals(username)
            .where('password').equals(password);
        return user;
    }
    /**
     * 判断email是否已经注册
     * @param {string} email 
     */
    async checkEmail(email) {
        var count = 0;
        count = await this.checkValid(email, 'email');
        return count;
    }
    /**
     * 创建一个用户
     * @param {UserModel} user 
     */
    async insert(user) {
        var user = await UserModel.create(user);
        return user;
    }
    /**
     * 根据传递的type，判断username或者email是否已经存在
     * @param {string} str 
     * @param {string} type email或者username
     */
    async checkValid(str, type) {
        var count = await UserModel.count().where(type).equals(str);
        return count;
    }
    /**
     * 根据用户名获取密码提示问题
     * @param {String} username 
     */
    async selectQuestion(username) {
        var user = await UserModel.findOne().where('username').equals(username);
        return user.question;
    }
    /**
     * 验证密码提示问题答案是否正确
     * @param {string} username 
     * @param {string} question 
     * @param {string} answer 
     */
    async checkAnswer(username, question, answer) {
        var count = await UserModel.count().where('username').equals(username)
            .where('question').equals(question).where('answer').equals(answer);
        return count;
    }
    /**
     * 更新密码
     * @param {string} username 
     * @param {string} password 
     */
    async updatePasswordByUsername(username, password) {
        var result = await UserModel.where('username').equals(username).update({ password: password });
        return result;
    }
    /**
     * 校验用户名和密码是否正确
     * @param {string} username 
     * @param {string} password 
     */
    async checkPassword(username, password) {
        var count = UserModel.count().where('username').equals(username)
            .where('password').equals(password);
        return count;
    }
    /**
     * 校验email，并且不包含username对应的email
     * @param {string} email 
     * @param {string} username 
     */
    async checkEmailByUsername(email, username) {
        var count = 0;
        count = await UserModel.count().where('email').equals(email).where('username').ne(username);
        return count;
    }
    /**
     * 更新用户信息
     * @param {UserModel} user 
     */
    async updateUser(user) {
        var result = await UserModel.where('username').equals(user.username)
            .update({ email: user.email, phone: user.phone, question: user.question, answer: user.answer });
        return result;
    }
    /**
     * 根据用户名获取user
     * @param {string} username 
     */
    async getUser(username) {
        var user = await UserModel.findOne().where('username').equals(username);
        return user;
    }
    /**
     * user中的数据不需要全部传递给前端，比如密码
     * @param {UserModel} user 
     */
    getUserVO(user) {
        var userVO = {};
        userVO.username = user.username;
        userVO.role = user.role;
        userVO.email = user.email;
        userVO.phone = user.phone;
        userVO.question = user.question;
        userVO.answer = user.answer;
        userVO.createdAt = util.moment(user.createdAt);
        userVO.updatedAt = util.moment(user.updatedAt);
        return userVO;
    }
}

module.exports = new UserService();