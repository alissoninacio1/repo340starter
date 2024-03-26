const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')
const accountController = require("../controllers/accountController");


const crypto = require('crypto');

/* ***************************
 *  GET
 * ************************** */



// Route to deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver registration view
router.get("/signup", utilities.handleErrors(accountController.buildRegister));

// Default route for account management page
router.get('/', utilities.checkJWTToken, utilities.handleErrors(accountController.showAccountManagement));





/* ***************************
*  POST
* ************************** */

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(), // Remove the parentheses
  regValidate.checkLoginData(),
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(), // Remove the parentheses
  regValidate.checkLoginData(),
  utilities.handleErrors(accountController.accountLogin)
);


module.exports = router;
