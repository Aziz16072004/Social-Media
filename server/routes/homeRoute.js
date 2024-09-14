const express = require('express')
const userController  = require('../controller/userController')
const { requireAuth } = require('../middlewares/auth')
const router = express.Router()


router.get("/getAllUsers" , userController.getAllUsers)
router.get("/getOneUser/:id" , userController.getOneUser)





module.exports = router