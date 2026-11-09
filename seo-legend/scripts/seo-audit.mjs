#!/usr/bin/env node
/**
 * SEO Legend — portable SEO audit
 *
 * Zero-dependency Node.js 18+ crawler/auditor. Produces console findings and an
 * optional JSON report. Exit code 1 when any P0/P1 finding exists, 0 otherwise.
 *
 * Usage:
 *   node seo-audit.mjs --url=https://example.com --site=https://example.com
 *   node seo-audit.mjs --url=http://127.0.0.1:3000 --site=https://example.com \
 *     --routes=/,/about,/contact --json=report.json
 *
 * Options:
 *   --url=<url>            Target to fetch (required)
 *   --site=<url>           Canonical production site (default: --url)
 *   --max=<n>              Max pages to audit (default 50)
 *   --routes=<a,b,c>       Explicit routes/paths instead of sitemap discovery
 *   --json=<path>          Write JSON report
 *   --check-links          Check same-origin internal link targets
 *   --link-limit=<n>       Max links to check (default 100)
 *   --sitemap-check=<n>    Max non-audited sitemap URLs to status-check (default 100)
 *   --concurrency=<n>      Parallel requests (default 4)
 *   --timeout=<ms>         Per-request timeout (default 15000)
 *   --user-agent=<ua>      Custom user agent
 *   --strict-host          Treat canonical host mismatch as P1 instead of P2
 *   --check-external-canonicals  Fetch canonical targets on the --site origin
 *   --exit-zero            Always exit 0 (report-only mode)
 *   --help                 Show help
 */

import { gunzipSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const VERSION = "1.0.0";
const DEFAULT_UA =
  "SEOLegendAudit/1.0 (+https://opencode.ai; automated SEO audit)";
const ASSET_EXT =
  /\.(?:png|jpe?g|gif|webp|avif|svg|ico|css|js|mjs|cjs|json|xml|txt|pdf|zip|gz|tgz|mp4|webm|mp3|wav|woff2?|ttf|eot|webmanifest|map)$/i;
const REDIRECT_CODES = new Set([301, 302, 303, 307, 308]);
const SEVERITIES = ["P0", "P1", "P2", "P3"];

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const parsed = {};
  for (const raw of argv) {
    if (!raw.startsWith("--")) continue;
    const eq = raw.indexOf("=");
    const key = eq === -1 ? raw.slice(2) : raw.slice(2, eq);
    const value = eq === -1 ? true : raw.slice(eq + 1);
    if (key) parsed[key] = value;
  }
  return parsed;
}

function printHelp() {
  console.log(`SEO Legend audit v${VERSION}

Usage:
  node seo-audit.mjs --url=<url> [options]

Required:
  --url=<url>                  Target to fetch

Options:
  --site=<url>                 Canonical production site (default: --url)
  --max=<n>                    Max pages to audit (default 50)
  --routes=<a,b,c>             Explicit routes instead of sitemap discovery
  --json=<path>                Write JSON report
  --check-links                Check same-origin internal links
  --link-limit=<n>             Max links to check (default 100)
  --sitemap-check=<n>          Max non-audited sitemap URLs to status-check (default 100)
  --concurrency=<n>            Parallel requests (default 4)
  --timeout=<ms>               Per-request timeout (default 15000)
  --user-agent=<ua>            Custom user agent
  --strict-host                Canonical host mismatch = P1
  --check-external-canonicals  Fetch canonical targets on the --site origin
  --exit-zero                  Always exit 0 (report-only mode)
  --help                       Show this help

Examples:
  node seo-audit.mjs --url=https://example.com --site=https://example.com
  node seo-audit.mjs --url=http://127.0.0.1:3000 --site=https://example.com \\
    --routes=/,/about,/contact --json=seo-baseline.json
  node seo-audit.mjs --url=https://example.com --check-links --json=report.json

Exit codes:
  0  no P0/P1 findings
  1  at least one P0/P1 finding
  2  invalid arguments or fatal error

The JSON report is the evidence. Treat console output as a summary only.`);
}

const args = parseArgs(process.argv.slice(2));
if (args.help || args.h) {
  printHelp();
  process.exit(0);
}

const rawUrl = typeof args.url === "string" ? args.url.trim() : "";
if (!rawUrl) {
  console.error("Error: --url=<url> is required.\n");
  printHelp();
  process.exit(2);
}

let baseUrl;
try {
  baseUrl = new URL(rawUrl);
} catch {
  console.error(`Error: invalid --url value: ${rawUrl}`);
  process.exit(2);
}
if (!/^https?:$/.test(baseUrl.protocol)) {
  console.error("Error: --url must use http or https.");
  process.exit(2);
}
baseUrl.hash = "";
const baseOrigin = baseUrl.origin;

let siteUrl;
try {
  siteUrl = new URL(typeof args.site === "string" ? args.site.trim() : baseOrigin);
} catch {
  console.error(`Error: invalid --site value: ${String(args.site)}`);
  process.exit(2);
}
siteUrl.hash = "";
const siteOrigin = siteUrl.origin;

function intArg(name, fallback, min, max) {
  if (args[name] === undefined) return fallback;
  const value = Number.parseInt(String(args[name]), 10);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

const maxPages = intArg("max", 50, 1, 2000);
const linkLimit = intArg("link-limit", 100, 0, 1000);
const sitemapCheckLimit = intArg("sitemap-check", 100, 0, 5000);
const concurrency = intArg("concurrency", 4, 1, 16);
const timeoutMs = intArg("timeout", 15000, 1000, 120000);
const userAgent =
  typeof args["user-agent"] === "string" && args["user-agent"].trim()
    ? args["user-agent"].trim()
    : DEFAULT_UA;
const strictHost = Boolean(args["strict-host"]);
const checkExternalCanonicals = Boolean(args["check-external-canonicals"]);
const exitZero = Boolean(args["exit-zero"]);
const checkLinks = Boolean(args["check-links"]);

const routeList = (typeof args.routes === "string" ? args.routes : "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

// ---------------------------------------------------------------------------
// Findings
// ---------------------------------------------------------------------------

const findings = [];
const seenFindings = new Set();

function addFinding(id, severity, category, url, message, evidence = "") {
  const key = `${id}|${severity}|${url}|${message}`;
  if (seenFindings.has(key)) return;
  seenFindings.add(key);
  findings.push({
    id,
    severity,
    category,
    url: String(url || siteOrigin),
    message,
    evidence: String(evidence || ""),
  });
}

function severityRank(severity) {
  const index = SEVERITIES.indexOf(severity);
  return index === -1 ? 99 : index;
}

// ---------------------------------------------------------------------------
// URL helpers
// ---------------------------------------------------------------------------

function absoluteUrl(href, against = baseUrl.href) {
  try {
    const url = new URL(href, against);
    url.hash = "";
    return url.href;
  } catch {
    return null;
  }
}

function mapToBase(value) {
  const url = new URL(value, baseOrigin);
  if (url.origin !== baseOrigin && url.origin === siteOrigin) {
    return new URL(url.pathname + url.search, baseOrigin).href;
  }
  return url.href;
}

function mapToSite(value) {
  const url = new URL(value, baseOrigin);
  if (url.origin !== siteOrigin && url.origin === baseOrigin) {
    return new URL(url.pathname + url.search, siteOrigin).href;
  }
  return url.href;
}

function comparable(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    return `${url.protocol}//${url.host}${pathname}${url.search}`;
  } catch {
    return String(value);
  }
}

function sameOrigin(value, origin) {
  try {
    return new URL(value).origin === origin;
  } catch {
    return false;
  }
}

function normalizeSpace(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeEntities(value) {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };
  return String(value).replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code) => {
    const lower = String(code).toLowerCase();
    if (lower.startsWith("#x")) {
      const number = Number.parseInt(lower.slice(2), 16);
      return Number.isFinite(number) ? String.fromCodePoint(number) : match;
    }
    if (lower.startsWith("#")) {
      const number = Number.parseInt(lower.slice(1), 10);
      return Number.isFinite(number) ? String.fromCodePoint(number) : match;
    }
    return named[lower] ?? match;
  });
}

