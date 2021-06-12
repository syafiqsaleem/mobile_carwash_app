const customChoiceModel = require("../models/custom_choice");
const UserModel = require("../models/users");
const EditModel = require("../models/edit");
const CollectionModel = require("../models/collection");
const moment = require("moment");
const { result } = require("lodash");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

        const timestampNow = moment().utc();
        // If no result found in DB --> proceed with registration
        // hashing using bcrypt
        const generatedHash = await bcrypt.hash(req.body.password, saltRounds);

        // create user in DB
        UserModel.create({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          hash: generatedHash,
          created_at: timestampNow,
          updated_at: timestampNow,
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

  login: async (req, res) => {
    let user = null;

    try {
      user = await UserModel.findOne({ username: req.body.username });
    } catch (err) {
      console.log(err);
      res.redirect("/users/register");
      return;
    }

    if (!user) {
      res.redirect("/users/register");
      return;
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.hash);

    if (!isValidPassword) {
      res.redirect("/users/register");
      return;
    }

    req.session.user = user;
    res.redirect("/mobilecarwash/list");
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
