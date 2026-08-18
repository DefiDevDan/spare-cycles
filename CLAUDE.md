# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Spare Cycles is a mutual-aid task board run entirely on GitHub — no server, no website. Two things
here are actual code:

- `ledger/` — an append-only Task Point (TP) ledger plus its verifier
- `packages/sparepack/` — a published npm CLI that turns a slice of a private repo into a
  shareable task pack (contracts and tests, no business logic)

Everything else (`README*.md`, `GOVERNANCE.md`, `COMPLIANCE.md`, `PRIVACY-TIERS.md`, `PHASE-0.md`,
`profiles/`, `templates/`, `.github/ISSUE_TEMPLATE/`) is the protocol itself. The docs are not
commentary on the code — the code enforces the docs, and several modules exist specifically to make
a written rule impossible to break. Read the relevant doc before changing behaviour in either
package.

The project is in **Phase 0**: five real tasks run by hand to find out whether anyone claims them.
No automation, no bot, no CI workflows (`.github/` has templates only). Do not build the bot,
workflows, or ledger jobs unless asked — `PHASE-0.md` explains why that is a deliberate hold, not a
gap.

## Commands

Node ≥ 22, npm workspaces, ESM everywhere (`"type": "module"`), zero runtime deps in `ledger/`.

```bash
npm test                     # ledger tests + sparepack tests
npm run test:ledger          # node --test ledger/verify.test.mjs
npm run test:sparepack       # node --test packages/sparepack/test/*.test.mjs
npm run ledger               # verify ledger.jsonl, print balances (exit 1 = tampering)
npm run ledger:write         # verify and rewrite balances.json

# single test file / single test
node --test packages/sparepack/test/scan.test.mjs
node --test --test-name-pattern "placeholder" packages/sparepack/test/scan.test.mjs

# the CLI, from source
node packages/sparepack/bin/sparepack.mjs init
node packages/sparepack/bin/sparepack.mjs pack --no-color
node packages/sparepack/bin/sparepack.mjs verify ./sparepack-out
```

There is no linter and no build step. `sparepack`'s `prepublishOnly` runs the tests and `--help`.

## sparepack architecture

Pipeline, in order: `config.mjs` → `pack.mjs` (calls `interfaces.mjs` and `fixtures.mjs`) →
`scan.mjs` → manifest → human confirmation → disk. `verify.mjs` is a separate re-derivation of the
result. `bin/sparepack.mjs` is argument parsing, the confirmation prompt, and error formatting only.

Four invariants shape the design. Preserve them; a change that quietly breaks one is a leak, not a
regression.

**Allowlist only.** `config.mjs` has no `exclude` key and must never gain one. Unknown YAML keys are
errors, a glob matching nothing is an error, and paths escaping the repo root are rejected
(`assertInsideRoot`).

**Failures point at giving less.** `interfaces.mjs` parses with the TypeScript compiler and emits
*only* nodes a branch positively recognised as contract — it never copies the file and deletes
bodies. The `default: skip and warn` at the end of the dispatch is the whole design. Unsupported
languages throw `UnsupportedLanguageError` rather than passing through. Unexported functions and
classes are dropped entirely (the name alone leaks design); types/interfaces/enums are kept whole
even when unexported.

**Scan after redaction, never before.** `pack.mjs` applies `redact` rules, then scans. Scanning
first would report findings the author already handled and miss whether the redactions sufficed.
`critical`/`high` block the build unless `--allow-findings`. Two `scan.mjs` rules matter: a finding
never carries the full match (masked excerpt + length only), and placeholders (`example.com`,
`127.0.0.1`, `${DB_PASSWORD}`, `<your-token>`) are excluded by construction — over-flagging is
treated as a failure, not a safe default.

**Nothing is written before the author has seen it.** `buildPack` builds the entire pack in memory;
`writePack` is only ever reached after confirmation. The manifest shown on the terminal is *not* the
manifest written to disk — `toPublicManifest` strips warnings (which name dropped internal
functions) and redact patterns (literally the list of words that must not be seen). `MANIFEST.json`
keeps only paths, kinds, and sizes, which is what `verify` needs.

`verify.mjs` re-reads files from disk instead of trusting the manifest, and re-parses every
`stripped` file to confirm no function body survived except the throwing stub — a check sharing
assumptions with the thing it checks catches nothing.

Fixture generation (`shape[:n]`, `rows:n`, `text:n`, `empty`) is deterministic on purpose: two
builds of the same pack are byte-identical, so a diff means something real changed.

Note: sparepack's own test suite trips sparepack (22 blocking findings, all deliberate fixtures).
That is expected.

## Ledger

`ledger/ledger.jsonl` is append-only: never edit, delete, or reorder a line. Corrections are new
compensating entries. `balances.json` is derived output — if it disagrees with the recomputation,
the recomputation is right.

Six transaction types only: `grant`, `escrow`, `settle`, `refund`, `split`, `adjust`. **There is no
`transfer` and never will be** — that is COMPLIANCE red line 5 (TP are not transferable) expressed
as a data structure instead of a promise, and `verify.mjs` treats any unrecognised type as
tampering. Balances and escrow are checked incrementally at every entry, so a history that dips
negative mid-way and recovers is invalid. Schema and the nine invariants are in `ledger/README.md`.

Settling a task by hand: append the entry, run `npm test` and `npm run ledger:write`, then update
`profiles/<handle>.md`.

## The compliance red lines

`COMPLIANCE.md` is the hard boundary and it constrains code, not just conduct. Never implement,
suggest, or accept a contribution that shares credentials, routes anyone's requests through another
person's account, prices work in tokens or quota, enables headless auto-claiming, or makes TP
transferable between users. Workers do the work themselves on their own subscription and hand over
a PR; the repo never hosts anyone's code.

## Conventions

- **Bilingual docs.** Top-level protocol docs carry English then 简体中文, usually with an anchor
  link between them (`README.md` ↔ `README.zh-CN.md`, others split by `---` and a `# 简体中文`
  heading). When editing one language, update the other — they are the same document, not a
  translation appendix.
- **Comments explain the choice, not the mechanism.** Module headers state which of two designs was
  taken and what goes wrong under the other one. Match that register; do not add narration.
- Commit messages: conventional commits with a Chinese subject (`feat(sparepack): 脱敏任务包 CLI，…`).
- Tests are `node:test` + `node:assert/strict`, no framework. `e2e.test.mjs` builds a deliberately
  nasty fake private repo in a tmpdir and runs the real CLI against it — new leak paths belong
  there, asserted by named secret so a failure says which one escaped.
