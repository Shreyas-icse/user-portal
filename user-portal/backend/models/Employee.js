const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Employee", employeeSchema);
