const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, max: 100 },
  last_name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, unique: true, max: 100 },
  pwsalt: { type: String },
  hash: { type: String, required: true },
  addresses: [
    {
      address: { type: String, required: true },
      postal: { type: String, required: true },
    },
  ],
  created_at: { type: Date },
  updated_at: { type: Date },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel: UserModel,
};
