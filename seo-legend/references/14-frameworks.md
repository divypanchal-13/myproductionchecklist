# Framework and host notes

Platform-specific pitfalls. Always check the installed version's documentation;
APIs change.

---

## 1. Next.js (App Router)

### Metadata

- Use the `metadata` export or `generateMetadata()` in server components.
- Set `metadataBase` so relative OG/canonical URLs resolve correctly.
- Do not write `<title>`/`<meta>` manually in client components.
- Canonical: `alternates: { canonical: "/path" }`.
- Open Graph/Twitter: `openGraph`, `twitter` objects.
- Robots: `robots: { index: true, follow: true }`.
- Verification: `verification: { google, other: { "msvalidate.01": ... } }`.

```ts
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: "Page title",
  description: "…",
  alternates: { canonical: "/page" },
  openGraph: { title: "…", description: "…", url: "/page", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: "…", images: ["/og.png"] },
  robots: { index: true, follow: true },
};
```

### Route handlers

- `app/sitemap.ts` → `/sitemap.xml`.
- `app/robots.ts` → `/robots.txt`.
- `app/icon.png` / `app/apple-icon.png` → favicons.
- `app/opengraph-image.tsx` → generated OG image (optional).

### Rendering and caching

- Prefer static/ISR for content that does not need per-request data.
- Do not mark marketing pages `force-dynamic` without a reason.
- With `cacheComponents: true`, route segment configs like `dynamic`/`runtime`
  may be rejected; use the supported APIs instead.
- Client components cannot export metadata.
- Ensure canonical/title/H1 exist in the initial HTML.

### Images and fonts

- `next/image` with `priority` for the hero; correct `sizes`.
- `next/font` for self-hosted, subset fonts.
- Avoid layout shift with explicit dimensions.

### Redirects

- `next.config.ts` → `redirects()` for permanent rules.
- Middleware only when necessary; test carefully (it runs on every request).
- Avoid redirect chains across config/middleware/CDN.

### Common Next.js mistakes

- Metadata only in a client component → missing tags.
- `metadataBase` unset → relative canonical/OG URLs.
- `generateMetadata` fetching slow data → high TTFB.
- Entire page as a client component → poor LCP/INP and weak HTML.
- Catch-all routes generating thousands of thin pages.
- `next start` behind Apache without `X-Forwarded-Proto` → wrong redirects.

---

## 2. WordPress

### Basics

- Settings → Permalinks: use a stable structure (`/%postname%/`).
- One SEO plugin only (Yoast **or** Rank Math), not both.
- Configure titles/descriptions/canonicals/sitemaps in one place.
- Ensure `wp-sitemap.xml` or the plugin sitemap is the single source.
- Check `robots.txt` (virtual or physical) for staging leftovers.
- Disable indexing of tags/dates/authors/attachments if thin.
- Use categories intentionally; avoid duplicate category/tag archives.
- Canonical category pages to themselves.
- Pagination: self-canonical; do not canonical page 2 to page 1.

### Common WordPress mistakes

- Two SEO plugins output conflicting canonicals.
- "Discourage search engines" left on after launch.
- Attachment pages indexed as thin duplicates.
- Page builders injecting hidden text/duplicate H1s.
- Slider/accordion content not in HTML.
- Huge plugin/theme JS bundles hurting CWV.
- Staging site indexed because it was cloned with the same domain.
- `?replytocom=` and search URLs creating crawl noise.

### Performance

- Object caching, page caching, CDN.
- Optimise images (WebP/AVIF), lazy-load below the fold.
- Limit plugins; audit third parties.
- Use a lightweight theme; avoid page-builder bloat where possible.

---

## 3. Shopify

### URLs and canonicals

- Shopify generates canonical tags; do not override them incorrectly.
- Product variants: `?variant=` should not create indexable duplicates.
- Collections can be reached via `/collections/...` and `/products/...`; keep
  internal links consistent.
- `/collections/all` and search pages need a deliberate policy.
- Blog/article URLs are stable; avoid changing handles.

### Sitemaps and robots

- `sitemap.xml` is auto-generated; `robots.txt.liquid` is editable.
- Do not block `/collections/` or product assets you need.
- Submit the sitemap in GSC/Bing.
- Check `robots.txt` after app installs (apps can inject rules).

### SEO fields

- Fill product/collection SEO title and description.
- Avoid duplicate manufacturer descriptions; add original value.
- Use metafields for structured data where needed.
- Keep prices/availability consistent with the storefront.

### Markets and languages

- Shopify Markets can create locale URLs; configure hreflang.
- Do not duplicate content across markets without localisation.
- Check currency/redirect behaviour.

### Common Shopify mistakes

- App-injected `noindex` or canonical overrides.
- Collection filters creating infinite crawlable URLs.
- Out-of-stock products deleted (lose links).
- Duplicate product descriptions from suppliers.
- Heavy apps/themes destroying CWV.
- `?utm` or `?variant` URLs indexed.

---

## 4. Apache

- `RewriteRule` for canonical host/HTTPS/proxy.
- `ProxyPreserveHost On`; pass `X-Forwarded-Proto`.
- `Header set` for security headers.
- `Cache-Control` for hashed assets; `setifempty` so Next headers win.
- Deny access to `.env`, `.git`, `node_modules`, `.next`, logs, source dirs.
- Test with `apachectl configtest` and a staging vhost.
- Keep redirects single-hop; avoid redirecting assets.

---

## 5. NGINX

```nginx
server {
  listen 443 ssl http2;
  server_name example.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  location ~* \.(?:js|css|woff2|png|jpg|svg)$ {
    proxy_pass http://127.0.0.1:3000;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }
}
```

- Handle `www`/HTTPS with a separate server block returning `301`.
- Do not let the SPA fallback return `200` for missing files.
- Ensure `try_files` does not mask 404s.

---

## 6. Static hosts (Netlify, Vercel, Cloudflare Pages)

- Redirects: `_redirects` (Netlify/Cloudflare) or `vercel.json`.
- Headers: `_headers` (Netlify/Cloudflare) or `vercel.json`.
- Preview deployments: `X-Robots-Tag: noindex` or auth.
- SPA fallback: return a real `404` status for unknown routes; `200` fallbacks
  create soft 404s.
- Verify `robots.txt` and `sitemap.xml` are served from the domain root.
- Custom domains: one canonical host; redirect the others.

---

## 7. CMS-agnostic checklist

- [ ] Metadata templates are server-rendered.
- [ ] Canonical is generated from the canonical URL, not the request URL.
- [ ] Sitemap excludes non-canonical/`noindex` URLs.
- [ ] robots.txt is environment-aware (staging vs production).
- [ ] Redirects live at the edge/server, not only in the CMS.
- [ ] Structured data is generated from the same data as the page.
- [ ] Images/fonts are optimised.
- [ ] Analytics/consent is loaded once, after consent.
- [ ] Preview/staging is not indexable.
- [ ] 404 returns 404.
