const _ = require("lodash");
const { v4: uuidV4 } = require("uuid");

const AddonsModel = require("../models/addons");
const CartModel = require("../models/cart");
const ProductModel = require("../models/products");
const CompletedPackageModel = require("../models/completedpackage");
const { ProductRatingModel } = require("../models/product_ratings");
const addons = require("../models/addons");

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
      addons,
      products,
    });
  },

  customize: async (req, res) => {
    try {
      const addons = await AddonsModel.find();
      const package = await ProductModel.findOne({ slug: req.params.slug });

      const hasCart = CartModel.findOne({ email: req.session.user.email });

      if (hasCart) {
        res.render("/products/customize", {
          addons,
          cart: hasCart,
          package,
        });

        return;
      }

      const cartSlug = uuidV4();

      await CartModel.insertOne({
        slug: cartSlug,
        packageSlug: package.slug,
        email: req.session.user.email,
        addons: [],
      });

      cart = await CartModel.findOne({ slug: cartSlug });

      res.render("/products/customize", {
        addons,
        cart,
        package,
      });
    } catch (error) {
      res.redirect("/products");
    }
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
  // * this adds cart addons
  updateAddons: async (req, res) => {
    try {
      const cartSlug = req.params.slug;
      const addonSlug = req.body["addon-slug"];

      cart = await CartModel.findOne({ slug: cartSlug });

      if (!_.find(cart.addons, { slug: addonSlug })) {
        addon = AddonsModel.findOne({ slug: addonSlug });

        await CartModel.updateOne(
          {
            slug: cartSlug,
          },
          {
            $set: {
              addons: [...cart.addons, addon],
            },
          }
        );

        res.redirect("/products/customize/");

        return;
      }

      throw new Error("Unable to update cart!");
    } catch (error) {
      res.statusCode = 400;
      res.send("Unable to update cart");
    }
  },

  finalize: async (req, res) => {
    try {
      const cartSlug = req.params.slug;

      const cart = await CartModel.findOne({ slug: cartSlug });

      const email = req.session.user.email;

      if (cart) {
        await CompletedPackageModel.insertOne({
          slug: uuidV4(),
          email,
          packageSlug: card.packageSlug,
          addons: cart.addons,
        });
        await CartModel.deleteOne({
          slug: cart.slug,
        });

        res.redirect("/products");

        return;
      }

      throw new Error("cart not found");
    } catch (error) {
      res.statusCode = 400;
      res.send("unable to complete order");
    }
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
