# Master SEO audit checklist

Copy this into the mission evidence directory and fill the **Status** and
**Evidence** columns. Never delete a row; use `N/A` with a reason. Default
severity is a starting point — adjust with justification.

Status values: `☐` not checked · `PASS` · `FAIL` · `N/A` · `BLOCKED`

**Finding IDs are one shared registry.** `scripts/seo-audit.mjs` emits these
same IDs for automated checks. Never reuse an ID for a different check. Prefixes:
`M` mission, `T` technical/crawl, `C` content/metadata, `S` structured data,
`P` performance, `U` UX/accessibility, `I` international, `E` ecommerce, `L` local,
`A` AI search, `G` analytics/consent, `X` risk/security.

---

## 0. Mission and scope

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| M-00 | Mission brief complete and approved | P1 | `missions/00-mission-brief.md` §3 | brief path | ☐ |
| M-01 | Scope, locales, templates, environments confirmed | P1 | brief | brief path | ☐ |
| M-02 | Baseline artifact captured before any change | P1 | `baseline.json` timestamp/commit | path | ☐ |
| M-03 | Access confirmed (GSC/Bing/analytics/logs/browser) | P2 | permissions check | notes | ☐ |
| M-04 | Rollback plan written and plausible | P1 | brief | brief path | ☐ |
| M-05 | Non-goals and "do not touch" list recorded | P2 | brief | brief path | ☐ |
| M-06 | Audit coverage complete: `--max` did not silently truncate the sitemap | P2 | audit JSON `sitemaps` / `meta.options` | findings | ☐ |

## 1. Discovery, crawl, and indexation

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| T-01 | `robots.txt` returns 200 `text/plain` | P1 | `curl -sI /robots.txt` | headers | ☐ |
| T-02 | No accidental `Disallow: /` for `*` | P0 | read robots.txt | file | ☐ |
| T-03 | robots.txt does not block CSS/JS/assets needed to render | P1 | robots + GSC test | file + screenshot | ☐ |
| T-04 | robots.txt references absolute HTTPS sitemap | P3 | read file | file | ☐ |
| T-05 | Staging/preview hosts blocked or password-protected | P0 | fetch staging host | response | ☐ |
| T-06 | Sitemap returns 200 and valid XML | P1 | `curl`, parser | file | ☐ |
| T-07 | Sitemap contains only canonical, indexable, 200 URLs | P1 | audit JSON | `sitemap` section | ☐ |
| T-08 | Sitemap has no duplicates | P2 | audit JSON | `sitemap` section | ☐ |
| T-09 | Sitemap size within 50k URLs / 50 MB per file | P3 | sitemap count | count | ☐ |
| T-10 | Sitemap submitted in GSC and Bing, status Success | P2 | GSC/Bing UI | screenshot/export | ☐ |
| T-11 | Only one canonical host/protocol serves 200 | P0 | curl http/https/www/non-www | status matrix | ☐ |
| T-12 | Trailing-slash policy consistent (301 to winner) | P2 | curl variants | status matrix | ☐ |
| T-13 | Case variants consolidated | P2 | curl uppercase sample | status matrix | ☐ |
| T-14 | No redirect chains (max 1 hop) | P1 | `curl -sIL`, audit JSON | hop list | ☐ |
| T-15 | No redirect loops | P0 | `curl -sIL` | hop list | ☐ |
| T-16 | Permanent moves use 301/308 (not 302) | P2 | redirect config | config | ☐ |
| T-17 | Redirects target closest equivalent, not homepage | P1 | URL map review | map | ☐ |
| T-18 | 404s return 404 (no soft 404) | P1 | fetch random missing URL | status + body | ☐ |
| T-19 | No accidental `noindex` in production | P0 | audit JSON + GSC | findings | ☐ |
| T-20 | `X-Robots-Tag` not applied to whole origin accidentally | P1 | `curl -I` sample | headers | ☐ |
| T-21 | Cart/checkout/account/admin excluded from index | P2 | audit + robots | findings | ☐ |
| T-22 | Internal search results `noindex` | P2 | fetch search URL | meta | ☐ |
| T-23 | Pagination self-canonical and crawlable | P2 | sample page 2 | tags + links | ☐ |
| T-24 | Facets have documented index/noindex policy | P2 | strategy doc + sample | doc | ☐ |
| T-25 | No infinite crawl spaces (calendar/filter/search) | P2 | crawl sample | notes | ☐ |
| T-26 | 5xx rate at baseline; no new 5xx | P0 | logs/audit | counts | ☐ |
| T-27 | Crawl rate/429 not blocking legitimate bots | P2 | logs/WAF | notes | ☐ |
| T-28 | GSC Pages report reviewed; critical errors listed | P1 | GSC export | export | ☐ |
| T-29 | URL Inspection used for key URLs | P2 | GSC UI | screenshots | ☐ |
| T-30 | Manual actions/security issues absent | P0 | GSC UI | screenshot | ☐ |
| T-31 | XML sitemap available for every locale/section | P2 | index review | sitemap index | ☐ |
| T-32 | `lastmod` reflects real content changes | P3 | spot check | sample | ☐ |
| T-33 | Important pages within 3 clicks of home | P2 | crawl depth report | export | ☐ |
| T-34 | No orphan pages in sitemap | P2 | crawl from home only | export | ☐ |
| T-35 | Server logs show Googlebot fetching HTML + assets | P2 | log sample | log excerpt | ☐ |
| T-36 | Hacked-site signals absent (spam pages, odd redirects) | P0 | site: search, samples | screenshot | ☐ |
| T-37 | Every audited URL returns its expected 200 HTML response | P1 | audit JSON `pages` | findings | ☐ |
| T-38 | URLs that redirect are referenced by their final URL | P2 | audit JSON `pages[].redirects` | findings | ☐ |
| T-39 | No meta refresh redirects | P2 | audit JSON `pages` | findings | ☐ |

