const express = require('express');
const router = express.Router();

const workerController = require('../controllers/workerController');
const authWorker = require('../middleware/authWorker');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// (Optional) Legacy route — can be removed if unused
router.post('/add-worker', workerController.signup);

// Signup route with optional profile photo
router.post(
  '/signup',
  upload.single('photo'),
  workerController.signup
);

// Login route
router.post('/login', workerController.login);

// Get profile (protected)
router.get(
  '/profile',
  authWorker,
  workerController.getProfile
);

// Update profile (name, phone, city, photo)
router.put(
  '/profile',
  authWorker,
  upload.single('photo'),
  workerController.updateProfile
);

// ✅ Get all workers
router.get(
  '/all',
  workerController.getAllWorkers
);

module.exports = router;
