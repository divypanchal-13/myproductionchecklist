# Measurement and reporting

If you cannot measure it, you cannot claim it. If you did not measure it, do not
invent it.

---

## 1. Search Console setup

- [ ] Verify the **domain property** (DNS) and, if useful, the URL-prefix
      property.
- [ ] Submit every sitemap; confirm "Success".
- [ ] Set the correct international targeting via hreflang (targeting UI retired).
- [ ] Link GA4 and Google Ads where appropriate.
- [ ] Add all team members with least-privilege access.
- [ ] Enable email alerts for coverage/security/manual actions.
- [ ] Review the Page indexing report weekly during a migration, monthly after.
- [ ] Review Core Web Vitals and Enhancements after template changes.

### 1.1 Report caveats

- Queries are anonymised/sampled; totals do not match analytics.
- Position is an average across impressions, not a fixed rank.
- Data lags 2–3 days; recent changes may not appear.
- "Discovered/Crawled – currently not indexed" is not always an error.
- URL Inspection shows the **last crawled** version, not live (use "Test live URL").
- Impressions can rise while clicks fall (SERP feature changes).

---

## 2. Bing Webmaster Tools

- Verify via DNS or import from GSC.
- Submit sitemaps.
- Review Index Explorer, SEO Reports, and crawl errors.
- Use URL Submission for urgent updates (quota-limited).
- Bing powers Copilot/ChatGPT search in some contexts; keep it healthy.

---

## 3. KPIs

Choose a small set tied to business outcomes:

| Layer | Metrics |
| --- | --- |
| Visibility | Impressions, average position, share of voice (careful) |
| Traffic | Clicks, sessions, users, new users |
| Engagement | Engaged sessions, scroll, key events |
| Conversion | Leads, purchases, revenue, conversion rate |
| Quality | Branded vs non-branded, assisted conversions, CRM-qualified leads |
| Technical | Indexed pages, errors, CWV pass rate, crawl stats |
| Authority | Referring domains (context, not a target), brand mentions |

Avoid vanity metrics without context (e.g. "backlinks" counts, keyword counts).

---

## 4. Segmentation

Always segment by:

- Branded vs non-branded.
- Landing page/template.
- Device (mobile/desktop/tablet).
- Country/locale.
- New vs returning.
- Organic vs AI referral vs direct.
- Conversion vs non-conversion.

This is where most "SEO wins/losses" are actually explained.

---

## 5. Reporting cadence

| Cadence | Audience | Content |
| --- | --- | --- |
| Weekly | Delivery team | Errors, deploys, indexation, P0/P1 status |
| Monthly | Stakeholders | KPIs, wins, losses, next actions, risks |
| Quarterly | Leadership | Trend, forecast, investment, roadmap |
| Post-change | Team | Before/after, regressions, rollback status |

Every report should answer:

1. What changed?
2. What did we expect?
3. What happened?
4. Why (evidence, not guesses)?
5. What next?

---

## 6. Forecasting (honest version)

Do not promise rankings or traffic. Use ranges and scenarios:

```text
Baseline: 10,000 organic sessions/month
Scenario A (conservative): +5–10% after 3 months
Scenario B (base): +10–20% after 6 months
Scenario C (upside): +25% if [specific conditions]
Assumptions: [indexation recovery, seasonality, no algorithm shock]
Confidence: low/medium/high
```

Record assumptions and revisit them. A forecast is a planning tool, not a
commitment.

---

## 7. Experiments

SEO experiments are hard because search results are noisy and you cannot randomise
users perfectly.

Acceptable approaches:

- Template-level A/B tests with careful canonical/robots handling (avoid
  cloaking; both variants must be legitimate).
- Before/after with a control segment (similar pages not changed).
- Staged rollout by section/locale.
- Holdout groups where technically feasible.
- Difference-in-differences with seasonality controls.

Never:

- Serve different content to Googlebot vs users.
- Create fake pages to "test" indexing manipulation.
- Run experiments that violate spam policies.
- Claim causality from a single week of data.

---

## 8. Rank tracking

Rank trackers are directional, not truth:

- Personalisation, location, device, and SERP features affect results.
- Google does not provide a rank API; scraping Google violates its terms.
- Use GSC average position for owned queries; use rank trackers for competitive
  context only.
- Track a stable keyword set; avoid daily panic.
- Record device/location/date and SERP feature presence.

---

## 9. Log analysis

Server logs reveal what crawlers actually do:

- Requested URLs, status codes, response times.
- Crawl frequency by bot/section.
- Orphan discovery and sitemap fetches.
- 5xx/429 spikes and WAF blocks.
- Whether JS/CSS assets are fetched.

Use log analysis on large sites or when GSC disagrees with expectations. Sample
and aggregate; protect PII and IP data.

---

## 10. Dashboard template

A minimal, useful dashboard:

1. **Health**: indexed pages, errors, CWV pass %, sitemap status.
2. **Visibility**: impressions, clicks, CTR, position (branded split).
3. **Outcomes**: conversions/revenue by landing page.
4. **Changes**: deploys, content updates, redirects, migrations.
5. **Risks**: open P0/P1, manual actions, security.

Annotate every deploy and content change so causality is inspectable.

---

## 11. Measurement acceptance checks

- [ ] GSC domain property verified; sitemaps successful.
- [ ] Bing verified and sitemaps submitted.
- [ ] GA4 linked; conversions defined and tested.
- [ ] Branded/non-branded segmentation configured.
- [ ] Organic landing-page report available.
- [ ] AI referral sources segmented.
- [ ] Baseline metrics saved before changes.
- [ ] Deploy/content annotations in analytics.
- [ ] Reporting cadence and owners agreed.
- [ ] No fabricated or unsourced metrics in reports.
