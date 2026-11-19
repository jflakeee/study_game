# P2 release verification — HOLD

Baseline: 881b65d0b6a75383b85ae269913b81f4c14d334a.

CI status and PR-workflow queries returned empty arrays; this does not establish pass or failure. Preserve main and public Pages. No deployment approval inferred.

## Reproduce on Node 22

```sh
npm install
npm test
npm run build:preview
npx playwright install --with-deps chromium
node tests/root-preview-smoke.mjs
npm run build
npm run test:browser
```

Alternatively manually dispatch P0-B branch tests on chore/studio-tooling-20261119 in GitHub Actions. Record run URL, exact SHA, conclusions and screenshots. Verify 36 unique questions, independent-only rewards, old v1 saves, failed saves, concurrent tabs, keyboard focus, growth thresholds and reduced motion. Check physical iOS Safari and Android Chrome including audio unlock, layout and animation. Inspect screenshots independently and measure performance before release approval. No successful execution claimed.
