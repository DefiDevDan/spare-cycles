#!/usr/bin/env node
// Scan every version-controlled file for credentials and personal data.
//
// This is COMPLIANCE.md red line 1 expressed as a job rather than as a promise. The rules
// come from sparepack's scanner so there is one definition of "what counts as a secret"
// instead of two that drift apart.
//
// Findings print as GitHub Actions annotations, so they land on the diff rather than in a
// log nobody opens. The excerpt is masked by the scanner — a check that printed the secret
// it found would be worse than no check.

import { execSync } from 'node:child_process'
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { BLOCKING, scanText } from 'sparepack/src/scan.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ALLOW_FILE = join(ROOT, '.github', 'scan-allow.txt')
const inCI = Boolean(process.env.GITHUB_ACTIONS)

/**
 * Entries are `rule-id:path` or `rule-id:path:line`, one per line, `#` for comments.
 * Add one only after reading that specific line and concluding it is safe to publish —
 * never to quiet a check that has become inconvenient.
 */
function loadAllowList() {
  if (!existsSync(ALLOW_FILE)) return new Set()
  return new Set(
    readFileSync(ALLOW_FILE, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#')),
  )
}

function isAllowed(finding, allow) {
  return (
    allow.has(`${finding.ruleId}:${finding.path}:${finding.line}`) ||
    allow.has(`${finding.ruleId}:${finding.path}`) ||
    allow.has(`${finding.ruleId}:*`)
  )
}

function report(finding) {
  const level = BLOCKING.has(finding.severity) ? 'error' : 'warning'
  const message = `${finding.label} (${finding.severity}) — ${finding.excerpt}. See COMPLIANCE.md red line 1.`
  console.log(
    inCI
      ? `::${level} file=${finding.path},line=${finding.line}::${message}`
      : `  ${finding.severity.padEnd(8)} ${finding.path}:${finding.line}  ${message}`,
  )
}

const allow = loadAllowList()
const files = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' }).trim().split('\n').filter(Boolean)

let blocking = 0
let warnings = 0
let suppressed = 0
let scanned = 0

for (const file of files) {
  let text
  try {
    text = readFileSync(join(ROOT, file), 'utf8')
  } catch {
    continue // unreadable, or deleted since the index was written
  }
  if (text.includes('\x00')) continue // binary
  scanned++

  for (const finding of scanText(text, { path: file })) {
    if (isAllowed(finding, allow)) {
      suppressed++
      continue
    }
    report(finding)
    if (BLOCKING.has(finding.severity)) blocking++
    else warnings++
  }
}

const summary =
  `Scanned ${scanned} file(s): ${blocking} blocking, ${warnings} warning` +
  (suppressed ? `, ${suppressed} suppressed by .github/scan-allow.txt` : '')
console.log(summary)

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `### Credential scan\n\n${summary}\n\nCredentials and personal data block the build; ` +
      `internal topology only warns.\n`,
  )
}

if (blocking) {
  console.error(
    `\nRefusing to pass: ${blocking} credential or personal-data finding(s) in tracked files.\n` +
      `Remove the value and rotate it — deleting the line does not rotate a leaked key, and the\n` +
      `old value stays in git history either way.\n` +
      `If the scanner is wrong, add the specific finding to .github/scan-allow.txt with a comment saying why.`,
  )
  process.exit(1)
}
