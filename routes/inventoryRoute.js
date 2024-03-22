const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index")

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
router.post('/add-vehicle', async (req, res) => {
    const { invMake, invModel, classification, invDescription, invImage, invThumbnail, invPrice, invYear, invMiles, invColors } = req.body;

    if (!invMake || !invModel || !classification || !invDescription || !invImage || !invThumbnail || !invPrice || !invYear || !invMiles || !invColors) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const newVehicle = await invController.addNewVehicle(invMake, invModel, classification, invDescription, invImage, invThumbnail, invPrice, invYear, invMiles, invColors);
        res.status(201).json(newVehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;
