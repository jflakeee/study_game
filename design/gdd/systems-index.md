# Systems Index: 지식 탐험대

> Status: Draft — reverse-documented, approval pending
> Created / Updated: 2026-11-19
> Source Concept: design/gdd/game-concept.md
> Baseline: 0111bc864c66ce92ee35d8b698968dd0536c84e0

## Overview

Existing mobile-web learning loop; no engine migration. Proposed pillars: independent learning, supportive error recovery, durable progress and mobile usability. All are provisional. MVP tiers describe existing baseline and necessary safety evidence, not a release declaration; P0/P1/P2 are separate repair priorities. Per-system notes below are observed or explicitly prospective.

- S01 Learning schema (P0): Stable v1 data, question IDs and attempt contract.
- S02 Question bank (P0): 18 static questions, six concepts; curriculum breadth unverified.
- S03 Persistence (P0): Local state roundtrip; failure and invalid-data recovery limitations.
- S04 Cross-tab protection (inferred) (P0): Web Locks and best-effort fallback; latest regression failed.
- S05 Question selection (P0): Grade and due-first random pool.
- S06 Answer evaluation (P0): Correctness evidence from fixed choices.
- S07 Tutor (P0): Three wrong stages; saving latch defect at final incorrect.
- S08 Mastery (P0): Derived from history; level five undefined.
- S09 Review (P0): Calendar interval heuristic; no FSRS claim.
- S10 Stars (P0): One reward per independent correct ID; successful commit only.
- S11 Village (P1): Derived emoji display, no construction economy.
- S12 Mobile UI (P1): Responsive DOM; pending navigation issue.
- S13 Accessibility (inferred) (P1): Keyboard and live region; spoken feedback unverified.
- S14 Progress display (P1): Mastery and review counts.
- S15 Response-time review (P1): Dormant module; activation requires policy approval.
- S16 Visual polish (P2): Dream Loop candidate, scope not approved.
- S17 Sound (P2): PlinkFX candidate, scope not approved.
- S18 Integrated QA (inferred) (P0): Cross-cutting QA; release evidence also covers later tiers.

## Systems Enumeration

| # | System Name | Category | Priority | Status | Design Doc | Depends On |
|---|---|---|---|---|---|---|
| S01 | Learning schema | Core | MVP | Implemented | learning-system.md | — |
| S02 | Question bank | Gameplay | MVP | Implemented | learning-system.md | S01 |
| S03 | Persistence | Persistence | MVP | Implemented | persistence-system.md | S01 |
| S04 | Cross-tab protection (inferred) | Persistence | MVP | In Review | persistence-system.md | S03 |
| S05 | Question selection | Gameplay | MVP | Implemented | learning-system.md | S02, S09 |
| S06 | Answer evaluation | Gameplay | MVP | Implemented | learning-system.md | S01, S02 |
| S07 | Tutor | Gameplay | MVP | In Review | tutor-system.md | S06 |
| S08 | Mastery | Progression | MVP | In Review | progression-review-system.md | S01, S06 |
| S09 | Review | Progression | MVP | Implemented | progression-review-system.md | S01, S06 |
| S10 | Stars | Economy | MVP | Implemented | reward-village-system.md | S06, S07, S03, S04 |
| S11 | Village | Progression | MVP | Implemented | reward-village-system.md | S10 |
| S12 | Mobile UI | UI | MVP | In Review | mobile-ux-system.md | S05, S07, S11 |
| S13 | Accessibility (inferred) | Meta | Vertical Slice | In Review | mobile-ux-system.md | S12 |
| S14 | Progress display | UI | MVP | Implemented | mobile-ux-system.md | S08, S09, S12 |
| S15 | Response-time review | Progression | Full Vision | In Design | progression-review-system.md | S09 |
| S16 | Visual polish | UI | Vertical Slice | Not Started | — | S11, S12 |
| S17 | Sound | Audio | Vertical Slice | Not Started | — | S10, S12 |
| S18 | Integrated QA (inferred) | Meta | MVP | In Review | — | S04, S08, S10, S12, S14 |

