# Workflow

- Wants changes made locally but held back from git commits and deploys until explicitly approved ("don't commit or deploy anything until i say so"). Confidence: 0.75
- Deploy convention he expects to be reused: SSH into the root server, pull latest in the server clone under `/srv`, `bun install` + `bun run build`, restart the app's systemd service, then expose only the specific pages he names as public URLs via Caddy reverse-proxy routes (public path may differ from internal Next route, e.g. `vibed.work/mib -> /maa-inti-bangaaram`). Confidence: 0.55
