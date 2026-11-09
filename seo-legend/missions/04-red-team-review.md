# Mission 04 — Red-team review

Paste this after an audit or verification that claims success. The mission is to
**falsify the result**, not to confirm it.

---

## Role

You are the adversarial reviewer. Assume the audit contains false passes. Your
job is to find them, prove them, and rank them. You do not accept "the script
said PASS" as evidence that the site is healthy.

## Mission

Attack the mission `<mission-id>` result and try to prove it wrong. Produce a
falsification report with reproducible evidence. Do not fix anything.

## Rules of engagement

- Read-only unless the brief grants `L2`. Never run destructive tests on
  production (no deleting URLs, no forcing 5xx, no DNS changes).
- Stay inside scope. If you find an out-of-scope issue, log it as an observation.
- Every claim needs a reproducible artifact: command, URL, JSON path, screenshot.
- Do not manufacture a problem to look thorough. "No finding" is a valid result.
- Do not test by violating terms of service or policy.

## Attack list

Work through every category. Mark `CLEAR`, `FOUND`, or `N/A` with evidence.

### 1. False passes in automation

- [ ] Did the auditor silently skip pages (timeouts, 403, content-type filters)?
- [ ] Did it follow redirects and grade the destination while ignoring the chain?
- [ ] Did `--max` truncate a large template and miss the bad half?
- [ ] Are duplicate checks case/whitespace/trailing-slash sensitive enough?
- [ ] Did it treat a soft 404 (200 with "not found") as healthy?
- [ ] Did it grade a staging page while claiming production?
- [ ] Are canonical checks comparing normalized URLs correctly?
- [ ] Did JSON-LD parsing accept an empty block as valid?
- [ ] Did the audit ignore `X-Robots-Tag` or only check meta robots?
- [ ] Did the audit run before the deploy that changed the site?

### 2. Indexation and canonical traps

- [ ] `noindex` + canonical to another URL on the same page.
- [ ] Canonical pointing to a redirect, 404, or `noindex` page.
- [ ] Canonical host/protocol mismatch (`http`, `www`, trailing slash).
- [ ] Sitemap containing redirects, 404s, or non-canonical URLs.
- [ ] robots.txt blocking CSS/JS or a path that is still linked.
- [ ] Staging/preview host indexable or canonical to production.
- [ ] Pagination canonicalised to page 1.
- [ ] Facet/search URLs indexable with thin content.
- [ ] hreflang to a redirect/404/non-canonical URL; missing self-reference.
- [ ] Language selector only works with JS; variants unreachable.

### 3. Structured-data fraud

- [ ] Markup describes content not visible on the page (price, rating, author).
- [ ] `aggregateRating` without visible reviews.
- [ ] `FAQPage` marking up hidden or keyword-stuffed Q&A.
- [ ] `Product` price/availability differs from the visible page.
- [ ] `Article` dates invented or `dateModified` bumped without a change.
- [ ] `LocalBusiness` address differs from footer/GBP.
- [ ] Multiple conflicting `Organization` entities.
- [ ] Relative `url`/`image` values.
- [ ] Stale `Event` markup after the event.
- [ ] Schema injected only for bots (cloaking).

### 4. Content and trust

- [ ] Title/description promises something the page does not deliver.
- [ ] Duplicate or near-duplicate copy across location/keyword pages.
- [ ] Invented author, credentials, reviews, case studies, or statistics.
- [ ] AI-generated pages with no editorial review or unique value.
- [ ] Hidden text/links, keyword stuffing, doorway patterns.
- [ ] Internal links point to redirects or 404s.
- [ ] Orphan pages in the sitemap.
- [ ] Cannibalisation between two URLs for the same intent.
- [ ] Outdated facts/dates presented as current.
- [ ] Legal/regulated claims without substantiation.

### 5. Performance illusions

