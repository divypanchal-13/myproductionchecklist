# Authoritative sources

Use primary sources only. This is an allowed-source index, not a claim that every page was consulted for every audit. In the report's **Sources consulted (official only)** subsection, list only the sources actually used, the access date, and the claim each supported.

**Index last reviewed:** 2026-10-26 (UTC)

## Source hierarchy

1. Binding standards and specifications: W3C, IETF/RFC Editor, sitemaps.org.
2. The framework or vendor's current official documentation for the behavior being assessed.
3. OWASP application-security guidance and verification standards.
4. Google Search Central and web.dev for Google-specific crawling, SEO, consent, and performance guidance.
5. Official integration-provider documentation for the exact product and version in use.

When sources conflict, follow the relevant standard for the claim, or document the conflict and the least risky interpretation. Framework documentation is authoritative for that framework, not for legal compliance. Privacy and accessibility conclusions require qualified review; this skill is not a certification.

Do not cite search-result snippets, generated summaries, unofficial tutorials, affiliate posts, content farms, or undated blog posts. Do not treat a vendor marketing claim as proof that a control is configured effectively.

## Frameworks, runtimes, and application libraries

- Next.js production checklist — https://nextjs.org/docs/app/guides/production-checklist
- Next.js environment variables — https://nextjs.org/docs/app/guides/environment-variables
- React documentation — https://react.dev/learn
- Node.js security best practices — https://nodejs.org/learn/getting-started/security-best-practices
- Express security best practices — https://expressjs.com/en/advanced/best-practice-security/
- Express performance best practices — https://expressjs.com/en/advanced/best-practice-performance/
- Express behind proxies — https://expressjs.com/en/guide/behind-proxies/
- TypeScript compiler options reference — https://www.typescriptlang.org/tsconfig/
- Zod documentation — https://zod.dev/
- OpenFeature documentation — https://openfeature.dev/
- Nodemailer documentation — https://nodemailer.com/

## Security and privacy

- OWASP Application Security Verification Standard (ASVS) — https://asvs.owasp.org/
- OWASP Top 10 — https://owasp.org/projects/top-ten
- OWASP Cheat Sheet Series — https://cheatsheetseries.owasp.org/
- OWASP Secrets Management Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- OWASP Next.js Security Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Nextjs_Security_Cheat_Sheet.html

Use the OWASP cheat-sheet index for authentication, authorization, session management, CSRF, input validation, file upload, SSRF, SQL injection, XSS, password storage, logging, and CSP controls. Verify the exact sheet title and current guidance before citing it.

Do not claim legal compliance under GDPR, UK GDPR, ePrivacy, CCPA/CPRA, or another regime from technical checks alone. Name the applicable jurisdiction as a developer/legal decision when it affects consent, retention, transfers, or user rights.

## Accessibility and UI

- W3C WCAG 2.2 Recommendation — https://www.w3.org/TR/WCAG22/
- W3C WCAG 2.2 Quick Reference — https://www.w3.org/WAI/WCAG22/quickref/
- W3C WAI-ARIA Authoring Practices Guide — https://www.w3.org/WAI/ARIA/apg/

Use the quick reference to identify applicable Level AA success criteria and the Authoring Practices for custom widget behavior. Automated tools catch only a subset of issues; manual keyboard and screen-reader checks are still required.

## SEO, crawling, structured data, and sitemaps

- Google Search Central SEO starter guide — https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google structured data introduction — https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google JavaScript SEO basics — https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- sitemaps.org protocol — https://www.sitemaps.org/protocol.html
- RFC 9309: Robots Exclusion Protocol — https://www.rfc-editor.org/rfc/rfc9309.html
- llms.txt proposal — https://llmstxt.org/

`llms.txt` is an advisory community proposal. It is not a W3C or IETF standard and does not guarantee crawler support or ingestion. Its absence is not a production blocker; if present, validate it for accuracy and do not use it to justify hiding important public content.

Google-specific guidance is not universal search-engine law. When the product depends on other search engines or AI crawlers, consult their current official documentation and record any divergent requirements.

## Analytics, consent, and tags

- Google consent mode — https://developers.google.com/tag-platform/security/guides/consent

Consent obligations depend on jurisdiction, product behavior, vendor role, and legal advice. Verify that non-essential tags are actually blocked before consent where required, and that withdrawal takes effect. A consent banner alone is not evidence of compliant tag behavior.

## Forms, email, bot defense, and CAPTCHA

- Nodemailer documentation — https://nodemailer.com/
- Cloudflare Turnstile server-side validation — https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- Google reCAPTCHA verification — https://developers.google.com/recaptcha/docs/verify
- hCaptcha documentation — https://docs.hcaptcha.com/
- RFC 7208: Sender Policy Framework (SPF) — https://www.rfc-editor.org/rfc/rfc7208.html
- RFC 6376: DomainKeys Identified Mail (DKIM) — https://www.rfc-editor.org/rfc/rfc6376.html
- RFC 7489: Domain-based Message Authentication, Reporting, and Conformance (DMARC) — https://www.rfc-editor.org/rfc/rfc7489.html

Check the provider's current documentation for token lifetime, hostname/action checks, test keys, accessibility behavior, and server-side verification. CAPTCHA is an abuse-control aid, not a substitute for server validation, rate limits, authorization, or idempotency.

## Performance

- web.dev Core Web Vitals — https://web.dev/articles/vitals
- Next.js production checklist — https://nextjs.org/docs/app/guides/production-checklist
- Express performance best practices — https://expressjs.com/en/advanced/best-practice-performance.html

Core Web Vitals thresholds and field-measurement methodology can change. State the measurement source, date, device class, and percentile rather than presenting a single lab score as field performance.

## Testing, CI/CD, and operations

- Playwright best practices — https://playwright.dev/docs/best-practices
- GitHub Actions secure use — https://docs.github.com/en/actions/reference/security/secure-use

Use the repository's own documented test/deploy process first. Platform documentation for the actual host, database, mail provider, error tracker, and CI system is required before claiming an operational control is configured.

## Reliability cautions

- A passing build verifies compilation, not authorization, privacy, accessibility, crawlability, email deliverability, backups, or rollback.
- Framework security defaults do not prove the deployed application is secure or correctly configured.
- Public page checks are not a penetration test.
- An absent finding is not proof that no vulnerability exists.
- A vendor's compliance badge does not prove the application's legal or security posture.
- When evidence is unavailable, report `UNVERIFIED` and list the exact evidence needed.
