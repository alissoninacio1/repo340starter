const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildViewVehicleDetail = async (req, res) => {
  try {
    const vehicle_id = req.params.id;
    const data = await invModel.retrieveVehicleDataById(vehicle_id); // Corrected method name

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

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = invCont