# Technical SEO

Covers the path from URL discovery to a served, indexable, canonical page.
Order matters: **crawlable → renderable → indexable → canonical → servable**.

---

## 1. The five gates

| Gate | Question | Fails when |
| --- | --- | --- |
| Discoverable | Can a crawler find the URL? | No links, no sitemap, blocked by robots.txt, orphaned |
| Fetchable | Does the server return content? | 4xx/5xx, timeouts, rate limits, geo/IP blocks |
| Renderable | Is the content in the rendered DOM? | Client-only content, blocked JS/CSS, hydration gaps |
| Indexable | Is the page allowed in the index? | `noindex`, bad canonical, duplicate collapse |
| Servable | Will the canonical URL be shown? | Redirects, canonical mismatch, manual action, quality |

A page can pass one gate and fail the next. Diagnose in order; do not "fix"
canonicals on a page that returns 500.

---

## 2. Status codes

| Code | Meaning | SEO handling |
| --- | --- | --- |
| `200` | OK | Indexable candidate |
| `301` | Permanent redirect | Use for permanent moves; one hop |
| `308` | Permanent, method-preserving | Fine for permanent moves |
| `302` / `307` | Temporary | Use only for genuinely temporary changes |
| `304` | Not modified | Normal for conditional requests; not a crawl error |
| `404` | Not found | Correct for removed content; keep helpful UI |
| `410` | Gone | Stronger removal signal; optional |
| `429` | Too many requests | Back off; check rate limiting/CDN/WAF |
| `5xx` | Server error | P0: crawlers will slow down or drop pages |

Rules:

- Never soft-404 (200 page saying "not found").
- Never redirect everything to the homepage.
- Never mix `noindex` with a redirect on the same URL.
- A `404` is not a disaster; a `200` for a dead page is worse.
- Check `HEAD` and `GET` separately — some servers misbehave on `HEAD`.

---

## 3. robots.txt

Location: `https://host/robots.txt` (root only). It controls **crawling**, not
indexing.

Minimal healthy file:

```txt
User-agent: *
Allow: /

Sitemap: https://www.example.com/sitemap.xml
```

Checklist:

- [ ] Returns `200`, `text/plain`, no HTML error page.
- [ ] Does not contain `Disallow: /` for `*` on a public site.
- [ ] Does not rely on `noindex` (unsupported and ignored).
- [ ] Does not block `/_next/`, `/static/`, CSS, JS, or images needed to render.
- [ ] Does not block the sitemap or key content paths.
- [ ] `Sitemap:` uses an absolute HTTPS URL.
- [ ] Test paths against the live file with Google's robots.txt report.
- [ ] Staging/preview hosts are blocked (or password-protected), production is not.
- [ ] `Crawl-delay` is ignored by Google; use server capacity/rate limits instead.

Common disasters:

| Mistake | Effect |
| --- | --- |
| `Disallow: /` left from staging | Whole site drops out |
| Blocking `*.js` / `*.css` | Google cannot render the page properly |
| Blocking `/search` but linking it | Wasted crawl, confusing signals |
| Different robots.txt per CDN edge | Non-deterministic crawling |

---

## 4. Indexability

### 4.1 Meta robots

```html
<meta name="robots" content="noindex, follow">
```

- `noindex` removes the page from the index (eventually).
- `follow` still lets link equity flow; `nofollow` does not guarantee it.
- `index, follow` is the default; adding it is harmless but usually noise.
- Use `max-snippet:-1, max-image-preview:large, max-video-preview:-1` only
  when you actually want the largest previews.

### 4.2 X-Robots-Tag

For non-HTML files (PDF, images, video) or edge-level control:

```http
X-Robots-Tag: noindex, nofollow
```

Do not send conflicting meta and header directives. The most restrictive wins.

### 4.3 The canonical/noindex conflict

**Never** combine `noindex` with a canonical pointing elsewhere and expect the
canonical to be honored. If a page must not be indexed, use `noindex` and let it
be; if it must consolidate, use a canonical and keep it indexable. Pick one.

### 4.4 Indexability audit

For every template:

- [ ] No accidental `noindex` in staging config leaking to production.
- [ ] Authenticated, admin, cart, checkout, account, and search-result pages are
      excluded intentionally (robots and/or `noindex`).
- [ ] Pagination pages are indexable and self-canonical (unless intentionally
      consolidated with a documented reason).
- [ ] Filtered/faceted URLs have a deliberate policy (see §10).
- [ ] `X-Robots-Tag` is not applied to the whole origin by a CDN rule.
- [ ] PDFs and assets that should rank are not blocked.

---

## 5. Canonicalization

### 5.1 Rules

1. One canonical per page, absolute HTTPS URL.
2. Self-referencing canonical on every indexable page.
3. Canonical target must be `200`, indexable, and not redirecting.
4. Canonical must match the sitemap URL and internal links.
5. `og:url` should match the canonical.
6. Do not canonicalise every page to the homepage.
7. Do not use canonical as a substitute for a redirect when the old URL should
   not exist.

### 5.2 Conflict matrix

