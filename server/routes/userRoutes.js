const express = require('express');
const router = express.Router();
const {
  register,
  verifyOtpAndCompleteRegistration,
  login,
  getUserProfile,
  updateUser,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/register', register);
router.post('/verify-otp', verifyOtpAndCompleteRegistration);
router.post('/login', login);
router.get('/me', authMiddleware, getUserProfile);
router.put('/update', authMiddleware, updateUser);

module.exports = router;
