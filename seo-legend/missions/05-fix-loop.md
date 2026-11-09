# Mission 05 — Bounded fix loop

Use when verification fails. The loop prevents thrashing, endless "try
something" changes, and agents that keep editing until the symptom hides.

---

## Rules

1. Maximum **3 iterations** per finding unless a human extends the budget.
2. Every iteration follows the same five steps; no skipping.
3. One hypothesis per iteration. Do not change three things at once.
4. Re-run the **same** verification command each time.
5. If the same failure repeats twice with different fixes, stop and escalate.
6. Never weaken the check to make it pass. Never fake data.
7. Record everything, including failed attempts.

## Loop

### Step 1 — Reproduce (mandatory)

```text
Finding: <ID>
Command: <exact command>
Observed: <status/output/JSON path>
Expected: <success criterion>
Environment: <URL/commit/build>
```

If it does not reproduce, stop the loop and reconcile the finding rather than
inventing a fix.

### Step 2 — Diagnose the root cause

Answer in one paragraph:

- What is the actual mechanism producing the failure?
- Which layer owns it (server, CDN, template, data, content, config)?
- What evidence proves that layer is the cause?
- What else could produce the same symptom, and why did you rule it out?

Do not proceed with "maybe it's the cache".

### Step 3 — Change one thing

- Smallest change that addresses the diagnosed cause.
- Note the expected effect and the metric that will show it.
- Note the rollback.
- Commit separately with the finding ID.

### Step 4 — Verify

```bash
# Same command as Step 1. No flag changes.
node <skill>/scripts/seo-audit.mjs --url=<target> --site=<site> \
  --max=<same> --json=<evidence-dir>/loop-<n>.json
```

Record:

```text
Iteration: 1
Change: <one line + commit>
Result: PASS | FAIL | PARTIAL
Evidence: <path>
New side effects: none | <details>
```

### Step 5 — Decide

| Result | Next |
| --- | --- |
| PASS | Re-run the full regression sweep, then close |
| PARTIAL | Continue with one new hypothesis (counts as next iteration) |
| FAIL, new evidence | Continue with one new hypothesis |
| FAIL, same evidence twice | **Stop and escalate** |
| New P0/P1 introduced | Revert the iteration immediately, then escalate |
| Fix requires policy violation | **Stop** |

## Escalation packet

When the loop stops, send:

```yaml
mission: <id>
finding: <id>
iterations_used: <n>/3
attempts:
  - change: <what>
    result: <what happened>
    evidence: <path>
current_hypothesis: <one sentence or "unknown">
blocked_by: <access | conflicting requirement | upstream bug | unclear spec>
options:
  - <option A + risk>
  - <option B + risk>
recommended: <option>
needs: <decision/access>
```

## Anti-patterns (stop immediately)

- Changing the test, scope, or `--max` until the failure disappears.
- Adding `noindex` to hide a content problem.
- Redirecting a failing URL to the homepage.
- Disabling a check "because it's noisy".
- Bumping `lastmod` without a content change.
- Adding fake reviews/ratings/schema to satisfy a rich-result check.
- Editing production directly because staging "doesn't reproduce".
- Stacking fixes without verifying each one.

## Loop closure

A finding closes only when:

- [ ] The original verification command passes.
- [ ] The full regression sweep passes.
- [ ] Before/after evidence is saved.
- [ ] The change is committed with the finding ID.
- [ ] The fix is documented in the mission log.
- [ ] Any follow-up risk is recorded with an owner.

## Final response format

```text
MISSION: <id>
FINDING: <id>
ITERATIONS: <n>/3
RESULT: FIXED | ESCALATED
ROOT CAUSE: <one line>
CHANGE: <commit + one line>
EVIDENCE: <before/after paths>
SIDE EFFECTS: none | <details>
NEXT: <single action>
```
