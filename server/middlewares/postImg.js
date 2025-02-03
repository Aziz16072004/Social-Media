const multer = require("multer");

// Set up memory storage for multer
const storage = multer.memoryStorage();  // Store file in memory, not disk

// Create multer instance with memory storage and single image field
const upload = multer({ storage: storage }).single("image");  // Handles 'image' field

module.exports = upload;  // Export for use in routes
