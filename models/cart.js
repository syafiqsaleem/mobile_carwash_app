const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  packageSlug: { type: String, required: true },
  email: { type: String, required: true },
  addons: { type: Object, required: true },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Cart", cartSchema);
