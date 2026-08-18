import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { scanPricing } from './pricing-rules.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const flags = (text) => scanPricing(text).map((h) => h.ruleId)

function assertFlagged(text, why) {
  const hits = scanPricing(text)
  assert.ok(hits.length > 0, `should have been flagged (${why}):\n  ${text}`)
}

function assertClean(text, why) {
  const hits = scanPricing(text)
  assert.deepEqual(hits, [], `false positive (${why}):\n  ${text}\n  matched: ${hits.map((h) => h.excerpt).join(' | ')}`)
}

// --- the thing the rule exists to catch ----------------------------------

test('offering quota for points is flagged', () => {
  assertFlagged('I have 2M tokens left this week, 500k tokens for 30 TP', 'direct exchange')
  assertFlagged('我这周还剩 200万 额度，换 50 积分', 'direct exchange, Chinese')
  assertFlagged('30 TP for 1M tokens, DM me', 'reverse direction')
})

test('a per-token rate is flagged', () => {
  assertFlagged('paying $3/M tokens for this', 'dollar rate')
  assertFlagged('5 积分 每 1k tokens', 'points-per-token rate')
  assertFlagged('2 TP per 100k quota', 'points per quota')
})

test('advertising leftover quota is flagged', () => {
  assertFlagged('还剩 300万 tokens 用不完，谁要', 'quota on offer')
  assertFlagged('I have 5M tokens leftover this cycle, available to whoever wants them', 'quota on offer')
})

// --- the hard part: this project talks about quota constantly ------------

test('the document defining the rule does trip it — which is why the rule is not run on files', () => {
  // COMPLIANCE.md explains red line 3 by quoting the forbidden phrasing verbatim, in both
  // languages: "I have 2M tokens left this week, who wants them for X TP". Any pattern
  // precise enough to catch a real offer catches that quotation too, and no amount of
  // tuning fixes it — a document defining a rule has to be able to state what it forbids.
  //
  // The resolution is scope, not cleverness: pricing rules run against user-submitted text
  // (issue bodies, comments) and never against repository files. This test pins that
  // reasoning down so nobody later wires scanPricing into scan-repo.mjs and spends an
  // afternoon wondering why the compliance doc fails compliance.
  const hits = scanPricing(readFileSync(join(ROOT, 'COMPLIANCE.md'), 'utf8'))
  assert.ok(
    hits.length > 0,
    'COMPLIANCE.md quotes the forbidden phrasing; if this stops matching, the rule has gone blind',
  )
  assert.ok(hits.every((h) => h.ruleId === 'quota-on-offer'))
})

test('documents that only describe the rule stay clean', () => {
  // Unlike COMPLIANCE.md these do not quote an offer, so they must not match.
  for (const file of ['GOVERNANCE.md', 'README.md', 'README.zh-CN.md', 'PHASE-0.md']) {
    assertClean(readFileSync(join(ROOT, file), 'utf8'), file)
  }
})

test('realistic issue bodies are judged correctly', () => {
  const legitimate = `**Type:** build · **Size:** M (30 TP) · **Privacy:** P1

The CSV importer loads the whole file into memory. It needs to stream.
Expect this to take about an hour; the repo is small, maybe 40k tokens of context.

**Confirmations**
- [x] The reward is priced by task complexity, not by tokens or quota.`
  assertClean(legitimate, 'a well-formed task issue')

  const violation = `Anyone need quota? I have 3M tokens left this cycle, who wants them.
Happy to do 1M tokens for 20 TP.`
  assertFlagged(violation, 'an actual offer')
})

test('ordinary talk about limits and quota is not an offer', () => {
  assertClean('I burned through my weekly limit by Wednesday', 'stating a fact')
  assertClean('This task will use maybe 200k tokens of your quota', 'estimating cost')
  assertClean('Claude Max has a 5-hour rolling window plus a weekly cap', 'describing the product')
  assertClean('额度用完了，这周接不了活', 'saying you are out')
  assertClean('Task Points are priced by complexity, never by tokens or quota', 'stating the rule')
  assertClean('积分只按任务复杂度定价，不按 token 或额度', 'stating the rule in Chinese')
})

test('a normal task description with a TP price is not flagged', () => {
  assertClean(
    '**Type:** build · **Size:** S (10 TP) · **Privacy:** P0\n\nFix the CSV importer so it streams.',
    'ordinary task header',
  )
  assertClean('This is an M task, 30 TP, should take about an hour', 'ordinary pricing')
})

test('mentioning both TP and tokens in unrelated sentences is not an exchange', () => {
  assertClean(
    'This task is worth 30 TP.\n\nSeparately: the repo has about 50k tokens of context, so it fits in one session.',
    'both words present, no offer',
  )
})

// --- reporting -----------------------------------------------------------

test('a finding reports its rule, line, and a short excerpt', () => {
  const hits = scanPricing('line one\nline two\n500k tokens for 30 TP')
  assert.equal(hits.length >= 1, true)
  assert.equal(hits[0].line, 3)
  assert.ok(hits[0].excerpt.length <= 80)
  assert.ok(hits[0].label.length > 0)
})

test('scanning is repeatable', () => {
  const text = '500k tokens for 30 TP and 1M tokens for 60 TP'
  assert.deepEqual(flags(text), flags(text))
})

test('empty input is clean', () => {
  assertClean('', 'empty')
})
