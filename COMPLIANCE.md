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

| Check | How |
|---|---|
| Credential patterns in issues/PRs/comments | CI regex scan, auto-minimize comment, `violation` label, maintainer ping |
| Quota-denominated pricing | CI keyword scan, `needs-review` label |
| Human-review attestation | Required checkbox in the PR template, CI fails if unchecked |
| Claim rate limits | Bot rejects `/claim` past the limit |
| Ledger integrity | Scheduled job recomputes balances from `ledger.jsonl` and diffs against `balances.json` |

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

| 检查项 | 手段 |
|---|---|
| issue/PR/评论里的凭证特征 | CI 正则扫描，自动折叠评论，打 `violation` 标签，@维护者 |
| 按额度计价 | CI 关键词扫描，打 `needs-review` 标签 |
| 人工审阅声明 | PR 模板必勾项，未勾选 CI 不通过 |
| 接单速率限制 | bot 在 `/claim` 时直接拒绝 |
| 账本完整性 | 定时任务从 `ledger.jsonl` 重算余额并与 `balances.json` 比对 |

故意违反第 1、2、5 条是永久封禁并清零余额。其余按具体情况处理，见 [GOVERNANCE.md](GOVERNANCE.md)。

## 举报

开一个带 `violation` 标签的 issue。如果涉及不适合公开讨论的凭证，直接邮件联系维护者。**不要把泄露的凭证本身贴进举报里。**

## 免责

这是一个由开发者而非律师运营的社区项目，内容反映的是 2026 年 8 月对相关条款的善意理解。条款会变。你的账号由你自己负责。如果你用的是雇主提供的 seat，先问过雇主，很多企业协议有自己的额外限制。

来源：
- [Anthropic Consumer Terms of Service](https://www.anthropic.com/legal/consumer-terms)
- [Anthropic Usage Policy](https://www.anthropic.com/legal/aup)
- [Claude Code legal and compliance](https://code.claude.com/docs/en/legal-and-compliance)
