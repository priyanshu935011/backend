const express = require("express");
const router = express.Router();
const Order = require("../modules/Orders");
const stripe = require("stripe")(
  "sk_test_51OVwWaSAXztO6zG6g4bZbj0GbK4IVYYZQJX7IMfrBVJ4CF4O4mfkqSM5dBarcWYGCCAcoVdl3cRNKaDw14cDcO0P00p7Y1F4Jz"
);
const jwt = require("jsonwebtoken");
const JWT_VERIFY = "12345458556";
//-------------------------------------------Checkout-----------------------------------//
router.post("/checkout", async (req, res) => {
  const { products } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "INR",
      product_data: {
        name: product.name,
      },
      unit_amount:
        Math.round(
          product.actualPrice - (product.discount / 100) * product.actualPrice
        ) * 100,
    },
    quantity: product.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/payment_success",
    cancel_url: "http://localhost:3000/cart",
  });

  res.json({ id: session.id });
});

//-------------------------------------------Create Order-----------------------------------//
router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      orderId,
      productCode,
      name,
      images,
      contact,
      price,
      qty,
      address,
      paymentMode,
      status,
      trackingId,
      date,
      size,
    } = req.body;
    productCode.map((product, key) => {
      const order = Order.create({
        userId: userId,
        orderId: orderId,
        productCode: product,
        name: name[key],
        images: images[key],
        contact: contact,
        price: price[key],
        qty: qty[key],
        address: address,
        paymentMode: paymentMode,
        status: status,
        trackingId: trackingId,
        date: date,
        size: size[key],
        returnReason: "",
        returnStatus: "",
        returnDate: date,
      });
    });

    res.status(200).json(orderId);
  } catch (error) {
    res.status(400).json(error);
  }
});

//-------------------------------------------Update Order Details-----------------------------------//
router.put("/update/:id", async (req, res) => {
  try {
    const orderId = req.params["id"];
    const { status, productCode, size, newSize, reason } = req.body;
    if (!productCode) {
      const order = await Order.updateMany(
        { orderId: orderId },
        {
          status: status,
        }
      );
      data = await order;
      res.status(200).json(data);
    } else {
      if (newSize) {
        const order = Order.updateOne(
          {
            $and: [
              { orderId: orderId },
              { productCode: productCode },
              { size: size },
            ],
          },
          {
            status: status,
            size: newSize,
          }
        );
        data = await order;
        res.status(200).json(data);
      } else {
        if (reason) {
          const order = Order.updateOne(
            {
              $and: [
                { orderId: orderId },
                { productCode: productCode },
                { size: size },
              ],
            },
            {
              status: status,
              returnReason: reason,
              returnStatus: 0,
              returnDate: Date.now(),
            }
          );
          data = await order;
          res.status(200).json(data);
        } else {
          const order = Order.updateOne(
            {
              $and: [
                { orderId: orderId },
                { productCode: productCode },
                { size: size },
              ],
            },
            {
              status: status,
            }
          );
          data = await order;
          res.status(200).json(data);
        }
      }
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//-------------------------------------------Fetch Particular Order-----------------------------------//
router.get("/fetchorder/:id", async (req, res) => {
  try {
    const orderId = req.params["id"];
    check = await Order.findOne({ orderId: orderId });
    if (check) {
      data = check;
      res.status(200).json(data);
    } else {
      res.status(400).json("Invalid Order Id");
    }
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Fetch All Orders Of Particular User-----------------------------------//
router.get("/fetchuser", async (req, res) => {
  try {
    token = req.header("auth-token");
    const userId = jwt.verify(token, JWT_VERIFY);
    const check = await Order.find({
      $and: [
        { userId: userId.id },
        {
          $or: [
            { status: "ORDER PLACED" },
            { status: "SHIPPED" },
            { status: "DELIVERED" },
            { status: "CANCELLED" },
            { status: "EXCHANGED" },
            { status: "RETURNED" },
          ],
        },
      ],
    }).sort({ _id: "desc" });
    if (check) {
      data = check;
      res.status(200).json(data);
    } else {
      res.status(400).json("Invalid User");
    }
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Fetch All Orders-----------------------------------//
router.get("/fetchall/:type", async (req, res) => {
  try {
    const type = req.params["type"];
    if (type === "new") {
      const data = Order.find({
        $or: [{ status: "ORDER PLACED" }],
      }).sort({ _id: "desc" });
      orders = await data;
      res.json(orders);
    } else if (type === "shipped") {
      const data = Order.find({
        $or: [{ status: "SHIPPED" }],
      }).sort({ _id: "desc" });
      orders = await data;
      res.json(orders);
    } else if (type === "cancelled") {
      const data = Order.find({
        $or: [{ status: "CANCELLED" }],
      }).sort({ _id: "desc" });
      orders = await data;
      res.json(orders);
    } else if (type === "returned") {
      const data = Order.find({
        $or: [{ status: "RETURNED" }],
      }).sort({ returnStatus: 1 });
      orders = await data;
      res.json(orders);
    } else {
      const data = Order.find({
        $or: [{ status: "DELIVERED" }],
      }).sort({ _id: "desc" });
      orders = await data;
      res.json(orders);
    }
  } catch {
    res.status(400).json("Internal Error");
  }
});

module.exports = router;
