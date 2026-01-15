require('dotenv').config({ path: './.env.local' });

const nextConfig = {
    reactStrictMode: true,
    // experimental: {
    //     serverActions: true,
    // },
};

module.exports = nextConfig;
