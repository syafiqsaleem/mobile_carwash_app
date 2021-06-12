require("dotenv").config();
const ServiceModel = require("../../models/service");
const newSelection = require("../seedData/newSelection");
const mongoose = require("mongoose");
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
console.log(mongoURI);
let connection = null;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connResp) => {
    connection = connResp;
    return ServiceModel.insertMany(newSelection);
  })
  .then((insertResp) => {
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
