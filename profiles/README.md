# Profiles / 信誉档案

This is the part that is actually worth something.

Task Points are internal bookkeeping — they stop people from posting forever without ever delivering, and that is the whole of their job. What you can take with you when you leave is what lands here: a public, verifiable record of work you did on other people's real production code.

That is a different thing from a green contribution graph. Anyone can farm those. These entries each point at a merged PR in a repository that belongs to someone else, who accepted the work and said something about it.

---

积分是内部记账，作用仅限于防止有人一直发单从来不交付。你离开时能带走的东西在这里：一份公开、可验证的记录，记的是你在别人真实生产代码上做的工作。

这跟绿油油的贡献格子是两回事，那种东西谁都能刷。这里的每一条都指向一个合并进别人仓库的 PR，那个人接受了这份工作，并且对它说了些什么。

## Format

One file per person, `<github-handle>.md`, generated from the ledger and the settled issues. Phase 0 writes these by hand; the Phase 1 bot regenerates them on every settlement.

每人一个文件，`<github账号>.md`，从账本和已结算的 issue 生成。Phase 0 手写，Phase 1 的 bot 在每次结算时重新生成。

```markdown
# @handle

Joined 2026-08-18 · 6 deliveries · 0 disputes · 145 TP earned

## Deliveries

| Date | Task | Tier | Privacy | PR | Requester's note |
|---|---|---|---|---|---|
| 2026-08-20 | Stream large CSV imports | M | P1 | user/repo#42 | Clean, handled the malformed-row cases I forgot to specify. |
| 2026-08-24 | Fix Postgres connection leak | S | P2 | user/repo#88 | Found the actual cause, not just the symptom. |

## Also contributed

| Date | Type | Task | TP |
|---|---|---|---|
| 2026-08-22 | review | Reviewed #51 | 5 |
| 2026-08-25 | spec | Wrote acceptance tests for #63 | 15 |
```

## What is and is not recorded

**Recorded:** the task title, size, privacy tier, a link to the merged PR, and whatever the requester chose to write in the settlement comment.

**Not recorded:** anything about the requester's codebase beyond the public task title, dispute details beyond the count, or private assessments. If a requester wants to say something critical, they say it publicly in the settlement comment or not at all. No back channels.

**记录：** 任务标题、档位、隐私级别、合并 PR 的链接，以及发布者在结算评论里愿意写的话。

**不记录：** 除公开任务标题外发布者代码库的任何信息、除次数外的争议细节、以及任何私下评价。发布者想说批评的话，就公开写在结算评论里，否则就不说。没有背后渠道。

## Disputes

The count is shown, the details are not. A dispute is not a black mark on its own — sometimes the task was badly specified, and the ruling says so. Rulings themselves are public in the ledger with links to the reasoning, so anyone who wants the full story can go read it.

只显示次数，不显示细节。有过争议本身不算污点，有时候是任务写得不清楚，裁定里会写明。裁定本身在账本里是公开的，带理由链接，想看全貌的人自己去读。

## Removal

Ask and your profile is deleted. The ledger entries stay — they are append-only and other people's balances depend on them — but the profile page and the narrative go.

Deletion does not un-merge your PRs. Those are in other people's repositories and this project has no say over them.

说一声就删。账本条目会留着，那是只追加的，而且别人的余额依赖它，但档案页和上面的叙述会删掉。

删除不会让你的 PR 从别人仓库里消失。那些在别人的仓库里，本项目管不着。
