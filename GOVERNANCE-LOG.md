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

---

**2026-08-18 (later).** Issue #6, opened by `OpensrcLord` one minute after its four-claims-in-24-seconds
spree, was closed as not-planned. It was a PR-shaped body claiming to implement #5 — which was in fact
delivered by `ghzhost` and settled — with no pull request behind it. Found while verifying the
agent-watch API example in the README against the real board: the query returned an "open bounty"
that the ledger said was settled. The ledger was right.

---

**2026-08-18 — duplicate delivery, second occurrence.** `macakii327-prog` opened
[mxx1111/wechat-mp-writer-skill-mxx#3](https://github.com/mxx1111/wechat-mp-writer-skill-mxx/pull/3)
at 11:04, 210 lines solving task #3. The task was settled with `ghzhost` at 11:14 — ten minutes
later. The account never commented on the issue and never claimed it; it forked, worked, and
delivered.

No sanction, and no fault on their side. The claim rule had been posted to that issue at 10:30,
thirty-four minutes earlier, which is not a window anyone could reasonably be expected to catch.
The PR was closed as superseded with a full explanation of the timeline and an explicit statement
that no consolation TP exists — points go to the assignee, are not transferable, and the
maintainer balance is zero.

This is the same failure as task #7 on the same day. Two occurrences means the claim rule was
necessary but is not sufficient while it lives only in prose: nothing on an open issue mechanically
signals "taken". That is the strongest argument yet for the Phase 1 bot, and it now has a cost
attached — two contributors' evenings.

---

**2026-08-18 — maintainer issued 50 TP to fund the board, and amended the rule that forbade it.**

The board reached zero open tasks with the maintainer at 0 TP. Posting escrows points immediately,
and all four no-quota earning routes (`review`, `redact-audit`, `spec`, `arbitrate`) attach to a
task somebody else has already posted — of which there were none. Nobody but the maintainer had
ever posted a task, so the board could not restart itself.

GOVERNANCE.md previously read *"Maintainers cannot: create TP out of nothing … or grant themselves
TP."* That clause was amended rather than ignored. The rule-change procedure requires 7 days of
open discussion only for changes to **TP pricing or red lines**; issuance rules are neither, so a
`governance` issue was opened instead ([#12](https://github.com/mxx1111/spare-cycles/issues/12)).

The amendment is deliberately narrow: issuance is permitted only to fund tasks other people get
paid for, only while fewer than three accounts have ever posted a task, 50 TP at a time, never
while the maintainer holds an unescrowed balance, and every unit must reach escrow within 24 hours.
The distinction it rests on is that TP cannot be transferred or cashed out, so points passing
through the maintainer's balance into escrow buy the maintainer nothing.

What actually happened, in the ledger:

| seq | type | amount | detail |
|---|---|---|---|
| 14 | `adjust` | +50 | issued to `mxx1111`, `by` mxx1111, reason cites the clause |
| 15 | `escrow` | −30 | task [#9](https://github.com/mxx1111/spare-cycles/issues/9), sparepack scaffold emission (M) |
| 16 | `escrow` | −10 | task [#10](https://github.com/mxx1111/spare-cycles/issues/10), sparepack path remapping (S) |
| 17 | `escrow` | −10 | task [#11](https://github.com/mxx1111/spare-cycles/issues/11), generate landing-page stats from the ledger (S) |

Maintainer balance after: **0 TP**. Total issued rose from 50 to 100, which `npm run ledger`
reports on every run — the inflation is visible by construction rather than by disclosure.

This is the second maintainer privilege exercised on this board, after the one-time timestamp
correction earlier the same day. Both are written down here. A third should prompt someone to ask
whether the rules are being written around the maintainer.

---

**2026-08-18 — `OpensrcLord` suspended 30 days under red line 4.** Claims voided; suspension
runs to **2026-09-17**. No balance touched, because the account never had one.

Eight claims, zero deliveries, across every task this board has ever had open:

| When | What |
|---|---|
| 00:08:19–00:08:43 | `/claim` or `/attempt` on #1–#5 — all five, in 24 seconds |
| 00:09:44 | PR #6, filing an `mdlook` CI file into this repository, body claiming to close #5 |
| 15:11–15:14 | `/claim` or `/attempt` on #9, #10, #11 — all three, minutes after posting |

The first burst was written off as the board's failure: it predated the claim rule, and nothing
on an issue could say "taken". The rule was published at 10:30. The second burst came at 15:11
with the same signature — every open task, minutes after posting, identical filler about reading
the codebase, no pull request after. That repetition is what decided it.

Separately: the account was **86 days old** at first contact, against a documented onboarding
minimum of 90 days with public contribution history. That check exists in GOVERNANCE.md and is
not automated, so it never ran. It would have blocked this account before the first comment.
That is now the strongest concrete argument for the Phase 1 bot on record, and it cost eight
spurious claims across two rounds.

The sanction is 30 days rather than permanent because red line 4 distinguishes a script from an
enthusiastic person moving fast, and that distinction is a judgement call. The comment invites
the account to reply with what they actually had, and states that an honest account reverses this
with the reversal written into this log.

`chfr19820610-cell` posted three more identical pitches (one per new task), bringing that account
to **18** for the board's history. Minimized as spam, no sanction issued yet — the account has
never claimed anything, so red line 4 does not attach. It is noise, not a claim-blocker.

---

**2026-08-18 — claim rule referred back for revision, one day after it was written.**
[#16](https://github.com/mxx1111/spare-cycles/issues/16), open for 7 days by choice.

Three tasks went up at 15:10. `OpensrcLord` claimed all three by 15:14; `ghzhost` delivered two
of them by 15:38. Nobody was assigned, because assignment is manual and the maintainer was
asleep. Read literally the rule awards the tasks to the account that has never delivered and
puts the person who delivered both in violation.

The rule has an unwritten dependency: it requires a maintainer to be awake. The proposal keeps
the intent — nobody should lose an evening to work already done — via self-assignment after 30
minutes, expiry at 2× the tier estimate, no blocking hold for accounts with no delivery history,
and delivering-without-a-claim treated as a risk taken rather than an offence.

Held open for 7 days despite the procedure not requiring it. This is the third
maintainer-convenient rule change in two days, after the timestamp correction and the funding
clause. #12 said a third should prompt someone to ask whether the rules are being written around
the maintainer; the answer to that is not to decide this one alone.

---

**2026-08-19 — claim expiry folded into [#16](https://github.com/mxx1111/spare-cycles/issues/16)
rather than opened separately.** Claiming and expiry are two halves of one mechanism; deciding
them apart produces rules that contradict each other.

Four changes proposed to the expiry half:

1. **The board sets the deadline, not the requester.** The requester already sets it by choosing
   the tier, which *is* a time estimate. A separate field would let a task contradict its own
   tier. The market reason matters more: workers are the scarce side here — one account has
   posted every task, two people have ever delivered — and a requester-set deadline is a
   pressure lever aimed at the scarce side. Requesters may extend, never shorten, by comment.
2. **Flat 24 / 48 / 72 h instead of 2× the tier estimate.** 2× gives an S task a one-hour
   window, which punishes not sharing the maintainer's timezone rather than punishing idleness.
3. **Measure silence, not elapsed time.** Any substantive comment or draft PR resets the clock;
   a warning fires at 75% instead of a silent repossession. The signal worth detecting is
   holding a task while saying nothing, and the cost of saying something is near zero.
4. **New: a delivery PR with no commit and no author reply for 7 days releases the claim.** None
   of the three existing timers covers a worker who opens a half-finished PR and disappears —
   delivery stops the claim clock and the task is pinned by a PR nobody will finish.

All of it is unenforced, like every other timer, until the Phase 1 bot exists. Recorded as a
specification for that bot rather than as a rule taking effect on merge — the last rule written
quickly required a maintainer to be awake, and that went unnoticed until it awarded two tasks to
an account with no deliveries.

