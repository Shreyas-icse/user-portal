const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    default: null,
  },

  city: {
    type: String,
  },

  photo: {
    type: Buffer, // Binary photo data
  },

  contentType: {
    type: String, // MIME type (e.g., "image/jpeg")
  },

  workType: {
    type: String,
    required: true, // you can make it optional by removing this
    enum: ["Plumber", "Electrician", "Carpenter", "Mason", "Painter", "Welder", "Mechanic", "Cleaner", "Gardener", "Construction Worker", "Driver", "AC Technician", "Tailor", "Housekeeper", "Cook", "Security Guard", "Delivery Boy", "Helper", "Loader", "Other"], // optional constraint
  },

  salaryPerDay: {
    type: Number,
    required: true,
    min: 0,
  },
  locationLat: {
    type: Number,
    default: null,
  },
  locationLng: {
    type: Number,
    default: null,
  },
  locationAccuracy: {
    type: Number,
    default: null,
  },
  locationUpdatedAt: {
    type: Date,
  },
  location: {
    type: String, // manual address entered by worker
    default: '',
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Worker", workerSchema);
