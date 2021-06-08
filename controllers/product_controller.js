const ServiceModel = require("../models/services");
const customChoiceModel = require("../models/custom_choice");
const CollectionModel = require("../models/collection");
const _ = require("lodash");
const serviceList = {
  exteriorwash: "Exterior Wash",
  surfacetreatment: "Surface Treatment",
  wheels: "Wheels",
  interior: "Interior",
  leathercare: "Leather Care",
  addon: "Add On",
};

const productController = {
  index: (req, res) => {
    res.render("product/index", {
      pageTitle: "MOBILECARWASH",
    });
  },

  displayList: (req, res) => {
    customChoiceModel
      .findOne({
        username: req.session.user.username,
      })
      .then((result) => {
        if (!result) {
          res.redirect("/users/login");
          return;
        }
        res.render("service/list", {
          pageTitle: "Service Selection",
          service: serviceList,
          userSelection: result.currentSelection,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/users/login");
      });
  },

  listService: (req, res) => {
    let type = req.params.service;
    ServiceModel.find({
      type: type,
    })
      .then((result) => {
        if (!result) {
          res.redirect("/mobilecarwash/list");
          return;
        }
        res.render("service/selection", {
          pageTitle: "Choose a " + serviceList[type],
          items: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/mobilecarwash/list");
      });
  },

  addCustomChoice: (req, res) => {
    let type = req.params.service;
    const slug = req.body.item;
    customChoiceModel
      .findOne({
        username: req.session.user.username,
      })
      .then((result) => {
        if (!result) {
          res.redirect("/mobilecarwash/list");
          return;
        }
        let newSelection = {};
        if (result.currentSelection) {
          newSelection = result.currentSelection;
        }
        ServiceModel.findOne({
          slug: slug,
        })
          .then((resultService) => {
            newSelection[type] = resultService;
            let totalNum = 0;
            for (let key in serviceList) {
              if (newSelection[key]) {
                let num = newSelection[key].price;
                let floatNum = parseFloat(num);
                totalNum += floatNum;
              }
            }
            newSelection.totalPrice = totalNum;
            customChoiceModel
              .updateOne(
                {
                  username: req.session.user.username,
                },
                {
                  currentSelection: newSelection,
                  updated_at: Date.now(),
                }
              )
              .then((result) => {
                res.redirect("/mobilecarwash/list");
              })
              .catch((err) => {
                console.log(err);
                res.redirect("/mobilecarwash/list");
              });
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/mobilecarwash/list");
          });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/mobilecarwash/list");
      });
  },

  addSelectionToCollection: (req, res) => {
    const id = req.params.id;
    CollectionModel.findOne({
      _id: id,
    })
      .then((result) => {
        if (!result) {
          res.redirect("/collection");
          return;
        }
        let newSelection = result.selection;
        customChoiceModel
          .updateOne(
            {
              username: req.session.user.username,
            },
            {
              currentSelection: newSelection,
            }
          )
          .then((result) => {
            res.redirect("/mobilecarwash/list");
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/collection/" + id);
          });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/collection");
      });
  },
};

module.exports = productController;
