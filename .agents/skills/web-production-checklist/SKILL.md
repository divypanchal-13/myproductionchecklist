---
name: web-production-checklist
description: Audits JavaScript, TypeScript, React, Next.js, Node.js, and Express applications against a comprehensive production-readiness checklist. Generates an evidence-based Markdown audit report and waits for explicit user approval before implementing fixes.
---

# Web Production Checklist

Act as a production-readiness auditor first and a careful remediation engineer second. This skill is **audit-first**: do not change application code until the user gives explicit, scoped approval to implement specific findings or batches.

The baseline contains **248 controls** across environment/configuration, forms/email, SEO, analytics/privacy, UI/accessibility, code quality, API hardening, testing, security, performance, deployment/operations, and release readiness. Apply every control, adapt the evidence method to the stack, and never silently drop an item.

## 1. Mandatory operating contract

1. **Stage 1 is read-only.** Inspect the repository and produce exactly one new artifact: `PRODUCTION_AUDIT_REPORT.md` at the audited project root. Do not modify or reformat application source, tests, configuration, lockfiles, package manifests, generated assets, or data. Do not install or upgrade packages. Do not create scaffolds or run codemods.
2. **Do not deploy or operate production.** Never deploy, run destructive migrations, delete data, rotate credentials, change DNS, alter cloud resources, submit real forms, or run intrusive security scans or load tests. Never disable a security control to make a check pass.
3. **Never expose secrets.** Do not print, log, commit, or copy a secret value into the report. Record that a secret exists and where, with the value redacted. This includes `.env` values, tokens, private keys, connection strings, SMTP credentials, CAPTCHA secrets, and analytics keys.
4. **No implementation without literal approval.** Approval must name the findings or batches to implement. "Review the report", "looks good", a thumbs-up, or approval of the audit itself does not authorize code changes. If approval is ambiguous, stop and ask.
5. **Evidence over inference.** Every `PASS` requires verifiable evidence. A successful build proves only that the build completed; it does not prove production readiness. Use `UNVERIFIED` when evidence cannot be obtained.
6. **Preserve the audit baseline.** The initial matrix, evidence, and counts are the historical record. Stage 2 may change a current status only after re-verification, and it must append a dated status-change log that retains the original status and evidence. Never rewrite history to make remediation look cleaner than it was.
7. **Official sources only.** If research is necessary, use official framework or vendor documentation, W3C, IETF/RFC Editor, OWASP, Google Search Central, web.dev, sitemaps.org, or the llms.txt proposal. Do not rely on random blogs, content farms, or unsourced claims. See `references/authoritative-sources.md`.
8. **Stay in scope and authorized.** Audit only the repository and URLs the user identifies. Do not attempt credential attacks, fuzzing, exploitation, data exfiltration, or private endpoint discovery. Public, unauthenticated `GET`/`HEAD` checks are allowed only when the user has asked for an audit of that site.
9. **No destructive fallbacks.** If a check needs unavailable credentials, a real inbox, a payment sandbox, or admin access, mark it `UNVERIFIED` and list the required developer action. Never fabricate a pass.
10. **Do not invent compliance.** An audit is not legal advice or a certification. Privacy, consent, accessibility, and security conclusions must state assumptions and require owner review.

## 2. Stage 1 — Read-only production audit

### 2.1 Scope and reconnaissance

1. Confirm the project root, deployable application(s), framework, package manager, runtime, and whether this is a monorepo. If several applications could be in scope, ask which one(s) to audit before producing readiness conclusions. Do not blend unrelated applications into one verdict.
2. Record the current commit, branch, and worktree cleanliness. Never reset, stash, clean, or commit user changes.
3. Read repository instructions and high-signal files before judging anything:
   - `package.json`, lockfiles, workspace files, `engines`, `.nvmrc`, `.node-version`, package-manager pins
   - framework config, `tsconfig*.json`, lint/format config, build config, middleware/proxy config
   - route directories, API handlers, server actions, auth/session code, database access, env modules
   - `.env.example` and other non-secret examples; never open or print secret values unnecessarily
   - CI/CD workflows, Dockerfiles, deployment manifests, infrastructure-as-code, operational docs
   - test configs, existing reports, monitoring/error-tracking setup, privacy/legal pages
4. Build a map of public and private routes, forms, authentication boundaries, external integrations, jobs/webhooks, and data stores. This map drives evidence collection.
5. Confirm whether a deployed URL is in scope. If not, runtime/deployment items become `UNVERIFIED` or, when a feature truly cannot exist, `NOT_APPLICABLE` with a reason.
6. Inspect existing artifacts such as CI logs, test reports, Lighthouse exports, and security scan output supplied by the user. Their provenance and age must be stated.

### 2.2 Read-only evidence collection

Use non-mutating commands and file reads. Typical safe commands include `git status`, `git log`, `rg`, `Get-ChildItem`, and reading configuration or source files. Do **not** run installs, builds, tests, migrations, seed scripts, or dev servers during Stage 1 because they can write artifacts, mutate a database, or execute untrusted code. If runtime verification is essential and cannot be deferred, ask for explicit permission and define the side effects first.

Public, read-only HTTP checks may cover status codes, security headers, canonical tags, `robots.txt`, sitemaps, redirect chains, and public page markup. Keep requests minimal, identify yourself where appropriate, honor rate limits, and never submit forms, authenticate, crawl aggressively, or probe for vulnerabilities.

For each checklist item, capture evidence as a root-relative file path plus line number where possible (for example `src/lib/env.ts:14-27`), an exact command/result summary, or a URL and UTC timestamp. Evidence must be specific enough for another developer to reproduce the finding.

### 2.3 Classification

- Review all 248 controls. Mark every item with one allowed status and one severity.
- For conditional `(C)` items, first decide whether the condition is true. If false, use `NOT_APPLICABLE` and state why. If true, audit normally.
- Use `NEEDS_DECISION` when the gap is primarily a product, legal, or business choice (for example consent jurisdiction, retention period, or whether to support a legacy browser), not when a required security control is simply absent.
- Highlight any exposed secret immediately as `P0` in the Executive Summary, but **redact the value** and do not repeat it elsewhere.
- Do not mark the whole project ready because one category passed. Readiness is a release decision made from all categories, open severities, unverified controls, and accepted risks.

## 3. Status and severity vocabulary

Use these values exactly. Do not substitute "OK", "N/A", "TODO", "unknown", or custom labels.

| Status | Meaning | Evidence requirement |
| --- | --- | --- |
| `PASS` | Control is implemented and verified for the audited scope. | Cite the implementation and how it was verified. |
| `PARTIAL` | Some control exists, but a material part is incomplete or inconsistent. | Cite what exists and what is missing. |
| `FAIL` | Control exists but violates the requirement or is demonstrably ineffective. | Cite the behavior/config that contradicts the requirement. |
| `MISSING` | No implementation was found where one is expected. | Cite the relevant files/searches and why absence is credible. |
| `UNVERIFIED` | Implementation or runtime behavior could not be confirmed with available access/evidence. | State exactly what evidence or access is needed. |
| `NEEDS_DECISION` | A product/legal/business choice is required before the control can be assessed or implemented. | State the decision, options, recommendation, and owner. |
| `NOT_APPLICABLE` | The control does not apply because the feature/stack/jurisdiction is absent. | State the factual reason; conditional items must explain the failed trigger. |

