# Delivery PR template / 交付 PR 模板

**Requesters:** copy this file to `.github/PULL_REQUEST_TEMPLATE.md` in the repository where deliveries will land, so workers get the attestation prompt automatically.

**Workers:** if the requester's repo has no template, paste the section below into your PR description by hand.

Either way, the binding step is commenting `/done <PR-URL>` on the task issue in this repository — that is the only place the bot can see, because it has no access to anyone else's repo.

---

**发布者：** 把这个文件复制成你那个接收交付的仓库里的 `.github/PULL_REQUEST_TEMPLATE.md`，接单者提 PR 时就会自动看到声明项。

**接单者：** 如果发布者的仓库没有模板，把下面这段手动贴进你的 PR 描述里。

无论哪种方式，真正生效的一步是在本仓库的任务 issue 下评论 `/done <PR链接>`。那是 bot 唯一能看到的地方，因为它没有任何其他仓库的访问权。

---

## Copy from here / 从这里开始复制

```markdown
## What this does / 这个 PR 做了什么

## Acceptance criteria / 验收标准

<!-- Copy the checklist from the task issue and tick what you actually verified.
     从任务 issue 里把清单抄过来，勾上你真正验证过的项。 -->

- [ ]
- [ ]

## How I verified it / 我是怎么验证的

<!-- Commands you ran, what you observed. "Tests pass" on its own is not verification.
     你跑了什么命令，看到了什么。光写「测试通过了」不算验证。 -->

## Notes for the reviewer / 给审阅者的说明

<!-- Anything you were unsure about, shortcuts you took, things worth a second look.
     你拿不准的地方、走的捷径、值得再看一眼的东西。 -->

---

### Attestation / 声明

- [ ] I reviewed every line of this change myself and I understand it.
      这个改动的每一行我都亲自审阅过，我理解它的内容。
- [ ] I used my own subscription account and shared no credentials with anyone.
      我用的是我自己的订阅账号，没有与任何人共享凭证。
- [ ] I did not route anyone else's requests through my account.
      我没有把任何其他人的请求路由过我的账号。
- [ ] This PR contains no credentials, API keys, tokens, or secrets.
      这个 PR 里没有任何凭证、API key、token 或密钥。

Task: <!-- link to the spare-cycles task issue / 填 spare-cycles 上的任务 issue 链接 -->
```

## Why the attestation matters / 为什么这几条声明不是走过场

AI wrote most of the code in a lot of these deliveries. That is the entire point of the project and nobody is pretending otherwise.

What the attestation is actually about is the difference between two things that look identical in a diff: work a person directed and checked, versus output nobody read. The first is a delivery. The second is a liability you are handing to someone who trusted you with their codebase.

It is also the line that keeps this project on the right side of the terms. "I ran the agent myself and reviewed what it produced" is ordinary tool use. "I let something claim and complete tasks unattended" is not, and at volume it starts to look exactly like the thing everyone here has agreed not to build.

---

这些交付里，大部分代码是 AI 写的。这本来就是这个项目的前提，没人假装不是。

声明真正在管的，是两件在 diff 里长得一模一样的事情之间的区别：一件是有人指挥并检查过的工作，另一件是没人看过的输出。前者是交付，后者是你甩给一个把代码库托付给你的人的负债。

它也是这个项目保持在条款正确一侧的那条线。"我自己跑的 agent，我审阅了它的产出"是普通的工具使用；"我让某个东西无人值守地接单和交付"不是，而且量一上来，它看起来就跟这里所有人都同意不去建的那个东西一模一样。
