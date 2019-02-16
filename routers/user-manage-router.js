var express = require('express');
var router = express.Router();
var userManage = require('../controller/user-manage-controller');

router.post('/login.do', userManage.login);


module.exports = router;