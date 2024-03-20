const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController");

// Route to deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver registration view
router.get("/signup", utilities.handleErrors(accountController.buildRegister));

//Route to send the fomr and register in the DB
router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

module.exports = router;
