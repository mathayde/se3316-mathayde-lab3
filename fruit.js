// fruit.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FruitSchema   = new Schema({
    name: String,
    quantity: Number,
    price: Number,
    tax: Number
    
});

module.exports = mongoose.model('Fruit', FruitSchema);