const { google } = require('googleapis');

// Initialize YouTube API client
const youtube = google.youtube({
	version: 'v3',
	auth: 'AIzaSyDBemo0TdjhkEzH-JUUMxZ1RMZJPlOLC_U' // Replace 'YOUR_API_KEY' with your actual API key
});

// Function to start a live broadcast
async function startBroadcast() {
	try {
		// Initialize a live broadcast
		const res = await youtube.liveBroadcasts.insert({
			part: 'snippet,status',
			requestBody: {
				snippet: {
					title: 'My Live Stream',
					description: 'Description of my live stream'
				},
				status: {
					privacyStatus: 'unlisted' // Set to 'public', 'unlisted', or 'private'
				}
			}
		});

		// Get broadcast ID
		const broadcastId = res.data.id;

		// Start live streaming
		await youtube.liveBroadcasts.transition({
			id: broadcastId,
			part: 'id,snippet,status',
			requestBody: {
				broadcastStatus: 'live'
			}
		});

		console.log('Live stream started:', res.data);
	} catch (error) {
		console.error('Error starting live stream:', error);
	}
}

module.exports = startBroadcast;