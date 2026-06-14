/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/relic',
  trailingSlash: true,
};

module.exports = nextConfig;
