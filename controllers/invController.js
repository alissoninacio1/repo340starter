const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build a specific inventory item detail view
 * ************************** */
invCont.buildViewVehicleDetail = async (req, res) => {
  try {
    const vehicle_id = req.params.id;
    const data = await invModel.retrieveVehicleDataById(vehicle_id);

    const grid = await Util.buildVehicleDetailview(data);

    let nav = await Util.getNavigation();

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