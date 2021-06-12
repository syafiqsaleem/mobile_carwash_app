require("dotenv").config();
const mongoose = require("mongoose");
const _ = require("lodash");
const productData = require("../models/seedData/newSelection");
const { ProductModel } = require("../models/products");

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

productData = productData.map((item) => {
  item.slug = _.kebabCase(item.name);
  return item;
});

let connection = null;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connResp) => {
    connection = connResp;
    return ProductModel.insertMany(productData);
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