## 2. Canonicals and duplicate content

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| T-40 | Every indexable page has exactly one canonical | P1 | audit JSON | findings | ☐ |
| T-41 | Canonical is absolute HTTPS | P1 | parsed tags | findings | ☐ |
| T-42 | Canonical is self-referencing (or documented consolidation) | P1 | compare canonical vs URL | findings | ☐ |
| T-43 | Canonical target returns 200 and is indexable | P1 | fetch target | status | ☐ |
| T-44 | Canonical target is not a redirect or `noindex` | P1 | fetch target | status + meta | ☐ |
| T-45 | No `noindex` + cross-canonical conflict | P1 | audit JSON | findings | ☐ |
| T-46 | Canonical matches sitemap URL and internal links | P2 | cross-check | sample | ☐ |
| T-47 | `og:url` matches canonical | P3 | audit JSON | findings | ☐ |
| T-48 | Tracking parameters canonicalised to clean URL | P2 | fetch `?utm=test` | tag | ☐ |
| T-49 | Duplicate titles across site reviewed | P2 | audit duplicate groups | findings | ☐ |
| T-50 | Duplicate descriptions across site reviewed | P2 | audit duplicate groups | findings | ☐ |
| T-51 | www/non-www and http/https duplicates resolved | P0 | curl matrix | matrix | ☐ |
| T-52 | Print/AMP/mobile variants consolidated | P3 | sample | notes | ☐ |
| T-53 | Syndicated copies canonical to original (if copier) | P2 | sample | tags | ☐ |

