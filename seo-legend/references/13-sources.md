# Sources and freshness

Use primary sources. Secondary blogs are for ideas, not authority.

---

## 1. Google Search

| Topic | URL |
| --- | --- |
| Search Essentials | https://developers.google.com/search/docs/essentials |
| Technical requirements | https://developers.google.com/search/docs/essentials/technical |
| Spam policies | https://developers.google.com/search/docs/essentials/spam-policies |
| Helpful, people-first content | https://developers.google.com/search/docs/fundamentals/creating-helpful-content |
| How Search works | https://developers.google.com/search/docs/fundamentals/how-search-works |
| Title links | https://developers.google.com/search/docs/appearance/title-link |
| Snippets | https://developers.google.com/search/docs/appearance/snippet |
| Structured data intro | https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data |
| Structured data policies | https://developers.google.com/search/docs/appearance/structured-data/sd-policies |
| JavaScript SEO | https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics |
| Redirects | https://developers.google.com/search/docs/crawling-indexing/301-redirects |
| Canonicalisation | https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls |
| Localised versions (hreflang) | https://developers.google.com/search/docs/special/site-management/localize-your-site |
| Sitemaps | https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview |
| robots.txt | https://developers.google.com/search/docs/crawling-indexing/robots/intro |
| Crawl budget | https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget |
| Google crawlers | https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers |
| Search Console help | https://support.google.com/webmasters |
| Search Central blog | https://developers.google.com/search/blog |
| Quality rater guidelines | https://guidelines.raterhub.com/searchqualityevaluatorguidelines.pdf |

Structured data validators:

- Schema.org: https://schema.org/
- Schema Markup Validator: https://validator.schema.org/
- Rich Results Test: https://search.google.com/test/rich-results

---

## 2. Performance

| Topic | URL |
| --- | --- |
| Web Vitals | https://web.dev/articles/vitals |
| LCP | https://web.dev/articles/lcp |
| INP | https://web.dev/articles/inp |
| CLS | https://web.dev/articles/cls |
| Optimise LCP | https://web.dev/articles/optimize-lcp |
| Optimise INP | https://web.dev/articles/optimize-inp |
| Optimise CLS | https://web.dev/articles/optimize-cls |
| web-vitals library | https://github.com/GoogleChrome/web-vitals |
| Lighthouse | https://developer.chrome.com/docs/lighthouse/overview |
| CrUX | https://developer.chrome.com/docs/crux |
| PageSpeed Insights | https://pagespeed.web.dev/ |

---

## 3. International and accessibility

| Topic | URL |
| --- | --- |
| WCAG 2.2 | https://www.w3.org/TR/WCAG22/ |
| WAI tutorials | https://www.w3.org/WAI/tutorials/ |
| hreflang (Google) | https://developers.google.com/search/docs/special/site-management/localize-your-site |

---

## 4. AI search

| Topic | URL |
| --- | --- |
| llms.txt proposal (v2) | https://llmstxt.org/ |
| llms.txt changes | https://llmstxt.org/changes.html |
| Lighthouse agentic browsing / llms.txt | https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt |
| OpenAI bots | https://platform.openai.com/docs/bots |
| Google crawlers / Google-Extended | https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers |

Note: `llms.txt` is a community proposal, not a ratified standard. Never claim
it guarantees citations or rankings.

---

## 5. Analytics and privacy

| Topic | URL |
| --- | --- |
| GA4 documentation | https://support.google.com/analytics |
| Consent mode | https://developers.google.com/tag-platform/security/guides/consent |
| Meta Pixel | https://developers.facebook.com/docs/meta-pixel/ |
| ICO cookies guidance (UK) | https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/ |
| EDPB consent guidance | https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en |

Jurisdiction-specific legal review is mandatory; this is engineering guidance.

---

## 6. Bing and other engines

| Topic | URL |
| --- | --- |
| Bing Webmaster Tools | https://www.bing.com/webmasters |
| Bing Webmaster guidelines | https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a |
| Yandex Webmaster | https://webmaster.yandex.com/ |
| Baidu Search Resource Platform | https://ziyuan.baidu.com/ |

---

## 7. Framework documentation

| Framework | URL |
| --- | --- |
| Next.js metadata | https://nextjs.org/docs/app/api-reference/functions/generate-metadata |
| Next.js sitemap | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap |
| Next.js robots | https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots |
| Next.js images | https://nextjs.org/docs/app/api-reference/components/image |
| WordPress developer docs | https://developer.wordpress.org/ |
| Yoast SEO | https://yoast.com/wordpress/plugins/seo/ |
| Rank Math | https://rankmath.com/kb/ |
| Shopify SEO | https://help.shopify.com/en/manual/promoting-marketing/seo |
| Apache mod_rewrite | https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html |
| NGINX docs | https://nginx.org/en/docs/ |

---

## 8. Freshness policy

Search features, rich-result eligibility, and AI crawler policies change.

- Re-check the primary source before making a claim about eligibility.
- Record the date of every audit and source snapshot.
- Review this skill quarterly; update `SKILL.md` and references when policies
  change.
- If a source conflicts with this skill, **the source wins**. Note the change in
  the mission report.

### 8.1 How to verify a claim

1. Find the primary documentation page.
2. Check the "last updated" date.
3. Quote the exact requirement, not a summary from memory.
4. Test on a real URL where possible.
5. Record the source URL + date in the evidence ledger.

Do not cite a blog when the official documentation exists. Do not cite an
official page you did not open.
