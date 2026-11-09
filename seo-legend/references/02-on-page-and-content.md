# On-page, content, and internal linking

The goal is not "more keywords". It is: **the right page, answering the real
query, better than the alternatives, in a way users trust.**

---

## 1. Search intent first

Classify the dominant intent before writing or editing:

| Intent | Query shape | Page job |
| --- | --- | --- |
| Informational | how, what, why, guide, examples | Teach; answer quickly; go deep after |
| Navigational | brand, login, specific site | Get the user to the right destination |
| Commercial investigation | best, vs, review, alternatives | Compare honestly; criteria, trade-offs |
| Transactional | buy, price, demo, book, download | Remove friction; prove trust |
| Local | near me, city + service | Location proof, hours, contact, map |

Rules:

- One page = one primary intent. Do not mix a product page with a 3,000-word
  essay unless the intent genuinely requires it.
- Match the **format** the SERP rewards (guide, comparison, calculator, video,
  product, category) — but do not copy competitors' weaknesses.
- If the intent is ambiguous, cover the dominant intent first and link to a
  secondary page for the rest.

---

## 2. Titles

The title is a ranking and click-through element. Write for humans first.

Guidelines:

- 50–60 characters is a safe display target; longer titles get truncated.
- Put the primary topic near the front, naturally.
- Include the brand at the end when it adds trust: `Topic — Brand`.
- Unique across the site. No template that produces duplicates.
- No keyword stuffing, no ALL CAPS, no clickbait that the page cannot satisfy.
- Match the page's H1 and content; the title can be slightly more commercial.
- Local pages: include the city/region only when the page is genuinely local.

