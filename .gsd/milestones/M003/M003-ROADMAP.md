# M003: 

## Vision
Build all Chinese Ministry pages with bespoke CM content, wire the bilingual language toggle, and migrate all content from cm.ficcc.org — completing the unified bilingual site.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | ZH Homepage & Core Pages | medium | — | ✅ | ZH Homepage, About (with 1983-2009 history timeline), Beliefs (EFCA 11-point), Staff, Sundays (with 7-stop bus route) |
| S02 | ZH Community & Ministries | low | S01 | ✅ | ZH Community with all 7 fellowship groups. ZH Ministries with Sunday School and Discipleship. |
| S03 | ZH Sermons, Events & Transactional | low | S01 | ✅ | ZH Sermons, Events, Give, and Contact pages with WeChat |
| S04 | Language Toggle & Bilingual Wiring | medium | S01 | ✅ | Language toggle switches between /about and /zh/about. URL, lang attribute, and cookie all update. |
| S05 | CM Content Migration | low | S01, S02, S03 | ✅ | All CM content from cm.ficcc.org migrated into Sanity. Redirect map complete. |
