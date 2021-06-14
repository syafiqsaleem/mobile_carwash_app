const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  productSlug: { type: String, required: true },
  email: { type: String, required: true },
  addons: { type: Object, required: true },
});

module.exports = mongoose.model("Orders", OrdersSchema);
