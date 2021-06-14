const express = require("express");
const router = express.Router();
const productController = require("../controllers/products_controller");
const productRatingController = require("../controllers/product_ratings_controller");
const {
  authenticatedOnly: authenticatedOnlyMiddleware,
} = require("../middlewares/auth-middleware");

// * index
router.get("/", authenticatedOnlyMiddleware, productController.index);

// * show product
router.get("/show/:slug", authenticatedOnlyMiddleware, productController.show);

// * customize product
router.get(
  "/customize/:slug",
  authenticatedOnlyMiddleware,
  productController.customize
);

// * add addons to cart
router.post(
  "/customize/addons/add/:slug",
  authenticatedOnlyMiddleware,
  productController.addAddons
);

// * remove addons from cart
router.delete(
  "/customize/addons/delete/:slug",
  authenticatedOnlyMiddleware,
  productController.deleteAddons
);

// * cancel purchase
router.delete(
  "/customize/cancel",
  authenticatedOnlyMiddleware,
  productController.cancel
);

// * complete purchase
router.post(
  "/customize/finalize",
  authenticatedOnlyMiddleware,
  productController.finalize
);

// * create
// router.post("/", authenticatedOnlyMiddleware, productController.create);

// * edit
// router.get("/:slug/edit", authenticatedOnlyMiddleware, productController.editForm);

// * update
// router.patch("/:slug", authenticatedOnlyMiddleware, productController.update);

// * delete
// router.delete("/:slug", authenticatedOnlyMiddleware, productController.delete);

// * product rating routes
// router.get(
// 	"/:slug/ratings/new",
// 	authenticatedOnlyMiddleware,
// 	productRatingController.newForm
// );

// router.post(
// 	"/:slug/ratings",
// 	authenticatedOnlyMiddleware,
// 	productRatingController.create
// );

module.exports = router;
