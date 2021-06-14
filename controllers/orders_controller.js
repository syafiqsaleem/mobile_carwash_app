const OrdersModel = require("../models/orders");

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
      res.redirect("/products");
    }
  },
};
