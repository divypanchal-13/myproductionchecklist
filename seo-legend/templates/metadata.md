# Metadata templates

Copy the relevant block, replace every `<placeholder>`, delete what does not
apply. **Never ship a placeholder.** Character counts are guidance: Google
truncates by pixel width, so verify in the SERP preview rather than trusting
counts alone.

---

## 0. Site constants

| Variable | Value |
| --- | --- |
| Brand name | `<Brand>` |
| Canonical origin | `<https://www.example.com>` |
| Default OG image | `<https://www.example.com/og/default.png>` |
| Locale | `<en_GB>` |
| Language | `<en-GB>` |
| Twitter/X handle | `<@brand>` |
| Default robots | `index, follow` |

Rules:

- Every canonical, OG URL, schema URL, and sitemap URL uses the canonical origin.
- One trailing-slash policy; all templates follow it.
- Titles/descriptions are generated per page, never a single sitewide default.
- `metadataBase` (or CMS equivalent) must be set once so relative URLs resolve.

---

## 1. Page-type matrix

| Template | Index? | Title formula | Description focus | H1 |
| --- | --- | --- | --- | --- |
| Home | Yes | `<Brand> — <primary proposition>` | Who you help, what you do, proof | `<Brand>` / proposition |
| Service | Yes | `<Service> in <Location> | <Outcome> — <Brand>` | Audience, scope, proof, next step | `<Service>` + outcome |
| Service index | Yes | `<Services> — <Brand>` | Overview + selection help | `<Services>` |
| Guide/article | Yes | `<How to / What is> <topic> (<year>) — <Brand>` | What the reader will learn | `<Topic>` |
| Category | Yes | `<Category> — <Range/Benefit> | <Brand>` | Selection help + range | `<Category>` |
| Product | Yes | `<Product> — <Key Benefit> | <Brand>` | Product + differentiator + trust | `<Product>` |
| Location | Yes | `<Service> in <City> | <Proof> — <Brand>` | Local proof, coverage, contact | `<Service> in <City>` |
| About | Yes | `About <Brand> — <Credential/Story>` | Who you are, why trust you | `About <Brand>` |
| Contact | Yes | `Contact <Brand> — <Channel/Hours>` | How to reach, response time | `Contact <Brand>` |
| Case study | Yes | `<Client> <Result> — <Brand>` | Problem, work, measurable outcome | `<Result>` |
| Pricing | Yes | `Pricing — <Model> | <Brand>` | Plans, inclusions, caveats | `Pricing` |
| FAQ | Yes | `<Topic> FAQs — <Brand>` | Real questions + direct answers | `<Topic> FAQs` |
| Blog index | Yes | `<Blog> — <Topic Focus> | <Brand>` | What readers will find | `<Blog>` |
| Author | Yes* | `<Name> — <Role> | <Brand>` | Credentials, work, sameAs | `<Name>` |
| Legal | Yes | `<Policy> — <Brand>` | What the policy covers | `<Policy>` |
| Internal search | No | n/a | n/a | `Search` |
| Cart/checkout | No | n/a | n/a | `Cart` / `Checkout` |
| Account/admin | No | n/a | n/a | `Account` |
| Thank-you | No | n/a | n/a | `Thank you` |
| 404 | No | `Page not found — <Brand>` | Helpful links | `Page not found` |
| Paginated page 2+ | Yes | `<Category> — Page <n> | <Brand>` | Keep self-canonical | `<Category>` |

\* Only if the author page has unique, useful content. Otherwise `noindex`.

---

## 2. Title rules

- Target ~50–60 characters; front-load the primary topic.
- Brand at the end when it adds trust; omit when space is tight.
- Unique across the site. Enforce with a template variable, not manual edits.
- Avoid: `Home`, `Untitled`, `Best #1 Cheapest`, ALL CAPS, emoji spam,
  keyword lists, and promises the page cannot satisfy.
- The title may differ from the H1 but must agree semantically.
- Local pages include a city only when the page is genuinely local.
- For news/evergreen guides, include the year only if you maintain it.

## 3. Description rules

- Target ~120–160 characters; unique per page.
- State audience + value + reason to click.
- Match the page; a mismatch raises bounce and erodes trust.
- No prices/dates that will go stale unless maintained.
- Not a ranking factor, but it influences clicks and can be rewritten by Google.
- Do not duplicate a template with only the city swapped unless the page is
  genuinely local.

## 4. Canonical and robots rules

```text
Indexable page:  <link rel="canonical" href="<absolute self URL>">
                 <meta name="robots" content="index, follow">
Non-indexable:   <meta name="robots" content="noindex, follow">
                 (do not also set a cross-canonical)
Redirect:        301/308 to the final URL; no canonical tag needed
```

