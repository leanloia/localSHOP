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
            city,
            imageUrl,
            phone,
            webpage,
            type,
            about,
            owner: req.session.currentUser._id,
        });
        res.redirect("/");
    } catch (error) {
        console.error(error);
        next(error);
    }
});

//GET business

//función auxiliar para quitar ciudades repetidas y poner la primera en mayus.
function uniquifyCities(array) {
    var cities = [];
    if (array.length === 0) {
        return undefined;
    }
    for (var i = 0; i < array.length; i++) {
        var cityUpper= array[i].city.charAt(0).toUpperCase() + array[i].city.slice(1);
        if (cities.indexOf(cityUpper) === -1) {
            cities.push(cityUpper);
        }
    }
    return cities;
}

businessRouter.get("/business", async (req, res, next) => {
    const consultaBusiness = await Business.find();
    var uniqueCities = await uniquifyCities(consultaBusiness)
    res.render("business/business", {
        business: uniqueCities
    });

});

/*       cityUpperCase = city.toUpperCase() + city.slice(1);
 */

module.exports = businessRouter;