const ProductModel = require("../models/services");
const UserModel = require("../models/users");
const customChoiceModel = require("../models/customChoice");
const CollectionModel = require("../models/collection");
const { result } = require("lodash");
const productList = {
  exteriorwash: "Exterior Wash",
  surfacetreatment: "Surface Treatment",
  wheels: "Wheels",
  interior: "Interior",
  leathercare: "Leather Care",
  addon: "Add On",
};

const productsControllers = {
  index: (req, res) => {
    res.render("product/index", {
      pageTitle: "PC Picker",
    });
  },
  getlist: (req, res) => {
    customChoiceModel
      .findOne({
        username: req.session.user.username,
      })
      .then((result) => {
        if (!result) {
          res.redirect("/users/login");
          return;
        }
        res.render("product/list", {
          pageTitle: "System Builder",
          product: productList,
          userBuild: result.currentBuild,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/users/login");
      });
  },
  listProduct: (req, res) => {
    let type = req.params.product;
    ProductModel.find({
      type: type,
    })
      .then((result) => {
        if (!result) {
          res.redirect("/pcpicker/list");
          return;
        }
        res.render("product/selection", {
          pageTitle: "Choose a " + productList[type],
          items: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/pcpicker/list");
      });
  },
  addBuild: (req, res) => {
    let type = req.params.product;
    const slug = req.body.item;
    customChoiceModel
      .findOne({
        username: req.session.user.username,
      })
      .then((result) => {
        if (!result) {
          res.redirect("/pcpicker/list");
          return;
        }
        let newBuild = {};
        if (result.currentBuild) {
          newBuild = result.currentBuild;
        }
        ProductModel.findOne({
          slug: slug,
        })
          .then((resultProduct) => {
            newBuild[type] = resultProduct;
            let totalNum = 0;
            for (let key in productList) {
              if (newBuild[key]) {
                let num = newBuild[key].price;
                let floatNum = parseFloat(num);
                totalNum += floatNum;
              }
            }
            newBuild.totalPrice = totalNum;
            customChoiceModel
              .updateOne(
                {
                  username: req.session.user.username,
                },
                {
                  currentBuild: newBuild,
                  updated_at: Date.now(),
                }
              )
              .then((result) => {
                res.redirect("/pcpicker/list");
              })
              .catch((err) => {
                console.log(err);
                res.redirect("/pcpicker/list");
              });
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/pcpicker/list");
          });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/pcpicker/list");
      });
  },
  addCollectionToBuild: (req, res) => {
    const id = req.params.id;
    CollectionModel.findOne({
      _id: id,
    })
      .then((result) => {
        if (!result) {
          res.redirect("/collection");
          return;
        }
        let newBuild = result.build;
        customChoiceModel
          .updateOne(
            {
              username: req.session.user.username,
            },
            {
              currentBuild: newBuild,
            }
          )
          .then((result) => {
            res.redirect("/pcpicker/list");
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

module.exports = productsControllers;
