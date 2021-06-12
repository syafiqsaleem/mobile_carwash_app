const _ = require("lodash");
const moment = require("moment");
const { ProductModel } = require("../models/products");
const { ProductRatingModel } = require("../models/product_ratings");

module.exports = {
  newForm: (req, res) => {
    res.render("product-ratings/new", {
      productSlug: req.params.slug,
    });
  },

  create: (req, res) => {
    // validate rating is not empty

    let rating = Number(req.body.rating);

    // retrieve product based on slug from db
    ProductModel.findOne({ slug: req.params.slug })
      .then((productResp) => {
        if (!productResp) {
          res.redirect("/products");
          return;
        }

        const timestampNow = moment().utc();

        return ProductRatingModel.create({
          product_id: productResp._id,
          rating: rating,
          comment: req.body.comment,
          created_at: timestampNow,
          updated_at: timestampNow,
        });
      })
      .then((createRatingResp) => {
        res.redirect("/products/" + req.params.slug);
        return;
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/products");
      });
  },
};
