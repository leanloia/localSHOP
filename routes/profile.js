const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const Business = require("../models/business");

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

profileRouter.get("/profile", async (req, res, next) => {
  const userId = req.session.currentUser._id
  try {
    let userFound = await User.findOne({ _id: userId });
        if(userFound) {
            res.render('profile/profile', {user: userFound});
            return;
        }

  } catch (error) {
      console.error(error);
      next(error);

  }
});

//GET profile/:name/edit
profileRouter.get('/profile/:id/edit', async (req, res, next) => {
    const userId = req.params.id;
    try {
        let userFound = await User.findOne({ _id: userId });
            if(userFound) {
                res.render('profile/edit-profile', {user: userFound});
                return;
            }
    
      } catch (error) {
          console.error(error);
          next(error);
    
      }
})

//POST profile/:name/edit
profileRouter.post('/profile/:id/edit', async (req, res, next) => {
    const {name, email} = req.body;
    let userId = req.session.currentUser._id;   

    try {
        let userFound = await User.findByIdAndUpdate({_id: userId}, {name, email}, {new: true});
        
        res.redirect('/profile');
        return;
        
    } catch (error) {
        console.error(error);
        next(error);
        
    }

})

module.exports = profileRouter;
