/*
 * @Author: wincharle 
 * @Date: 2018-11-05 10:55:08 
 * @Last Modified by: wincharle
 * @Last Modified time: 2018-11-11 14:11:26
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: String,
    email: String,
    phone: String,
    question: String,
    answer: String,
    role: {type: Number, default: 1},
}, {timestamps: true});

var User = mongoose.model('User', userSchema);

module.exports = User;