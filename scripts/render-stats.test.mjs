#!/usr/bin/env node
// Tests for render-stats.mjs. Run: node --test scripts/render-stats.test.mjs
// Verifies:
// 1. Rendering output is deterministic
// 2. Bilingual span pairs data-zh/data-en are preserved
// 3. --check exits 0 on matching HTML and non-zero on stale/drifted HTML
// 4. Refuses to render when ledger invariants are broken

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, readFileSync, rmSync, copyFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const RENDER_SCRIPT = join(HERE, 'render-stats.mjs')

test('render-stats is deterministic and preserves bilingual markup', () => {
  const originalHtml = readFileSync(join(ROOT, 'docs', 'index.html'), 'utf8')

  // Run render-stats twice
  execFileSync(process.execPath, [RENDER_SCRIPT])
  const run1 = readFileSync(join(ROOT, 'docs', 'index.html'), 'utf8')
  execFileSync(process.execPath, [RENDER_SCRIPT])
  const run2 = readFileSync(join(ROOT, 'docs', 'index.html'), 'utf8')

  assert.equal(run1, run2, 'multiple runs must produce byte-identical output')
  assert.ok(run1.includes('data-zh'), 'must preserve data-zh attributes')
  assert.ok(run1.includes('data-en'), 'must preserve data-en attributes')
  assert.ok(run1.includes('<!-- stats:balances -->'), 'must contain marker comments')
})

test('render-stats --check succeeds when current and fails when drifted', () => {
  // Test success
  const res = execFileSync(process.execPath, [RENDER_SCRIPT, '--check'], { encoding: 'utf8' })
  assert.ok(res.includes('matches computed ledger stats'))

  // Create temporary sandbox to test failure on drifted html
  const dir = mkdtempSync(join(tmpdir(), 'sc-stats-test-'))
  try {
    mkdirSync(join(dir, 'docs'), { recursive: true })
    mkdirSync(join(dir, 'ledger'), { recursive: true })
    mkdirSync(join(dir, 'scripts'), { recursive: true })

    copyFileSync(join(ROOT, 'ledger', 'ledger.jsonl'), join(dir, 'ledger', 'ledger.jsonl'))
    copyFileSync(join(ROOT, 'ledger', 'verify.mjs'), join(dir, 'ledger', 'verify.mjs'))
    copyFileSync(RENDER_SCRIPT, join(dir, 'scripts', 'render-stats.mjs'))

    // Write a drifted docs/index.html
    const goodHtml = readFileSync(join(ROOT, 'docs', 'index.html'), 'utf8')
    const staleHtml = goodHtml.replace('17 entries', '999 entries')
    writeFileSync(join(dir, 'docs', 'index.html'), staleHtml)

    assert.throws(
      () => {
        execFileSync(process.execPath, [join(dir, 'scripts', 'render-stats.mjs'), '--check'], {
          encoding: 'utf8',
          stdio: 'pipe',
        })
      },
      (err) => err.status !== 0,
      'expected --check to exit non-zero on drifted HTML'
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('render-stats refuses to update when ledger is invalid', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sc-invalid-test-'))
  try {
    mkdirSync(join(dir, 'docs'), { recursive: true })
    mkdirSync(join(dir, 'ledger'), { recursive: true })
    mkdirSync(join(dir, 'scripts'), { recursive: true })

    // Write an invalid ledger (tampered transfer type)
    writeFileSync(
      join(dir, 'ledger', 'ledger.jsonl'),
      '{"seq":1,"ts":"2026-08-18T00:00:00Z","type":"transfer","from":"a","to":"b","amount":10}\n'
    )
    copyFileSync(join(ROOT, 'ledger', 'verify.mjs'), join(dir, 'ledger', 'verify.mjs'))
    copyFileSync(RENDER_SCRIPT, join(dir, 'scripts', 'render-stats.mjs'))
    copyFileSync(join(ROOT, 'docs', 'index.html'), join(dir, 'docs', 'index.html'))

    assert.throws(
      () => {
        execFileSync(process.execPath, [join(dir, 'scripts', 'render-stats.mjs')], {
          encoding: 'utf8',
          stdio: 'pipe',
        })
      },
      (err) => err.status !== 0,
      'expected render-stats to fail when ledger invariants break'
    )
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
