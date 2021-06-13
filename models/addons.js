const mongoose = require("mongoose");

const addonsSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Addon", addonsSchema);