| Severity | Definition |
| --- | --- |
| `P0` | Active or highly likely catastrophic risk: exposed secret, auth bypass, injection, cross-tenant data exposure, destructive data risk, or payment corruption. Blocks release. |
| `P1` | Production blocker: a required security/operational control is missing, or a core user/business flow is unsafe or unreliable. Blocks release until fixed or explicitly accepted by the accountable owner. |
| `P2` | Material risk or quality gap that should be scheduled before or shortly after launch. Requires an owner and documented acceptance if deferred. |
| `P3` | Lower-risk hardening, polish, or maintainability improvement. Can be planned without blocking release. |

Default severities appear with each checklist item. Adjust a severity only when the concrete context makes the consequence meaningfully higher or lower; explain the adjustment in **Problem / Risk**. Never downgrade a finding merely to make a release pass.

## 4. Complete baseline checklist

The IDs and controls below are stable. Do not renumber, delete, or silently replace them. If new requirements are supplied later, append new IDs at the end of the relevant category and document the addition. A `(C)` suffix means conditional: assess the trigger before assigning a status. All items apply to static sites, SPAs, and full-stack apps only to the extent the feature exists; absent features should normally be `NOT_APPLICABLE`, not automatic passes.

### 4.1 ENV — Environment, configuration, secrets, and feature flags

| ID | Checklist item | Default severity |
| --- | --- | --- |
| ENV-001 | A supported Node.js LTS runtime is pinned and used consistently in local development, CI, and production. | P1 |
| ENV-002 | The package manager is pinned (for example `packageManager`) and its lockfile is present and tracked. | P2 |
| ENV-003 | A clean install from the committed lockfile succeeds reproducibly; hidden local dependencies are not required. | P1 |
| ENV-004 | Required environment variables are schema-validated at startup/build (for example with Zod) with fail-closed errors. | P1 |
| ENV-005 | `.env.example` documents every required and optional variable with safe placeholders and no live values. | P2 |
| ENV-006 | No credentials, private keys, tokens, or secrets exist in the repository, built client assets, logs, or client-visible environment variables. | P0 |
| ENV-007 | Server-only secrets cannot leak through prefixes or bundler rules such as `NEXT_PUBLIC_` or `VITE_`, or through shared config modules. | P0 |
| ENV-008 | Local, preview/staging, and production configuration is separated, with distinct credentials and data stores. | P1 |
| ENV-009 | Missing, empty, or placeholder production values fail startup/build; unsafe silent fallbacks are absent. | P1 |
| ENV-010 | Build-time versus runtime environment semantics are understood, documented, and compatible with the deployment platform. | P2 |
| ENV-011 | Feature flags have an owner, purpose, default, creation date, expiry/review date, and documented kill switch. | P2 |
| ENV-012 | Security- or revenue-critical feature flags are evaluated server-side and fail closed when unavailable. | P1 |
| ENV-013 | Configuration changes are auditable, access-controlled, and reproducible from source or platform configuration. | P2 |
| ENV-014 | Secret ownership, rotation, revocation, and emergency replacement are documented and testable. | P1 |
| ENV-015 | Development, debug, verbose-logging, and test-only switches are disabled in production. | P2 |
| ENV-016 | Runtime parity is documented for Node version, native dependencies, time zone, locale, and architecture. | P2 |

### 4.2 FORM — Forms, validation, email, CAPTCHA, and submission states

| ID | Checklist item | Default severity |
| --- | --- | --- |
| FORM-001 | Every form validates all input server-side; client validation is treated only as a UX enhancement. | P1 |
| FORM-002 | Client and server validation use shared or demonstrably equivalent rules/schemas and cannot drift silently. | P2 |
| FORM-003 | Field type, length, range, enum, encoding, and format limits are enforced server-side before processing. | P1 |
| FORM-004 | Unknown or extra fields are rejected or stripped according to an explicit schema policy. | P2 |
| FORM-005 | Validation errors are specific, field-associated, screen-reader accessible, and focusable without leaking sensitive details. | P2 |
| FORM-006 | Labels, required indicators, input types, autocomplete hints, and instructions are accessible and not color-only. | P2 |
| FORM-007 | Submission shows a loading state, locks the control, and prevents duplicate submissions without losing input. | P2 |
| FORM-008 | Success state clearly confirms the outcome and tells the user what happens next. | P2 |
| FORM-009 | Failure state preserves input, explains recovery, and offers a safe retry path. | P2 |
| FORM-010 | Timeouts and network failures are handled explicitly; the UI cannot spin forever or silently abandon a request. | P2 |
| FORM-011 | Cookie-authenticated form mutations are protected against CSRF with a verified anti-CSRF mechanism. | P1 |
| FORM-012 | Submission endpoints apply server-side rate limits and abuse controls keyed appropriately to IP, account, and form. | P1 |
| FORM-013 | CAPTCHA or bot defense is risk-based, accessible, privacy-disclosed, and never the only abuse control. | P2 |
| FORM-014 | CAPTCHA tokens are verified server-side with the secret server-only; token, action, hostname, and score (where supported) are checked. | P1 |
| FORM-015 | SMTP/email transport configuration is validated, authenticated, encrypted, and observable for failures. | P1 |
| FORM-016 | Sending domains publish valid SPF, DKIM, and DMARC records; `From` and `Reply-To` are deliberate and consistent. | P1 |
| FORM-017 | SMTP failures are classified and logged safely; users receive useful non-sensitive errors and support guidance. | P2 |
| FORM-018 | User-controlled values cannot inject email headers or CRLF sequences, and recipients are constrained by policy. | P1 |
| FORM-019 | Email templates escape user data and generate correct, absolute links without untrusted markup execution. | P2 |
| FORM-020 | Submissions are persisted or delivered with retry, failure ownership, and alerting; messages are not silently lost. | P2 |
| FORM-021 | A privacy notice or consent is presented at collection where required, and marketing consent is separate from transactional processing. | P2 |
| FORM-022 | Honeypots or bot heuristics do not break assistive technology, autofill, password managers, or legitimate submissions. | P3 |
| FORM-023 | (C) File uploads are validated by content/type/size, given safe names, scanned or isolated as appropriate, and stored outside executable paths. | P1 |
| FORM-024 | (C) Payments and other critical mutations are idempotent, verified against the provider, and reconciled; client success alone is not proof. | P1 |

### 4.3 SEO — Metadata, structured data, sitemaps, robots, and crawlability

