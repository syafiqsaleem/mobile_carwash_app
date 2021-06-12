const express = require("express");
const router = express.Router();
const {
  authenticatedOnly: authenticatedOnlyMiddleware,
  guestOnly: guestOnlyMiddleware,
} = require("../middlewares/auth-middleware");
const userController = require("../controllers/user_controller");

router.get("/register", guestOnlyMiddleware, userController.registerForm);

router.post("/register", guestOnlyMiddleware, userController.registerUser);

router.get("/login", guestOnlyMiddleware, userController.loginForm);

router.post("/login", guestOnlyMiddleware, userController.loginUser);

router.get("/dashboard", authenticatedOnlyMiddleware, userController.dashboard);

router.post("/logout", authenticatedOnlyMiddleware, userController.logout);

module.exports = router;
