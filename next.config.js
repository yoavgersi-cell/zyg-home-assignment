/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep the headless-browser packages out of the webpack bundle so the
  // chromium binary ships intact in the Vercel serverless function.
  experimental: {
    serverComponentsExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
    // Vercel's file tracing misses the brotli-packed chromium binaries;
    // include them explicitly for the scan route.
    outputFileTracingIncludes: {
      '/api/agent/scan': ['./node_modules/@sparticuz/chromium/bin/**'],
      '/api/agent/scan/route': ['./node_modules/@sparticuz/chromium/bin/**'],
    },
  },
};

module.exports = nextConfig;
