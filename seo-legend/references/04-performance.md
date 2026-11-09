# Performance and Core Web Vitals

Performance is part of SEO because it shapes real user experience. Treat lab
scores as diagnostics and field data as the truth.

---

## 1. Core Web Vitals thresholds

Measured at the **75th percentile** of page loads, separated by mobile/desktop:

| Metric | Good | Needs improvement | Poor |
| --- | --- | --- | --- |
| LCP (loading) | ≤ 2.5 s | 2.5–4.0 s | > 4.0 s |
| INP (interactivity) | ≤ 200 ms | 200–500 ms | > 500 ms |
| CLS (visual stability) | ≤ 0.1 | 0.1–0.25 | > 0.25 |

A page passes when all three are "good" at p75. Field data comes from CrUX,
Search Console, PageSpeed Insights, and your own RUM.

Supporting diagnostics:

- **TTFB** — server/CDN responsiveness; aim < 0.8 s for static pages.
- **FCP** — first paint; useful for diagnosing LCP render delay.
- **TBT** — lab proxy for INP; Lighthouse cannot measure real INP.
- **Speed Index** — visual completion; secondary.

---

## 2. Field vs lab

| Source | What it tells you | Limitation |
| --- | --- | --- |
| CrUX / GSC CWV | Real users, p75, 28-day rolling | No per-page detail on small sites |
| PageSpeed Insights | Field + lab in one view | Lab is synthetic |
| Lighthouse | Reproducible lab diagnostics | Not real INP; device/network assumptions |
| DevTools Performance | Deep traces | One session, not representative |
| RUM (`web-vitals`) | Your users, segmented | Requires instrumentation and consent |

Rules:

- Never claim "CWV passed" from a single Lighthouse run.
- Use lab data to find causes; use field data to judge success.
- Segment by device, connection, geography, and template.
- Record the date and tool version with every baseline.

---

## 3. LCP

LCP is the render time of the largest image or text block in the viewport.

### 3.1 Breakdown

| Subpart | What it covers | Typical fix |
| --- | --- | --- |
| TTFB | Request → first byte | CDN, caching, faster server, DB queries |
| Resource load delay | TTFB → LCP resource starts | Preload, `fetchpriority="high"`, remove render blockers |
| Resource load time | Download duration | Compress, resize, modern format, CDN |
| Render delay | Resource ready → painted | Unblock CSS/JS, font strategy, avoid hydration gates |

### 3.2 Fix checklist

- [ ] Identify the actual LCP element on mobile and desktop.
- [ ] Serve the LCP image at the rendered size (no 4000 px hero for 800 px).
- [ ] Use AVIF/WebP with fallbacks.
- [ ] Add `width`/`height` or `aspect-ratio`.
- [ ] Do **not** lazy-load the LCP image.
- [ ] `fetchpriority="high"` on the LCP image; do not preload everything.
- [ ] Inline critical CSS; defer non-critical CSS.
- [ ] Avoid render-blocking third-party scripts above the fold.
- [ ] Use `font-display: swap` and preload the primary font (subset).
- [ ] Reduce TTFB with caching/CDN and remove slow server work.
- [ ] Avoid client-side rendering the hero content.
- [ ] Check that consent banners/AB tests do not delay the hero.

### 3.3 Next.js specifics

- Use `next/image` with correct `sizes` and `priority` for the hero.
- Avoid `dynamic = "force-dynamic"` for static marketing pages.
- Prefer static/ISR for content that does not need per-request data.
- Keep client components small; push interactivity to leaves.
- Audit fonts with `next/font` (self-hosted, subset, swap).

---

## 4. INP

INP measures the latency from user interaction to the next painted frame,
covering the worst interaction (approximately).

### 4.1 Causes

- Long JavaScript tasks blocking the main thread.
- Hydration of large client components.
- Heavy event handlers doing synchronous work.
- Third-party tags (analytics, chat, A/B testing, ads).
- Large DOM updates and layout thrashing.
- Excessive polyfills or duplicate frameworks.

### 4.2 Fix checklist

- [ ] Break long tasks with `yield`, `setTimeout`, or `scheduler.yield`.
- [ ] Debounce/throttle high-frequency handlers.
- [ ] Move heavy computation to a Web Worker.
- [ ] Code-split below-the-fold and modal-only components.
- [ ] Defer non-critical third parties until interaction/idle.
- [ ] Avoid state updates that re-render huge trees.
- [ ] Virtualise long lists.
- [ ] Keep DOM size reasonable (< ~1,500 nodes where practical).
- [ ] Test on a mid-range mobile device with CPU throttling.
- [ ] Use the `web-vitals` library to collect real INP by template.

---

## 5. CLS

