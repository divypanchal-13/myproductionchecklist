# Single-page SEO QA

Use before publishing a new page/template change, and when spot-checking after
deploy. One page per copy of this checklist. Fill evidence with the URL, command
output, or screenshot path.

Page: `<URL>`
Template: `<name>`
Locale/market: `<en-GB / UK>`
Reviewer/date: `<name / YYYY-MM-DD>`
Verdict: `PASS | FAIL | CONDITIONAL`

---

## 1. Reachability and indexability

- [ ] Returns `200` on `GET` and `HEAD`.
- [ ] No redirect chain; final URL is the intended one.
- [ ] Final URL matches the canonical URL.
- [ ] One canonical tag, absolute HTTPS, self-referencing.
- [ ] No `noindex` unless intentional (documented).
- [ ] No conflicting `X-Robots-Tag`.
- [ ] Included in the correct sitemap (if indexable).
- [ ] Not blocked by `robots.txt`.
- [ ] Linked from at least one relevant internal page.
- [ ] Correct host/protocol/trailing slash.

Evidence: `<status matrix / tags / sitemap line>`

## 2. Metadata

- [ ] `<title>` unique, 50–60 chars, topic first, brand at end if useful.
- [ ] Title matches intent; no clickbait the page cannot satisfy.
- [ ] Meta description unique, 120–160 chars, value + audience + reason to click.
- [ ] Exactly one `<h1>`; matches the page topic.
- [ ] Logical H2/H3 outline; no skipped levels or empty headings.
- [ ] `<html lang="...">` correct.
- [ ] Viewport meta present.
- [ ] Open Graph `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
- [ ] OG image absolute, ≥1200×630, readable, brand-consistent.
- [ ] Twitter card + title + image.
- [ ] Favicon/site name correct.
- [ ] `og:url` = canonical.

Evidence: `<rendered head screenshot / audit JSON>`

## 3. Content

- [ ] Answers the primary query in the first screen.
- [ ] Primary intent is clear; no mixed intent confusion.
- [ ] Content is original and adds value beyond competitors.
- [ ] Facts are accurate, sourced, and dated.
- [ ] No placeholder, lorem ipsum, "coming soon", or `TODO`.
- [ ] No keyword stuffing or unnatural phrasing.
- [ ] Claims match what the business can substantiate.
- [ ] Author/reviewer shown where expertise matters.
- [ ] No contradictory statements vs other pages.
- [ ] Internal links to related pages (descriptive anchors).
- [ ] External links to primary sources where claims are made.
- [ ] No broken links.
- [ ] CTA is clear and works.

Evidence: `<screenshot / notes>`

## 4. Media

- [ ] Images relevant, compressed, modern format.
- [ ] `alt` describes purpose; decorative images use `alt=""`.
- [ ] Width/height or aspect ratio set.
- [ ] Hero/LCP image not lazy-loaded; `fetchpriority="high"` where appropriate.
- [ ] Below-the-fold images lazy-loaded.
- [ ] No essential text baked into images.
- [ ] Video has captions/transcript and poster.

Evidence: `<Lighthouse/DevTools notes>`

## 5. Structured data

- [ ] Chosen type is the most specific accurate type.
- [ ] JSON parses; `@context` correct.
- [ ] Required fields present.
- [ ] URLs/images absolute and canonical.
- [ ] Markup matches visible content (name, price, rating, author, dates).
- [ ] No fake reviews/ratings.
- [ ] BreadcrumbList matches visible breadcrumbs.
- [ ] Rich Results Test passes (or N/A with reason).
- [ ] No duplicate/conflicting entities.
- [ ] `dateModified` only changed for real updates.

Evidence: `<validator screenshot / JSON block>`

## 6. Performance

- [ ] LCP element is the intended one and loads fast.
- [ ] No huge hero image or render-blocking third party.
- [ ] Fonts subset/swapped; no invisible text flash.
- [ ] No layout shift from media/banner/embed.
- [ ] JS bundle reasonable; no unnecessary client component for static content.
- [ ] Page works with slow 4G/mid-range mobile.
- [ ] No new console errors or failed requests.
- [ ] Cache headers correct for assets.

Evidence: `<Lighthouse/PSI numbers + date>`

## 7. Mobile and accessibility

- [ ] No horizontal scroll at 320/360/390/768 px.
- [ ] Content parity with desktop.
- [ ] Tap targets adequate.
- [ ] Text legible without zoom.
- [ ] Keyboard navigable; focus visible.
- [ ] Contrast meets WCAG 2.2 AA.
- [ ] Forms labelled with correct types/autocomplete.
- [ ] No intrusive interstitial over the content.

Evidence: `<screenshots / axe report>`

## 8. Trust and conversion

- [ ] Business identity/contact reachable.
- [ ] Policies linked (privacy, terms, returns if ecommerce).
- [ ] Reviews/testimonials real and verifiable.
- [ ] Pricing/availability accurate.
- [ ] No fake urgency/scarcity.
- [ ] Consent banner does not block content or LCP.
- [ ] Analytics fires only after consent.

Evidence: `<screenshot / network log>`

## 9. Rendered reality

- [ ] Primary content exists with JavaScript disabled.
- [ ] Canonical/title/H1 exist in initial HTML.
- [ ] Rendered DOM matches `view-source:` for critical elements.
- [ ] No hydration mismatch changing metadata after load.
- [ ] No user-agent-specific content differences.

Evidence: `<JS-disabled screenshot / curl output>`

## 10. Publish gate

- [ ] All P0/P1 items above pass.
- [ ] P2 items fixed or scheduled with owner/date.
- [ ] Page added to sitemap if indexable.
- [ ] Internal links added from relevant pages.
- [ ] Redirects (if replacing a URL) tested single-hop.
- [ ] Old URL removed from sitemap and internal links updated.
- [ ] Analytics annotation recorded.
- [ ] Post-publish verification scheduled (24h / 7d / 28d).
- [ ] Rollback/revision saved.

## Result

```text
P0: <n>  P1: <n>  P2: <n>  P3: <n>
Verdict: PASS | FAIL | CONDITIONAL
Blockers: <IDs>
Follow-ups: <IDs + owner/date>
Evidence bundle: <path>
```
