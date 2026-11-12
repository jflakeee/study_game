# P0-B release gate — 2026-11-13

## Automated verification (verified)
- Commit b6a5a533436940344cb05a5e1990c032f7e45263: GitHub Actions run 43192484586 **success**.
- npm unit tests, Vite build and headless Chromium smoke tests passed on the feature branch.
- Chromium checks: 320/375/390/768px widths, horizontal overflow, 44px minimum enabled control targets, clipped controls, grade selection, hint, answer feedback, stale-tab conflict/reload, injected localStorage write failure.
- Build artifact 13930549042 and Chromium screenshot artifact 13930364366 exist in run 43192484586.
- These screenshots are generated and archived; no human visual review is claimed.

- Commit 4a434ff22c1f4ee31cc97ac136db5ff762ab851a: GitHub Actions run 43318016660 **success**. Chromium additionally verified independent correct reward persistence, hinted correct no reward, repeated-question no extra star, and mastery level 4 from two distinct independent correct question IDs.

## Not yet verified / release blockers
- [ ] Human review of screenshots and hands-on touch behavior on physical iOS/Android devices.
- [ ] Complete wrong-answer 1/2/3 progressive tutoring, explanation and no-reward behavior in a real browser.
- [ ] Legacy v1 payload compatibility and full review schedule persistence in Chromium.
- [ ] Keyboard navigation, screen-reader announcements and accessible focus.
- [ ] Production P0-B preview URL and published Pages smoke test after explicit release approval.

## Known limitations
- A question can repeat in a session; session-level exclusion is not implemented.
- Stars are awarded once per question for an independent correct response; repeat rewards are covered by unit tests and Chromium checks.
- Response-time rating helper is not connected to the main UI.
- v1 save format is retained; mastery is reconstructed from attempt history.
- Web Locks serialize saves where available; fallback optimistic checks are not atomic across tabs.

## Release decision
**HOLD**: keep main and public GitHub Pages unchanged until the remaining release blockers are resolved and approved. CI success does not imply real-device or public-deployment verification.
