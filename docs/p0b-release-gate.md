# P0-B release gate — 2026-11-13

## Automated verification (verified)
- Commit b6a5a533436940344cb05a5e1990c032f7e45263: GitHub Actions run 43192484586 **success**.
- npm unit tests, Vite build and headless Chromium smoke tests passed on the feature branch.
- Chromium checks: 320/375/390/768px widths, horizontal overflow, 44px minimum enabled control targets, clipped controls, grade selection, hint, answer feedback, stale-tab conflict/reload, injected localStorage write failure.
- Build artifact 13930549042 and Chromium screenshot artifact 13930364366 exist in run 43192484586.
- These screenshots are generated and archived; no human visual review is claimed.

- Commit 4a434ff22c1f4ee31cc97ac136db5ff762ab851a: GitHub Actions run 43318016660 **success**. Chromium additionally verified independent correct reward persistence, hinted correct no reward, repeated-question no extra star, and mastery level 4 from two distinct independent correct question IDs.

- Commit 7f8688b25f8d6b194893981740f385164391ddca: GitHub Actions run 43347614554 **success**. Chromium verified three-stage wrong-answer tutoring, explanation, no reward and saved failure record.
- Commit 3b90043af32b5299c93e0c505a0a9b9fc1521cf3: GitHub Actions run 43347723835 **success**. Chromium verified legacy v1 grade, stars, attempts, mastery and review due date across reload.
- Commit 3260fef3b1977b0e09ab8be67c8a8751eb3ef988: GitHub Actions run 43350253314 **success**. Chromium verified keyboard Tab/Enter, live-region attributes, and focus restoration after correct answers, hints and wrong-answer tutoring. No real screen-reader verification is claimed.

## Latest successful CI evidence
- Commit 07113be756378bb87cd4d2d0d6398351591b28aa: GitHub Actions run 43378134660 **success**.
- Mobile Chromium automated checks now include 320/375/390/768px portrait, 667x375 and 812x375 landscape, 150%/200% CSS root-font scaling at 320px, clipped text, 44px touch targets, keyboard answer submission, focus retention, and captured screenshots.
- Screenshots and preview builds are CI artifacts, not approved public deployments or proof of manual visual quality.

## Remaining checks in priority order
### P0 — release blocking, manual
- [ ] Review archived screenshots for overlap, clipping, readable text and visible focus in portrait, landscape, enlarged text, hint, correct and wrong-answer states. Record reviewer, date and artifact link.
- [ ] Run hands-on iOS Safari and Android Chrome checks: tap/scroll/orientation, answer/hint/reward flow, reload, multi-tab conflict and denied storage. Record device/OS/browser and evidence.
- [ ] Verify VoiceOver (iOS) and TalkBack (Android) question order, live feedback announcements, keyboard focus and control labels. Record actual spoken behavior.
- [ ] Explicitly approve release before merging to main or changing public GitHub Pages.

### P1 — post-approval release validation
- [ ] Check published Pages URL on iOS and Android after authorized deployment, including caching, fresh-load and persisted v1 saves.
- [ ] Record deployed commit SHA, Actions run, observed URL, screenshot and rollback decision.

## Previously listed blockers now automated
- Three-stage wrong-answer tutoring and no-reward behavior passed Chromium CI 43347614554; **physical-device behavior still pending**.
- Legacy v1 payload and review schedule persistence passed Chromium CI 43347723835; **physical-device behavior still pending**.

## Not yet verified / release blockers
- [ ] Human review of screenshots and hands-on touch behavior on physical iOS/Android devices.
- [x] Wrong-answer 1/2/3 tutoring and no-reward behavior in headless Chromium (run 43347614554); physical-device repetition remains pending above.
- [x] Legacy v1 payload compatibility and review schedule persistence in Chromium (run 43347723835); physical-device repetition remains pending above.
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
