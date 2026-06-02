const Worker = require("../models/Worker");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup with photo upload
const signup = async (req, res) => {
  try {
    const { name, email, password, phone, city, workType, salaryPerDay } = req.body;

    const existing = await Worker.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Worker already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newWorker = new Worker({
      name,
      email,
      password: hashedPassword,
      phone,
      city,
      workType,
      salaryPerDay,
    });

    if (req.file) {
      newWorker.photo = req.file.buffer;
      newWorker.contentType = req.file.mimetype;
    }

    await newWorker.save();

    res.status(201).json({ msg: "Signup successful", workerId: newWorker._id });
  } catch (err) {
    console.log("Worker signup error", err);
    res.status(500).json({ msg: "Signup failed" });
  }
};

// Login - return JWT token and worker data with photo base64 encoded
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const worker = await Worker.findOne({ email });
    if (!worker) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign({ id: worker._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    let photoBase64 = null;
    if (worker.photo) {
      photoBase64 = worker.photo.toString("base64");
    }

    res.status(200).json({
      msg: "Login successful",
      token,
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        city: worker.city,
        workType: worker.workType,
        salaryPerDay: worker.salaryPerDay,
        photo: photoBase64,
<<<<<<< HEAD
=======
        locationLat: worker.locationLat,
        locationLng: worker.locationLng,
        locationAccuracy: worker.locationAccuracy,
        locationUpdatedAt: worker.locationUpdatedAt,
>>>>>>> 896a967d74f81ed8a2dfbf844faf595fe2a4cc7a
      },
    });
  } catch (err) {
    console.log("Worker login error", err);
    res.status(500).json({ msg: "Login failed" });
  }
};

