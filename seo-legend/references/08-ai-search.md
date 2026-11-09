# AI search and agent-readiness

AI search is an emerging surface, not a separate magic ranking system. The
foundations are the same: crawlable content, clear entities, trustworthy
answers, and citations. Treat vendor claims with skepticism and verify.

---

## 1. What AI search actually uses

Depending on the product, an AI answer may combine:

- Live web retrieval (search index or crawler).
- The model's training data.
- Structured data and entity graphs.
- User-provided context and location.
- Citations to source pages.

You cannot reliably "optimise" the model weights. You **can** make your site
easy to retrieve, understand, quote, and trust.

---

## 2. AI-search readiness checklist

- [ ] Important content is server-rendered or reliably rendered.
- [ ] Pages have clear titles, headings, and direct answers near the top.
- [ ] Claims are sourced, dated, and attributable.
- [ ] Organization/author entities are consistent and marked up.
- [ ] Internal links make related content easy to follow.
- [ ] Content is accessible without pop-ups, logins, or infinite scroll.
- [ ] Facts are current; stale pages are updated or removed.
- [ ] `robots.txt` does not accidentally block retrieval crawlers you want.
- [ ] Markdown mirrors or clean text versions exist where valuable (optional).
- [ ] Brand name, product names, and terminology are used consistently.
- [ ] Original data, examples, and first-hand experience are visible.
- [ ] No cloaking or different content for bots.

---

## 3. `llms.txt` (proposal, not a standard)

`llms.txt` is a community proposal by Jeremy Howard (Answer.AI), first published
in 2024 and revised to **v2 in 2026**. It is **not** an official W3C/IETF
standard and is **not** a confirmed ranking factor. Adoption is real (docs
platforms, AI labs, Lighthouse's agentic-browsing checks), but no specific AI
system guarantees it reads your file.

Use it when you want to give agents a concise, curated map of your best content.

### 3.1 Format (v2)

- File name: `llms.txt`, at the site root or any subpath.
- Markdown, UTF-8, optional BOM.
- Required: one H1 with the site/project name.
- Recommended: a blockquote summary immediately after the H1.
- Optional prose sections (no headings other than H2 for file lists).
- H2 sections contain markdown lists of links:
  `- [Title](https://example.com/page.md): optional note`
- An `## Optional` section is conventional for secondary links agents can skip.

Minimal example:

```markdown
# Example Ltd

> UK ecommerce engineering studio building Shopify and Magento platforms.

Example Ltd designs, builds, and supports commerce platforms for UK retailers.

## Services

- [Technical SEO](https://example.com/services/technical-seo.md): audits, fixes, and monitoring.
- [Platform migration](https://example.com/services/migration.md): replatforming without traffic loss.

## Optional

- [About](https://example.com/about.md)
- [Contact](https://example.com/contact.md)
```

### 3.2 Markdown mirrors (v2)

The v2 proposal recommends clean markdown versions of pages:

- `page.html.md` (append `.md`) or `page.md` (replace extension).
- Directory URLs: `index.html.md` or `index.md`.
- Advertise them with:

```html
<link rel="alternate" type="text/markdown" href="/page.html.md" />
<link rel="describedby" href="/llms.txt" />
```

or an HTTP header:

```http
Link: </page.html.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"
```

### 3.3 Rules

- Link only to canonical, live, useful pages.
- Keep it small enough to fit in a context window; detail lives behind links.
- Do not dump the entire site or keyword lists.
- Keep it current; stale links erode trust.
- Do not treat publishing `llms.txt` as a ranking guarantee.
- Do not confuse it with `robots.txt` (access policy) or `sitemap.xml` (full URL
  inventory).

---

## 4. Crawler policy

Distinguish three jobs:

| Job | Example agents | Business question |
| --- | --- | --- |
| Search indexing | Googlebot, Bingbot | Do you want to appear in search? |
| AI training | GPTBot, Google-Extended, CCBot, ClaudeBot | Do you allow model training on your content? |
| User-initiated retrieval | ChatGPT-User, PerplexityBot, Claude-User | Do you want to be cited when a user asks? |

Notes:

- `Google-Extended` controls Gemini training/grounding usage, not Google Search
  crawling. Blocking it does not remove you from Search.
- `GPTBot` is OpenAI's training crawler; `ChatGPT-User` is user-triggered.
- `robots.txt` is a voluntary protocol; some bots may ignore it. Legal/licensing
  terms and server-side controls are separate.
- Blocking all AI bots may reduce citations and visibility in AI answers.
- Allowing training is a business/legal decision, not an SEO trick.
- Never serve different content to AI crawlers than to users (cloaking).

Document the policy in `robots.txt` comments and in your internal runbook.

---

## 5. Content that gets cited

- Direct, factual answers with clear attribution.
- Statistics with dates and methodology.
- Definitions and comparisons with explicit criteria.
- Original research, benchmarks, and datasets.
- Step-by-step instructions with prerequisites.
- Tables that are easy to extract.
- Author expertise and review dates.
- Stable URLs and clean headings (H2/H3 as questions).
- Internal links to primary sources and related detail.

Avoid:

- Vague marketing fluff with no facts.
- Content hidden behind interactions.
- Contradictory claims across pages.
- AI-generated pages with no editorial value.
- Fake expertise or invented citations.

---

## 6. Measuring AI search

Attribution is imperfect. Use multiple signals:

- Referral traffic from `chatgpt.com`, `perplexity.ai`, `copilot.microsoft.com`,
  `gemini.google.com`, and similar (segment in analytics).
- Branded search volume and direct traffic trends.
- Search Console impressions/clicks for queries that trigger AI Overviews
  (Google does not expose AI Overview placement directly).
- Citation mentions in AI answers (manual sampling, with dates and prompts).
- Conversion quality, not just sessions.
- Server logs for AI crawler user agents (respect privacy and volume).

Do not claim a causal lift from `llms.txt` alone. Run controlled before/after
checks and record the confounders.

---

## 7. Agent-readiness beyond `llms.txt`

If you want agents to use your product/site:

- Provide stable, documented URLs.
- Publish machine-readable docs (OpenAPI, JSON Schema, markdown).
- Keep pricing, availability, and policies in text, not images.
- Use semantic HTML and accessible forms.
- Provide a contact path for agent/business inquiries.
- Add `rel="alternate" type="text/markdown"` where mirrors exist.
- Do not require JavaScript for critical information.
- Avoid CAPTCHAs on public documentation.
- Keep `robots.txt` and terms of service aligned with your policy.

---

## 8. AI-search acceptance checks

- [ ] Retrieval crawlers you want are not blocked.
- [ ] Training crawler policy is a documented business decision.
- [ ] Key content is extractable without JS or login.
- [ ] Answers are direct, sourced, and dated.
- [ ] Entity data is consistent (`Organization`, `Person`, `sameAs`).
- [ ] `llms.txt` (if used) follows the v2 format and links are live.
- [ ] Markdown mirrors (if used) match the HTML content.
- [ ] No cloaking or bot-specific content.
- [ ] AI referral traffic is segmented in analytics.
- [ ] No ranking/citation guarantees are made in reporting.
