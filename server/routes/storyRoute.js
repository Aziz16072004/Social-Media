const express = require("express");
const router = express.Router();
const storyController = require("../controller/storyController");
const multer = require("multer")
const fs = require("fs")
const path = require("path");
const { requireAuth } = require("../middlewares/auth");

//uploading the image
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = './storiesImgs/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get("/getStories", storyController.getStories);
router.get("/getStoriesForSwipper", storyController.getStoriesForSwipper);
router.get("/getAllStories",requireAuth, storyController.getAllStories);
router.post("/addStory", upload.single('image') , storyController.addStory);

module.exports = router;
