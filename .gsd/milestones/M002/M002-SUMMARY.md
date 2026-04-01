---
id: M002
title: "English Ministry Pages"
status: complete
completed_at: 2026-04-01T14:41:40.703Z
key_decisions:
  - CMS-with-fallback pattern: every page tries Sanity fetch in try-catch, falls back to comprehensive hardcoded content
  - Sanity singleton pattern: one document per language per page type (e.g., homePage-en, homePage-zh)
  - Server-side form processing with Turnstile verification and Resend email delivery
  - Resource categories modeled as nested array-of-objects matching em.ficcc.org structure
  - portableTextToHtml server-side utility for rendering Sanity block content without client JS
key_files:
  - src/pages/index.astro
  - src/pages/about/index.astro
  - src/pages/about/beliefs.astro
  - src/pages/about/staff.astro
  - src/pages/visit.astro
  - src/pages/sermons/index.astro
  - src/pages/ministries/index.astro
  - src/pages/events.astro
  - src/pages/give.astro
  - src/pages/contact.astro
  - src/pages/resources.astro
  - src/lib/sanity.ts
  - sanity/schemas/index.ts
  - src/layouts/BaseLayout.astro
lessons_learned:
  - Hardcoded fallback content is essential for static-site CMS patterns — builds must never fail when the CMS is unreachable
  - Content migration audits should happen as a dedicated task, not assumed complete from page-building alone — S07 T02 found address inconsistencies and missing sections that individual slice work missed
  - The CMS-with-fallback pattern scales well across 7+ page types without becoming unwieldy
---

# M002: English Ministry Pages

**All English Ministry pages built with CMS editability, server-side forms, and complete em.ficcc.org content migration**

## What Happened

M002 built the complete English Ministry website across 7 slices. S01 established the homepage with hero, service times, photo mosaic, pillars, and next-steps cards. S02 added the identity pages — About (Who We Are), Beliefs (8-point accordion), and Staff grid. S03 built the Visit page with schedule, transportation, FAQ accordion, and ride request form. S04 delivered the sermon library with series filtering and detail pages with YouTube embed. S05 created the community hub and ministry detail pages. S06 completed the transactional pages — events listing, give page with 3 donation methods, and the contact page with 4 tabbed forms backed by server-side API endpoints with Turnstile verification and Resend email. S07 built the resources page and performed a systematic audit of all em.ficcc.org content, fixing gaps in the about page (vision statement, church stats), contact page (address), and ministries page (fallback groups). Every page follows the CMS-with-fallback pattern, fetching from Sanity singletons and falling back to comprehensive hardcoded content when Sanity is unreachable.

## Success Criteria Results

- ✅ All EN pages built and rendering (12 static pages in dist/)
- ✅ Every page has CMS-with-fallback pattern
- ✅ Sanity schemas cover all content types (7 singletons + 4 document types)
- ✅ em.ficcc.org content migrated (SITE-AUDIT.md Section 4 audit complete)
- ✅ Forms functional with server-side processing
- ✅ Static build output compatible with Vercel

## Definition of Done Results

- **All EN pages built**: 12 static pages rendered — homepage, about (3), visit, sermons, ministries, events, give, contact, resources, 404
- **CMS editability**: Every page fetches from Sanity with try-catch fallback. Sanity Studio accessible at /admin
- **Content migration**: All Must Migrate and Should Migrate items from SITE-AUDIT.md audited and present
- **Forms working**: 4 contact forms with Turnstile spam protection and Resend email delivery
- **Build passing**: `npm run build` succeeds, producing Vercel-compatible output

## Requirement Outcomes

No formal REQUIREMENTS.md was tracked for M002. The implicit deliverable — a complete English Ministry website with CMS-backed content — is fully met across 12 pages with Sanity integration and hardcoded fallbacks.

## Deviations

S07 T02 expanded scope from documentation-only audit to fixing the discovered gaps (address, vision, stats, ministry fallbacks). This was the pragmatic call — documenting gaps without fixing them would have left the milestone incomplete.

## Follow-ups

- M003: Build Chinese Ministry pages and language toggle
- Replace placeholder SVG images with real em.ficcc.org photos
- Replace placeholder PDFs with actual newcomer-recommendations.pdf and readathon4.pdf from em.ficcc.org
- Configure real PayPal hosted_button_id on give page
- Full church history timeline content (40+ years from cm.ficcc.org) for about page
