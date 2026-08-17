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
| Claimed | `/claim` comment, assignee set | 2× the tier's time estimate, then auto-release |
| Delivered | PR opened with `Closes #<issue>` | — |
| Under review | Requester reviews | 7 days, then escalates to `stale-review` |
| Settled | PR merged, ledger updated, profiles updated | — |

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

Maintainers cannot: create TP out of nothing, alter historical ledger entries, or grant themselves TP. Ledger corrections are append-only compensating entries, never edits. The audit job recomputes every balance from the full history and will surface any edit.

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
| 已接单 | `/claim` 评论，指派 assignee | 档位预估时长的 2 倍，之后自动释放 |
| 已交付 | 提 PR，正文含 `Closes #<issue>` | — |
| 待验收 | 发布者审阅 | 7 天后升级为 `stale-review` |
| 已结算 | PR 合并，账本与档案更新 | — |

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

维护者不可以：凭空创造 TP、修改历史账本条目、给自己发 TP。账本更正一律是只追加的冲正条目，绝不是编辑。审计任务会从完整历史重算每一个余额，任何编辑都会被翻出来。

## 修改这些规则

开一个带 `governance` 标签的 issue。涉及 TP 定价或红线的变更，需要 7 天公开讨论才能合并。红线 1、2、5 在本项目以当前形态存在期间不接受协商 —— 如果社区想改那几条，它想要的是另一个项目。
