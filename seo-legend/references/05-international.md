# International SEO

International SEO is mostly about **not confusing search engines** about which
URL serves which language/region.

---

## 1. Choose a URL structure

| Structure | Example | Pros | Cons |
| --- | --- | --- | --- |
| ccTLD | `example.co.uk` | Strong geo signal, local trust | Cost, separate authority, ops |
| Subdomain | `uk.example.com` | Clear separation, CDN-friendly | Authority split, more setup |
| Subdirectory | `example.com/uk/` | Consolidates authority, easy | Weaker geo signal, mixed analytics |
| Parameters | `?lang=en-GB` | Cheap | Crawl/index noise; avoid if possible |

Rules:

- Pick one and be consistent.
- Do not mix structures for the same market without a migration plan.
- Subdirectories are usually the best default for small/medium sites.
- ccTLDs are strongest when local presence and trust matter.

---

## 2. Language vs region

- **Language** (`en`) = the language of the content.
- **Region** (`GB`) = the target market (currency, shipping, law, spelling).
- Use `en-GB` for British English targeting the UK, `en-US` for US English, etc.
- Do not create a region variant unless content genuinely differs
  (price, availability, legal, delivery, contact).
- `en` alone is fine for language-only targeting with no regional variant.

---

## 3. hreflang

### 3.1 Rules

- Every variant lists **all** variants, including itself (self-referential).
- Tags are reciprocal: if A points to B, B must point to A.
- Use ISO 639-1 language + optional ISO 3166-1 Alpha-2 region.
- `x-default` points to the global selector/fallback page.
- hreflang URLs must be canonical, absolute, and return `200`.
- hreflang must agree with canonical: the canonical of a variant is itself.
- Do not hreflang to `noindex`, redirecting, or 404 URLs.
- Use one implementation method consistently: HTML `<link>`, HTTP `Link`
  headers, or XML sitemap. Mixing is allowed but must not conflict.

### 3.2 HTML example

```html
<link rel="alternate" hreflang="en-GB" href="https://example.com/uk/page" />
<link rel="alternate" hreflang="en-US" href="https://example.com/us/page" />
<link rel="alternate" hreflang="de-DE" href="https://example.com/de/page" />
<link rel="alternate" hreflang="x-default" href="https://example.com/page" />
```

Each of those pages must include the same set, with its own URL included.

### 3.3 Sitemap example

```xml
<url>
  <loc>https://example.com/uk/page</loc>
  <xhtml:link rel="alternate" hreflang="en-GB" href="https://example.com/uk/page"/>
  <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/us/page"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/page"/>
</url>
```

The `xhtml` namespace must be declared on `<urlset>`.

### 3.4 Common errors

| Error | Consequence |
| --- | --- |
| Missing self-reference | Cluster ignored or weakened |
| Non-reciprocal tags | Conflicting signals |
| hreflang to a redirect | Wasted signal |
| hreflang to `noindex` | Invalid cluster |
| Canonical to a different language | Variant collapses |
| `en-UK` (invalid region) | Ignored (UK is not ISO 3166-1) |
| `x-default` missing | No fallback for unmatched users |
| Different URL sets on each page | Broken cluster |
| Language selector only via JS | Crawlers may miss variants |

---

## 4. Canonical and hreflang

Correct:

- `/uk/page` canonical `/uk/page`, hreflang includes `/uk/page`.
- `/us/page` canonical `/us/page`, hreflang includes `/us/page`.

Incorrect:

- `/uk/page` canonical `/page` (global) while hreflang says `/uk/page` — the
  canonical wins and the UK variant collapses.
- hreflang pointing to a URL whose canonical points elsewhere.

If variants are true duplicates and should not be indexed, do not hreflang
them; consolidate with canonical/redirect instead.

---

## 5. Content localisation

- Translate meaning, not words. Idioms and examples must fit the market.
- Localise currency, units, dates, addresses, phone formats, and legal text.
- Use local keyword research; direct translations miss intent.
- Keep brand voice consistent but adapt formality.
- Localise images, testimonials, case studies, and social proof.
- Check cultural sensitivity and regulatory constraints.
- Do not machine-translate thousands of pages without review; that is
  scaled-content risk.
- Maintain a glossary for product terms.

---

## 6. Geotargeting

- Search Console International Targeting is retired; use hreflang and
  local signals instead.
- Local signals: ccTLD, local address/phone, local links, GBP, local content.
- Do not rely on IP redirects for the primary experience; they can hide content
  from crawlers and annoy users. Offer a dismissible suggestion instead.
- Currency/shipping selectors should not change the indexed URL unexpectedly.
- Serve the same content to users and crawlers (no geo-cloaking).

---

## 7. Language selector UX

- Server-rendered `<a href>` links to each locale, not JS-only buttons.
- Label languages in their own language (`Deutsch`, `Français`).
- Preserve the equivalent page when switching, not the homepage.
- Remember preference with a cookie, but do not force redirects.
- Include a visible `x-default`/global option.

---

## 8. International acceptance checks

- [ ] One URL structure per market, documented.
- [ ] Every variant self-canonicals.
- [ ] hreflang cluster is complete, reciprocal, and self-referential.
- [ ] `x-default` exists and returns 200.
- [ ] hreflang targets are canonical, indexable, and 200.
- [ ] Language/region codes are valid (`en-GB`, not `en-UK`).
- [ ] No IP-based forced redirects/cloaking.
- [ ] Localised content reviewed by a fluent human.
- [ ] Currency/units/legal content correct per market.
- [ ] Language switcher is crawlable and preserves the page.
- [ ] Sitemaps include all variants and hreflang (if using sitemap method).
- [ ] Analytics can segment by locale and market.