| ID | Checklist item | Default severity |
| --- | --- | --- |
| SEO-001 | Every indexable page has a unique, descriptive title and meta description aligned with visible content. | P2 |
| SEO-002 | Canonical URLs are self-referential on canonical pages and consolidate duplicates without pointing at unrelated pages. | P2 |
| SEO-003 | Metadata base, canonical URLs, and social URLs use the production domain and HTTPS scheme, never localhost or preview hosts. | P2 |
| SEO-004 | Open Graph and Twitter/X card fields are complete, unique, and use valid absolute image URLs. | P2 |
| SEO-005 | Favicons, app icons, web manifest, and theme color exist and are valid for supported browsers and devices. | P3 |
| SEO-006 | Heading structure is semantic and internal links use descriptive anchor text rather than generic labels. | P3 |
| SEO-007 | The sitemap is current, uses absolute HTTPS URLs, and includes only canonical, indexable public pages. | P2 |
| SEO-008 | `robots.txt` references the sitemap, and both resources return the expected status with correct content types. | P2 |
| SEO-009 | Robots rules allow necessary rendering assets and block private areas without accidentally blocking the whole site. | P2 |
| SEO-010 | Staging/preview deployments and private routes require authentication and return `noindex` where appropriate. | P1 |
| SEO-011 | `noindex` is applied intentionally to utility, duplicate, or private pages and is verified in rendered markup and headers. | P2 |
| SEO-012 | JSON-LD structured data is syntactically valid, uses required properties, and matches visible page content. | P2 |
| SEO-013 | Schema types are appropriate to the business and content; no deceptive or irrelevant rich-result markup is used. | P3 |
| SEO-014 | (C) Breadcrumb navigation and matching breadcrumb structured data are consistent and usable. | P3 |
| SEO-015 | (C) Localized pages have reciprocal hreflang annotations, correct localized canonicals, and no mixed-language metadata. | P2 |
| SEO-016 | Redirects are intentional, single-hop, loop-free, and consistent about trailing slashes and case. | P2 |
| SEO-017 | Removed content returns a real `404` or `410`; missing and error pages never return soft-404 success responses. | P2 |
| SEO-018 | (C) Paginated listings use crawlable URLs, stable ordering, and appropriate canonical or pagination semantics. | P3 |
| SEO-019 | `llms.txt`, if present, is accurate and non-deceptive; it is treated as an advisory community proposal, not a required or guaranteed standard. | P3 |
| SEO-020 | Search Console and Bing Webmaster verification exist if applicable, with indexing/coverage monitoring and an owner. | P2 |
| SEO-021 | Social preview images are absolute, publicly accessible, correctly sized, and safe with overlaid text or cropping. | P2 |
| SEO-022 | A redirect map or permalink policy exists for renamed routes, and broken inbound links are monitored. | P3 |

### 4.4 AN — Analytics, consent, and privacy

| ID | Checklist item | Default severity |
| --- | --- | --- |
| AN-001 | All analytics, advertising, tagging, session-replay, and heatmap tools are inventoried with owner, purpose, and data collected. | P3 |
| AN-002 | Non-essential analytics and advertising scripts are blocked until a valid consent choice where law/policy requires consent. | P1 |
| AN-003 | Consent UI offers accept and reject with equal prominence, granular purposes where appropriate, and no dark patterns. | P2 |
| AN-004 | Consent is persisted, versioned, displayed, and easy to withdraw or change later. | P2 |
| AN-005 | Tracking defaults deny non-essential storage before choice where required; no tags fire pre-consent. | P1 |
| AN-006 | Google Consent Mode or an equivalent consent framework is configured and tested for defaults, updates, and denied-state behavior. | P1 |
| AN-007 | Analytics event names, URLs, properties, referrers, and custom dimensions contain no PII, credentials, or sensitive data. | P0 |
| AN-008 | Event taxonomy, naming, versioning, and ownership are documented; duplicate or conflicting events are absent. | P2 |
| AN-009 | Conversion events are validated end-to-end, fire once per conversion, and use deduplication where both client and server send them. | P2 |
| AN-010 | Data retention and deletion settings are configured in each analytics/CRM/email vendor. | P2 |
| AN-011 | IP anonymization, regional collection, consent-region behavior, and data residency choices are documented and configured. | P2 |
| AN-012 | The privacy notice accurately names tools, cookie categories, purposes, lawful bases, retention, and user rights. | P1 |
| AN-013 | The cookie inventory/policy matches actual cookies, storage keys, vendors, purposes, and durations. | P2 |
| AN-014 | (C) Processor agreements, vendor terms, and international transfer safeguards are recorded for services processing personal data. | P2 |
| AN-015 | A documented data-subject request path covers analytics, CRM, email, and support systems, including deletion/export. | P2 |
| AN-016 | Analytics or consent-tool failure is non-blocking and does not prevent pages or critical flows from working. | P3 |
| AN-017 | (C) Advertising pixels and conversion APIs fire only after the required consent, protect server secrets, and have an owner. | P1 |
| AN-018 | Analytics environments and properties are separated; test, staging, and internal traffic are excluded from production reporting. | P3 |

### 4.5 UI — Interface, responsive behavior, accessibility, links, navigation, and content

| ID | Checklist item | Default severity |
| --- | --- | --- |
| UI-001 | Core layouts remain usable from 320 CSS pixels through large screens without clipping, overlap, or unintended horizontal scrolling. | P2 |
| UI-002 | Interactive targets meet WCAG 2.2 AA minimum target size (at least 24 by 24 CSS pixels) and are spaced to avoid accidental activation. | P2 |
| UI-003 | At 200% text zoom and 320 CSS pixels wide, content reflows and no information or functionality is lost. | P2 |
| UI-004 | All functionality is operable by keyboard alone, with no keyboard traps and correct activation semantics. | P1 |
| UI-005 | Focus is visible, follows a logical order, and is not obscured by sticky headers, banners, or overlays. | P2 |
| UI-006 | Pages expose landmarks, a skip link, and a coherent heading structure that supports navigation. | P2 |
| UI-007 | Focus is intentionally moved or restored on route changes, dialogs, menus, and asynchronous content updates. | P2 |
| UI-008 | Native semantic elements are preferred; custom widgets expose correct roles, names, states, and properties without redundant ARIA. | P2 |
| UI-009 | ARIA usage is valid, necessary, and tested; incorrect roles or missing accessible names do not suppress native semantics. | P2 |
| UI-010 | Informative images have useful alternatives, decorative images are ignored by assistive technology, and complex images have descriptions. | P2 |
| UI-011 | Form labels, instructions, errors, and grouping are programmatically associated and usable with autofill and assistive technology. | P2 |
| UI-012 | Text and essential UI contrast meet WCAG AA, and color is never the sole indicator of meaning or state. | P2 |
| UI-013 | Dialogs have accessible names, contain focus while open, close with Escape where appropriate, and restore focus to the trigger. | P2 |
| UI-014 | Menus, comboboxes, tabs, disclosure widgets, and other custom controls follow WAI-ARIA Authoring Practices and support expected keys. | P3 |
| UI-015 | Auto-playing motion can be paused/stopped, and `prefers-reduced-motion` is honored for non-essential animation. | P2 |
| UI-016 | (C) Prerecorded media has captions/transcripts, controls are keyboard accessible, and audio does not autoplay unexpectedly. | P2 |
| UI-017 | The document language is correct, and page titles meaningfully change for client-side navigation. | P2 |
| UI-018 | Links and buttons communicate purpose; dead links are absent, and unexpected new-tab/external behavior is disclosed. | P2 |
| UI-019 | Navigation is consistent across pages, the current location is indicated, and logo/home behavior is predictable. | P2 |
| UI-020 | 404, 500, offline, and maintenance states are helpful, don't leak internals, and provide a route back to safety. | P2 |
| UI-021 | Loading, empty, partial, retry, and error states are designed and implemented for asynchronous data. | P2 |
| UI-022 | (C) Content revealed on hover/focus is dismissible, hoverable, and persistent enough to use without losing it. | P2 |
| UI-023 | Orientation is not restricted unnecessarily, and increased text spacing does not clip or overlap content. | P2 |
| UI-024 | A WCAG 2.2 AA audit combines automated checks with manual keyboard and screen-reader review of critical flows. | P1 |

