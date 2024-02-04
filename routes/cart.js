const express = require("express");
const router = express.Router();
const Cart = require("../modules/Cart");
const User = require("../modules/Users");
const jwt = require("jsonwebtoken");
const JWT_VERIFY = "12345458556";
//-------------------------------------------Fetch Cart Details-----------------------------------//
router.post("/fetch", async (req, res) => {
  try {
    token = req.header("auth-token");
    const userId = jwt.verify(token, JWT_VERIFY);
    const cart = await Cart.find({ userId: userId.id });
    if (cart) {
      const data = cart;
      res.json(data);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//-------------------------------------------Add to Cart-----------------------------------//
router.post("/add", async (req, res) => {
  try {
    const {
      name,
      productCode,
      category,
      subCategory,
      specifications,
      images,
      actualPrice,
      discount,
      variant,
      moq,
      qty,
      size,
    } = req.body;
    token = req.header("auth-token");
    const userId = jwt.verify(token, JWT_VERIFY);
    const check = await Cart.find({
      $and: [
        { userId: userId.id },
        { productCode: productCode },
        { size: size },
      ],
    });
    if (check.length > 0) {
      if (check.qty + qty <= 3) {
        const addToCart = Cart.updateOne(
          { _id: check[0]._id },
          {
            $inc: { qty: qty },
          }
        );
        const data = await addToCart;
        res.status(200).json(data);
      } else {
        res.status(400).json("Maximum 3 products you can buy");
      }
    } else {
      var newQty;
      if (qty <= 3) {
        newQty = qty;
      } else {
        newQty = 3;
      }
      const addToCart = Cart.create({
        userId: userId.id,
        name: name,
        productCode: productCode,
        category: category,
        subCategory: subCategory,
        specifications: specifications,
        images: images,
        actualPrice: actualPrice,
        discount: discount,
        variant: variant,
        moq: moq,
        qty: newQty,
        size: size,
      });
      const data = await addToCart;
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//-------------------------------------------Update Cart-----------------------------------//
router.put("/update", async (req, res) => {
  try {
    const { productCode, prevSize, newSize, qty } = req.body;
    token = req.header("auth-token");
    const userId = jwt.verify(token, JWT_VERIFY);
    const check = await Cart.find({
      $and: [
        { userId: userId.id },
        { productCode: productCode },
        { size: prevSize },
      ],
    });
    if (check.length > 0) {
      if (newSize) {
        const updateCart = Cart.updateOne(
          { _id: check[0]._id },
          {
            size: newSize,
            qty: qty,
          }
        );
        const data = await updateCart;
        res.status(200).json(data);
      } else {
        const updateCart = Cart.updateOne(
          { _id: check[0]._id },
          {
            qty: qty,
          }
        );
        const data = await updateCart;
        res.status(200).json("Quantity Updated");
      }
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//-------------------------------------------Remove From Cart-----------------------------------//
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    deleteProd = await Cart.findByIdAndDelete(id);
  } catch (error) {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Remove All Products From Cart-----------------------------------//
router.delete("/delete", async (req, res) => {
  try {
    token = req.header("auth-token");
    const userId = jwt.verify(token, JWT_VERIFY);
    deleteProd = await Cart.deleteMany({ userId: userId.id });
  } catch (error) {
    res.status(400).json("Internal Error");
  }
});
module.exports = router;
