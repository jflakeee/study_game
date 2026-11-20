# P6-02-C implementation preparation
Existing render() replaces root.innerHTML on every state change and then restores focus by id; village SVG may be moved from old DOM. Navigation must preserve this lifecycle, not introduce duplicate ids or hidden focus. Current content order: toolbar, village, concept progress, quest, journal, builder, world map, footer. Existing root browser smoke accesses builder and world controls directly, so moving panels requires updating smoke navigation.

## Minimum safe change set
1. Add transient activeView: learn/village/explore default learn; never persist it.
2. Wrap quest+concept in Learn, village+journal+builder in Village, world map in Explore using explicit DOM structure (not CSS-only visual reordering); preserve existing element ids and render handlers.
3. Add accessible 44px bottom navigation with aria-pressed and active state. Hidden panels must be truly hidden (not merely opacity or offscreen) and remove hidden controls from tab sequence.
4. On user tab selection, avoid chooseQuestion, recordAttempt, saveState, random selection. Focus visible panel heading, not hidden prior button. On state rerender restore focus only when focus target remains visible.
5. Recovery must be reachable regardless of activeView, and navigation blocked while saving. Storage events should not steal focus.
6. Expedition start from Explore needs explicit Learn return; retain current question.
7. Extend root/browser tests for six directed transitions, storage snapshot invariance, hints and grade switching, 320px overflow and landscape.

## Release gates
Do not merge to main or deploy Pages until TypeScript build, node tests, Chromium smoke, device checks and explicit approval. Prior extracted JS checks are not a substitute. This commit is planning only, no runtime change.
