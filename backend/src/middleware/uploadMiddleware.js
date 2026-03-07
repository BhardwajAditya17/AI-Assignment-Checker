const multer = require("multer");
const path = require("path");

// ✅ FIX: Switch to Memory Storage so req.file.buffer is populated!
const storage = multer.memoryStorage();

// File Filter (Accept PDF and Word Docs)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document/;
  
  // Checking extension
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  // Checking mimetype
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF and Word documents are allowed!"), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Optional but highly recommended: 10MB limit to protect your RAM
  }
});

module.exports = upload;