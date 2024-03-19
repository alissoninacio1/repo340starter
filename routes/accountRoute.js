const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Route to deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to deliver registration view
//router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.get("/signup", utilities.handleErrors(accountController.buildRegister));

module.exports = router;