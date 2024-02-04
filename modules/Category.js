const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  subCategories: {
    type: Array,
  },
  homePage: {
    type: Number,
    require: true,
  },
  status: {
    type: Number,
    require: true,
  },
});

const Category = mongoose.model("category", categorySchema);
module.exports = Category;
