---
estimated_steps: 12
estimated_files: 7
skills_used: []
---

# T01: Initialize Monorepo & Git Config

1. Set git user.name and user.email for personal GitHub on this repo
2. Initialize Astro project (astro@latest) with TypeScript, minimal template
3. Create /studio directory for Sanity Studio
4. Set up monorepo structure:
   - /src (Astro site)
   - /studio (Sanity Studio)
   - /public (static assets)
5. Add .gitignore (node_modules, .env, .vercel, dist)
6. Add .nvmrc with Node version
7. Install core dependencies: astro, @sanity/client, sanity
8. Create initial package.json scripts: dev, build, preview
9. Commit with clean initial state

## Inputs

- `ficcc-prd.docx`
- `ficcc-design-language.docx`

## Expected Output

- `package.json`
- `astro.config.mjs`
- `.gitignore`
- `.nvmrc`
- `src/pages/index.astro`

## Verification

npm run build succeeds. git log shows commit with personal email.
