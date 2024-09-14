const express = require('express')
const userController  = require('../controller/userController')
const router = express.Router()

router.post("/signin" , userController.checkUser)
router.post("/signup" , userController.Add_InsertUser)


module.exports = router