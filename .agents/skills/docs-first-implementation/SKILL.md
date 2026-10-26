---
name: docs-first-implementation
description: Researches current authoritative, version-matched documentation before implementing features, integrations, upgrades, or framework-specific behavior. Use when the user explicitly requests a docs-first workflow or when correctness depends on current external APIs and official documentation.
---

# Docs-First Implementation

Implement after understanding the authoritative behavior, not after pattern-matching from memory.

Use this skill when a change depends on a framework, library, API, protocol, cloud service, database, payment provider, or other external system whose behavior could have changed or whose details are easy to get wrong. Do not turn small local edits into research projects; use the depth the task actually needs.

## Operating contract

1. **Read before writing.** Find the official, current, version-matched source for every external behavior that affects the implementation.
2. **Never guess an API.** Do not invent function names, parameters, config keys, response fields, headers, scopes, or error behavior.
3. **Use authoritative sources.** Prefer first-party documentation, specifications, reference pages, migration guides, release notes, and official examples. Do not rely on random blogs, tutorials, SEO pages, or generated summaries.
4. **Match the installed version.** Documentation for the latest release is not automatically correct for a pinned older version. Check the project's runtime and dependency versions before selecting docs.
5. **Understand, then adapt.** Do not paste examples blindly. Adapt the documented approach to the repository's architecture, error handling, types, security model, and style.
6. **Ask instead of pretending.** If docs are unavailable, materially conflict, or omit a decision that changes the result, ask a focused question. Do not silently fill a critical gap with a guess.
7. **Make the smallest safe change.** Do not perform unrelated refactors, broad reformatting, dependency upgrades, or speculative architecture changes.
8. **Verify against documentation.** Tests and checks must cover the documented behavior, required configuration, limits, failure modes, and security constraints.
9. **Report evidence.** Name the docs used and what they established. Do not claim a source was read when it was not.
10. **Respect access and safety.** Use only docs you are authorized to access. Never bypass paywalls, access controls, or legal terms. Never place secrets or customer data in research notes or output.

## Workflow

### 1. Frame the task and inspect the repository

Before researching:

- Restate the requested user/business outcome and the acceptance criteria.
- Read the relevant repo instructions and existing implementation patterns.
- Identify the runtime and exact versions of relevant dependencies from `package.json`, lockfiles, runtime config, framework config, and installed type definitions.
- Note constraints: TypeScript version, framework mode, supported browsers/runtimes, deployment platform, existing auth, data layer, and test tooling.
- Identify what is already known from the codebase versus what genuinely requires external documentation.

If two different interpretations would produce materially different implementations, resolve that before coding. Otherwise, proceed with a stated interpretation.

### 2. Locate the right sources

Use the following hierarchy:

1. **Exact version of the first-party documentation** for the framework, SDK, or platform.
2. **Official API reference** for signatures, configuration, limits, errors, and required permissions.
3. **Official guides/migration/release notes** for context, deprecations, and changed behavior.
4. **Standards and specifications** (W3C, IETF, OWASP, language specs) when the feature implements a protocol or security-sensitive behavior.
5. **Official source code, type definitions, OpenAPI schema, or tests** only when the documentation is incomplete or ambiguous. Treat this as supplemental evidence, not a substitute for reading the documented behavior.
6. **User-provided internal documentation or specs** when the system is private and there is no public authority.

Do not use a source merely because it ranks well in search. Verify that it is official and applies to the project's version.

### 3. Read and extract implementable requirements

While reading, capture:

- exact imports, package names, APIs, configuration keys, and required versions;
- required environment variables or platform settings;
- authentication, authorization, scopes, and permissions;
- request/response shapes, limits, pagination, retries, and rate limits;
- error codes, failure behavior, and idempotency requirements;
- security, privacy, and data-handling constraints;
- deprecations and migration warnings;
- documented edge cases and unsupported behavior;
- official examples worth adapting, and why they are relevant.

Stop researching when you can explain how the feature should work and what evidence supports it. Continue only for gaps that affect correctness. Keep a short research log with URL/title, version/section, access date, and the specific claim supported.

### 4. Resolve uncertainty

Ask the user only when a gap is material and cannot be resolved safely from the repo or authoritative sources. Examples:

