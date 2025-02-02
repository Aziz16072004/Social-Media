const express = require('express')
const userController  = require('../controller/userController')
const router = express.Router()

router.post("/signin", (req, res) => {
    console.log("This is the sign-in API");
    res.send("Sign-in API hit successfully");
});

router.post("/signup" , userController.Add_InsertUser)


module.exports = router