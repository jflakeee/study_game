# P0-B isolated preview artifact

The feature-branch CI workflow runs tests, builds with Vite, and uploads the `dist/` directory as a short-lived GitHub Actions artifact named `p0b-preview-<commit SHA>`. It **does not deploy** or modify the production GitHub Pages site.

## Download
1. Open the latest successful `P0-B branch tests` run for the feature branch.
2. Under **Artifacts**, download `p0b-preview-<commit SHA>`.
3. Unzip the static files.

## Test locally at the expected base path
Vite builds assets with `base: '/study_game/'`. To avoid broken asset paths, serve the extracted files under `/study_game/` rather than at `/`.

For example, from a temporary working directory:
```sh
mkdir -p study_game
# Extract the artifact's contents into ./study_game/
python3 -m http.server 8000
```
Then visit `http://localhost:8000/study_game/` on the test computer. For testing on a phone, use an accessible LAN host with appropriate security and HTTPS where required for Web Locks.

## Verification status
Artifact availability only confirms that build output can be downloaded. Browser rendering, touch input, multi-tab behavior, Web Locks and mobile accessibility **remain unverified** until separately executed and evidenced. Keep `main` and public Pages unchanged.
