const mongoose = require("mongoose");
require("dotenv").config();
const connected = () => {
  mongoose.connect(process.env.React_App_DATABASE);
};
module.exports = connected;
