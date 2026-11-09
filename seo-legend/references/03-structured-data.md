# Structured data (Schema.org / JSON-LD)

Structured data helps machines understand entities and relationships. It can
enable rich results, but it is **not** a ranking lever and must never describe
content that users cannot see.

---

## 1. Policy and principles

1. Mark up what is visible on the page.
2. One page can describe multiple entities, but they must be consistent.
3. Use the most specific type that accurately fits (`Article`, not `Thing`).
4. Prefer JSON-LD in a `<script type="application/ld+json">` block.
5. Use absolute URLs for `url`, `image`, `logo`, `@id`, and `sameAs`.
6. Do not mark up fake reviews, ratings, prices, or availability.
7. Do not duplicate the same entity with conflicting properties.
8. Validate before shipping and re-validate after template changes.
9. Rich-result eligibility changes over time — confirm the current Google
   documentation for the type before promising an appearance.

---

## 2. JSON-LD structure

### 2.1 Single entity

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Ltd",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}
```

### 2.2 Entity graph (recommended for sites)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "Example Ltd",
      "url": "https://example.com",
      "logo": "https://example.com/logo.png",
      "sameAs": [
        "https://www.linkedin.com/company/example",
        "https://en.wikipedia.org/wiki/Example"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "url": "https://example.com",
      "name": "Example",
      "publisher": { "@id": "https://example.com/#organization" }
    },
    {
      "@type": "WebPage",
      "@id": "https://example.com/page/#webpage",
      "url": "https://example.com/page",
      "name": "Page title",
      "isPartOf": { "@id": "https://example.com/#website" },
      "about": { "@id": "https://example.com/#organization" }
    }
  ]
}
```

Use stable `@id` values so entities can be referenced across blocks. `@id`
values do not need to resolve to real pages, but they must be unique and
consistent.

---

## 3. Type reference

The tables below list **core** properties. Google rich-result requirements can
be stricter and change; always check the current documentation for the exact
feature.

### 3.1 Organization

| Property | Requirement | Notes |
| --- | --- | --- |
| `name` | Required | Legal/trading name used on site |
| `url` | Required | Canonical homepage |
| `logo` | Recommended | Absolute URL, raster, ≥112×112 |
| `sameAs` | Recommended | Official profiles only |
| `contactPoint` | Optional | Include `contactType`, `telephone`, `areaServed` |
| `address` | Recommended for local | `PostalAddress` |

Do not use `Organization` for a person. Use `Person`.

### 3.2 WebSite

| Property | Requirement | Notes |
| --- | --- | --- |
| `name` | Required | Site name users see |
| `url` | Required | Canonical origin |
| `potentialAction` | Optional | SearchAction only if a real search exists |
| `publisher` | Recommended | `@id` of Organization |

Google retired the sitelinks search box rich result; a `SearchAction` is now
mostly a semantic signal. Do not promise a search box in SERPs.

### 3.3 WebPage

| Property | Requirement | Notes |
| --- | --- | --- |
| `name` | Recommended | Usually the title |
| `url` | Required | Canonical URL |
| `isPartOf` | Recommended | WebSite `@id` |
| `primaryImageOfPage` | Optional | ImageObject |
| `datePublished` / `dateModified` | Optional | ISO 8601 |
| `breadcrumb` | Recommended | `@id` of BreadcrumbList |

### 3.4 BreadcrumbList

| Property | Requirement | Notes |
| --- | --- | --- |
| `itemListElement` | Required | Array of `ListItem` |
| `position` | Required | 1-based, sequential |
| `name` | Required | Visible label |
| `item` | Required except last | Absolute URL |

Breadcrumbs must be visible on the page. Do not invent a hierarchy that does
not exist in navigation.

### 3.5 Article / BlogPosting / NewsArticle

