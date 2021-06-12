const _ = require("lodash");
const { ProductModel } = require("../models/products");
const { ProductRatingModel } = require("../models/product_ratings");

module.exports = {
  index: async (req, res) => {
    let products = [];

    try {
      products = await ProductModel.find();
    } catch (err) {
      res.statusCode(500);
      return "server error";
    }

    res.render("products/index", {
      products: products,
    });
  },

  newForm: async (req, res) => {
    const messages = await req.consumeFlash("error");

    res.render("products/new", {
      messages: messages,
    });
  },

  show: (req, res) => {
    let product = {};

    ProductModel.findOne({ slug: req.params.slug })
      .then((item) => {
        // if item is not found, redirect to homepage
        if (!item) {
          res.redirect("/products");
          return;
        }

        product = item;

        // get product ratings from DB
        return ProductRatingModel.find({ product_id: item._id }).sort({
          created_at: -1,
        });
      })
      .then((ratings) => {
        res.render("products/show", {
          product: product,
          ratings: ratings,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/products");
      });
  },

  create: async (req, res) => {
    // validate input here
    if (!req.body.name) {
      await req.flash("error", "Name field must not be empty");

      res.redirect("/products/new");

      return;
    }

    let slug = _.kebabCase(req.body.name);

    ProductModel.create({
      type: req.body.type,
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      slug: slug,
    })
      .then((createResp) => {
        res.redirect("/products");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/products/new");
      });
  },

  editForm: (req, res) => {
    ProductModel.findOne({ slug: req.params.slug })
      .then((item) => {
        res.render("products/edit", {
          product: item,
        });
      })
      .catch((err) => {
        res.redirect("/products");
      });
  },

  update: (req, res) => {
    let newSlug = _.kebabCase(req.body.name);

    ProductModel.updateOne(
      { slug: req.params.slug },
      {
        $set: {
          type: req.body.type,
          name: req.body.name,
          price: req.body.price,
          image: req.body.image,
          slug: newslug,
        },
      }
    )
      .then((updateResp) => {
        res.redirect("/products/" + newSlug);
      })
      .catch((err) => {
        res.redirect("/products/" + req.params.slug + "/show");
      });
  },

  delete: (req, res) => {
    ProductModel.deleteOne({ slug: req.params.slug })
      .then((deleteResp) => {
        res.redirect("/products");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/products");
      });
  },
};
