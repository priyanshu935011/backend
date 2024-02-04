const express = require("express");
const router = express.Router();
const Category = require("../modules/Category");

//-------------------------------------------Add Category-----------------------------------//
router.post("/create", async (req, res) => {
  try {
    const { name, status, subCategory } = req.body;
    const check = await Category.find({ name: name });
    if (check.length > 0) {
      res.status(200).json("Category already exits");
    } else {
      const category = Category.create({
        name: name,
        status: status,
        subCategories: subCategory,
      });
      res.status(200).json("Category created");
    }
  } catch (error) {
    res.status(401).json("Internal Error");
  }
});

//-------------------------------------------Update Category-----------------------------------//
router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params["id"];
    const { name, status, subCategory } = req.body;
    const check = await Category.find({ _id: id });
    if (check.length > 0) {
      const category = await Category.findByIdAndUpdate(id, {
        name: name,
        subCategories: [...subCategory],
        status: status,
      });
      res.json("Category updated").status(200);
    } else {
      res.status(400).json("Category does not exist");
    }
  } catch (error) {
    res.status(400).json("Internal Error");
  }
});
//-------------------------------------------Fetch All Category-----------------------------------//
router.post("/fetch", async (req, res) => {
  try {
    check = await Category.find({});
    data = check;
    res.status(200).json(data);
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Fetch Active Category-----------------------------------//
router.post("/fetchactive", async (req, res) => {
  try {
    check = await Category.find({ status: 1 });
    data = check;
    res.status(200).json(data);
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Delete Category-----------------------------------//
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params["id"];
    check = await Category.findOne({ _id: id });
    if (check) {
      deleteCat = await Category.findByIdAndDelete(id);
      res.status(200).json("Category deleted successfully");
    } else {
      res.status(400).json("Category not found");
    }
  } catch {
    res.status(400).json("Internal Error");
  }
});
module.exports = router;
