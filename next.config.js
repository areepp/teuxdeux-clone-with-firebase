/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  publicRuntimeConfig: {
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  },
  eslint: {
    dirs: ['pages', 'components', 'lib', 'helper', 'stores'],
  },
}

module.exports = nextConfig
