const { pool } = require('../config/db.config.js');
const bcrypt = require('bcryptjs');
const { uploadFileToGoogleDrive } = require('../services/googleDriveService.js');

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

// const saveDocumentLinks = async (account_id, ktpLink, kkLink) => {
//     try {
//         await pool.query(
//             'UPDATE document SET ktp_link = $1, kk_link = $2 WHERE account_id = $3',
//             [ktpLink, kkLink, account_id]
//     );
//     } catch (error) {
//         console.error('Error saving document links:', error);
//         throw error;
//     }
// };

const saveDocumentLinks = async (req, res) => {
    const { account_id, ktp_link , kk_link } = req.body;

    try {
        const ktp_link = await uploadFileToGoogleDrive(req.files.ktp[0]);
        const kk_link = await uploadFileToGoogleDrive(req.files.kk[0]);
        await pool.query(
        'INSERT INTO Document (account_id, ktp_link, kk_link) VALUES ($1, $2, $3, $4, $5)',
        [account_id, ktp_link, kk_link]
        );
        res.status(200).json({ message: 'Document uploaded successfully' });
    } catch (error) {
        console.error('Error saving document numbers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { 
    createUser, 
    findUserByUsername,
    saveDocumentLinks
};
