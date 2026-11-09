# Risk, ethics, and policy

SEO can harm users, break the law, or get a site removed. This file is the
guardrail. Read it before any tactic that feels clever.

---

## 1. Hard rules

Never do any of the following, even if asked:

- Cloaking (different content to crawlers vs users).
- Doorway pages or multiple near-duplicate sites/pages for the same query.
- Hidden text or links (white-on-white, off-screen, zero opacity, tiny links).
- Keyword stuffing or unnatural keyword lists.
- Buying/selling links for ranking, link exchanges, PBNs, automated links.
- Fake reviews, review gating, or incentivised positive reviews.
- Scraping/republishing content without added value.
- Scaled content abuse (mass AI/templated pages with no unique value).
- Site reputation abuse (hosting third-party content to borrow authority).
- Expired-domain abuse.
- Sneaky redirects or malicious redirects.
- Machine-generated queries against Google Search (rank scraping).
- Fake urgency, fake scarcity, fake credentials, fake case studies.
- Serving malware/unwanted software or hijacking back-button behaviour.
- Misleading functionality (fake tools/generators).
- Any attempt to bypass a manual action or policy.

If a request requires one of these, refuse and explain the policy and the
legitimate alternative.

---

## 2. Google spam policies (summary)

From Google Search Essentials (see `references/13-sources.md`):

| Policy | What it targets |
| --- | --- |
| Cloaking | Different content for users vs search engines |
| Doorway abuse | Pages built to rank and funnel to another destination |
| Expired domain abuse | Repurposed expired domains with low-value content |
| Hacked content | Injected spam/malware |
| Hidden text/links | Content only search engines can see |
| Keyword stuffing | Unnatural keyword repetition/lists |
| Link spam | Paid/exchanged/automated links, low-quality directories |
| Machine-generated traffic | Automated Google queries without permission |
| Malicious practices | Malware, unwanted software, back-button hijacking |
| Misleading functionality | Fake tools/services |
| Scaled content abuse | Mass low-value content, including AI-generated |
| Scraping | Copied content without value |
| Site reputation policy | Third-party content hosted to borrow host authority |
| Sneaky redirects | Deceptive redirects |
| Thin affiliation | Copied affiliate content with no added value |
| User-generated spam | Spam in comments/forums/uploads |

Penalties range from demotion to complete removal, and can be manual or
algorithmic.

---

## 3. AI content policy

AI-assisted content is allowed when it is helpful and original. It becomes abuse
when:

- Pages are generated at scale with little or no value.
- Content is unedited, factually wrong, or contradictory.
- Authors/credentials are invented.
- It scrapes/rewrites others' content.
- It exists only to capture keyword permutations.

Safe pattern:

1. Human defines intent, outline, and unique value.
2. AI assists with drafting/structure.
3. Human fact-checks, adds experience, edits voice.
4. Editor reviews and approves.
5. Publish, measure, update.

---

## 4. Legal and compliance overlaps

| Area | Risk | Control |
| --- | --- | --- |
| Copyright | Copied text/images | Licence, attribution, original assets |
| Trademarks | Competitor names in ads/metadata | Nominative fair use only; legal review |
| Consumer law | Fake reviews, urgency, prices | Accurate, substantiated claims |
| Privacy | Analytics PII, cookies | Consent, minimisation, notices |
| Accessibility | Excluding users; legal duty | WCAG 2.2 AA target |
| Contracts | Link insertion/paid content | Disclose, qualify with `rel=sponsored` |
| Regulated sectors | Health/finance claims | Expert review, disclaimers |

When in doubt, ask legal/compliance. An agent must stop and escalate.

---

## 5. Risk register

| Risk | Likelihood | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| Deindexing after robots change | Low | Critical | Staging test, diff, approval | |
| Redirect chains | Medium | High | Automated hop test | |
| Schema mismatch | Medium | Medium | Rich Results Test + visible check | |
| CWV regression | Medium | Medium | Budgets, CI Lighthouse | |
| Consent leak | Low | High | Pre-consent network test | |
| Content cannibalisation | High | Medium | Intent map, consolidation | |
| Migration traffic loss | Medium | Critical | URL map, rollback, monitoring | |

---

## 6. Decision framework

For any tactic, ask:

1. Would a real user be better off?
2. Would I be comfortable explaining it to the site owner and to Google?
3. Does it scale without degrading quality?
4. Is it durable, or does it break on the next update?
5. Is it measurable and reversible?
6. Does it respect privacy, accessibility, and the law?

If any answer is "no" or "not sure", don't ship it.

---

## 7. Red flags in requests

- "Just make it rank #1 in a week."
- "Clone this competitor's content."
- "Buy links but make them look natural."
- "Hide this text for Google only."
- "Create 500 city pages with the same copy."
- "Block the AI bots but still get cited."
- "Use fake reviews to boost the rating."
- "Redirect all old pages to the homepage."
- "Turn off the cookie banner; it hurts conversions."
- "Index the staging site so we can test."

Respond with the policy, the risk, and the legitimate alternative.

---

## 8. Incident response

If something goes wrong:

1. **Stop** further changes.
2. Preserve evidence (logs, diffs, screenshots).
3. Assess scope (which URLs, markets, durations).
4. Roll back if possible.
5. Fix the root cause.
6. Re-crawl/re-index and monitor.
7. Document the incident and update the checklist.
8. Notify stakeholders; if a manual action is involved, follow GSC guidance and
   only request reconsideration after the fix is verified.

---

## 9. Ethics acceptance checks

- [ ] No policy-violating tactic was used or proposed.
- [ ] Claims are substantiated and dated.
- [ ] Reviews are genuine and policy-compliant.
- [ ] Links are earned/editorial or properly qualified.
- [ ] AI content is reviewed and adds value.
- [ ] Consent and privacy are respected.
- [ ] Accessibility was not regressed.
- [ ] Risks are documented with owners.
- [ ] A human approved any `L3` change.
- [ ] Rollback is possible.
