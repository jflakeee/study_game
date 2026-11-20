# P6-02 mobile navigation draft
P6-01 implementation and test authoring are not release sign-off. 392 review and 2160 integration assertions executed in JS extraction harness; full TypeScript build, native test runner, browser/Web Locks, physical device and CI remain unresolved. Do not merge or deploy. Continue design only until gates are resolved.

## Proposed navigation
Three persistent destinations: Learn (default), Village, Explore. Keep grade, stars and recovery action accessible. Learn keeps current question, hints, feedback and session goal; Village keeps growth, journal and building; Explore keeps world map and optional mixed expedition controls. Switching views is presentation-only: no new question, reward, attempt or storage write; preserve in-progress answers and transient builder state. No new save fields.

## Acceptance
320px portrait and landscape, 44px targets, keyboard focus and visible active state, no hidden focusable controls, polite live feedback, no overlap with safe areas. Recovery available from all destinations; saving cannot be interrupted by changes. Preserve 72 question IDs, v1 data, once-only reward. First implement navigation shell only after baseline verification; draft pending approval. No public deployment.
