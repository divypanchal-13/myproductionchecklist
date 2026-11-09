# JSON-LD templates

Copy, replace every `<placeholder>`, remove entities that do not apply to the
page, and validate. **Markup must describe what users can see.** Do not ship
placeholder values.

---

## 0. Rules

1. JSON-LD in `<script type="application/ld+json">`, one `@context` at the top.
2. Prefer an `@graph` so entities can reference each other by `@id`.
3. Absolute URLs for `url`, `image`, `logo`, `@id`, `sameAs`.
4. One entity per real thing; no conflicting duplicates.
5. Required fields for the chosen Google feature are stricter than Schema.org —
   check current documentation.
6. No fake reviews, ratings, prices, availability, authors, or credentials.
7. Dates are ISO 8601 with timezone: `2026-11-07T10:00:00+00:00`.
8. Prices are numeric strings without symbols: `"49.00"` + `"GBP"`.
9. Remove or update stale event/product markup.
10. Validate before shipping:
    - <https://validator.schema.org/>
    - <https://search.google.com/test/rich-results>
    - GSC Enhancements after deploy.

---

## 1. Site graph (homepage)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.example.com/#organization",
      "name": "<Legal or trading name>",
      "url": "https://www.example.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.example.com/logo.png",
        "width": 512,
        "height": 512
      },
      "description": "<One-sentence description of the business>",
      "sameAs": [
        "https://www.linkedin.com/company/<handle>",
        "https://x.com/<handle>"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "telephone": "+44-<number>",
        "email": "<email>",
        "areaServed": "GB",
        "availableLanguage": ["en-GB"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://www.example.com/#website",
      "url": "https://www.example.com",
      "name": "<Brand>",
      "publisher": { "@id": "https://www.example.com/#organization" },
      "inLanguage": "en-GB"
    },
    {
      "@type": "WebPage",
      "@id": "https://www.example.com/#webpage",
      "url": "https://www.example.com/",
      "name": "<Homepage title>",
      "isPartOf": { "@id": "https://www.example.com/#website" },
      "about": { "@id": "https://www.example.com/#organization" },
      "inLanguage": "en-GB"
    }
  ]
}
```

- `SearchAction` is optional. Google retired the sitelinks search box rich
  result; do not promise a search box.
- `sameAs` only official profiles. Do not list directories you do not control.

---

## 2. Interior page + breadcrumbs

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.example.com/services/technical-seo/#webpage",
      "url": "https://www.example.com/services/technical-seo",
      "name": "<Page title>",
      "description": "<Page description>",
      "isPartOf": { "@id": "https://www.example.com/#website" },
      "about": { "@id": "https://www.example.com/#organization" },
      "breadcrumb": { "@id": "https://www.example.com/services/technical-seo/#breadcrumb" },
      "inLanguage": "en-GB"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.example.com/services/technical-seo/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.example.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Services",
          "item": "https://www.example.com/services"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Technical SEO"
        }
      ]
    }
  ]
}
```

The last breadcrumb omits `item` (current page). Visible breadcrumbs must match.

---

## 3. Article / BlogPosting

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://www.example.com/blog/seo-audit-guide/#article",
  "headline": "<Headline, <=110 chars>",
  "description": "<Summary>",
  "image": [
    "https://www.example.com/blog/seo-audit-guide/cover-1200x630.jpg"
  ],
  "datePublished": "2026-11-07T09:00:00+00:00",
  "dateModified": "2026-11-07T09:00:00+00:00",
  "author": {
    "@type": "Person",
    "name": "<Author name>",
    "url": "https://www.example.com/team/<slug>",
    "jobTitle": "<Role>",
    "sameAs": ["https://www.linkedin.com/in/<handle>"]
  },
  "reviewedBy": {
    "@type": "Person",
    "name": "<Reviewer name>",
    "url": "https://www.example.com/team/<slug>"
  },
  "publisher": { "@id": "https://www.example.com/#organization" },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.example.com/blog/seo-audit-guide/#webpage"
  },
  "inLanguage": "en-GB",
  "isAccessibleForFree": true
}
```

Rules:

- `headline` should match the visible H1 closely.
- `image` absolute, ≥1200 px wide recommended.
- `dateModified` only when content actually changed.
- `author` is a `Person`/`Organization`, not a bare string.
- `reviewedBy` only if a real human reviewed it.

---

## 4. Product + Offer

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://www.example.com/products/widget-pro/#product",
  "name": "<Product name>",
  "description": "<Product description>",
  "image": [
    "https://www.example.com/products/widget-pro/front.jpg",
    "https://www.example.com/products/widget-pro/side.jpg"
  ],
  "sku": "<SKU>",
  "mpn": "<MPN>",
  "gtin13": "<GTIN>",
  "brand": {
    "@type": "Brand",
    "name": "<Brand>"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.example.com/products/widget-pro",
    "price": "49.00",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "priceValidUntil": "2027-01-01",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0.00",
        "currency": "GBP"
      },
      "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "GB"
      },
      "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY" },
        "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 3, "unitCode": "DAY" }
      }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "GB",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 30,
      "returnMethod": "https://schema.org/ReturnByMail",
      "returnFees": "https://schema.org/FreeReturn"
    }
  }
}
```

