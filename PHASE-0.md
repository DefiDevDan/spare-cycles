# Phase 0 — Does anyone actually show up?

**English** | [简体中文](#简体中文)

No automation until this question is answered. The bot, the workflows, the ledger jobs, the CLI — all of it is worthless if nobody claims a task, and building it first is the standard way to spend three months on a marketplace with one user.

So: run five real tasks by hand and watch what happens.

## The rules for Phase 0

- **P0 tasks only.** Public repositories, no redaction, no sandboxes. Privacy is the hard problem and it is worth solving, but not before knowing whether the social side works at all.
- **Real tasks.** Things actually on a backlog, not exercises invented for the experiment. Candidates from the maintainer's own repos: `file2md`, `mdlook`, `Homelab`, `xuantuotuoV2`.
- **Ledger by hand.** Append entries to `ledger.jsonl` after each settlement, run `npm test` and `npm run ledger` to confirm the invariants still hold.
- **No recruiting favors.** Asking friends to claim tasks as a favor produces a fake signal. If it only works when people are doing you a personal favor, it does not work.

## What to measure

Three numbers. The third one matters most.

| Question | Why |
|---|---|
| **How long until someone claims?** | If it is measured in weeks, there is no marketplace here yet. |
| **Is the delivered work usable?** | Merged without a rewrite, or merged after fixing it yourself? The second is worse than doing it yourself. |
| **Why did they claim it?** | Ask afterwards, casually. Points? Reputation? Curiosity about someone else's codebase? Just being helpful? |

The third question is the real experiment. The whole incentive design in [GOVERNANCE.md](GOVERNANCE.md) rests on a guess: that reputation and access to real production code matter more than the points, and that the points are just a gate against freeloading. If five people all say "I did it for the TP," that guess is wrong and the design needs rethinking before any of it gets automated.

## The manual loop

1. Open a task issue with the template. Note the TP in the ledger as an `escrow` entry.
2. Someone comments `/claim`. Assign them, note the date in the issue.
3. They open a PR against the target repo, and comment `/done <PR-URL>` on the task issue with the attestation from [templates/delivery-pr-template.md](templates/delivery-pr-template.md).
4. Review it honestly. If it is not good enough, say so — a Phase 0 where every delivery gets a polite merge teaches nothing.
5. Merge, append a `settle` entry, run `npm run ledger:write`, write a line in the worker's profile.
6. Afterwards, ask them why they took it. Write the answer down.

## Unplanned finding: the points only run in one direction

Recorded 2026-08-18, before the third question has been answered, because it does not depend
on the answer.

After five settled tasks the balances are `ghzhost 40`, `manav8498 10`, `mxx1111 0`. Posting a
task escrows points immediately, so the maintainer — the only account that has ever posted a
task — can no longer post one. The no-quota routes exist so that having no points does not lock
you out, but every one of them (`review`, `redact-audit`, `spec`, `arbitrate`) attaches to a
task somebody else has already posted, and there are none. The loop closes on itself.

The escrow rule was written against the failure mode of people posting endlessly and never
delivering. What happened is the mirror image: **points accumulated with the people who only
deliver and ran out for the only person who was asking.** All five tasks came from one account.

This does not invalidate the escrow rule — it did prevent the failure it was aimed at. It says
the rule is incomplete, and that a board needs a way to seed requesters that does not depend on
those requesters first having worked. Left open deliberately rather than patched, because the
right fix depends on whether contributors turn out to want anything done at all — which is now
[asked directly](https://github.com/mxx1111/spare-cycles/issues/8).

## Exit criteria

**Proceed to Phase 1** if tasks get claimed within a few days and the deliveries are usable without a rewrite.

**Stop and rethink** if two weeks pass with five open tasks and no claims. The failure is upstream of anything code can fix — either the tasks are unappealing, or the reward is not a reward, or the people with spare capacity are not the people who want to spend it this way.

**Rethink the incentive model** if tasks do get claimed but everyone says they did it for the points. That means the points need to be worth something real, which reopens the whole cash-versus-credits question that was settled in favor of credits.

---

# 简体中文

# Phase 0 —— 到底有没有人来

在这个问题有答案之前不写任何自动化。bot、workflow、账本定时任务、CLI，只要没人接单，这些东西一文不值。先把它们建起来，是花三个月做出一个只有一个用户的平台的标准路径。

所以：手工跑五个真实任务，看看会发生什么。

## Phase 0 的规矩

- **只跑 P0 任务。** 公开仓库，不脱敏，不上沙箱。隐私是那个难题，值得解，但不该在"社会协作这一面到底成不成立"还没答案之前解。
- **必须是真任务。** 待办列表上真实存在的事，不是为了实验编出来的练习题。候选来自维护者自己的仓库：`file2md`、`mdlook`、`Homelab`、`xuantuotuoV2`。
- **账本手工记。** 每次结算后往 `ledger.jsonl` 追加条目，跑 `npm test` 和 `npm run ledger` 确认不变量还成立。
- **不要拉人情。** 让朋友出于交情来接单，得到的是假信号。如果只有在别人卖你面子的时候才转得动，那就是转不动。

## 要测什么

三个数字。第三个最重要。

| 问题 | 为什么 |
|---|---|
| **多久有人接？** | 如果是按周算的，这里还不存在一个市场。 |
| **交付的东西能用吗？** | 是直接合并，还是自己返工一遍才能合并？后者比自己干还糟。 |
| **他为什么接？** | 事后随口问一句。冲积分？冲信誉？好奇别人的代码库？还是就想帮个忙？ |

第三个问题才是真正的实验。[GOVERNANCE.md](GOVERNANCE.md) 里整套激励设计建立在一个猜测上：信誉和接触真实生产代码的机会，比积分更重要，积分只是一道防搭便车的闸门。如果五个人都说"我是冲积分来的"，这个猜测就是错的，在自动化之前设计得重来。

## 手工流程

1. 用模板开一个任务 issue，在账本里记一条 `escrow`。
2. 有人评论 `/claim`，指派给他，在 issue 里记下日期。
3. 他往目标仓库提 PR，并在任务 issue 下评论 `/done <PR链接>`，带上 [templates/delivery-pr-template.md](templates/delivery-pr-template.md) 里的声明。
4. 老实审阅。不够好就直说。一个每份交付都客气地合并掉的 Phase 0 什么都学不到。
5. 合并，追加一条 `settle`，跑 `npm run ledger:write`，在接单者的档案里写一行。
6. 事后问他为什么接这个活，把回答记下来。

## 计划外的发现：积分只朝一个方向流动

记于 2026-08-18，在第三个问题得到回答之前，因为这一条不依赖那个答案。

五个任务结算完，余额是 `ghzhost 40`、`manav8498 10`、`mxx1111 0`。发任务会立即托管积分，
于是唯一发过任务的账号——维护者——再也发不出任务。no-quota 通道的存在本来就是为了让「没积分」
不等于「被锁在外面」，但它们四个（`review`、`redact-audit`、`spec`、`arbitrate`）全都寄生在
别人已发布的任务上，而现在一个都没有。环闭合在自己身上。

托管规则是冲着「只发不接」这个失败模式写的。实际发生的是它的镜像：**积分堆在了只交付的人手里，
而唯一在求助的人耗光了。** 五个任务全部来自同一个账号。

这不能说明托管规则错了——它确实防住了它要防的东西。它说明规则不完整：一个板子需要某种给发单方
播种的机制，而这个机制不能以「发单方得先干过活」为前提。这里刻意留着不打补丁，因为正确的修法取决于
贡献者到底想不想让人帮他做事——这一点现在[已经直接问了](https://github.com/mxx1111/spare-cycles/issues/8)。

## 退出条件

**进入 Phase 1** —— 任务几天内有人接，交付不用返工就能用。

**停下来重想** —— 五个任务挂了两周没人接。问题在代码解决不了的上游：要么任务本身不吸引人，要么回报根本不算回报，要么有余力的人压根不想这么花。

**重做激励模型** —— 有人接，但所有人都说是冲积分来的。那意味着积分必须值点真东西，而这会重新打开"现金还是积分"那个已经按积分定案的问题。
