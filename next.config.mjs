import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  allowedDevOrigins: ['*'],
  devIndicators: false,
  // output: 'export', 
};

export default withMDX(config);
