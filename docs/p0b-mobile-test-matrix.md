# P0-B mobile browser verification matrix

Status: **NOT EXECUTED**. CI builds are not a substitute for real browser checks.

## Viewports
| Width | Device approximation | Checks |
| --- | --- | --- |
| 320px | small phone | toolbar wrap, no horizontal overflow, all answers accessible |
| 375px | phone | touch targets >= 48px, readable progress panel |
| 390px | phone | grade selector, hint, next button, reward feedback |
| 768px | tablet | centered content and keyboard navigation |

## Manual functional checks
1. Load feature branch build from an isolated preview (not production Pages).
2. Select grades 1/2/3 and confirm 6 available questions per grade.
3. Answer incorrectly three times; check hints and final explanation.
4. Answer independently; check star and mastery update.
5. Repeat the same question; check no additional star.
6. Reload; confirm grade, stars, review due date and attempts persist.
7. Disable localStorage writes; confirm no star or attempt is shown as saved.
8. Open two tabs, answer in each; confirm stale tab receives conflict warning.
9. Repeat concurrent writes with Web Locks enabled and unsupported; unsupported fallback is best-effort only.
10. Use keyboard, screen reader status, reduced-motion preference, and touch input.

## Evidence requirements
For each check capture: viewport/browser, timestamp, observed outcome, screenshot or test log, commit SHA. Do not mark passed without evidence.

## Release gate
- Feature branch CI success
- Browser-based checks completed with evidence
- No data loss, repeated rewards, or grade-navigation regressions
- Only then consider PR and deployment; main and public Pages remain unchanged.