| Property | Requirement | Notes |
| --- | --- | --- |
| `headline` | Required | ≤110 characters recommended |
| `image` | Required | Absolute URL(s), ≥1200 px wide recommended |
| `datePublished` | Required | ISO 8601 with timezone |
| `dateModified` | Recommended | Only for real updates |
| `author` | Required | `Person` or `Organization` with `name`/`url` |
| `publisher` | Required | Organization with `logo` |
| `mainEntityOfPage` | Recommended | WebPage `@id` |
| `description` | Recommended | Summary |

Do not use `Article` for a product, service, or category page.

### 3.6 Product and Offer

| Property | Requirement | Notes |
| --- | --- | --- |
| `name` | Required | Product name |
| `image` | Required | Absolute URL(s) |
| `description` | Recommended | Real description |
| `sku` / `mpn` / `gtin*` | Recommended | Use what actually exists |
| `brand` | Recommended | `Brand` or `Organization` |
| `offers` | Required for merchant listings | `Offer` or `AggregateOffer` |
| `offers.price` | Required | Numeric string, no currency symbol |
| `offers.priceCurrency` | Required | ISO 4217, e.g. `GBP` |
| `offers.availability` | Recommended | Schema URL, e.g. `https://schema.org/InStock` |
| `offers.url` | Recommended | Product/checkout URL |
| `aggregateRating` | Conditional | Only if real ratings are visible |
| `review` | Conditional | Only real, visible reviews |

Variant handling:

- One canonical product page can expose multiple `Offer` objects for variants.
- Do not create a `Product` per size/colour if those URLs canonicalise away.
- Out-of-stock: keep the page indexable; set availability honestly. Do not
  delete and recreate the URL.

### 3.7 AggregateRating and Review

| Property | Requirement |
| --- | --- |
| `ratingValue` | Required |
| `reviewCount` or `ratingCount` | Required |
| `bestRating` / `worstRating` | Recommended |
| `author` (Review) | Required |
| `reviewBody` (Review) | Recommended |
| `itemReviewed` | Required when not nested in the item |

Rules:

- Ratings must be displayed on the page.
- Do not aggregate reviews from third parties unless you are allowed to and
  they are visible.
- Do not incentivise reviews or gate them by sentiment (platform policy and
  consumer-law risk).
- Self-serving reviews for your own business are restricted by Google for
  `Organization`/`LocalBusiness` rich results; verify current policy.

### 3.8 FAQPage

| Property | Requirement |
| --- | --- |
| `mainEntity` | Array of `Question` |
| `Question.name` | The question text |
| `acceptedAnswer` | `Answer` with `text` |

Rules:

- Every Q&A must be visible on the page and expandable/readable by users.
- Do not mark up hidden keyword lists.
- Google restricts FAQ rich results to authoritative government/health sites;
  markup still helps understanding but do not sell it as a guaranteed rich result.

### 3.9 HowTo

`HowTo` rich results were retired by Google. The markup is still valid
Schema.org for semantic understanding, but do not promise a how-to carousel.
Write real step content with headings and lists.

### 3.10 LocalBusiness

| Property | Requirement |
| --- | --- |
| `name` | Required |
| `address` | Required (`PostalAddress` with street, locality, region, postal code, country) |
| `telephone` | Recommended |
| `url` | Recommended |
| `openingHoursSpecification` | Recommended |
| `geo` | Optional |
| `areaServed` | Optional |
| `priceRange` | Optional |
| `image` / `logo` | Recommended |

Use the most specific subtype (`Plumber`, `Restaurant`, `LegalService`, etc.).
NAP must match the Google Business Profile and the visible footer/contact page.

### 3.11 Event

| Property | Requirement |
| --- | --- |
| `name` | Required |
| `startDate` | Required (ISO 8601) |
| `location` | Required (`Place` or `VirtualLocation`) |
| `endDate` | Recommended |
| `eventStatus` | Recommended |
| `eventAttendanceMode` | Recommended |
| `offers` | Required for ticket rich results |
| `image` | Recommended |

