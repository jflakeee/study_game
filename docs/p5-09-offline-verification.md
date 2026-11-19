# P5-09 offline verification

Node 22.16.0 / TypeScript 5.8.3. Source and tests manually transferred from GitHub and verified by git hash-object against repository blob SHA:
- src/village-storage.ts: 967d0ea43fefbc018687d9a9ae95de0b87db4f85
- tests/village-storage.test.ts: b2e8da2f2b6cff915f0ad287bf348cc2fd35add9

`node --experimental-strip-types --test tests/*.test.ts`: 5 passed, 0 failed, 437.754899 ms. Tests cover slot validation, placement/reset and learning key preservation, stale expected value rejection, quota failure, malformed/future data. `tsc --strict --noEmit --target es2022 --lib es2022,dom src/village-storage.ts`: exit 0. Learning STORAGE_KEY confirmed from src/storage.ts.

This is a fresh independently executed verification; previous P4-08 execution evidence was not independently confirmed. Mock storage only, not real concurrent tabs or Web Locks. Full build, browser, CI and device results remain unverified. No public deployment.
