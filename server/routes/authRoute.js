const express = require('express')
const userController  = require('../controller/userController')
const router = express.Router()
const multer = require('multer');
const axios = require("axios");
const userSchema = require("../models/user");
const jwt = require("jsonwebtoken");

const upload = multer();
router.post("/signin"  , userController.checkUser)
router.post("/signup", (req, res, next) => {
    if (req.body.image && req.body.image.startsWith('data:image')) {
        return next(); 
    }
    upload.single('image')(req, res, next);
}, userController.Add_InsertUser);

router.post("/google", async (req, res) => {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).send({ message: "Access token is required!" });
    }
  
    try {
      const { data } = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      let user = await userSchema.findOne({ email: data.email });

    if (!user) {
      user = new userSchema({
        username: data.name,
        email: data.email,
        profileImg: data.picture,
        googleId: data.sub,

      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, "aziz secret code", { expiresIn: "1d" });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 });

    console.log({ token, user });
    res.json({ user, token });
} catch (error) {
      console.error("Error fetching user info:", error.response?.data || error.message);
      res.status(500).send({ message: "Failed to authenticate with Google." });
    }
  });
module.exports = router