const express = require("express");
const laundryAuth = express.Router();
const User = require("../models/user");
const LaundryPickup = require("../models/laundry-pickup");
const router = require(".");

laundryAuth.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  }

  res.redirect("/login");
});

//GET dashboard
laundryAuth.get("/dashboard", (req, res, next) => {
  let query;

  if (req.session.currentUser.isLaunderer) {
    query = { launderer: req.session.currentUser._id };
  } else {
    query = { user: req.session.currentUser._id };
  }

  LaundryPickup.find(query)
    .populate("user", "name")
    .populate("launderer", "name")
    .sort("pickupDate")
    .exec((err, pickupDocs) => {
      if (err) {
        next(err);
        return;
      }
      res.render("laundry/dashboard", { pickups: pickupDocs });
    });
});

//POST launderers

laundryAuth.post("/launderers", async (req, res, next) => {
  const userId = req.session.currentUser._id;
  const laundererInfo = {
    fee: req.body.fee,
    isLaunderer: true,
  };
  try {
    const foundUser = await User.findByIdAndUpdate(userId, laundererInfo, {
      new: true,
    });

    req.session.currentUser = foundUser;
    res.redirect("/dashboard");
  } catch (error) {
    next(error);
    return;
  }
});

//GET lauderers

laundryAuth.get("/launderers", async (req, res, next) => {
  try {
    const launderersUsers = await User.find({
        $and : [
            {isLaunderer: true},
            {_id: {$ne : req.session.currentUser._id}}
        ]
    })
    if (launderersUsers) {
      res.render("laundry/launderers", {
        launderers: launderersUsers,
      });
    }
  } catch (error) {
    next(error);
    return;
  }
});

//GET launderers id
laundryAuth.get("/launderers/:id", async (req, res, next) => {
  try {
    const laundererId = req.params.id;
    const launderer = await User.findByIdAndUpdate(laundererId);
    if (launderer) {
      res.render("laundry/launderer-profile", { theLaunderer: launderer });
    }
  } catch (error) {
    next(error);
    return;
  }
});

//POST launderers pickup

laundryAuth.post("/laundry-pickups", async (req, res, next) => {
  const pickupInfo = {
    pickupDate: req.body.pickupDate,
    launderer: req.body.laundererId,
    user: req.session.currentUser._id,
  };
  const thePickup = new LaundryPickup(pickupInfo);
  try {
    thePickup.save();
    res.redirect("/dashboard");
  } catch (error) {
    next(error);
    return;
  }
});

module.exports = laundryAuth;