- [ ] Lighthouse run on a fast machine/network, not representative mobile.
- [ ] LCP measured on a page with a different template than claimed.
- [ ] CLS hidden by a late cookie banner or font swap not captured.
- [ ] INP claimed from lab TBT (Lighthouse cannot measure real INP).
- [ ] Field data from a different origin/path or stale CrUX window.
- [ ] Third-party scripts loaded before consent and counted as "performance".
- [ ] Hero lazy-loaded or served oversized.
- [ ] Cache headers absent on hashed assets; HTML cached incorrectly.

### 6. Consent and analytics leakage

- [ ] Any `google-analytics.com`, `googletagmanager.com`, `facebook.net`, or
  `connect.facebook.net` request before opt-in (network panel, clean profile).
- [ ] `_ga`, `_gid`, `_fbp`, `_fbc` cookies before consent.
- [ ] Consent defaults granted instead of denied.
- [ ] Reject all still loads tags.
- [ ] Analytics-only consent also enables marketing.
- [ ] Revoke does not stop hits or purge cookies.
- [ ] SPA route changes send duplicate or zero page_views.
- [ ] PII in URLs, event parameters, or referrers.
- [ ] Internal/staging traffic polluting production data.
- [ ] Privacy notice missing a vendor or purpose.

### 7. Redirect and migration traps

- [ ] Redirect chains (A→B→C) or loops.
- [ ] Redirect to homepage instead of the closest equivalent.
- [ ] 302 used for a permanent move.
- [ ] Old URL still in sitemap/internal links.
- [ ] Redirect target returns 404 or `noindex`.
- [ ] Case/trailing-slash variants not consolidated.
- [ ] Query strings dropped where they carry meaning.
- [ ] Staging left accessible after launch.
- [ ] Backlink URLs not mapped.
- [ ] Rollback never tested.

### 8. Measurement dishonesty

- [ ] Ranking/traffic claims without GSC/analytics evidence.
- [ ] Baseline missing or taken after the change.
- [ ] Different scope/flags between baseline and after.
- [ ] Seasonality or algorithm update ignored in attribution.
- [ ] "Impressions up" presented as success while clicks/quality fell.
- [ ] Competitor metrics from an unverifiable source.
- [ ] Forecast presented as a commitment.
- [ ] Screenshots cropped to hide regressions.

### 9. Security and hygiene

- [ ] `.env`, `.git`, backups, source maps, or `node_modules` exposed.
- [ ] Mixed content on an HTTPS page.
- [ ] Missing `X-Content-Type-Options`, `Referrer-Policy`, frame protection.
- [ ] HSTS missing or applied without subdomain readiness.
- [ ] Debug/verbose errors leaking stack traces.
- [ ] Admin/CMS reachable without auth.
- [ ] Unexpected redirects or injected pages (hack signal).
- [ ] Rate limiting/WAF blocking legitimate crawlers.
- [ ] Secrets in client bundles or analytics payloads.

## Severity of red-team findings

Use the same model as `SKILL.md` §4. A red-team finding that invalidates a
`PASS` verdict is at least `P1`; if it means the site is broken, unsafe, or
deindexed, it is `P0`.

## Output

Write `<evidence-dir>/RED-TEAM.md`:

```markdown
# Red-team review — <mission-id>

Original verdict: <PASS/...>
Red-team verdict: CONFIRMED | OVERTURNED | PARTIAL
Date / reviewer: ...

## Summary
<3 bullets max>

## Findings
| ID | Attack | Severity | Evidence | Impact on verdict |
| --- | --- | --- | --- | --- |

## Cleared checks
<what you attacked and could not break>

## Unverifiable claims
<claims with no access/evidence>

## Required actions
1. <must fix before sign-off>
2. ...
```

## Stop and ask if

- You find an active security incident.
- You find evidence of a manual action, hack, or data exposure.
- Proving a finding requires production writes or destructive testing.
- The only way to "prove" something is to fabricate or infer beyond evidence.

## Final response format

```text
MISSION: <id>
RED-TEAM VERDICT: CONFIRMED | OVERTURNED | PARTIAL
NEW FINDINGS: <n> (P0=<n>, P1=<n>)
STRONGEST ATTACK: <one line + evidence>
CLEARED: <n> checks
EVIDENCE: <path>
NEXT: <single action>
```
