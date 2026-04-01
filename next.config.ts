import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Mongoose uses Node.js APIs not available in Edge runtime
  serverExternalPackages: ['mongoose'],
}

export default nextConfig
