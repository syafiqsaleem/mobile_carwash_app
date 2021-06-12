const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = {
  ProductModel: ProductModel,
};
