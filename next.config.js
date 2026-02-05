require('dotenv').config({ path: './.env.local' });

// PWA Configuration (Temporarily disabled due to Next.js 16 compatibility issues in dev mode)
// const withPWA = require("@ducanh2912/next-pwa").default({
//     dest: "public",
//     disable: process.env.NODE_ENV === "development",
// });

const nextConfig = {
    reactStrictMode: true,
};

module.exports = nextConfig;
// module.exports = withPWA(nextConfig);
