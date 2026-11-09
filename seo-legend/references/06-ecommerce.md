# Ecommerce SEO

Ecommerce SEO is a URL-and-template problem more than a copy problem. Get the
taxonomy, facets, variants, and stock states right before writing more content.

---

## 1. Template map

| Template | Primary intent | Index? |
| --- | --- | --- |
| Home | Brand/navigation | Yes |
| Category | Browse/buy | Yes, if it has unique value |
| Subcategory | Specific browse | Yes |
| Product | Buy/research | Yes |
| Product variant | Specific size/colour | Usually canonical to parent unless unique demand |
| Filtered/faceted | Refine | Policy per facet (see §4) |
| Internal search | Find | `noindex` |
| Cart/checkout/account | Transaction | `noindex` / auth |
| Blog/guide | Research | Yes |
| Brand page | Brand browse | Yes |
| Collections/seasonal | Campaign | Yes while active; archive carefully |

---

## 2. Categories

A category page should help users choose, not just list products.

- [ ] Unique H1 and intro (short, useful, not filler).
- [ ] Crawlable product links with descriptive names.
- [ ] Sorting/filtering that does not explode the index.
- [ ] Pagination with crawlable links.
- [ ] Buying guidance and comparisons where demand exists.
- [ ] FAQ based on real questions.
- [ ] Internal links to subcategories, guides, and related categories.
- [ ] `BreadcrumbList` matching visible breadcrumbs.
- [ ] `ItemList` only if it accurately lists visible products.

Thin category pages with 2 products and 1,000 words of generic copy are a
liability. Either add genuine value or consolidate.

---

## 3. Products

### 3.1 URL and canonical

- One canonical product URL.
- Variants: either one URL with selectable options, or separate URLs **only**
  when each variant has distinct demand and content.
- If separate variant URLs exist, self-canonical them and link between them;
  do not canonical all variants to the parent unless they are duplicates.
- Never let colour/size parameters create indexable duplicates.

### 3.2 Product page checklist

- [ ] Unique title/description with product + differentiator.
- [ ] H1 = product name (not a keyword dump).
- [ ] Real images (multiple angles), optimised and dimensioned.
- [ ] Price, currency, availability visible and matching structured data.
- [ ] SKU/GTIN/MPN where available.
- [ ] Specs, compatibility, dimensions, what's in the box.
- [ ] Shipping/returns/warranty information.
- [ ] Genuine reviews with authorship and dates.
- [ ] Stock state honest; out-of-stock pages stay indexable.
- [ ] Related products and internal links.
- [ ] `Product` + `Offer` JSON-LD matching the visible page.
- [ ] No fake urgency, fake reviews, or misleading discounts.

### 3.3 Out of stock / discontinued

| State | Action |
| --- | --- |
| Temporarily out of stock | Keep URL, `availability: OutOfStock`, show restock info |
| Discontinued, replacement exists | 301 to replacement |
| Discontinued, no replacement | Keep as informational if demand, or 410/404 after a grace period |
| Seasonal | Keep URL, update content and availability |

Never delete a product URL with backlinks without a redirect or a documented
retirement plan.

---

## 4. Facets and filters

Decide per facet dimension:

| Facet | Index? | Treatment |
| --- | --- | --- |
| Category + meaningful attribute with demand (`/shoes/leather/`) | Yes | Unique title/content, self-canonical |
| Multi-select filters (`?colour=red&size=42`) | No | `noindex, follow` or canonical to category |
| Sort/order/view | No | Canonical to clean URL |
| Price range | No | Canonical to category |
| Stock filter | No | Canonical to category |
| Brand facet with demand | Yes, if enough inventory | Unique landing page |
| Tracking params | No | Canonical clean; never robots-block |

Rules:

- Do not robots-block facet URLs you may later want indexed.
- Do not canonical every facet to the category if the facet has real demand.
- Keep facet links crawlable only for the facets you want discovered.
- Use `history.replaceState`/`pushState` carefully; the server must render the
  filtered state for crawlers if it should be indexed.

---

## 5. Pagination

- Each page self-canonical.
- Do not canonical page 2+ to page 1.
- Use crawlable `<a href>` next/prev links.
- Keep page 1 in the sitemap; optional for deeper pages.
- `rel=next/prev` is no longer used by Google but is harmless.
- Infinite scroll must have paginated URLs.
- Ensure products on page 2+ are discoverable and indexable.

---

## 6. Internal search

- `noindex, follow` (or `nofollow` if spam risk).
- Do not let search-result URLs into sitemaps.
- Block with robots.txt only if you are sure you never need them crawled.
- Provide a real search UX; don't create indexable doorway pages from queries.

---

## 7. Product feeds and Merchant Center

Keep on-site data and feeds consistent:

- Title, price, availability, currency, GTIN, brand, condition.
- Landing page must show the same price/availability as the feed.
- Image must match the product.
- Shipping and returns policies must be accurate.
- Feed disapprovals can signal on-site trust issues; fix the source.

---

## 8. Reviews

- Only publish reviews you can verify.
- Do not gate reviews by sentiment ("only happy customers can review").
- Do not write reviews on behalf of customers.
- Display dates and authorship where possible.
- Mark up `Review`/`AggregateRating` only for visible reviews.
- Respond to negative reviews professionally.
- Follow platform and consumer-law rules (e.g. UK DMCC Act transparency).

---

## 9. Seasonal and campaign pages

- Keep stable URLs for recurring seasons; update content annually.
- Avoid creating a new URL each year (`/black-friday-2026` → `/black-friday`).
- Retire expired campaigns with a redirect to the closest live page.
- Remove expired offers from structured data.
- Do not leave "sale" markup on full-price products.

---

## 10. Ecommerce acceptance checks

- [ ] Taxonomy is shallow, logical, and fully linked.
- [ ] Every indexable product/category has a unique title/description/H1.
- [ ] Variants have a documented canonical strategy.
- [ ] Facets have a documented index/noindex policy.
- [ ] Pagination self-canonicals and remains crawlable.
- [ ] Internal search is `noindex`.
- [ ] Out-of-stock/discontinued products handled intentionally.
- [ ] Product schema matches visible price/availability/reviews.
- [ ] No fake reviews, urgency, or discounts.
- [ ] Feed data matches landing pages.
- [ ] Sitemap contains only canonical, 200, indexable products/categories.
- [ ] Seasonal pages have a retirement plan.
- [ ] Baseline and after audits saved.
