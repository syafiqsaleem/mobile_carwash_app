// =======================================
//              DEPENDENCIES
// =======================================
require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const { setUserVarMiddleware } = require("./middlewares/auth-middleware");
const productController = require("./controllers/product_controller");
const collectionController = require("./controllers/collection_controller");
const userController = require("./controllers/user_controller");

const app = express();
const port = 3000;
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// set the view engine that express will use
app.set("view engine", "ejs");

// setting middleware to accept json and urlencoded request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting middleware to accept spoofed methods based on _method query parameter
app.use(methodOverride("_method"));

// setting up middleware to support session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: "user_session",
    resave: false,
    saveUninitialized: false,
    cookie: { path: "/", secure: false, maxAge: 3600000 }, // 3600000ms = 3600s = 60mins, cookie expires in an hour
  })
);

// app.use(flash({ sessionKeyName: "flash_message" }));

// setting middleware to ensure global template user variable (Set the user to an initial value of null & check the session if it's set -> auth-middleware)
app.use(setUserVarMiddleware);

// =======================================
//              ROUTES
// =======================================
//Product Controllers
app.get("/", authenticatedOnly, productController.index);
app.get(
  "/mobilecarwash/list",
  authenticatedOnly,
  productController.displayList
);
app.patch(
  "/mobilecarwash/:service",
  authenticatedOnly,
  productController.addCustomChoice
);
app.get(
  "/mobilecarwash/:service",
  authenticatedOnly,
  productController.listService
);
app.post(
  "/mobilecarwash/:id",
  authenticatedOnly,
  productController.addSelectionToCollection
);

// Collection Controllers
app.get("/collection", authenticatedOnly, collectionController.collection);
app.get(
  "/collection/new",
  authenticatedOnly,
  collectionController.showNewCollectionForm
);
app.get(
  "/collection/:id",
  authenticatedOnly,
  collectionController.showCollection
);
app.post("/collection", authenticatedOnly, collectionController.newCollection);
app.delete(
  "/collection/:id",
  authenticatedOnly,
  collectionController.deleteCollection
);

// User Controllers
app.get("/users/register", guestOnly, userController.showRegistrationForm);
app.post("/users/register", guestOnly, userController.register);
app.get("/users/login", guestOnly, userController.showLoginForm);
app.post("/users/login", guestOnly, userController.login);
app.get("/users/profile", authenticatedOnly, userController.profile);
app.post("/users/logout", userController.logout);

// =======================================
//              LISTENER
// =======================================
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => {
    console.log("DB connection is successful");
    app.listen(port, () => {
      console.log(`Mobile Carwash app listening on localhost: ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
