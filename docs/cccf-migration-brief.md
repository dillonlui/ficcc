# CCCF Site Migration Brief (Deferred)

## Status

**Deferred until after the main FICCC site launch.** The immediate launch scope is
`ficcc.org`, `em.ficcc.org`, and `cm.ficcc.org`. Do not add `cccf.ficcc.org`, CCCF
routes, schemas, or content to that cutover unless this brief is explicitly resumed.

The eventual goal is to replace the existing [Cornell Chinese Christian Fellowship
(CCCF) Google Site](https://sites.google.com/view/cccf-ficcc/home) with a
CMS-managed section of this Astro/Sanity application, served at
`cccf.ficcc.org`. This is a content and functionality lift-and-shift; it does not
need to adopt the main FICCC visual language.

## Initial Inventory

The public Google Site currently contains five top-level pages:

1. **Home** — bilingual CCCF introduction, a recent-event callout, and contact
   links.
2. **Regular Events** — recurring Alpha course, Friday Bible study, and Sunday
   worship information.
3. **Bible Study** — semester study material and session entries.
4. **Photos and Stories** — bilingual introduction and an image-led activity
   gallery.
5. **About** — bilingual ministry description, history, and legacy narrative.

The pages include approximately 50–60 image placements, bilingual Chinese/English
copy, and links to an external RSVP, Google Form, email address, and Instagram. At
implementation time, re-inventory the live site and confirm that all event dates,
Bible-study material, external links, and image usage rights are current before
migration.

## Initial Scope and Estimate

For a CMS-backed migration, plan for **5–8 working days** of implementation work,
plus CCCF staff review time.

| Work area | Estimate |
| --- | ---: |
| Content model, Sanity Studio organization, and GROQ queries | 1–1.5 days |
| CCCF templates, navigation, and `cccf.ficcc.org` routing | 2–3 days |
| Content and asset migration; external-link verification | 1.5–2.5 days |
| Responsive, accessibility, deployment, and DNS QA | 0.5–1 day |

Allow an additional **1–3 days** if the gallery needs detailed captions and alt text,
if original high-resolution media must be collected, or if the source material needs
substantial editorial refresh.

## Decision Pending: CMS Organization

**Do not decide the Sanity Studio organization yet.** The church may prefer CCCF to
be included in the main FICCC CMS rather than presented as a separate editor-facing
section.

When this work resumes, decide between:

- **Main FICCC CMS area:** CCCF page and collection documents appear alongside the
  existing ministry content, with permissions and navigation managed centrally.
- **Dedicated CCCF Studio area:** CCCF content is grouped under a distinct Studio
  section while remaining in the same Sanity project and dataset.

Either choice can use the same eventual public subdomain. The choice affects the
Studio navigation and editor workflow, not the public URL or the core migration.

## Proposed Implementation Plan (When Resumed)

1. Confirm current CCCF ownership, page inventory, desired update workflow, and
   image permissions; refresh any stale content before it is imported.
2. Make the CMS-organization decision above and define the smallest schema set for
   page content, recurring meetings, Bible-study entries, and gallery/story items.
3. Add queries, Studio structure, and CCCF routes in a way that does not alter the
   existing EN/ZH route model or main-site schemas.
4. Build a modest CCCF-specific layout that preserves the source site’s information
   architecture without requiring a redesign to match FICCC.
5. Import content and approved media into Sanity; retain third-party RSVP, form,
   email, and social links unless CCCF requests replacements.
6. Configure `cccf.ficcc.org` in Vercel and its DNS CNAME, verify the host-specific
   route behavior, and test published CMS changes end-to-end.
7. Run the relevant build, responsive, accessibility, and link checks; have CCCF
   staff approve all public content before cutover.

## Launch Sequencing

The main FICCC launch should remain the priority. After it is stable, schedule a
short CCCF discovery/approval session, then create a dedicated implementation plan
from this brief. This avoids introducing a fourth domain, new CMS structures, and a
content migration into the imminent launch path.
