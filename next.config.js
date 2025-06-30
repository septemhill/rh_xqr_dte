/** @type {import('next').NextConfig} */

const isGithubPages = process.env.NODE_ENV === 'production' && !process.env.CF_PAGES;

const nextConfig = {
  output: "export",
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? '/rh_xqr_dte' : '',
  assetPrefix: isGithubPages ? '/rh_xqr_dte/' : '',
}

module.exports = nextConfig