## 3. Metadata and SERP appearance

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| C-01 | Every indexable page has a unique title | P1 | audit JSON | findings | ☐ |
| C-02 | Titles are 15–60 chars (target 50–60) | P2 | audit JSON | findings | ☐ |
| C-03 | Title matches page intent and H1 | P2 | sample review | notes | ☐ |
| C-04 | No keyword stuffing/ALL CAPS/clickbait | P2 | sample review | notes | ☐ |
| C-05 | Unique meta description per page | P2 | audit JSON | findings | ☐ |
| C-06 | Descriptions 70–160 chars, value-led | P3 | audit JSON | findings | ☐ |
| C-07 | Exactly one H1 per page | P1 | audit JSON | findings | ☐ |
| C-08 | H1 matches page topic and title semantically | P2 | sample review | notes | ☐ |
| C-09 | Logical H2/H3 hierarchy, no skipped levels | P3 | sample review | notes | ☐ |
| C-10 | `lang` attribute present and correct | P2 | audit JSON | findings | ☐ |
| C-11 | Viewport meta present | P1 | audit JSON | findings | ☐ |
| C-12 | Open Graph title/description/image present | P3 | audit JSON | findings | ☐ |
| C-13 | OG image absolute, ≥1200×630, not text-only | P2 | fetch image | image | ☐ |
| C-14 | Twitter card present and correct | P3 | audit JSON | findings | ☐ |
| C-15 | Favicon and site name correct | P3 | browser/`/favicon.ico` | screenshot | ☐ |
| C-16 | No `nosnippet`/`max-snippet:0` unless intentional | P2 | meta check | tags | ☐ |
| C-17 | Breadcrumbs visible where used | P3 | sample | screenshot | ☐ |
| C-18 | Published/updated dates accurate | P2 | sample | notes | ☐ |

## 4. Content quality and intent

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| C-20 | Primary intent classified per template | P2 | intent table | doc | ☐ |
| C-21 | Page answers the query in the first screen | P2 | sample review | notes | ☐ |
| C-22 | Content has original value (data, experience, POV) | P1 | sample review | notes | ☐ |
| C-23 | No thin/placeholder/"coming soon" content | P1 | sample + audit | notes | ☐ |
| C-24 | Facts sourced and dated | P1 | sample | citations | ☐ |
| C-25 | Author bylines/bios where topic requires | P2 | sample | screenshot | ☐ |
| C-26 | Reviewer attribution for sensitive topics | P2 | sample | screenshot | ☐ |
| C-27 | No contradictory claims across pages | P2 | sample | notes | ☐ |
| C-28 | No cannibalisation between same-intent URLs | P2 | GSC query map | export | ☐ |
| C-29 | Internal links descriptive and crawlable (`<a href>`) | P2 | audit + sample | findings | ☐ |
| C-30 | No broken internal links | P1 | `--check-links` | findings | ☐ |
| C-31 | Every page has ≥1 internal inbound link | P2 | crawl export | export | ☐ |
| C-32 | Hub-and-spoke links between pillar and detail pages | P3 | sample | notes | ☐ |
| C-33 | Images have meaningful alt or empty alt if decorative | P2 | audit JSON | findings | ☐ |
| C-34 | Content matches title/description promise | P2 | sample | notes | ☐ |
| C-35 | Content readable: short paragraphs, subheads, lists | P3 | sample | notes | ☐ |
| C-36 | No hidden text/links, keyword stuffing, doorway pages | P0 | sample + code review | findings | ☐ |
| C-37 | AI-assisted content reviewed, fact-checked, edited | P1 | editorial log | log | ☐ |
| C-38 | No programmatic city/keyword pages without unique value | P1 | URL sample | notes | ☐ |

## 5. Structured data

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| S-01 | All JSON-LD blocks parse as valid JSON | P1 | audit JSON | findings | ☐ |
| S-02 | `@context` = `https://schema.org` | P2 | audit JSON | findings | ☐ |
| S-03 | Most specific accurate `@type` used | P2 | sample review | notes | ☐ |
| S-04 | Required fields present for chosen type | P1 | audit JSON + validator | findings | ☐ |
| S-05 | URLs/image/logo/sameAs absolute and canonical | P2 | audit JSON | findings | ☐ |
| S-06 | Markup matches visible content | P1 | side-by-side sample | screenshots | ☐ |
| S-07 | No fake reviews/ratings/prices/availability | P0 | sample | notes | ☐ |
| S-08 | `@id` values stable, unique, consistent | P3 | graph review | notes | ☐ |
| S-09 | No duplicate conflicting entities | P2 | graph review | notes | ☐ |
| S-10 | Rich Results Test passes for intended feature | P1 | test 3–5 URLs | screenshots | ☐ |
| S-11 | Schema Markup Validator clean | P2 | validator | screenshots | ☐ |
| S-12 | GSC Enhancements report reviewed after deploy | P2 | GSC export | export | ☐ |
| S-13 | BreadcrumbList matches visible breadcrumbs | P2 | sample | screenshot | ☐ |
| S-14 | Article dates/author/publisher correct | P2 | sample | notes | ☐ |
| S-15 | Product price/currency/availability match page | P1 | sample | screenshot | ☐ |
| S-16 | LocalBusiness NAP matches footer/GBP | P1 | sample | screenshot | ☐ |
| S-17 | Stale Event/Product markup removed/updated | P2 | sample | notes | ☐ |
| S-18 | FAQPage Q&A visible on page | P2 | sample | screenshot | ☐ |

