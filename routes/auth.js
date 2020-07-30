const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const Business = require("../models/business")
const bcrytp = require("bcryptjs");
const saltRounds = 10;

//GET home page

authRouter.get("/", (req, res, next) => {
  res.render("index", { errorMessage: "" });
});

// GET signup page

authRouter.get("/signup", (req, res, next) => {
  res.render("localshop/signup", { errorMessage: "" });
});

// POST signup page

authRouter.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;

  //comprueba que todos los campos esten completos
  if (name === "" || email === "" || password === "") {
    res.render("localshop/signup", {
      errorMessage:
        "Must complete all the fields to sign up, please try again.",
    });
  }
  try {
    //comprueba que email exista como usuario registrado
    const userFound = await User.findOne({ email });
    if (userFound) {
      res.render("localshop/signup", {
        errorMessage: "This email adress is already taken.",
      });
      return;
    }

    //si email no existe, continua el registro encriptando el password
    const salt = bcrytp.genSaltSync(saltRounds);
    const hashPass = bcrytp.hashSync(password, salt);

    //se guarda en la BDD con el resto de información

    const newUser = { name, email, password: hashPass };

    await User.create(newUser);
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//GET login page

authRouter.get("/login", (req, res, next) => {
  res.render("localshop/login", { errorMessage: "" });
});

//POST login page
authRouter.post("/login", async (req, res, next) => {
  //traemos valores de input de login page
  const { email, password } = req.body;
  
  try {
    if (email === "" || password === "") {
      res.render("localshop/login", {
        errorMessage:
          "Must complete all the fields to log in, please try again.",
      });
    }
    //corroborar que los campos esten completos

    //chequear si existe mail en BDD

    const userFound = await User.findOne({ email });
    //en caso de que el email no exista
    if (!userFound || userFound == '') {
      res.render("localshop/login", {
        errorMessage: `This email adress doesn't exist, please sign up.`,
      });
      return;
    }

    //si existe, corroboramos que el password coincida con el guardado en BDD

    if (!bcrytp.compareSync(password, userFound.password)) {
      res.render("localshop/login", { errorMessage: "Invalid password." });
      return;
    }
    //creamos una session y un currentUser = al usuario que se loguea
    //guardamos sesion en BDD
    (req.session.currentUser = userFound); 
    res.redirect("/");
  } 
  
  catch (error) {
    console.error(error);
    next(next);
  }
});

//GET add-business

authRouter.get('/add-business', (req, res, next) => {
  res.render('localshop/add-business');
});

//POST add-business
authRouter.post('/add-business', async (req, res, next) => {
  const { name, adress, imageUrl, phone, webpage, type, about } = req.body;
  
  if (name === '' || adress === '' || imageUrl === '' || phone === '' || webpage === '' || type === '' || about === '') {
    res.render('localshop/add-business', {errorMessage: 'Please, complete the form.'});
    return;
  }
  
  try {
    const bussinessFound = await Business.findOne({name, type})
  
    if (bussinessFound) {
      res.render("localshop/add-business", {
        errorMessage: "This name is already taken.",
      });
      return;
    }
    
    await Business.create({name, adress, imageUrl, phone, webpage, type, about, owner: req.session.currentUser._id})
    res.redirect('/business/:id');
    
    
  } catch (error) {
    console.error(error);
    next(error);
  }

  

})



module.exports = authRouter;