- Price/availability must match the visible page **at render time**.
- Do not add `aggregateRating` unless real ratings are visible.
- Variants: expose multiple `Offer` objects on the canonical product page, or
  separate indexable variant URLs with their own self-canonical and content.
- Out of stock: keep the URL indexable, set `OutOfStock` honestly.

---

## 5. LocalBusiness

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://www.example.com/#business",
  "name": "<Business name exactly as used>",
  "url": "https://www.example.com",
  "logo": "https://www.example.com/logo.png",
  "image": "https://www.example.com/storefront.jpg",
  "telephone": "+44-<number>",
  "email": "<email>",
  "priceRange": "££",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "<Street>",
    "addressLocality": "<City>",
    "addressRegion": "<Region>",
    "postalCode": "<Postcode>",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": <lat>,
    "longitude": <lng>
  },
  "areaServed": [
    { "@type": "City", "name": "<City>" },
    { "@type": "AdministrativeArea", "name": "<Region>" }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:30"
    }
  ],
  "sameAs": [
    "https://www.google.com/maps/place/<listing>",
    "https://www.linkedin.com/company/<handle>"
  ]
}
```

- Use the most specific subtype (`Plumber`, `LegalService`, `Restaurant`, etc.).
- NAP must match the visible footer/contact page and the Google Business Profile.
- `areaServed` must be honest.
- One entity per real, staffed location.

---

## 6. FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "<Question exactly as visible>",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "<Answer exactly as visible>"
      }
    },
    {
      "@type": "Question",
      "name": "<Another question>",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "<Another answer>"
      }
    }
  ]
}
```

- Every Q&A must be visible and readable on the page.
- Google restricts FAQ rich results; do not sell this as a guaranteed feature.
- No hidden keyword lists, no questions the page does not answer.

---

## 7. Event (only while the event is live)

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "<Event name>",
  "startDate": "2026-12-01T18:00:00+00:00",
  "endDate": "2026-12-01T21:00:00+00:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "<Venue>",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "<Street>",
      "addressLocality": "<City>",
      "postalCode": "<Postcode>",
      "addressCountry": "GB"
    }
  },
  "image": ["https://www.example.com/events/<slug>/cover.jpg"],
  "description": "<Description>",
  "offers": {
    "@type": "Offer",
    "url": "https://www.example.com/events/<slug>",
    "price": "0.00",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-11-01T09:00:00+00:00"
  },
  "organizer": { "@id": "https://www.example.com/#organization" }
}
```

Remove or update after the event. Stale events damage trust.

---

## 8. VideoObject

```json
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "<Video title>",
  "description": "<Video description>",
  "thumbnailUrl": ["https://www.example.com/video/thumb.jpg"],
  "uploadDate": "2026-11-07T09:00:00+00:00",
  "duration": "PT4M32S",
  "contentUrl": "https://www.example.com/video.mp4",
  "embedUrl": "https://www.example.com/embed/<id>",
  "publisher": { "@id": "https://www.example.com/#organization" },
  "inLanguage": "en-GB"
}
```

The video must be visible/playable on the page.

---

## 9. Common validation errors

| Error | Fix |
| --- | --- |
| Relative `url`/`image` | Make absolute with canonical origin |
| `price` includes `£` | Numeric string only |
| Missing `priceCurrency` | Add ISO 4217 code |
| Date not ISO 8601 | `2026-11-07T10:00:00+00:00` |
| Author is a string | `Person`/`Organization` with `name` |
| Duplicate conflicting blocks | Merge into one `@graph` |
| Markup for hidden content | Make it visible or remove |
| `aggregateRating` without visible reviews | Remove until real |
| Breadcrumb positions out of order | 1..n sequential |
| `@context` inside graph nodes | Keep one at the top |
| Missing `offers` on Product | Add `Offer`/`AggregateOffer` |
| Event in the past | Remove/update |

---

## 10. QA

- [ ] JSON parses; no trailing commas/comments.
- [ ] `@context` correct; one per block.
- [ ] Most specific accurate `@type`.
- [ ] Required fields for the feature present.
- [ ] All URLs absolute and canonical.
- [ ] Visible content matches every claim (price, rating, author, dates, NAP).
- [ ] No fake or incentivised reviews.
- [ ] `@id` stable and unique.
- [ ] No duplicate/conflicting entities.
- [ ] Rich Results Test passes for the intended feature.
- [ ] Schema Markup Validator has no errors.
- [ ] GSC Enhancements clean after deploy.
- [ ] Stale event/product markup removed.