## 6. Performance / Core Web Vitals

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| P-01 | Field CWV baseline captured (CrUX/GSC/RUM) with date | P1 | PSI/GSC export | export | ☐ |
| P-02 | LCP ≤ 2.5s at p75 (or baseline + plan) | P1 | field data | export | ☐ |
| P-03 | INP ≤ 200ms at p75 (or baseline + plan) | P1 | field data | export | ☐ |
| P-04 | CLS ≤ 0.1 at p75 (or baseline + plan) | P1 | field data | export | ☐ |
| P-05 | LCP element identified on mobile and desktop | P2 | DevTools/PSI | screenshot | ☐ |
| P-06 | LCP image properly sized, compressed, not lazy | P1 | code + waterfall | notes | ☐ |
| P-07 | TTFB < 0.8s for static pages (target) | P2 | PSI/curl timing | measurement | ☐ |
| P-08 | No render-blocking third parties above the fold | P2 | waterfall | screenshot | ☐ |
| P-09 | Fonts subset/swap/preload only as needed | P2 | code + waterfall | notes | ☐ |
| P-10 | Images responsive (`srcset`/`sizes`) and modern format | P2 | code | notes | ☐ |
| P-11 | Media dimensions/aspect-ratio set (no CLS) | P2 | audit JSON | findings | ☐ |
| P-12 | JS/CSS budgets met or remediation plan written | P2 | build report | numbers | ☐ |
| P-13 | Static marketing pages not needlessly dynamic | P2 | framework config | notes | ☐ |
| P-14 | Hashed assets `immutable` cache; HTML revalidates | P2 | `curl -I` | headers | ☐ |
| P-15 | CDN/brotli/HTTP2+ enabled | P3 | headers/tools | screenshot | ☐ |
| P-16 | Lab baseline (Lighthouse) recorded, 3-run median | P3 | Lighthouse | JSON | ☐ |
| P-17 | No CWV regression after change | P1 | before/after | comparison | ☐ |

## 7. Mobile, accessibility, UX

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| U-01 | Content parity mobile vs desktop | P1 | mobile emulation | screenshots | ☐ |
| U-02 | No horizontal scroll at 320/360/390/768px | P2 | browser widths | screenshots | ☐ |
| U-03 | Tap targets ≥24×24 (ideally 48×48) | P3 | mobile review | notes | ☐ |
| U-04 | No intrusive interstitials over main content | P2 | mobile review | screenshot | ☐ |
| U-05 | Forms labelled, correct `type`/`autocomplete` | P3 | sample | notes | ☐ |
| U-06 | Keyboard navigation and visible focus | P2 | keyboard test | notes | ☐ |
| U-07 | Colour contrast meets WCAG 2.2 AA | P2 | axe/Lighthouse | report | ☐ |
| U-08 | Semantic headings/landmarks | P3 | DOM review | notes | ☐ |
| U-09 | No accessibility regression after change | P2 | axe before/after | reports | ☐ |

## 8. International (if applicable)

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| I-01 | URL structure per market documented | P2 | strategy doc | doc | ☐ |
| I-02 | Every variant self-canonical | P1 | audit JSON | findings | ☐ |
| I-03 | hreflang cluster complete and reciprocal | P1 | matrix check | matrix | ☐ |
| I-04 | hreflang includes self-reference | P1 | matrix check | matrix | ☐ |
| I-05 | `x-default` exists and returns 200 | P2 | fetch | status | ☐ |
| I-06 | hreflang targets 200, canonical, indexable | P1 | fetch all | matrix | ☐ |
| I-07 | Valid codes (`en-GB`, not `en-UK`) | P2 | matrix | matrix | ☐ |
| I-08 | No forced IP redirects/cloaking | P1 | VPN/proxy test | notes | ☐ |
| I-09 | Localised content reviewed by fluent human | P2 | editorial log | log | ☐ |
| I-10 | Language switcher crawlable, preserves page | P2 | JS-disabled test | screenshot | ☐ |
| I-11 | Currency/units/legal correct per market | P2 | sample | notes | ☐ |
| I-12 | Analytics segmentable by locale | P3 | GA4 config | screenshot | ☐ |