- One canonical per page, absolute HTTPS.
- Canonical must return 200, be indexable, and self-reference.
- `og:url` = canonical.
- Never canonicalise every page to the homepage.
- Never combine `noindex` with a canonical pointing elsewhere.

---

## 5. Next.js App Router (server components)

### Root layout

```tsx
// app/layout.tsx
import type { Metadata } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "<Brand> — <primary proposition>",
    template: "%s | <Brand>",
  },
  description: "<Default description, 120–160 chars>",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "<Brand>",
    locale: "en_GB",
    url: "/",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "<Brand>" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@<handle>",
    creator: "@<handle>",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};
```

### Static page

```tsx
// app/services/technical-seo/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical SEO Services | Audit & Implementation",
  description:
    "Technical SEO audits and fixes for UK sites: crawl, indexation, Core Web Vitals and structured data. See the process and book a review.",
  alternates: { canonical: "/services/technical-seo" },
  openGraph: {
    type: "website",
    url: "/services/technical-seo",
    title: "Technical SEO Services | Audit & Implementation",
    description: "Audits, fixes and monitoring for crawl, indexation and CWV.",
    images: [{ url: "/og/technical-seo.png", width: 1200, height: 630, alt: "Technical SEO services" }],
  },
  twitter: { card: "summary_large_image" },
};
```

### Dynamic page

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug); // your data layer

  if (!post) return { title: "Article not found", robots: { index: false, follow: false } };

  return {
    title: post.seoTitle,                 // 50–60 chars
    description: post.seoDescription,     // 120–160 chars
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.seoTitle,
      description: post.seoDescription,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [{ url: post.ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image" },
    robots: post.noindex ? { index: false, follow: true } : { index: true, follow: true },
  };
}
```

Rules:

- Metadata must be exported from a **server** component. Client components
  cannot export `metadata`.
- Do not hand-write `<title>`/`<meta>` in components.
- `metadataBase` must be absolute; relative canonical/OG fields build on it.
- If `generateMetadata` fetches slow data, cache it — it affects TTFB.
- Use `title.template` in the root layout and plain titles in children to avoid
  double-branding.

---

## 6. Plain HTML

```html
<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Technical SEO Services | Audit &amp; Implementation — Brand</title>
    <meta name="description" content="Technical SEO audits and fixes for UK sites: crawl, indexation, Core Web Vitals and structured data. See the process and book a review." />
    <link rel="canonical" href="https://www.example.com/services/technical-seo" />
    <meta name="robots" content="index, follow" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Brand" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:title" content="Technical SEO Services | Audit &amp; Implementation" />
    <meta property="og:description" content="Audits, fixes and monitoring for crawl, indexation and CWV." />
    <meta property="og:url" content="https://www.example.com/services/technical-seo" />
    <meta property="og:image" content="https://www.example.com/og/technical-seo.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Technical SEO services" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Technical SEO Services | Audit &amp; Implementation" />
    <meta name="twitter:description" content="Audits, fixes and monitoring for crawl, indexation and CWV." />
    <meta name="twitter:image" content="https://www.example.com/og/technical-seo.png" />
    <meta name="twitter:site" content="@brand" />

    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="alternate" type="text/markdown" href="/services/technical-seo.html.md" />
    <link rel="describedby" href="/llms.txt" />
  </head>
  <body>
    <h1>Technical SEO Services</h1>
    <!-- visible content -->
  </body>
</html>
```

---

## 7. CMS mapping

| CMS | Where metadata lives | Watch out for |
| --- | --- | --- |
| WordPress + Yoast | SEO title/meta description per post + templates | Two SEO plugins; `noindex` toggles; attachment pages |
| WordPress + Rank Math | Similar; Titles & Meta module | Conflicting schema from theme/plugin |
| Shopify | Product/collection SEO title + description | App-injected canonicals; theme hard-coded tags |
| Webflow | Page settings + collection SEO fields | Missing canonical on CMS pages; duplicate OG |
| Contentful/Sanity | SEO object per entry + fallback logic | Missing fallback; locale fields empty |
| Custom | Template + data model | Hard-coded title; canonical from request URL |

Rule: fix the **template/generator**, then spot-check individual overrides.

---

## 8. QA

- [ ] Title unique and 50–60 chars; no truncation in SERP preview.
- [ ] Description unique and 120–160 chars; value-led.
- [ ] Exactly one H1 matching the topic.
- [ ] Canonical absolute, self-referencing, matches sitemap/internal links.
- [ ] `og:url` = canonical.
- [ ] OG image 1200×630, absolute, not a logo on white with tiny text.
- [ ] Twitter card present.
- [ ] `lang` correct.
- [ ] Viewport present.
- [ ] No `noindex` on an indexable page.
- [ ] Rendered in initial HTML (view-source, JS disabled).
- [ ] No placeholder values in production.
- [ ] Metadata consistent across locales/hreflang.
