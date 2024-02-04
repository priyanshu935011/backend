const express = require("express");
const connected = require("./db");
var cors = require("cors");

connected();
app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/general", require("./routes/general"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/category", require("./routes/categories"));

app.get("/", (req, res) => {
  console.log("Hello");
});

app.listen(8000, () => {
  console.log("Listening at port 8000");
});
