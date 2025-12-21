import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'

    // NOTE:
    // - In dev, Next.js uses eval / inline scripts for tooling, so CSP must be more permissive.
    // - In prod, we still allow inline scripts because Next.js may inline some runtime; you can tighten
    //   further once you know all third-party scripts and can adopt nonces.
    const csp = [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
      isProd ? "script-src 'self' 'unsafe-inline'" : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Allow server-side GitHub fetches and (optionally) Upstash rate limiting.
      "connect-src 'self' https://api.github.com https://*.upstash.io",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // COOP/COEP are useful but can break some embeds; keep conservative defaults.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          // HSTS only for prod (requires HTTPS).
          ...(isProd
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
            : []),
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ]
  },
}

export default nextConfig