Formulas (adapt, don't paste):

- Service: `Technical SEO Services | Audit & Implementation — Brand`
- Guide: `How to Audit a Website's SEO (2026 Checklist) — Brand`
- Comparison: `Shopify vs Magento for B2B: Honest Comparison — Brand`
- Product: `Product Name — Key Benefit | Brand`
- Local: `Emergency Plumber in Manchester | 24/7 — Brand`

Anti-patterns:

- `Home | Brand` on every page.
- `Best Cheapest Top #1 SEO Services in UK 2026!!!`
- Titles that promise something the page does not deliver.
- Duplicating the H1 word-for-word with no added value.

---

## 3. Meta descriptions

Not a direct ranking factor, but they influence clicks and can be rewritten by
search engines.

- 120–160 characters is a practical target.
- Unique per page.
- State the value, the audience, and a reason to click.
- Include the primary topic naturally; avoid stuffing.
- Match the page; a mismatch increases bounce and erodes trust.
- Do not use the same description across a template with only the city swapped
  unless the page itself is genuinely local.
- No prices/dates that will go stale unless maintained.

---

## 4. Headings

- Exactly one `<h1>` per page, matching the main topic.
- H2s for major sections; H3s for sub-sections. Do not skip levels for styling.
- Headings should read like a useful outline, not a keyword list.
- The H1 does not have to be the title tag, but they must agree semantically.
- Avoid empty headings, headings used only for spacing, or multiple H1s from
  stacked components.

---

## 5. Content quality (E-E-A-T in practice)

Google's guidance is people-first, helpful, reliable content. E-E-A-T is not a
single score; demonstrate it.

### 5.1 Experience

- Show first-hand use, screenshots, data, or a documented process.
- Include specific details that only a practitioner would know.
- Avoid generic AI-summary prose with no lived detail.

### 5.2 Expertise

- Author bylines with real credentials and a bio.
- Reviewer/editor attribution for sensitive topics (health, finance, legal).
- Cite primary sources; link to standards and documentation.
- Correct terminology; define jargon.

### 5.3 Authoritativeness

- Clear organization identity, about page, contact details.
- Consistent brand/entity information across the site and external profiles.
- Original research, tools, or datasets where possible.
- Genuine mentions and citations — never bought links.

### 5.4 Trust

- Transparent ownership, contact, policies, and pricing.
- Secure site, no dark patterns, no fake urgency.
- Reviews are real, verifiable, and not incentivised deceptively.
- Dates: published and meaningfully updated.

### 5.5 Content checklist

- [ ] Answers the primary query in the first screen.
- [ ] Has a clear point of view or original value.
- [ ] Uses the vocabulary real people use (not internal jargon).
- [ ] Facts verified; statistics sourced and dated.
- [ ] Examples, screenshots, or data included.
- [ ] Author and reviewer identified where relevant.
- [ ] Internal links to related pages; external links to sources.
- [ ] No placeholder text, lorem ipsum, or "coming soon".
- [ ] No contradictory claims across pages.
- [ ] Readable: short paragraphs, descriptive subheads, lists, tables.
- [ ] Accessible: alt text, captions, sufficient contrast, semantic HTML.

### 5.6 AI-assisted content guardrails

Using AI to draft is fine; publishing unedited scaled content is not.

- Require human editorial review and fact-checking.
- Add original data, examples, or analysis.
- Do not generate one page per keyword permutation with no unique value.
- Do not invent authors, credentials, reviews, or case studies.
- Disclose AI use where policy or law requires it.
- Check Google's scaled-content-abuse policy before any programmatic rollout.

---

## 6. Content templates

### 6.1 Service page

1. H1: service + outcome.
2. Who it is for and the problem.
3. What is included (scope, deliverables, exclusions).
4. Process (steps, timeline).
5. Proof (case study, results with context, testimonials).
6. Pricing/engagement model or a clear next step.
7. FAQ (real questions, not keyword filler).
8. Related services and resources.
9. Contact CTA.

### 6.2 Category page

1. H1: category name.
2. Short intro that helps selection (not 2,000 words of filler).
3. Filters/sorting that are crawl-safe.
4. Product grid with descriptive links.
5. Buying guidance and comparisons.
6. FAQ.
7. Internal links to subcategories and guides.

### 6.3 Comparison page

1. State the comparison and who each option suits.
2. Criteria table with sources.
3. Honest trade-offs; include where your option loses.
4. Pricing/context caveats.
5. Verdict by use case.
6. Links to deeper reviews.

### 6.4 Location page

1. H1: service + location.
2. Proof of local presence (address, team, projects).
3. Service details specific to the area.
4. Local FAQs, travel/coverage, hours.
5. Reviews/testimonials from that area (real).
6. NAP consistent with Google Business Profile.
7. Nearby locations only if genuinely served.

Do not create hundreds of city pages with swapped names and identical copy.

---

## 7. Internal linking

Internal links are how crawlers discover pages and how users (and models)
understand relationships.

### 7.1 Rules

- Important pages within 3 clicks of the homepage.
- Use descriptive anchor text; avoid "click here" and naked URLs.
- Link contextually from relevant content, not just nav/footer.
- Every page should have at least one internal inbound link (no orphans).
- Use a hub-and-spoke model: pillar page ↔ detailed guides.
- Breadcrumbs with `BreadcrumbList` schema where appropriate.
- Fix broken internal links; redirect or remove them.
- Do not over-link the same anchor sitewide (looks manipulative).
- External links: use `rel="sponsored"` for paid, `rel="ugc"` for user content;
  `nofollow` is a hint, not a penalty tool.

### 7.2 Orphan and depth audit

```bash
# From a crawl export, list URLs with zero internal inbound links.
# In GSC, compare "Discovered" URLs with your sitemap.
```

Manual method:

1. Export all sitemap URLs.
2. Crawl from the homepage only (no sitemap injection).
3. Any sitemap URL not reached = orphan or too deep.
4. Add links from relevant hub pages; never dump links in the footer.

### 7.3 Cannibalisation

Symptoms: multiple URLs rank alternately for the same query; GSC shows
impressions split; internal anchors are inconsistent.

Fix:

- Decide the canonical intent page.
- Merge the weaker page into the stronger one (301 + consolidate content).
- Or differentiate intent clearly (e.g. "pricing" vs "cost guide").
- Update internal links and sitemap.
- Re-check after 2–6 weeks; do not thrash weekly.

---

## 8. Images and media

- Descriptive filename: `technical-seo-audit-dashboard.webp`.
- `alt` describes the image's purpose; empty `alt=""` for decorative images.
- Do not stuff keywords into alt text.
- Compress; serve modern formats (AVIF/WebP) with fallbacks.
- Set width/height or aspect-ratio to prevent CLS.
- Lazy-load below-the-fold images; never lazy-load the LCP image.
- Captions add context and are read by users.
- Video: provide transcripts, captions, and a clear poster frame.
- Do not put essential text only inside images.

---

## 9. Snippets and SERP appearance

- Title, description, and visible content should agree.
- Use structured data only for content visible on the page.
- Favicon: real ICO/PNG at `/favicon.ico` and `<link rel="icon">`.
- Site name: `WebSite` schema + consistent brand.
- Breadcrumbs: visible and marked up.
- Dates: show published/updated dates when freshness matters.
- Avoid `nosnippet`, `max-snippet:0`, or `noimageindex` unless intentional.
- Test with the Rich Results Test and Search Console enhancements.

---

## 10. Content refresh and decay

Refresh when:

- Impressions are stable but CTR/position is falling.
- The page references outdated versions, prices, laws, or tools.
- Competitors now answer the query better.
- Internal links or the product offering changed.
- The page has lost rich-result eligibility.

Refresh checklist:

- [ ] Update facts, dates, screenshots, and links.
- [ ] Improve the intro answer and structure.
- [ ] Add missing subtopics from real queries.
- [ ] Consolidate cannibalising pages.
- [ ] Re-check title/description against current SERP intent.
- [ ] Update `dateModified` only for meaningful changes.
- [ ] Re-run the audit and record before/after.

---

## 11. Programmatic SEO guardrails

Programmatic pages are legitimate when each page has **unique value**:

- Real data (prices, inventory, statistics, locations, integrations).
- Unique explanations, not synonym-swapped templates.
- Genuine demand for the combination.
- Quality control and sampling.
- Internal links that make sense.
- A plan to prune low-value pages.

Stop if:

- Pages differ only by city/keyword.
- Content is generated at scale without review.
- The pages are doorways to a single destination.
- The site cannot maintain accuracy.

This is exactly the territory of Google's scaled-content-abuse and doorway
policies. When in doubt, do less and make it better.

---

## 12. On-page acceptance checks

- [ ] One unique, descriptive title per page (50–60 chars target).
- [ ] One unique meta description per page (120–160 chars target).
- [ ] Exactly one H1; logical H2/H3 hierarchy.
- [ ] Primary content visible without JavaScript.
- [ ] Internal links descriptive and crawlable (`<a href>`).
- [ ] No orphan pages in the sitemap.
- [ ] Images have appropriate alt text and dimensions.
- [ ] Author/trust signals present where the topic requires them.
- [ ] No keyword stuffing, hidden text, or doorway patterns.
- [ ] Content matches the page's promise and the query intent.
- [ ] Canonical, `og:url`, and internal links use the same URL.
- [ ] Baseline/after audit artifacts saved.
