// const fs = require('fs');
// const readline = require('readline');
// const { google } = require('googleapis');
// const path = require('path');

// const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
// const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');
// const TOKEN_PATH = path.join(__dirname, 'token.json');

// function loadCredentials() {
//     const content = fs.readFileSync(CREDENTIALS_PATH);
//     return JSON.parse(content);
// }

// function authorize(credentials, callback) {
//     const { client_secret, client_id } = credentials.web;
//     const redirect_uris = ['urn:ietf:wg:oauth:2.0:oob'];
//     const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

//     // Check if we have previously stored a token.
//     fs.readFile(TOKEN_PATH, (err, token) => {
//         if (err) {
//             return getNewToken(oAuth2Client, callback);
//         }
//         try {
//             oAuth2Client.setCredentials(JSON.parse(token));
//             callback(oAuth2Client);
//         } catch (e) {
//             return getNewToken(oAuth2Client, callback);
//         }
//     });
// }

// function getNewToken(oAuth2Client, callback) {
//     const authUrl = oAuth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: SCOPES,
//     });
//     console.log('Authorize this app by visiting this url:', authUrl);
//     const rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout,
//     });
//     rl.question('Enter the code from that page here: ', (code) => {
//         rl.close();
//         oAuth2Client.getToken(code, (err, token) => {
//             if (err) {
//                 return console.error('Error retrieving access token', err);
//             }
//             oAuth2Client.setCredentials(token);
//             // Store the token to disk for later program executions
//             fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
//             console.log('Token stored to', TOKEN_PATH);
//             callback(oAuth2Client);
//         });
//     });
// }

// function main() {
//     const credentials = loadCredentials();
//     authorize(credentials, (auth) => {
//         console.log('Authorization successful');
//     });
// }

// main();
