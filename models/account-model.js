const pool = require('../database/index');
const db = require('../database'); // Import your database connection or ORM

const accountModel = {};

accountModel.registerAccount = async function(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    } catch (error) {
        return error.message;
    }
};

accountModel.checkExistingEmail = async function(email) {
    try {
        // Query the database to check if the email exists
        const queryResult = await db.query('SELECT * FROM account WHERE account_email = $1', [email]);
        return queryResult.rows.length > 0; // Return true if email exists, false otherwise
    } catch (error) {
        throw new Error("Error checking existing email: " + error.message);
    }
};

module.exports = accountModel;
