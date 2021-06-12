const express = require("express");
const router = express.Router();
const productController = require("../controllers/products_controller");
const productRatingController = require("../controllers/product_ratings_controller");
const {
  authenticatedOnly: authenticatedOnlyMiddleware,
  guestOnly: guestOnlyMiddleware,
} = require("../middlewares/auth-middleware");

// index
router.get("/", productController.index);

// new
router.get("/new", productController.newForm);

// show
router.get("/:slug", productController.show);

// create
router.post("/", productController.create);

// edit
router.get("/:slug/edit", productController.editForm);

// update
router.patch("/:slug", productController.update);

// delete
router.delete("/:slug", productController.delete);

// product rating routes
router.get(
  "/:slug/ratings/new",
  authenticatedOnlyMiddleware,
  productRatingController.newForm
);

router.post(
  "/:slug/ratings",
  authenticatedOnlyMiddleware,
  productRatingController.create
);

module.exports = router;
