const { createUser, findUserByUsername, saveDocumentNumbers } = require('../models/user');
const { addRequest } = require('../models/request');
const bcrypt = require('bcryptjs');

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

async function loginUserController(req, res) {
    const { username, password } = req.body;

    try {
        const user = await findUserByUsername(username);
        if(!user){
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login succesful' });
    } catch (error) {
        
    }
}

const indicateFileUploaded = async (req, res) => {
    const { account_id, ktp_number, kk_number } = req.body;

    try {
        const document = await saveDocumentNumbers(account_id, ktp_number, kk_number);
        res.status(200).json({ message: 'Document uploaded successfully', document });
    } catch (error) {
        console.error('Error indicating file upload:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

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

module.exports = { 
    createUserController, 
    loginUserController,
    indicateFileUploaded,
    createNewRequest
};
