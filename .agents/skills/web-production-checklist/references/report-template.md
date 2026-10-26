# Production Audit Report

**Report version:** {{VERSION}}
**Audit mode:** Stage 1 — read-only
**Generated (UTC):** {{TIMESTAMP}}
**Project:** {{PROJECT_NAME}}
**Audited root:** `{{PROJECT_ROOT}}`
**Revision:** `{{COMMIT_OR_WORKTREE_STATE}}`
**Prepared by:** {{AUDITOR}}
**Deployment inspected:** {{PUBLIC_URL_OR_NONE}}
**Scope:** {{SCOPE_SUMMARY}}

## 1. Executive Summary

{{EXECUTIVE_SUMMARY}}

### Audit scope and method

| Field | Value |
| --- | --- |
| Applications in scope | {{APPS}} |
| Framework/runtime | {{STACK}} |
| Package manager | {{PACKAGE_MANAGER}} |
| Environment(s) inspected | {{ENVIRONMENTS}} |
| Access and evidence limits | {{LIMITATIONS}} |
| Baseline matrix items | 248 |
| Matrix items assessed | {{MATRIX_ITEMS_ASSESSED}} |

### Status counts

| Status | Count |
| --- | ---: |
| `PASS` | {{COUNT_PASS}} |
| `PARTIAL` | {{COUNT_PARTIAL}} |
| `FAIL` | {{COUNT_FAIL}} |
| `MISSING` | {{COUNT_MISSING}} |
| `UNVERIFIED` | {{COUNT_UNVERIFIED}} |
| `NEEDS_DECISION` | {{COUNT_NEEDS_DECISION}} |
| `NOT_APPLICABLE` | {{COUNT_NOT_APPLICABLE}} |
| **Total** | **{{TOTAL_COUNT}}** |

### Severity counts of open findings

| Severity | Count |
| --- | ---: |
| `P0` | {{COUNT_P0}} |
| `P1` | {{COUNT_P1}} |
| `P2` | {{COUNT_P2}} |
| `P3` | {{COUNT_P3}} |

### Release posture

{{RELEASE_POSTURE}}

Use one of: `Blocked by P0/P1 findings`, `Blocked by unverified critical controls`, `Developer decision required`, or `No blocking findings observed in audited scope`. Do not use a bare readiness claim. Explain the evidence behind the posture, remaining accepted risks, and whether a production release decision can be made without further developer action.

### Highest-risk themes

{{TOP_RISKS}}

### Important limitations

{{IMPORTANT_LIMITATIONS}}

## 2. Complete Production Audit Matrix

All 248 baseline items must appear exactly once. Status values are limited to `PASS`, `PARTIAL`, `FAIL`, `MISSING`, `UNVERIFIED`, `NEEDS_DECISION`, and `NOT_APPLICABLE`. Severity values are limited to `P0`, `P1`, `P2`, and `P3`. Evidence must be reproducible and must not contain secret values or customer PII.

| ID | Category | Checklist Item | Status | Severity | Evidence / File Location | Problem / Risk | Recommended Fix |
| --- | --- | --- | --- | --- | --- | --- | --- |
{{MATRIX_ROWS}}

## 3. Critical Findings P0–P3

### P0 — Immediate or catastrophic

{{P0_FINDINGS_OR_NONE}}

### P1 — Production blockers

{{P1_FINDINGS_OR_NONE}}

### P2 — Material risk and quality gaps

{{P2_FINDINGS_OR_SUMMARY}}

### P3 — Lower-risk hardening and polish

{{P3_FINDINGS_OR_SUMMARY}}

## 4. Missing Integrations and Developer Decisions

### Missing access, data, or integrations

| ID(s) | Missing item | Why it matters | What is needed | Blocks verification | Owner |
| --- | --- | --- | --- | --- | --- |
{{MISSING_INTEGRATIONS_ROWS}}

### Decisions required

| ID(s) | Decision | Options and recommendation | Impact if unresolved | Owner |
| --- | --- | --- | --- | --- |
{{DECISION_ROWS}}

## 5. Proposed Implementation Plan

No batch below is authorized until the developer explicitly approves it by name or by its exact IDs. Deployments, data deletion, destructive migrations, DNS changes, and secret rotation are outside this plan and must be handled separately by authorized operators.

| Batch | IDs | Objective and smallest safe change | Areas/files likely affected | Validation | Rollback or containment | Dependencies | Approval status |
| --- | --- | --- | --- | --- | --- | --- | --- |
{{IMPLEMENTATION_BATCH_ROWS}}

### Sequencing and dependencies

{{SEQUENCING_NOTES}}

## 6. Verification Results

### Audit baseline

| Field | Value |
| --- | --- |
| Audit started (UTC) | {{STARTED_AT}} |
| Audit completed (UTC) | {{COMPLETED_AT}} |
| Revision/worktree | {{BASELINE_REVISION}} |
| Matrix counts at baseline | PASS {{COUNT_PASS}}; PARTIAL {{COUNT_PARTIAL}}; FAIL {{COUNT_FAIL}}; MISSING {{COUNT_MISSING}}; UNVERIFIED {{COUNT_UNVERIFIED}}; NEEDS_DECISION {{COUNT_NEEDS_DECISION}}; NOT_APPLICABLE {{COUNT_NOT_APPLICABLE}} |
| Open P0/P1 at baseline | {{BASELINE_OPEN_P0_P1}} |

### Checks performed

| Check | Scope/command | Result | Evidence |
| --- | --- | --- | --- |
{{CHECKS_PERFORMED_ROWS}}

### Checks not run

{{CHECKS_NOT_RUN}}

State clearly which build, test, browser, load, provider, DNS, production, or authenticated checks were not run and why. Do not imply that unrun checks passed.

### Limitations

{{VERIFICATION_LIMITATIONS}}

### Sources consulted (official only)

{{OFFICIAL_SOURCES_USED}}

List only the primary sources actually used, with the access date and the specific claim they supported. Do not cite search-result pages, generated summaries, or random blogs. See `references/authoritative-sources.md`.

### Stage 2 verification log

No Stage 2 implementation has been approved or started for this baseline. Append dated entries here after explicit approval. Preserve the original baseline counts and evidence; never overwrite them.

## 7. Developer Action Required

### Blocking actions

{{BLOCKING_DEVELOPER_ACTIONS}}

### Non-blocking follow-ups

{{NON_BLOCKING_DEVELOPER_ACTIONS}}

### Access and credentials requested

Name the environment variables or platform settings needed. Never paste secret values into this report, chat, issue trackers, or tickets.

{{ACCESS_REQUESTS}}

## 8. Approval Checklist

A checked box here is not authorization by itself. Send an explicit message naming the batch or exact finding IDs you approve for implementation.

- [ ] Approval of findings only; implementation is **not** authorized.
- [ ] Batch {{BATCH_NUMBER}}: {{BATCH_SCOPE}} — IDs: {{BATCH_IDS}}.
- [ ] Additional scoped findings: {{SCOPED_IDS}}.
- [ ] Nothing approved; keep the report as audit evidence only.

### Approval scope restatement

Use this format when approving:

> I approve implementation of {{BATCH_OR_IDS}}. The scope is limited to those items and any directly required, documented changes. I understand deployment, destructive migrations, data deletion, DNS changes, and secret changes require separate authorization.

"Review the report", "looks good", a reaction emoji, or approval of the audit itself is not implementation approval.

**Implementation has not started. Review the findings and explicitly approve the findings or implementation batches you want addressed. No application code has been changed during this audit.**
