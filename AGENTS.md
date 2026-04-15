# Agent Guidelines

## Project Context
- Unified bilingual website for First Ithaca Chinese Christian Church, serving English and Chinese ministries on one domain. Built with Astro, Sanity, and Vercel.
- Prioritize clarity, accessibility, editorial reliability, and consistency with the existing "Gathered Warmth" design language.

## Code Map
- `src/pages/`: routes for splash, English pages, Chinese pages, and API endpoints
- `src/components/`: shared Astro components plus `Studio.tsx` for embedded Sanity Studio
- `src/lib/`: Sanity queries, navigation helpers, structured data, and form helpers
- `src/styles/`: global design tokens and async-loaded CJK font styles
- `sanity/`: schema, structure, and migrations
- `e2e/`: Playwright tests
- `docs/staff/`: operational documentation for staff workflows

## How to Work in This Repo
- Preserve bilingual information architecture and ministry-specific content patterns.
- Prefer small, targeted edits unless a larger structural change is explicitly requested.
- Reuse existing tokens, layouts, and content patterns before introducing new abstractions.
- Be careful with content changes that affect church operations, public-facing contact paths, or donation flows.
- For OpenAI API or Codex questions, prefer the official OpenAI docs MCP before relying on memory.

## Key Implementation Rules
- Read `.gsd/KNOWLEDGE.md` before making structural or architectural changes so existing project decisions are preserved.
- Use `getAlternateUrl(pathname)` from `src/lib/navigation.ts` for EN/ZH alternate route mapping.
- Do not treat English and Chinese content as direct translations when the repo models them as separate ministry content.
- Do not hardcode new colors or spacing values when a token-based solution should be used instead.
- Use `--color-terracotta-dark` for text and interactive elements that need WCAG AA contrast, not `--color-terracotta`.
- Keep Sanity preview tokens and read tokens server-only. Never expose them through `PUBLIC_` variables or client-side code.
- Builds should remain resilient when Sanity is unavailable.

## How to Run Things
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Unit tests: `npm test`
- E2E tests: `npm run test:e2e`
- Accessibility checks: `npm run test:a11y`
- Lighthouse CI: `npm run lhci`

Run the relevant validation commands after non-trivial changes. For routing, forms, SEO, or bilingual UX work, prefer `npm run build` plus the most relevant test command for the touched area.

## Coding Standards
- Follow existing Astro, CSS token, and Sanity query patterns.
- Keep components and pages readable and explicit.
- Avoid new dependencies unless clearly justified and approved.
- Respect the established typography, spacing, and texture system rather than introducing a parallel style language.

## Workflow for Larger Tasks
1. Summarize the task and identify the affected language routes, CMS schema, or UI areas.
2. Propose a short plan before broad multi-file or architecture changes.
3. Implement in small steps, keeping bilingual routing and accessibility intact.
4. Run relevant validation and report results.

## Things to Avoid
- Do not make sweeping design-system changes without being asked.
- Do not change bilingual URL structure, redirects, or CMS content models without explicit approval.
- Do not commit secrets, tokens, or environment-specific credentials.
- Do not break staff-facing content workflows in Sanity without calling it out clearly.

## Definition of Done
- The site builds and relevant tests pass.
- Accessibility and bilingual navigation remain intact.
- Changes fit the existing design language and content architecture.
- A brief summary of changes and rationale is provided.