### 4.6 CODE — JavaScript/TypeScript quality, React correctness, and optimization

| ID | Checklist item | Default severity |
| --- | --- | --- |
| CODE-001 | TypeScript strictness is enabled and the production type-check passes without unchecked escape hatches. | P2 |
| CODE-002 | `any`, non-null assertions, `@ts-ignore`, and unsafe casts are rare, localized, and justified. | P3 |
| CODE-003 | Lint and formatting configurations exist, are maintained, and are not bypassed by global disables. | P2 |
| CODE-004 | Lint, format, type-check, tests, and the production build run in CI and are required before merge or release. | P2 |
| CODE-005 | Unused dependencies, dead code, orphaned files, and abandoned feature branches are removed with evidence. | P3 |
| CODE-006 | Environment, API, and configuration boundaries are typed and validated rather than accessed ad hoc. | P2 |
| CODE-007 | External or untrusted data is validated at runtime at every boundary before being trusted by typed code. | P1 |
| CODE-008 | Errors are handled deliberately; exceptions and promise rejections are not swallowed or converted into false success. | P2 |
| CODE-009 | Async effects clean up subscriptions/timers, use cancellation where appropriate, and avoid stale state updates. | P2 |
| CODE-010 | Server/client boundaries are explicit, `"use client"` is minimized, and server-only code cannot enter client bundles. | P1 |
| CODE-011 | SSR/hydration is free of browser-only globals during render, unstable markup, and mismatch errors in production logs. | P2 |
| CODE-012 | Route-level error boundaries, not-found handling, loading states, and suspense/fallback paths exist. | P2 |
| CODE-013 | Bundle composition is analyzed; accidental large dependencies, duplicate libraries, and unused client code are excluded. | P2 |
| CODE-014 | Heavy widgets and below-the-fold modules are code-split or lazily loaded without breaking navigation or accessibility. | P3 |
| CODE-015 | Dependencies are supported, deliberately pinned, license-reviewed, and free of known critical vulnerabilities that lack mitigation. | P2 |
| CODE-016 | (C) Third-party scripts are reviewed, minimized, delayed or consent-gated where appropriate, and assigned an owner. | P2 |
| CODE-017 | `eval`, `new Function`, unsafe dynamic code execution, and uncontrolled `dangerouslySetInnerHTML` or equivalent sinks are absent. | P1 |
| CODE-018 | Imports are acyclic, build warnings are triaged, and production builds complete without unresolved warnings. | P2 |
| CODE-019 | Source maps and error symbolication are configured securely; maps are not publicly exposed when they reveal source or secrets. | P2 |
| CODE-020 | Package scripts are documented and safe; destructive, deploy, or infrastructure commands are not the default scripts. | P3 |
| CODE-021 | (C) Monorepo package boundaries, shared configs, and build outputs are consistent and don't leak app-specific secrets. | P2 |
| CODE-022 | Production code does not emit sensitive or noisy console/debug output, including tokens, PII, or server internals. | P2 |
| CODE-023 | Dates, time zones, numbers, currency, and locale formatting use consistent, tested utilities and stable server/client results. | P2 |
| CODE-024 | React keys are stable for dynamic lists, and derived state/effects are not used where direct rendering or computation is safer. | P3 |

### 4.7 API — Node.js and Express backend hardening

| ID | Checklist item | Default severity |
| --- | --- | --- |
| API-001 | The Node.js runtime is a supported LTS line with current security patches in development and production. | P1 |
| API-002 | Dependencies are pinned, continuously scanned, and have no unmitigated critical/high advisories on reachable paths. | P1 |
| API-003 | Express runs with production settings, disables fingerprinting such as `x-powered-by`, and avoids development middleware in production. | P2 |
| API-004 | Security headers are set deliberately, including CSP, HSTS, `nosniff`, framing protection, and referrer policy where relevant. | P1 |
| API-005 | TLS is enforced end-to-end; HTTP redirects to HTTPS; secure cookies are used; proxy trust is configured correctly. | P1 |
| API-006 | CORS uses an explicit origin allowlist, handles preflight correctly, and never combines wildcard origins with credentials. | P1 |
| API-007 | Request body, header, URL, query, JSON depth, and execution time limits prevent resource exhaustion. | P1 |
| API-008 | All request inputs are validated server-side and database queries are parameterized or safely ORM-bound. | P0 |
| API-009 | Authentication verifies tokens/sessions with correct algorithms, issuer/audience, expiry, and revocation behavior. | P1 |
| API-010 | Every route enforces object- and action-level authorization; users cannot access another tenant's or user's records by changing IDs. | P0 |
| API-011 | Authentication, forms, search, and expensive endpoints have layered rate limits and abuse monitoring. | P1 |
| API-012 | Cookie-authenticated state-changing routes have CSRF protection that cannot be bypassed by alternate methods or routes. | P1 |
| API-013 | Cookies use appropriate `HttpOnly`, `Secure`, `SameSite`, path, domain, expiry, and prefix settings for their purpose. | P1 |
| API-014 | (C) Outbound requests validate URLs/hosts, block private/link-local metadata addresses, constrain redirects, and prevent SSRF. | P1 |
| API-015 | (C) Uploads are validated and stored outside the webroot or in controlled object storage with safe delivery headers. | P1 |
| API-016 | Path traversal, command injection, unsafe deserialization, and shell interpolation are prevented; shells are avoided. | P1 |
| API-017 | Error responses are consistent and do not expose stack traces, SQL, internal hostnames, secrets, or sensitive validation detail. | P2 |
| API-018 | Logs are structured, correlated with request IDs, access-controlled, and scrubbed of passwords, tokens, cookies, and unnecessary PII. | P2 |
| API-019 | Server and downstream timeouts, connection pooling, graceful shutdown, and unhandled rejection handling are configured. | P2 |
| API-020 | Health and readiness endpoints are minimal, safe when unauthenticated, do not leak topology, and are excluded from caches. | P2 |
| API-021 | Public APIs have a versioning and deprecation policy, with consumers identified before breaking changes. | P3 |
| API-022 | Critical mutations are idempotent and safe under retries, especially email sends, payments, and webhooks. | P2 |
| API-023 | Redirect targets are validated against an allowlist; open redirects and unsafe deep links are prevented. | P1 |
| API-024 | (C) Webhooks and background jobs verify signatures, prevent replay, retry with backoff, and expose dead-letter/alerting ownership. | P1 |

