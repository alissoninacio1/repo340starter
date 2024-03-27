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

invController.addNewVehicle = async function (req, res, next) {
  try {
    // Extract form data from request body
    const { invMake, invModel, classification, invDescription, invImage, invThumbnail, invPrice, invYear, invMiles, invColors } = req.body;

    // Check if invColors is provided and not empty
    if (!invColors || invColors.trim() === '') {
      throw new Error('Vehicle color is required');
    }

    // Insert the new vehicle into the database
    const result = await inventoryModel.addNewVehicle(invMake, invModel, classification, invDescription, invImage, invThumbnail, invPrice, invYear, invMiles, invColors);

    // Check if the insertion was successful
    if (result) {
      // Redirect to the inventory page or any other relevant page
      res.redirect('/inventory');
    } else {
      // If insertion failed, render the form again with an error message
      res.render('add-inventory', { errors: ['Failed to add the vehicle. Please try again.'] });
    }
  } catch (error) {
    // Handle any errors
    if (error.message === 'Vehicle color is required') {
      // If vehicle color is not provided, render the form again with an error message
      res.render('add-inventory', { errors: [error.message] });
    } else {
      // If any other error occurs, pass it to the error handling middleware
      next(error);
    }
  }
};



// Function to deliver the delete confirmation view
invController.getDeleteConfirmation = async (req, res, next) => {
  try {
    const inv_id = req.params.inv_id;
    const nav = await utilities.getNav();
    const inventoryItem = await invModel.getInventoryItem(inv_id); // Assuming you have a getInventoryItem function in your model
    const name = inventoryItem.make + " " + inventoryItem.model;
    res.render("inventory/delete-confirm", {
      title: "Confirm Deletion",
      nav,
      errors: null, // Assuming no errors for now
      name,
      inv_id,
    });
  } catch (error) {
    console.error("Error rendering delete confirmation view:", error);
    next(error);
  }
};

// Function to carry out the delete process
invController.deleteInventoryItem = async (req, res, next) => {
  try {
    const inv_id = parseInt(req.params.inv_id);
    const result = await invModel.deleteInventoryItem(inv_id);
    if (result.rowCount > 0) {
      req.flash("success", "Inventory item deleted successfully.");
      res.redirect("/inventory"); 
    } else {
      req.flash("error", "Failed to delete inventory item.");
      res.redirect("/inventory/delete/" + inv_id); 
    }
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    next(error);
  }
};

module.exports = invController;
