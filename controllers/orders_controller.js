const OrdersModel = require("../models/orders");
const ProductModel = require("../models/products");
const { ProductRatingModel } = require("../models/product_ratings");

module.exports = {
  index: async (req, res) => {
    try {
      const userEmail = req.session.user.email;
      const orders = await OrdersModel.find({ email: userEmail });

      if (!orders) {
        res.redirect("/products");
      }

      res.render("orders/index", {
        orders,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/products");
    }
  },
};
