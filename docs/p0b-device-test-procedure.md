# P0-B device test procedure — manual execution pending

## Pinned test candidate (verified CI, not manually tested)
- Feature commit: `f92a9c8d743d2f2844cbb59dc52cf991d1569d3e`
- Successful GitHub Actions run: https://github.com/jflakeee/study_game/actions/runs/43382348307
- Isolated preview build: https://github.com/jflakeee/study_game/actions/runs/43382348307/artifacts/14017451235
- Chromium screenshot archive: https://github.com/jflakeee/study_game/actions/runs/43382348307/artifacts/14016987330
- Test status: CI **PASS**; manual screenshot review, physical iOS/Android and assistive-technology checks **NOT RUN**.
- Use the exact artifact above for manual test sessions. If a later commit is selected, update SHA, run and artifact URLs together before testing.

## Preconditions
1. Obtain explicit approval to use an isolated, non-production preview. Do not merge `feat/p0b-learning-engine` into `main` or overwrite public Pages.
2. Download the isolated preview build from successful run https://github.com/jflakeee/study_game/actions/runs/43381108278 (artifact availability must be checked). Serve its built files on an HTTPS preview origin reachable by the devices; opening `index.html` as `file://` is not equivalent.
3. Record exact feature commit SHA, preview URL, device model, OS version, browser version, tester and date in `docs/p0b-verification-record.md`. Use fresh browser storage for baseline, then repeat relevant cases with retained v1 storage.
4. For multi-tab and save-failure cases, use a disposable preview origin/profile. Back up any valuable localStorage first; never alter production saves.

## Manual scenarios — run on both iOS Safari and Android Chrome
| ID | Steps | Pass condition |
| --- | --- | --- |
| D01 | Load in portrait at default text size, scroll to the bottom | No clipped content, horizontal scroll, overlap or inaccessible answer buttons |
| D02 | Rotate to landscape, answer a question, rotate back | Controls remain usable; selection and progress persist |
| D03 | Set OS/browser text size to largest practical setting, reload | Readable labels, no missing controls or unintended overlap |
| D04 | Answer correctly without hint; reload | Exactly one star for the question, persisted after reload |
| D05 | Reveal hint, answer correctly; reload | No star awarded for hinted correct answer |
| D06 | Give three wrong answers and inspect each response | Progressive guidance and explanation; no star; next-question flow works |
| D07 | Switch grade, answer, reload | Selected grade and existing v1 progress remain consistent |
| D08 | Open same preview in two tabs, modify one, then attempt stale-tab save | Clear conflict guidance; no silent loss or duplicate reward; reload recovers |
| D09 | Deny or exhaust storage in disposable test environment | User-visible failure, no phantom reward, existing data not silently overwritten |
| D10 | Use external keyboard Tab, Shift+Tab and Enter on answer/hint/next | Logical focus order, visible focus, no focus trap, focus preserved after feedback |

## Assistive technology — run separately
- **A01 iOS VoiceOver:** Navigate question, answer choices, hint, feedback and next button by swipe. Confirm labels and reading order; record actual spoken feedback after correct, wrong and hinted answers.
- **A02 Android TalkBack:** Repeat A01 with TalkBack; record whether the status message is announced without manual navigation.
- **A03:** Repeat keyboard focus sequence with screen reader enabled if an external keyboard is available.
- **A04:** Check high text-size and reduced-motion preferences if supported.

## Evidence and triage
- For each case record PASS/FAIL/BLOCKED/NOT RUN, actual behavior, date, device/browser and screenshot or video URL.
- For a failure record exact reproduction steps, affected save version, severity (P0 data loss or blocked gameplay; P1 serious accessibility or layout; P2 minor visual), and linked corrective commit.
- Re-run the failed case on both devices after a fix and attach CI evidence. A successful CI alone is not a manual PASS.

## Release gate
**HOLD** until screenshot review, iOS/Android cases, VoiceOver/TalkBack and explicit approval are recorded. Public Pages smoke testing happens only after approved deployment. This document is a procedure, not evidence that testing was performed.
