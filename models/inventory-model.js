const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}



/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


// Query Purpose: Retrieve vehicle data by inv_id.
async function retrieveVehicleDataById(inv_id) {
  try {
    const selectQuery = `
      SELECT
          inv_make,
          inv_model,
          inv_year,
          inv_image,
          inv_price,
          inv_miles
      FROM
          public.inventory
      WHERE
          inv_id = $1;
  `;

    const data = await pool.query(selectQuery, [inv_id]);

    return data.rows;
  } catch (error) {
    console.error("retrieveVehicleDataById " + error)
  }
}


module.exports = {
                    getClassifications, 
                    getInventoryByClassificationId,
                    retrieveVehicleDataById
                  };