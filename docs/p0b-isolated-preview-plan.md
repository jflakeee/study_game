# P0-B isolated HTTPS preview — deployment plan (NOT DEPLOYED)

## Goal and constraints
Enable iOS Safari and Android Chrome testing against the P0-B feature branch without merging into `main` or modifying the existing public GitHub Pages site. No live preview URL has been verified. A build artifact alone is not a website.

## Current evidence
- Last verified successful CI: https://github.com/jflakeee/study_game/actions/runs/43397473029
- Build script: `npm run build` invokes `tsc --noEmit && vite build`.
- `vite.config.ts` currently sets `base: '/study_game/'`; publishing the output at an unrelated preview root without adjusting the base can break JS/CSS asset paths.

## Recommended deployment approach (requires explicit approval)
1. Create a **separate** preview host/site, distinct from the production Pages site. Use a disposable preview domain with HTTPS; do not alter production DNS or GitHub Pages configuration.
2. Build the feature branch with a preview-specific Vite base that matches the final URL path (typically `/` for a separate preview origin). Do not change the production base in `vite.config.ts`; use a dedicated build configuration or a documented environment override on the feature branch.
3. Upload only the preview build to the separate host. Use the exact feature commit SHA in the deployment metadata. Do not copy production browser storage into preview.
4. Open the preview URL in a clean browser and confirm `index.html`, JS and CSS all load without 404 or console errors; confirm the learning screen renders and one answer works.
5. Record preview URL, SHA, deployment ID, tester/date, HTTPS and asset-path results in `docs/p0b-verification-record.md`. Only then begin D01–D11 and A01–A04.
6. Disable/remove the preview after testing if it is no longer needed; never merge or publish to production without explicit release approval.

## Alternatives and tradeoffs
- **Separate GitHub repository Pages:** free static HTTPS and no impact on production repo Pages, but requires a distinct repository and deployment credentials/permissions.
- **Separate preview service/project:** isolated HTTPS, but needs account access and provider configuration.
- **Local network HTTPS test server:** no external publication, but trusted certificates and device network access must be configured; not equivalent to testing production hosting.

## Security and release gate
- Never expose real student data or production localStorage; use disposable test profiles and synthetic records.
- Preview deployments must not include write-capable repository secrets in browser assets.
- A successful CI artifact does **not** imply an accessible deployed preview, real-device test, human screenshot review or production readiness.
- Current status: **PLAN ONLY / NOT DEPLOYED / HOLD**.