| Situation | Correct move |
| --- | --- |
| `http://` → `https://` | 301 to HTTPS, then self-canonical |
| `example.com` → `www.example.com` | 301 to one host, never serve both |
| `/page/` vs `/page` | Pick one, 301 the other, link only the winner |
| `?utm=...` variants | Canonical to clean URL; do not block in robots |
| Duplicate product variants | Canonical to the primary variant **or** index each with unique value |
| Syndicated content | Canonical to the original if you are the copier |
| Paginated series | Self-canonical each page; do not point page 2 to page 1 |
| Print version | Canonical to the main page or `noindex` |
| Staging host | Password-protect or `noindex`; never canonical to production |

### 5.3 Canonical verification

```bash
curl -s https://example.com/page | grep -o '<link[^>]*rel="canonical"[^>]*>'
curl -sI https://example.com/page | grep -i '^link:'
```

Then fetch the canonical target and confirm `200`, `index,follow`, and that its
own canonical is itself.

---

## 6. URL design

- Lowercase, hyphen-separated, human-readable.
- Stable: never change URLs for cosmetic reasons.
- One host, one protocol, one trailing-slash policy.
- Avoid session IDs, tracking parameters, and dates unless the date is meaningful.
- Keep important content within 3 clicks of the homepage.
- Use a logical hierarchy (`/services/technical-seo/`), not flat keyword soup.
- Unicode/IDN: use punycode consistently and test.
- Case-sensitive servers: enforce lowercase with a 301.

---

## 7. Redirects

### 7.1 Rules

- `301`/`308` for permanent moves.
- One hop. No chains (`A→B→C`).
- No loops (`A→B→A`).
- Preserve the path and query string where the destination supports it.
- Redirect to the **closest equivalent** page, not the homepage.
- Update internal links to the final URL.
- Remove the old URL from the sitemap.
- Keep redirects for at least a year (longer for high-value URLs).

### 7.2 Redirect map format

| Old URL | New URL | Type | Reason | Verified |
| --- | --- | --- | --- | --- |
| `/old-service` | `/services/new-service` | 301 | Renamed | ☐ |
| `/blog/2020/post` | `/blog/post` | 301 | Slug cleanup | ☐ |

### 7.3 Verification

```bash
# Follow the chain and show every hop
curl -sIL https://example.com/old-url | grep -Ei '^(HTTP/|location:)'

# Assert a single hop ends at 200
curl -s -o /dev/null -w '%{http_code} %{num_redirects} %{url_effective}\n' \
  -L https://example.com/old-url
```

`num_redirects` should be `1` for a migrated URL, `0` for a live URL.

---

## 8. Sitemaps

### 8.1 Rules

- Include only canonical, indexable, `200` URLs.
- Exclude redirects, 404s, `noindex` pages, and duplicates.
- Use absolute HTTPS URLs.
- `lastmod` must reflect a real content change (not build time).
- Split at 50,000 URLs or 50 MB uncompressed; use a sitemap index.
- Reference the sitemap in `robots.txt` and submit it in GSC/Bing.
- One sitemap per locale/section is fine; keep a clean index.
- Do not include every image/video unless those sitemaps add value.

Healthy index:

```xml
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://example.com/sitemap-pages.xml</loc></sitemap>
  <sitemap><loc>https://example.com/sitemap-products.xml</loc></sitemap>
</sitemapindex>
```

### 8.2 Sitemap audit

- [ ] `200` and valid XML.
- [ ] All `<loc>` same-origin and absolute.
- [ ] No duplicates.
- [ ] All URLs return `200` (not 3xx/4xx/5xx).
- [ ] None are `noindex`.
- [ ] Canonical of each URL equals the URL (or is consistent with the strategy).
- [ ] Counts match CMS/database expectations.
- [ ] GSC Sitemaps shows "Success" and discovered URLs are being indexed.

---

## 9. JavaScript SEO

Google renders JavaScript, but rendering is a second wave and not a guarantee.
Treat server-rendered HTML as the source of truth.

### 9.1 Rules

- Primary content, metadata, canonical, and internal links must exist in the
  initial HTML **or** be reliably rendered.
- Use real `<a href="/path">` links. `onclick` divs are invisible to crawlers.
- Do not block JS/CSS in robots.txt.
- Keep the rendered DOM and initial HTML semantically equivalent.
- Avoid user-agent-based content differences (cloaking risk).
- Lazy-loaded content below the fold is fine; critical content should not
  require a scroll or click to exist.
- Infinite scroll needs paginated, linkable URLs.
- History API navigation must update title, canonical, and content.
- Avoid rendering critical meta tags only after an API call.
- Hydration mismatches can change the DOM after indexing; test both states.

### 9.2 Verification

1. `curl` the URL and confirm key content/metadata exist.
2. Disable JavaScript in a browser and repeat.
3. Compare `view-source:` with the rendered DOM.
4. Use GSC URL Inspection → "Test live URL" → rendered HTML.
5. Check the rendered HTML for canonical, title, h1, and main copy.

### 9.3 Framework note

