const customChoiceModel = require("../models/custom_choice");
const CollectionModel = require("../models/collection");
const _ = require("lodash");
const { result } = require("lodash");
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
        res.render("posts/sharedCollection", {
          pageTitle: "Complete Selection",
          collection: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/mobilecarwash");
      });
  },

  showNewCollectionForm: (req, res) => {
    customChoiceModel
      .findOne({
        username: req.session.user.username,
      })
      .then((result) => {
        let customChoiceCollection = result.currentCustomChoice;
        if (checkCollectionIsComplete(customChoiceCollection)) {
          res.redirect("/mobilecarwash/list");
          return;
        }
        if (!result) {
          res.redirect("/users/login");
          return;
        }
        res.render("posts/newCollection", {
          pageTitle: "Service Selection",
          service: serviceList,
          userSelection: customChoiceCollection,
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
        let customChoiceCollection = result.currentCustomChoice;
        if (!result) {
          res.redirect("/mobilecarwash/list");
          return;
        }
        customChoiceModel
          .updateOne(
            {
              username: req.session.user.username,
            },
            {
              currentCustomChoice: "",
              currentCustomChoice: { totalPrice: 0 },
            }
          )
          .then((result) => {
            CollectionModel.create({
              username: req.session.user.username,
              title: req.body.title,
              image: req.body.image,
              description: req.body.description,
              customChoice: customChoiceCollection,
            })
              .then((result) => {
                res.redirect("/collection");
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
        res.render("posts/showCollection", {
          service: serviceList,
          collection: result,
          userSelection: result.customChoice,
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

function checkCollectionIsComplete(customChoiceCollection) {
  for (let key in serviceList) {
    if (!customChoiceCollection[key]) {
      return true;
    }
  }
  return false;
}

module.exports = collectionControllers;
