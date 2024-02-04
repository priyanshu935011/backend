const express = require("express");
const router = express.Router();
const User = require("../modules/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_VERIFY = "12345458556";

//-------------------------------------------Create User-----------------------------------//
router.post("/create", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      contact,
      cpassword,
      address,
    } = req.body;
    if (password !== cpassword) {
      res.status(400).json("Password does not match");
    } else {
      const checkContact = await User.findOne({ contact: contact });

      if (!checkContact) {
        const checkEmail = await User.findOne({ email: email });
        if (!checkEmail) {
          salt = 10;
          securePass = await bcrypt.hash(password, salt);
          const user = User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: securePass,
            contact: contact,
            address: address,
            date: Date.now(),
          });
          const token = jwt.sign({ id: user._id }, JWT_VERIFY);
          res.status(200).json(token);
        } else {
          res.status(400).json("Email already registered");
        }
      } else {
        res.status(400).json("Phone number already registered");
      }
    }
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Login User-----------------------------------//
router.post("/login", async (req, res) => {
  try {
    const { password, contact } = req.body;
    const accountCheck = await User.findOne({ contact: contact });
    if (accountCheck) {
      passCheck = await bcrypt.compare(password, accountCheck.password);
      if (!passCheck) {
        res.status(400).json("Enter correct password");
      } else {
        const token = jwt.sign({ id: accountCheck._id }, JWT_VERIFY);
        res.status(200).json(token);
      }
    } else {
      res.status(400).json("Enter correct login credentials");
    }
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Fetch User Details-----------------------------------//
router.post("/fetch", async (req, res) => {
  try {
    token = req.header("auth-token");
    const userId = jwt.verify(token, JWT_VERIFY);
    const check = User.findById(userId.id);
    data = await check;
    res.json(data);
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Fetch All User Details-----------------------------------//
router.post("/fetchall", async (req, res) => {
  try {
    const data = User.find({}).sort({ _id: "desc" });
    const users = await data;
    res.json(users);
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Update User Details-----------------------------------//
router.put("/update", async (req, res) => {
  try {
    token = req.header("auth-token");
    const userId = jwt.verify(token, JWT_VERIFY);
    const check = User.findById(userId.id);
    if (check) {
      const {
        first_name,
        last_name,
        email,
        password,
        contact,
        address,
        gender,
        dob,
      } = req.body;
      const user = User.findByIdAndUpdate(
        userId.id,
        {
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
          contact: contact,
          address: address,
          gender: gender,
          dob: dob,
        },
        { new: true }
      );
      data = await user;
      res.status(200).json(data);
    }
  } catch {
    res.status(400).json("Internal Error");
  }
});
module.exports = router;
