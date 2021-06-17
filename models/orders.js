const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  product: { type: Object, required: true },
  email: { type: String, required: true },
  addons: { type: Array, required: true },
});

module.exports = mongoose.model("Orders", OrdersSchema);