function isHtmlResponse(response) {
  const contentType = response.headers?.get?.("content-type") || "";
  if (/text\/html|application\/xhtml\+xml/i.test(contentType)) return true;
  if (contentType) return false;
  return /^\s*<!doctype html|^\s*<html/i.test(response.body || "");
}

function looksLikePage(pathname) {
  return !ASSET_EXT.test(pathname);
}

function isNoindex(value) {
  return /\b(?:noindex|none)\b/i.test(String(value || ""));
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function fetchOnce(target, options = {}) {
  const {
    method = "GET",
    readBody = true,
    timeout = timeoutMs,
  } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(target, {
      method,
      redirect: "manual",
      signal: controller.signal,
      headers: {
        "user-agent": userAgent,
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5",
      },
    });

    let body = "";
    if (readBody && method !== "HEAD") {
      body = await response.text();
    } else {
      try {
        await response.body?.cancel();
      } catch {
        // Ignore body-cancel failures.
      }
    }

    return {
      ok: true,
      status: response.status,
      headers: response.headers,
      body,
      url: target,
    };
  } catch (error) {
    const name = error?.name || "";
    return {
      ok: false,
      status: 0,
      headers: new Headers(),
      body: "",
      url: target,
      error:
        name === "AbortError" || name === "TimeoutError"
          ? `timeout after ${timeout}ms`
          : String(error?.message || error),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function fetchChain(startUrl, options = {}) {
  const maxHops = options.maxHops ?? 5;
  const chain = [];
  let current = startUrl;
  let last = null;

  for (let hop = 0; hop <= maxHops; hop += 1) {
    const response = await fetchOnce(current, options);
    last = response;
    const location = response.headers?.get?.("location") || null;
    chain.push({ url: current, status: response.status, location });

    if (!response.ok) {
      return { ...response, finalUrl: current, chain };
    }

    if (REDIRECT_CODES.has(response.status) && location) {
      const next = absoluteUrl(location, current);
      if (!next) {
        return {
          ...response,
          finalUrl: current,
          chain,
          error: `invalid redirect location: ${location}`,
        };
      }
      current = next;
      continue;
    }

    return { ...response, finalUrl: current, chain };
  }

  return {
    ...last,
    finalUrl: current,
    chain,
    redirectLoop: true,
    error: `more than ${maxHops} redirects`,
  };
}

async function fetchFollowText(target, options = {}) {
  const maxHops = options.maxHops ?? 4;
  let current = target;
  let last = null;

  for (let hop = 0; hop <= maxHops; hop += 1) {
    const response = await fetchOnce(current, options);
    last = response;
    const location = response.headers?.get?.("location") || null;
    if (response.ok && REDIRECT_CODES.has(response.status) && location) {
      const next = absoluteUrl(location, current);
      if (next) {
        current = next;
        continue;
      }
    }
    return { ...response, finalUrl: current };
  }

  return {
    ...last,
    finalUrl: current,
    error: `more than ${maxHops} redirects`,
  };
}

async function fetchBytesFollow(target, options = {}) {
  const maxHops = options.maxHops ?? 4;
  let current = target;

  for (let hop = 0; hop <= maxHops; hop += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(current, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "user-agent": userAgent,
          accept: "application/xml,text/xml,text/plain,*/*",
        },
      });

      const location = response.headers.get("location");
      if (REDIRECT_CODES.has(response.status) && location) {
        const next = absoluteUrl(location, current);
        try {
          await response.body?.cancel();
        } catch {
          // Ignore.
        }
        if (next) {
          current = next;
          continue;
        }
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      return {
        ok: true,
        status: response.status,
        headers: response.headers,
        buffer,
        finalUrl: current,
      };
    } catch (error) {
      const name = error?.name || "";
      return {
        ok: false,
        status: 0,
        headers: new Headers(),
        buffer: Buffer.alloc(0),
        finalUrl: current,
        error:
          name === "AbortError" || name === "TimeoutError"
            ? `timeout after ${timeoutMs}ms`
            : String(error?.message || error),
      };
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    ok: false,
    status: 0,
    headers: new Headers(),
    buffer: Buffer.alloc(0),
    finalUrl: current,
    error: `more than ${maxHops} redirects`,
  };
}

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------

function parseRobots(text) {
  const groups = [];
  const sitemaps = [];
  let current = null;
  let sawDirective = false;

  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;

    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();

    if (field === "user-agent") {
      if (!current || sawDirective) {
        current = { agents: [], rules: [] };
        groups.push(current);
        sawDirective = false;
      }
      current.agents.push(value.toLowerCase());
      continue;
    }

    if (field === "allow" || field === "disallow") {
      if (!current) {
        current = { agents: ["*"], rules: [] };
        groups.push(current);
      }
      current.rules.push({ type: field, path: value });
      sawDirective = true;
      continue;
    }

    if (field === "sitemap") {
      const resolved = absoluteUrl(value, `${baseOrigin}/robots.txt`);
      if (resolved) sitemaps.push(resolved);
      // Sitemap is a non-group field; treat it as a boundary so a later
      // User-agent line does not inherit the previous group's rules.
      sawDirective = true;
    }
  }

  return { groups, sitemaps: [...new Set(sitemaps)] };
}

function patternToRegex(pattern) {
  let source = String(pattern || "");
  let anchored = false;
  if (source.endsWith("$")) {
    anchored = true;
    source = source.slice(0, -1);
  }
  source = source
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");
  return new RegExp(`^${source}${anchored ? "$" : ""}`);
}

function robotsBlocked(pathname, groups) {
  const rules = [];
  for (const group of groups) {
    if (group.agents.includes("*") || group.agents.includes("googlebot")) {
      rules.push(...group.rules);
    }
  }

  let best = null;
  for (const rule of rules) {
    if (!rule.path) continue; // Empty Disallow means allow all.
    let matches = false;
    try {
      matches = patternToRegex(rule.path).test(pathname);
    } catch {
      matches = false;
    }
    if (!matches) continue;
    const length = rule.path.length;
    if (
      !best ||
      length > best.length ||
      (length === best.length && rule.type === "allow")
    ) {
      best = { length, type: rule.type };
    }
  }

  return best ? best.type === "disallow" : false;
}

// ---------------------------------------------------------------------------
// Sitemaps
// ---------------------------------------------------------------------------

async function loadSitemaps(roots, maxSitemaps = 20) {
  const queue = roots.map((value) => ({
    original: value,
    fetchUrl: mapToBase(value),
  }));
  const seen = new Set();
  const loaded = [];
  const rawUrls = [];

  while (queue.length > 0 && seen.size < maxSitemaps) {
    const item = queue.shift();
    if (seen.has(item.fetchUrl)) continue;
    seen.add(item.fetchUrl);

    const response = await fetchBytesFollow(item.fetchUrl);
    if (!response.ok || response.status !== 200) {
      loaded.push({
        url: item.original,
        fetchedFrom: item.fetchUrl,
        status: response.status,
        error: response.error || `HTTP ${response.status}`,
      });
      continue;
    }

    let xml;
    try {
      const isGzip =
        response.buffer.length > 2 &&
        response.buffer[0] === 0x1f &&
        response.buffer[1] === 0x8b;
      xml = isGzip
        ? gunzipSync(response.buffer).toString("utf8")
        : response.buffer.toString("utf8");
    } catch (error) {
      loaded.push({
        url: item.original,
        fetchedFrom: item.fetchUrl,
        status: response.status,
        error: `could not decode sitemap: ${String(error?.message || error)}`,
      });
      continue;
    }

    if (!/<(urlset|sitemapindex)\b/i.test(xml)) {
      loaded.push({
        url: item.original,
        fetchedFrom: item.fetchUrl,
        status: response.status,
        error: "response is not an XML sitemap",
      });
      continue;
    }

    const isIndex = /<sitemapindex\b/i.test(xml);
    const locations = [...xml.matchAll(/<loc\b[^>]*>([\s\S]*?)<\/loc>/gi)]
      .map((match) => decodeEntities(match[1].trim()))
      .filter(Boolean);

    loaded.push({
      url: item.original,
      fetchedFrom: item.fetchUrl,
      status: response.status,
      type: isIndex ? "index" : "urlset",
      count: locations.length,
    });

    for (const location of locations) {
      const resolved = absoluteUrl(location, item.original);
      if (!resolved) continue;
      if (isIndex) {
        queue.push({ original: resolved, fetchUrl: mapToBase(resolved) });
      } else {
        rawUrls.push(resolved);
      }
    }
  }

  const uniqueUrls = [...new Set(rawUrls)];
  return {
    loaded,
    urls: uniqueUrls,
    duplicates: rawUrls.length - uniqueUrls.length,
    rawCount: rawUrls.length,
  };
}

// ---------------------------------------------------------------------------
// HTML parsing
// ---------------------------------------------------------------------------

function parseAttributes(tag) {
  const attributes = {};
  const re =
    /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let match;
  while ((match = re.exec(tag)) !== null) {
    attributes[match[1].toLowerCase()] = decodeEntities(
      match[2] ?? match[3] ?? match[4] ?? "",
    );
  }
  return attributes;
}

function textOf(html) {
  return normalizeSpace(
    decodeEntities(
      String(html)
        .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]*>/g, " "),
    ),
  );
}

