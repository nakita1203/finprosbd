const { pool } = require('../config/db.config.js');

//Mendapatkan semua permintaan pendaftar
const getAllRequests = async () => {
    const result = await pool.query(`
    SELECT r.*, p.name, p.date_of_birth, p,place_of_birth, d.ktp_file_id, d.kk_file_id
    FROM Request r
    JOIN Person p ON r.nik = p.nik
    JOIN Document d ON r.document_id = d.document_id
    `);

    return result.rows;

};

//Memperbarui status permintaaan pendaftar
const updateRequestStatus = async (request_id, stat, schedule) => {
    const result = await pool.query(
        'UPDATE Request SET status = $1, schedule = $2 WHERE request_id = $3 RETURNING *',
        [stat, schedule, request_id]
    );

    return result.rows[0];

};

//Membuat permintaan baru
const addRequest = async (nik, polres_id, document_id, schedule) => {
    try {
        const result = await pool.query(
            'INSERT INTO request (nik, polres_id, document_id, schedule) VALUES ($1, $2, $3, $4) RETURNING *',
            [nik, polres_id, document_id, schedule]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding request:', error);
        throw error;
    }
};

module.exports = {
    getAllRequests,
    updateRequestStatus,
    addRequest
}