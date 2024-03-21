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


module.exports = router;
