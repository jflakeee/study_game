# Study Game development tools

These pinned upstream repositories are isolated Git submodules, not replacements for existing game code. Initialize them with `git submodule update --init --recursive`.

| Tool | Commit | Purpose |
| --- | --- | --- |
| Claude Code Game Studios | abc0de79d6ceb0b5d7aa693945849b3937afbe6a | Workflow reference and existing-project adoption |
| dream-loop | 9bddb901f7d071cfefdd21e264267c757177a9df | Target-image visual iteration |
| plinkfx | 7e5f6a477037679a29df9c5141e9853b1267e7d8 | Procedural game audio |

Do not copy the CCGS template src/, package.json, workflows or project configuration over Study Game. Review hooks and settings before activating. Dream Loop needs an image generator and browser screenshot/vision capability. PlinkFX runtime is not yet imported; verify the published package and audio UX separately. Retain the existing P0-B branch, v1 storage schema, no-star-on-hint rule and release HOLD. No upstream install scripts run automatically.