## 9. Ecommerce (if applicable)

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| E-01 | Taxonomy shallow, logical, fully linked | P2 | crawl | export | ☐ |
| E-02 | Product/category templates unique metadata | P1 | audit JSON | findings | ☐ |
| E-03 | Variant canonical strategy documented | P1 | sample variants | notes | ☐ |
| E-04 | Facet index policy documented and implemented | P2 | sample facets | notes | ☐ |
| E-05 | Pagination self-canonical, crawlable | P2 | sample page 2 | tags | ☐ |
| E-06 | Internal search `noindex` | P2 | fetch | meta | ☐ |
| E-07 | Out-of-stock pages kept indexable / handled | P2 | sample | notes | ☐ |
| E-08 | Discontinued products redirected or retired | P1 | URL sample | status | ☐ |
| E-09 | Product schema matches visible price/stock | P1 | sample | screenshot | ☐ |
| E-10 | No fake reviews/urgency/discounts | P0 | sample | notes | ☐ |
| E-11 | Feed data matches landing pages | P2 | feed vs page | comparison | ☐ |
| E-12 | Seasonal pages have stable URL + retirement plan | P3 | URL review | notes | ☐ |

## 10. Local (if applicable)

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| L-01 | GBP claimed, verified, complete | P1 | GBP UI | screenshot | ☐ |
| L-02 | NAP identical across site/GBP/directories | P1 | comparison | matrix | ☐ |
| L-03 | One GBP per real staffed location | P2 | GBP UI | screenshot | ☐ |
| L-04 | Location pages unique and genuinely local | P1 | sample | notes | ☐ |
| L-05 | `LocalBusiness` schema matches visible NAP/hours | P1 | sample | screenshot | ☐ |
| L-06 | Reviews real, visible, policy-compliant | P1 | sample | notes | ☐ |
| L-07 | Hours/service area accurate | P2 | sample + GBP | screenshot | ☐ |
| L-08 | No fake addresses/keyword-stuffed names | P0 | GBP/site | notes | ☐ |
| L-09 | Location pages linked from nav/locations index | P2 | crawl | export | ☐ |
| L-10 | GBP insights/analytics tracked | P3 | GBP UI | screenshot | ☐ |

## 11. AI search and agent-readiness

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| A-01 | Retrieval crawlers you want are not blocked | P2 | robots.txt | file | ☐ |
| A-02 | Training crawler policy is a documented decision | P3 | policy doc | doc | ☐ |
| A-03 | Key content extractable without JS/login | P2 | JS-disabled fetch | notes | ☐ |
| A-04 | Answers direct, sourced, dated | P2 | sample | notes | ☐ |
| A-05 | Entity data consistent (Organization/Person/sameAs) | P2 | schema + site | findings | ☐ |
| A-06 | `llms.txt` (if used) valid v2 and links live | P3 | fetch + parse | file | ☐ |
| A-07 | Markdown mirrors (if used) match HTML | P3 | diff sample | notes | ☐ |
| A-08 | No cloaking/bot-specific content | P0 | UA comparison | notes | ☐ |
| A-09 | AI referral traffic segmented in analytics | P3 | GA4 config | screenshot | ☐ |
| A-10 | No citation/ranking guarantees in reporting | P2 | report review | notes | ☐ |

