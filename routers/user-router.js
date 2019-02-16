var express = require('express');
var router = express.Router();
var user = require('../controller/user-controller');
var middleware = require('../middleware/middleware');


router.post('/login.do', user.login);
router.post('/logout.do', user.logout);
router.post('/register.do', user.register);
router.post('/check_valid.do', user.checkValid);
router.post('/get_user_info.do', user.getUserInfo);
router.post('/forget_get_question.do', user.forgetGetQuestion);
router.post('/forget_check_answer.do', user.forgetCheckAnswer);
router.post('/forget_reset_password.do', user.forgetResetPassword);
router.post('/reset_password.do', middleware.checkLogin, user.resetPassword);
router.post('/update_information.do', middleware.checkLogin, user.updateInformation);
router.post('/get_information.do', middleware.checkLogin, user.getInformation);


module.exports = router;