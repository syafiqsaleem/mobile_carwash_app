const express = require("express");
const router = express.Router();

const ordersController = require("../controllers/orders_controller");
const {
  authenticatedOnly: authenticatedOnlyMiddleware,
} = require("../middlewares/auth-middleware");

// * index
router.get("/", authenticatedOnlyMiddleware, ordersController.index);

module.exports = router;
