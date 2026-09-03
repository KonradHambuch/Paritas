# Deploying to fly.io

The site builds to static files and is served by Caddy in a ~55 MB container.

## One-time setup

`flyctl` is not installed on this machine, and neither is Docker. Install the
CLI first:

```powershell
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

Then:

```bash
fly auth login
fly launch --no-deploy --name paritas-eu --region waw   # keeps the fly.toml in this repo
fly deploy --remote-only                             # --remote-only: no local Docker needed
```

`--remote-only` builds on fly's builder. It is the default when no local Docker
daemon is found, but passing it explicitly avoids a confusing error.

## Custom domain

```bash
fly ips list          # note the shared v4 and the dedicated v6
```

At the registrar:

```
A     @    <shared IPv4>
AAAA  @    <dedicated IPv6>
CNAME www  paritas.fly.dev
```

Then:

```bash
fly certs add paritas.eu
fly certs add www.paritas.eu
fly certs show paritas.eu     # wait for the ACME challenge to clear
```

The apex is canonical — `astro.config.mjs` sets `site: 'https://paritas.eu'`
and every `<link rel="canonical">` points there.

## Verifying a deploy

```bash
curl -sI https://paritas.eu/ | grep -i 'cache-control\|content-encoding'
curl -sI -H 'Accept-Encoding: br' https://paritas.eu/_astro/<hash>.js | grep -i content-encoding
curl -so /dev/null -w '%{time_starttransfer}\n' https://paritas.eu/
curl -sI https://paritas.eu/nope    | head -1     # expect 404
curl -s  https://paritas.eu/hu/nope | grep -o 'nem található'
curl -sI https://paritas.eu/paritas.html | head -1  # expect 301 to /
```

Expected: `/_astro/*` is `immutable`, HTML is `max-age=0, must-revalidate`,
assets are served pre-compressed with brotli, TTFB from Europe well under 100 ms.

## Why these choices

**Caddy, not `@astrojs/node`.** The output is `static` — there is nothing to
run. A Node runtime would add ~60 MB and a few hundred ms of cold start in
exchange for no capability.

**Pre-compressed at build time.** Caddy's `encode` does gzip and zstd but not
brotli without a custom build. `scripts/precompress.mjs` writes `.br` and `.gz`
next to each asset and `file_server { precompressed }` serves them, so there is
zero compression CPU per request — which matters on a 256 MB shared machine.

**`min_machines_running = 1`, not scale-to-zero.** A cold start lands directly
in TTFB, and the requests most likely to hit a stopped machine are Googlebot's
and a first-time visitor's. One `shared-cpu-1x`/256 MB machine is a couple of
dollars a month. Set it to 0 with `auto_stop_machines = "suspend"` if that
changes.

For zero-blip rolling deploys, run two machines in Warsaw:

```bash
fly scale count 2 --region waw
```