## Categories
Core: shared data; Gameplay: learning actions; Progression: mastery/review/village; Economy: stars; Persistence: save safety; UI: presentation; Audio: feedback; Meta: accessibility and QA.

## Priority Tiers
MVP 14: full existing core loop plus safety QA. Vertical Slice 3: accessibility and optional polish; accessibility is still a mandatory release criterion. Full Vision 1: exploratory response-time review, not approved. Alpha: none separately allocated. P0 safety work precedes polish.

## Dependency Map
Design contracts, not import graph. Computed topological layers:
- Layer 0: S01
- Layer 1: S02, S03
- Layer 2: S04, S06
- Layer 3: S07, S08, S09
- Layer 4: S05, S10, S15
- Layer 5: S11
- Layer 6: S12
- Layer 7: S13, S14, S16, S17
- Layer 8: S18
Persistence and learning schema are bottlenecks; runtime loop is not a design dependency cycle. QA runs throughout; S18 depends on baseline integration for completion, with later release checks covering all shipped features.

## Recommended Design Order
| Order | System | Priority | Layer | Agent(s) | Est. Effort |
|---|---|---|---|---|---|
| 1 | S01 Learning schema | MVP | 0 | game-designer | S |
| 2 | S02 Question bank | MVP | 1 | game-designer | S |
| 3 | S03 Persistence | MVP | 1 | technical-director / QA | S |
| 4 | S04 Cross-tab protection (inferred) | MVP | 2 | technical-director / QA | M |
| 5 | S06 Answer evaluation | MVP | 2 | game-designer | S |
| 6 | S07 Tutor | MVP | 3 | game-designer | S |
| 7 | S08 Mastery | MVP | 3 | game-designer | S |
| 8 | S09 Review | MVP | 3 | game-designer | S |
| 9 | S05 Question selection | MVP | 4 | game-designer | S |
| 10 | S10 Stars | MVP | 4 | game-designer | S |
| 11 | S11 Village | MVP | 5 | game-designer | S |
| 12 | S12 Mobile UI | MVP | 6 | game-designer | M |
| 13 | S13 Accessibility (inferred) | Vertical Slice | 7 | game-designer | S |
| 14 | S14 Progress display | MVP | 7 | game-designer | S |
| 15 | S18 Integrated QA (inferred) | MVP | 8 | technical-director / QA | M |
| 16 | S15 Response-time review | Full Vision | 4 | game-designer | S |
| 17 | S16 Visual polish | Vertical Slice | 7 | game-designer | S |
| 18 | S17 Sound | Vertical Slice | 7 | game-designer | S |
Effort is provisional design-session size, not delivery estimate.

## Circular Dependencies
None in enumerated design contracts; topological sort completed 18/18.

## High-Risk Systems
| System | Risk Type | Risk Description | Mitigation |
|---|---|---|---|
| S04 | Technical | stochastic stale-tab test and fallback non-atomicity | deterministic reader, raw state equality, delayed lock |
| S07/S12 | Technical | final wrong saving latch; next/hint during pending save | regressions and minimal fix |
| S08/S15 | Design | level five undefined, response timing fairness | confirm policy before changes |
| S13 | Technical | live node detached/reinserted | stable region and real assistive tech |
| S02/S11 | Scope | small content bank and capped village | validate learning and growth before expanding |

## Progress Tracker
| Metric | Count |
|---|---|
| Total systems identified | 18 |
| Systems with linked reverse docs | 15 |
| Distinct system GDDs | 6 |
| Reviewed / Approved | 0 / 0 |
| MVP systems with linked draft | 13/14 |
| Vertical Slice systems with linked draft | 1/3 |

## Next Steps
- P0 fix final wrong latch, deterministic stale-tab and pending save navigation, test error collection; verify CI on integration branch before release.
- Review system GDDs and unresolved intent; no stage promotion.
- TD-SYSTEM-BOUNDARY and PR-SCOPE: NOT ASSESSED — native specialist agents unavailable. Autonomous enumeration and priority choices logged here; no independent approval.
- Preserve main, P0-B branch, v1, existing reward rules and production HOLD. No source change or tests this step.
