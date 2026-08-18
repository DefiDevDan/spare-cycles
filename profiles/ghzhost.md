# @ghzhost

Joined 2026-08-18 · 4 deliveries · 0 disputes · 40 TP earned

## Deliveries

| Date | Task | Tier | Privacy | PR | Requester's note |
|---|---|---|---|---|---|
| 2026-08-18 | Express error handler leaked internal error text | S | P1 | [task-express-error-handler#1](https://github.com/mxx1111/task-express-error-handler/pull/1) | First P1 delivery on the board. Nine acceptance tests passing, none weakened. Worked entirely from interfaces and tests without seeing the source repository. |
| 2026-08-18 | mdlook had no CI at all | S | P0 | [mdlook#17](https://github.com/mxx1111/mdlook/pull/17) | Correct on the two details that are easy to get wrong: lint without `--fix`, node-version matching `engines.node` exactly. |
| 2026-08-18 | notify.py supported only Server 酱 | S | P0 | [Homelab#3](https://github.com/mxx1111/Homelab/pull/3) | Encodes non-ASCII titles via RFC 2047 — without it every Chinese alert title would render as mojibake in ntfy. |
| 2026-08-18 | platform-limits.json had no staleness check | S | P0 | [wechat-mp-writer-skill-mxx#2](https://github.com/mxx1111/wechat-mp-writer-skill-mxx/pull/2) | Scheduled runs open a GitHub issue rather than just reddening a tab nobody opens. Blocking-vs-warning decided deliberately, with reasoning in the PR. |

## Note

Four deliveries in one day, all accepted, none requiring rework. The P1 one matters most: it
was the first time anyone did useful work on this board seeing only a contract and a spec,
with the business logic left behind on the requester's machine. That was the project's
load-bearing assumption and it held.

One thing worth recording honestly, because it is a rule that did not exist yet: two PRs were
opened against Homelab within the same minute implementing the same feature, and two more
tasks were worked without an assignment. There was no claim requirement at the time — it was
added the same day, partly because of the duplicate work this caused for someone else. Not
counted against these deliveries.

The 99 lines of tests in the closed Homelab#2 were the most valuable single artifact submitted
and were lost when the other implementation was chosen. An invitation stands to port them as a
`no-quota` task.