### 4.8 TEST — Automated and manual verification

| ID | Checklist item | Default severity |
| --- | --- | --- |
| TEST-001 | A test runner is configured with deterministic discovery, clear failures, and isolated state. | P2 |
| TEST-002 | A clean checkout can run the documented test command after a lockfile install without hidden setup. | P2 |
| TEST-003 | (C) Critical journeys (sign-up, login, core conversion, checkout) have end-to-end tests against a safe environment. | P2 |
| TEST-004 | Form tests cover validation, success, failure, timeout, duplicate submit, rate limit, and CAPTCHA failure paths. | P2 |
| TEST-005 | Authentication and authorization tests include negative cases, tenant boundaries, and object-ownership checks. | P1 |
| TEST-006 | API contract/schema tests detect breaking response and request changes. | P2 |
| TEST-007 | Unit tests cover money, dates/time zones, parsing, validation, and other high-consequence pure logic. | P2 |
| TEST-008 | Every fixed production bug receives a regression test when the behavior is testable. | P3 |
| TEST-009 | Automated accessibility checks run on representative pages and are triaged; they do not substitute for manual review. | P2 |
| TEST-010 | Manual keyboard and screen-reader checks on critical journeys are performed and recorded. | P2 |
| TEST-011 | Supported browsers, mobile viewports, and critical devices have a documented smoke-test matrix. | P2 |
| TEST-012 | CI runs install, lint, type-check, tests, and a production build on pull requests and release branches. | P1 |
| TEST-013 | Tests use isolated fixtures, sandboxes, or ephemeral databases and never hit production data or real customer services. | P1 |
| TEST-014 | Fixtures/mocks contain no live secrets or PII, and CI logs mask sensitive values. | P1 |
| TEST-015 | Coverage targets focus on critical behavior and failure paths rather than a vanity line percentage. | P3 |
| TEST-016 | Flaky tests are quarantined or fixed with ownership; retries do not conceal repeated failures. | P3 |
| TEST-017 | A production-safe smoke suite verifies post-deploy availability, authentication, core content, and one read-only critical transaction. | P2 |
| TEST-018 | Security scanning (SAST, dependency scanning, and/or DAST where appropriate) is integrated and findings are triaged. | P2 |

### 4.9 SEC — Security and data protection

| ID | Checklist item | Default severity |
| --- | --- | --- |
| SEC-001 | A current data inventory/flow map identifies personal and sensitive data, systems, processors, retention, and access owners. | P2 |
| SEC-002 | Passwords are stored with a modern memory-hard or slow salted hash (for example Argon2id or bcrypt at current cost); plaintext or reversible storage is absent. | P0 |
| SEC-003 | (C) Administrative, support, and privileged accounts require strong authentication such as MFA and have limited, monitored access. | P1 |
| SEC-004 | Account recovery is rate-limited, token-based, single-use, expiring, and resistant to enumeration and takeover. | P1 |
| SEC-005 | Sessions and tokens are rotated on login, privilege change, and sensitive actions; logout and revocation work across devices as designed. | P1 |
| SEC-006 | Session/token lifetime, idle timeout, storage, and refresh behavior are appropriate to sensitivity and platform. | P1 |
| SEC-007 | Password policy is modern and usable, avoids arbitrary composition rules, and supports long passphrases and breach checks where appropriate. | P2 |
| SEC-008 | Database, cloud, CI, and service accounts follow least privilege and avoid shared root or long-lived admin credentials. | P1 |
| SEC-009 | TLS protects all network paths, including internal service calls where the threat model requires it. | P1 |
| SEC-010 | Sensitive data at rest is encrypted, with keys managed, access-controlled, rotated, and separated from ciphertext. | P2 |
| SEC-011 | Production secrets live in a managed secret store and are injected at runtime; plaintext `.env` files are not deployed. | P2 |
| SEC-012 | Content Security Policy is deliberate and, where scripts require it, nonce- or hash-based with no unsafe `script-src` allowances. | P1 |
| SEC-013 | Framing is controlled with CSP `frame-ancestors` or equivalent, and clickjacking-sensitive actions have additional protection. | P2 |
| SEC-014 | `X-Content-Type-Options: nosniff`, referrer policy, and permissions policy are set appropriately. | P3 |
| SEC-015 | Supply chain controls cover lockfiles, trusted registries, dependency review, pinned CI actions, and provenance where supported. | P1 |
| SEC-016 | Built client artifacts, source maps, logs, and error reports contain no secrets, server-only environment values, or unnecessary PII. | P0 |
| SEC-017 | Output is encoded for its context (HTML, attribute, URL, script, CSS, SQL, shell), with Trusted Types or framework safeguards where available. | P1 |
| SEC-018 | Credential stuffing, brute force, and abnormal authentication patterns are rate-limited, detected, and alerted. | P1 |
| SEC-019 | Authentication, sign-up, and recovery flows avoid account/email enumeration through messages, status codes, and timing. | P2 |
| SEC-020 | PII is minimized, purpose-limited, and removed by documented retention/deletion jobs with exception handling. | P1 |
| SEC-021 | Administrative and security-relevant actions produce audit logs that are access-controlled, retained, and tamper-resistant. | P2 |
| SEC-022 | Admin/internal routes are separated, strongly protected, not indexed, and not discoverable through client bundles. | P1 |
| SEC-023 | A security contact, `security.txt` or equivalent disclosure path, and vulnerability intake process exist. | P3 |
| SEC-024 | Security configuration is reviewed periodically, including auth flows, public endpoints, dependency advisories, and vendor access. | P2 |

### 4.10 PERF — Performance and Core Web Vitals

