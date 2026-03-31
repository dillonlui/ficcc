---
estimated_steps: 8
estimated_files: 1
skills_used: []
---

# T03: Link Vercel Project & Configure Deploys

1. Link project to Vercel via vercel link
2. Configure Vercel project settings:
   - Framework: Astro
   - Build command: npm run build
   - Output directory: dist
3. Configure environment variables placeholder (SANITY_PROJECT_ID, SANITY_DATASET will be set in S04)
4. Push and verify auto-deploy triggers
5. Verify preview URL is accessible

## Inputs

- None specified.

## Expected Output

- `vercel.json`

## Verification

vercel deploy succeeds. Preview URL returns 200.
