const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  orderId: {
    type: String,
    require: true,
  },
  productCode: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  images: {
    type: String,
    require: true,
  },
  qty: {
    type: Number,
    require: true,
  },
  size: {
    type: String,
    require: true,
  },
  contact: {
    type: Number,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  paymentMode: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  trackingId: {
    type: String,
  },
  date: {
    type: Date,
    require: true,
  },
  returnReason: {
    type: String,
  },
  returnStatus: {
    type: Number,
  },
  returnDate: {
    type: Date,
  },
});

const Order = mongoose.model("orders", orderSchema);
module.exports = Order;
