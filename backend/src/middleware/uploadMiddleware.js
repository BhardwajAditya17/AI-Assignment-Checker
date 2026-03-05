const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure 'uploads' directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    // Save as: fieldname-timestamp.pdf
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// File Filter (Accept PDF and Word Docs)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/;
  
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF and Word documents are allowed!"), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter 
});

// Export directly
module.exports = upload;