| ID | Checklist item | Default severity |
| --- | --- | --- |
| PERF-001 | A reproducible lab baseline and, where possible, field data record LCP, INP, CLS, and TTFB for representative mobile and desktop pages. | P2 |
| PERF-002 | LCP is at or below 2.5 seconds at p75 for representative mobile traffic, or a documented remediation plan exists. | P2 |
| PERF-003 | INP is at or below 200 milliseconds at p75 for representative traffic, or a documented remediation plan exists. | P2 |
| PERF-004 | CLS is at or below 0.1 at p75, and layout reservation prevents avoidable shifts. | P2 |
| PERF-005 | TTFB is at or below 800 milliseconds at p75 for cacheable and server-rendered routes, or causes are documented. | P2 |
| PERF-006 | Images are responsive, correctly sized, modern-format where supported, compressed, lazy/eager as appropriate, and dimensioned. | P2 |
| PERF-007 | Fonts are subset/preloaded appropriately, use `font-display`, avoid invisible text, and limit families/weights. | P2 |
| PERF-008 | JavaScript has a per-route budget; unused code and oversized client dependencies are absent from hot paths. | P2 |
| PERF-009 | Render-blocking CSS/JS and critical request depth are reviewed and minimized without breaking first paint. | P3 |
| PERF-010 | Static assets use compression, long-lived immutable caching, and CDN delivery appropriate to the deployment. | P2 |
| PERF-011 | (C) Hot database queries are indexed, bounded, and free of N+1 patterns; query plans are reviewed for known slow paths. | P1 |
| PERF-012 | API responses are paginated, bounded, compressed, and avoid overfetching large fields or nested graphs. | P2 |
| PERF-013 | Third-party scripts have an owner and performance/consent budget; analytics/tags do not dominate main-thread work. | P2 |
| PERF-014 | Preconnect, prefetch, and preload hints are deliberate, measured, and not overused. | P3 |
| PERF-015 | Page, API, and data caching/revalidation strategies are correct for freshness and privacy, with purge behavior understood. | P2 |
| PERF-016 | Long-lived server processes are reviewed for leaks, unbounded caches, listener buildup, and resource exhaustion. | P2 |
| PERF-017 | (C) Anticipated peak load was tested against latency/error thresholds, with bottlenecks and capacity limits documented. | P2 |
| PERF-018 | Core Web Vitals are monitored in production, and performance budgets or alerts catch regressions. | P3 |

### 4.11 DEPLOY — Deployment, CI/CD, observability, and operations

| ID | Checklist item | Default severity |
| --- | --- | --- |
| DEPLOY-001 | The deployment process, environments, artifact source, approvals, and owner are documented and current. | P2 |
| DEPLOY-002 | CI/CD jobs use least privilege, protected environments, scoped secrets, and pinned third-party actions/images. | P1 |
| DEPLOY-003 | Production builds are reproducible and traceable to a tagged commit, with immutable artifacts retained. | P2 |
| DEPLOY-004 | Production environment variables and secrets are configured in the platform, scoped correctly, and never printed in build/deploy logs. | P1 |
| DEPLOY-005 | Preview/staging environments are isolated, protected from indexing and public access, and never use production customer data. | P2 |
| DEPLOY-006 | Domains, DNS records, and TLS certificates are correct, auto-renewing where possible, and monitored before expiry. | P1 |
| DEPLOY-007 | Health checks, readiness checks, connection draining, and zero-downtime or controlled-downtime rollout behavior are defined. | P2 |
| DEPLOY-008 | Rollback is documented and exercised for application, configuration, and schema changes, with a named decision owner. | P1 |
| DEPLOY-009 | Release approvals, change freezes, and separation of duties match the risk of the application. | P1 |
| DEPLOY-010 | Migrations are backward-compatible, reviewed, dry-run on a production-like copy, and covered by backups and a rollback/roll-forward plan. | P1 |
| DEPLOY-011 | Backups are automated, encrypted, access-controlled, retained, and restored in a test with recorded results. | P1 |
| DEPLOY-012 | Logs, metrics, and traces are aggregated with retention and request correlation, and sensitive fields are scrubbed. | P1 |
| DEPLOY-013 | Alerts are actionable, routed to an accountable owner, tested, and free of unbounded noise. | P2 |
| DEPLOY-014 | External uptime/synthetic monitoring checks critical pages and journeys from outside the hosting provider. | P2 |
| DEPLOY-015 | Error tracking captures production exceptions with useful context, secure source maps, and PII scrubbing. | P2 |
| DEPLOY-016 | An incident-response runbook, on-call or escalation path, status communication method, and post-incident review exist. | P2 |
| DEPLOY-017 | (C) WAF, DDoS protection, and edge rate limits are configured and validated against legitimate traffic before enforcement. | P2 |
| DEPLOY-018 | CDN caching, asset invalidation, and purge procedures are documented and tested for release correctness. | P2 |
| DEPLOY-019 | Cron jobs, queues, and background workers are monitored, retry safely, and route failures to a dead-letter/alert path. | P2 |
| DEPLOY-020 | Cost, quota, resource, and scaling limits have alerts before they can cause outages or runaway spend. | P3 |

### 4.12 RELEASE — Release readiness, regression, reliability, and rollback

| ID | Checklist item | Default severity |
| --- | --- | --- |
| RELEASE-001 | A release checklist and approval record are tied to the exact artifact/commit being released. | P1 |
| RELEASE-002 | The release candidate is built from a clean tagged commit with provenance recorded. | P2 |
| RELEASE-003 | Changelog/release notes cover user-visible changes, migrations, config changes, and known issues. | P2 |
| RELEASE-004 | No unresolved P0/P1 remains; any risk acceptance is explicit, owner-approved, time-bounded, and recorded. | P0 |
| RELEASE-005 | The regression suite and critical manual checks pass on the release candidate and results are retained. | P1 |
| RELEASE-006 | Rollback has been tested for this release, with clear triggers and an available decision owner during the window. | P1 |
| RELEASE-007 | Feature-flag defaults and kill switches are verified against production configuration before exposure. | P1 |
| RELEASE-008 | Data migration dry-run, backup, rollback/roll-forward, and old/new code compatibility are confirmed. | P1 |
| RELEASE-009 | A pre-release backup exists and a restore has been verified or confidently rehearsed. | P1 |
| RELEASE-010 | Monitoring, on-call coverage, communication channels, and release-window ownership are arranged. | P2 |
| RELEASE-011 | A post-deploy smoke test verifies availability, core content, authentication, and one safe critical flow. | P2 |
| RELEASE-012 | The supported browser/device matrix is checked on the candidate, including mobile navigation and forms. | P2 |
| RELEASE-013 | Final accessibility checks for keyboard, semantics, focus, and contrast are recorded on the candidate. | P2 |
| RELEASE-014 | Production canonical URLs, `noindex`, sitemap, robots, and redirects are verified after deployment. | P2 |
| RELEASE-015 | Analytics, consent, CAPTCHA, email, and error tracking are verified in production without sending unintended real communications. | P2 |
| RELEASE-016 | Legal, privacy, contact, refund/terms, and support information are current, reachable, and consistent with actual behavior. | P2 |

## 5. Report contract

Write the initial audit to **`PRODUCTION_AUDIT_REPORT.md` at the audited project root**. This is the only file the audit may create or modify. Use `references/report-template.md` as the structural source and replace its placeholders with audit evidence.

If that file already exists, do not silently overwrite or delete it. Ask whether this is a Stage 2 update to the existing audit or a new baseline. Preserve prior findings in version control or a clearly labeled historical baseline before replacing anything. Treat the report as sensitive: do not commit, publish, or attach it elsewhere without explicit permission.

### 5.1 Required structure

The report must contain these eight top-level sections, in this order, with these exact names:

