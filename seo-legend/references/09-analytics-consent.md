# Analytics, consent, and privacy

Analytics is only useful if it is lawful, consent-aware, and not corrupting the
user experience. Consent is a product requirement, not a banner afterthought.

---

## 1. Legal baseline (not legal advice)

Depending on jurisdiction (UK GDPR/PECR, EU GDPR/ePrivacy, US state laws,
Brazil LGPD, etc.):

- Non-essential cookies/storage generally require **prior consent**.
- Consent must be freely given, specific, informed, and unambiguous.
- Rejecting must be as easy as accepting.
- Consent must be withdrawable at any time.
- You must record consent (what, when, version).
- Analytics/marketing scripts must not run before consent where required.
- Privacy notice must explain purposes, vendors, retention, and rights.
- Data minimisation and retention limits apply.

Get jurisdiction-specific legal review. This skill provides engineering
guidance, not legal advice.

---

## 2. Consent architecture

### 2.1 Categories

| Category | Examples | Default |
| --- | --- | --- |
| Essential | Session, security, consent record, load balancing | On |
| Analytics | GA4, internal analytics | Off until consent |
| Marketing | Meta Pixel, ads, remarketing | Off until consent |
| Preferences | Language, theme | Usually essential/functional |

### 2.2 Banner requirements

- [ ] Appears before non-essential scripts run.
- [ ] Accept and reject are equally prominent.
- [ ] Granular toggles for analytics/marketing.
- [ ] "Save preferences" works without accepting everything.
- [ ] Link to the privacy/cookie notice.
- [ ] No pre-ticked optional boxes.
- [ ] No cookie wall for essential content.
- [ ] Re-openable later (footer link).
- [ ] Remembers choice and version.
- [ ] Works without JavaScript? At minimum, the site remains usable.
- [ ] Does not block the LCP element or cause CLS.

### 2.3 Implementation order

```text
1. Consent defaults are set (denied) BEFORE any vendor script is requested.
2. User chooses.
3. Consent is persisted (cookie/localStorage) with version + timestamp.
4. Consent update is sent.
5. Only then are vendor scripts loaded.
6. On revoke: update consent, stop further hits, purge vendor cookies.
```

Never load `gtag.js` or `fbevents.js` "just to set defaults". Queue the consent
default in a small inline stub, then load the vendor after opt-in.

---

## 3. Google Analytics 4

### 3.1 Setup

- Create a GA4 property and web data stream.
- Use the Measurement ID (`G-XXXXXXX`), not the old UA ID.
- Enable enhanced measurement only for events you want.
- Mark key events/conversions deliberately.
- Configure data retention and IP anonymisation settings.
- Link Search Console and Google Ads if appropriate.
- Exclude internal traffic and known bots.
- Use debug mode / DebugView for QA.

### 3.2 Consent Mode

- Set `analytics_storage: "denied"` by default (and ad storage for marketing).
- Update to `"granted"` only after consent.
- On revoke, update to `"denied"` and purge cookies.
- Basic consent mode = no tags until consent (simplest, strongest privacy).
- Advanced consent mode = cookieless pings before consent (Google modelling);
  requires legal review and careful configuration.
- Do not send personal data in event parameters.

### 3.3 SPA tracking

- Send a `page_view` on initial load and on every client-side route change.
- Avoid duplicate page views from both the vendor auto-pageview and manual calls.
- Update page title/location before sending.
- Test back/forward navigation.

### 3.4 QA

- [ ] No `google-analytics.com`/`googletagmanager.com` requests before consent.
- [ ] No `_ga` cookies before consent.
- [ ] Accept analytics → hits appear in DebugView.
- [ ] Accept marketing only → GA stays off, Pixel on.
- [ ] Reject all → no vendor requests, no cookies.
- [ ] Revoke → cookies removed and no further hits.
- [ ] Cross-tab consent sync works.
- [ ] Consent persists across reloads.
- [ ] Route changes produce exactly one page_view.
- [ ] No PII in URLs or event parameters.

---

## 4. Meta Pixel

- Load only after marketing consent.
- Use standard events (`PageView`, `Lead`, `Purchase`, etc.) with correct
  parameters.
- Do not send sensitive/personal data unless you have a lawful basis and a
  documented data-processing agreement.
- Configure Conversions API server-side only with proper consent and hashing.
- Test with Meta Events Manager → Test Events.
- Deduplicate browser/server events with a shared `event_id`.
- On revoke, stop firing and clear `_fbp`/`_fbc` where required.

---

## 5. Consent QA matrix

| Scenario | Analytics | Marketing | Vendor requests | Cookies |
| --- | --- | --- | --- | --- |
| First visit | denied | denied | none | essential only |
| Accept all | granted | granted | both | `_ga`, `_fbp` etc. |
| Analytics only | granted | denied | GA only | `_ga` only |
| Marketing only | denied | granted | Meta only | `_fbp` only |
| Reject all | denied | denied | none | purged |
| Revoke later | denied | denied | stopped | purged |
| New tab | same as stored | same as stored | consistent | consistent |

Test with a clean profile and the network panel, not just the UI.

---

## 6. Data quality

- Exclude internal IPs and staging hosts.
- Filter known bots (but do not over-filter real users).
- Use UTM conventions and document them.
- Avoid sending PII (email, phone, name, address) to analytics.
- Set retention to the minimum needed.
- Annotate deploys, campaigns, and outages.
- Reconcile GA4 vs Search Console vs CRM; expect gaps.
- Do not compare pre/post consent metrics without accounting for the change.

---

## 7. Server-side and privacy-first analytics

Options:

- Server-side GTM / tagging server (still requires consent where applicable).
- Plausible/Fathom/Matomo (self-hosted) with privacy settings.
- First-party event collection with aggregation.

Rules:

- Consent still applies to analytics storage where required.
- Server logs must not become a shadow analytics system with PII.
- Hash/truncate IPs where possible.
- Document retention and access.
- Do not use session replay without explicit consent and redaction.

---

## 8. Analytics acceptance checks

- [ ] Privacy notice lists every analytics/marketing vendor and purpose.
- [ ] Consent defaults are denied before any vendor request.
- [ ] Accept/reject/save all work and are equally easy.
- [ ] Granular categories work independently.
- [ ] Consent persists and can be withdrawn.
- [ ] Revoke purges cookies and stops hits.
- [ ] GA4 DebugView receives correct events after consent.
- [ ] Meta Test Events receives correct events after consent.
- [ ] SPA route changes tracked once.
- [ ] No PII in analytics payloads or URLs.
- [ ] Internal traffic/staging excluded.
- [ ] Consent version and timestamp stored for audit.
- [ ] QA evidence (screenshots/network logs) saved.
