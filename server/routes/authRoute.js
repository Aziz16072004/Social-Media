const express = require('express')
const userController  = require('../controller/userController')
const router = express.Router()


router.get("/signin1" ,(req, res) => {
    console.log("This is the sign-in API");
    res.send("Sign-in API hit successfully");
});
router.post("/signin" , userController.checkUser)
router.post("/signup" , userController.Add_InsertUser)


module.exports = router