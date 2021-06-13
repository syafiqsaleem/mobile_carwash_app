const mongoose = require("mongoose");

const CompletedPackageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  packageSlug: { type: Object, required: true },
  addons: { type: Objects, required: true },
});

module.exports = mongoose.model("CompletedPackage", CompletedPackageSchema);
