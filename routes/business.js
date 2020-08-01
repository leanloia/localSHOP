const express = require("express");
const businessRouter = express.Router();
const User = require("../models/user");
const Business = require("../models/business");

//funciones auxiliares :D

//función para poner el nombre de las ciudades primera mayus (e.g. Barcelona, Girona)
let formatCityName = (str) => {
  let newStr = str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
  return newStr;
};

//función auxiliar para quitar ciudades repetidas

function uniquifyCities(array) {
  var cities = [];
  if (array.length === 0) {
    return undefined;
  }
  for (var i = 0; i < array.length; i++) {
    if (cities.indexOf(array[i].city) === -1) {
      cities.push(array[i].city);
    }
  }
  return cities;
}

//función para el populate Business-User
getUserwithBusiness = (id) => {
  User.findById(id)
    .populate('businesses')
}

//GET add-business
businessRouter.get("/add-business", (req, res, next) => {
  res.render("business/add-business");
});

//POST add-business
businessRouter.post("/add-business", async (req, res, next) => {
  const {
    name,
    adress,
    city,
    imageUrl,
    phone,
    webpage,
    type,
    about,
  } = req.body;

  if (
    name === "" ||
    adress === "" ||
    city === "" ||
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
      city: formatCityName(city),
      imageUrl,
      phone,
      webpage,
      type,
      about,
      owner: req.session.currentUser._id,
    });
    console.log('hhhhhhhhhhhhhhhhhhh', req.session.currentUser._id)
    await getUserwithBusiness(req.session.currentUser._id);

    res.redirect("/");

  } catch (error) {
    console.error(error);
    next(error);
  }
});



//GET business
businessRouter.get("/business", async (req, res, next) => {
  const consultaBusiness = await Business.find();
  // toma todos los business y trae los valores (sin repetir) de las ciudades que existen
  var uniqueCities = await uniquifyCities(consultaBusiness);

  //traiga los valores según el input de ciudades y/o tipo de producto

  res.render("business/business", {
    business: uniqueCities
  });
});

//POST business

businessRouter.post("/business", async (req, res, next) => {
  //definimos constantes por input de filtro

  try {
    const {
      city,
      type
    } = req.body;

    const businessFiltered = await Business.find({
      city,
      type
    });

    res.render("business/business", {
      bizz: businessFiltered
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//GET business/details/:id
businessRouter.get("/business/details/:id", async (req, res, next) => {
  let businessId = req.params.id;

  try {
    const businessFound = await Business.findById({
      _id: businessId
    });
    console.log("HOLAAAAAAAAAAAAA", businessFound);
    if (businessFound) {
      res.render('business/business-details', {
        businessFound
      })
      return;
    }

  } catch (error) {
    console.error(error);
    next(error);
  }
});



module.exports = businessRouter;