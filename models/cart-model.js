var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var cartSchema = new mongoose.Schema({
    id: {type: Number, index: true}, 
    username: String,
    productId: Number,                  
    quantity: Number,                    
    checked: Boolean                                   
}, {timestamps: true});

cartSchema.plugin(autoIncrement.plugin, {model: 'Cart', field: 'id'});
var Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;