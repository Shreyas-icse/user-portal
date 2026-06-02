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
    const { name, phone, city, workType, salaryPerDay } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (city) updateFields.city = city;
    if (workType) updateFields.workType = workType;
    if (salaryPerDay) updateFields.salaryPerDay = salaryPerDay;

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
      };
    });

    res.json(formatted);
  } catch (err) {
    console.log("Get all workers error:", err);
    res.status(500).json({ msg: "Failed to fetch workers" });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
  getAllWorkers,
};
