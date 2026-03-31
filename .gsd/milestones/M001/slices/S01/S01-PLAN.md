# S01: Project Scaffold & CI/CD Pipeline

**Goal:** Working Astro + Sanity monorepo deployed to Vercel with automated CI/CD pipeline, Lighthouse CI on preview deploys, and GitHub remote configured with personal account
**Demo:** After this: Astro + Sanity monorepo deploys to Vercel with preview URLs on PRs

## Tasks
- [x] **T01: Initialized Astro + Sanity monorepo with TypeScript, i18n routing, and personal git config** — 1. Set git user.name and user.email for personal GitHub on this repo
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
  - Estimate: 20min
  - Files: package.json, .gitignore, .nvmrc, astro.config.mjs, tsconfig.json, src/pages/index.astro, studio/sanity.config.ts
  - Verify: npm run build succeeds. git log shows commit with personal email.
- [x] **T02: Created public GitHub repo and pushed via personal SSH key** — 1. Create ficcc repo on personal GitHub (public or private per user preference)
2. Add remote using personal SSH alias: git remote add origin git@github.com-personal:dillonlui/ficcc.git
3. Push main branch
4. Verify push succeeded and repo accessible on GitHub
  - Estimate: 10min
  - Verify: git push succeeds. git remote -v shows github.com-personal remote.
- [ ] **T03: Link Vercel Project & Configure Deploys** — 1. Link project to Vercel via vercel link
2. Configure Vercel project settings:
   - Framework: Astro
   - Build command: npm run build
   - Output directory: dist
3. Configure environment variables placeholder (SANITY_PROJECT_ID, SANITY_DATASET will be set in S04)
4. Push and verify auto-deploy triggers
5. Verify preview URL is accessible
  - Estimate: 15min
  - Files: vercel.json
  - Verify: vercel deploy succeeds. Preview URL returns 200.
- [ ] **T04: Configure Lighthouse CI** — 1. Install @lhci/cli as devDependency
2. Create lighthouserc.js configuration:
   - Assert performance >= 90, accessibility >= 95, SEO >= 95
   - Upload to temporary public storage (or local for now)
3. Add lighthouse CI script to package.json
4. Test locally against dev server
5. Document how to run: npm run lhci
  - Estimate: 15min
  - Files: lighthouserc.js, package.json
  - Verify: npm run lhci runs and generates report against local dev server.
- [ ] **T05: Create README & Project Documentation** — 1. Write README.md with:
   - Project overview (FICCC website rebuild)
   - Tech stack (Astro + Sanity + Vercel)
   - Setup instructions (clone, npm install, npm run dev)
   - Environment variables needed
   - Project structure explanation
   - Deployment workflow (PR -> preview, merge -> production)
2. Create .env.example with placeholder variables
3. Commit and push
  - Estimate: 10min
  - Files: README.md, .env.example
  - Verify: README renders correctly on GitHub. New developer can follow setup instructions.
