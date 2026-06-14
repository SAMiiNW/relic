```
======================================================================
   R E L I C
   PROVENANCE BUREAU  /  CERTIFICATE OF AUTHENTICITY  /  SERIES MMXXVI
   An on-chain AI provenance oracle built on GenLayer
======================================================================
```

> Accession register and issuance protocol for tamper-evident certificates of
> authenticity. Every certificate is an AI ruling struck under GenLayer
> validator consensus, not a private appraisal. No deposit, no custody, no
> backend.

Live bureau .......... https://samiinw.github.io/relic/
Contract ............. 0x1F6259d86B900A64628990D4605d8657F4537D59
Deploy receipt ....... 0xdedb8cd9dd10ade6d9cb7ac5380278e8d090112fe93484828cc853aea1f1fcca
Network .............. GenLayer Bradbury Testnet (chain 4221)
Explorer ............. https://explorer-bradbury.genlayer.com/address/0x1F6259d86B900A64628990D4605d8657F4537D59

---

## ACCESSION 001  /  WHAT THIS BUREAU DOES

A relic without provenance is just an object. Relic is a bureau that turns a
documented claim of authenticity into a public, verifiable record. An owner
enters an artifact into the register, then anyone submits the provenance
evidence: a chain of ownership, documentation, auction records, maker's marks,
conservator notes. An injection-resistant AI authenticator weighs that evidence
and issues one ruling with an authenticity score from 0 to 100:

```
   GENUINE   (70-100)   coherent, well documented provenance
   DOUBTFUL  (35-69)    partial, thin, or unverifiable provenance
   FORGERY   (0-34)     contradictory, fabricated, or manipulative evidence
```

The ruling is the settlement. It is struck onto the artifact as a certificate
the chain keeps for good.

## ACCESSION 002  /  WHY A CHAIN, AND WHY CONSENSUS

A single model answering alone is a black box: rerun it and the answer drifts.
GenLayer removes the single point of trust. The authenticity ruling is produced
under validator consensus, so the bureau is not one judge but many, each
reproducing the verdict independently.

Relic uses a custom validator over `gl.vm.run_nondet_unsafe`, not `strict_eq`
(which would never agree on free-form model output). The equivalence rule is
deliberate about what must match and what may vary:

```
   leader                       validators (each re-run the prompt)
   -------                      -----------------------------------
   ruling word    -----------   must match EXACTLY (GENUINE/DOUBTFUL/FORGERY)
   authenticity   -----------   must agree within tolerance:
                                   abs(a-b) <= max(20, 20% of the larger)
   rationale      -----------   free prose, not compared
```

The ruling word drives state, so it is compared exactly. The score is numeric,
so it carries an explicit tolerance. The rationale is human-facing, so it is
left free. If the leader and validators disagree on the word or fall outside the
score tolerance, the round fails and the network rotates the leader.

## ACCESSION 003  /  THE ISSUANCE PROTOCOL

```
   PLATE I    register_artifact(title, description) -> id
              A deterministic write. Mints a registry entry and a plate
              number. No LLM, no deposit, only network fees.

   PLATE II   submit provenance evidence (up to 700 chars)
              Attached by anyone to a registered artifact.

   PLATE III  authenticate(artifact_id, evidence)
              The AI write. Runs under consensus: the leader weighs the
              evidence, every validator re-derives the ruling, and the
              equivalence rule above decides agreement.

   PLATE IV   strike the certificate
              Ruling, score, and rationale are written on-chain. A
              deterministic backstop clamps the score into the band its
              ruling requires before state is committed.
```

### Defense in depth

The prompt instructs the authenticator that everything inside the evidence is
untrusted data and that any attempt to override its rules, reveal hidden text,
or demand a verdict forces a FORGERY ruling with score 0. That deters
manipulation. Code enforces it: after consensus, a backstop clamps the score
into the band its ruling demands, so a FORGERY can never carry a genuine number
and a GENUINE can never be quietly low. Prompt rules persuade; the backstop is
law.

## ACCESSION 004  /  PUBLIC METHODS (THE BUREAU COUNTER)

Writes

