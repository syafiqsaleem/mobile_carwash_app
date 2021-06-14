const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  services: { type: Object, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
