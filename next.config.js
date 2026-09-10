const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/** @param {string} phase @returns {import('next').NextConfig} */
module.exports = (phase) => ({
  reactStrictMode: true,
  // A production build must not clear files used by the running local preview.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next"
});
