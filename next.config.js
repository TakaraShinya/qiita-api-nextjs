/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["qiita-user-contents.imgix.net", "qiita-user-profile-images.imgix.net"],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
