const express = require("express")
const router = express.Router()
const postController  = require('../controller/postController')
const upload = require("../middlewares/postImg");
router.post("/upload" ,upload.single('image'),postController.uploadPost)
router.get("/" , postController.getPosts)
router.post("/addRate" , postController.addRate)
router.get("/showPost" , postController.showPost)
router.get("/showPostJustForProfile" , postController.showPostJustForProfile)
router.post("/addComment" , postController.addComment)
router.post("/postMarkes" , postController.postMarkes)
router.delete("/removeRate" , postController.RemoveRate)
router.delete("/deletePost" , postController.RemovePost)
router.put("/updatePost" , postController.updatePost)

module.exports = router

