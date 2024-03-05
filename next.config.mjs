/** @type {import('next').NextConfig} */

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
await import('./env.mjs');

const domains = ['res.cloudinary.com'];

const domainsRemote = domains.map((domain) => {
  return {
    protocol: 'https',
    hostname: domain,
    port: ''
  };
});

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  images: {
    remotePatterns: domainsRemote
  }
};

export default nextConfig;
