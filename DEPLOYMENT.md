# Cloudflare test deployment

Production branch: `cloudflare-deploy` (leave the existing GitHub Pages branch unchanged).

- Project name: `current-field`
- Root directory: repository root
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy --config dist/server/wrangler.json`
- Node.js: 22.13 or newer (Node 22 LTS recommended)
- Disable preview builds initially; configure their command separately before enabling.

The build generates the Worker configuration, including its static assets binding.
Do not deploy the source repository as static files.

Before connecting the domain: test all routes and both forms, review dependency
audit findings, measure CPU usage on Workers Free, and finalize privacy/SEO settings.
Preserve existing email DNS records when connecting the domain.

The original GitHub website is preserved on `backup/pre-cloudflare-2026-09-23`.
