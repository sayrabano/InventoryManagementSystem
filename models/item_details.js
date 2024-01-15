
const mongoose = require('mongoose');
const ItemCategory = require('./item_category');

const ItemDetailsSchema = new mongoose.Schema({
    description:{
        type: String,
   
    },
    brand:{
        type: String,
    required: true
    },
    supplierinfo:{
        type: String,
    required: true
    },
    image:{
        type: String,
        required: true 

    },
    itemcategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref:ItemCategory
    
    },
})
const ItemDetails = mongoose.model("ItemDetails",ItemDetailsSchema)
module.exports = ItemDetails;