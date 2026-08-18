#!/usr/bin/env node
// Scan one piece of user-submitted text — an issue body, a PR body, a comment — for the two
// things COMPLIANCE.md says CI enforces: leaked credentials (red line 1) and pricing
// denominated in tokens or quota (red line 3).
//
// Reads stdin, writes a JSON verdict to stdout. It needs no GitHub token; the workflow
// decides what to do with the verdict.
//
//   echo "$BODY" | node scripts/scan-text.mjs

import { BLOCKING, scanText } from 'sparepack/src/scan.mjs'

import { scanPricing } from './pricing-rules.mjs'

const input = await new Promise((resolve) => {
  let buffer = ''
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', (chunk) => (buffer += chunk))
  process.stdin.on('end', () => resolve(buffer))
})

const credentials = scanText(input, { path: '<submitted text>' }).filter((f) => BLOCKING.has(f.severity))
const pricing = scanPricing(input)

console.log(
  JSON.stringify(
    {
      credentials: credentials.map((f) => ({
        rule: f.ruleId,
        severity: f.severity,
        label: f.label,
        line: f.line,
        excerpt: f.excerpt,
      })),
      pricing,
      block: credentials.length > 0,
      review: pricing.length > 0,
    },
    null,
    2,
  ),
)
