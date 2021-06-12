const uuid = require("uuid");
const SHA256 = require("crypto-js/sha256");
const UserModel = require("../models/users");
const EditModel = require("../models/edit");
const CollectionModel = require("../models/collection");
const { result } = require("lodash");

const userControllers = {
  showRegistrationForm: (req, res) => {
    res.render("users/register", {
      pageTitle: "Register as a User",
    });
  },

  showLoginForm: (req, res) => {
    res.render("users/login", {
      pageTitle: "User Login",
    });
  },

  register: (req, res) => {
    // validate the users input (In-progress)

    UserModel.findOne({
      username: req.body.username,
    })
      .then((result) => {
        // if found in DB, means email has already been registered, redirect to registration page
        if (result) {
          res.redirect("/users/register");
          return;
        }

        // If no result found in DB --> proceed with registration
        // generate uuid as salt
        const salt = uuid.v4();

        // hash combination using bcrypt
        const combination = salt + req.body.password;

        // hash the combination using SHA256
        const hash = SHA256(combination).toString();

        // create user in DB
        UserModel.create({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          pwsalt: salt,
          hash: hash,
        })
          .then((createResult) => {
            res.redirect("/mobilecarwash/list");
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/users/register");
          });

        customChoiceModel
          .create({
            username: req.body.username,
          })
          .then((createResult) => {
            res.redirect("/mobilecarwash/list");
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/users/register");
          });

        EditModel.create({
          username: req.body.username,
        })
          .then((createResult) => {
            res.redirect("/mobilecarwash/list");
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/users/register");
          });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/users/register");
      });
  },

  login: (req, res) => {
    // validate input (In-progress)

    // gets user with the given email
    UserModel.findOne({
      username: req.body.username,
    })
      .then((result) => {
        // check if result is empty --> empty = no user (login fail) --> redirect to login page
        if (!result) {
          console.log("err: no result");
          res.redirect("/users/login");
          return;
        }

        // combine DB user salt with given password, and apply hash algo
        const hash = SHA256(result.pwsalt + req.body.password).toString();

        // check if password is correct by comparing hashes
        if (hash !== result.hash) {
          console.log("err: hash does not match");
          res.redirect("/users/login");
          return;
        }
        req.session.user = result;
        // login successful
        res.redirect("/mobilecarwash/list");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/users/login");
      });
  },
  profile: (req, res) => {
    UserModel.findOne({
      username: req.session.user.username,
    })
      .then((userResult) => {
        if (!userResult) {
          res.redirect("/users/login");
          return;
        }
        CollectionModel.find({
          username: req.session.user.username,
        })
          .sort({ updated_at: "desc" })
          .then((postResult) => {
            if (!postResult) {
              res.redirect("/users/login");
              return;
            }
            res.render("users/profile", {
              pageTitle: "User Profile",
              info: userResult,
              post: postResult,
            });
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/users/login");
          });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/users/login");
      });
  },
  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/users/login");
  },
};

module.exports = userControllers;
