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
const collectionControllers = {
  collection: (req, res) => {
    CollectionModel.find()
      .sort({ updated_at: "desc" })
      .then((result) => {
        res.render("posts/collection", {
          pageTitle: "Complete Builds",
          collection: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/gpupicker");
      });
  },
  showNewCollectionForm: (req, res) => {
    customChoiceModel
      .findOne({
        username: req.session.user.username,
      })
      .then((result) => {
        let buildCollection = result.currentBuild;
        if (checkCollectionIsComplete(buildCollection)) {
          res.redirect("/pcpicker/list");
          return;
        }
        if (!result) {
          res.redirect("/users/login");
          return;
        }
        res.render("posts/new", {
          pageTitle: "System Builder",
          product: productList,
          userBuild: buildCollection,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/users/login");
      });
  },
  newCollection: (req, res) => {
    customChoiceModel
      .findOne({
        username: req.session.user.username,
      })
      .then((result) => {
        let buildCollection = result.currentBuild;
        if (!result) {
          res.redirect("/pcpicker/list");
          return;
        }
        customChoiceModel
          .updateOne(
            {
              username: req.session.user.username,
            },
            {
              currentBuild: "",
              currentBuild: { totalPrice: 0 },
            }
          )
          .then((result) => {
            CollectionModel.create({
              username: req.session.user.username,
              title: req.body.title,
              image: req.body.image,
              description: req.body.description,
              build: buildCollection,
            })
              .then((result) => {
                res.redirect("/collection");
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
  giveLike: (req, res) => {
    const id = req.params.id;
    CollectionModel.findOne({
      _id: id,
    })
      .then((result) => {
        if (!result) {
          res.redirect("/collection");
          return;
        }
        let arrayLike = result.likes;
        let user = req.session.user.username;
        if (checkLike(arrayLike, user)) {
          _.remove(arrayLike, function (n) {
            return n == user;
          });
        } else {
          arrayLike.push(user);
        }
        CollectionModel.updateOne(
          {
            _id: id,
          },
          {
            likes: arrayLike,
          }
        )
          .then((result) => {
            res.redirect("/collection/" + id);
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/collection");
          });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/collection");
      });
  },

  giveComment: (req, res) => {
    const id = req.params.id;
    CollectionModel.findOne({
      _id: id,
    })
      .then((result) => {
        if (!result) {
          res.redirect("/collection");
          return;
        }
        CollectionModel.updateOne(
          {
            _id: id,
          },
          {
            $push: {
              comments: {
                username: req.session.user.username,
                content: req.body.comment,
              },
            },
          }
        )
          .then((result) => {
            res.redirect("/collection/" + id);
          })
          .catch((err) => {
            console.log(err);
            res.redirect("/collection");
          });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/collection");
      });
  },

  showCollection: (req, res) => {
    const id = req.params.id;
    CollectionModel.findOne({
      _id: id,
    })
      .then((result) => {
        if (!result) {
          res.redirect("/collection");
          return;
        }
        res.render("posts/show", {
          product: productList,
          collection: result,
          userBuild: result.build,
          pageTitle: "",
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/collection");
      });
  },

  deleteCollection: (req, res) => {
    const id = req.params.id;
    CollectionModel.findOne({
      _id: id,
    })
      .then((result) => {
        if (!result) {
          res.redirect("/collection");
          return;
        }
        CollectionModel.deleteOne({
          _id: id,
        })
          .then((result) => {
            res.redirect("/collection");
          })
          .catch((result) => {
            res.redirect("/collection");
          });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/collection");
      });
  },
};

// function checkCollectionIsComplete(buildCollection) {
//     for (let key in productList) {
//         if (!buildCollection[key]) {
//             return true
//         }
//     }
//     return false
// }

// function checkLike(array, user) {
//     for (let i = 0; i < array.length; i++) {
//         if (user === array[i]) {
//             return true
//         }
//     }
//     return false
// }

module.exports = collectionControllers;
