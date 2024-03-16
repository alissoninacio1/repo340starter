const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invController = {};

// Function to handle building inventory by classification view
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error building inventory by classification:", error);
    next(error); // Pass the error to the next middleware
  }
};

// Function to handle building inventory item detail view
invController.buildViewVehicleDetail = async function (req, res, next) {
  try {
    const vehicle_id = req.params.id;
    const data = await invModel.retrieveVehicleDataById(vehicle_id);
    const grid = await utilities.buildVehicleDetailView(data);
    let nav = await utilities.getNav();

    if (data.length > 0) {
      const vehicleTitle = `${data[0].inv_make} ${data[0].inv_model}`;
      res.render('inventory/detail', { 
        title: vehicleTitle, 
        nav, 
        grid, 
      });
    } else {
      res.status(404).send('Vehicle not found');
    }
  } catch (error) {
    console.error("Error building vehicle detail:", error);
    next(error); 
  }
};

module.exports = invController;
