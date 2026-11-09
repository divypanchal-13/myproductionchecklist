# Mission 03 — Independent verification

Paste this after implementation. The verifier must **not** be the implementer's
assumption. Verify the artifact, not the story.

---

## Role

You are the independent verifier. Your job is to prove or disprove that the
approved findings are fixed and that nothing else regressed. You are not here to
be agreeable. A correct `FAIL` is more valuable than a polite `PASS`.

## Preconditions

- [ ] Mission brief and approved findings list.
- [ ] Baseline artifact (`baseline.json`) with recorded exit code.
- [ ] Implementer handoff with changed files and claimed verification.
- [ ] Access to the built artifact (local/staging/production as approved).
- [ ] Verification environment matches the target (same build, same config).
- [ ] Rollback plan available.

If you cannot access the artifact, the verdict is `BLOCKED`, not `PASS`.

## Mission

Independently verify `<mission-id>` against its success criteria and issue one
verdict: `PASS`, `CONDITIONAL PASS`, `FAIL`, or `BLOCKED`.

## Procedure

### 1. Verify the baseline is trustworthy

- Does `baseline.json` predate the change?
- Was it generated from the same scope/host/commit?
- Are the recorded counts consistent with the report?
- If the baseline is missing or postdates the change, say so. You cannot prove
  improvement without a before.

### 2. Re-run the exact checks

Use the same commands, flags, and scope as the baseline. Do not silently change
`--max`, `--site`, or routes — that invalidates comparison.

```bash
node <skill>/scripts/seo-audit.mjs \
  --url=<target> \
  --site=<canonical-site> \
  --max=<same-as-baseline> \
  --json=<evidence-dir>/verify.json
```

Record the exit code exactly.

### 3. Compare finding by finding

For each approved finding:

| Finding | Baseline | Verify | Evidence | Verdict |
| --- | --- | --- | --- | --- |
| `<ID>` | `<state>` | `<state>` | `<path>` | FIXED / OPEN / REGRESSED / NOT REPRODUCED |

Rules:

- `FIXED` requires the original evidence method to pass now.
- A finding that disappeared because the page was removed/redirected is not
  automatically fixed; check the replacement and the URL map.
- A finding that "passes" only because the audit skipped it is `UNVERIFIED`.

### 4. Regression sweep

Check every surface the change could plausibly touch:

- [ ] Status codes: no new 4xx/5xx on sitemap or top URLs.
- [ ] Redirects: no new chains, loops, or homepage redirects.
- [ ] Canonicals: still self-referencing and absolute.
- [ ] Titles/descriptions: no new duplicates or truncation.
- [ ] H1/lang/viewport: unchanged or improved.
- [ ] Structured data: parses, matches visible content, no new errors.
- [ ] Sitemap: still 200, canonical, indexable; no removed URLs without redirect.
- [ ] robots.txt: unchanged unless approved; no accidental `Disallow: /`.
- [ ] Rendered DOM: metadata and primary content still present without JS.
- [ ] Mobile: no layout or content parity regression.
- [ ] CWV: lab baseline not materially worse; field data direction if available.
- [ ] Consent: no vendor request before opt-in; revoke still works.
- [ ] Security headers: not removed by the change.
- [ ] Accessibility: no new missing alt, labels, contrast, focus issues.
- [ ] Analytics: exactly one page_view per route; no duplicate tags.

### 5. Adversarial spot checks

Pick 10 URLs: top traffic, newest, oldest, one per template, one localised, one
faceted, one low-value.

- Fetch with `curl` and with JS disabled.
- Compare `view-source:` vs rendered DOM.
- Check `HEAD` vs `GET` status.
- Follow every redirect hop.
- Validate JSON-LD on 3 of them.
- Test a 404 and a 410 (or the closest available).
- Test the canonical target of each sample.

### 6. Compare before/after honestly

```text
Baseline: P0=<n> P1=<n> P2=<n> P3=<n> exit=<0|1>
Verify:   P0=<n> P1=<n> P2=<n> P3=<n> exit=<0|1>
Fixed: <n>  New: <n>  Unchanged: <n>
```

New findings are regressions unless proven pre-existing. If the implementer
claims they are pre-existing, require evidence from the baseline artifact.

### 7. Verdict rules

- `PASS`: all success criteria met; no open P0/P1 and no waivers; no unresolved
  regression; evidence complete.
- `CONDITIONAL PASS`: success criteria met; no open P0; any open P1 has a
  written human-approved waiver with expiry and compensating control; P2/P3
  follow-ups have owners/dates.
- `FAIL`: any success criterion unmet, any open P0, any open P1 without a
  waiver, or evidence missing.
- `BLOCKED`: cannot access the artifact or required data. Do not guess.

## Output

Write `<evidence-dir>/VERIFICATION.md`:

```markdown
# Verification — <mission-id>

Verdict: PASS | CONDITIONAL PASS | FAIL | BLOCKED
Date: YYYY-MM-DD
Verifier: <agent/human>
Artifact: <commit/build/URL>

## Success criteria
| ID | Criterion | Target | Observed | Verdict | Evidence |
| --- | --- | --- | --- | --- | --- |

## Findings
| ID | Baseline | Verify | Verdict | Evidence |
| --- | --- | --- | --- | --- |

## Regressions
<list or "none">

## Adversarial checks
<commands + outcomes>

## Residual risk
<what could still go wrong>

## Sign-off
<name/date or "not signed">
```

## Stop and ask if

- The artifact under test is not the approved build.
- Baseline and verify scopes differ.
- A P0 is found (notify immediately; do not bury it in a report).
- Verification requires production writes or destructive tests.
- Evidence would contain secrets or personal data.

## Final response format

```text
MISSION: <id>
VERDICT: PASS | CONDITIONAL PASS | FAIL | BLOCKED
CRITERIA: <met>/<total>
FIXED: <n> | OPEN: <n> | REGRESSED: <n>
NEW P0/P1: none | <IDs>
EVIDENCE: <paths>
RESIDUAL RISK: <one line>
NEXT: <single action>
```
