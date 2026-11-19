# Offline reward/storage verification

Node 22.16.0, node --experimental-strip-types --test reward-storage.test.ts. Actual execution: 9 pass, 0 fail, 401.726595 ms. Core logic manually transcribed from learning.ts and storage.ts with type annotations removed; review.ts from offline workspace. Synthetic question and in-memory storage; mocked exclusive lock, not actual browser Web Locks. Not a full repository test or build.

Passed: independent correct and immutability; repeat reward; hinted then independent; wrong answer; v1 round trip; invalid records; quota failure retains raw state; stale writer rejection; mock exclusive lock serializes writers.

Release remains HOLD. Full question bank, CI, browser/device tests and deployment remain unverified.
