/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  transpilePackages: ["@daymaster/bazi-engine", "@daymaster/content"]
};

export default nextConfig;
