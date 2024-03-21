const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController");
const checkIfUserExists = require("../controllers/accountController")

const crypto = require('crypto');

// Route to deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver registration view
router.get("/signup", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// home redirection after login, or register
router.post("/login", (req, res) => {
  // Redirect to home page upon clicking the login button
  //database authentication will be made later
  res.redirect('/');
});


module.exports = router;
