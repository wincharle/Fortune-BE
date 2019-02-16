var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var shippingSchema = new mongoose.Schema({
    id: {type: Number, index: true},
    username: String,
    receiverName: {type: String, default: ''},
    receiverPhone: {type: String, default: ''},
    receiverMobile: {type: String, default: ''},
    receiverProvince: {type: String, default: ''},
    receiverCity: {type: String, default: ''},
    receiverDistrict: {type: String, default: ''},
    receiverAddress: {type: String, default: ''},
    receiverZip: {type: String, default: ''}
}, {timestamps: true});

shippingSchema.plugin(autoIncrement.plugin, {model: 'Shipping', field: 'id'});
var Shipping = mongoose.model('Shipping', shippingSchema);

module.exports = Shipping;