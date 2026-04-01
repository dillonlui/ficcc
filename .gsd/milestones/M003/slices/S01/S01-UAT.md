# S01: ZH Homepage & Core Pages — UAT

**Milestone:** M003
**Written:** 2026-04-01T16:50:25.490Z

# S01 UAT: ZH Homepage & Core Pages

## Preconditions
- `npm run build` succeeds without errors
- Static output exists at `dist/client/`

## Test Cases

### TC1: ZH Homepage renders at /zh/
1. Open `dist/client/zh/index.html`
2. **Expected:** `<html lang="zh">` attribute present
3. **Expected:** Hero heading contains '歡迎回家'
4. **Expected:** Service times section shows '主日崇拜' and '主日學'
5. **Expected:** Three pillars section has Chinese text (根植聖經, 多元合一, 服務社區)
6. **Expected:** All internal links point to /zh/ paths (e.g. /zh/about, /zh/sermons)
7. **Expected:** Navigation shows Chinese labels (首頁, 關於我們, 團契, 講道, 聯絡我們)

### TC2: ZH About page with history timeline
1. Open `dist/client/zh/about/index.html`
2. **Expected:** `<html lang="zh">` attribute present
3. **Expected:** Page heading contains '我們是誰' or equivalent Chinese about heading
4. **Expected:** History timeline section exists with entries spanning 1968-2009
5. **Expected:** Timeline includes '1983' entry (華人查經班成立 or similar)
6. **Expected:** All internal links point to /zh/ paths

### TC3: ZH Beliefs page with EFCA 11-point Statement
1. Open `dist/client/zh/about/beliefs/index.html`
2. **Expected:** `<html lang="zh">` attribute present
3. **Expected:** Contains 11 belief statement sections (not 8 like EN)
4. **Expected:** Belief topics include God (神), Bible (聖經), Jesus Christ (耶穌基督), Holy Spirit (聖靈), Church (教會)
5. **Expected:** Chinese content paragraphs under each belief point

### TC4: ZH Staff page
1. Open `dist/client/zh/about/staff/index.html`
2. **Expected:** `<html lang="zh">` attribute present
3. **Expected:** Page heading contains '教牧同工'
4. **Expected:** Staff roles shown in Chinese (主任牧師, 副牧師, etc.)

### TC5: ZH Sundays page with bus route
1. Open `dist/client/zh/sundays/index.html`
2. **Expected:** `<html lang="zh">` attribute present
3. **Expected:** Schedule section shows Chinese service times
4. **Expected:** Bus route section lists 7 stops including 'Mitchell' (Church at 429 Mitchell St)
5. **Expected:** Bus route includes: Church, Hasbrouck, Collegetown, North Campus, Ithaca Commons, East Hill Plaza, Church
6. **Expected:** All internal links point to /zh/ paths

### TC6: EN pages unchanged (no regression)
1. Open `dist/client/index.html`
2. **Expected:** `<html lang="en">` attribute present
3. **Expected:** Navigation shows English labels (About, Ministries, Sermons, Contact)
4. **Expected:** No Chinese nav labels (首頁) present in EN homepage
5. **Expected:** Hero content in English

### TC7: Language-aware Header/Footer
1. Compare header in `dist/client/index.html` vs `dist/client/zh/index.html`
2. **Expected:** EN header has English nav links and logo text
3. **Expected:** ZH header has Chinese nav links (首頁, 關於我們, etc.)
4. **Expected:** Language toggle link present — EN pages link to /zh, ZH pages link to /
5. **Expected:** Footer copyright uses appropriate church name per language

## Edge Cases
- **EC1:** ZH pages load CJK fonts — verify Noto Serif SC font references exist in page output
- **EC2:** ZH Beliefs has 11 items vs EN's 8 — this is intentional per EFCA standard, not a bug
