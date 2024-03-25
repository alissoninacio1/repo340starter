const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}





/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    console.log(data)
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


// Prupose: builds the vehicle detail view  
Util.buildVehicleDetailView = async function(data) {
  let grid = '';

  if (data.length > 0) {
      data.forEach(vehicle => {
    
          grid += '<div class="vehicle-detail-card__container">'; 
          grid += `<div class="vehicle-detail-card__content">` 
          grid += `<div class="vehicle-detail-card__image-container">` 
          grid += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-detail-card__image">`;
          grid += '</div>';          
          grid += `<div class="vehicle-detail-card__text">`
          grid += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`; 
          grid += `<p><span>Price:</span> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`;
          grid += `<p><span>Description:</span> ${vehicle.inv_description}</p>`; 
          grid += `<p><span>Color:</span> ${vehicle.inv_color}</p>`; 
          grid += `<p><span>Mileage:</span> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>`;
          grid += `</div>`; 
          grid += `</div>`;
          grid += '</div>'; 
      });
  } else {
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  return grid;
};

/* ***************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)





Util.buildClassificationList = async function () {
  try {
    const data = await invModel.getClassifications();
    const classificationList = data.rows.map(row => ({
      id: row.classification_id,
      name: row.classification_name
    }));
    return classificationList;
  } catch (error) {
    throw new Error("Error building classification list: " + error.message);
  }
};

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }




module.exports = Util