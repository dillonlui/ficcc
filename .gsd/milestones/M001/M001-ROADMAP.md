# M001: Foundation & Design System

## Vision
Establish the full project scaffold, design system, CMS schema, and shared infrastructure so that all subsequent page-building milestones can move fast without re-solving foundational problems.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Project Scaffold & CI/CD Pipeline | low | — | ✅ | Astro + Sanity monorepo deploys to Vercel with preview URLs on PRs |
| S02 | Design Tokens & Typography | medium | S01 | ⬜ | /styleguide page showing full color palette, EN + ZH type scale, spacing scale |
| S03 | Base Components | medium | S02 | ⬜ | All components on /styleguide — Header, Footer, Hero, Cards, Accordion, Forms, ImageMosaic, AudioPlayer |
| S04 | Sanity Schema & Studio | medium | S01 | ⬜ | Sanity Studio with all document types. Sample content created and queryable. |
| S05 | Forms, SEO & Security Infrastructure | low | S01 | ⬜ | Form submission delivers email. sitemap.xml, robots.txt, security headers all verified. |
| S06 | Preview Mode & Integration Wiring | low | S04, S05 | ⬜ | Editor creates draft in Sanity, clicks Preview, sees draft rendered on live site. Publish triggers redeploy. |
