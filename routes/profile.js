const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const Business = require("../models/business");
const Review = require('../models/review')
const parser = require("./../config/cloudinary");

//Comprobación de logueo, ruta privada para usuarios logueados
profileRouter.use((req, res, next) => {
  if (req.session.currentUser) {
    next();
    return;
  } else {
    res.redirect("/login");
  }
});

//GET profile/:name page

profileRouter.get('/profile', async (req, res, next) => {
  const userId = req.session.currentUser._id;
  try {
    let userFound = await User.findOne({
      _id: userId
    });
    let businessFound = await Business.find({
      owner: userId
    });
    let reviewFound = await Review.find({
        user: userId
      })
/*       .populate('user')
 */    if (businessFound && userFound && reviewFound) {
      console.log('REVIEEEEW', reviewFound)
      res.render('profile/profile', {
        user: userFound,
        business: businessFound,
        review: reviewFound,
      });
      return;
    } else if (!businessFound) {
      res.render('profile/profile', {
        user: userFound,
        review: reviewFound,
      });
      return;
    } else if (!reviewFound) {
      res.render('profile/profile', {
        user: userFound,
        business: businessFound,
      });
      return;
    }
    if (userFound) {
      res.render('profile/profile', {
        user: userFound
      });
      return;
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//GET profile/:name/edit
profileRouter.get("/profile/:id/edit", async (req, res, next) => {
  const userId = req.params.id;
  try {
    let userFound = await User.findOne({
      _id: userId
    });
    let businessFound = await Business.find({
      owner: userId
    });
    if (businessFound && userFound) {
      res.render("profile/edit-profile", {
        user: userFound,
        business: businessFound,
      });
      return;
    } else if (!businessFound) {
      res.render("profile/edit-profile", {
        user: userFound
      });
      return;
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//POST profile/:name/editUser
profileRouter.post("/profile/:id/editUser", parser.single("profilePic"), async (req, res, next) => {
  const profilePic = req.file ? req.file.secure_url : req.session.currentUser.profilePic
  const {
    name,
    email
  } = req.body;
  let userId = req.session.currentUser._id;

  try {
    let userFound = await User.findByIdAndUpdate({
      _id: userId
    }, {
      name,
      email,
      profilePic
    }, {
      new: true
    });

    res.redirect("/profile");
    return;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//POST profile/:name/editBusiness
profileRouter.post("/profile/:id/editBusiness/:businessId", parser.single("image_url"), async (req, res, next) => {
  try {
    const {
      name,
      adress,
      city,
      phone,
      webpage,
      about
    } = req.body;
    console.log('HolaAAAAAAAAAAAAAA!!!!!!', req.body)

    const businessFound = await Business.findById(req.params.businessId);

    const image_url = req.file ? req.file.secure_url : businessFound.image_url
    const businessToUpdt = await Business.findByIdAndUpdate(businessFound._id, {
      adress,
      city,
      image_url,
      phone,
      webpage,
      about
    }, {
      new: true
    });


    res.redirect("/profile");
    return;

  } catch (error) {
    console.error(error);
    next(error);
  }
});


//POST Delete-Review
profileRouter.post('/profile/delete/review/:id', async (req, res, next) => {
  const reviewId = req.params.id;
  try {
    const deleteReview = await Review.findByIdAndRemove(reviewId)
    res.redirect('/profile')
  } catch (error) {
    console.error(error);
    next(error);
  }
});


//POST Delete-Business
profileRouter.post('/profile/:id/delete', async (req, res, next) => {
  const businessId = req.params.id;
  try {
    const deleteBusiness = await Business.findByIdAndRemove(businessId)
    res.redirect('/profile')
  } catch (error) {
    console.error(error);
    next(error);
  }
});




module.exports = profileRouter;
