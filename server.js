// =======================================
//              DEPENDENCIES
// =======================================
const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const productController = require("./controllers/product_controller");
const collectionController = require("./controllers/collection_controller");
const userController = require("./controllers/user_controller");

const app = express();
const port = 3000;

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

app.use(flash({ sessionKeyName: "flash_message" }));

// setting middleware to ensure global template user variable (Set the user to an initial value of null & check the session if it's set -> auth-middleware)
app.use(setUserVarMiddleware);

// =======================================
//              ROUTES
// =======================================
// index
app.get("/", productController.index);
app.get("/mobilecarwash/list", productController.getlist);
app.patch("/mobilecarwash/:service", productController.addBuild);
app.get("/mobilecarwash/:service", productController.listProduct);
app.post("/mobilecarwash/:id", productController.addCollectionToBuild);

// new
router.get("/new", productController.newForm);

// create
router.post("/", productController.create);

// edit
router.get("/:slug/edit", productController.editForm);

// update
router.patch("/:slug", productController.update);

// delete
router.delete("/:slug", productController.delete);

// =======================================
//              LISTENER
// =======================================
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((response) => {
    app.listen(port, () => {
      console.log(`Mobile Carwash app listening on port: ${port}`);
    });
  });
