# Governance / 治理

**English** | [简体中文](#简体中文)

## Task Points

### Pricing

Priced by complexity, never by tokens or quota (see [COMPLIANCE.md](COMPLIANCE.md) red line 3).

**Build tasks** — these consume the worker's AI quota:

| Tier | Scope | TP |
|---|---|---|
| S | ≤30 min. Bug fix, doc, missing test. | 10 |
| M | 30 min–2 h. One function, component, or endpoint. | 30 |
| L | 2 h–half a day. A complete feature with tests. | 80 |

There is no XL. Anything bigger gets split. Large single tasks are where disputes come from, and a half-finished XL is worthless to both sides.

**No-quota tasks** — these earn TP without burning any AI quota, so that being out of quota does not mean being locked out:

| Type | Scope | TP |
|---|---|---|
| `review` | Review someone's delivery PR | 5 |
| `redact-audit` | Second pair of eyes on a `sparepack` output before it goes public | 10 |
| `spec` | Write the acceptance tests that define someone's task | 15 |
| `arbitrate` | Serve as arbitrator on a dispute (5+ deliveries required) | 10 |

### Rules

- **New members start with 50 TP** — enough to post one M task.
- **Eligibility**: GitHub account 90+ days old with public contribution history. Checked at onboarding.
- **Escrow**: posting a task moves the TP out of your balance immediately. Insufficient balance, no task.
- **Not transferable.** Earned by delivering, spent by requesting, nothing else. No gifting, trading, selling, or holding on someone's behalf. The ledger has no user-to-user transfer type and the audit job treats one as tampering.
- **No expiry.** TP do not decay. There is no reason to hoard them and no reason to panic-spend.
- **No cash value.** Ever. Not redeemable, not refundable, not a security, not a currency.

### Claim limits

Two concurrent claims, five per rolling seven days. This is both an anti-abuse measure and evidence for red line 4: the throughput of this board is the throughput of people working by hand.

Limits are per person, not per account. Alt accounts to get around them are a ban.

---

## Task lifecycle

| Stage | Action | Timeout |
|---|---|---|
| Posted | Issue opened, TP escrowed | 30 days, then auto-close and refund |
| Claimed | `/claim` comment, **maintainer assigns the issue** | 2× the tier's time estimate, then auto-release |
| Delivered | PR opened with `Closes #<issue>` | — |
| Under review | Requester reviews | 7 days, then escalates to `stale-review` |
| Settled | PR merged, ledger updated, profiles updated | — |

### Claiming is a precondition, not an announcement

**Do not start work until the issue is assigned to you.** A `/claim` comment is a request;
the assignment is the answer. One person is assigned at a time, and only that person's
delivery is eligible for the TP.

This is not bureaucracy, it is the only thing standing between a contributor and wasted work.
On the board's first day, task #7 received two independently correct implementations two
hours apart. Both passed all nine acceptance tests. Only one could be paid. The second person
spent their evening on work that had already been done, and they had no way to know — nothing
on the issue said it was taken. That waste was the board's fault.

If an issue is already assigned and you think you can do better, say so in a comment rather
than opening a competing PR. If the assignee goes quiet past the timeout, the claim releases
and you can take it.

A `/claim` on an already-assigned issue, or from someone already at their limit (2 concurrent,
5 per rolling week), is declined with a comment explaining which limit was hit.

`/release` gives up a claim voluntarily with no penalty. Doing it three times in a row triggers a maintainer conversation, not a sanction — usually it means the tasks are badly specified.

---

## Disputes

Either party applies the `dispute` label. An arbitrator with 5+ deliveries and no involvement in the task picks it up. Target resolution: 3 days.

The arbitrator can rule:

- **Deliver** — the work meets the stated acceptance criteria. TP go to the worker. A requester who moves the goalposts after the fact does not get a refund.
- **Refund** — the work does not meet the criteria. TP return to the requester.
- **Split** — partial delivery. TP divided, with the reasoning recorded.

Every ruling is written into `ledger.jsonl` with the arbitrator's handle and a link to the reasoning. Rulings are public and appealable once, to a different arbitrator.

**Acceptance criteria are the contract.** If it was not in the issue when the task was claimed, it is not grounds for refusing delivery. This cuts both ways and it is why the task template makes acceptance criteria mandatory.

---

## Sanctions

| Behavior | Consequence |
|---|---|
| Sharing credentials (red line 1) | Permanent ban, balance zeroed |
| Routing others' requests (red line 2) | Permanent ban, balance zeroed |
| Transferring TP (red line 5) | Permanent ban, balance zeroed |
| Pricing in tokens/quota (red line 3) | Task voided, warning; repeat is a ban |
| Headless auto-claiming (red line 4) | Claims voided, 30-day suspension |
| Alt accounts to dodge rate limits | Permanent ban on all accounts |
| Delivering unreviewed AI output | Warning, then suspension. The attestation in the PR template is a statement of fact, and lying in it is the problem. |
| Repeatedly abandoning claims | Conversation first. Usually a task-quality problem, not a person problem. |

Bans are recorded publicly in `GOVERNANCE-LOG.md` with the red line cited. No secret enforcement.

---

## Maintainers

Currently one: [@mxx1111](https://github.com/mxx1111). This is a bootstrapping stage, not a permanent structure.

Maintainers can: arbitrate, apply sanctions, correct ledger errors (with a recorded reason), and merge changes to this repository.

Maintainers cannot: issue TP into their own balance for their own use, alter historical ledger entries, or settle a task to themselves as both requester and worker. Ledger corrections are append-only compensating entries, never edits. The audit job recomputes every balance from the full history and will surface any edit.

### The one exception: funding the board

Until **three separate accounts have each posted at least one task**, the maintainer may issue
TP for the single purpose of funding tasks that other people get paid for.

The distinction this rests on: TP cannot be transferred, sold, or cashed out, so points that pass
through the maintainer's balance and into escrow buy the maintainer nothing. They leave for a
worker's balance and stay there. Issuing them is inflation, not self-dealing — and inflation is
already visible, because `total_issued` is recomputed from the full history on every run of
`npm run ledger`.

Conditions, all of them:

- Recorded as an `adjust` naming the authorizing maintainer in `by` and citing this clause in `reason`
- Escrowed on a posted task within 24 hours, or reversed with a compensating entry
- Listed in [GOVERNANCE-LOG.md](GOVERNANCE-LOG.md) with the amount and what it funded
- 50 TP at a time, and never while the maintainer already holds an unescrowed balance

**None of this is machine-enforced.** `verify.mjs` will accept any `adjust` that balances; what
stops abuse is that every issuance is a line in a public append-only file with the maintainer's
name on it. This clause exists because the board's first month produced the opposite of the
expected failure: points accumulated with people who only deliver, and ran out for the only
person posting work. It expires on its own the moment a third requester appears.

**This rule has been broken once**, on 2026-08-18, and the exception is documented rather than hidden. The `ts` field on entries 1–8 had been hand-written as invented values instead of observed event times; the last of them was several hours in the future and had deadlocked settlement. All nine were rewritten in one pass with real times pulled from the GitHub API. No amount, type, account, or balance changed — only timestamps that were wrong to begin with. The reasoning is in the header of `ledger.jsonl` and in [GOVERNANCE-LOG.md](GOVERNANCE-LOG.md), and `verify.mjs` now rejects any future-dated entry, which would have caught it on the first line. If this needs doing again, it needs a `governance` issue and seven days of discussion like any other rule change.

## Changing these rules

Open an issue with the `governance` label. Changes affecting TP pricing or red lines need 7 days of open discussion before merging. Red lines 1, 2, and 5 are not up for negotiation while this project exists in its current form — if the community wants those changed, it wants a different project.

---

# 简体中文

## 积分（TP）

### 定价

按复杂度定价，永远不按 token 或额度（见 [COMPLIANCE.md](COMPLIANCE.md) 红线 3）。

**Build 类任务** —— 会消耗接单者的 AI 额度：

| 档位 | 范围 | TP |
|---|---|---|
| S | ≤30 分钟。修 bug、补文档、补测试。 | 10 |
| M | 30 分钟–2 小时。一个函数、组件或接口。 | 30 |
| L | 2 小时–半天。一个带测试的完整特性。 | 80 |

没有 XL。更大的必须拆。大颗粒的单个任务正是纠纷的来源，而一个做了一半的 XL 对双方都是废品。

**No-quota 类任务** —— 赚 TP 但不烧 AI 额度，让"这周额度用完了"不等于"没法参与"：

| 类型 | 范围 | TP |
|---|---|---|
| `review` | Review 别人的交付 PR | 5 |
| `redact-audit` | 在 `sparepack` 产出公开前当第二双眼睛复核 | 10 |
| `spec` | 帮别人写定义任务的验收测试 | 15 |
| `arbitrate` | 担任争议仲裁者（需 5 次以上交付） | 10 |

### 规则

- **新成员初始 50 TP**，刚好够发一个 M 任务。
- **准入门槛**：GitHub 账号注册满 90 天且有公开贡献记录，onboarding 时校验。
- **托管**：发布任务时 TP 立即从余额划走。余额不够就发不了。
- **不可转让。** 完成任务赚，发布任务花，没有第三条路径。不能赠与、交易、出售、代持。账本里不存在用户到用户的转账类型，审计任务发现即视为篡改。
- **不过期。** TP 不衰减。既没有囤积的理由，也没有恐慌性消费的理由。
- **无现金价值。** 永远不。不可兑换、不可退款，不是证券，不是货币。

### 接单上限

同时 2 个，滚动 7 天内 5 个。这既是防滥用措施，也是红线 4 的证据：这个板子的吞吐就是人手工干活的吞吐。

上限按人算，不按账号算。开小号绕过限制的，封。

---

## 任务生命周期

| 阶段 | 动作 | 超时 |
|---|---|---|
| 已发布 | issue 开启，TP 进托管 | 30 天后自动关闭并退回 |
| 已接单 | `/claim` 评论，**维护者指派 assignee** | 档位预估时长的 2 倍，之后自动释放 |
| 已交付 | 提 PR，正文含 `Closes #<issue>` | — |
| 待验收 | 发布者审阅 | 7 天后升级为 `stale-review` |
| 已结算 | PR 合并，账本与档案更新 | — |

### 认领是前置条件，不是通知

**issue 指派给你之前不要动手。** `/claim` 评论是申请，指派才是答复。同一时刻只指派一个人，
也只有那个人的交付有资格拿这份 TP。

这不是官僚流程，这是贡献者和白干之间唯一的那道屏障。板子开张第一天，任务 #7 在两小时内收到
两份各自都正确的实现，九个验收测试都全过，但只有一份能拿到钱。第二个人花了一晚上做一件已经
做完的事，而他没有任何办法知道——issue 上没有任何东西显示它已经被人接了。那份浪费是板子的
责任。

如果一个 issue 已经被指派，而你觉得自己能做得更好，在评论里说，不要另提一个 PR 竞争。如果
被指派的人超时没动静，认领会自动释放，那时你可以接。

对已被指派的 issue 发 `/claim`，或者发起人已经到了上限（同时 2 个、滚动 7 天内 5 个），会被
拒绝并附上说明是哪条限制卡住了。

`/release` 是主动放弃接单，无惩罚。连续三次会触发一次维护者对话，但那不是处分，通常意味着任务本身写得不清楚。

---

## 争议处理

任一方打 `dispute` 标签。由一位有 5 次以上交付、且与该任务无关的仲裁者接手，目标 3 天内出结果。

仲裁者可以裁定：

- **交付成立** —— 工作满足了写明的验收标准，TP 归接单者。事后加需求的发布者不给退款。
- **退回** —— 工作不满足标准，TP 退回发布者。
- **拆分** —— 部分交付，TP 按比例分，并记录理由。

每一次裁定都会写进 `ledger.jsonl`，带仲裁者账号和理由链接。裁定公开，可向另一位仲裁者申诉一次。

**验收标准就是合同。** 接单时 issue 里没写的东西，不能作为拒收的理由。这一条对双方同样成立，也正是任务模板把验收标准设为必填的原因。

---

## 处分

| 行为 | 后果 |
|---|---|
| 共享凭证（红线 1） | 永久封禁，余额清零 |
| 代理转发他人请求（红线 2） | 永久封禁，余额清零 |
| 转让 TP（红线 5） | 永久封禁，余额清零 |
| 按 token/额度计价（红线 3） | 任务作废并警告，再犯封禁 |
| 无人值守自动接单（红线 4） | 接单作废，停权 30 天 |
| 开小号绕过速率限制 | 所有账号永久封禁 |
| 交付未经审阅的 AI 输出 | 先警告后停权。PR 模板里那句声明是事实陈述，在那上面撒谎才是问题所在。 |
| 反复放弃接单 | 先对话。通常是任务质量问题，不是人的问题。 |

封禁记录公开写在 `GOVERNANCE-LOG.md` 里，注明违反的是哪条红线。不搞暗箱执行。

---

## 维护者

目前一位：[@mxx1111](https://github.com/mxx1111)。这是冷启动阶段的状态，不是长期结构。

维护者可以：仲裁、执行处分、更正账本错误（须记录理由）、合并本仓库的变更。

维护者不可以：把 TP 发进自己余额供自己使用、修改历史账本条目、把任务结算给自己（同时当发单方和接单方）。账本更正一律是只追加的冲正条目，绝不是编辑。审计任务会从完整历史重算每一个余额，任何编辑都会被翻出来。

### 唯一的例外：给板子供血

在**三个不同账号各自至少发过一个任务**之前，维护者可以发放 TP，且只能用于一个目的：给别人能拿到报酬的任务供资。

这一条依赖的区分是：TP 不可转让、不可交易、不能提现，所以经维护者余额进入托管的积分，对维护者本人一分钱价值都没有。它们会离开他的余额、进入接单者的余额，然后留在那儿。发放它是通胀，不是自肥——而通胀本来就是可见的，因为 `total_issued` 每次跑 `npm run ledger` 都会从完整历史重算一遍。

条件，缺一不可：

- 记为 `adjust`，`by` 写明授权的维护者，`reason` 里引用本条款
- 24 小时内必须托管到已发布的任务上，否则用冲正条目撤回
- 在 [GOVERNANCE-LOG.md](GOVERNANCE-LOG.md) 里列出金额和它资助了什么
- 一次 50 TP，且维护者手上还有未托管余额时不得再发

**以上没有任何一条是机器强制的。** `verify.mjs` 会接受任何能平账的 `adjust`；真正防滥用的是每一次发放都是一个只追加的公开文件里、署着维护者名字的一行。这条例外之所以存在，是因为板子的第一个月出现的是和预期相反的失败：积分堆在了只交付的人手里，而唯一在发任务的人耗光了。第三个发单者一出现，这条自动失效。

**这条规则被破过一次**，2026-08-18，而这次例外是写下来的，不是藏起来的。前 8 条的 `ts` 当初是手写的编造值而不是实际观测到的事件时间，其中最后一条落在几小时之后的未来，把结算卡死了。九条时间戳一次性用 GitHub API 拉的真实时间重写。金额、类型、账户、余额一律未动，改的只是本来就是错的那些时间。理由写在 `ledger.jsonl` 的文件头和 [GOVERNANCE-LOG.md](GOVERNANCE-LOG.md) 里，`verify.mjs` 现在会拒绝任何未来时间的条目——那条不变量本来在第一行就能拦住它。如果还需要再来一次，就得走 `governance` issue 和七天讨论，跟任何其他规则变更一样。

## 修改这些规则

开一个带 `governance` 标签的 issue。涉及 TP 定价或红线的变更，需要 7 天公开讨论才能合并。红线 1、2、5 在本项目以当前形态存在期间不接受协商 —— 如果社区想改那几条，它想要的是另一个项目。
