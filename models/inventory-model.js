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
      inv_description, -- Adicionando a descrição
      inv_color, -- Adicionando a cor
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

async function addNewVehicle(invMake, invModel, invYear, invDescription, invImage, invThumbnail, invPrice, invMiles, invColor, classificationId) {
  try {
    const query = `
      INSERT INTO public.inventory (
        inv_make, inv_model, inv_year, inv_description,
        inv_image, inv_thumbnail, inv_price, inv_miles,
        inv_color, classification_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [invMake, invModel, invYear, invDescription, invImage, invThumbnail, invPrice, invMiles, invColor, classificationId];
    const { rows } = await pool.query(query, values);
    return rows[0]; // Return the newly inserted row
  } catch (error) {
    console.error("Error adding new vehicle:", error);
    throw error;
  }
}



// Function to delete inventory item
async function deleteInventoryItem(inv_id) {
  try {
      const sql = 'DELETE FROM inventory WHERE inv_id = $1';
      const data = await pool.query(sql, [inv_id]);
      return data;
  } catch (error) {
      throw new Error('Delete Inventory Error: ' + error.message);
  }
}




module.exports = {
  getClassifications, 
  getInventoryByClassificationId,
  retrieveVehicleDataById,
  addNewVehicle,
  deleteInventoryItem
};

