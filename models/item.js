
const mongoose = require('mongoose');
const ItemDetails = require('./item_details');

const ItemSchema = new mongoose.Schema({
    name:{
        type: String,
    required: true
    },
    price:{
        type: String,
    required: true
    },
    quantity:{
        type: String,
    required: true
    },
    itemdetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:ItemDetails

    

    }
})
const Item = mongoose.model("Item",ItemSchema)
module.exports = Item;