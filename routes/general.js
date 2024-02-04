const express = require("express");
const router = express.Router();
const General = require("../modules/General");
const multer = require("multer");
const path = require("node:path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "products/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
//-------------------------------------------Fetch General-----------------------------------//
router.get("/fetch", async (req, res) => {
  try {
    const data = General.find({}).limit(1);
    general = await data;
    res.json(general);
  } catch {
    res.status(400).json("Internal Error");
  }
});

//-------------------------------------------Update General-----------------------------------//
router.post("/update", upload.array("logo", 1), async (req, res) => {
  try {
    check = await General.findOne({});
    const { websiteName, email, contact, fb, ig, wp, tw, yt } = req.body;
    if (check) {
      if (req.files.length > 0) {
        const general = General.findByIdAndUpdate(check._id, {
          websiteName: websiteName,
          email: email,
          contact: contact,
          logo: req.files,
          social: {
            $elemMatch: {
              facebook: fb,
              instagram: ig,
              whatsapp: wp,
              twitter: tw,
              youtube: yt,
            },
          },
        });
        data = await general;
        res.redirect("http://localhost:3001/setting");
      } else {
        const general = General.findByIdAndUpdate(check._id, {
          websiteName: websiteName,
          email: email,
          contact: contact,
          social: {
            $elemMatch: {
              facebook: fb,
              instagram: ig,
              whatsapp: wp,
              twitter: tw,
              youtube: yt,
            },
          },
        });
        data = await general;
        res.redirect("http://localhost:3001/setting");
      }
    } else {
      res.status(400).json("Something suspicious");
    }
  } catch {
    res.status(400).json("Internal Error");
  }
});

module.exports = router;
