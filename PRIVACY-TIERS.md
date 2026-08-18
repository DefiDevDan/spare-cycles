# Privacy Tiers / 隐私分级

**English** | [简体中文](#简体中文)

Most people use AI coding tools on private business code. That code cannot go on a public task board. This document defines the four ways around that, ordered by how much the worker gets to see.

Every task issue must declare exactly one tier.

---

## P0 · Public

The task lives in a repository that is already public. Point at it and go.

**Worker sees:** everything, same as any open-source contributor.
**Setup cost:** none.
**Use for:** open-source maintenance, general-purpose tooling, algorithm work, anything where the code is not the secret.

Phase 0 of this project runs P0 only. Get the social mechanics working before adding machinery.

---

## P1 · Redacted pack — the default for private work

The idea: **do not hand over code, hand over a specification.** Interface signatures, acceptance tests, and fake fixtures. The worker writes an implementation that makes the tests pass. Your business logic never leaves your machine.

Produced by the `sparepack` CLI:

```bash
sparepack init            # interactive, writes sparepack.yml
sparepack pack            # extract → redact → review → emit
sparepack verify <pkg>    # run the tests in a clean container, re-scan for secrets
```

### Allowlist only

Nothing is exposed unless you name it. There is no "exclude these and ship the rest" mode, because that mode is how leaks happen.

```yaml
include:    [ "src/payment/types.ts" ]        # exposed verbatim
interfaces: [ "src/payment/gateway.ts" ]      # signatures kept, bodies emptied
tests:      [ "tests/payment/*.spec.ts" ]     # this IS the task specification
fixtures:   { "data/orders.json": "faker:order[20]" }
redact:     [ { pattern: "acme-corp|ACME", replace: "example-org" } ]
```

### What gets scanned

Built-in patterns for API key prefixes across major providers, Chinese national ID numbers, mainland mobile numbers, email addresses, private IP ranges and internal hostnames, database connection strings, and common table-name shapes. Optionally shells out to `gitleaks` if it is installed.

### The human gate

Automated redaction is not trustworthy enough to be the last step. After packing, `sparepack` prints the complete file manifest with byte counts and a per-file summary of what was kept, emptied, or substituted, and waits for you to type a confirmation before anything is written to disk.

If you would not be comfortable posting the manifest publicly, do not confirm.

### When P1 does not fit

Some tasks genuinely need the surrounding codebase — debugging an integration issue, tracking down a race condition, anything where the bug is in the interaction rather than in one function. Those go to P2.

---

## P2 · Ephemeral sandbox

The code never touches the worker's disk.

1. Requester adds the worker as a collaborator, scoped to one dedicated branch via branch protection.
2. Worker opens a **Codespace on their own GitHub account** and runs **their own** Claude Code inside it.
3. Work happens, PR goes up, requester merges.
4. Requester removes the collaborator, deletes the branch. The Codespace expires on its own.

### Why Codespaces and not a container on the requester's machine

**Neither party is the other's host.** This is the whole point.

If the sandbox ran on the requester's hardware, the requester would be root on the box where the worker's `~/.claude/.credentials.json` is mounted. That turns a privacy feature into a credential-harvesting device — strictly worse than not doing it at all. Putting the sandbox on Microsoft's infrastructure makes it a neutral third party to both sides, and personal accounts get 60 free core-hours a month.

The cost is that your code passes through GitHub's cloud. For most projects that is already true. For the ones where it is not, see P3.

### Checklist for the requester

- [ ] Branch protection restricts the worker to the task branch
- [ ] No secrets in the repo's Codespaces secrets for that branch
- [ ] Repository-level Actions permissions reviewed before granting access
- [ ] Calendar reminder to revoke access after merge

---

## P3 · Trust circle

Full repository access under an NDA, for people you already have a relationship with. Requires 5+ successful deliveries in the community before a worker is eligible.

### Self-hosted sandbox (not implemented)

For code that genuinely cannot go to any cloud. **There is no implementation of this today** — what follows is the requirement, not a thing you can go and use.

A container the requester hosts, with: egress allowlisted to `api.anthropic.com` plus package registries and nothing else, access granted through a per-task ephemeral credential pinned to the worker's single device, full session recording, and destruction of both container and credential when the task closes.

An earlier draft of this document pointed at a self-hosted terminal gateway as the starting point for building it. That project is no longer maintained, so the pointer has been removed rather than left to rot. If you need this tier, expect to build it, and read the warning below first — it may change your mind about wanting it.

**⚠️ Read this before using it.** In this mode the host can technically read credentials inside the container. The mitigations (session recording, ephemeral tokens, egress control) reduce the blast radius but do not eliminate that fact. Use it only where the trust already exists and both sides understand the tradeoff. If you are the worker and you do not know the requester personally, decline and ask for P1 or P2 instead.

---

## Choosing a tier

```
Is the code already public?                      → P0
Can the task be expressed as tests + interfaces? → P1   ← try hard to land here
Does it need the live codebase to reproduce?     → P2
Can the code not go to any cloud at all?         → P3, only with people you know
```

Bias toward P1. If you find yourself reaching for P2 often, the tasks are probably too large — split them.

---

# 简体中文

大部分人是拿 AI 在私有业务代码上干活的，那种代码没法往公开任务板上贴。本文件定义绕开这个问题的四种办法，按接单者能看到的信息量排序。

每个任务 issue 必须且只能声明一个级别。

---

## P0 · 公开

任务在一个本来就公开的仓库里，直接给链接就完事。

**接单者能看到：** 全部，跟任何开源贡献者一样。
**准备成本：** 零。
**适用于：** 开源维护、通用工具、算法题，以及任何"代码本身不是秘密"的场景。

本项目 Phase 0 只跑 P0。先把社会协作那套跑通，再上机械。

---

## P1 · 脱敏任务包 —— 私有项目的默认选择

思路是：**不给代码，给规约。** 接口签名、验收测试、假数据。接单者写一个能让测试通过的实现。你的业务逻辑压根没离开过你的机器。

由 `sparepack` CLI 生成：

```bash
sparepack init            # 交互式，生成 sparepack.yml
sparepack pack            # 抽取 → 脱敏 → 人工复核 → 产出
sparepack verify <pkg>    # 在干净容器里跑测试，再扫一遍密钥
```

### 白名单制

你不点名的东西一概不暴露。**没有**"排除这几个、剩下的都发出去"这种模式，因为泄露就是这么发生的。

```yaml
include:    [ "src/payment/types.ts" ]        # 原样暴露
interfaces: [ "src/payment/gateway.ts" ]      # 保留签名，清空函数体
tests:      [ "tests/payment/*.spec.ts" ]     # 这就是任务规约本身
fixtures:   { "data/orders.json": "faker:order[20]" }
redact:     [ { pattern: "acme-corp|ACME", replace: "example-org" } ]
```

### 扫什么

内置规则覆盖各家厂商的 API key 前缀、中国大陆身份证号、手机号、邮箱、内网 IP 段和内部域名、数据库连接串，以及常见的表名形态。如果机器上装了 `gitleaks`，可以选择顺带调一遍。

### 人工闸门

自动脱敏没可靠到能当最后一道关。打包完成后，`sparepack` 会打印完整的文件清单（带字节数）和逐文件的处理摘要（保留了什么、清空了什么、替换了什么），然后等你敲确认，在此之前不写任何东西到盘上。

判断标准很简单：这份清单你敢不敢公开贴出来。不敢就别确认。

### P1 搞不定的情况

有些任务确实需要周边代码库，比如排查集成问题、追一个竞态条件，凡是 bug 在"交互"而不在"某个函数"里的，都属于这类。这些走 P2。

---

## P2 · 一次性沙箱

代码不落接单者磁盘。

1. 发布者把接单者加为 collaborator，用分支保护限定在一个专用分支上。
2. 接单者在**自己的 GitHub 账号下**开 Codespace，在里面跑**他自己的** Claude Code。
3. 干活，提 PR，发布者合并。
4. 发布者移除 collaborator、删分支。Codespace 自己会过期。

### 为什么用 Codespaces 而不是发布者机器上的容器

**双方都不是对方的宿主。** 这就是全部理由。

如果沙箱跑在发布者的硬件上，发布者就是那台机器的 root，而接单者的 `~/.claude/.credentials.json` 正挂在里面。那样一个隐私功能就变成了凭证收割装置，比不做还糟。把沙箱放在微软的基础设施上，对双方而言它都是中立第三方，而且个人账号每月有 60 核时免费额度。

代价是代码要过 GitHub 的云。对大多数项目来说这本来就已经是事实了。不是的那些，看 P3。

### 发布者检查清单

- [ ] 分支保护已把接单者限制在任务分支上
- [ ] 该分支相关的 Codespaces secrets 里没有密钥
- [ ] 授权前复查过仓库级的 Actions 权限
- [ ] 设好合并后回收权限的提醒

---

## P3 · 信任圈

NDA 下的完整仓库访问，只给你已经有关系的人。接单者需要在社区内有 5 次以上成功交付才有资格。

### 自托管沙箱（尚无实现）

给那种确实不能上任何云的代码。**目前没有实现**，下面写的是要求，不是一个你可以拿来就用的东西。

一个由发布者托管的容器：出网白名单只放行 `api.anthropic.com` 和包管理源，其余一律禁止；访问权通过一次性凭据授予，并锁死接单者的单个设备；全程会话录制；任务关闭时容器和凭据一起销毁。

本文档早先的版本把一个自托管终端网关项目指为搭建它的起点。那个项目已不再维护，所以这里把指针删掉，而不是留着烂在文档里。真需要这一级的话，做好自己从头搭的准备，而且先读下面那段警告——读完你可能就不想要了。

**⚠️ 用之前必须读这段。** 这个模式下，宿主方在技术上可以读到容器内的凭证。那些缓解措施（会话录制、临时令牌、出网管控）能缩小影响范围，但消不掉这个事实。只在信任已经存在、且双方都理解这个取舍的情况下用。如果你是接单者、又不认识发布者本人，直接拒绝，要求改走 P1 或 P2。

---

## 怎么选

```
代码本来就是公开的吗？              → P0
任务能表达成「测试 + 接口」吗？      → P1   ← 尽量往这里落
必须有活的代码库才能复现吗？        → P2
代码完全不能上任何云吗？            → P3，且只跟认识的人
```

优先 P1。如果你发现自己老是想用 P2，多半是任务切得太大了，拆开。
