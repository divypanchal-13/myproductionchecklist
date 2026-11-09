# Mission brief (fill this first)

**No brief, no mission.** An agent must not crawl, edit, or "quickly fix" anything
until this file is filled in and approved at the required level. The brief is the
contract that prevents scope creep, accidental production changes, and invented
success criteria.

Copy the YAML block into the mission's evidence directory as `mission-brief.yaml`
(or keep it at the top of the report). Every field is mandatory unless marked
optional. `TBD` is not an acceptable value for a field that gates work.

---

## 1. Brief template

```yaml
mission_id: SEO-YYYY-NNN
title: <one line, outcome-shaped>
created: YYYY-MM-DD
owner: <human accountable for the outcome>
agent: <agent/model + session id if applicable>
status: draft            # draft | approved | active | blocked | done

objective: >
  One measurable outcome. Not "improve SEO". Example: "Restore indexation and
  200 status for all 214 URLs under /guides/* by 2026-12-01."

scope:
  hosts: [https://www.example.com]
  paths: [/guides/*, /blog/*]
  locales: [en-GB]
  templates: [guide-article, blog-index]
  environments: [production]          # production | staging | local
  excluded_paths: [/account/*, /cart/*]

constraints:
  stack: <framework/CMS/CDN/server>
  design_system: <must-preserve rules>
  copy_ownership: <who approves copy changes>
  freeze_windows: [<dates>]
  budget: <hours/credits>
  legal: <regulated claims, privacy, accessibility requirements>

access:
  repo: <path/URL + branch rules>
  cms: <yes/no + role>
  search_console: <property + permission level>
  bing: <yes/no>
  analytics: <property + permission>
  server_logs: <path/access>
  browser: <tool available?>
  credentials_location: <secret manager / env var names — never values>

success_criteria:
  - id: SC-01
    check: "All sitemap URLs return 200 and are indexable"
    method: "scripts/seo-audit.mjs + GSC Pages export"
    target: "0 P0/P1 findings; GSC 'Not found (404)' = 0 for /guides/*"
  - id: SC-02
    check: "Titles and descriptions unique across /guides/*"
    method: "audit JSON duplicate groups"
    target: "0 duplicate groups"
  - id: SC-03
    check: "No CWV regression"
    method: "CrUX/PSI before vs after, p75 mobile"
    target: "LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 or baseline preserved"

non_goals:
  - Redesign
  - Paid media
  - Link acquisition
  - Changing pricing or legal copy

risk_tier: L1              # L0 read-only | L1 propose | L2 branch/staging | L3 production
approval:
  plan_approved_by: <name + date>
  deploy_approved_by: <name + date or "not required">
  waiver_approved_by: <name + date or "none">

evidence_dir: .seo/YYYY-MM-DD-<slug>/
baseline_artifact: .seo/YYYY-MM-DD-<slug>/baseline.json
after_artifact: .seo/YYYY-MM-DD-<slug>/after.json

stop_conditions:
  - Any change that deletes, redirects, or noindexes production URLs
  - robots.txt, canonical host, DNS, or redirect-map changes
  - Missing access or credentials
  - Required business/legal copy changes
  - Verification still failing after 3 fix loops
  - Only way to pass is to fabricate data

rollback: >
  Exact command/steps to restore the previous state, including who can run it
  and how long it takes. For code: git revert <sha>. For DNS/CDN: named change
  ID. For content: saved revision IDs.

handoff:
  next_agent: <name or "same">
  next_action: <single next step>
  open_items: <link to findings table>
```

---

## 2. Field guidance

### Objective

Good objectives are **outcome + scope + deadline + measurable**:

- Bad: "Fix SEO issues."
- Bad: "Get more traffic."
- Good: "Restore 200/indexable status for 214 `/guides/*` URLs and recover
  non-branded impressions to within 10% of the 2026-08 baseline by 2026-12-01."
- Good: "Ship valid `Product` structured data on 100% of 1,284 product templates
  with zero Rich Results Test errors, verified on a 20-URL sample."

An objective that cannot fail is not an objective.

### Scope

Be explicit about what is **out**:

- Hosts and protocols (include `www`, staging, legacy domains).
- Paths and templates, not just "the site".
- Locales and markets.
- Environments. Production is not a test environment.
- Excluded paths (account, cart, admin, internal search).

