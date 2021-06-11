const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  price: {
    type: mongoose.Types.Decimal128,
    required: true,
  },
  image: {
    type: String,
  },
  properties: {},
});

const ServiceModel = mongoose.model("Service", serviceSchema);

module.exports = ServiceModel;
