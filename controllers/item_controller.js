const mongoose = require("mongoose");
const Item = require("../models/item");
const ItemCategory = require("../models/item_category");
const ItemDetails = require("../models/item_details");
const fs = require("fs");

//function to render access add_item page
module.exports.addItems = function (req, res) {
  return res.render("add_item", { title: "Add Item Page", user: req.user });
};
//function to  add_item page
module.exports.addItemsPage = async function (req, res) {
  try {
    const uploadedFile = req.file;
    if (!uploadedFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = uploadedFile.filename;
    const fileSize = uploadedFile.size;
    const itemcategory = new ItemCategory({
      category: req.body.category,
    });
    const saveitemCategory = await itemcategory.save();
    const itemDetails = new ItemDetails({
      description: req.body.description,
      brand: req.body.brand,
      supplierinfo: req.body.supplierinfo,
      itemcategory: saveitemCategory._id,
      image: fileName,
    });
      //savinf itemdetails
    const savedItemDetails = await itemDetails.save();

    const item = new Item({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      itemdetails: savedItemDetails._id,
    });
  //saving item 
    const savedItem = await item.save();
    req.flash('success', 'Item Added successfully...');
    return res.redirect("/home");
  } catch (error) {
   
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//function to delete items
module.exports.deleteItem = async function (req, res) {
  const itemId = req.params.id;

  try {
    // Finding the item to get the associated itemdetails ID
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Delete the associated ItemDetails document
    await ItemDetails.findByIdAndRemove(item.itemdetails);

    // deleting the Item document
    await Item.findByIdAndRemove(itemId);
    req.flash('success', 'Item deleted....');
    return res.redirect("/home");
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//function to get updateform
module.exports.updateItemForm = function (req, res) {
  const id = req.params.id;
  Item.findById(id)
    .populate({ path: "itemdetails", populate: { path: "itemcategory" } })
    .exec((err, items) => {
      if (err) {
        res.redirect("/");
      } else {
        if (items == null) {
          res.redirect("/");
        } else {
          res.render("update_item", { title: "Update Item Page", items,user: req.user });
        }
      }
    });
};

//function to updateitems 
module.exports.updateItem = async function (req, res) {
  const id = req.params.id;
  let newImg = "";

  if (req.file) {
    try {
      newImg = req.file.filename;
      fs.unlinkSync("./upload/" + req.body.old_image);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    newImg = req.body.old_image;
  }

  try {
    // Update Item table
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
      },
      { new: true }
    );

    if (!updatedItem) {
      console.error("Item not found");
      return res.status(404).json({ error: "Item not found" });
    }

    // Update ItemDetails table
    const updatedItemDetails = await ItemDetails.findByIdAndUpdate(
      updatedItem.itemdetails,
      {
        brand: req.body.brand,
        supplierinfo: req.body.supplierinfo,
        description: req.body.description,
        image: newImg,
      },
      { new: true }
    );

    if (!updatedItemDetails) {
      console.error("ItemDetails not found");
      return res.status(404).json({ error: "ItemDetails not found" });
    }

    // Update ItemCategory table
    const updatedItemCategory = await ItemCategory.findByIdAndUpdate(
      updatedItemDetails.itemcategory,
      {
        category: req.body.category,
       
      },
      { new: true }
    );

    if (!updatedItemCategory) {
      console.error("ItemCategory not found");
      return res.status(404).json({ error: "ItemCategory not found" });
    }

    // Return success response
    req.flash('success', 'Item updated successfully...');
   return res.redirect("/home");
  } catch (error) {
    console.error("Error updating items:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