If the agent finds an issue outside scope, it records it as an **observation**
with severity and does not fix it without a scope change.

### Constraints

Capture anything that can invalidate a "correct" fix:

- Design-system rules (spacing, typography, components).
- Copy ownership and tone.
- Claims that must not change (numbers, certifications, guarantees).
- Localisation and legal review requirements.
- Freeze windows and deployment rules.
- Accessibility commitments (WCAG 2.2 AA target).
- Analytics/consent architecture.

### Access

List **what** is available, not the secret values. Credentials belong in a
secret manager. If access is missing, the mission is `blocked`, not "best effort".

### Success criteria

Each criterion needs:

1. A binary or numeric check.
2. A method that can be re-run.
3. A target that is unambiguous.
4. An evidence artifact.

"Looks good" fails. "0 P1 findings in `after.json`" passes.

### Risk tier

| Tier | Agent may | Requires |
| --- | --- | --- |
| `L0` | Read, crawl, analyse, report | Nothing |
| `L1` | Draft diffs/content/redirect maps | Plan approval |
| `L2` | Write to branch/staging, run verification | Merge/deploy approval |
| `L3` | Change production | Per-change approval + rollback plan |

When in doubt, use the lower tier. An agent cannot promote itself.

### Stop conditions

Always include the standard set from `SKILL.md` §3.2, plus mission-specific
ones (e.g. "stop if the CMS migration is mid-flight"). Stopping is a successful
outcome when the alternative is an unapproved production change.

### Rollback

Write it before implementation, not after. Test it where possible. "Revert the
commit" is insufficient if redirects, DNS, CDN rules, or content revisions are
involved.

---

## 3. Validation checklist

Before the agent starts:

- [ ] Objective is measurable and time-bound.
- [ ] Scope lists hosts, paths, locales, templates, environments, exclusions.
- [ ] Non-goals are explicit.
- [ ] Access is confirmed (or the mission is marked blocked).
- [ ] Every success criterion has a method and a target.
- [ ] Risk tier matches the blast radius.
- [ ] Approval names and dates are recorded.
- [ ] Evidence directory exists and is writable.
- [ ] Baseline artifact path is defined.
- [ ] Stop conditions include the standard set.
- [ ] Rollback is written and plausible.
- [ ] The human owner has approved the brief at the required level.

## 4. Scope-change protocol

If new work is needed:

1. Record the observation with severity and evidence.
2. Propose an amended scope and success criteria.
3. Get the same level of approval as the original brief.
4. Version the brief (`mission-brief.v2.yaml`); do not silently edit v1.

## 5. Example: small, valid brief

```yaml
mission_id: SEO-2026-014
title: Fix duplicate titles and missing canonicals on the UK service pages
objective: >
  Make all 18 /services/* pages return a unique title and a self-referencing
  absolute canonical, verified by audit JSON, by 2026-11-14.
scope:
  hosts: [https://www.hexagoninfosoft.co.uk]
  paths: [/services/*]
  locales: [en-GB]
  templates: [service-page]
  environments: [production]
  excluded_paths: [/services/thank-you]
constraints:
  stack: Next.js App Router on Apache reverse proxy
  design_system: no visual changes
  copy_ownership: marketing approves title/description changes
  freeze_windows: [2026-11-20 to 2026-11-30]
access:
  repo: local working copy, branch only
  search_console: read-only
  analytics: read-only
success_criteria:
  - id: SC-01
    check: Unique titles and descriptions
    method: seo-audit.mjs duplicate report
    target: 0 duplicate groups across /services/*
  - id: SC-02
    check: Self-referencing canonicals
    method: seo-audit.mjs canonical checks
    target: 18/18 pages self-canonical, absolute HTTPS
  - id: SC-03
    check: No regressions
    method: full-site audit before/after
    target: no new P0/P1; status codes unchanged
non_goals: [Redesign, new service pages, pricing changes]
risk_tier: L2
approval:
  plan_approved_by: Jane Doe, 2026-11-07
  deploy_approved_by: pending
evidence_dir: .seo/2026-11-07-service-metadata/
stop_conditions:
  - Any production deploy without approval
  - Any URL removal or redirect change
  - Verification failing after 3 loops
rollback: git revert <merge-sha>; redeploy via npm run deploy; verify /services/*
```