CLS scores unexpected layout shifts.

### 5.1 Causes

- Images/iframes/video without dimensions.
- Web fonts swapping with different metrics.
- Ads, embeds, cookie banners injected late.
- Dynamic content inserted above existing content.
- Animations using layout properties (`top`, `height`) instead of transforms.
- Skeleton loaders with different dimensions than final content.

### 5.2 Fix checklist

- [ ] Set `width`/`height` or `aspect-ratio` on all media.
- [ ] Reserve space for ads/embeds/banners.
- [ ] Use `font-size-adjust` or metric-compatible fallback fonts.
- [ ] Animate with `transform`/`opacity`.
- [ ] Insert new UI below the viewport or in reserved containers.
- [ ] Avoid late-injected "promo" bars above the header.
- [ ] Test with slow network and cold cache.

---

## 6. Images

- Serve responsive `srcset`/`sizes`.
- Compress aggressively; prefer AVIF then WebP.
- Strip metadata where appropriate.
- Use CDN transforms for on-demand resizing.
- Lazy-load below the fold; eager/high priority for the hero.
- Use CSS `object-fit` rather than oversized assets.
- Avoid base64 for large images.
- Serve SVG for icons/logos, but optimise and sanitise it.
- Check that image CDNs do not strip `Cache-Control` or add redirects.

---

## 7. Fonts

- Self-host or use a performant provider.
- Subset to used characters/languages.
- `font-display: swap` (or `optional` for unstable networks).
- Preload only the font used above the fold.
- Avoid loading 5 weights/styles; use variable fonts.
- Match fallback metrics to reduce CLS.
- Do not block rendering on a font for body text.

---

## 8. CSS and JavaScript

- Remove unused CSS; scope component styles.
- Inline critical CSS for the first viewport.
- Defer non-critical CSS.
- Ship modern JS; avoid legacy transpilation for modern browsers.
- Code-split by route and interaction.
- Tree-shake icon/animation libraries; import per icon.
- Avoid large polyfill bundles.
- Prefer server components/static HTML for content.
- Audit third-party scripts: each one needs an owner, purpose, and budget.
- Load analytics after consent and after the page is usable.

Budgets (starting points, adjust by market):

| Resource | Budget |
| --- | --- |
| Initial JS (compressed) | ≤ 170 KB |
| Initial CSS (compressed) | ≤ 50 KB |
| LCP image | ≤ 200 KB |
| Total initial requests | ≤ 50 |
| Third-party scripts | ≤ 3 critical |

---

## 9. Caching and delivery

- `Cache-Control: public, max-age=31536000, immutable` for hashed assets.
- HTML: `no-cache` or short `s-maxage` with revalidation, depending on freshness.
- Use a CDN with brotli/gzip and HTTP/2 or HTTP/3.
- Enable `stale-while-revalidate` where appropriate.
- Do not cache personalised/authenticated responses publicly.
- Set correct `Vary` headers (`Accept-Encoding`, locale if needed).
- Ensure CDN does not serve one locale/host for another.
- Preconnect only to origins actually used; avoid preconnect soup.

---

## 10. Measuring

### 10.1 Lab

```bash
# Lighthouse (install once)
npx lighthouse https://example.com --preset=desktop --view
npx lighthouse https://example.com --form-factor=mobile --throttling-method=simulate
```

Record: LCP, TBT, CLS, FCP, Speed Index, total bytes, request count. Run 3
times and use the median; do not tune to a single lucky run.

### 10.2 Field

- PageSpeed Insights for CrUX.
- Search Console → Core Web Vitals.
- RUM with `web-vitals`:

```js
import { onCLS, onINP, onLCP } from "web-vitals";

function report(metric) {
  navigator.sendBeacon("/api/vitals", JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    path: location.pathname,
  }));
}

onCLS(report); onINP(report); onLCP(report);
```

Only send after consent where required. Aggregate by template, device, and
connection; p75 is the decision metric.

---

## 11. Performance acceptance checks

- [ ] LCP element identified and optimised for mobile + desktop.
- [ ] LCP ≤ 2.5 s at p75 (field) or documented baseline + plan.
- [ ] INP ≤ 200 ms at p75; long tasks investigated.
- [ ] CLS ≤ 0.1; media dimensions reserved.
- [ ] No render-blocking third parties above the fold.
- [ ] Fonts subset, swapped, and preloaded only when needed.
- [ ] Images responsive and compressed.
- [ ] JS/CSS budgets met or exceeded with a written remediation plan.
- [ ] Static pages are not needlessly dynamic.
- [ ] CDN/caching headers correct for HTML and hashed assets.
- [ ] Field data source and date recorded.
- [ ] Before/after lab + field evidence saved.
