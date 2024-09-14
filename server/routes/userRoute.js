const express = require("express")
const router = express.Router()
const userController  = require('../controller/userController')
const upload = require("../middlewares/userImg");
router.post("/addFriend" , userController.addFriend)
router.post("/acceptfriend" , userController.acceptfriend)
router.delete("/rejectfriend" , userController.rejectfriend)
router.get("/getuser/:id" , userController.getUser)
router.get("/postMarkes/:id" , userController.postMarkes)
router.patch("/updateUser/:id", upload.single('profileImg'), userController.updateUser);
module.exports = router

