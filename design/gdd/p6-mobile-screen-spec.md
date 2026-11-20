# P6-02-A mobile screen specification (draft)
## Shared shell
Header: title, grade select, stars, sound, recovery when stale. Bottom navigation: Learn, Village, Explore; 44px minimum controls, safe-area padding. Default Learn on reload; view is transient. Use native buttons with aria-pressed and hidden panels; focus destination heading on deliberate navigation, never steal focus on storage events. Disable navigation during pending save. Reserve bottom space if sticky; no horizontal overflow at 320px.
## Learn
Current problem first: subject, prompt, choices, hint/garden, feedback, next; session progress; collapsible concept review below. Keep expedition status visible when active. Preserve answer attempts, hint flag, selected question, and garden count across navigation. No extra rewards or state writes for navigation.
## Village
Existing growth illustration, progress and next milestone; journal and builder details. Keep selected palette, undo, slots and details state. Storage conflict recovery is global; do not allow stale writes.
## Explore
World map, unlocked region story, optional mixed expedition start/stop. Starting expedition returns to Learn without replacing question or awarding stars. Locked regions explain existing star threshold; no paid unlocks or timed pressure.
## Regression matrix
320/390/430 portrait and landscape; keyboard focus; reduced motion; switch all views before and after hint, wrong attempt, correct answer, pending save, stale tab, grade change; confirm unchanged raw storage during navigation and no duplicated reward. Existing browser smoke must navigate explicitly to moved controls. Avoid simultaneous DOM duplication and duplicate IDs. Keep v1 and 72 question IDs. Full build/CI/browser/physical-device gates unresolved; design only, implementation pending baseline verification and approval.
