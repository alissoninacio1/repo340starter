const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const db = require('../database');

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

// Function to add a new classification to the database
invController.addNewClassification = async function (req, res, next) {
  try {
    const { classificationName } = req.body;
    const result = await invModel.addNewClassification(classificationName);
    res.status(201).send("New classification added successfully");
  } catch (error) {
    console.error("Error adding new classification:", error);
    next(error); 
  }
};

// Function to add a new vehicle to the database
invController.addNewVehicle = async function (req, res, next) {
  try {
    const {
      invMake,
      invModel,
      classification,
      invDescription,
      invImage,
      invThumbnail,
      invPrice,
      invYear,
      invMiles,
      invColors
    } = req.body;

    // Call the function in the model to add a new vehicle
    const result = await invModel.addNewVehicle(invMake, invModel, classification, invDescription, invImage, invThumbnail, invPrice, invYear, invMiles, invColors);

    if (result) {
      req.flash("messages", "Vehicle added successfully.");
      res.redirect("/inv"); // Redirect to management page
      req.flash("errors", "Failed to add vehicle."); // Add error message if needed
    }
  } catch (error) {
    console.error("Error adding vehicle:", error);
    next(error); 
  }
};

module.exports = invController;
