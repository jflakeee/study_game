# P0-B physical-device and visual verification checklist — 2026-11-13

## Evidence available (not equivalent to manual verification)
- Latest successful feature-branch CI: https://github.com/jflakeee/study_game/actions/runs/43351206688
- Chromium screenshots (320/375/390/768 px): https://github.com/jflakeee/study_game/actions/runs/43351206688/artifacts/14002929225
- Isolated preview build artifact: https://github.com/jflakeee/study_game/actions/runs/43351206688/artifacts/14003123805
- Screenshots and build artifacts were uploaded. No human screenshot review, physical-device run or public Pages deployment is claimed.

- Successful expanded screenshot run: https://github.com/jflakeee/study_game/actions/runs/43353347160 (commit 1e53c008f76eae0ebc2378e650b4b594450373d4). Screenshots: https://github.com/jflakeee/study_game/actions/runs/43353347160/artifacts/14005181524; preview build: https://github.com/jflakeee/study_game/actions/runs/43353347160/artifacts/14005196434. Chromium now captures hint, correct-complete and three-wrong-complete states and verifies Shift+Tab reverse navigation. Screenshots remain unreviewed by a person.\n\n## Visual review — pending
- [ ] Open each screenshot at native resolution; inspect header, toolbar, quiz, choices, hint, feedback, next button and footer.
- [ ] Check text wrapping, overlap, clipped glyphs, spacing and contrast at 320, 375, 390 and 768 px.
- [ ] Compare before/after answer and hint states; latest CI captures initial, hint, correct-complete and wrong-complete states; manual visual comparison remains pending.

## iOS Safari and Android Chrome — pending
- [ ] Open an approved isolated preview on a physical iPhone and Android device (do not change production Pages before approval).
- [ ] Verify tap targets, scrolling, zoom, orientation change, on-screen keyboard and no accidental double-submit.
- [ ] Correct answer: exactly one star, retained after reload; hinted answer: zero stars; repeated correct answer: no extra star.
- [ ] Three wrong answers: staged hint, retry prompt, explanation, no star, and next-question navigation.
- [ ] Change grade, reload, verify v1 state and due review schedule.
- [ ] Open two tabs and verify stale-tab conflict guidance and recovery after reload.
- [ ] Deny storage access or fill quota and verify user-facing error without phantom rewards.

## Assistive technology — pending
- [ ] VoiceOver on iOS and TalkBack on Android: read question and answer controls in a logical order.
- [ ] Verify feedback announcements after correct, wrong and hinted answers; aria-live markup alone does not prove speech output.
- [ ] External keyboard Tab/Shift+Tab/Enter: focus visibility and restoration after rerender; no focus trap.
- [ ] Check reduced-motion and high text-size settings if available.

## Release gate
- Keep `main` and public GitHub Pages unchanged. All checkboxes above remain unverified until a person records device/browser, date, evidence and result.
- Record failures with reproducible steps, screenshot/video, impact and linked corrective commit.
- Production Pages smoke test only after explicit release approval.
