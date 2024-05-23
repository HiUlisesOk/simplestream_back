const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());

const oauth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	'https://front-user-interface.vercel.app/oauth2callback'
);

app.post('/oauth2callback', async (req, res) => {
	const code = req.body.code;
	try {
		const { tokens } = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(tokens);

		// Save the refresh token securely (e.g., in a database)
		const refreshToken = tokens.refresh_token;

		res.json({ message: 'Authorization successful', tokens });
	} catch (error) {
		res.status(500).json({ error: 'Error during authorization', details: error });
	}
});

app.get('/start-broadcast', async (req, res) => {
	try {
		// Refresh the access token if needed
		const { credentials } = await oauth2Client.refreshAccessToken();
		oauth2Client.setCredentials(credentials);

		const youtube = google.youtube('v3');
		const response = await youtube.liveBroadcasts.insert({
			auth: oauth2Client,
			part: 'snippet,status',
			requestBody: {
				snippet: {
					title: 'My Live Stream',
					description: 'Description of my live stream'
				},
				status: {
					privacyStatus: 'unlisted'
				}
			}
		});

		res.json({ message: 'Live stream created', data: response.data });
	} catch (error) {
		res.status(500).json({ error: 'Error creating live stream', details: error });
	}
});

app.listen(port, () => {
	console.log(`Server is listening at https://front-user-interface.vercel.app/:${port}`);
});
