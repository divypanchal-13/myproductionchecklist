# Launch checklist

For a new site, replatform, redesign, or any release that can change crawling,
indexing, metadata, rendering, redirects, or analytics. Copy into the mission
evidence directory and fill every row.

Release: `<name/version>`
Target date/time: `<YYYY-MM-DD HH:mm TZ>`
Owner: `<name>`
Rollback owner: `<name>`
Risk tier: `<L2/L3>`

---

## 1. T-14 days — plan and baseline

- [ ] Mission brief approved; scope and non-goals written.
- [ ] Full crawl of the current production site saved.
- [ ] GSC exports: Pages, Performance (16 months), Sitemaps, CWV, Enhancements.
- [ ] Bing export saved.
- [ ] Analytics baseline: organic sessions, landing pages, conversions (12 months).
- [ ] Backlink inventory and top-linked URLs saved.
- [ ] URL map complete (old → new, 1:1 closest equivalent).
- [ ] Redirect strategy documented (301/308, query handling, trailing slash, case).
- [ ] Staging is password-protected and `noindex` (meta + header + robots).
- [ ] Rollback plan written and rehearsed where possible.
- [ ] Monitoring: uptime, error rate, logs, alert recipients.
- [ ] Freeze on unrelated URL/content changes announced.
- [ ] Legal/privacy review for analytics/consent changes.
- [ ] Accessibility review scheduled.

## 2. T-7 days — pre-flight

- [ ] Staging crawl matches the new URL map; no unexpected 4xx/5xx.
- [ ] `robots.txt` production rules staged (no `Disallow: /`).
- [ ] Sitemap generated from canonical URLs only; no redirects/404s/`noindex`.
- [ ] Metadata templates reviewed on every template type.
- [ ] Canonical host/protocol/trailing-slash policy verified on staging.
- [ ] Structured data validated on 5 representative templates.
- [ ] Redirects tested with production `Host` header.
- [ ] 404 page returns 404; 500 page handled.
- [ ] Analytics/consent tested on staging with debug mode.
- [ ] Core Web Vitals lab baseline recorded (3-run median, mobile + desktop).
- [ ] Internal-link crawl clean; no orphan new URLs.
- [ ] Image/CDN paths resolve; no mixed content.
- [ ] DNS/TLS/CDN changes reviewed and scheduled.
- [ ] Launch window agreed (avoid Friday/late evening without monitoring).
- [ ] Stakeholder comms drafted.

## 3. T-1 day — go/no-go

- [ ] All T-7 items pass or have a written waiver.
- [ ] Backup/snapshot of current site, database, and config taken.
- [ ] Deploy artifact identified by commit SHA/build ID.
- [ ] Rollback command tested (not just written).
- [ ] On-call engineer and decision-maker confirmed.
- [ ] Monitoring dashboards open and alerts tested.
- [ ] Credentials/access verified for the launch window.
- [ ] **Go / No-go decision recorded: `<name + time>`**

## 4. Launch day

### Deploy

- [ ] Deploy the approved artifact only.
- [ ] Verify process manager (PM2/systemd) has exactly the intended instance count.
- [ ] Confirm the app is listening on the expected port/host.
- [ ] Verify Apache/NGINX proxy and TLS.
- [ ] Confirm the deploy script exits cleanly; record its output.

### Immediate checks (within 15 minutes)

- [ ] Homepage, top 10 URLs, and one URL per template return 200.
- [ ] `robots.txt` is production-safe and references the sitemap.
- [ ] Sitemap is live, valid, and contains only canonical URLs.
- [ ] Canonical tags point to the new production URLs.
- [ ] No `noindex` in production HTML or headers.
- [ ] HTTPS + canonical host redirects work (one hop).
- [ ] 404 returns 404; old URLs redirect correctly.
- [ ] Assets (CSS/JS/fonts/images) return 200; no mixed content.
- [ ] Forms/contact/checkout work.
- [ ] Consent banner appears; no vendor requests before opt-in.
- [ ] Analytics debug view receives page_view after consent.
- [ ] Mobile rendering correct.
- [ ] No console errors or 5xx spikes in logs.

### Indexing

- [ ] Submit the new sitemap in GSC and Bing.
- [ ] Request indexing for the top 10–20 URLs.
- [ ] Use URL Inspection → Test live URL on 3 key templates.
- [ ] Confirm GSC property still verified.
- [ ] If a domain change: submit Change of Address on the old property.

## 5. T+1 hour

- [ ] 5xx/4xx rate at or below baseline.
- [ ] Redirect hop check on 50 random old URLs passes.
- [ ] Crawl of the new sitemap: 0 unexpected non-200.
- [ ] Logs show crawlers fetching HTML and assets.
- [ ] CDN cache hit ratio normal; no stale HTML.
- [ ] Rollback decision point: any P0 → roll back now.

## 6. T+24 hours

- [ ] GSC Pages report: no new critical errors beyond expected churn.
- [ ] Sitemap status: Success / processing.
- [ ] Logs: top 404s reviewed; missing redirects added.
- [ ] Analytics: traffic and conversions within expected range.
- [ ] CWV lab check on key templates; no regression.
- [ ] Structured data: no new enhancement errors.
- [ ] Search results spot-check for brand + top queries (no promises).
- [ ] Incident log updated.

## 7. T+7 days

- [ ] Indexed count trend compared to baseline.
- [ ] GSC "Not found (404)" and "Redirect error" reviewed.
- [ ] Redirect chains/loops fixed.
- [ ] Backlink targets resolve (top 50).
- [ ] Internal links to old URLs updated.
- [ ] External profiles/ads updated with new URLs.
- [ ] CWV field data direction checked (if available).
- [ ] No open P0; P1 list empty or formally waived by the human owner.

## 8. T+28 days

- [ ] Full audit re-run; compare baseline vs after.
- [ ] Traffic/conversions vs baseline with seasonality context.
- [ ] Low-value/duplicate URLs consolidated.
- [ ] Temporary redirects removed.
- [ ] Staging still inaccessible.
- [ ] Documentation and runbook updated.
- [ ] Post-launch review meeting held; lessons recorded.
- [ ] Sign-off recorded (`checklists/agent-signoff.md`).

---

## Rollback triggers

Roll back immediately if any of these occur and cannot be fixed within the
agreed window:

- Site returns 5xx for a large share of requests.
- Production serves `noindex` or `Disallow: /`.
- Canonical host/protocol is wrong across templates.
- Redirects loop or send large numbers of URLs to 404/homepage.
- Checkout/contact/forms broken.
- Analytics/consent leaks data before opt-in.
- Security exposure (secrets, admin, source maps).
- Indexed pages drop sharply for reasons attributable to the release.

## Rollback record

```text
Time detected: <HH:mm>
Trigger: <what happened + evidence>
Decision by: <name>
Rollback action: <command/change ID>
Rollback completed: <HH:mm>
Verification: <checks + results>
Follow-up: <root cause + owner>
```

## Sign-off

```text
Launch verdict: PASS | CONDITIONAL | FAIL
Open P0: none
Open P1: <none | IDs + human-approved waiver>
Evidence bundle: <path>
Approved by: <name/date>
Next verification: <date>
```
