# Local SEO

Local SEO is trust + proximity + consistency. There is no trick that beats a
real business with accurate information and genuine reviews.

---

## 1. Google Business Profile (GBP)

Checklist:

- [ ] Claim and verify the profile.
- [ ] Business name exactly as used in the real world (no keyword stuffing).
- [ ] Primary category + relevant secondary categories.
- [ ] Accurate address or service-area configuration.
- [ ] Phone number that reaches the business.
- [ ] Website URL to the most relevant page (not always the homepage).
- [ ] Hours, including special/holiday hours.
- [ ] Attributes (accessibility, payments, parking, etc.) accurate.
- [ ] Real photos, updated periodically; no stock imagery pretending to be the premises.
- [ ] Services/products with descriptions and prices where appropriate.
- [ ] Q&A monitored; answer real questions.
- [ ] Reviews requested from real customers; respond to all.
- [ ] Posts/updates used for genuine news, not keyword spam.
- [ ] Duplicate listings removed or merged.
- [ ] Multi-location: one profile per real, staffed location.

Prohibited: virtual offices/fake addresses, lead-generation addresses, keyword
stuffing in the name, fake reviews, review gating, and incentivised reviews.

---

## 2. NAP consistency

NAP = Name, Address, Phone.

- Use the **same** format everywhere: website footer, contact page, GBP,
  directories, invoices, social profiles.
- Decide on abbreviations (`Street` vs `St`) and stick to them.
- Include the legal/trading name consistently.
- Update all listings when something changes.
- Audit citations quarterly for duplicates and stale numbers.

Do not chase hundreds of low-quality directories. Prioritise: GBP, Bing Places,
Apple Business Connect, relevant industry directories, local chambers, and
official associations.

---

## 3. Location pages

Create a page only for a location you genuinely serve or staff.

Each page needs:

- [ ] Unique H1: service + location.
- [ ] Real address/coverage area and map.
- [ ] Local phone number or clear contact route.
- [ ] Local proof: projects, team, testimonials, photos.
- [ ] Service details specific to the area.
- [ ] Local FAQs (parking, coverage, response time).
- [ ] Hours and service-area boundaries.
- [ ] Internal links to nearby locations and relevant services.
- [ ] `LocalBusiness` schema matching visible NAP.
- [ ] No duplicated copy with the city swapped.

If you serve a region without an office, say so honestly ("serving Greater
Manchester") rather than inventing an address.

---

## 4. Structured data for local

```json
{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "@id": "https://example.com/#business",
  "name": "Example Plumbing Ltd",
  "url": "https://example.com",
  "telephone": "+44 161 000 0000",
  "image": "https://example.com/storefront.jpg",
  "priceRange": "££",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1 Example Street",
    "addressLocality": "Manchester",
    "addressRegion": "Greater Manchester",
    "postalCode": "M1 1AA",
    "addressCountry": "GB"
  },
  "areaServed": [
    { "@type": "City", "name": "Manchester" },
    { "@type": "City", "name": "Salford" }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "sameAs": ["https://www.google.com/maps/place/..."]
}
```

Rules:

- Use the most specific `LocalBusiness` subtype.
- Address must match the visible page and GBP.
- `areaServed` must be honest.
- Do not add `aggregateRating` unless real reviews are visible.
- One business entity per real location; use `@id` to link pages.

---

## 5. Reviews

- Ask every customer, not just happy ones.
- Do not filter by sentiment before asking (review gating).
- Do not offer discounts/prizes conditional on a positive review.
- Never write or buy reviews.
- Respond publicly, professionally, and without revealing private data.
- Track review velocity and rating honestly.
- Use review content to improve service, not just as marketing.

---

## 6. Local content and links

- Sponsor/participate in genuinely local events and organisations.
- Get listed in local chambers, associations, and relevant directories.
- Build relationships with local journalists and businesses.
- Publish local guides only when you have real knowledge.
- Do not buy links or join link networks.
- Do not create fake "local" blogs with no connection to the area.

---

## 7. Multi-location

- One page per location, linked from a locations index.
- Unique content per location (team, services, proof).
- One GBP per location; no shared phone numbers if avoidable.
- Consistent naming: `Brand — Manchester`, not keyword-stuffed variants.
- Location pages should not compete for the same query; differentiate intent.
- Use `Organization` + `LocalBusiness` entities linked by `@id`.

---

## 8. Local acceptance checks

- [ ] GBP verified, accurate, and complete.
- [ ] NAP identical across site, GBP, Bing, Apple, and key directories.
- [ ] One profile per real location; duplicates removed.
- [ ] Location pages are unique and genuinely local.
- [ ] `LocalBusiness` schema matches visible NAP and hours.
- [ ] Reviews are real, visible, and policy-compliant.
- [ ] Hours/service area accurate on site and in GBP.
- [ ] Local landing pages linked from the main navigation or locations index.
- [ ] No fake addresses, keyword-stuffed names, or review gating.
- [ ] Local performance tracked in GBP Insights and analytics.
