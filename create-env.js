const fs = require('fs');
const path = require('path');

const content = `NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=746df8f85c43e4fb1e95646f79bdfeae773994a93558c6d375763593b2222f278
ADMIN_EMAIL=your-email@example.com
`;

fs.writeFileSync(path.join(__dirname, '.env.local'), content, { encoding: 'utf8' });
console.log('.env.local created with UTF-8 encoding');
