---
estimated_steps: 7
estimated_files: 2
skills_used: []
---

# T04: Configure Lighthouse CI

1. Install @lhci/cli as devDependency
2. Create lighthouserc.js configuration:
   - Assert performance >= 90, accessibility >= 95, SEO >= 95
   - Upload to temporary public storage (or local for now)
3. Add lighthouse CI script to package.json
4. Test locally against dev server
5. Document how to run: npm run lhci

## Inputs

- None specified.

## Expected Output

- `lighthouserc.js`

## Verification

npm run lhci runs and generates report against local dev server.