1. `## 1. Executive Summary`
2. `## 2. Complete Production Audit Matrix`
3. `## 3. Critical Findings P0–P3`
4. `## 4. Missing Integrations and Developer Decisions`
5. `## 5. Proposed Implementation Plan`
6. `## 6. Verification Results`
7. `## 7. Developer Action Required`
8. `## 8. Approval Checklist`

Do not add, remove, rename, merge, or reorder top-level audit sections. The document title and a short metadata block may appear before Section 1, but all substantive findings belong within the eight sections.

### 5.2 Complete matrix

Section 2 must contain **every one of the 248 baseline items exactly once** in a Markdown table with this exact header row:

```markdown
| ID | Category | Checklist Item | Status | Severity | Evidence / File Location | Problem / Risk | Recommended Fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
```

Rules:

- `Category` uses the category name and code, for example `ENV — Environment`.
- `Checklist Item` preserves the baseline wording or a faithful equivalent; it must remain identifiable by ID.
- `Status` is exactly one of the seven allowed values.
- `Severity` is exactly `P0`, `P1`, `P2`, or `P3`.
- `Evidence / File Location` is concrete and reproducible. Cite file paths, line ranges, commands, URLs, or supplied artifacts. Redact secret values.
- `Problem / Risk` explains consequence and trigger conditions. For a `PASS`, state the key evidence or "No gap identified" rather than inventing a problem.
- `Recommended Fix` is specific and actionable. For `NEEDS_DECISION`, name the decision and recommended option. For `NOT_APPLICABLE`, explain why no fix is required.
- Do not truncate long reports, omit rows, combine rows, or write "all others pass". A conditional item that does not apply still gets a full row.
- Prefer one concise paragraph per cell over sprawling prose. The matrix is the complete record; Section 3 is the prioritized narrative.

### 5.3 Section requirements

**1. Executive Summary** — scope, audited revision/working-tree state, date, stack, deployment URL if used, access limitations, counts by status and severity, the highest-risk themes, and a release posture. A valid release posture is one of: `Blocked by P0/P1 findings`, `Blocked by unverified critical controls`, `Developer decision required`, or `No blocking findings observed in audited scope`. Never use `Production ready` as a bare conclusion. State that the audit is evidence-limited and not a certification. Include the exact number of matrix rows and confirm all 248 were assessed.

**2. Complete Production Audit Matrix** — all items, as specified above.

**3. Critical Findings P0–P3** — organize by severity. Detail every open `P0` and `P1` finding individually: IDs, evidence, impact, trigger likelihood, affected users/data, and smallest safe remediation. Summarize `P2` and `P3` findings with IDs and links/references to their matrix rows rather than duplicating every field. Do not omit a severity level; when none exist, say "None identified in audited scope" and do not imply proof of absence. A `NEEDS_DECISION` item that gates security, launch, or compliance should be surfaced here or in Section 4.

**4. Missing Integrations and Developer Decisions** — list unavailable external services, credentials, data, access, and product/legal choices. Include the exact question, options, recommendation, impact if unresolved, owner, and whether it blocks meaningful verification. Never request secrets in the report or chat; name the environment variable or platform setting instead.

**5. Proposed Implementation Plan** — split fixes into small, independently reviewable batches ordered by risk and dependency. For each batch include IDs, objective, files/areas likely affected, validation/tests, rollback/containment, dependencies, and whether developer credentials/decisions are required. Avoid broad "refactor everything" batches. Keep unapproved findings in the plan; the plan is not permission. State that no batch will begin without explicit approval of that batch or its IDs.

**6. Verification Results** — record the audit date/time, commands/checks actually executed, artifacts inspected, runtime checks performed, checks intentionally not run under the read-only rule, limitations, status counts, and a **Sources consulted (official only)** subsection. Preserve a baseline record for Stage 2. Include a "Checks not run" list so silence is not mistaken for verification. Never claim tests/builds passed unless you saw evidence.

**7. Developer Action Required** — enumerate concrete actions the developer must take: provide access, make decisions, configure integrations, add secrets in the correct platform, run production-only checks, accept or fix risks, and approve a batch. Distinguish blocking actions from non-blocking follow-ups. Do not include secret values.

**8. Approval Checklist** — provide checkboxes for each proposed batch and for any narrowly scoped findings approved outside batches. Make clear that checking a box in the report does not itself authorize work; the user must send an explicit approval message. Include a short scope-restatement template and the non-approval examples. Preserve records of any later approvals and their exact scope.

### 5.4 Mandatory initial closing notice

The **initial** audit report must end with exactly this line, with nothing after it:

**Implementation has not started. Review the findings and explicitly approve the findings or implementation batches you want addressed. No application code has been changed during this audit.**

Do not replace it with a generic summary. If the report is later updated after approved implementation begins, preserve the original notice verbatim in the baseline history under Section 6 and use an accurate Stage 2 closure there; the initial report remains the immutable starting point.

## 6. Stage 2 — Approved remediation only

### 6.1 What counts as approval

Proceed only when the user's message explicitly identifies the implementation scope, for example:

- "Implement Batch 1 exactly as proposed."
- "Fix ENV-006, ENV-007, and API-010."
- "Approve Batch 2 (FORM-011, FORM-014) and Batch 3."
- "Implement all P0 items listed in the report dated 2026-10-26."

These are **not** approval:

- "Review the report."
- "Looks good."
- A thumbs-up reaction alone.
- "What do you think?"
- "Fix everything" without a defined report/batch baseline and scope restatement.
- Approval of the audit methodology or of a finding's severity.

If the scope is broad or ambiguous, restate exactly which IDs/batches it maps to and ask for confirmation before editing. Approval covers only the named items and necessary directly coupled changes. It does not authorize deployment, data deletion, destructive migrations, DNS changes, secret exposure, unrelated refactors, dependency upgrades, or changing security behavior beyond the approved finding.

### 6.2 Pre-change safety

1. Re-read the report and the approved batch. Identify every approved ID and nothing else.
2. Inspect `git status` and relevant diffs. Never overwrite or revert pre-existing user changes. If the working tree conflicts with the approved change, stop and explain.
3. Capture a new baseline: timestamp, commit, original statuses for affected IDs, and relevant existing test results.
4. Confirm required credentials/decisions are available. If not, implement only the safe, verifiable portion and record the rest as blocked; do not fake integrations.
5. Before installing a package, ask for approval if installation was not already explicit. Prefer existing, already-supported dependencies.
6. Do not modify production data, send customer email, hit live payment endpoints, or disable security controls during testing.

### 6.3 Implementation rules

- Make the smallest safe change that fully addresses each approved finding.
- Follow the repository's existing architecture, naming, and formatting. Do not opportunistically reformat or refactor unrelated code.
- Add or adjust tests only as needed for the approved fix; never weaken assertions to make a suite pass.
- Do not suppress errors, add blanket TypeScript ignores, lower lint severity, or remove security headers/checks to get green output.
- Never embed placeholder secrets in source. Use validated environment variables and add names to `.env.example` without values.
- If a fix requires a provider account, domain change, production credential, or external approval, prepare code/config scaffolding only where safe and mark the external verification `UNVERIFIED`.
- Keep a list of changed files and rationale mapped to IDs.

