const { createUser } = require('../models/user');
const { addRequest } = require('../models/request');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db.config.js');


// Membuat user untuk register
async function createUserController(req, res) {
    const { NIK, username, email, phoneNumber, password, address_id, name, date_of_birth, place_of_birth, gender } = req.body;

    try {
        await createUser({
            NIK,
            username,
            email,
            phoneNumber,
            password,
            address_id,
            name,
            date_of_birth,
            place_of_birth,
            gender
        });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Login handling dan membedakan apakah yang login User atau Admin
async function loginUserController(req, res) {
    const { username, password } = req.body;

    try {
        // Cek di tabel admin
        let query = 'SELECT * FROM Admin WHERE username = $1';
        let result = await pool.query(query, [username]);

        if (result.rows.length > 0) {
            const admin = result.rows[0];
            const validPassword = await bcrypt.compare(password, admin.password);

            if (validPassword) {
                return res.status(200).json({ message: 'Admin login successful', role: 'admin' });
            }
        }

        // Cek di tabel account
        query = 'SELECT * FROM Account WHERE username = $1';
        result = await pool.query(query, [username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (validPassword) {
                return res.status(200).json({ message: 'User login successful', role: 'user' });
            }
        }

        // Jika tidak ditemukan
        return res.status(401).json({ error: 'Invalid username or password' });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Buat request baru
const createNewRequest = async (req, res) => {
    const { nik, polres_id, document_id, schedule } = req.body;

    try {
        const newReq = await addRequest(nik, polres_id, document_id, schedule);
        res.status(201).json(newReq);
    } catch (error) {
        console.error('Error creating new request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// const indicateFileUploaded = async (req, res) => {
//     const { account_id } = req.body;

//     try {
//         const ktp_link = await uploadFileToGoogleDrive(req.files.ktp[0]);
//         const kk_link = await uploadFileToGoogleDrive(req.files.kk[0]);
        
//         await pool.query(
//         'INSERT INTO Document (account_id, ktp_link, kk_link) VALUES ($1, $2, $3)',
//         [account_id, ktp_link, kk_link]
//         );
//         res.status(200).json({ message: 'Document uploaded successfully' });
//     } catch (error) {
//         console.error('Error saving document numbers:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

module.exports = { 
    createUserController, 
    loginUserController,
    createNewRequest
};
