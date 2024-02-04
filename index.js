const express = require("express");
const connected = require("./db");
var cors = require("cors");
const PORT = process.env.PORT || 8000
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

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
