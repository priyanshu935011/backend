const express = require("express");
const router = express.Router();
const Product = require("../modules/Product");
const multer = require("multer");
const app = express();
const path = require("node:path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "products/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
app.use(express.urlencoded({ extended: false }));
let productCode = 0;
//-------------------------------------------Create Products-----------------------------------//
router.post("/create", upload.array("images", 5), async (req, res) => {
  check = await Product.findOne({}).sort({ _id: "desc" }).limit(1);
  if (check) {
    productCode = check.productCode + 1;
  } else {
    productCode = 1001;
  }
  try {
    const {
      name,
      category,
      subCategory,
      material,
      model,
      colour,
      pattern,
      sleeve,
      closure,
      actualPrice,
      discount,
      warranty,
      variants,
      s,
      m,
      l,
      xl,
      reviews,
    } = req.body;
    const specifications = {
      material: material,
      model: model,
      colour: colour,
      pattern: pattern,
      sleeve: sleeve,
      closure: closure,
    };
    const stock = {
      s: s,
      m: m,
      l: l,
      xl: xl,
    };
    const product = await Product.create({
      name: name,
      productCode: productCode,
      category: category,
      subCategory: subCategory,
      specifications: specifications,
      images: req.files,
      actualPrice: actualPrice,
      discount: discount,
      warranty: warranty,
      variants: variants,
      stock: stock,
      reviews: reviews,
    });
    data = product;
    res.redirect("http://localhost:3001/products");
  } catch {
    res.status(400).redirect("http://localhost:3001/products");
  }
});

//-------------------------------------------Fetch Particular Product-----------------------------------//
router.get("/fetchone/:id", async (req, res) => {
  try {
    const productId = req.params["id"];
    check = await Product.findOne({ productCode: productId });
    if (check) {
      data = check;
      res.status(200).json(data);
    } else {
      res.status(400).json("Product not found");
    }
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Fetch All Products-----------------------------------//
router.post("/fetchall", async (req, res) => {
  try {
    const data = Product.find({}).sort({ productCode: "desc" });
    products = await data;
    res.json(products);
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Update Products-----------------------------------//
router.post("/update/:id", upload.array("images", 5), async (req, res) => {
  try {
    const productId = req.params["id"];
    check = await Product.findOne({ productCode: productId });
    if (check) {
      const {
        name,
        productCode,
        category,
        subCategory,
        material,
        model,
        colour,
        pattern,
        sleeve,
        closure,
        actualPrice,
        discount,
        warranty,
        variants,
        s,
        m,
        l,
        xl,
        reviews,
      } = req.body;
      const specifications = {
        material: material,
        model: model,
        colour: colour,
        pattern: pattern,
        sleeve: sleeve,
        closure: closure,
      };
      const stock = {
        s: s,
        m: m,
        l: l,
        xl: xl,
      };
      if (!req.files.length > 0) {
        const product = Product.findByIdAndUpdate(
          check.id,
          {
            name: name,
            productCode: productCode,
            category: category,
            subCategory: subCategory,
            specifications: specifications,
            actualPrice: actualPrice,
            discount: discount,
            warranty: warranty,
            variants: variants,
            stock: stock,
            reviews: reviews,
          },
          { new: true }
        );
        data = await product;
        res.redirect("http://localhost:3001/products");
      } else {
        const product = Product.findByIdAndUpdate(
          check.id,
          {
            name: name,
            productCode: productCode,
            category: category,
            subCategory: subCategory,
            specifications: specifications,
            actualPrice: actualPrice,
            discount: discount,
            images: req.files,
            warranty: warranty,
            variants: variants,
            stock: stock,
            reviews: reviews,
          },
          { new: true }
        );
        data = await product;
        res.redirect("http://localhost:3001/products");
      }
    } else {
      res.status(400).json("Product not found");
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//-------------------------------------------Delete Products-----------------------------------//
router.delete("/delete/:id", async (req, res) => {
  try {
    const productId = req.params["id"];
    check = await Product.findOne({ productCode: productId });
    if (check) {
      deleteProd = await Product.findByIdAndDelete(check._id);
      res.status(200).json("Product deleted successfully");
    } else {
      res.status(400).json("Product not found");
    }
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Fetch New Arrival Products-----------------------------------//
router.post("/new_arrival", async (req, res) => {
  try {
    const data = Product.find({}).sort({ productCode: "desc" }).limit(15);
    products = await data;
    res.json(products);
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Fetch Men Bestesellers Products-----------------------------------//
router.post("/bestseller/men", async (req, res) => {
  try {
    const data = Product.find({ category: "men" })
      .sort({ buys: "desc" })
      .limit(15);
    products = await data;
    res.json(products);
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Fetch Women Bestesellers Products-----------------------------------//
router.post("/bestseller/women", async (req, res) => {
  try {
    const data = Product.find({ category: "women" })
      .sort({ buys: "desc" })
      .limit(15);
    products = await data;
    res.json(products);
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Fetch Categories Products-----------------------------------//
router.post("/:category", async (req, res) => {
  try {
    const category = req.params["category"];
    const data = Product.find({ category: category });
    products = await data;
    res.status(200).json(products);
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Fetch Sub Categories Products-----------------------------------//
router.post("/:category/:subcat", async (req, res) => {
  try {
    const category = req.params["category"];
    const subcat = req.params["subcat"].split("-").join(" ");
    const data = Product.find({
      $and: [{ category: category }, { subCategory: subcat }],
    });
    products = await data;
    res.status(200).json(products);
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Fetch Searched Products-----------------------------------//
router.get("/search/:q", async (req, res) => {
  try {
    const search = req.params["q"];
    if (search.length > 0) {
      const data = await Product.find({ $text: { $search: search } });
      if (data.length > 0) {
        const products = data;
        res.json(products).status(200);
      }
    }
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Check Stock-----------------------------------//
router.get("/stock", async (req, res) => {
  try {
    const data = Product.find({});
    products = await data;
    res.status(200).json(products);
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Update Stock-----------------------------------//
router.put("/stock/:productCode", async (req, res) => {
  try {
    const { qty, size } = req.body;
    const productCode = req.params["productCode"];
    if (size == "s") {
      const data = Product.updateOne(
        { productCode: productCode },
        { $inc: { "stock.s": qty } }
      );
    } else if (size == "m") {
      const data = Product.updateOne(
        { productCode: productCode },
        { $inc: { "stock.m": qty } }
      );
    } else if (size == "l") {
      const data = Product.updateOne(
        { productCode: productCode },
        { $inc: { "stock.l": qty } }
      );
    } else {
      const data = Product.updateOne(
        { productCode: productCode },
        { $inc: { "stock.xl": qty } }
      );
    }
    res.status(200).json("Stock Updated");
  } catch {
    res.status(400).json("Internal Error");
  }
});

module.exports = router;
