const express = require("express");
const businessRouter = express.Router();
const User = require("../models/user");
const Business = require("../models/business");

//GET add-business

businessRouter.get("/add-business", (req, res, next) => {
  res.render("business/add-business");
});

//POST add-business
businessRouter.post("/add-business", async (req, res, next) => {
  const { name, adress, imageUrl, phone, webpage, type, about } = req.body;

  if (
    name === "" ||
    adress === "" ||
    imageUrl === "" ||
    phone === "" ||
    webpage === "" ||
    type === "" ||
    about === ""
  ) {
    res.render("business/add-business", {
      errorMessage: "Please, complete the form.",
    });
    return;
  }

  try {
    const bussinessFound = await Business.findOne({
      name,
      type,
    });

    if (bussinessFound) {
      res.render("business/add-business", {
        errorMessage: "This name is already taken.",
      });
      return;
    }

    await Business.create({
      name,
      adress,
      imageUrl,
      phone,
      webpage,
      type,
      about,
      owner: req.session.currentUser._id,
    });
    res.redirect("/business/:id");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//GET business

businessRouter.get("/business", async (req, res, next) => {
  const consultaBusiness = await Business.find();
  console.log(consultaBusiness);
  res.render("business/business", { business: consultaBusiness });
  return;
});

module.exports = businessRouter;