function metaContent(tags, key) {
  const target = String(key).toLowerCase();
  const tag = tags.find((attributes) => {
    const name = String(
      attributes.name || attributes.property || attributes["http-equiv"] || "",
    ).toLowerCase();
    return name === target;
  });
  return tag?.content ? decodeEntities(tag.content) : "";
}

function parseHtml(html, pageUrl) {
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? normalizeSpace(textOf(titleMatch[1])) : "";

  const metaTags = [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) =>
    parseAttributes(match[0]),
  );
  const linkTags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) =>
    parseAttributes(match[0]),
  );

  const canonicalTag = linkTags.find((attributes) =>
    String(attributes.rel || "")
      .toLowerCase()
      .split(/\s+/)
      .includes("canonical"),
  );
  const canonicalRaw = canonicalTag?.href
    ? decodeEntities(canonicalTag.href)
    : "";
  const canonical = canonicalRaw ? absoluteUrl(canonicalRaw, pageUrl) : null;

  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1Count = h1Matches.length;
  const h1 = h1Matches[0] ? normalizeSpace(textOf(h1Matches[0][1])) : "";

  const htmlTag = html.match(/<html\b[^>]*>/i);
  const htmlAttributes = htmlTag ? parseAttributes(htmlTag[0]) : {};
  const lang = String(htmlAttributes.lang || "").trim();

  const description = metaContent(metaTags, "description");
  const viewport = metaContent(metaTags, "viewport");
  const robotsMeta =
    metaContent(metaTags, "robots") || metaContent(metaTags, "googlebot");
  const metaRefresh = metaContent(metaTags, "refresh");

  const ogTitle = metaContent(metaTags, "og:title");
  const ogDescription = metaContent(metaTags, "og:description");
  const ogImage = metaContent(metaTags, "og:image");
  const ogUrl = metaContent(metaTags, "og:url");
  const twitterCard = metaContent(metaTags, "twitter:card");

  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) =>
    parseAttributes(match[0]),
  );
  let imagesMissingAlt = 0;
  let imagesMissingDimensions = 0;
  for (const attributes of imageTags) {
    if (!("alt" in attributes)) imagesMissingAlt += 1;
    if (
      !(attributes.width && attributes.height) &&
      !/aspect-ratio/i.test(attributes.style || "")
    ) {
      imagesMissingDimensions += 1;
    }
  }

  const jsonLdBlocks = [];
  for (const match of html.matchAll(
    /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
  )) {
    const attributes = parseAttributes(match[1]);
    if (
      String(attributes.type || "").toLowerCase() === "application/ld+json"
    ) {
      jsonLdBlocks.push(match[2].trim());
    }
  }

  return {
    title,
    description,
    canonical,
    canonicalRaw,
    robotsMeta,
    metaRefresh,
    h1,
    h1Count,
    lang,
    viewport,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterCard,
    imageCount: imageTags.length,
    imagesMissingAlt,
    imagesMissingDimensions,
    jsonLdBlocks,
  };
}