Remove or update markup after the event; stale events damage trust.

### 3.12 VideoObject

| Property | Requirement |
| --- | --- |
| `name` | Required |
| `thumbnailUrl` | Required |
| `uploadDate` | Required |
| `description` | Recommended |
| `duration` | Recommended (ISO 8601) |
| `contentUrl` / `embedUrl` | Recommended |

The video must be visible/playable on the page.

### 3.13 Person

| Property | Requirement |
| --- | --- |
| `name` | Required |
| `url` | Recommended |
| `jobTitle` | Recommended |
| `sameAs` | Recommended |
| `worksFor` | Optional |

Use real authors. Do not invent credentials.

### 3.14 Service

| Property | Requirement |
| --- | --- |
| `name` | Required |
| `provider` | Recommended |
| `areaServed` | Recommended |
| `serviceType` | Recommended |
| `url` | Recommended |

`Service` does not have a dedicated Google rich result; it is still useful for
entity clarity.

---

## 4. Validation

Run all four layers:

1. **Syntax** — JSON parses; no trailing commas, comments, or unescaped quotes.
2. **Schema vocabulary** — <https://validator.schema.org/>.
3. **Google eligibility** — <https://search.google.com/test/rich-results>.
4. **Search Console** — Enhancements reports after deployment.

Automated checks (including `scripts/seo-audit.mjs`) can catch syntax and core
fields, but cannot prove eligibility. Human confirmation is required.

### 4.1 Common errors

| Error | Fix |
| --- | --- |
| Relative `url`/`image` | Make absolute with the canonical origin |
| `price` includes `£` | Numeric only: `"49.00"` |
| Missing `priceCurrency` | Add ISO code |
| `datePublished` not ISO 8601 | `2026-11-07T10:00:00+00:00` |
| Author is a string | Use `Person`/`Organization` with `name` |
| Duplicate `@type` blocks with conflicting data | Merge into one `@graph` |
| Markup for content not on page | Remove or make content visible |
| `aggregateRating` with no visible reviews | Remove until real ratings exist |
| `BreadcrumbList` positions out of order | 1..n, sequential |
| `@context` repeated inside `@graph` nodes | Keep one at the top |

### 4.2 Consistency checks

- `Organization.name` = legal/brand name used in the footer.
- `WebSite.url` = canonical origin.
- `WebPage.url` = canonical link.
- `Article.headline` = visible H1 (or close).
- `Product.offers.price` = visible price.
- `LocalBusiness.address` = visible NAP.
- `BreadcrumbList` = visible breadcrumbs.
- `dateModified` = visible "Updated" date, and only when content changed.

---

## 5. Entity SEO

Search engines and AI systems build entity graphs. Help them:

- Use one consistent brand name, logo, and description everywhere.
- Maintain `Organization.sameAs` with official profiles only.
- Use `Person` for authors with real bios and `sameAs` links.
- Link pages to the organization/site via `@id`.
- Keep `WebSite` + `Organization` on the homepage; reference them elsewhere.
- Do not create multiple `Organization` entities for the same business.
- Keep external profiles (LinkedIn, Crunchbase, Wikipedia/Wikidata if eligible)
  accurate; do not fabricate notability.

---

## 6. Structured-data acceptance checks

- [ ] JSON parses with no errors.
- [ ] `@context` is `https://schema.org`.
- [ ] The most specific accurate `@type` is used.
- [ ] Required fields for the chosen type are present.
- [ ] All URLs are absolute and canonical.
- [ ] Markup matches visible content (price, rating, author, dates, address).
- [ ] No fake or incentivised reviews/ratings.
- [ ] `@id` values are stable and unique.
- [ ] No duplicate/conflicting entities.
- [ ] Rich Results Test passes for the intended feature.
- [ ] Search Console enhancement report is clean after deploy.
- [ ] Stale event/product markup is removed or updated.
