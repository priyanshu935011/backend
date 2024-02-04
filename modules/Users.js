const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  contact: {
    type: Number,
    require: true,
    unique: true,
  },
  gender: {
    type: String,
  },
  dob: {
    type: String,
  },
  date: {
    type: Date,
  },
  address: String,
});

const User = mongoose.model("users", userSchema);
module.exports = User;
