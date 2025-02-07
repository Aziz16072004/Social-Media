const express = require('express')
const userController  = require('../controller/userController')
const router = express.Router()
const multer = require('multer');

const upload = multer();
router.post("/signin"  , userController.checkUser)
router.post("/signup", (req, res, next) => {
    if (req.body.image && req.body.image.startsWith('data:image')) {
        return next(); 
    }
    upload.single('image')(req, res, next);
}, userController.Add_InsertUser);

module.exports = router