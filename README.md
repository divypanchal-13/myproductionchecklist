# Web Production Checklist

An audit-first agent skill for reviewing JavaScript, TypeScript, React, Next.js, Node.js, and Express projects before production.

It inspects the project, maps evidence to **248 production controls**, writes a single Markdown audit report, and stops. It does not change application code until you explicitly approve specific findings or implementation batches.

## Why this exists

Production readiness is more than a green build. This checklist looks for gaps across environment and secret handling, forms and email delivery, SEO and crawlability, analytics consent and privacy, responsive/accessibility quality, code correctness, backend security, testing, performance, deployment, observability, and rollback.

The default behavior is deliberately conservative:

- Stage 1 is read-only.
- Missing evidence becomes `UNVERIFIED`, not an assumed pass.
- A passing build is not treated as proof of production readiness.
- Findings are evidence-based and prioritized.
- No package installs, source edits, reformatting, dependency upgrades, deployments, destructive migrations, data deletion, or DNS changes happen during the audit.
- Secrets are redacted from all output.

## Repository layout

```text
.
├── .agents/
│   └── skills/
│       └── web-production-checklist/
│           ├── SKILL.md
│           └── references/
│               ├── authoritative-sources.md
│               └── report-template.md
├── .gitignore
└── README.md
```

## Install

Clone the repository:

```bash
git clone https://github.com/divypanchal-13/myproductionchecklist.git
```

Then place the skill where your agent discovers skills:

1. **Project-local skill (recommended for team use):** copy `.agents/skills/web-production-checklist/` into the audited project's `.agents/skills/` directory.
2. **User-level skill:** copy the same directory into the skills directory supported by your agent harness.

The exact discovery path can vary by client. See your agent's skill documentation if `.agents/skills/` is not supported. The skill itself has no runtime dependencies; it is Markdown plus reference material.

## Use

If your client supports skill slash commands:

```text
/web-production-checklist
```

Otherwise invoke it in natural language:

```text
Use the `web-production-checklist` skill to audit this project for production readiness.
This is a read-only audit. Generate PRODUCTION_AUDIT_REPORT.md at the project root,
report all findings with evidence, and stop for my approval before changing any code.
```

The agent should inspect the repository and produce exactly one new file:

```text
PRODUCTION_AUDIT_REPORT.md
```

It must not modify application source, tests, configuration, lockfiles, or data during Stage 1.

## What the report contains

The report uses eight required sections:

1. Executive Summary
2. Complete Production Audit Matrix
3. Critical Findings P0–P3
4. Missing Integrations and Developer Decisions
5. Proposed Implementation Plan
6. Verification Results
7. Developer Action Required
8. Approval Checklist

The matrix uses this exact schema:

```markdown
| ID | Category | Checklist Item | Status | Severity | Evidence / File Location | Problem / Risk | Recommended Fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
```

The initial report ends with:

> **Implementation has not started. Review the findings and explicitly approve the findings or implementation batches you want addressed. No application code has been changed during this audit.**

## Coverage

| Category | Code prefix | Controls |
| --- | --- | ---: |
| Environment, configuration, secrets, feature flags | `ENV` | 16 |
| Forms, validation, email, CAPTCHA, submission states | `FORM` | 24 |
| SEO, metadata, structured data, sitemaps, robots, llms.txt | `SEO` | 22 |
| Analytics, consent, privacy | `AN` | 18 |
| UI, responsive behavior, accessibility, links, navigation, content | `UI` | 24 |
| JS/TS quality, React correctness, optimization | `CODE` | 24 |
| Node.js/Express backend hardening | `API` | 24 |
| Testing and verification | `TEST` | 18 |
| Security and data protection | `SEC` | 24 |
| Performance and Core Web Vitals | `PERF` | 18 |
| Deployment, CI/CD, observability, operations | `DEPLOY` | 20 |
| Release readiness, regression, reliability, rollback | `RELEASE` | 16 |
| **Total** | | **248** |

Items marked `(C)` in the skill are conditional. If the condition is false, they are marked `NOT_APPLICABLE` with a reason rather than silently skipped.

## Statuses

Only these seven statuses are used:

- `PASS` — implemented and verified, with evidence
- `PARTIAL` — partially implemented
- `FAIL` — implemented but ineffective or contrary to the requirement
- `MISSING` — no implementation found
- `UNVERIFIED` — evidence or access is insufficient
- `NEEDS_DECISION` — a product, legal, or business decision is required
- `NOT_APPLICABLE` — the feature/stack/jurisdiction is absent, with a reason

## Severities

- `P0` — catastrophic risk; blocks release
- `P1` — production blocker
- `P2` — material risk or quality gap; owner and acceptance required if deferred
- `P3` — lower-risk hardening or polish

## Approval and implementation

Approval must name the findings or batches to implement:

```text
I approve Batch 2 (FORM-011, FORM-014) and Batch 3.
```

The following are **not** implementation approval:

- "Review the report."
- "Looks good."
- A thumbs-up reaction.
- Approval of the audit or its methodology.

After explicit approval, the skill follows the approved scope only, makes the smallest safe change, tests it, and appends dated verification results to the report while preserving the original audit baseline. It never deploys, deletes data, runs destructive migrations, changes DNS, rotates production credentials, weakens security controls to pass tests, or outputs secrets.

Deployment and destructive production operations are intentionally outside the skill's authority and must be performed separately by authorized operators.

## Customizing the checklist

- Add new controls at the end of the relevant category with the next unused ID.
- Do not renumber, delete, or silently replace existing controls.
- Update the stated total, the coverage table, and any validation counts when adding controls.
- If a new standard or vendor change makes an item obsolete, mark it deprecated and explain the replacement instead of erasing history.

## Sources

The skill restricts research to primary sources such as:

- official framework and vendor documentation;
- W3C specifications and WAI guidance;
- IETF/RFC Editor standards;
- OWASP ASVS, Top 10, and Cheat Sheet Series;
- Google Search Central and web.dev;
- sitemaps.org;
- the llms.txt proposal.

The full index is in [`references/authoritative-sources.md`](.agents/skills/web-production-checklist/references/authoritative-sources.md). `llms.txt` is treated as an advisory community proposal, not a formal standard.

## Scope and limitations

This is an audit aid, not a certification or legal opinion. It cannot prove that an application is free of vulnerabilities, legally compliant, fully WCAG-conformant, or guaranteed to remain reliable. Production readiness remains a decision for the application owner, with qualified review where legal, privacy, accessibility, or security obligations require it.

The skill is not affiliated with or endorsed by Next.js, Vercel, React, Meta, OpenJS Foundation, OWASP, W3C, Google, Cloudflare, or any other vendor mentioned.
