#!/usr/bin/env node
/**
 * SEO Legend — package validator
 *
 * Zero-dependency Node.js 18+ check for the skill itself:
 *   - required files exist
 *   - checklist finding IDs are unique
 *   - every automated finding ID is registered in the checklist
 *   - every finding ID mentioned in markdown is registered
 *   - relative links and qualified skill paths resolve
 *   - scripts/seo-audit.mjs parses
 *
 * Usage:
 *   node scripts/validate-skill.mjs
 *
 * Exit codes: 0 = pass, 1 = at least one problem.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const failures = [];

function fail(message) {
  failures.push(message);
}

function rel(file) {
  return path.relative(skillRoot, file) || ".";
}

function read(relativePath) {
  return readFileSync(path.join(skillRoot, relativePath), "utf8");
}

// ---------------------------------------------------------------------------
// 1. Required files
// ---------------------------------------------------------------------------

const requiredFiles = [
  "SKILL.md",
  "README.md",
  "LICENSE",
  "references/01-technical.md",
  "references/13-sources.md",
  "references/14-frameworks.md",
  "missions/00-mission-brief.md",
  "missions/01-full-audit.md",
  "missions/05-fix-loop.md",
  "checklists/audit.md",
  "checklists/agent-signoff.md",
  "templates/metadata.md",
  "templates/json-ld.md",
  "scripts/seo-audit.mjs",
];

let requiredFound = 0;
for (const relativePath of requiredFiles) {
  if (existsSync(path.join(skillRoot, relativePath))) {
    requiredFound += 1;
  } else {
    fail(`missing required file: ${relativePath}`);
  }
}

// ---------------------------------------------------------------------------
// 2. Checklist registry
// ---------------------------------------------------------------------------

const checklistText = read("checklists/audit.md");
const checklistRows = checklistText
  .split(/\r?\n/)
  .filter((line) => /^\|\s*[A-Z]+-\d+\s*\|/.test(line));
const registry = new Map();

for (const line of checklistRows) {
  const id = line.match(/^\|\s*([A-Z]+-\d+)\s*\|/)[1];
  if (registry.has(id)) fail(`duplicate checklist ID: ${id}`);
  registry.set(id, line);
}

// ---------------------------------------------------------------------------
// 3. Automated finding IDs
// ---------------------------------------------------------------------------

const auditPath = path.join(skillRoot, "scripts/seo-audit.mjs");
const auditText = read("scripts/seo-audit.mjs");
const automatedIds = new Set(
  [
    ...auditText.matchAll(/addFinding\(\s*["']([A-Z]+-\d+)["']/g),
    ...auditText.matchAll(/duplicateGroups\([^,]+,\s*["']([A-Z]+-\d+)["']/g),
  ].map((match) => match[1]),
);

for (const id of automatedIds) {
  if (!registry.has(id)) {
    fail(`audit script emits unregistered finding ID: ${id}`);
  }
}

// ---------------------------------------------------------------------------
// 4. Markdown references
// ---------------------------------------------------------------------------

const markdownFiles = [];
(function walk(directory) {
  for (const entry of readdirSync(directory)) {
    const full = path.join(directory, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(md|txt)$/.test(entry)) markdownFiles.push(full);
  }
})(skillRoot);

function targetResolves(fromFile, target) {
  const clean = target.split("#")[0].split("?")[0];
  if (!clean || /^(https?:|mailto:|#|\/)/.test(clean)) return true;
  return (
    existsSync(path.resolve(path.dirname(fromFile), clean)) ||
    existsSync(path.resolve(skillRoot, clean))
  );
}

let linkCount = 0;
for (const file of markdownFiles) {
  const text = readFileSync(file, "utf8");

  for (const match of text.matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)) {
    linkCount += 1;
    if (!targetResolves(file, match[1])) {
      fail(`broken link in ${rel(file)}: ${match[1]}`);
    }
  }

  for (const match of text.matchAll(/`([^`\n]+)`/g)) {
    const value = match[1].trim();
    const isSkillPath =
      /^(references|missions|checklists|templates|scripts)\//.test(value) ||
      /^(SKILL|README|LICENSE)\.md$/.test(value);
    if (!isSkillPath) continue;
    linkCount += 1;
    if (!targetResolves(file, value)) {
      fail(`broken skill path in ${rel(file)}: ${value}`);
    }
  }

  for (const match of text.matchAll(/\b([TCSPUIELAGMX])-\d{2}\b/g)) {
    if (!registry.has(match[0])) {
      fail(`unregistered finding ID in ${rel(file)}: ${match[0]}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 5. Audit script syntax
// ---------------------------------------------------------------------------

const syntax = spawnSync(process.execPath, ["--check", auditPath], {
  encoding: "utf8",
});
if (syntax.status !== 0) {
  fail(`scripts/seo-audit.mjs does not parse: ${syntax.stderr.trim()}`);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log("SEO Legend — skill validation");
console.log(`Root: ${skillRoot}`);
console.log(`Required files: ${requiredFound}/${requiredFiles.length}`);
console.log(`Checklist rows: ${checklistRows.length} (${registry.size} unique)`);
console.log(`Automated finding IDs: ${automatedIds.size}`);
console.log(`Markdown files: ${markdownFiles.length}`);
console.log(`Links and paths checked: ${linkCount}`);
console.log(`Audit script syntax: ${syntax.status === 0 ? "OK" : "FAILED"}`);

console.log("");
if (failures.length === 0) {
  console.log("Result: PASS — the skill package is internally consistent.");
  process.exitCode = 0;
} else {
  console.log(`Result: FAIL — ${failures.length} problem(s):`);
  for (const message of failures) console.log(`  - ${message}`);
  process.exitCode = 1;
}
