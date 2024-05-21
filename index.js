const express = require('express');
const startBroadcast = require('./youtubeStream');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
	res.send('Hello, world!');
});

app.listen(port, () => {
	console.log(`Server is listening at https://simplestream-back.pages.dev:${port}`);
});


startBroadcast()