# P2-02 — Storybook knowledge village
Status: proposed, not approved; visual verification pending.
## Direction
Soft pastel miniature village, 2.5D isometric illustration, rounded cards, readable Korean text. Portrait-first. No external assets required for initial CSS prototype.
Palette: sky #EAF6FF, grass #D9F3D5, ink #20334C, action #2266A4, warm highlight #FFF0C3.
## Layout
Village scene, star count, grade and sound controls; quiz remains reachable with a single scroll. Maintain DOM and keyboard order for the prototype; no absolute positioning of interactive controls. Use decorative artwork only, never encode learning state in color alone.
## Village milestones
0/2/4/8/12 stars retain existing milestone logic. Show cottage, trees, school, library, town hall in that order. Maintain v1 storage and star award logic. Art upgrades do not change progression.
## Dream Loop
Generate target screenshots for 390x844 portrait (initial quiz, hint, correct milestone, final wrong), then implement local vector artwork, capture equivalent live screenshots, compare with independent visual reviewer and iterate. Do not claim a completed loop without target and actual screenshots and reviewer evidence.
## Acceptance
320/375/390/768 widths, landscape 667x375, CSS root text 200%, no overflow, 44px minimum controls, visible focus, reduced motion, no unexpected audio, no reward changes, no broken asset requests. Physical iOS/Android and screen-reader verification remain required before public release.
## Release
Keep main and public Pages unchanged; integration branch only. CI and visual evidence separately recorded.
