const express = require('express');
const upload = require('../config/multer');
const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided.' });
  }
  // Cloudinary URL is in req.file.path
  res.json({ url: req.file.path });
});

module.exports = router; 