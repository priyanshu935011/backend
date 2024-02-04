const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "users",
  },
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

  size: {
    type: String,
  },
  moq: {
    type: Number,
    require: true,
  },
  qty: {
    type: Number,
  },
});

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