- docs conflict and the installed version is unknown;
- multiple valid implementations have materially different product behavior;
- credentials, account access, or provider approval is required;
- the provided API is undocumented or experimental;
- the behavior is deprecated and the replacement is a breaking change;
- the task would be destructive, irreversible, or legally sensitive;
- verification requires sending real email, charging a card, migrating data, or touching production.

Ask at most three precise questions, include the options and a recommended default, and explain why the answer changes the implementation. Do not respond with a vague "please provide more details."

For non-blocking ambiguity, state the assumption and proceed. Do not stop for style preferences that the codebase already answers.

### 5. Plan the implementation

Map documented requirements to the existing codebase:

- files and modules to change;
- config, env, provider, and deployment settings;
- data model or API-compatibility impact;
- failure handling and retry behavior;
- tests required for documented behavior;
- rollback/containment for risky changes.

Choose the smallest approach that follows both the docs and the repository's conventions. Prefer existing, supported dependencies. Add a new dependency only if it is genuinely required, compatible, and approved when the environment requires approval. Do not upgrade unrelated packages to obtain a feature.

### 6. Implement

- Follow the documented API and configuration exactly where it matters.
- Keep boundaries explicit; validate untrusted input and handle documented error states.
- Respect auth, permission scopes, rate limits, idempotency, and provider constraints.
- Keep types and error handling consistent with the repository.
- Do not copy secrets, production identifiers, or unsafe example values.
- Do not disable security controls, tests, or strict checks to make the code work.
- Add comments only where a non-obvious documented constraint must be preserved.
- Keep the diff limited to the task and directly required supporting changes.

### 7. Verify

Use the project's documented commands and scripts:

- targeted tests for the new behavior and its failure paths;
- type-check, lint, and production build when available and safe;
- integration tests with sandbox/test credentials, never live customer data;
- manual checks of documented constraints, limits, and error handling;
- review generated client/server boundaries for accidental secret exposure.

If a provider, deployment, credential, or production-only check cannot be performed, say so explicitly and mark it unverified. A successful compile is not proof that an external integration works.

### 8. Report

Keep the final report concise and evidence-based:

- what was implemented;
- **documentation consulted**: title, version/section, URL, access date, and the specific claim;
- key decisions and assumptions;
- files changed;
- tests/checks run and results;
- what remains unverified;
- any follow-up action requiring developer access or approval.

Do not dump raw documentation or internal chain-of-thought. Do not claim production readiness from a build alone.

## Source rules

- **Prefer primary sources.** A vendor's current documentation and release notes outrank third-party summaries.
- **Version over freshness.** The exact project version outranks a newer major-version page. Use migration guides when intentionally upgrading.
- **Specification over blog post.** For protocols and platform behavior, use the standard or first-party reference.
- **Code only as a tie-breaker.** Source/types can reveal a signature, but docs explain intended behavior and support expectations.
- **Record conflicts.** If sources disagree, state the conflict, choose the version-appropriate behavior, and explain the risk.
- **No invented citations.** Link only pages actually opened and relevant to the claim.
- **No confidential leakage.** Do not quote secrets, private URLs, tokens, customer data, or licensed material beyond what is necessary and permitted.

## Stop conditions

Pause and ask or hand back to the user when:

- no authoritative documentation is available for a core behavior;
- the installed version cannot be determined and behavior differs across versions;
- sources conflict in a way that affects security, data, cost, or user-visible behavior;
- required provider access, test credentials, or approvals are missing;
- the implementation requires destructive migration, deployment, DNS, billing, or production data changes;
- the documented solution would weaken security, privacy, or accessibility;
- a new dependency or breaking upgrade is necessary but not approved;
- the repository is already in a state that makes the change unsafe to isolate.

## Anti-patterns

- Coding first and searching for docs only when it fails.
- Trusting a recent tutorial instead of the versioned API reference.
- Treating types or autocomplete as a complete explanation of runtime behavior.
- Adding an unplanned dependency because an example used it.
- Copying a snippet that includes secrets, unsafe defaults, or obsolete APIs.
- Assuming local success proves webhook delivery, email delivery, rate limits, or production configuration.
- Reporting "done" without naming the docs or the tests that justify it.
