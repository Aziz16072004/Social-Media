// /middleware/uploadMiddleware.js
const multer = require("multer");

// Memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;
