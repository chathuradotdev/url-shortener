const http = require('http');

function postRequest(path, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, body: body });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

async function verify() {
    console.log('Starting Verification...');

    // 1. Test Shorten API
    try {
        const originalUrl = "https://www.google.com";
        const data = JSON.stringify({ originalUrl });
        console.log(`Testing /api/shorten with ${originalUrl}...`);

        const res = await postRequest('/api/shorten', data);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Body: ${res.body}`);

        if (res.statusCode === 200) {
            const json = JSON.parse(res.body);
            if (json.shortUrl && json.shortUrl.includes('localhost:3000')) {
                console.log('✅ Shorten API Success');
            } else {
                console.log('❌ Shorten API Failed: Invalid response format');
            }
        } else {
            console.log('❌ Shorten API Failed');
        }

    } catch (error) {
        console.error('❌ Error testing Shorten API:', error.message);
    }
}

verify();
