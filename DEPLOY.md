# Deploying

The site builds to plain static files in `dist/` and is served by Cloudflare as
an assets-only Worker — no server code runs.

## Dashboard setup (once)

**Workers & Pages → Create → Workers → Connect to Git →
`KonradHambuch/Paritas`**, then:

| Field | Value |
|---|---|
| Root directory | *leave empty* (`/`) — `package.json` is at the repo root |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Version command | `npx wrangler versions upload` |
| `NODE_VERSION` (env var) | `22.19.0` |

There is **no "Build output directory" field** in this UI. That setting lives in
`wrangler.jsonc` as `assets.directory` — see below. If you were expecting the
older Cloudflare Pages screen, this is the newer Workers Builds one; it does the
same job, it just reads the output path from the repo instead of a form field.

The *Version command* is what builds preview URLs for non-production branches
and pull requests. *Deploy command* is what goes live from `main`.

After that, every push to `main` builds and deploys itself. No API token, no
GitHub secret.

## Custom domain

In the Worker → **Settings → Domains & Routes → Add → Custom domain** →
`paritas.eu`.

If the domain's nameservers are on Cloudflare, the DNS record and certificate
are created for you; otherwise Cloudflare shows the record to add at your
registrar. Add `www.paritas.eu` too and point it at the apex — the apex is
canonical, because `astro.config.mjs` sets `site: 'https://paritas.eu'`.

## The three files that configure this

**`wrangler.jsonc`** — declares `assets.directory: "./dist/"` (the output path),
and `not_found_handling: "404-page"` so an unknown URL serves our own 404 page
with a real 404 status. The alternative, `"single-page-application"`, would
return `index.html` with a 200 for every unknown path and let search engines
index unlimited duplicates of the homepage.

**`public/_headers`** — cache policy and security headers. Note the comment at
the top: Cloudflare applies *every* matching rule and **concatenates** same-name
headers rather than overriding them, so a `Cache-Control` in a `/*` catch-all
appends itself to the specific rules and produces
`max-age=31536000, immutable, max-age=0, must-revalidate` on hashed assets. The
catch-all therefore carries security headers only, and `Cache-Control` is set
per path.

**`public/_redirects`** — `301 /paritas.html → /`, so links to the old
single-file site keep working.

Astro copies both underscore files from `public/` into `dist/`, and Cloudflare
reads them from the deployment root. They are not themselves served (both
return 404).

## Testing the whole serving layer locally

`wrangler dev` runs the real Cloudflare runtime against the built output, so
routing, `_headers`, `_redirects` and the 404 behave exactly as in production:

```bash
npm run build
npx wrangler dev --port 8788 --local
```

Then:

```bash
curl -sI http://localhost:8788/                    | grep -i cache-control
curl -sI http://localhost:8788/_astro/<hash>.css   | grep -i cache-control
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8788/nope          # 404
curl -sI http://localhost:8788/paritas.html        | head -1                 # 301
```

Verified locally at the time of writing: `/` and `/hu/` 200, `/hu` 307 to
`/hu/`, unknown paths 404 with the bilingual page, `/paritas.html` 301 to `/`,
hashed assets immutable for a year, HTML revalidating, security headers on
every response, and `_headers` / `_redirects` not publicly readable.

## If you would rather use fly.io after all

A `Dockerfile`, `Caddyfile` and `fly.toml` were written and verified, then
removed in favour of this. They are in git history:

```bash
git show 9d996db:Dockerfile
git show 9d996db:Caddyfile
git show 9d996db:fly.toml
```

Note that `paritas` is taken as a fly app name by an unrelated site, so those
files use `paritas-eu`.
