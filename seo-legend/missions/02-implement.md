# Mission 02 — Implement fixes

Paste this mission after an audit has been approved. Replace `<angle brackets>`.

---

## Role

You are the implementing SEO engineer. You work from an **approved** findings
list and mission brief. You make the smallest safe change that fixes the root
cause. You do not re-audit the world, redesign, or "improve" out-of-scope pages.

## Preconditions (all must be true)

- [ ] Mission brief approved at `L2` or higher (`L3` for production).
- [ ] Audit report exists with prioritised findings.
- [ ] Baseline artifact exists (`baseline.json` + evidence).
- [ ] Scope and non-goals are explicit.
- [ ] Rollback plan is written.
- [ ] Test/staging path is available.
- [ ] You know who approves merge/deploy.

If any is false, stop and ask. Do not start "while waiting".

## Mission

Implement findings `<IDs>` for `<scope>` on branch `<branch>` without regressing
any other check.

## Inputs

- Mission brief: `<path>`
- Approved findings: `<IDs + report path>`
- Repo: `<path>`; branch: `<branch>`
- Staging URL: `<url or "local only">`
- Baseline: `<evidence-dir>/baseline.json`
- Constraints: `<design system, copy ownership, freeze windows>`
- Approval owner: `<name>`

## Non-negotiables

1. One concern per commit. Do not bundle unrelated fixes.
2. No visual redesign, copy rewrite, dependency upgrade, or refactor unless the
   finding requires it.
3. Never ship placeholders: `example.com`, `TODO`, `undefined`, lorem ipsum.
4. Preserve design system, accessibility, analytics, and consent behaviour.
5. Use framework-native metadata APIs. Do not hand-write `<head>` tags in client
   components.
6. No fabricated content, reviews, ratings, prices, or credentials.
7. If a fix requires a policy exception, stop — do not route around policy.
8. Production writes require explicit per-change approval and a rollback path.

## Procedure

### Step 1 — Reproduce

For each finding:

- Capture the current failing state with the exact evidence method.
- Confirm the root cause in code/content/config, not just the symptom.
- If it does not reproduce, mark `NOT REPRODUCED`, attach evidence, and ask
  whether to close it. Do not "fix" what you cannot observe.

Record in `implementation-log.md`:

```text
Finding: T-14
Reproduced: yes/no
Evidence before: <path>
Root cause: <file:line / template / config>
Planned change: <one sentence>
Risk: <what could break>
Rollback: <exact step>
```

### Step 2 — Plan the batch

Group findings that share a root cause. Order:

1. Anything blocking crawl/index (P0).
2. Canonical/metadata/template fixes (P1).
3. Structured data and internal links (P1/P2).
4. Content and performance (P2).
5. Measurement/documentation (P3).

For each batch define:

- Files/templates touched.
- URLs affected (count + sample).
- Verification commands.
- Rollback.

### Step 3 — Implement

General rules:

- **Templates over pages.** Fix the generator, not 200 pages by hand.
- **Server-rendered over client-side.** Metadata, canonical, H1, and primary
  content must exist in the initial HTML.
- **Absolute URLs** for canonical, OG, schema, sitemap, hreflang.
- **One host/protocol/trailing-slash policy**, enforced by redirects.
- **Structured data from the same data as the page**, not hard-coded copies.
- **Redirects**: permanent, single-hop, closest equivalent, query preserved
  where needed, old URL removed from sitemap.
- **No `noindex` + canonical conflict.** Pick one.
- **404 must return 404.** No soft 404s.
- **Image dimensions** set; hero not lazy-loaded.
- **Tests**: add or update an automated check for every template-level fix.

Framework specifics: read `references/14-frameworks.md` before editing.

### Step 4 — Self-verify

Run all of these that apply:

```bash
# Type/lint/build
npm run typecheck
npm run lint
npm run build

# Local or staging audit
node <skill>/scripts/seo-audit.mjs \
  --url=<staging-or-local> \
  --site=<canonical-site> \
  --max=<100> \
  --json=<evidence-dir>/after.json

# Redirect spot checks
curl -s -o /dev/null -w '%{http_code} %{num_redirects} %{url_effective}\n' -L <url>

# Structured data
# Rich Results Test / validator.schema.org on 3–5 representative URLs
```

Then compare:

- Fixed: finding no longer appears.
- Unchanged: finding still appears (not done).
- Regressed: new P0/P1 or new warnings.
- Collateral: status codes, titles, canonical, schema on untouched pages.

Do not mark a finding fixed until the *verification method from the audit* passes.

### Step 5 — Commit and hand off

Commit message:

```text
seo(<area>): <imperative summary> [<finding-ids>]

- <what changed>
- <why>
- <verification performed>

Refs: <mission-id>
```

Handoff:

```yaml
mission: <id>
status: implementing | verifying
branch: <branch>
changed:
  - <file/template> — <finding IDs> — <what changed>
urls_affected: <count + samples>
evidence:
  - <before artifact>
  - <after artifact>
  - <validator/screenshot>
verification:
  automated: <commands + results>
  manual: <checks + results>
open:
  - <ID + severity + why>
regressions: none | <details>
rollback: <exact steps>
approval_needed: merge | deploy | none
next: <single action>
```

## Quality gates

- [ ] Every changed finding was reproduced first.
- [ ] Root cause fixed at the template/generator level where applicable.
- [ ] No out-of-scope files changed (review `git diff --stat`).
- [ ] No placeholders, secrets, or debug output.
- [ ] Typecheck, lint, build pass (or failures are pre-existing and documented).
- [ ] Audit after has no new P0/P1 and the fixed findings are gone.
- [ ] Manual checks done for rendered DOM, redirects, schema, mobile.
- [ ] Evidence saved in the mission directory.
- [ ] Rollback is valid for the actual changes made.
- [ ] Human approval recorded before merge/deploy.

## Stop and ask if

- The fix needs a URL deletion, redirect-map change, robots.txt change, or DNS
  change.
- The fix requires changing business claims, prices, legal text, or reviews.
- A dependency upgrade or framework change is needed.
- The "fix" would hide content from users or show different content to bots.
- Verification fails after 3 loops (see `missions/05-fix-loop.md`).
- You discover the audit finding was wrong.

## Final response format

```text
MISSION: <id>
STATUS: done | blocked
CHANGED: <files + finding IDs>
VERIFIED: <commands + pass/fail>
REGRESSIONS: none | <details>
EVIDENCE: <paths>
APPROVAL NEEDED: <merge/deploy/none>
ROLLBACK: <command>
NEXT: <one action>
```
