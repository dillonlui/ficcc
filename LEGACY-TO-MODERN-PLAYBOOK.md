# Legacy-to-Modern Website Rebuild — Process Playbook

A reusable process for converting a legacy website (WordPress, static HTML, or fragmented multi-site) into a modern Jamstack architecture (Astro/Next.js + Headless CMS + Edge Deployment).

---

## Phase 0: Discovery & Audit (1–2 weeks)

### 0.1 Stakeholder Discovery
- [ ] Identify project sponsor and primary point of contact
- [ ] Determine who owns content updates post-launch (content editors, admin staff, volunteers)
- [ ] Clarify decision-making authority (who approves design, content, and go-live)
- [ ] Assess technical comfort of content editors (determines CMS complexity ceiling)
- [ ] Confirm budget constraints (hosting, CMS tier, third-party services)
- [ ] Establish communication cadence and review process

### 0.2 Full Site Audit
- [ ] **Inventory every page** across all current web properties (subdomains, legacy domains, social profiles)
- [ ] **Screenshot every page** at desktop and mobile viewpoints for archival
- [ ] **Catalog all content** with reuse assessment (Must Migrate / Should Migrate / Nice-to-Have)
- [ ] **Download all media assets** (images, PDFs, videos) with metadata
- [ ] **Document all data points** (addresses, emails, phone numbers, social links, hours, etc.)
- [ ] **Map all external integrations** (payment processors, email providers, embedded widgets, APIs)
- [ ] **Check for SEO equity** — existing Google Search Console data, indexed pages, backlinks, ranking keywords
- [ ] **Identify legacy domains** that need redirects (don't lose any bookmarked URLs)
- [ ] **Audit social media presence** — Facebook, Instagram, YouTube, Flickr, etc.
- [ ] **Note SSL/security issues** — expired certs, HTTP-only domains, mixed content

### 0.3 Technical Assessment
- [ ] Current hosting provider and DNS registrar (who has access?)
- [ ] Current CMS / framework / platform
- [ ] Database access (if WordPress, can you export? If static, is source code available?)
- [ ] Content volume — how many pages, posts, media files?
- [ ] Traffic volume — monthly visitors, peak times (affects hosting tier)
- [ ] Performance baseline — Lighthouse scores on current site

### 0.4 Requirements Gathering
- [ ] Write or review PRD covering: goals, user segments, use cases, IA, features, content model
- [ ] Identify what's unique/distinctive about the current content (don't lose the good stuff)
- [ ] Define bilingual/i18n requirements if applicable
- [ ] Identify all form types and their routing (email addresses, notification needs)
- [ ] Define content publishing workflow (who publishes what, how often, how fast)

**Deliverables**: Site Audit document, Screenshot Archive, PRD, Stakeholder contacts

---

## Phase 1: Design Language & Architecture (1–2 weeks)

### 1.1 Design Direction
- [ ] Create Design Language document — tone, typography, color, photography direction
- [ ] Identify reference sites (what to borrow, what to leave behind)
- [ ] Define contrast pairs (this, not that) as design decision boundaries
- [ ] Assess photography needs — is existing library sufficient or is a photo shoot required?
- [ ] Logo / wordmark decision — existing brand assets vs. new

### 1.2 Information Architecture
- [ ] Define top-level navigation structure (organized around user mental models, not org charts)
- [ ] Map old URLs → new URLs (redirect table)
- [ ] Define bilingual routing strategy if applicable (path prefix, separate content, shared schema)
- [ ] Identify shared vs. language-specific content
- [ ] Plan utility nav (language toggle, persistent CTAs, announcement bar)

### 1.3 Technology Decisions
- [ ] **Frontend framework**: Astro (static-first), Next.js (React ecosystem), SvelteKit, etc.
- [ ] **CMS**: Sanity, Contentful, Strapi, Payload, WordPress (headless), etc.
- [ ] **Hosting/CDN**: Vercel, Netlify, Cloudflare Pages, etc.
- [ ] **Forms**: Resend + serverless endpoint, Formspree, Netlify Forms, etc.
- [ ] **Analytics**: Vercel Web Analytics, Plausible, Umami, GA4, etc.
- [ ] **Search**: Pagefind (static), Algolia, Meilisearch, etc.
- [ ] **Spam protection**: Cloudflare Turnstile, hCaptcha, honeypot
- [ ] **Email delivery**: Resend, SendGrid, Nodemailer + SMTP
- [ ] **Image optimization**: framework-native (<Image>), Sanity CDN transforms, Cloudinary
- [ ] **Font strategy**: especially important for CJK, Arabic, or other large character sets

