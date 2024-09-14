const multer = require("multer")
const fs = require("fs")
const path = require("path");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = './uploads/';
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
module.exports = upload;