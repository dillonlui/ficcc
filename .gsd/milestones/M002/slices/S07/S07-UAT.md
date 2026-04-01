# S07: Resources & Content Migration — UAT

**Milestone:** M002
**Written:** 2026-04-01T14:40:18.091Z

## UAT: S07 — Resources & Content Migration

### Test 1: Resources page renders
1. Navigate to /resources
2. Verify Hero section with "Resources" title
3. Verify 4 category sections: Spiritual Growth, Bible Readathon, Newcomer Recommendations, Cornell Campus Ministries
4. Verify PDF download links for readathon and newcomer PDFs
5. Verify 7 campus ministry external links

### Test 2: About page has vision and stats
1. Navigate to /about
2. Verify "Our Vision" section with "Develop Humble Servants" content
3. Verify "By the Numbers" stats grid with 4 items

### Test 3: Contact page address is correct
1. Navigate to /contact
2. Verify address reads "429 Mitchell Street" (not 309 College Ave)

### Test 4: Ministries page shows fallback groups
1. Navigate to /ministries
2. Verify 6 fallback group cards visible (Discipleship, Bible Study, Youth, Prayer, Children's SS, Adult SS)

### Test 5: Build succeeds
1. Run `npm run build`
2. Verify all routes prerender without errors