// Get profile
const getProfile = async (req, res) => {
  try {
    const worker = await Worker.findById(req.worker.id).select("-password");
    if (!worker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    let photoBase64 = null;
    if (worker.photo) {
      photoBase64 = worker.photo.toString("base64");
    }

    res.json({
      _id: worker._id,
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      city: worker.city,
      workType: worker.workType,
      salaryPerDay: worker.salaryPerDay,
      photo: photoBase64,
<<<<<<< HEAD
=======
      locationLat: worker.locationLat,
      locationLng: worker.locationLng,
      locationAccuracy: worker.locationAccuracy,
      locationUpdatedAt: worker.locationUpdatedAt,
>>>>>>> 896a967d74f81ed8a2dfbf844faf595fe2a4cc7a
    });
  } catch (err) {
    console.log("Get worker profile error", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const workerId = req.worker.id;
<<<<<<< HEAD
    const { name, phone, city, workType, salaryPerDay } = req.body;
=======
    const { location, ...rest } = req.body; // extract location from body
    const {
      name,
      phone,
      city,
      workType,
      salaryPerDay,
      locationLat,
      locationLng,
      locationAccuracy,
    } = rest;
>>>>>>> 896a967d74f81ed8a2dfbf844faf595fe2a4cc7a

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (city) updateFields.city = city;
    if (workType) updateFields.workType = workType;
    if (salaryPerDay) updateFields.salaryPerDay = salaryPerDay;

<<<<<<< HEAD
=======
    if (location !== undefined) updateFields.location = location;

    const parsedLat = locationLat ?? req.body.latitude;
    const parsedLng = locationLng ?? req.body.longitude;
    const parsedAccuracy = locationAccuracy ?? req.body.accuracy;

    if (parsedLat !== undefined && parsedLat !== "") {
      const latNum = Number(parsedLat);
      if (!Number.isNaN(latNum) && latNum >= -90 && latNum <= 90) {
        updateFields.locationLat = latNum;
        updateFields.locationUpdatedAt = new Date();
        console.log("📍 Profile update - Storing latitude:", latNum);
      } else {
        console.warn("⚠️ Invalid latitude received:", parsedLat);
      }
    }

    if (parsedLng !== undefined && parsedLng !== "") {
      const lngNum = Number(parsedLng);
      if (!Number.isNaN(lngNum) && lngNum >= -180 && lngNum <= 180) {
        updateFields.locationLng = lngNum;
        updateFields.locationUpdatedAt = new Date();
        console.log("📍 Profile update - Storing longitude:", lngNum);
      } else {
        console.warn("⚠️ Invalid longitude received:", parsedLng);
      }
    }

    if (parsedAccuracy !== undefined && parsedAccuracy !== "") {
      const accNum = Number(parsedAccuracy);
      if (!Number.isNaN(accNum) && accNum >= 0) {
        updateFields.locationAccuracy = accNum;
      }
    }

>>>>>>> 896a967d74f81ed8a2dfbf844faf595fe2a4cc7a
    if (req.file) {
      updateFields.photo = req.file.buffer;
      updateFields.contentType = req.file.mimetype;
    }

    const updatedWorker = await Worker.findByIdAndUpdate(workerId, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedWorker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    let photoBase64 = null;
    if (updatedWorker.photo) {
      photoBase64 = updatedWorker.photo.toString("base64");
    }

    res.json({
      msg: "Profile updated successfully",
      worker: {
        _id: updatedWorker._id,
        name: updatedWorker.name,
        email: updatedWorker.email,
        phone: updatedWorker.phone,
        city: updatedWorker.city,
        workType: updatedWorker.workType,
        salaryPerDay: updatedWorker.salaryPerDay,
        photo: photoBase64,
<<<<<<< HEAD
=======
        locationLat: updatedWorker.locationLat,
        locationLng: updatedWorker.locationLng,
        locationAccuracy: updatedWorker.locationAccuracy,
        locationUpdatedAt: updatedWorker.locationUpdatedAt,
        location: updatedWorker.location,
>>>>>>> 896a967d74f81ed8a2dfbf844faf595fe2a4cc7a
      },
    });
  } catch (err) {
    console.log("Update worker profile error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all workers (public/admin)
const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().select("-password");

    const formatted = workers.map(worker => {
      let photoBase64 = null;
      if (worker.photo) {
        photoBase64 = worker.photo.toString("base64");
      }

      return {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        city: worker.city,
        workType: worker.workType,
        salaryPerDay: worker.salaryPerDay,
        photo: photoBase64,
<<<<<<< HEAD
=======
        locationLat: worker.locationLat,
        locationLng: worker.locationLng,
        locationAccuracy: worker.locationAccuracy,
        locationUpdatedAt: worker.locationUpdatedAt,
>>>>>>> 896a967d74f81ed8a2dfbf844faf595fe2a4cc7a
      };
    });

    res.json(formatted);
  } catch (err) {
    console.log("Get all workers error:", err);
    res.status(500).json({ msg: "Failed to fetch workers" });
  }
};

<<<<<<< HEAD
=======
const updateLiveLocation = async (req, res) => {
  try {
    // Get exact coordinates from request - no transformation
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const accuracy = req.body.accuracy;

    // Validate they are numbers
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ msg: "Latitude and longitude must be numbers." });
    }

    // Validate ranges
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({ msg: "Latitude must be between -90 and 90." });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({ msg: "Longitude must be between -180 and 180." });
    }

    console.log("📍 Storing EXACT location:", { 
      latitude, 
      longitude, 
      accuracy, 
      workerId: req.worker.id 
    });

    // Store EXACT coordinates - no conversion, no rounding
    const worker = await Worker.findByIdAndUpdate(
      req.worker.id,
      {
        locationLat: latitude,  // Store exactly as received
        locationLng: longitude, // Store exactly as received
        locationAccuracy: accuracy,
        locationUpdatedAt: new Date(),
      },
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    console.log("📍 Location stored:", { 
      storedLat: worker.locationLat, 
      storedLng: worker.locationLng,
      receivedLat: latitude,
      receivedLng: longitude,
      match: worker.locationLat === latitude && worker.locationLng === longitude
    });

    // Return EXACT stored values
    res.json({
      msg: "Live location updated",
      location: {
        latitude: worker.locationLat,  // Return exactly as stored
        longitude: worker.locationLng, // Return exactly as stored
        accuracy: worker.locationAccuracy,
        updatedAt: worker.locationUpdatedAt,
      },
    });
  } catch (err) {
    console.log("Update live location error:", err);
    res.status(500).json({ msg: "Failed to update location" });
  }
};

const getWorkerLocation = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id).select(
      "locationLat locationLng locationAccuracy locationUpdatedAt name city workType"
    );

    if (!worker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    if (worker.locationLat == null || worker.locationLng == null) {
      return res.status(204).send();
    }

    res.json({
      workerId: worker._id,
      name: worker.name,
      location: {
        latitude: worker.locationLat,
        longitude: worker.locationLng,
        accuracy: worker.locationAccuracy,
        updatedAt: worker.locationUpdatedAt,
      },
    });
  } catch (err) {
    console.log("Get worker location error:", err);
    res.status(500).json({ msg: "Failed to fetch location" });
  }
};

>>>>>>> 896a967d74f81ed8a2dfbf844faf595fe2a4cc7a
module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  getAllWorkers,
<<<<<<< HEAD
=======
  updateLiveLocation,
  getWorkerLocation,
>>>>>>> 896a967d74f81ed8a2dfbf844faf595fe2a4cc7a
};
