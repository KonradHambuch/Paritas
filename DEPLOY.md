# Deploying

The site builds to plain static files in `dist/`. Any static host will serve it;
these instructions are for Cloudflare Pages, which needs no server, no
container and no secrets in the repo.

## Cloudflare Pages, connected to GitHub

Once, in the Cloudflare dashboard:

1. **Workers & Pages → Create → Pages → Connect to Git**
2. Pick the `KonradHambuch/Paritas` repository
3. Build settings:

   | Field | Value |
   |---|---|
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | `22.19.0` (env var `NODE_VERSION`) |

4. Save and deploy.

From then on every push to `main` builds and goes live automatically, and every
pull request gets its own preview URL. Nothing else to configure.

## Custom domain

In the Pages project: **Custom domains → Set up a domain → `paritas.eu`**.

If the domain's nameservers are already on Cloudflare, the DNS record is created
for you and the certificate is issued automatically. If not, Cloudflare shows
the CNAME to add at your registrar.

Add `www.paritas.eu` as well and let it redirect to the apex — the apex is
canonical, because `astro.config.mjs` sets `site: 'https://paritas.eu'` and
every `<link rel="canonical">` points there.

## What the two config files do

- **`public/_headers`** — cache policy and security headers. Hashed assets under
  `/_astro/` are immutable for a year; HTML revalidates, so a redeploy is
  visible immediately while repeat visits still get a 304.
- **`public/_redirects`** — `301 /paritas.html → /`, so links to the old
  single-file site keep working.

Both are plain text files that Astro copies from `public/` into `dist/`, and
Cloudflare reads them from the deployment root. Compression is handled at the
edge, so there is nothing to pre-compress.

## Verifying a deploy

```bash
curl -sI https://paritas.eu/            | grep -i 'cache-control\|content-encoding'
curl -sI https://paritas.eu/_astro/<hash>.css | grep -i 'cache-control'
curl -sI https://paritas.eu/paritas.html | head -1     # expect 301
curl -sI https://paritas.eu/nope         | head -1     # expect 404
curl -s  https://paritas.eu/hu/          | grep -o 'Határon átnyúló'
```

## If you would rather use fly.io

The `Dockerfile`, `Caddyfile` and `fly.toml` for a fly.io deployment were
written and verified, then removed in favour of this simpler path. They are in
git history if the decision changes:

```bash
git show 9d996db:Dockerfile
git show 9d996db:Caddyfile
git show 9d996db:fly.toml
```

Note that `paritas` is already taken as a fly app name by an unrelated site, so
those files use `paritas-eu`.
