/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: isGitHubPages ? '/handle' : '',
  assetPrefix: isGitHubPages ? '/handle/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
