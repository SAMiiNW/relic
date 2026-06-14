# Relic — Vault Authentication Terminal (wireframe)

## Metaphor

Not a website, not a dashboard. Relic is presented as a **futuristic
authentication operating system**: a sealed **vault chamber** in which artifact
records float as **specimen capsules**, each physically **wired by engraved
filaments** to a central **authenticator reactor core** that rules on
provenance under validator consensus. A narrow **command spine** runs down the
left edge as the OS chrome. There is no horizontal bar of any kind.

## Full-screen frame

```
 SPINE (left vertical rail, ~210px)        VAULT CHAMBER (rest of viewport, 2D, asymmetric)
+------------------------+------------------------------------------------------------------+
| [seal glyph] RELIC     |                                            [HUD corner bracket]   |
|  VAULT TERMINAL        |   .--- coordinate ticks along chamber frame ---.                 |
|  status: ONLINE  o     |                                                                   |
|------------------------|        [INTAKE PORT]                                              |
| KEYHOLDER              |        register a relic  \                                        |
|  <WalletControl>       |         angular plate     \                                       |
|  chain dot / addr      |                            \         (capsule)  o                 |
|------------------------|                             \        DOUBTFUL  /                  |
| VAULT DRAWERS (filters)|             (capsule) o------\------.          /                  |
|  > 01 All       n      |             GENUINE          \      \        /                    |
|    02 Pending   n      |                               \   .--+------+--.                 |
|    03 Genuine   n      |                                \  | AUTH CORE |                  |
|    04 Doubtful  n      |        (capsule) o--------------\-| reactor   |---o (capsule)     |
|    05 Forgery   n      |        FORGERY                    | tally rdo |   GENUINE         |
|  (active drawer lit,   |                                  '--+------+--'                  |
|   left tick indicator) |                                  /    |    \                     |
|------------------------|                       (capsule) o     |     o (capsule)          |
| microprint spine |||   |                       GENUINE         |      PENDING             |
| SERIES MMXXVI          |                                                                   |
| SYS readout            |          [SYSTEM BUS ribbon docked to a low margin] -----------   |
+------------------------+------------------------------------------------------------------+
```

## Pieces

- **Command spine (left vertical rail)** — `VaultSpine`. Boot seal glyph +
  wordmark + live status dot; KEYHOLDER module (wallet connect/menu/network);
  VAULT DRAWERS = the five filters rendered as OS drawer rows with count
  readouts and a left tick that lights on the active drawer; foot carries a
  vertical microprint spine, series tag, and a small SYS readout. Collapses to
  a docked foot bar + lift sheet on narrow screens.

- **Authenticator reactor core** — `AuthCore`. The gravitational center of the
  chamber, intentionally off-center (asymmetric). Concentric rotating guilloche
  rings (Seal motif) around a glass core that reads the bureau tally: artifacts
  on file, certificates sealed, rulings genuine. Filaments terminate here.

- **Specimen capsules** — floating certificate plates at asymmetric chamber
  coordinates, mixed sizes (genuine = large, certified = medium, pending =
  small) and slight rotations. Each carries plate no., ruling tag, title,
  description, authenticity score or the submit-provenance action, owner /
  authenticator. A short engraved tether links each capsule node to the core.

- **Intake port** — `IntakePort` (register action) as a distinct angular plate
  pinned high-left in the chamber, wired to the core like a feed line.

- **System bus ribbon** — `SystemBus`. A thin engraved status ribbon docked to
  a low margin (not a footer band): network of record, bureau seal contract +
  copy, draw filing fees, inspect on explorer, deploy tx, with the bureau
  disclaimer in fine print beneath.

- **Chamber chrome** — HUD corner brackets, faint coordinate ticks, guilloche
  field behind everything. Large deliberate voids; no grid.

## Self-review against banned patterns

- SaaS dashboard? No — no top header, no KPI card grid, no nav-to-pages
  sidebar. The left is a command spine of vault drawers (filters), not page
  navigation. The body is a wired 2D chamber, not stacked widgets.
- Crypto dApp / landing (Coinbase/Arbitrum/Celestia/EigenLayer)? No — no hero
  headline, no CTA band, no feature row, no marketing sections.
- Document / ledger column? No — content is a 2D field of floating wired nodes,
  not a single reading column.
- Standard header-content-footer stack? No — left vertical spine + free chamber,
  with the on-chain ribbon docked as a margin bus, not a stacked footer.
- Glassmorphism cards? No — engraved hairline frames and foil edges only.
- Distinct from siblings (moderation console, trust desktop)? Yes — the reactor
  core + tethered specimen capsules inside a pressurized vault chamber is a
  metaphor unique to Relic.

Verdict: unique enough. Build it.
