# Ledger / 账本

Append-only. One JSON object per line in `ledger.jsonl`. Never edit a line, never delete a line, never reorder. Corrections are new compensating entries.

`balances.json` is derived output — recomputed from the full history by `verify.mjs`. If it disagrees with the recomputation, the recomputation is right and something tampered with the file.

只追加。`ledger.jsonl` 里一行一个 JSON 对象。不改行、不删行、不调整顺序。更正一律是新增冲正条目。

`balances.json` 是派生产物，由 `verify.mjs` 从完整历史重算。如果它和重算结果对不上，以重算结果为准，说明有人动过文件。

## Schema

```jsonc
{
  "seq":    1,                        // integer, strictly increasing from 1, no gaps
  "ts":     "2026-08-18T09:00:00Z",   // ISO 8601 UTC, non-decreasing
  "type":   "grant",                  // see below
  "amount": 50,                       // positive integer TP
  "from":   "mxx1111",                // optional, depends on type
  "to":     "someone",                // optional, depends on type
  "ref":    "#12",                    // issue this entry belongs to
  "pr":     "https://github.com/...", // optional, delivery PR URL
  "by":     "mxx1111",                // required for adjust/split: who authorized it
  "reason": "onboarding"              // required for grant/refund/adjust/split
}
```

## Transaction types

| Type | Moves | Required fields |
|---|---|---|
| `grant` | system → user balance | `to`, `reason` |
| `escrow` | requester balance → escrow | `from`, `ref` |
| `settle` | escrow → worker balance | `to`, `ref`, `pr` |
| `refund` | escrow → requester balance | `to`, `ref`, `reason` |
| `split` | escrow → both, as two entries | `to`, `ref`, `by`, `reason` |
| `adjust` | maintainer correction | `to`, `by`, `reason` |

### There is no `transfer`

User-to-user transfers do not exist in this schema. This is red line 5 from [COMPLIANCE.md](../COMPLIANCE.md) expressed as data rather than as a promise.

`verify.mjs` treats any entry with an unrecognized type — `transfer` included — as tampering and exits non-zero.

用户之间的转账在这个 schema 里根本不存在。这是把 [COMPLIANCE.md](../COMPLIANCE.md) 的红线 5 写成数据结构，而不是写成一句承诺。

`verify.mjs` 把任何无法识别的 type（包括 `transfer`）视为篡改，直接非零退出。

## Invariants

Checked by `verify.mjs` on every run:

1. `seq` starts at 1, increases by exactly 1, no gaps or repeats
2. `ts` never goes backwards
3. Every `type` is one of the six above
4. `amount` is a positive integer
5. No user balance ever goes negative at any point in history
6. No escrow ever goes negative at any point in history
7. Every `settle`/`refund`/`split` references a `ref` that had an `escrow`
8. Escrow released for a `ref` never exceeds escrow taken for that `ref`
9. Total TP in circulation equals the sum of all `grant` and `adjust` amounts

Invariants 5 and 6 are checked **incrementally**, not just at the end. A history that dips negative in the middle and recovers is still invalid.

第 5 和第 6 条是**逐条增量检查**的，不是只看最终结果。中途出现负数、后面又补回来的历史一样判为无效。

## Usage

```bash
node ledger/verify.mjs                # verify and print balances
node ledger/verify.mjs --write        # verify and rewrite balances.json
node ledger/verify.mjs --json         # machine-readable output
```

Exit code 0 means every invariant holds. Non-zero means do not trust `balances.json`.

## Phase 0 note

Right now entries are appended by hand as tasks are settled manually. The schema is already what the Phase 1 bot will write, so nothing needs migrating later.

现阶段是手工跑任务、手工追加条目。schema 就是 Phase 1 的 bot 将来要写的那个，以后不用迁移。
