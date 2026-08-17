# Spare Cycles（余力）

**English** | [简体中文](README.zh-CN.md)

A mutual-aid task board for developers who use subscription AI coding tools.

Some weeks you burn through your Claude Max weekly limit by Wednesday and your project stalls. Other weeks the cycle rolls over with most of it unused. Across a community those two situations happen at the same time, to different people. Spare Cycles is an attempt to connect them.

## What this is not

**This is not a way to share, lend, pool, or resell AI subscription quota.** That is against Anthropic's terms and gets accounts banned. From the Consumer Terms:

> You may not share your Account login information, Anthropic API key, or Account credentials with anyone else. You also may not make your Account available to anyone else.

In February 2026 Anthropic went further and prohibited using Pro/Max OAuth tokens anywhere outside Claude Code and claude.ai, including routing other people's requests through your seat — even at low volume, even for an internal team tool.

So there are no quota pools here, no token relays, no proxies, no shared accounts. If you came looking for that, this is the wrong project. See [COMPLIANCE.md](COMPLIANCE.md).

## What this actually is

People with spare capacity **do the work themselves** and hand over the **result** — a pull request — rather than access to their account. You sit at your own keyboard, on your own subscription, and review what you ship. That is ordinary freelance work, and it is fine.

The scarce resource was never tokens. It was people with time and willingness.

## What you get out of it

**A verifiable public track record.** Every delivery is a merged PR in someone's real repository, recorded in `profiles/<your-handle>.md` with the task type, privacy tier, and the requester's assessment. Real production code, not toy problems. That is worth something when you are job hunting or pitching contract work, in a way that a LeetCode streak is not.

**Task Points (TP)** are the second thing, and they are deliberately boring. TP are an internal quota mechanism, not a reward — they exist so that nobody can post tasks forever without ever doing any. You earn them by delivering, you spend them by requesting. They cannot be transferred, gifted, cashed out, or traded. There is no secondary market and there will not be one.

## The privacy problem

Most people use AI coding tools on private business code. You cannot paste that onto a public task board. This is the hard part of the problem and most of the engineering here goes into it.

Every task declares a privacy tier:

| Tier | What the worker sees | Use when |
|---|---|---|
| **P0 · Public** | An ordinary open-source repo | The code is already public |
| **P1 · Redacted pack** | Interfaces, acceptance tests, fake fixtures. No business logic. | Default for private projects |
| **P2 · Ephemeral sandbox** | A Codespace on the requester's repo, revoked when done. Code never touches the worker's disk. | The task genuinely needs the real codebase |
| **P3 · Trust circle** | Full access under NDA | Established relationships only |

P1 is the interesting one. The `sparepack` CLI extracts a minimal reproducible subset from your private repo — allowlist only, nothing is exposed unless you name it — strips function bodies down to signatures, swaps real data for generated fixtures, scans for credentials and PII, and makes you review the output file by file before it writes anything. The worker implements against the tests. Your business logic never leaves your machine.

Details in [PRIVACY-TIERS.md](PRIVACY-TIERS.md).

## How it works

There is no website and no server. The whole thing runs on GitHub.

1. **Post** — open an issue with the task template. Your TP go into escrow.
2. **Claim** — a worker comments `/claim`. Limits apply: 2 concurrent, 5 per week. Real humans doing real work do not exceed that; bots hit the wall immediately.
3. **Deliver** — the worker opens a PR against *your* repo, closing the issue. The PR template requires them to confirm they reviewed the change themselves and shared no credentials.
4. **Settle** — you merge, the ledger records the transfer, both profiles update.

**This repository never hosts your code.** Task metadata, the ledger, and reputation live here. The code itself moves directly between the two parties' own repositories.

## Out of quota this week?

You can still earn TP with work that does not burn any:

| Task | TP |
|---|---|
| Review someone else's delivery | 5 |
| Audit a `sparepack` output before it goes public | 10 |
| Write acceptance tests for someone's task spec | 15 |
| Arbitrate a dispute (requires 5+ deliveries) | 10 |

## Status

Phase 0. Running tasks by hand to find out whether anyone actually shows up before building automation for it. Come break it.

## License

MIT
