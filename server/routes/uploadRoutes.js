// 📁 routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Multer Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'ecommerce-products',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage });

// @route   POST /api/upload
// @desc    Upload image to Cloudinary
router.post('/', upload.single('image'), async (req, res) => {
    try {
      if (!req.file || !req.file.path) {
        return res.status(400).json({ message: 'Upload failed' });
      }
      res.json({ url: req.file.path });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong', error: err.message || err });
    }
  });
  
module.exports = router;