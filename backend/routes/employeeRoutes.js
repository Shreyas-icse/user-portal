const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure Multer to store files in memory as Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// (Optional) Legacy route — you can remove if not used
router.post('/add-employee', employeeController.signup);

// Signup route with optional profile photo
router.post(
  '/signup',
  upload.single('photo'),
  employeeController.signup
);

// Login route
router.post('/login', employeeController.login);

// Get profile (protected)
router.get(
  '/profile',
  authMiddleware,
  employeeController.getProfile
);

// Update profile (name, phone, city, photo)
router.put(
  '/profile',
  authMiddleware,
  upload.single('photo'),
  employeeController.updateProfile
);

module.exports = router;
