const mongoose = require('mongoose');

const ItemCategorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    }
})

const ItemCategory = mongoose.model('ItemCategory',ItemCategorySchema);
module.exports = ItemCategory;