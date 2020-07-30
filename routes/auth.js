const express = require("express");
const authRouter = express.Router();

const User = require("../models/user");
const bcrytp = require("bcryptjs");
const { render } = require("../app");
const saltRounds = 10;

// GET sign up
authRouter.get("/signup", (req, res, next) => {
  res.render("auth/signup", { errorMessage: "" });
});

// POST sign up -> toma valores de formularios para registrar al usuario
authRouter.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;

  //comprobar que el usuario haya escrito contraseña y pass
  if (name === "" || email === "" || password === "") {
    res.json( {
      errorMessage: "Must complete all of the fields, please try again.",
    });
    return;
  }

  try {
    //comprobar que no hay otro usuario con el mismo email en BDD
    const userFound = await User.findOne({ email });

    if (userFound) {
      res.json( {
        errorMessage: "This email is already register.",
      });
      return;
    }

    //si no existe en email, continuo con registro
    //primero encripto password antes de guardarlo
    const salt = bcrytp.genSaltSync(saltRounds);
    const hashPass = bcrytp.hashSync(password, salt);

    //ahora guardo en BDD
    await User.create({ name, email, password: hashPass });
    // res.redirect("/login");
  } catch (error) {
    res.json( {
      errorMessage: "Something happened, please try again.",
    });
  }
});

// GET login
authRouter.get("/login", (req, res, next) => {
  res.render("auth/login", { errorMessage: "" });
});

//POST login

authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (email === "" || password === "") {
      res.render("auth/login", {
        errorMessage: "Must complete both fields to login, please try again.",
      });
    }

    const userFound = await User.findOne({ email });
    if (!userFound) {
      res.render("auth/login", {
        errorMessage:
          "This email its not registered, please try with another one.",
      });
      return;
    }

    if (!bcrytp.compareSync(password, userFound.password)) {
      res.render("auth/login", { errorMessage: "Invalid password." });
      return;
    }

    req.session.currentUser = userFound;
    res.redirect("/");
  } catch (error) {
    res.render("auth/login", {
      errorMessage: "Something happened, please try again.",
    });
  }
});

//GET logout

authRouter.get("/logout", (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect("/");
    return;
  }

  req.session.destroy((err) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect("/");
  });
});

module.exports = authRouter;