### 6.4 Verify and update the report

1. Run targeted checks first, then the project's established lint, type-check, test, and build commands when they exist and are safe. Use documented scripts; do not invent destructive flags. Capture exact commands and outcomes.
2. Test failure paths where applicable, including authorization denial, validation errors, duplicate submissions, and timeout behavior. Never use real customer data or live communications.
3. For each approved ID, decide the new status. A code change alone is not proof of an end-to-end control; mark `UNVERIFIED` where runtime/provider verification is still needed.
4. Append a dated Stage 2 entry under Section 6 with:
   - approval quote or exact scope (no secrets)
   - approved IDs/batches
   - changed files/areas
   - commands run and results
   - initial status → new status with evidence
   - remaining limitations, risks, or rollback notes
5. Update affected matrix rows only with verified current status and appended evidence. Never delete original evidence or baseline counts. Preserve the initial severity and note any change.
6. Append remediation notes to Section 3 findings; do not erase the original finding. Update plan/batch progress in Section 5, remaining developer actions in Section 7, and approval records in Section 8.
7. Keep the initial closing notice in the baseline history. At the end of a Stage 2 update, use an accurate closure that states what was implemented, what was tested, and what remains. Do not claim overall production readiness from a partial fix or a passing build.
8. If a fix fails or creates unacceptable risk, revert only your own changes when safe and report the failure. Do not leave disabled controls or misleading partial configuration.

### 6.5 Rollback and stop conditions

Stop and ask the developer when:

- the approved change would delete or irreversibly transform data;
- a schema migration cannot be made backward-compatible;
- a secret, production credential, DNS record, or billing setting must be changed;
- the change requires deployment to verify;
- unrelated failing tests or dirty worktree changes block confidence;
- the only available workaround is to weaken security, privacy, accessibility, or tests;
- approval scope is unclear or a new P0 is discovered.

Never deploy, even if the approved batch would benefit from deployment verification. Provide the exact commands/checks for the developer and let authorized operators perform deployment.

## 7. Verification playbook

Use the project's existing scripts and documented environments. The following are evidence recipes, not commands to run blindly or during the read-only audit.

### 7.1 Static evidence

- Inventory scripts with `npm pkg get scripts` (or read `package.json`) before running anything.
- Inspect env usage and leaks with targeted `rg` searches for `process.env`, `NEXT_PUBLIC_`, `VITE_`, `PUBLIC_`, `SECRET`, `TOKEN`, and provider key prefixes. Report only names and locations, never values.
- Check for a lockfile, pinned runtime, `.env.example`, CI workflow coverage, migration files, and test configuration.
- Inspect generated client output only if it already exists; do not build during Stage 1. Search it for secret values and private environment names without reproducing matches.
- Compare route inventory to sitemap/robots rules and to privacy/analytics inventory.

### 7.2 Safe public runtime checks (Stage 1, when authorized)

- Fetch the homepage and representative public routes; record status, final URL, canonical, meta robots, title, and cache/security headers.
- Fetch `/robots.txt`, `/sitemap.xml`, and any referenced sitemap; validate status, content type, absolute URLs, and obvious private-route leakage.
- Check a small set of redirects and the 404 behavior without crawling the whole site.
- Do not log in, submit forms, run checkout, trigger password resets, send email, or probe admin/auth endpoints with guessed paths.
- Note asset/headers only; do not run vulnerability scanners or load tests without separate written authorization.

### 7.3 Stage 2 test recipes

- Install exactly as documented and permitted; prefer `npm ci` from the committed lockfile. Ask before installing new packages.
- Run `npm run lint`, the repository's type-check command, the test suite, and a production build if those scripts exist and are non-destructive. Review build output for deployment commands masquerading as build steps.
- Use unit tests for validation, authorization helpers, error mapping, and data transformations.
- Use integration/e2e tests with isolated data for form success/failure, duplicate submission, auth boundaries, and route protection.
- Use Playwright (or the existing browser test tool) for keyboard, focus, responsive, and critical-flow checks. Use axe only as a supplement to manual accessibility review.
- Verify email through a sandbox or local mail catcher; never send to real customer addresses. Verify CAPTCHA test behavior with provider-sanctioned test keys where available.
- Verify analytics/consent with the provider's debug tooling and network inspection; confirm denied state blocks non-essential tags and that withdrawal works.
- Verify security headers from the local/staging server, not by assuming framework defaults.
- Record exact commands and summarize output. Do not paste tokens, cookies, or customer data into the report.

### 7.4 External verification that may remain `UNVERIFIED`

Some controls cannot be proven locally: DNS/mail authentication, production TLS, CDN behavior, WAF/DDoS protection, provider-side retention, real search indexing, legal sufficiency, and production-only observability. Mark them `UNVERIFIED` until the developer supplies sanitized evidence. Do not convert them to `PASS` from documentation alone.

## 8. Official-source and safety policy

- Consult `references/authoritative-sources.md` before making standards claims. Prefer primary documentation over tutorials.
- Treat `llms.txt` as a community proposal with no guarantee of crawler support; it is never a launch blocker by itself.
- Do not claim WCAG conformance from automated tests alone; WCAG 2.2 AA requires manual verification of applicable success criteria.
- Do not claim legal compliance (GDPR, CCPA/CPRA, ePrivacy, or other regimes) based on the audit. State requirements for qualified review.
- Do not claim that a framework default, WAF, or hosting platform automatically satisfies a control; verify effective deployed behavior.
- Security findings describe defensive remediation. Do not provide exploit instructions, payloads, or steps to access data beyond proving the existence of a vulnerability in authorized scope.
- Respect third-party terms, rate limits, robots directives, and privacy. Public pages only unless the user authorizes more.

## 9. Final quality gate

Before delivering the Stage 1 audit:

- [ ] Exactly one artifact was created: the report at the project root.
- [ ] No source, config, lockfile, test, or data file changed.
- [ ] All 248 checklist IDs appear exactly once in the matrix, with no invented IDs.
- [ ] Every status uses the exact allowed vocabulary; every severity is P0–P3.
- [ ] Every `PASS` has evidence; every limitation is stated.
- [ ] Conditional items have a reasoned status, and `NOT_APPLICABLE` is not used to dodge applicable work.
- [ ] All eight required report sections exist in order with exact names.
- [ ] The matrix header exactly matches the required columns.
- [ ] Section 6 includes "Sources consulted (official only)" and lists what was not run.
- [ ] No secret values, auth tokens, cookies, private keys, or customer PII appear in the report or chat.
- [ ] No deployment, destructive action, data deletion, DNS change, or application modification occurred.
- [ ] No claim of overall production readiness rests on a successful build, framework defaults, or an unverified item.
- [ ] The initial report ends with the exact closing notice specified in this skill's Section 5.4, byte-for-byte, with nothing after it.
- [ ] The final chat response points to the report path, summarizes counts and P0/P1 themes, states limitations, and asks for explicit approval. It does not paste the entire report or begin implementation.
