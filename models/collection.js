const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    max: 100,
  },
  username: {
    type: String,
    required: true,
    max: 100,
  },
  image: String,
  description: String,
  likes: [String],
  comments: [
    {
      username: {
        type: String,
        required: true,
        max: 100,
      },
      content: {
        type: String,
        required: true,
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
    },
  ],
  customChoice: {},
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
});

const CollectionModel = mongoose.model("Collection", collectionSchema);

module.exports = CollectionModel;
