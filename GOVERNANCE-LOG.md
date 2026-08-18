# Governance log / 治理记录

Every sanction is recorded here with the red line it cites. GOVERNANCE.md promises no secret
enforcement, and this file is where that promise is kept. Entries are append-only.

每一次处分都记在这里，并注明违反的是哪条红线。GOVERNANCE.md 承诺不搞暗箱执行，这个文件就是
兑现那句承诺的地方。只追加。

---

## 2026-08-18 · Comments minimized on the first batch of tasks

**What happened.** The first five tasks were posted at 00:06 UTC. Within hours the board
attracted automated bounty-farming behaviour alongside the genuine deliveries.

| Account | Behaviour | Red line |
|---|---|---|
| `OpensrcLord` | Posted `/attempt` or `/claim` on four tasks between 00:08:19 and 00:08:43 — **four tasks in twenty-four seconds** — each with near-identical filler ("I'm reading the codebase", "will drop a PR shortly"). No pull request followed on any of them. | 4 (no headless auto-claiming), and the 2-concurrent limit |
| `chfr19820610-cell` | Pasted the same LLM-written pitch four or five times on each of five issues, fifteen comments in total, across a sixteen-minute window. | Spam. No red line names it directly; GOVERNANCE.md's sanction table covers it under repeated abuse. |

**Action taken.** Nineteen comments minimized — the `chfr19820610-cell` duplicates as SPAM,
the `OpensrcLord` claims as OFF_TOPIC. No accounts banned, no balances touched. Neither
account held TP; neither had been onboarded.

**Why minimizing rather than banning.** Both behaviours are covered by sanctions that assume
a member of the community — someone who onboarded, holds TP, and has something to lose.
Neither of these accounts did. There is nothing to zero out and nothing to suspend. What the
comments actually cost is the attention of people reading the board, so removing them from
view is the proportionate response. If either account returns and does the same thing, that
becomes repeat behaviour and the table in GOVERNANCE.md applies properly.

**Not sanctioned.** `Rithikmahadev12` quoted a price in US dollars on #5. That is a
misunderstanding of what this board is, not a violation — the task descriptions do not say
loudly enough that TP have no cash value. A reply explaining it is the right response, and
the landing page now says it in the first screen. `manav8498` opened a pull request against
Homelab without commenting on the issue first; under the claim rule added today that would
now be out of order, but the rule did not exist when they did it, so it does not count
against them.

**What this changed.** The claim rule in GOVERNANCE.md went from a description of intended
behaviour to an enforced precondition, because #7 had two people independently deliver the
same work and only one could be paid. That waste is the board's fault, not the workers'.
