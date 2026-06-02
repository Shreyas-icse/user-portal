const express = require('express');
const router = express.Router();

const workerController = require('../controllers/workerController');
const authWorker = require('../middleware/authWorker');
const multer = require('multer');
const fetch = require('node-fetch'); // add this to the top if not present

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

router.put(
  '/location',
  authWorker,
  workerController.updateLiveLocation
);

// Add geocode endpoint
router.post('/geocode', async (req, res) => {
  try {
    const { address } = req.body;
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Address required' });
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
    const found = await fetch(url, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'LS-ProjectX/1.0' }
    });
    if (!found.ok) return res.status(502).json({ error: 'Failed to fetch geocode'});
    const results = await found.json();
    if (results.length === 0) return res.status(404).json({ error: 'No results' });
    const item = results[0];
    res.json({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      display_name: item.display_name
    });
  } catch (e) {
    res.status(500).json({ error: 'Geocode error', details: e.message });
  }
});

// ✅ Get all workers
router.get(
  '/all',
  workerController.getAllWorkers
);

router.get(
  '/:id/location',
  workerController.getWorkerLocation
);

module.exports = router;
