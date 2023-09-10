const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Define a function to fetch the GitHub file URL and repo URL
async function getGitHubInfo(username, repo, filename) {
    const fileURL = `https://github.com/${username}/${repo}/blob/main/${filename}`;
    const repoURL = `https://github.com/${username}/${repo}`;
    return { fileURL, repoURL };
}

// Define a function to get the current UTC time
function getCurrentUTCTime() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const utcTime = new Date(now.getTime() - offset * 60000).toISOString();
    return utcTime;
}

// Define the endpoint
app.get('/api', async (req, res) => {
    try {
        const slackName = req.query.slack_name || '';
        const track = req.query.track || '';
        const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const utcTime = getCurrentUTCTime();
        const { fileURL, repoURL } = await getGitHubInfo('username', 'repo', 'file_name.ext');

        const responseData = {
            slack_name: slackName,
            current_day: currentDay,
            utc_time: utcTime,
            track: track,
            github_file_url: fileURL,
            github_repo_url: repoURL,
            status_code: 200,
        };

        res.json(responseData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