## 12. Analytics, consent, privacy

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| G-01 | No analytics/marketing request before consent | P0 | clean profile + network | HAR/screenshot | ☐ |
| G-02 | No `_ga`/`_fbp` cookies before consent | P1 | DevTools cookies | screenshot | ☐ |
| G-03 | Consent defaults denied | P1 | code + network | notes | ☐ |
| G-04 | Accept all loads only intended vendors | P1 | network panel | HAR | ☐ |
| G-05 | Reject all loads no vendors and purges cookies | P0 | network + cookies | HAR | ☐ |
| G-06 | Analytics-only does not enable marketing | P1 | matrix test | notes | ☐ |
| G-07 | Marketing-only does not enable analytics | P2 | matrix test | notes | ☐ |
| G-08 | Consent persists across reloads/new tabs | P2 | test | notes | ☐ |
| G-09 | Revoke stops hits and purges cookies | P1 | test | notes | ☐ |
| G-10 | SPA route changes send exactly one page_view | P2 | DebugView | screenshot | ☐ |
| G-11 | No PII in analytics payloads/URLs | P1 | network review | notes | ☐ |
| G-12 | Internal/staging traffic excluded | P3 | GA4 config | screenshot | ☐ |
| G-13 | Privacy notice lists vendors/purposes/retention | P2 | policy page | screenshot | ☐ |
| G-14 | Consent record includes version + timestamp | P3 | storage/code | notes | ☐ |
| G-15 | Banner does not hurt LCP/CLS | P2 | CWV comparison | numbers | ☐ |

## 13. Measurement

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| M-10 | GSC domain property verified | P2 | GSC UI | screenshot | ☐ |
| M-11 | Bing verified; sitemaps submitted | P3 | Bing UI | screenshot | ☐ |
| M-12 | GA4 linked; conversions defined/tested | P2 | GA4 UI | screenshot | ☐ |
| M-13 | Branded/non-branded segmentation configured | P2 | GSC/GA4 | screenshot | ☐ |
| M-14 | Organic landing-page report available | P3 | GA4 | screenshot | ☐ |
| M-15 | AI referral sources segmented | P3 | GA4 | screenshot | ☐ |
| M-16 | Baseline KPIs saved before change | P1 | export | file | ☐ |
| M-17 | Deploy/content annotations in analytics | P3 | GA4 annotations | screenshot | ☐ |
| M-18 | Reporting cadence/owners agreed | P3 | brief | doc | ☐ |
| M-19 | No fabricated/unsourced metric in report | P1 | report review | notes | ☐ |

## 14. Security and risk

| ID | Check | Sev | How to verify | Evidence | Status |
| --- | --- | --- | --- | --- | --- |
| X-01 | Valid TLS, no mixed content | P0 | browser/curl | screenshot | ☐ |
| X-02 | `.env`/`.git`/backups/source maps not exposed | P0 | fetch paths | status | ☐ |
| X-03 | `X-Content-Type-Options: nosniff` | P2 | `curl -I` | headers | ☐ |
| X-04 | `Referrer-Policy` set | P2 | `curl -I` | headers | ☐ |
| X-05 | Frame protection (`X-Frame-Options`/CSP) | P2 | `curl -I` | headers | ☐ |
| X-06 | HSTS only after subdomain readiness | P2 | headers | headers | ☐ |
| X-07 | No debug/stack traces in production errors | P2 | trigger 404/500 | screenshot | ☐ |
| X-08 | Admin/CMS protected | P0 | fetch admin URL | status | ☐ |
| X-09 | No policy-violating tactic in plan | P0 | plan review | notes | ☐ |
| X-10 | Claims/reviews/links compliant | P1 | sample | notes | ☐ |
| X-11 | Accessibility not regressed | P2 | axe | report | ☐ |
| X-12 | Risk register updated with owners | P3 | doc | doc | ☐ |

---

## Summary

```text
Pages audited: <n>
Checks run: <n>
PASS: <n> | FAIL: <n> | N/A: <n> | BLOCKED: <n>
P0: <n> | P1: <n> | P2: <n> | P3: <n>
Baseline artifact: <path>
Audit exit code: <0|1>
```

## Sign-off

- [ ] All in-scope rows completed or `N/A` with reason.
- [ ] Every `FAIL` has a finding ID, severity, and evidence.
- [ ] `BLOCKED` rows list exactly what access is needed.
- [ ] No `PASS` without evidence.
- [ ] Findings deduplicated by root cause.
- [ ] Report generated with the required deliverables.
- [ ] Human reviewer: `<name/date>`
