const mongoose = require("mongoose");
const { Schema } = mongoose;

const generalSchema = new Schema({
  websiteName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
  },
  contact: {
    type: Number,
    require: true,
  },
  logo: {
    type: Array,
    require: true,
  },
  social: Object,
});

const General = mongoose.model("general", generalSchema);
module.exports = General;
