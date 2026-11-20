# P6-04 Career-themed exploration minigames — draft
Status: design only; no runtime implementation or release.

## Goal
Replace passive map-only exploration with short, hands-on activities suitable for grades 1–3. Use the selected P6-03 career to change story, scenery, objects and instructions, while preserving learning standards and canonical study rewards.

## Six game types
1. Jigsaw: 4/6/9 pieces by difficulty; complete a career tool or village building. Tap a piece then destination, optional drag.
2. Sort and order: 3–6 items, category or ascending sequence. Example astronaut supplies by quantity; doctor clinic items by label; lawyer document chronology; scientist observations by size.
3. Hidden objects: 3–5 objects in uncluttered illustrated scene, with readable textual clues and tap targets. Avoid timed hunts or visual overload. Provide text-list alternative and hint.
4. Maze: 4x4 to 7x7 grid, safe path, arrow buttons or swipe, no fast reaction requirement.
5. Pattern: complete number/shape/color sequence with 2–4 options; never rely solely on color.
6. Match pairs: 3–5 pairs of tools, words, concepts; flip cards or accessible list alternative.

## Career contexts
Doctor: prepare care center, find stethoscope, sort appointment cards; lawyer: match evidence labels, order events, find documents; police: safe route to crosswalk, sort safety signs; 119 responder: sort prevention equipment, locate exit sign in illustrated training room (no dangerous emergency simulation); scientist: classify leaves, assemble microscope, find observation tools; president: organize community proposals, find meeting supplies, sequence community project steps (nonpartisan); astronaut: assemble rocket, sort space supplies, navigate station; teacher: sort books, find classroom objects, match words and pictures. Free explorer: neutral village and nature scenes.

## Learning contract
Mini-games are optional exploration activities; they cannot replace required canonical question attempts unless explicitly mapped to verified curriculum objectives. Canonical question IDs and grading stay unchanged. Completing a minigame gives narrative progress, visual decoration or a non-currency collectible badge only, **not** extra stars, question completion, mastery or review scheduling. A game can use career-contextual text from P6-03 but must not silently rewrite correct answers. Career change preserves map progress and unlocked regions; themed visuals update without resetting rewards.

## Loop
Choose unlocked region -> select one of 1–3 activities -> read a short child-friendly goal -> interact -> gentle feedback and retry/hint -> completion animation -> region narrative update -> optional return to Learn. 1–3 minutes typical, no timers, streak penalties, ads or pressure. Difficulty grade-based and optionally reduced for accessibility. No random traps; deterministic seeds for testing.

## Data
Separate versioned minigame-progress key, no schema changes to study-game-state-v1 or village-v1. Validate career ID, game ID, region and progress; ignore corrupt entries without overwriting unknown records. Save only after successful completion via existing safe write pattern; prevent duplicate awards and stale-tab writes. Switching tabs retains in-progress local game state; switching career changes presentation, not underlying puzzle answer or earned progress.

## Accessibility and acceptance
Touch targets >=44px, keyboard support, visible focus, screen-reader instructions, no drag-only gameplay, no color-only clues, reduced-motion support, no essential audio. For hidden objects provide text-based alternative and zoomable scene. Tests across eight careers, free mode, grades 1–3, 320px portrait/landscape, retry/hint, offline, tab switching, storage failure, simultaneous tabs, career changes, no duplicated rewards. Review all text and images for age appropriateness. Prototype sequence: sort -> jigsaw -> hidden objects -> maze -> pattern -> pairs. Full build, browser and device gates pending; main and Pages preserved.
