# P5-15 review interval audit

Executed actual src/review.ts function bodies after stripping type annotations. Blob 97bf6602850479475af4012c504e086266e5fb59. Four ratings, 12 successive due-date reviews each, 48 schedules, 144 assertions (positive interval, not due one millisecond before, due at boundary), all passed.

- again: 1 day throughout
- hard: 1 day throughout from fresh state
- good: 1,2,4,9,20,44,97,213,469,1032,2270,4994 days
- easy: 3,9,27,81,243,729,2187,6561,19683,59049,177147,531441 days (not currently emitted by ratingFor)

Risks: unbounded intervals; repeated same-session correct attempts also advance review scheduling; hard after a long interval increases rather than shortens it. Proposal for subsequent implementation/review: cap intervals at 30 days, prevent equivalently rated before-due correct answers from extending the window, retain immediate wrong-answer reset, preserve v1 schema and existing stars. Policy proposal not educator validated. No runtime changes, full build/browser/CI/deployment unverified.
