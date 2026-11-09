# Agent sign-off gate

The final gate. An agent may **recommend** sign-off; a human records it for
`L2`/`L3`. If any required item is false, the verdict is `FAIL` or
`CONDITIONAL` — never `PASS` with a verbal caveat.

---

## Mission identity

```yaml
mission_id: <SEO-YYYY-NNN>
objective: <one line>
risk_tier: L0 | L1 | L2 | L3
agent: <model/session>
implementer: <name/agent>
verifier: <name/agent — must differ from implementer for L2/L3>
date: YYYY-MM-DD
commit/build: <sha/artifact>
target: <production/staging/local URL>
```

## 1. Brief and scope

- [ ] Mission brief exists and is approved at the required level.
- [ ] Objective was measurable and is now addressed.
- [ ] Scope respected — no out-of-scope edits in the diff.
- [ ] Non-goals untouched.
- [ ] Any scope change has a versioned, approved amendment.

Evidence: `<brief path, diff stat>`

## 2. Evidence completeness

- [ ] Baseline artifact exists, predates changes, same scope/flags.
- [ ] After artifact exists, same scope/flags.
- [ ] Every finding has an ID, severity, method, and evidence path.
- [ ] No `PASS` is based on "looks good" or an unopened source.
- [ ] GSC/PSI/validator claims include a screenshot/export with a date.
- [ ] False positives were removed with proof.
- [ ] No fabricated metric, rank, competitor number, or review.

Evidence: `<artifact paths + ledger>`

## 3. Findings closure

| Severity | Open | Fixed | Waived | Total |
| --- | --- | --- | --- | --- |
| P0 | | | | |
| P1 | | | | |
| P2 | | | | |
| P3 | | | | |

- [ ] **P0 = 0 open.** No waiver allowed.
- [ ] **P1 = 0 open**, or a written waiver with owner, reason, expiry, and
      compensating control. (Waiving P1 requires human sign-off.)
- [ ] P2 fixed or scheduled with owner + date.
- [ ] P3 recorded in the backlog.
- [ ] Waivers are specific and time-bound, not "known issue".

### Waiver register

| ID | Severity | Reason | Risk accepted by | Compensating control | Expiry |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## 4. Technical correctness

- [ ] One canonical host/protocol/trailing-slash policy enforced.
- [ ] Sitemap contains only 200, indexable, canonical URLs.
- [ ] Every indexable page has one absolute self-canonical.
- [ ] No `noindex` + canonical conflicts.
- [ ] No redirect chains or loops introduced.
- [ ] robots.txt intentional and production-safe.
- [ ] Primary content/metadata exist without JavaScript.
- [ ] Rendered DOM matches initial HTML for critical elements.
- [ ] Titles/descriptions/H1s unique and intentional.
- [ ] Structured data parses, matches visible content, required fields present.
- [ ] Pagination/facets/search have documented policies.
- [ ] Mobile viewport and content parity verified.

Evidence: `<audit JSON paths + samples>`

## 5. Performance and UX

- [ ] Field CWV baseline recorded with source and date.
- [ ] No material LCP/INP/CLS regression vs baseline.
- [ ] LCP element identified and not lazy-loaded.
- [ ] Media dimensions reserved (no new CLS).
- [ ] No render-blocking third party added above the fold.
- [ ] Mobile rendering verified at 320/360/390/768 px.
- [ ] No accessibility regression (axe/keyboard/contrast).
- [ ] Consent banner does not block content or harm LCP.

Evidence: `<PSI/CrUX screenshot, Lighthouse JSON, axe report>`

## 6. Trust, consent, and policy

- [ ] No vendor request before consent (clean profile, network log).
- [ ] No `_ga`/`_fbp` cookies before consent.
- [ ] Reject all works and purges cookies.
- [ ] Revoke works and stops hits.
- [ ] No PII in analytics payloads/URLs.
- [ ] Reviews/ratings/claims are genuine and substantiated.
- [ ] No policy-violating tactic used or proposed.
- [ ] AI-assisted content reviewed and edited by a human.
- [ ] Legal/privacy review completed where required.

Evidence: `<HAR/network screenshot, policy review notes>`

## 7. Verification

- [ ] Independent verifier ran the same checks as the baseline.
- [ ] All success criteria met (table below).
- [ ] No new P0/P1 findings.
- [ ] No unresolved regression.
- [ ] Adversarial spot checks performed (≥10 URLs).
- [ ] Red-team review completed for P0/P1 changes.
- [ ] Fix loop did not exceed the agreed budget.

### Success criteria

| ID | Criterion | Target | Observed | Verdict | Evidence |
| --- | --- | --- | --- | --- | --- |
| SC-01 | | | | | |
| SC-02 | | | | | |
| SC-03 | | | | | |

## 8. Rollback and operations

- [ ] Rollback steps are exact and valid for the actual changes.
- [ ] Rollback was tested on staging or a dry run.
- [ ] Backup/snapshot exists for data/content changes.
- [ ] Monitoring/alerts cover the changed surfaces.
- [ ] On-call owner and escalation path recorded.
- [ ] Post-deploy verification window agreed (24h/7d/28d).

Evidence: `<rollback doc + test output>`

## 9. Handoff

```yaml
mission: <id>
status: done | conditional | blocked
scope: <hosts/paths/locales>
risk_tier: <L0-L3>
changed:
  - <file/URL + what changed>
evidence:
  - <baseline>
  - <after>
  - <validator/screenshots>
open:
  - <ID + severity + owner + date>
waivers:
  - <ID + expiry>
rollback: <exact command/steps>
monitoring: <dashboards/alerts>
next: <single next action>
```

## 10. Verdict

Choose one:

- **PASS** — every required gate true, no open P0/P1, no waivers, evidence
  complete.
- **CONDITIONAL PASS** — success criteria met, no open P0, any open P1 has a
  human-approved written waiver with expiry and compensating control, and
  P2/P3 follow-ups have owners/dates. State the conditions explicitly.
- **FAIL** — any success criterion unmet, any open P0, any open P1 without a
  waiver, or evidence missing.
- **BLOCKED** — cannot verify due to missing access/data. Do not dress this up
  as a pass.

```text
VERDICT: PASS | CONDITIONAL PASS | FAIL | BLOCKED
P0 open: <n>   P1 open: <n>   P1 waived: <n>
Criteria met: <n>/<n>
Regressions: none | <details>
Residual risk: <one paragraph>
Conditions: <if conditional>
```

## 11. Approval record

| Role | Name | Decision | Date/time | Signature/reference |
| --- | --- | --- | --- | --- |
| Implementer | | | | |
| Independent verifier | | | | |
| Human owner (`L2`) | | | | |
| Deploy approver (`L3`) | | | | |

## 12. Honesty statement

By signing, the agent confirms:

- Every claim in the report is backed by an artifact in the evidence directory.
- No test was weakened, skipped, or altered to produce a pass.
- No data, review, ranking, or metric was fabricated.
- All open risks and waivers are disclosed above.
- The rollback is valid for the changes actually shipped.
- Any inability to verify is stated as `BLOCKED`, not hidden.

**An honest FAIL is a successful mission. A fabricated PASS is a failed one.**
