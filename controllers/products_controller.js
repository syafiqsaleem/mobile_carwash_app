const _ = require("lodash");
const { v4: uuidV4 } = require("uuid");

const AddonsModel = require("../models/addons");
const CartModel = require("../models/carts");
const ProductModel = require("../models/products");
const OrdersModel = require("../models/orders");
const ProductRatingModel = require("../models/product_ratings");
const { times } = require("lodash");

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
      products,
    });
  },
  // * @param product slug
  show: async (req, res) => {
    try {
      // * Check existing customization
      const userEmail = req.session.user.email;
      const productSlug = req.params.slug;
      const hasCart = await CartModel.findOne({ email: userEmail });

      if (hasCart) {
        res.redirect(`../../products/customize/${hasCart.productSlug}`);
        return;
      }

      const product = await ProductModel.findOne({ slug: productSlug });

      if (!product) {
        res.redirect("/products");
      }

      // const ratings = await ProductRatingModel.find({
      //   product_id: item._id,
      // }).sort({
      //   created_at: -1,
      // });

      res.render("products/show", {
        product,
      });
    } catch (error) {
      res.redirect("/products");
    }
  },
  // * @param product slug
  customize: async (req, res) => {
    try {
      const productSlug = req.params.slug;
      const userEmail = req.session.user.email;

      const addons = await AddonsModel.find();
      const product = await ProductModel.findOne({ slug: productSlug });
      const hasCart = await CartModel.findOne({ email: userEmail });

      if (hasCart) {
        const existingAddons = hasCart.addons;
        const availableAddons =
          existingAddons.length > 0
            ? addons.filter((addon) =>
                _.includes(existingAddons, { slug: addon.slug })
              )
            : addons;

        const totalAddonPrice =
          existingAddons.length > 0
            ? existingAddons
                .map((item) => item.price)
                .reduce((a, b) => a + b, 0)
            : 0;

        res.render("products/customize", {
          addons: availableAddons,
          cart: hasCart,
          product,
          totalPrice: product.price + totalAddonPrice,
        });

        return;
      }

      // * No existing cart, create new
      const cartSlug = uuidV4();

      await CartModel.create({
        slug: cartSlug,
        productSlug: product.slug,
        email: req.session.user.email,
        addons: [],
      });

      cart = await CartModel.findOne({ slug: cartSlug });

      res.render("products/customize", {
        addons,
        cart,
        product,
        totalPrice: product.price,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/products");
    }
  },
  // * @param addon slug
  addAddons: async (req, res) => {
    try {
      const addonSlug = req.params.slug;
      const userEmail = req.session.user.email;

      cart = await CartModel.findOne({ email: userEmail });

      if (!_.find(cart.addons, { slug: addonSlug })) {
        addon = await AddonsModel.findOne({ slug: addonSlug });

        if (addon) {
          await CartModel.updateOne(
            {
              slug: cart.slug,
            },
            {
              $set: {
                addons: [...cart.addons, addon],
              },
            }
          );

          res.redirect(`/products/customize/${cart.productSlug}`);

          return;
        }
      }

      throw new Error("Unable to update cart!");
    } catch (error) {
      console.log(error);
      res.statusCode = 400;
      res.send("Unable to update cart");
    }
  },
  // * @param addon slug
  deleteAddons: async (req, res) => {
    try {
      const addonSlug = req.params.slug;
      const userEmail = req.session.user.email;

      const cart = await CartModel.findOne({ email: userEmail });

      if (cart) {
        const updatedAddons = _.filter(
          cart.addons,
          (addon) => addon.slug !== addonSlug
        );

        await CartModel.updateOne(
          {
            slug: cart.slug,
          },
          {
            $set: {
              addons: updatedAddons,
            },
          }
        );

        res.redirect(`/products/customize/${cart.productSlug}`);
        return;
      }
      throw new Error("Unable to update cart!");
    } catch (error) {
      console.log(error);
      res.statusCode = 400;
      res.send("Unable to update cart");
    }
  },
  // * Finalize cart
  finalize: async (req, res) => {
    try {
      const email = req.session.user.email;

      const cart = await CartModel.findOne({ email });

      if (cart) {
        await OrdersModel.create({
          slug: uuidV4(),
          productSlug: cart.productSlug,
          email,
          addons: cart.addons,
        });
        await CartModel.deleteOne({
          slug: cart.slug,
        });

        res.redirect("/orders");

        return;
      }

      throw new Error("cart not found");
    } catch (error) {
      res.statusCode = 400;
      res.send("Unable to complete order");
    }
  },
  // * Cancel cart item
  cancel: async (req, res) => {
    try {
      const userEmail = req.session.user.email;
      await CartModel.deleteOne({ email: userEmail });

      res.redirect("/products");
    } catch (error) {
      res.statusCode(400);
      res.send("Unable to cancel order");
    }
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
