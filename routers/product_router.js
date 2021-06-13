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

// customize package
router.get("/customize", productController.customize);

// update cart for addons
router.patch("/customize/update/addons/:slug", productController.updateAddons);

router.post("/product/finalize/:slug", productController.finalize);

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
