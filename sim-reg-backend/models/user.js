const { pool } = require('../config/db.config.js');
const bcrypt = require('bcryptjs');

pool.connect().then(() => {
    console.log("Connected to PortgreSQL Database 🛢️");
})

// Register User
const createUser = async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const accountResult = await pool.query(
        'INSERT INTO Account (username, email, phoneNumber, password) VALUES ($1, $2, $3, $4) RETURNING account_id',
        [user.username, user.email, user.phoneNumber, hashedPassword]
    );
    
    const account_id = accountResult.rows[0].account_id;

    await pool.query(
        'INSERT INTO Person (NIK, account_id, address_id, name, date_of_birth, place_of_birth, gender) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [user.NIK, account_id, user.address_id, user.name, user.date_of_birth, user.place_of_birth, user.gender]
    );
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

// Gausah diapa"in dulu frontendnya soalnya dia blm jadi
// const saveDocumentLinks = async (req, res) => {
//     const { account_id, ktp_link , kk_link } = req.body;

//     try {
//         const ktp_link = await uploadFileToGoogleDrive(req.files.ktp[0]);
//         const kk_link = await uploadFileToGoogleDrive(req.files.kk[0]);
//         await pool.query(
//         'INSERT INTO Document (account_id, ktp_link, kk_link) VALUES ($1, $2, $3, $4, $5)',
//         [account_id, ktp_link, kk_link]
//         );
//         res.status(200).json({ message: 'Document uploaded successfully' });
//     } catch (error) {
//         console.error('Error saving document numbers:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

module.exports = createUser;
