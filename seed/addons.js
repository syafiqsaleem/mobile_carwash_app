require("dotenv").config();
const mongoose = require("mongoose");
const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");

const addonsSeedData = require("../models/seedData/addons");
const AddonsModel = require("../models/addons");

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

const addons = addonsSeedData.map((item) => {
  item.slug = uuidv4();
  return item;
});

let connection = null;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connResp) => {
    connection = connResp;
    return AddonsModel.insertMany(addons);
  })
  .then(() => {
    console.log("successful data insertion");
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    if (connection !== null) {
      connection.disconnect();
    }
  });