### 1.4 Content Model Design
- [ ] Define all document types with fields (map to CMS schema)
- [ ] Define reusable content blocks / modules (hero, card grids, accordions, etc.)
- [ ] Plan singleton documents (site settings, navigation, announcements)
- [ ] Define editorial workflow (draft → review → publish? or just draft → publish?)
- [ ] Plan for content that changes seasonally (schedules, hours, seasonal messages)

**Deliverables**: Design Language doc, IA diagram, Tech decisions doc, Content model schema, Redirect map

---

## Phase 2: Foundation Build (1–2 weeks)

### 2.1 Project Scaffold
- [ ] Initialize monorepo (frontend + CMS studio in one repo)
- [ ] Configure CI/CD (preview deploys on PR, production on merge to main)
- [ ] Set up environment variables (CMS tokens, API keys)
- [ ] Configure CMS project (datasets, permissions, deploy Studio)
- [ ] Wire up CMS webhook → deploy trigger for content-driven rebuilds

### 2.2 Design System in Code
- [ ] Define design tokens (CSS custom properties): colors, typography, spacing, breakpoints
- [ ] Build base components: Header, Footer, Navigation, Buttons, Form elements
- [ ] Set up responsive breakpoints (mobile-first: 375px → 768px → 1024px → 1280px+)
- [ ] Configure font loading (especially critical for large character sets like CJK)
- [ ] Build a `/styleguide` page as a living reference

### 2.3 Infrastructure
- [ ] Forms endpoint (serverless function with email delivery + spam protection)
- [ ] SEO infrastructure: sitemap.xml, robots.txt, meta component, JSON-LD helpers, OG images
- [ ] Security headers: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- [ ] Error pages: 404, empty states
- [ ] CMS preview mode (draft content preview before publishing)
- [ ] Lighthouse CI in deploy pipeline

**Deliverables**: Working scaffold with design system, deployable to preview URL

---

## Phase 3: Page Build — Primary Language (2–4 weeks)

### 3.1 Build Pages
Build all pages for the primary language, in order of visitor impact:

1. **Homepage** — the design proof. If this feels right, the rest follows.
2. **About / Identity pages** — highest bespoke design opportunity
3. **Core service pages** (schedule, visit info, FAQ) — highest utility for new visitors
4. **Content library** (sermons, blog, resources) — highest value for returning visitors
5. **Community / Programs** — depth pages for engaged visitors
6. **Transactional pages** (give, contact, forms) — conversion endpoints
7. **Supplementary pages** (events, resources, links)

### 3.2 Content Migration — Primary Language
- [ ] Seed CMS with all must-migrate content
- [ ] Import media assets to CMS CDN
- [ ] Verify all content renders correctly
- [ ] Test all forms (submission, email delivery, spam protection)
- [ ] Test all embedded content (videos, maps, external widgets)

**Deliverables**: All primary-language pages live on preview URL with real content

---

## Phase 4: Page Build — Additional Languages (1–3 weeks, if applicable)

### 4.1 Build Language-Specific Pages
- [ ] Build all pages for additional language(s)
- [ ] Wire language toggle (URL routing, cookie persistence, `lang` attribute)
- [ ] Add `hreflang` tags cross-linking language equivalents
- [ ] Seed CMS with language-specific content
- [ ] Test CJK/RTL rendering at all breakpoints if applicable

### 4.2 Content Migration — Additional Languages
- [ ] Migrate all content from legacy language-specific sites
- [ ] Verify language-specific contact info, schedules, group names
- [ ] Test language toggle flow end-to-end

**Deliverables**: Full bilingual/multilingual site on preview URL

---

## Phase 5: Quality & Launch Prep (1–2 weeks)

### 5.1 Performance
- [ ] Lighthouse audit: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95
- [ ] LCP < 2.5s on mobile 4G
- [ ] CLS < 0.1
- [ ] Total page weight < 500KB (JS + CSS)
- [ ] Image optimization pass (no hero image > 200KB)
- [ ] Font loading audit (no FOIT, no layout shift from font swap)

### 5.2 Accessibility
- [ ] Automated audit (axe-core / Lighthouse)
- [ ] Manual keyboard navigation test (every interactive element)
- [ ] Screen reader pass (VoiceOver / NVDA on key flows)
- [ ] Color contrast check (4.5:1 body, 3:1 large text — WCAG AA)
- [ ] All forms labeled, error states announced
- [ ] Skip-to-content link present
- [ ] `lang` attribute correct on every page

### 5.3 SEO
- [ ] Structured data validation (Schema.org validator)
- [ ] OpenGraph + Twitter Card meta on all page types
- [ ] Social sharing test (paste URLs into Twitter, Facebook, iMessage)
- [ ] Sitemap.xml generated and valid
- [ ] robots.txt correct
- [ ] `hreflang` tags validated (if multilingual)
- [ ] Google Search Console setup + sitemap submitted
- [ ] Canonical URLs correct

