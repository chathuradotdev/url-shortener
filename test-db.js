const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const URLS_FILE = path.join(DATA_DIR, 'urls.json');

function readUrls() {
    try {
        const data = fs.readFileSync(URLS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading urls.json:", error);
        return [];
    }
}

function getUserUrls(userId) {
    const urls = readUrls();
    return urls.filter((u) => u.user_id === userId);
}

const userId = "6e41e83d-bae9-4b57-8c18-a1aa39d9843b";
console.log(`Testing getUserUrls for userId: ${userId}`);

const urls = getUserUrls(userId);
console.log(`Found ${urls.length} URLs`);
console.log("First URL:", urls[0]);

if (urls.length > 0) {
    console.log("DB read seems successful.");
} else {
    console.log("No URLs found (unexpected if user has data).");
}