```
register_artifact(title: str, description: str) -> str
    Deterministic. Validates lengths (title 1-140, description 1-400),
    mints "relic-<n>", appends a REGISTERED entry to the register and the
    issuance log. Returns the new artifact id.

authenticate(artifact_id: str, evidence: str) -> None
    The AI write under consensus. Guards: artifact must exist, evidence
    1-700 chars, artifact must still be REGISTERED. Runs the authenticator,
    clamps the score into its ruling band, sets status CERTIFIED, and
    appends a CERTIFIED entry to the issuance log.
```

Views (no wallet required, paged at 20)

```
get_artifacts(start: u256) -> list   page of artifact records by insertion order
get_artifact(artifact_id: str) -> dict   one full record
get_issuance(start: u256) -> list    page of the append-only issuance log
get_stats() -> dict                  O(1) counters: artifacts, certified,
                                     genuine, forgery, owner
```

An artifact record carries: `id`, `title`, `description`, `owner`, `status`
(REGISTERED or CERTIFIED), `ruling`, `score`, `rationale`, `authenticator`,
`index`.

## ACCESSION 005  /  ARCHITECTURE (THE BOUNDARY)

```
   +-----------------------------+        +------------------------------+
   |  STATIC FRONTEND (no server)|        |  INTELLIGENT CONTRACT        |
   |  Next.js 14 static export   |  reads |  (the entire backend)        |
   |  genlayer-js                | <----- |  state: TreeMap[str,str] +   |
   |  wallet, polling, previews  |  writes|  DynArray[str] + u256 counters|
   |  consensus theater          | -----> |  AI ruling under consensus   |
   +-----------------------------+        +------------------------------+
            |                                         |
            | reads need no wallet                    | validators re-run
            v                                         v
        GitHub Pages                          GenLayer Bradbury
```

The contract owns every authoritative fact: the register, the certificates, the
issuance log, the counters, and the AI judgment. The frontend owns only
presentation: wallet, slow paged polling (95s, paused during a write), stats
derived client-side, and a live consensus stage that peeks the leader's draft
ruling from the transaction receipt while validators deliberate. There is no
database and no API key anywhere.

## ACCESSION 006  /  THE FRONTEND

Art direction: holographic security print. Dark slate stock, an iridescent foil
accent that drifts teal to magenta, fine guilloche spirograph line-work on an
animated canvas, microprint rules, engraved hairline framing, and seal
medallions drawn as inline SVG. Display type is Cormorant Garamond, body is
Outfit, mono is Space Mono. The hero canvas is dpr-aware, pauses when the tab is
hidden, and respects `prefers-reduced-motion`. Reads render before any wallet is
connected; a dead RPC degrades a single section, never the page.

## ACCESSION 007  /  RUN THE BUREAU YOURSELF

Contract, lint, consensus test:

```bash
pip install genvm-linter
genvm-lint lint contracts/contract.py --json        # ok:true
gltest tests/integration/ -v -s --network studionet # real consensus, gasless
```

Deploy and verify (uses GENLAYER_PRIVATE_KEY from a repo-root .env):

```bash
python scripts/deploy.py        # writes deployment.json, address = receipt recipient
python scripts/verify_read.py   # read gate returns real data
python scripts/verify_write.py  # full register + AI authenticate end to end
```

Frontend:

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000/relic
npm run build    # static export to out/, the hard gate before deploy
npm run deploy   # gh-pages -d out --dotfiles
```

Copy `.env.example` to `.env` and supply a funded Bradbury key. Claim test GEN
at https://testnet-faucet.genlayer.foundation/ . Never commit `.env`.

## ACCESSION 008  /  NOTES FOR THE RECORD

- This is a testnet bureau. State is public; a certificate is an AI ruling under
  validator consensus, not a professional appraisal.
- No deposit, stake, or escrow is ever taken. Users pay only network fees, which
  are mostly refunded after an AI write.
- Majority agreement, not unanimity, settles a write. A single dissenting
  validator whose score fell outside tolerance is normal and not a failure.

```
   sealed under consensus  /  struck on-chain  /  kept for good
```