### 5.4 Analytics & Monitoring
- [ ] Analytics enabled with event tracking on key interactions
- [ ] Uptime monitoring configured
- [ ] Error tracking / alerting in place

### 5.5 Responsive Testing
- [ ] Mobile (375px) — every page
- [ ] Tablet (768px) — every page
- [ ] Desktop (1280px) — every page
- [ ] Wide (1440px+) — key pages
- [ ] Automated viewport tests in CI (Playwright or similar)

### 5.6 E2E Smoke Tests
- [ ] Homepage loads in both languages
- [ ] Navigation works (desktop + mobile hamburger)
- [ ] Form submission works (at least one form type)
- [ ] Content library renders and filters work
- [ ] Language toggle works end-to-end
- [ ] External embeds load (video, maps, giving widget)

### 5.7 Content & CMS
- [ ] All content reviewed and approved by stakeholder
- [ ] CMS backup configured (automated export schedule)
- [ ] Staff documentation written (cheat sheet for common tasks)
- [ ] Staff training session delivered (or Loom recorded)
- [ ] Verify non-technical staff can publish content independently

### 5.8 Favicons & Metadata
- [ ] Favicon set (ICO, 32px PNG, 180px apple-touch-icon, SVG)
- [ ] Web app manifest (name, icons, theme color)
- [ ] Default OG images per page type

**Deliverables**: All audits passing, documentation complete, staff trained

---

## Phase 6: DNS Cutover & Launch (1 day)

### 6.1 Pre-Launch Checklist
- [ ] Final content review with stakeholder — "this is what goes live"
- [ ] All redirects configured and tested (old URLs → new URLs)
- [ ] SSL certificates confirmed for new domain
- [ ] Analytics confirmed receiving data on preview URL
- [ ] Backups of old site archived (screenshots, content export, database dump if applicable)

### 6.2 DNS Cutover
- [ ] Point primary domain to new hosting (update A/CNAME records)
- [ ] Configure legacy domain redirects (301s for all old subdomains)
- [ ] Verify DNS propagation (check from multiple locations)
- [ ] Verify all redirects work (spot-check old bookmarkable URLs)
- [ ] Verify SSL working on all domains/subdomains
- [ ] Verify analytics receiving production traffic

### 6.3 Post-Launch (first 48 hours)
- [ ] Monitor for errors (broken links, 404s, form failures)
- [ ] Check Google Search Console for crawl issues
- [ ] Verify social sharing previews (OG images rendering correctly)
- [ ] Staff confirms they can publish content on the live site
- [ ] Celebrate 🎉

---

## Phase 7: Post-Launch Optimization (ongoing)

### Week 1–2
- [ ] Fix any issues discovered post-launch
- [ ] Review analytics for unexpected patterns
- [ ] Submit updated sitemap to Google Search Console
- [ ] Monitor Core Web Vitals in field data (CrUX)

### Month 1
- [ ] Review analytics baseline (traffic sources, top pages, conversion events)
- [ ] First content backup verified
- [ ] Staff confidence check — are they publishing independently?
- [ ] Collect feedback from stakeholders and users

### Ongoing
- [ ] Quarterly dependency updates (keep framework and CMS current)
- [ ] Quarterly performance audit (Lighthouse)
- [ ] Annual accessibility re-audit
- [ ] Content freshness review (outdated events, old announcements, stale staff photos)

---

## Appendix: Common Tech Stack Combinations

| Use Case | Frontend | CMS | Hosting | Good For |
|---|---|---|---|---|
| Static-first, content-driven | Astro | Sanity | Vercel | Churches, non-profits, portfolios |
| React ecosystem, dynamic features | Next.js | Sanity or Contentful | Vercel | SaaS marketing sites, blogs |
| Simple blog/portfolio | Astro | Markdown/MDX (no CMS) | Netlify/Vercel | Personal sites, dev blogs |
| WordPress migration | Next.js | WordPress (headless) | Vercel/WP Engine | Orgs with existing WP investment |
| Budget-conscious | Astro | Decap CMS (Git-based) | Netlify | No CMS cost, Git-literate editors |

## Appendix: Cost Expectations (Free/Low-Cost Stack)

| Service | Free Tier | Paid Trigger |
|---|---|---|
| Vercel | Hobby (1 project, sufficient for most) | Team features, more projects |
| Sanity | 20 users, 10K documents, 500K API requests | >10K docs or team features ($15/user/mo) |
| Resend (email) | 100 emails/day | Higher volume |
| Cloudflare Turnstile | Free | — |
| Pagefind (search) | Free (static, build-time) | — |
| Vercel Web Analytics | Free on Hobby (2,500 events/day) | Higher volume |
| GitHub | Free for public/private repos | Team features |
| **Total** | **$0/month** | Typically $15-50/mo when scaling |
