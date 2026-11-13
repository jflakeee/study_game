# P0-B release gate — 2026-11-13

## Automated verification (verified)
- Commit b6a5a533436940344cb05a5e1990c032f7e45263: GitHub Actions run 43192484586 **success**.
- npm unit tests, Vite build and headless Chromium smoke tests passed on the feature branch.
- Chromium checks: 320/375/390/768px widths, horizontal overflow, 44px minimum enabled control targets, clipped controls, grade selection, hint, answer feedback, stale-tab conflict/reload, injected localStorage write failure.
- Build artifact 13930549042 and Chromium screenshot artifact 13930364366 exist in run 43192484586.
- These screenshots are generated and archived; no human visual review is claimed.

- Commit 4a434ff22c1f4ee31cc97ac136db5ff762ab851a: GitHub Actions run 43318016660 **success**. Chromium additionally verified independent correct reward persistence, hinted correct no reward, repeated-question no extra star, and mastery level 4 from two distinct independent correct question IDs.

- Commit 7f8688b25f8d6b194893981740f385164391ddca: GitHub Actions run 43347614554 **success**. Chromium verified three-stage wrong-answer tutoring, explanation, no reward and saved failure record.\n- Commit 3b90043af32b5299c93e0c505a0a9b9fc1521cf3: GitHub Actions run 43347723835 **success**. Chromium verified legacy v1 grade, stars, attempts, mastery and review due date across reload.\n- Commit 3260fef3b1977b0e09ab8be67c8a8751eb3ef988: GitHub Actions run 43350253314 **success**. Chromium verified keyboard Tab/Enter, live-region attributes, and focus restoration after correct answers, hints and wrong-answer tutoring. No real screen-reader verification is claimed.\n\n## Not yet verified / release blockers
- [ ] Human review of screenshots and hands-on touch behavior on physical iOS/Android devices.
- [ ] Complete wrong-answer 1/2/3 progressive tutoring, explanation and no-reward behavior in a real browser.
- [ ] Legacy v1 payload compatibility and full review schedule persistence in Chromium.
- [ ] Actual screen-reader announcements (NVDA/VoiceOver/TalkBack) and manual accessibility review; keyboard-only Chromium checks have passed.
- [ ] Production P0-B preview URL and published Pages smoke test after explicit release approval.

## Known limitations
- A question can repeat in a session; session-level exclusion is not implemented.
- Stars are awarded once per question for an independent correct response; repeat rewards are covered by unit tests and Chromium checks.
- Response-time rating helper is not connected to the main UI.
- v1 save format is retained; mastery is reconstructed from attempt history.
- Web Locks serialize saves where available; fallback optimistic checks are not atomic across tabs.

## Release decision
**HOLD**: keep main and public GitHub Pages unchanged until the remaining release blockers are resolved and approved. CI success does not imply real-device or public-deployment verification.
