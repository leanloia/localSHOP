const express = require("express");
const businessRouter = express.Router();
const User = require("../models/user");
const Business = require("../models/business");
const Review = require("../models/review");
const parser = require("./../config/cloudinary");

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

//GET add-business
businessRouter.get("/add-business", (req, res, next) => {
  res.render("business/add-business");
});

//POST add-business
businessRouter.post(
  "/add-business",
  parser.single("image_url"),
  async (req, res, next) => {
    const {
      name,
      streetName,
      streetNumber,
      city,
      phone,
      webpage,
      type,
      about
    } = req.body;

    const image_url = req.file ?
      req.file.secure_url :
      "/images/default-business.jpg";

    if (
      name === "" ||
      city === "" ||
      streetName === "" ||
      streetNumber === "" ||
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

      const newBussiness = await Business.create({
        name,
        streetName,
        streetNumber,
        city: formatCityName(city),
        image_url,
        phone,
        webpage,
        type,
        about,
        owner: req.session.currentUser._id,
      });

      // buscar al obj usuario que está logueado
      const addBusinessToUser = await User.findById(
        req.session.currentUser._id
      );
      //añade el nuevo business al obj
      addBusinessToUser.businessOwned.push(newBussiness);
      //cambia estado de usuario a "owner"
      addBusinessToUser.isOwner = true;
      //guarda
      addBusinessToUser.save();

      res.redirect(`/business/details/${newBussiness._id}`);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

//GET business
businessRouter.get("/business", async (req, res, next) => {
  const consultaBusiness = await Business.find();
  // toma todos los business y trae los valores (sin repetir) de las ciudades que existen
  var uniqueCities = await uniquifyCities(consultaBusiness);

  //traiga los valores según el input de ciudades y/o tipo de producto

  res.render("business/business", {
    business: uniqueCities,
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
    //traigo lista completa de ciudades
    const businessCities = await Business.find();
    //traigo lista de ciudades que coiciden con input select
    const businessFiltered = await Business.find({
      city,
      type,
    });
    //filtro con f(x) auxiliar para dejar un valor por cada ciudad (evitar que se repita si hay mas de una)
    const businessUnique = await uniquifyCities(businessCities);

    res.render("business/business", {
      bizz: businessFiltered,
      businessUnique,
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
    //declaro booleano
    let userOwner = false;
    const businessFound = await Business.findById({
      _id: businessId,
    });
    const reviewFound = await Review.find({
      commentTo: businessId
    }).populate(
      "user"
    );

    if (!req.session.currentUser) {
      res.render("business/business-details", {
        businessFound,
        reviewFound
      });
      return;
      //creo condicional para saber si el user logueado es el owner del business que intenta ver (si lo es, no renderizo en el view el form de reviews)
    } else if (businessFound.owner == req.session.currentUser._id) {
      userOwner = true;
    } else {
      userOwner = false;
    }

    if (businessFound && userOwner) {
      res.render("business/business-details", {
        businessFound,
        userOwner,
        reviewFound,
      });
      return;
    } else {
      res.render("business/business-details", {
        businessFound,
        reviewFound,
      });
      return;
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});


//POST business/details/:id
businessRouter.post("/business/details/:id", async (req, res, next) => {
  const {
    reviewTitle,
    comment
  } = req.body;
  try {
    let businessId = req.params.id;
    //primero buscamos business
    const businessFound = await Business.findById({
      _id: businessId,
    });
    const userFound = await User.findById({
      _id: req.session.currentUser._id,
    });

    //creamos instancia de Review
    const newReview = await Review.create({
      user: userFound._id,
      reviewTitle,
      comment,
      commentTo: businessFound._id,
    });

    //Empujamos id de review en objeto business que lo recibe
    businessFound.reviews.push(newReview._id);
    //Empujamos id de review en objeto user que lo realiza
    userFound.reviewsMade.push(newReview._id);
    //salvamos todo en BDD
    businessFound.save();
    userFound.save();

    res.redirect(`/business/details/${businessId}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//POST business/favourite/:id
businessRouter.post("/business/favourite/:id", async (req, res, next) => {
  const businessId = req.params.id;

  try {
    const businessFound = await Business.findById(businessId);
    if (!req.session.currentUser) {
      res.redirect("/login");
      return;
    }
    const userFound = await User.findById(req.session.currentUser._id);

    const businessUpdated = await Business.findByIdAndUpdate(businessId, [{
      $set: {
        favouriteBy: {
          $cond: [{
              $in: [userFound._id, businessFound.favouriteBy]
            },
            {
              $setDifference: [businessFound.favouriteBy, [userFound._id]]
            },
            {
              $concatArrays: [businessFound.favouriteBy, [userFound._id]]
            },
          ],
        },
      },
    }, ]);

    const userUpdated = await User.findByIdAndUpdate(userFound._id, [{
      $set: {
        favouriteBusiness: {
          $cond: [{
              $in: [businessFound._id, userFound.favouriteBusiness]
            },
            {
              $setDifference: [userFound.favouriteBusiness, [businessFound._id]]
            },
            {
              $concatArrays: [userFound.favouriteBusiness, [businessFound._id]]
            },
          ],
        },
      },
    }, ]);

    res.redirect("/business");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = businessRouter;