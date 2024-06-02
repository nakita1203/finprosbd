const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

// Load client secrets from a local file.
function loadCredentials() {
    const content = fs.readFileSync(CREDENTIALS_PATH);
    return JSON.parse(content);
}

function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
    const token = fs.readFileSync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
}

const uploadFileToGoogleDrive = async (file) => {
    const auth = authorize(loadCredentials());
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
        name: file.filename,
        parents: ['1gq-xm8Ncoch5wKZzRdXOVd8k5nz9QHHU']
    };

    const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path)
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    });

    const fileId = response.data.id;
    await drive.permissions.create({
        fileId: fileId,
        requestBody: {
        role: 'reader',
        type: 'anyone'
        }
    });

    const result = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink'
    });

    return result.data.webViewLink;
};

module.exports = { uploadFileToGoogleDrive };
