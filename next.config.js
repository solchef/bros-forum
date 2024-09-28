/** @type {import('next').NextConfig} */
const nextConfig = {

  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });

    return config;
  },
  images: {
    domains: ["utfs.io","picsum.photos"],
  },
  typescript: {
    ignoreBuildErrors: true,  // Disable type-checking during build
  },
  eslint: {
    ignoreDuringBuilds: true,  // Disable ESLint checks during build (optional)
  },


};

module.exports = nextConfig;
