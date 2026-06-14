# Relic

*An on-chain AI provenance oracle on GenLayer. Register an artifact, submit its provenance, and the bureau strikes a tamper-evident certificate of authenticity under validator consensus, not a private appraisal.*

<table>
<tr><td><b>Live bureau</b></td><td>https://relic-2tv.pages.dev</td></tr>
<tr><td><b>Contract</b></td><td><a href="https://explorer-bradbury.genlayer.com/address/0x1F6259d86B900A64628990D4605d8657F4537D59">0x1F6259d86B900A64628990D4605d8657F4537D59</a></td></tr>
<tr><td><b>Deploy receipt</b></td><td><a href="https://explorer-bradbury.genlayer.com/tx/0xdedb8cd9dd10ade6d9cb7ac5380278e8d090112fe93484828cc853aea1f1fcca">0xdedb8cd9...aea1f1fcca</a></td></tr>
<tr><td><b>Network</b></td><td>GenLayer Bradbury Testnet, chain 4221</td></tr>
<tr><td><b>Source</b></td><td>https://github.com/SAMiiNW/relic</td></tr>
</table>

---

## The verdict the bureau can strike

A relic without provenance is just an object. Submit the evidence (chain of ownership, documentation, auction records, maker's marks, conservator notes) and an injection-resistant authenticator weighs it into exactly one verdict with a 0-100 authenticity score:

> **GENUINE** `70-100` , coherent, well-documented provenance
> **DOUBTFUL** `35-69` , partial, thin, or unverifiable provenance
> **FORGERY** `0-34` , contradictory, fabricated, or manipulative evidence

That verdict is the settlement. It is struck onto the artifact as a certificate the chain keeps for good.

## Why the certificate can be trusted

Not because one model said so, but because many validators reproduced the ruling. Relic uses a custom validator over `gl.vm.run_nondet_unsafe` (never `strict_eq`, which cannot agree on free-form output). The split is deliberate:

- **ruling word** drives state, so it must match **exactly**;
- **authenticity score** is numeric, so it agrees within tolerance: `abs(a-b) <= max(20, 20% of the larger)`;
- **rationale** is human-facing prose and is not compared.

Disagreement on the word or a score outside tolerance fails the round and rotates the leader. And because a prompt can be coaxed, a deterministic backstop re-clamps the score into its ruling's band after consensus: a FORGERY can never carry a genuine number, a GENUINE can never be quietly low. The prompt persuades; the backstop is law.

## The issuance protocol, plate by plate

1. **Register.** `register_artifact(title, description) -> id` mints a registry entry and a plate number. Deterministic, no model, only network fees.
2. **Submit evidence.** Anyone attaches up to 700 characters of provenance to a registered artifact.
3. **Authenticate.** `authenticate(artifact_id, evidence)` is the AI write: the leader weighs the evidence, every validator re-derives the ruling, and the equivalence rule decides agreement.
4. **Strike.** Ruling, score, and rationale are clamped and committed on-chain, and the artifact flips to CERTIFIED.

## Counter (public methods)

Writes:

```
register_artifact(title, description) -> id   deterministic; title 1-140, description 1-400; mints relic-<n>; logs REGISTERED
authenticate(artifact_id, evidence)           AI write under consensus; guards exist + evidence 1-700 + still REGISTERED;
                                              rules, clamps the score, sets CERTIFIED, logs CERTIFIED
```

Views (no wallet, paged at 20):

```
get_artifacts(start) -> list   page of artifact records, insertion order
get_artifact(id) -> dict       one full record
get_issuance(start) -> list    append-only issuance log
get_stats() -> dict            O(1) counters: artifacts, certified, genuine, forgery, owner
```

A record carries `id, title, description, owner, status, ruling, score, rationale, authenticator, index`.

## How it is put together

The contract is the whole backend: the register, the certificates, the issuance log, the counters, and the AI judgment all live on-chain under consensus. The frontend is a static Next.js 14 export that only reads that state, manages the wallet, polls slowly (95s, paused during a write), and stages a live consensus theater that peeks the leader's draft ruling from the transaction receipt while validators deliberate.

Art direction is holographic security print: dark slate stock, an iridescent foil accent drifting teal to magenta, fine guilloche line-work on an animated canvas, microprint rules, engraved framing, an embossed wax-seal bureau stamp that presses when a certificate is struck, Cormorant Garamond over Outfit with Space Mono for hashes. The vault chamber lays the certificates out in a clean responsive grid, nothing overlaps.

## Run the bureau

```bash
# contract
genvm-lint lint contracts/contract.py --json
gltest tests/integration/ -v -s --network studionet

# deploy + verify (GENLAYER_PRIVATE_KEY in a repo-root .env, funded from the faucet)
python scripts/deploy.py
python scripts/verify_read.py
python scripts/verify_write.py   # full register + AI authenticate, end to end

# frontend
cd frontend && npm install && npm run build
```

Hosting is Cloudflare Pages. The build serves from root when `CF_PAGES=1`, so `CF_PAGES=1 npm run build` then `wrangler pages deploy out --project-name relic`. Copy `.env.example` to `.env` with a funded Bradbury key; never commit it. Test GEN: https://testnet-faucet.genlayer.foundation/

## For the record

A testnet bureau: stored state is public, and a certificate is an AI ruling under validator consensus, not a professional appraisal. No deposit, stake, or escrow is ever taken. Majority agreement settles a write; a single out-of-tolerance dissent is normal, not a failure.

```
sealed under consensus  .  struck on-chain  .  kept for good
```
