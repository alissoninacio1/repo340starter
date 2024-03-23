const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index")
const inventoryModel = require('../models/inventory-model');

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to get inventory item detail view
router.get("/detail/:id", invController.buildViewVehicleDetail);


// Route to render the management view
router.get("/", async (req, res) => {
    try {
        const nav = await utilities.getNav(); // Get navigation data
        res.render("./inventory/management", { 
            title: "Inventory Management",
            nav: nav, // Pass navigation data to the view
            messages: req.flash("messages") 
        });
    } catch (error) {
        console.error("Error rendering management view:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to deliver add-classification view
router.get("/add-classification", async (req, res) => {
    try {
        const nav = await utilities.getNav(); // Get navigation data
        res.render("./inventory/add-classification", { 
            title: "Add New Classification", 
            nav: nav, // Pass navigation data to the view
            errors: req.flash("errors") 
        });
    } catch (error) {
        console.error("Error rendering add-classification view:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to deliver add-inventory view
router.get("/add-inventory", async (req, res) => {
    try {
        const nav = await utilities.getNav(); // Get navigation data
        const classificationList = await utilities.buildClassificationList();
        res.render("./inventory/add-inventory", { 
            title: "Add New Inventory Item", 
            nav: nav, // Pass navigation data to the view
            errors: req.flash("errors"), 
            classificationList 
        });
    } catch (error) {
        console.error("Error rendering add-inventory view:", error);
        res.status(500).send("Internal Server Error");
    }
});


// -------ADD CLASSIFICATION AND VEHICLES BUTTON MANAGEMENT
// Route to handle adding a new classification
router.post('/add-classification', async (req, res) => {
    const { classificationName } = req.body;
    try {
        const newClassification = await invController.addNewClassification(classificationName);
        // Handle success response
        res.status(201).json(newClassification);
    } catch (error) {
        // Handle error response
        res.status(500).json({ error: error.message });
    }
});


// Route to handle adding a new vehicle
router.post('/add-inventory', async (req, res, next) => {
    try {
        // Log the request body to inspect form data
        console.log('Request Body:', req.body);

        // Extract form data from request body
        const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

        // Insert the new vehicle into the database
        const result = await inventoryModel.addNewVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);

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
        next(error);
    }
});




module.exports = router;