function extractLinks(html, pageUrl) {
  const links = new Set();
  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const href = String(attributes.href || "").trim();
    if (!href) continue;
    if (/^(?:#|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    const resolved = absoluteUrl(href, pageUrl);
    if (resolved) links.add(resolved);
  }
  return [...links];
}

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------

const ARTICLE_TYPES = new Set([
  "Article",
  "NewsArticle",
  "BlogPosting",
  "TechArticle",
  "ScholarlyArticle",
  "Report",
]);

const LOCAL_BUSINESS_TYPES = new Set([
  "LocalBusiness",
  "ProfessionalService",
  "Store",
  "Restaurant",
  "Plumber",
  "Electrician",
  "HVACBusiness",
  "LegalService",
  "Dentist",
  "MedicalBusiness",
  "HomeAndConstructionBusiness",
  "AutomotiveBusiness",
  "HealthAndBeautyBusiness",
  "LodgingBusiness",
  "FoodEstablishment",
]);

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function entityTypes(entity) {
  return asArray(entity?.["@type"]).map((value) => String(value));
}

function entitiesOf(parsed) {
  const entities = [];
  const visit = (node) => {
    if (Array.isArray(node)) {
      for (const child of node) visit(child);
      return;
    }
    if (!node || typeof node !== "object") return;
    if (node["@graph"]) {
      visit(node["@graph"]);
      return;
    }
    if (node["@type"]) entities.push(node);
  };
  visit(parsed);
  return entities;
}

function checkFields(entity, fields, label, url, source, severity = "P1") {
  const missing = fields.filter(
    (field) =>
      entity[field] === undefined ||
      entity[field] === null ||
      entity[field] === "",
  );
  if (missing.length > 0) {
    addFinding(
      "S-04",
      severity,
      "structured-data",
      url,
      `${label} missing required field(s): ${missing.join(", ")}`,
      source,
    );
  }
}

function auditSchemaBlock(parsed, pageUrl, source) {
  const types = [];

  if (!parsed || typeof parsed !== "object") {
    addFinding(
      "S-01",
      "P2",
      "structured-data",
      pageUrl,
      "JSON-LD root is not an object or array",
      source,
    );
    return types;
  }

  const entities = entitiesOf(parsed);
  const hasContext =
    Boolean(parsed["@context"]) ||
    entities.some((entity) => Boolean(entity["@context"]));

  if (!hasContext) {
    addFinding(
      "S-02",
      "P2",
      "structured-data",
      pageUrl,
      "JSON-LD is missing @context",
      source,
    );
  }

  if (entities.length === 0) {
    addFinding(
      "S-01",
      "P3",
      "structured-data",
      pageUrl,
      "JSON-LD block contains no entity with @type",
      source,
    );
  }

  for (const entity of entities) {
    const list = entityTypes(entity);
    types.push(...list);

    if (list.includes("Organization")) {
      checkFields(entity, ["name", "url"], "Organization", pageUrl, source);
    }

    if (list.includes("WebSite")) {
      checkFields(entity, ["name", "url"], "WebSite", pageUrl, source);
    }

    if (list.includes("WebPage")) {
      if (!entity.url && !entity["@id"]) {
        addFinding(
          "S-04",
          "P2",
          "structured-data",
          pageUrl,
          "WebPage missing url or @id",
          source,
        );
      }
    }

    if (list.some((type) => ARTICLE_TYPES.has(type))) {
      const articleType = list.find((type) => ARTICLE_TYPES.has(type));
      checkFields(
        entity,
        ["headline", "image", "datePublished", "author"],
        articleType,
        pageUrl,
        source,
      );
      checkFields(entity, ["publisher"], articleType, pageUrl, source, "P2");
    }

    if (list.includes("Product")) {
      checkFields(
        entity,
        ["name", "image", "offers"],
        "Product",
        pageUrl,
        source,
      );
      for (const offer of asArray(entity.offers).filter(Boolean)) {
        const missing = [];
        if (offer.price === undefined && offer.lowPrice === undefined) {
          missing.push("price or lowPrice");
        }
        if (!offer.priceCurrency) missing.push("priceCurrency");
        if (missing.length > 0) {
          addFinding(
            "S-04",
            "P1",
            "structured-data",
            pageUrl,
            `Product offer missing required field(s): ${missing.join(", ")}`,
            source,
          );
        }
      }
    }

    if (list.some((type) => LOCAL_BUSINESS_TYPES.has(type))) {
      checkFields(
        entity,
        ["name", "address"],
        "LocalBusiness",
        pageUrl,
        source,
      );
    }

    if (list.includes("BreadcrumbList")) {
      checkFields(
        entity,
        ["itemListElement"],
        "BreadcrumbList",
        pageUrl,
        source,
        "P2",
      );
    }

    if (list.includes("FAQPage")) {
      checkFields(
        entity,
        ["mainEntity"],
        "FAQPage",
        pageUrl,
        source,
        "P2",
      );
    }

    if (list.includes("Event")) {
      checkFields(
        entity,
        ["name", "startDate", "location"],
        "Event",
        pageUrl,
        source,
      );
    }

    if (list.includes("VideoObject")) {
      checkFields(
        entity,
        ["name", "thumbnailUrl", "uploadDate"],
        "VideoObject",
        pageUrl,
        source,
      );
    }
  }

  return [...new Set(types)];
}

// ---------------------------------------------------------------------------
// Page audit
// ---------------------------------------------------------------------------

const pageRecords = [];
const pageLinks = new Map();
const canonicalTargets = new Map();
const seenHeaderFindings = new Set();

function firstHeaderFinding(name) {
  if (seenHeaderFindings.has(name)) return false;
  seenHeaderFindings.add(name);
  return true;
}

function auditSecurityHeaders(response, url) {
  const headers = response.headers;

  if (
    !headers.get("x-content-type-options") &&
    firstHeaderFinding("x-content-type-options")
  ) {
    addFinding(
      "X-03",
      "P2",
      "security",
      url,
      "Missing X-Content-Type-Options: nosniff",
      "response headers",
    );
  }

  if (
    !headers.get("referrer-policy") &&
    firstHeaderFinding("referrer-policy")
  ) {
    addFinding(
      "X-04",
      "P2",
      "security",
      url,
      "Missing Referrer-Policy header",
      "response headers",
    );
  }

  const csp = headers.get("content-security-policy") || "";
  if (
    !headers.get("x-frame-options") &&
    !/frame-ancestors/i.test(csp) &&
    firstHeaderFinding("frame-protection")
  ) {
    addFinding(
      "X-05",
      "P2",
      "security",
      url,
      "Missing frame protection (X-Frame-Options or CSP frame-ancestors)",
      "response headers",
    );
  }

  try {
    if (
      new URL(url).protocol === "https:" &&
      !headers.get("strict-transport-security") &&
      firstHeaderFinding("hsts")
    ) {
      addFinding(
        "X-06",
        "P2",
        "security",
        url,
        "Missing Strict-Transport-Security header on HTTPS",
        "response headers",
      );
    }
  } catch {
    // Ignore malformed URLs.
  }
}

async function auditPage(ref) {
  const response = await fetchChain(ref.fetchUrl, { readBody: true });
  const finalUrl = response.finalUrl || ref.fetchUrl;
  const redirects = Math.max(0, (response.chain?.length || 1) - 1);
  const contentType = response.headers?.get?.("content-type") || "";
  const html = isHtmlResponse(response) ? response.body : "";
  const parsed = html ? parseHtml(html, finalUrl) : null;

  const record = {
    url: ref.fetchUrl,
    expectedUrl: ref.expectedUrl,
    finalUrl,
    source: ref.source,
    status: response.status,
    redirects,
    contentType,
    error: response.error || null,
    title: parsed?.title || "",
    description: parsed?.description || "",
    canonical: parsed?.canonical || null,
    robotsMeta: parsed?.robotsMeta || "",
    h1Count: parsed?.h1Count ?? 0,
    lang: parsed?.lang || "",
    viewport: parsed?.viewport || "",
    ogTitle: parsed?.ogTitle || "",
    ogImage: parsed?.ogImage || "",
    twitterCard: parsed?.twitterCard || "",
    jsonLdTypes: [],
    images: parsed
      ? {
          total: parsed.imageCount,
          missingAlt: parsed.imagesMissingAlt,
          missingDimensions: parsed.imagesMissingDimensions,
        }
      : null,
  };
  pageRecords.push(record);

  if (response.status === 0) {
    addFinding(
      "T-37",
      "P0",
      "technical",
      ref.fetchUrl,
      `Page could not be fetched: ${response.error || "network error"}`,
      response.chain || [],
    );
    return record;
  }

  if (response.status >= 500) {
    addFinding(
      "T-37",
      "P0",
      "technical",
      ref.fetchUrl,
      `Page returns HTTP ${response.status}`,
      response.chain || [],
    );
    return record;
  }

  if (response.status >= 400) {
    addFinding(
      "T-37",
      "P1",
      "technical",
      ref.fetchUrl,
      `Page returns HTTP ${response.status}`,
      response.chain || [],
    );
    return record;
  }

  if (response.redirectLoop) {
    addFinding(
      "T-15",
      "P1",
      "technical",
      ref.fetchUrl,
      `Redirect chain exceeds the hop limit: ${response.error || "too many redirects"}`,
      response.chain || [],
    );
  } else if (redirects > 1) {
    addFinding(
      "T-14",
      "P1",
      "technical",
      ref.fetchUrl,
      `Redirect chain has ${redirects} hops`,
      response.chain || [],
    );
  } else if (redirects === 1) {
    addFinding(
      "T-38",
      ref.source === "sitemap" ? "P1" : "P2",
      "technical",
      ref.fetchUrl,
      `URL redirects to ${finalUrl}; update links/sitemap to the final URL`,
      response.chain || [],
    );
  }

  if (!html) {
    if (looksLikePage(new URL(finalUrl).pathname)) {
      addFinding(
        "T-37",
        "P2",
        "technical",
        ref.fetchUrl,
        `Expected HTML but received content-type "${contentType || "unknown"}"`,
        contentType,
      );
    }
    return record;
  }

  auditSecurityHeaders(response, ref.fetchUrl);

  const xRobots = response.headers.get("x-robots-tag") || "";
  const noindex = isNoindex(parsed.robotsMeta) || isNoindex(xRobots);

  if (isNoindex(xRobots)) {
    addFinding(
      "T-20",
      ref.source === "sitemap" ? "P1" : "P2",
      "technical",
      ref.fetchUrl,
      `X-Robots-Tag contains noindex: ${xRobots}`,
      "response headers",
    );
  }

  if (noindex) {
    addFinding(
      "T-19",
      ref.source === "sitemap" ? "P1" : "P2",
      "technical",
      ref.fetchUrl,
      ref.source === "sitemap"
        ? "Sitemap URL is marked noindex"
        : "Audited URL is marked noindex",
      parsed.robotsMeta || xRobots,
    );
  }

  if (parsed.canonical) {
    if (parsed.canonicalRaw && !/^https?:\/\//i.test(parsed.canonicalRaw)) {
      addFinding(
        "T-41",
        "P2",
        "technical",
        ref.fetchUrl,
        `Canonical is relative: ${parsed.canonicalRaw}`,
        parsed.canonicalRaw,
      );
    }

    let canonicalOrigin = "";
    try {
      canonicalOrigin = new URL(parsed.canonical).origin;
    } catch {
      canonicalOrigin = "";
    }

    if (canonicalOrigin && canonicalOrigin !== siteOrigin) {
      addFinding(
        "T-51",
        strictHost ? "P1" : "P2",
        "technical",
        ref.fetchUrl,
        `Canonical host ${canonicalOrigin} differs from --site ${siteOrigin}`,
        parsed.canonical,
      );
    }

    const expectedCanonical = mapToSite(finalUrl);
    if (comparable(parsed.canonical) !== comparable(expectedCanonical)) {
      addFinding(
        "T-42",
        "P2",
        "technical",
        ref.fetchUrl,
        `Canonical ${parsed.canonical} does not match expected ${expectedCanonical}`,
        parsed.canonical,
      );
    }

    if (noindex && comparable(parsed.canonical) !== comparable(finalUrl)) {
      addFinding(
        "T-45",
        "P2",
        "technical",
        ref.fetchUrl,
        "Page combines noindex with a canonical pointing elsewhere",
        `robots=${parsed.robotsMeta || xRobots}; canonical=${parsed.canonical}`,
      );
    }

    canonicalTargets.set(parsed.canonical, {
      pageUrl: ref.fetchUrl,
      source: ref.source,
    });
  } else if (!noindex) {
    addFinding(
      "T-40",
      "P1",
      "technical",
      ref.fetchUrl,
      "Indexable page is missing a canonical tag",
      "no canonical link",
    );
  }

  if (!parsed.title) {
    addFinding("C-01", "P1", "metadata", ref.fetchUrl, "Missing <title>", "");
  } else if (parsed.title.length > 60) {
    addFinding(
      "C-02",
      "P2",
      "metadata",
      ref.fetchUrl,
      `Title is ${parsed.title.length} characters (target <=60): ${parsed.title}`,
      parsed.title,
    );
  } else if (parsed.title.length < 15) {
    addFinding(
      "C-02",
      "P2",
      "metadata",
      ref.fetchUrl,
      `Title is only ${parsed.title.length} characters: ${parsed.title}`,
      parsed.title,
    );
  }

  if (!parsed.description) {
    addFinding(
      "C-05",
      "P2",
      "metadata",
      ref.fetchUrl,
      "Missing meta description",
      "",
    );
  } else if (parsed.description.length > 160) {
    addFinding(
      "C-06",
      "P3",
      "metadata",
      ref.fetchUrl,
      `Meta description is ${parsed.description.length} characters (target <=160)`,
      parsed.description,
    );
  } else if (parsed.description.length < 70) {
    addFinding(
      "C-06",
      "P3",
      "metadata",
      ref.fetchUrl,
      `Meta description is only ${parsed.description.length} characters`,
      parsed.description,
    );
  }

  if (parsed.h1Count === 0) {
    addFinding("C-07", "P1", "content", ref.fetchUrl, "Missing H1", "");
  } else if (parsed.h1Count > 1) {
    addFinding(
      "C-07",
      "P2",
      "content",
      ref.fetchUrl,
      `Page has ${parsed.h1Count} H1 elements`,
      "",
    );
  }

  if (!parsed.lang) {
    addFinding(
      "C-10",
      "P2",
      "technical",
      ref.fetchUrl,
      "<html> is missing a lang attribute",
      "",
    );
  }

  if (!parsed.viewport) {
    addFinding(
      "C-11",
      "P1",
      "technical",
      ref.fetchUrl,
      "Missing viewport meta tag",
      "",
    );
  }

  if (parsed.metaRefresh) {
    addFinding(
      "T-39",
      "P2",
      "technical",
      ref.fetchUrl,
      `Meta refresh redirect present: ${parsed.metaRefresh}`,
      parsed.metaRefresh,
    );
  }

  if (!parsed.ogTitle) {
    addFinding("C-12", "P3", "metadata", ref.fetchUrl, "Missing og:title", "");
  }
  if (!parsed.ogImage) {
    addFinding("C-13", "P3", "metadata", ref.fetchUrl, "Missing og:image", "");
  } else if (!/^https?:\/\//i.test(parsed.ogImage)) {
    addFinding(
      "C-13",
      "P2",
      "metadata",
      ref.fetchUrl,
      `og:image is not absolute: ${parsed.ogImage}`,
      parsed.ogImage,
    );
  }

  if (!parsed.twitterCard) {
    addFinding(
      "C-14",
      "P3",
      "metadata",
      ref.fetchUrl,
      "Missing twitter:card",
      "",
    );
  }

  if (parsed.ogUrl && parsed.canonical) {
    const ogUrlAbsolute = absoluteUrl(parsed.ogUrl, finalUrl);
    if (
      ogUrlAbsolute &&
      comparable(ogUrlAbsolute) !== comparable(parsed.canonical)
    ) {
      addFinding(
        "T-47",
        "P3",
        "metadata",
        ref.fetchUrl,
        `og:url ${ogUrlAbsolute} does not match canonical ${parsed.canonical}`,
        parsed.ogUrl,
      );
    }
  }

  if (parsed.imagesMissingAlt > 0) {
    addFinding(
      "C-33",
      "P2",
      "content",
      ref.fetchUrl,
      `${parsed.imagesMissingAlt} image(s) missing an alt attribute`,
      `${parsed.imagesMissingAlt}/${parsed.imageCount} images`,
    );
  }

  if (parsed.imagesMissingDimensions > 0) {
    addFinding(
      "P-11",
      "P3",
      "performance",
      ref.fetchUrl,
      `${parsed.imagesMissingDimensions} image(s) missing width/height or aspect-ratio`,
      `${parsed.imagesMissingDimensions}/${parsed.imageCount} images`,
    );
  }

  for (let index = 0; index < parsed.jsonLdBlocks.length; index += 1) {
    const block = parsed.jsonLdBlocks[index];
    if (!block) {
      addFinding(
        "S-01",
        "P2",
        "structured-data",
        ref.fetchUrl,
        `JSON-LD block ${index + 1} is empty`,
        "",
      );
      continue;
    }
    let parsedBlock;
    try {
      parsedBlock = JSON.parse(block);
    } catch (error) {
      addFinding(
        "S-01",
        "P1",
        "structured-data",
        ref.fetchUrl,
        `JSON-LD block ${index + 1} does not parse: ${String(
          error?.message || error,
        )}`,
        block.slice(0, 200),
      );
      continue;
    }
    record.jsonLdTypes.push(
      ...auditSchemaBlock(
        parsedBlock,
        ref.fetchUrl,
        `JSON-LD block ${index + 1}`,
      ),
    );
  }

  record.jsonLdTypes = [...new Set(record.jsonLdTypes)];

  if (
    parsed.jsonLdBlocks.length === 0 &&
    new URL(finalUrl).pathname === "/"
  ) {
    addFinding(
      "S-01",
      "P3",
      "structured-data",
      ref.fetchUrl,
      "Homepage has no JSON-LD structured data",
      "",
    );
  }

  if (checkLinks) {
    pageLinks.set(ref.fetchUrl, extractLinks(html, finalUrl));
  }

  return record;
}

// ---------------------------------------------------------------------------
// Discovery
// ---------------------------------------------------------------------------

function buildRouteRefs() {
  const refs = [];
  for (const route of routeList) {
    const absolute = /^https?:\/\//i.test(route)
      ? absoluteUrl(route)
      : absoluteUrl(route, baseUrl.href);
    if (!absolute) continue;
    const fetchUrl = mapToBase(absolute);
    refs.push({
      fetchUrl,
      expectedUrl: mapToSite(fetchUrl),
      source: "route",
    });
  }
  return dedupeRefs(refs);
}

function dedupeRefs(refs) {
  const seen = new Set();
  return refs.filter((ref) => {
    const key = comparable(ref.fetchUrl);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function discoverByCrawl(startUrl, limit) {
  const queue = [startUrl];
  const visited = new Set();
  const refs = [];

  while (queue.length > 0 && refs.length < limit) {
    const url = queue.shift();
    const key = comparable(url);
    if (visited.has(key)) continue;
    visited.add(key);

    refs.push({
      fetchUrl: url,
      expectedUrl: mapToSite(url),
      source: "crawl",
    });

    const response = await fetchChain(url, { readBody: true });
    if (response.status !== 200 || !isHtmlResponse(response)) continue;

    for (const link of extractLinks(response.body, response.finalUrl || url)) {
      if (!sameOrigin(link, baseOrigin)) continue;
      if (!looksLikePage(new URL(link).pathname)) continue;
      if (!visited.has(comparable(link))) queue.push(link);
    }
  }

  return dedupeRefs(refs);
}

async function mapLimit(items, limit, iteratee) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) return;
      results[index] = await iteratee(items[index], index);
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, Math.max(1, items.length)) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

// ---------------------------------------------------------------------------
// Main orchestration
// ---------------------------------------------------------------------------

const startedAt = new Date();
const robotsUrl = new URL("/robots.txt", baseOrigin).href;
const robotsResponse = await fetchFollowText(robotsUrl, { readBody: true });

let robots = {
  status: robotsResponse.status,
  groups: [],
  sitemaps: [],
  disallowAll: false,
  error: robotsResponse.error || null,
};

if (robotsResponse.ok && robotsResponse.status === 200) {
  const parsedRobots = parseRobots(robotsResponse.body);
  robots = {
    ...robots,
    ...parsedRobots,
    disallowAll: robotsBlocked("/seo-legend-test-path", parsedRobots.groups),
  };
}

const robotsContentType = robotsResponse.headers?.get?.("content-type") || "";

if (robotsResponse.status === 0) {
  addFinding(
    "T-01",
    "P2",
    "technical",
    robotsUrl,
    `robots.txt could not be fetched: ${robotsResponse.error || "network error"}`,
    "",
  );
} else if (robotsResponse.status >= 500) {
  addFinding(
    "T-01",
    "P2",
    "technical",
    robotsUrl,
    `robots.txt returns HTTP ${robotsResponse.status}`,
    "",
  );
} else if (robotsResponse.status === 404) {
  addFinding(
    "T-01",
    "P3",
    "technical",
    robotsUrl,
    "robots.txt is missing (not fatal, but review whether intentional)",
    "",
  );
} else if (robotsResponse.status !== 200) {
  addFinding(
    "T-01",
    "P2",
    "technical",
    robotsUrl,
    `robots.txt returns HTTP ${robotsResponse.status}`,
    "",
  );
} else if (robotsContentType.includes("text/html")) {
  addFinding(
    "T-01",
    "P2",
    "technical",
    robotsUrl,
    "robots.txt is served as HTML, not text/plain",
    robotsContentType,
  );
}

if (robots.disallowAll) {
  addFinding(
    "T-02",
    "P0",
    "technical",
    robotsUrl,
    "robots.txt blocks all crawling (Disallow: /)",
    "",
  );
}

if (robots.status === 200 && robots.sitemaps.length === 0) {
  addFinding(
    "T-04",
    "P3",
    "technical",
    robotsUrl,
    "robots.txt has no Sitemap directive",
    "",
  );
}

let sitemapRoots = [...robots.sitemaps];

if (sitemapRoots.length === 0) {
  for (const candidate of ["/sitemap.xml", "/sitemap_index.xml"]) {
    const candidateUrl = new URL(candidate, baseOrigin).href;
    const response = await fetchBytesFollow(candidateUrl);
    if (response.status !== 200) continue;
    const text = response.buffer.toString("utf8");
    if (/<(urlset|sitemapindex)\b/i.test(text)) {
      sitemapRoots.push(response.finalUrl || candidateUrl);
      break;
    }
  }
}

const sitemapResult =
  sitemapRoots.length > 0
    ? await loadSitemaps(sitemapRoots)
    : { loaded: [], urls: [], duplicates: 0, rawCount: 0 };

for (const entry of sitemapResult.loaded) {
  if (entry.status !== 200 || entry.error) {
    addFinding(
      "T-06",
      "P1",
      "technical",
      entry.url,
      `Sitemap could not be loaded: ${entry.error || `HTTP ${entry.status}`}`,
      entry.fetchedFrom,
    );
  }
}

if (sitemapResult.urls.length === 0) {
  addFinding(
    "T-06",
    "P2",
    "technical",
    siteOrigin,
    "No sitemap URLs could be discovered",
    sitemapRoots.join(", ") || "no sitemap",
  );
}

if (sitemapResult.duplicates > 0) {
  addFinding(
    "T-08",
    "P2",
    "technical",
    sitemapRoots[0] || siteOrigin,
    `Sitemap contains ${sitemapResult.duplicates} duplicate URL(s)`,
    `${sitemapResult.rawCount} entries, ${sitemapResult.urls.length} unique`,
  );
}

const usableSitemapUrls = sitemapResult.urls.filter(
  (url) => sameOrigin(url, siteOrigin) || sameOrigin(url, baseOrigin),
);
const offsiteSitemapUrls = sitemapResult.urls.length - usableSitemapUrls.length;

if (offsiteSitemapUrls > 0) {
  addFinding(
    "T-07",
    "P2",
    "technical",
    sitemapRoots[0] || siteOrigin,
    `Sitemap contains ${offsiteSitemapUrls} off-site URL(s)`,
    "",
  );
}

const blockedSitemapUrls = usableSitemapUrls.filter((url) =>
  robotsBlocked(new URL(url).pathname, robots.groups),
);

if (blockedSitemapUrls.length > 0) {
  addFinding(
    "T-07",
    "P1",
    "technical",
    blockedSitemapUrls[0],
    `${blockedSitemapUrls.length} sitemap URL(s) are blocked by robots.txt`,
    blockedSitemapUrls.slice(0, 10).join(", "),
  );
}

if (usableSitemapUrls.length > maxPages) {
  addFinding(
    "M-06",
    "P2",
    "technical",
    sitemapRoots[0] || siteOrigin,
    `Sitemap has ${usableSitemapUrls.length} URLs; auditing the first ${maxPages}. Increase --max or use --routes.`,
    "",
  );
}

let pageRefs;
let discoveryMode;

if (routeList.length > 0) {
  pageRefs = buildRouteRefs();
  discoveryMode = "routes";
} else if (usableSitemapUrls.length > 0) {
  pageRefs = usableSitemapUrls.slice(0, maxPages).map((url) => ({
    fetchUrl: mapToBase(url),
    expectedUrl: url,
    source: "sitemap",
  }));
  discoveryMode = "sitemap";
} else {
  pageRefs = await discoverByCrawl(baseUrl.href, maxPages);
  discoveryMode = "crawl";
}

pageRefs = dedupeRefs(pageRefs);

if (pageRefs.length === 0) {
  addFinding(
    "T-06",
    "P2",
    "technical",
    baseUrl.href,
    "No pages were discovered to audit",
    "",
  );
}

await mapLimit(pageRefs, concurrency, auditPage);

// Status-check sitemap URLs that were not audited in depth.
const auditedComparables = new Set();
for (const page of pageRecords) {
  auditedComparables.add(comparable(page.url));
  auditedComparables.add(comparable(page.finalUrl));
}

const uncheckedSitemapUrls = usableSitemapUrls.filter(
  (url) => !auditedComparables.has(comparable(mapToBase(url))),
);

if (sitemapCheckLimit > 0 && uncheckedSitemapUrls.length > 0) {
  await mapLimit(
    uncheckedSitemapUrls.slice(0, sitemapCheckLimit),
    concurrency,
    async (url) => {
      const fetchUrl = mapToBase(url);
      const response = await fetchChain(fetchUrl, { readBody: false });

      if (response.status === 0) {
        addFinding(
          "T-07",
          "P1",
          "technical",
          url,
          `Sitemap URL could not be fetched: ${response.error || "network error"}`,
          "",
        );
        return;
      }

      if (response.status >= 500) {
        addFinding(
          "T-07",
          "P0",
          "technical",
          url,
          `Sitemap URL returns HTTP ${response.status}`,
          response.chain || [],
        );
        return;
      }

      if (response.status >= 400) {
        addFinding(
          "T-07",
          "P1",
          "technical",
          url,
          `Sitemap URL returns HTTP ${response.status}`,
          response.chain || [],
        );
        return;
      }

      if (response.redirectLoop || (response.chain?.length || 1) > 2) {
        addFinding(
          "T-07",
          "P1",
          "technical",
          url,
          "Sitemap URL has a redirect chain",
          response.chain || [],
        );
      } else if ((response.chain?.length || 1) === 2) {
        addFinding(
          "T-07",
          "P1",
          "technical",
          url,
          "Sitemap URL redirects; the sitemap should list the final URL",
          response.chain || [],
        );
      }

      if (isNoindex(response.headers.get("x-robots-tag"))) {
        addFinding(
          "T-07",
          "P1",
          "technical",
          url,
          "Sitemap URL emits X-Robots-Tag: noindex",
          response.headers.get("x-robots-tag") || "",
        );
      }
    },
  );
}

// Verify canonical targets where the environment allows it.
const canonicalChecks = [];
const auditedFinalStatuses = new Map();
for (const page of pageRecords) {
  auditedFinalStatuses.set(comparable(page.finalUrl), page.status);
}

for (const [target, meta] of canonicalTargets.entries()) {
  if (
    !sameOrigin(target, baseOrigin) &&
    !(checkExternalCanonicals && sameOrigin(target, siteOrigin))
  ) {
    continue;
  }
  if (auditedFinalStatuses.has(comparable(target))) continue;
  canonicalChecks.push({ target, meta });
  if (canonicalChecks.length >= 50) break;
}

await mapLimit(canonicalChecks, concurrency, async ({ target, meta }) => {
  const response = await fetchChain(target, { readBody: false });

  if (response.status === 0) {
    addFinding(
      "T-43",
      "P3",
      "technical",
      meta.pageUrl,
      `Canonical target could not be fetched from this environment: ${target}`,
      response.error || "",
    );
    return;
  }

  if (response.status >= 400) {
    addFinding(
      "T-43",
      "P1",
      "technical",
      meta.pageUrl,
      `Canonical target returns HTTP ${response.status}: ${target}`,
      response.chain || [],
    );
    return;
  }

  if (response.redirectLoop || (response.chain?.length || 1) > 1) {
    addFinding(
      "T-44",
      "P1",
      "technical",
      meta.pageUrl,
      `Canonical target redirects: ${target}`,
      response.chain || [],
    );
  }

  if (isNoindex(response.headers.get("x-robots-tag"))) {
    addFinding(
      "T-44",
      "P1",
      "technical",
      meta.pageUrl,
      `Canonical target emits X-Robots-Tag: noindex: ${target}`,
      response.headers.get("x-robots-tag") || "",
    );
  }
});

// Check same-origin internal links.
if (checkLinks && linkLimit > 0 && pageLinks.size > 0) {
  const candidateLinks = new Set();
  for (const links of pageLinks.values()) {
    for (const link of links) {
      const origin = new URL(link).origin;
      if (origin !== baseOrigin && origin !== siteOrigin) continue;
      if (auditedComparables.has(comparable(link))) continue;
      candidateLinks.add(link);
    }
  }

  const linksToCheck = [...candidateLinks].slice(0, linkLimit);
  let brokenReported = 0;

  await mapLimit(linksToCheck, concurrency, async (link) => {
    const fetchUrl = mapToBase(link);
    const response = await fetchChain(fetchUrl, { readBody: false, maxHops: 4 });

    if (response.status === 0) {
      addFinding(
        "C-30",
        "P2",
        "links",
        link,
        `Link target could not be fetched: ${response.error || "network error"}`,
        "",
      );
      return;
    }

    if (response.status >= 400) {
      if (brokenReported < 40) {
        addFinding(
          "C-30",
          "P1",
          "links",
          link,
          `Internal link target returns HTTP ${response.status}`,
          response.chain || [],
        );
        brokenReported += 1;
      } else {
        addFinding(
          "C-30",
          "P2",
          "links",
          link,
          "Additional broken internal links were found; see the crawl evidence",
          "",
        );
      }
      return;
    }

    if (response.redirectLoop || (response.chain?.length || 1) > 2) {
      addFinding(
        "T-14",
        "P2",
        "links",
        link,
        "Internal link target has a redirect chain",
        response.chain || [],
      );
    }
  });
}

// Duplicate title / description groups.
function duplicateGroups(field, id, severity, label) {
  const groups = new Map();
  for (const page of pageRecords) {
    if (page.status !== 200) continue;
    if (isNoindex(page.robotsMeta)) continue;
    const value = normalizeSpace(page[field]).toLowerCase();
    if (!value || value.length < 10) continue;
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(page);
  }

  let reported = 0;
  for (const pages of groups.values()) {
    if (pages.length < 2) continue;
    if (reported >= 15) {
      addFinding(
        id,
        "P2",
        field === "title" ? "metadata" : "content",
        siteOrigin,
        `Additional duplicate ${label} groups were found`,
        "increase evidence review",
      );
      break;
    }
    reported += 1;
    addFinding(
      id,
      severity,
      field === "title" ? "metadata" : "content",
      pages[0].url,
      `Duplicate ${label} across ${pages.length} pages: "${normalizeSpace(
        pages[0][field],
      ).slice(0, 100)}"`,
      pages
        .slice(0, 8)
        .map((page) => page.url)
        .join(", "),
    );
  }
}

duplicateGroups("title", "C-01", "P2", "title");
duplicateGroups("description", "C-05", "P2", "meta description");

// Soft-404 check: a missing URL must not return 200.
const missingUrl = new URL(
  `/seo-legend-missing-${Date.now()}`,
  baseOrigin,
).href;
const missingResponse = await fetchChain(missingUrl, { readBody: false });

if (missingResponse.status === 200) {
  addFinding(
    "T-18",
    "P1",
    "technical",
    missingUrl,
    "Missing URL returns HTTP 200 (soft 404 or catch-all route)",
    missingResponse.chain || [],
  );
} else if (missingResponse.status >= 500) {
  addFinding(
    "T-18",
    "P1",
    "technical",
    missingUrl,
    `Missing URL returns HTTP ${missingResponse.status}`,
    missingResponse.chain || [],
  );
} else if (missingResponse.status === 0) {
  addFinding(
    "T-18",
    "P3",
    "technical",
    missingUrl,
    "Could not test 404 handling",
    missingResponse.error || "",
  );
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const finishedAt = new Date();
const counts = { P0: 0, P1: 0, P2: 0, P3: 0 };
for (const finding of findings) {
  counts[finding.severity] = (counts[finding.severity] || 0) + 1;
}

const hasBlockingFindings = counts.P0 > 0 || counts.P1 > 0;
const processExitCode = exitZero ? 0 : hasBlockingFindings ? 1 : 0;

findings.sort(
  (left, right) =>
    severityRank(left.severity) - severityRank(right.severity) ||
    left.url.localeCompare(right.url) ||
    left.id.localeCompare(right.id),
);

const loadedSitemaps = sitemapResult.loaded.filter(
  (entry) => entry.status === 200 && !entry.error,
).length;

console.log("");
console.log(`SEO Legend audit v${VERSION}`);
console.log(`Target:         ${baseUrl.href}`);
console.log(`Canonical site: ${siteOrigin}`);
console.log(
  `Discovery:      ${discoveryMode} (${pageRecords.length} page(s) audited)`,
);
console.log(
  `Robots:         ${robots.status || "unreachable"}${
    robots.disallowAll ? " (BLOCKS ALL CRAWLING)" : ""
  }`,
);
console.log(
  `Sitemaps:       ${loadedSitemaps} loaded, ${sitemapResult.urls.length} unique URL(s)`,
);
console.log("");

for (const severity of SEVERITIES) {
  const list = findings.filter((finding) => finding.severity === severity);
  if (list.length === 0) continue;
  console.log(`${severity} — ${list.length} finding(s)`);
  for (const finding of list.slice(0, 15)) {
    console.log(`  [${finding.id}] ${finding.url}`);
    console.log(`        ${finding.message}`);
  }
  if (list.length > 15) {
    console.log(`  ... and ${list.length - 15} more (see JSON report)`);
  }
  console.log("");
}

if (findings.length === 0) {
  console.log("No findings. All automated checks passed.");
  console.log("");
}

console.log(
  `Summary: P0=${counts.P0} P1=${counts.P1} P2=${counts.P2} P3=${counts.P3}`,
);
console.log(
  hasBlockingFindings
    ? "Result: FAIL — P0/P1 findings require action."
    : "Result: PASS — no P0/P1 findings.",
);
if (exitZero && hasBlockingFindings) {
  console.log("Note: --exit-zero is active; the process exit code is forced to 0.");
}
console.log("");

const report = {
  meta: {
    tool: "seo-legend-audit",
    version: VERSION,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    target: baseUrl.href,
    site: siteOrigin,
    discovery: discoveryMode,
    options: {
      maxPages,
      routes: routeList,
      checkLinks,
      linkLimit,
      sitemapCheckLimit,
      concurrency,
      timeoutMs,
      strictHost,
      checkExternalCanonicals,
      exitZero,
    },
  },
  robots: {
    url: robotsUrl,
    status: robots.status,
    disallowAll: robots.disallowAll,
    sitemaps: robots.sitemaps,
    error: robots.error,
  },
  sitemaps: {
    roots: sitemapRoots,
    loaded: sitemapResult.loaded,
    urlCount: sitemapResult.urls.length,
    rawCount: sitemapResult.rawCount,
    duplicates: sitemapResult.duplicates,
    audited: pageRecords.filter((page) => page.source === "sitemap").length,
    statusChecked: Math.min(
      sitemapCheckLimit,
      uncheckedSitemapUrls.length,
    ),
  },
  pages: pageRecords,
  findings,
  summary: {
    pagesAudited: pageRecords.length,
    findings: counts,
    totalFindings: findings.length,
    exitCode: processExitCode,
  },
};

let reportPath = null;
if (typeof args.json === "string" && args.json.trim()) {
  reportPath = path.resolve(process.cwd(), args.json.trim());
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`JSON report: ${reportPath}`);
}

if (reportPath === null) {
  console.log("Tip: add --json=seo-report.json to save machine-readable evidence.");
}

process.exitCode = processExitCode;
