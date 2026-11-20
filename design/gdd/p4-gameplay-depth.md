# P4 Gameplay Depth — proposal, not approved

Goal: turn automatic village growth into optional player expression without making learning conditional on game actions. Audience grades 1–3, portrait-first web.

Core loop: learn → earn existing stars → unlock deterministic discoveries → choose cosmetic village arrangement → explore short stories → learn. Stars remain cumulative non-spendable and never decay. No random rewards, timers, ads, purchases, pressure, leaderboard or penalties.

## Roadmap
- P4-02: village building catalog and free preview; existing nine unlock thresholds unchanged.
- P4-03: optional placement using tap-to-select and tap-to-place, fixed slots, undo and reset, no drag required. All unlocked buildings remain available; no costs.
- P4-04: explore map with deterministic story nodes linked to existing milestones, no gating of questions.
- P4-05: optional decoration persistence using separate versioned key; validate allowlisted IDs and slots, fail safely; do not modify learning v1 or reward logic. Cross-tab conflict handling required before persistent editing.
- P4-06: responsive and keyboard-accessible UI, reduced motion, 44px controls, test 320/375/390/768 and landscape.
- P4-07: regression tests for reward invariance, locked placement refusal, undo, reload, invalid data, two tabs, storage failure.

## Growth beyond existing kingdom
36 stars remains kingdom milestone; consider optional cosmetic collections at 48/60/72 only after content and UX review. No change in this proposal.

## Release gate
P3 actual build, CI, mobile and assistive technology verification remains outstanding. No public deployment or main merge until gates pass and user approves. This document is a design proposal only.
