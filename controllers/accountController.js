const utilities = require("../utilities"); // Assuming utilities is a folder with an index.js file

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav(); // Assuming getNav is a function in utilities/index.js that returns navigation data
    res.render("account/login", {
      title: "Login",
      nav,
    });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
}

module.exports = { buildLogin };