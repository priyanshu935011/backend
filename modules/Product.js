const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  productCode: {
    type: Number,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  subCategory: {
    type: String,
    require: true,
  },
  specifications: {
    type: Object,
    require: true,
  },
  images: {
    type: Array,
    require: true,
  },
  actualPrice: {
    type: Number,
    require: true,
  },
  discount: {
    type: Number,
    require: true,
  },
  stock: {
    type: Object,
    require: true,
  },
  buys: {
    type: Number,
    default: 0,
  },
});

const Product = mongoose.model("products", productSchema);
module.exports = Product;
