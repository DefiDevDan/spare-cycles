# Compliance / 合规红线

**English** | [简体中文](#简体中文)

This document defines the hard limits of the project. They are not aspirational. Violating any of them gets you removed from the community, and several of them are enforced by CI rather than by trust.

## The five red lines

### 1. Never share credentials

No account logins, no API keys, no OAuth tokens, no session cookies, no `~/.claude/.credentials.json`, no `auth.json`, nothing. Not in an issue, not in a PR, not in a DM, not "just this once between friends."

Anthropic Consumer Terms:

> You may not share your Account login information, Anthropic API key, or Account credentials with anyone else. You also may not make your Account available to anyone else.

There is nowhere in this repository to put a credential. The issue templates have no such field, the bot reads no such field, and the ledger schema has no such field. This is deliberate.

### 2. Never route someone else's requests through your account

No proxies, no relays, no token pools, no "I'll run your prompts for you on my Max plan." In February 2026 Anthropic explicitly prohibited using Free/Pro/Max OAuth credentials outside Claude Code and claude.ai, including on behalf of third parties, and stated this applies even to low-volume internal tooling.

If you want to provide a service that programmatically calls Claude, use an API key from the Claude Console. That is what it is for.

### 3. Never price work in tokens or quota

Task Points are priced by **task complexity** — S / M / L — and by nothing else.

The moment anyone writes "I have 2M tokens left this week, who wants them for X TP," this stops being a mutual-aid board and becomes a quota resale scheme wearing a costume. Every compliance measure above it collapses at that point.

CI flags task descriptions containing quota-denominated pricing language for human review.

### 4. Never run headless auto-claiming

A human being reads the task, decides to take it, does the work, and reviews the result before submitting. No bots watching the issue feed and auto-claiming. No unattended agents delivering PRs nobody looked at.

Rate limits (2 concurrent, 5 per week) exist partly to enforce this and partly as evidence: the throughput ceiling of this board is the throughput of a person working by hand.

### 5. Task Points are not transferable

Earned by delivering, spent by requesting. That is the entire lifecycle. No gifting, no trading, no selling, no holding on someone's behalf.

The ledger schema contains no user-to-user transfer transaction type. If one ever appears in `ledger.jsonl`, the audit job treats it as tampering and raises an alert.

## What is explicitly fine

- Using your own subscription to do paid or unpaid work for other people, and delivering the output. This is ordinary freelancing and the Consumer Terms do not prohibit commercial use.
- Being credited as the author of a PR in someone else's repository.
- Learning from, and being paid in reputation for, work on a codebase that is not yours.

The line is between delivering **output** and delivering **access**. Output is fine. Access is not.

## Enforcement

| Check | How | Status |
|---|---|---|
| Credential patterns in tracked files | `ci.yml` scans every version-controlled file using sparepack's rules; findings appear as annotations on the diff | **live** |
| Credential patterns in issues and comments | `compliance.yml` scans the submitted text, applies the `violation` label, and comments naming the rule but never the value | **live** |
| Quota-denominated pricing | `compliance.yml` scans issue and comment text and applies `needs-review`; it flags for a human rather than blocking | **live** |
| Ledger integrity | `ci.yml` recomputes every balance from `ledger.jsonl` and fails if the committed `balances.json` disagrees | **live** |
| Human-review attestation | `ci.yml` requires the four PR-template statements to be present and ticked | **live, this repo only** |
| Attestation on delivery PRs | Delivery PRs live in the requester's repository, out of this workflow's reach. Rides on the `/done` comment instead | **not enforced** |
| Claim rate limits | Needs a bot that does not exist yet; `/claim` is handled by hand during Phase 0 | **not enforced** |

Two of these are honest gaps rather than oversights, and they are listed as gaps so that nobody
reads this table and assumes more protection than exists. Both need the Phase 1 bot, which is
deliberately unbuilt until Phase 0 answers whether the task board works at all.

One limit worth stating plainly: the ledger check catches a stale snapshot and an edited
history, but it cannot catch someone who edits the history *and* regenerates the snapshot in
the same commit. What catches that is the append-only rule and a human reading the diff. CI
narrows the gap; it does not close it.

Deliberate violation of red lines 1, 2, or 5 is a permanent ban with the balance zeroed. The rest are handled case by case, see [GOVERNANCE.md](GOVERNANCE.md).

## Reporting

Open an issue with the `violation` label, or email the maintainer if it involves credentials that should not be discussed in public. Do not paste the leaked credential into the report.

## Not legal advice

This is a community project run by developers, not lawyers. It reflects a good-faith reading of the terms as of August 2026. Terms change. You are responsible for your own account. If you are using an employer-provided seat, check with your employer first — many enterprise agreements have their own restrictions.

Sources:
- [Anthropic Consumer Terms of Service](https://www.anthropic.com/legal/consumer-terms)
- [Anthropic Usage Policy](https://www.anthropic.com/legal/aup)
- [Claude Code legal and compliance](https://code.claude.com/docs/en/legal-and-compliance)

---

# 简体中文

本文件定义项目的硬性红线。这些不是倡议，是底线。违反其中任何一条会被移出社区，其中几条由 CI 强制执行而不是靠自觉。

## 五条红线

### 1. 绝不共享凭证

账号登录信息、API key、OAuth token、session cookie、`~/.claude/.credentials.json`、`auth.json`，一个都不行。不能发在 issue 里，不能发在 PR 里，不能发在私信里，也没有"就这一次，朋友之间"这种说法。

Anthropic 消费者条款原文：

> You may not share your Account login information, Anthropic API key, or Account credentials with anyone else. You also may not make your Account available to anyone else.
>
> （不得与任何人共享你的账号登录信息、API key 或账号凭证，也不得让任何其他人使用你的账号。）

这个仓库里没有任何地方可以放凭证。issue 模板没有这样的字段，bot 不读这样的字段，账本 schema 里也没有这样的字段。这是故意设计的。

### 2. 绝不把别人的请求路由过你的账号

不做代理，不做中转，不做 token 池，不接"你把 prompt 给我，我用我的 Max 帮你跑"。2026 年 2 月 Anthropic 明确禁止在 Claude Code 和 claude.ai 之外使用 Free/Pro/Max 的 OAuth 凭证，包括代表第三方使用，并且说明这一条对低频的内部工具同样适用。

想做一个会程序化调用 Claude 的服务，去 Claude Console 申请 API key。那才是给这种场景用的。

### 3. 绝不按 token 或额度计价

积分只按**任务复杂度**定价，S / M / L 三档，除此之外没有别的依据。

只要有人写出"我这周还剩 200 万 token，谁要，X 积分"，这个板子就不再是互助板，而是套了层壳的额度倒卖。上面所有合规努力在那一刻全部归零。

CI 会把含额度计价表述的任务描述标出来交人工复核。

### 4. 绝不做无人值守的自动接单

由活人读任务、决定接、把活干了、在提交前审阅结果。不许有 bot 盯着 issue 流自动 `/claim`，不许无人值守的 agent 交出没人看过的 PR。

接单速率限制（同时 2 个、每周 5 个）一半是为了执行这条，一半是作为证据：这个板子的吞吐上限就是一个人手工干活的吞吐。

### 5. 积分不可转让

完成任务赚，发布任务花，生命周期就这两步。不能赠与，不能交易，不能出售，不能代持。

账本 schema 里不存在用户到用户的转账交易类型。`ledger.jsonl` 里一旦出现这种记录，审计任务会当作篡改直接报警。

## 什么是明确允许的

- 用自己的订阅为别人干活（有偿或无偿），交付产出。这是普通的自由职业，消费者条款并不禁止商业用途。
- 作为作者署名在别人仓库的 PR 上。
- 在不属于自己的代码库上学习，并以信誉作为回报。

界线在于交付的是**产出**还是**访问权**。产出没问题，访问权不行。

## 执行方式

| 检查项 | 手段 | 状态 |
|---|---|---|
| 受版本控制文件里的凭证 | `ci.yml` 用 sparepack 的规则扫描全部文件，命中以注解形式落在 diff 上 | **已生效** |
| issue 与评论里的凭证 | `compliance.yml` 扫描提交的文本，打 `violation` 标签并评论说明违反了哪条规则，但绝不复述那个值 | **已生效** |
| 按额度计价 | `compliance.yml` 扫描 issue 与评论文本，打 `needs-review` 交人工复核，不做拦截 | **已生效** |
| 账本完整性 | `ci.yml` 从 `ledger.jsonl` 重算全部余额，与提交的 `balances.json` 不符即失败 | **已生效** |
| 人工审阅声明 | `ci.yml` 要求 PR 模板那四条声明存在且已勾选 | **已生效，仅限本仓库** |
| 交付 PR 的声明 | 交付 PR 在发布者自己的仓库里，本 workflow 够不着，改由 `/done` 评论承载 | **未强制** |
| 接单速率限制 | 需要一个还不存在的 bot；Phase 0 期间 `/claim` 由人工处理 | **未强制** |

后两条是如实标注的缺口，不是疏漏。列在这里是为了不让人读完这张表以为保护比实际更多。它们都需要
Phase 1 的 bot，而那个 bot 被刻意推迟，直到 Phase 0 回答「这个任务板到底成不成立」。

有一条局限值得直说：账本检查能抓到过期的快照和被编辑的历史，但抓不到在同一个提交里既改历史又
重新生成快照的人。能抓住那种情况的是「只追加」这条规则和一双读 diff 的眼睛。CI 收窄了缺口，
但没有把它堵死。

故意违反第 1、2、5 条是永久封禁并清零余额。其余按具体情况处理，见 [GOVERNANCE.md](GOVERNANCE.md)。

## 举报

开一个带 `violation` 标签的 issue。如果涉及不适合公开讨论的凭证，直接邮件联系维护者。**不要把泄露的凭证本身贴进举报里。**

## 免责

这是一个由开发者而非律师运营的社区项目，内容反映的是 2026 年 8 月对相关条款的善意理解。条款会变。你的账号由你自己负责。如果你用的是雇主提供的 seat，先问过雇主，很多企业协议有自己的额外限制。

来源：
- [Anthropic Consumer Terms of Service](https://www.anthropic.com/legal/consumer-terms)
- [Anthropic Usage Policy](https://www.anthropic.com/legal/aup)
- [Claude Code legal and compliance](https://code.claude.com/docs/en/legal-and-compliance)
