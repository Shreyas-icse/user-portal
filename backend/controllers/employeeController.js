const Employee = require("../models/Employee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup with photo upload
const signup = async (req, res) => {
  try {
    const { name, email, password, phone, city } = req.body;

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Employee({
      name,
      email,
      password: hashedPassword,
      phone,
      city,
    });

    // Save photo buffer and mimetype if uploaded
    if (req.file) {
      newUser.photo = req.file.buffer;
      newUser.contentType = req.file.mimetype;
    }

    await newUser.save();

    res.status(201).json({ msg: "Signup successful", userId: newUser._id });
  } catch (err) {
    console.log("Signup error", err);
    res.status(500).json({ msg: "Signup failed" });
  }
};

// Login - return JWT token and user data with photo base64 encoded
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // Convert photo buffer to base64 for sending
    let photoBase64 = null;
    if (user.photo) {
      photoBase64 = user.photo.toString("base64");
    }

    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        photo: photoBase64,
      },
    });
  } catch (err) {
    console.log("Login error", err);
    res.status(500).json({ msg: "Login failed" });
  }
};

// Get profile - auth required, returns user data + photo base64
const getProfile = async (req, res) => {
  try {
    const user = await Employee.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let photoBase64 = null;
    if (user.photo) {
      photoBase64 = user.photo.toString("base64");
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      photo: photoBase64,
    });
  } catch (err) {
    console.log("Get profile error", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update profile - name, phone, city, and photo only
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, city } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (city) updateFields.city = city;

    if (req.file) {
      updateFields.photo = req.file.buffer;
      updateFields.contentType = req.file.mimetype;
    }

    const updatedUser = await Employee.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    let photoBase64 = null;
    if (updatedUser.photo) {
      photoBase64 = updatedUser.photo.toString("base64");
    }

    res.json({
      msg: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        city: updatedUser.city,
        photo: photoBase64,
      },
    });
  } catch (err) {
    console.log("Update profile error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
};
