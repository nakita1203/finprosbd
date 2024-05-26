const { pool } = require('../config/db.config.js');
const bcrypt = require('bcryptjs');

pool.connect().then(() => {
    console.log("Connected to PortgreSQL Database 🛢️");
})

const createUser = async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const accountResult = await pool.query(
        'INSERT INTO Account (username, email, phoneNumber, password) VALUES ($1, $2, $3, $4) RETURNING account_id',
        [user.username, user.email, user.phoneNumber, hashedPassword]
    );
    
    const accountId = accountResult.rows[0].account_id;

    await pool.query(
        'INSERT INTO Person (NIK, account_id, address_id, name, date_of_birth, place_of_birth, gender) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [user.NIK, accountId, user.address_id, user.name, user.date_of_birth, user.place_of_birth, user.gender]
    );
};

const findUserByUsername = async (username) => {
    const result = await pool.query(
        'SELECT * FROM Account WHERE username = $1',
        [username]
    );
    return result.rows[0];
};

const saveDocumentNumbers = async (account_id, ktp_number, kk_number) => {
    try {
        const result = await pool.query(
            'INSERT INTO Document (account_id, ktp_number, kk_number) VALUES ($1, $2, $3) RETURNING *',
            [account_id, ktp_number, kk_number]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error saving document numbers:', error);
    }
}

module.exports = { 
    createUser, 
    findUserByUsername,
    saveDocumentNumbers
};
