# P0-B verification coverage matrix — 2026-11-13

## Evidence baseline
- CI successful at `17b406f5a3557c76385e18fa54086fd58368f239`: https://github.com/jflakeee/study_game/actions/runs/43383767788
- Pinned manual-test candidate: `f92a9c8d743d2f2844cbb59dc52cf991d1569d3e`, preview artifact https://github.com/jflakeee/study_game/actions/runs/43382348307/artifacts/14017451235
- Manual record: `docs/p0b-verification-record.md`; execution procedure: `docs/p0b-device-test-procedure.md`.
- CI success is evidence for the automated checks only. No human screenshot review or physical device execution has been recorded.

| Area | Automated evidence | Manual-only gap | Release status |
| --- | --- | --- | --- |
| Portrait layout 320/375/390/768 | Chromium overflow, clipping, minimum 44px controls and screenshots | Readability, contrast, font rendering, actual touch | BLOCKED |
| Landscape 667x375/812x375 | Chromium overflow, clipping, targets, keyboard and screenshots | Physical rotation, scroll/gesture, viewport UI | BLOCKED |
| Enlarged text 150%/200% | Chromium CSS root-font scaling and answer flow | iOS/Android OS-level font settings, zoom, readability | BLOCKED |
| Learning/rewards | Unit and Chromium correct/hinted/repeat/mastery checks | Physical tap flow, duplicate taps, feedback comprehension | BLOCKED |
| Wrong-answer tutoring | Chromium staged 1/2/3 wrong answers, no star | Real-device announcements, visual clarity and navigation | BLOCKED |
| v1 saves and multi-tab | Chromium reload, legacy payload, stale-tab and storage-error injection | Mobile storage restrictions, real multi-tab recovery | BLOCKED |
| Keyboard and live region | Chromium Tab/Shift+Tab/Enter, focus, DOM aria-live attributes | Actual VoiceOver/TalkBack speech and focus | BLOCKED |
| Published Pages | Isolated preview artifact built; public site intentionally unchanged | Approved production deployment and smoke test | HOLD |

## Automated checks worth adding only if a defect appears
- Double-tap rapid submissions and repeated navigation: add deterministic Chromium regression if real-device testing reveals a duplicate reward or lost state.
- Browser zoom / accessibility font sizing: add focused tests for a reproducible clipping defect; CSS root-font scaling alone does not emulate OS text settings.
- Long-form Korean strings and screen-reader label changes: add stable regression cases after specific manual failures are documented.

## Manual verification order
1. Human screenshot review for portrait, landscape, enlarged text, hint, correct and wrong states.
2. Physical iOS Safari and Android Chrome scenarios D01–D10 from `docs/p0b-device-test-procedure.md`.
3. VoiceOver and TalkBack A01–A04 with actual spoken feedback recorded.
4. Triage failures, fix on feature branch, rerun CI and manual cases.
5. Obtain explicit release approval; only then merge/deploy and verify live Pages.

## Decision
**HOLD**. Do not treat automated green CI, uploaded screenshots or generated preview builds as physical-device or production verification. Keep `main` and public GitHub Pages unchanged.
