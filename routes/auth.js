const express = require("express");
const authRouter = express.Router();

const User = require("../models/user");
const bcrytp = require("bcryptjs");
const saltRounds = 10;

//GET home page

authRouter.get("/", (req, res, next) => {
  res.render("localshop/index", { errorMessage: "" });
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
        "Must complete all the fields to register, please try again.",
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

module.exports = authRouter;
