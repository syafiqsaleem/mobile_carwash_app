const mongoose = require("mongoose");

const customChoiceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    max: 100,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  currentChoice: {
    exteriorWash: {},
    surfaceTreatment: {},
    wheels: {},
    interior: {},
    leatherCare: {},
    addOn: {},
    totalPrice: {
      type: mongoose.Types.Decimal128,
      default: 0,
    },
  },
});

const customChoiceModel = mongoose.model("customChoice", customChoiceSchema);

module.exports = customChoiceModel;
