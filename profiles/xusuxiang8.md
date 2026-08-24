# @xusuxiang8

Joined 2026-08-19 · 0 accepted deliveries · 0 disputes · 10 TP (pending settlement)

## Deliveries

| Date | Task | Tier | Privacy | PR | Requester's note |
|---|---|---|---|---|---|
| 2026-08-19 | sparepack destination path remapping | S | P0 | [sparepack#3](https://github.com/mxx1111/sparepack/pull/3) (closed) | Closed as the latest of three submissions and the only one without tests. Contains the best design in the set: `remap: [{from, to}]` generalises the accepted `stripPrefix`, and the PR states the root cause more precisely than the task issue did. |

## Note

Closed, and the design was kept.

`stripPrefix` removes one leading prefix. `remap` maps any prefix to any other, which is the
general form of the same problem. The PR also identified why the documented workaround fails —
running sparepack from a subdirectory does not help when config, tests and source share no
useful common root — a limitation the task issue never stated.

Same rule defect as [rafaio1](rafaio1.md): claiming required a maintainer to assign by hand,
the maintainer was asleep, and the board showed an open task to everyone who looked.
Compensated 10 TP through the `split` route.

The follow-up task generalising `remap` credits this PR as its source and is held for this
contributor for seven days before opening to the board.

---

**Pending.** The 10 TP above is decided but not yet in `ledger.jsonl`. A `settle` entry must
name a merged pull request and is verified against the GitHub API by `npm run ledger:prs`, so
the entry follows the merge rather than preceding it. This note comes off when it lands.