Next.js App Router: use `generateMetadata`/`metadata` exports; do not hand-write
`<title>` in a client component. Astro/Nuxt/SvelteKit: same principle — metadata
must be server-rendered. See `references/14-frameworks.md`.

---

## 10. Faceted navigation and parameters

Facets multiply URLs. Decide per facet:

| Facet type | Policy |
| --- | --- |
| Valuable, search-demanded combination | Index, unique title/content, self-canonical |
| Useful for users, low search demand | Allow crawl, `noindex, follow`, link normally |
| Sort/order/view parameters | Canonical to the clean URL; do not link every variant |
| Tracking parameters (`utm_*`, `gclid`) | Canonical to clean URL; never block in robots |
| Internal search results | `noindex` and usually `nofollow` |
| Price/rating sliders | Do not create crawlable URLs for every value |

Do not use robots.txt to "fix" duplicate facets unless you are certain the URLs
never need to be crawled; blocked URLs cannot pass canonical signals.

---

## 11. Duplicate content

Common sources:

- HTTP/HTTPS and www/non-www both serving `200`
- Trailing slash variants
- Uppercase/lowercase paths
- Query parameters (`?ref=`, `?sort=`, session IDs)
- Print/AMP/mobile variants
- Syndicated copies
- Multiple category paths for the same product
- Pagination duplicates
- Locale fallbacks serving the same language at multiple URLs

Fix order: **301 canonical host/path variants → canonical tag → content
differentiation**. `noindex` is a last resort for pages users should not find.

---

## 12. Mobile-first

- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1">`
- [ ] Content parity with desktop (no hidden mobile-only omissions).
- [ ] Tap targets ≥ 24×24 CSS px, ideally 48×48.
- [ ] Base font size legible without zoom.
- [ ] No intrusive interstitials covering main content.
- [ ] Horizontal scroll eliminated at 320 px, 360 px, 390 px, 768 px.
- [ ] Tables and code blocks scroll inside a container, not the page.
- [ ] Forms use correct `type`, `autocomplete`, and labels.

---

## 13. HTTPS and security

- Valid certificate, no mixed content.
- One canonical host; HSTS after confirming all subdomains are ready.
- No malware, phishing, or unwanted software.
- Keep CMS/plugins patched; compromised sites get manual actions.
- Security headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
  `X-Frame-Options`/`frame-ancestors`, and a tested CSP.
- Do not expose `.env`, `.git`, `node_modules`, backups, or source maps.

Check for hacked-site signals: unexpected redirects, new indexed pages, spam
links, cloaked content, and unfamiliar search snippets.

---

## 14. Crawl budget (large sites)

Crawl budget matters when there are millions of URLs or frequent changes; small
sites rarely need to optimise it. Levers:

- Remove or `noindex` low-value URLs.
- Fix 5xx and timeouts first.
- Reduce redirect chains.
- Keep sitemaps accurate.
- Make important pages shallow and well-linked.
- Avoid infinite calendar/filter/search spaces.
- Use `429`/`503` with `Retry-After` for overload, not for SEO tricks.
- Analyse server logs for bot hits, status mix, and orphan discovery.

---

## 15. Debugging playbook

| Symptom | First checks | Likely cause |
| --- | --- | --- |
| "Discovered – currently not indexed" | Quality, internal links, duplication, server response | Thin/low-value page or crawl prioritisation |
| "Crawled – currently not indexed" | Content quality, canonical, duplication | Page not worth indexing yet |
| "Duplicate, Google chose different canonical" | Canonical vs internal links vs sitemap | Conflicting signals |
| "Excluded by noindex" | Meta/header, CDN rule, staging config | Accidental `noindex` |
| "Blocked by robots.txt" | robots.txt, CDN, WAF | Over-blocking |
| "Soft 404" | Status code, empty content | 200 page with no content |
| "Redirect error" | Chain, loop, target status | Bad redirect map |
| "Server error (5xx)" | Origin logs, memory, deploy | Infrastructure |
| Sudden traffic drop | Manual action, deploy, robots, canonical, hack | Check GSC first |
| Rich results lost | Schema change, eligibility change, visible content | Invalid/mismatched markup |

Always export the GSC Pages report and URL Inspection result before and after a
fix. Search Console is the authoritative index-status source; third-party
crawlers are proxies.

---

## 16. Technical acceptance checks

- [ ] One host/protocol/trailing-slash policy, enforced by 301.
- [ ] robots.txt is intentional, production-safe, and references the sitemap.
- [ ] Sitemap contains only `200`, indexable, canonical URLs.
- [ ] Every indexable page has a self-referencing absolute canonical.
- [ ] No `noindex` + canonical conflicts.
- [ ] No redirect chains or loops.
- [ ] Primary content and links exist without JavaScript.
- [ ] Rendered DOM matches initial HTML for metadata and main content.
- [ ] Pagination/facets have an explicit, documented policy.
- [ ] Mobile viewport and content parity verified.
- [ ] HTTPS clean, no mixed content, security headers present.
- [ ] GSC/Bing sitemaps submitted and error-free.
- [ ] Baseline and post-change audit JSON saved as evidence.
