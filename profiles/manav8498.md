# @manav8498

Joined 2026-08-18 · 1 delivery · 0 disputes · 10 TP earned

## Deliveries

| Date | Task | Tier | Privacy | PR | Requester's note |
|---|---|---|---|---|---|
| 2026-08-18 | CONTRIBUTING asked for a manual leak grep that nothing enforced | S | P0 | [Homelab#1](https://github.com/mxx1111/Homelab/pull/1) | The allowlist design is what makes this check survivable: narrow `path: literal` entries, `*` only on demo files, and the version-string false positive handled by exemption rather than by loosening the pattern. |

## Note

A leak check lives or dies on what people do the first time it fires wrongly — add a precise
exemption, or widen the regex until it stops complaining. This one is built so the first
option is the easy one, and the error message says so explicitly. Verified before merge that
it catches injected private IPs, catches a force-added `config.yaml` and `data/`, and passes
clean on an untouched tree.
