# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Spare Cycles is a mutual-aid task board run entirely on GitHub — no server, no website. Since the
sparepack split, the only code left here is `ledger/`: an append-only Task Point (TP) ledger and its
verifier. Everything else (`README*.md`, `GOVERNANCE.md`, `COMPLIANCE.md`, `PRIVACY-TIERS.md`,
`PHASE-0.md`, `profiles/`, `templates/`, `.github/ISSUE_TEMPLATE/`) is the protocol itself.

The docs are not commentary on the code — the code enforces the docs. The ledger's schema exists to
make a written rule impossible to break, so read the relevant doc before changing behaviour.

**`sparepack` lives in its own repository now**: [mxx1111/sparepack](https://github.com/mxx1111/sparepack),
published to npm. It used to be `packages/sparepack/` here; it was split out with `git subtree split`
(history preserved) because the tool stands on its own while the task board is still unproven. Do not
re-add it here. Docs in this repo point users at `npx sparepack@beta`, so whoever publishes that
package must keep the `beta` dist-tag current, not just `latest`.

The project is in **Phase 0**: five real tasks run by hand to find out whether anyone claims them.
No automation, no bot, no CI workflows (`.github/` has templates only). Do not build the bot,
workflows, or ledger jobs unless asked — `PHASE-0.md` explains why that is a deliberate hold, not a
gap.

## Commands

Node ≥ 22, ESM (`"type": "module"`), zero dependencies — there is no `node_modules`, no lockfile, no
build step, and no linter.

```bash
npm test                     # node --test ledger/verify.test.mjs
npm run ledger               # verify ledger.jsonl, print balances (exit 1 = tampering)
npm run ledger:write         # verify and rewrite balances.json

# a single test by name
node --test --test-name-pattern "escrow" ledger/verify.test.mjs

# verify a fixture ledger instead of the real one (writes <path>.balances.json)
node ledger/verify.mjs /path/to/fixture.jsonl
```

## Ledger

`ledger/ledger.jsonl` is append-only: never edit, delete, or reorder a line. Corrections are new
compensating entries. `balances.json` is derived output — if it disagrees with the recomputation,
the recomputation is right and something tampered with the file.

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
a PR; **this repo never hosts anyone's code** — a P1 task ships as a separate public repo produced
by sparepack, and only the task issue lives here.

## Conventions

- **Bilingual docs.** Top-level protocol docs carry English then 简体中文, usually with an anchor
  link between them (`README.md` ↔ `README.zh-CN.md`, others split by `---` and a `# 简体中文`
  heading). When editing one language, update the other — they are the same document, not a
  translation appendix.
- **Docs describe what exists.** PRIVACY-TIERS.md once described container-based verification,
  a `faker:` fixture syntax, and a gitleaks integration, none of which were ever implemented; that
  drift was corrected in 39e772e. Planned behaviour belongs in PHASE-0.md, not in the tier spec.
- **Comments and commit bodies explain the choice, not the mechanism.** Commits are conventional
  commits with a Chinese subject and a body stating which of two designs was taken and what goes
  wrong under the other one.
- Tests are `node:test` + `node:assert/strict`, no framework.
