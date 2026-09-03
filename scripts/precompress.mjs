import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';

/**
 * Pre-compress static assets at build time.
 *
 * Caddy's `encode` directive supports gzip and zstd but not brotli without a
 * custom build. Compressing here and serving with `precompressed` means zero
 * CPU per request — which matters on a 256MB shared-cpu-1x machine — and
 * brotli-11 on ~70KB of HTML beats on-the-fly gzip by roughly a quarter.
 */
const COMPRESSIBLE = new Set([
  '.html', '.css', '.js', '.svg', '.json', '.xml', '.txt', '.map',
]);
const MIN_BYTES = 1024;

const root = process.argv[2] ?? 'dist';

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

let files = 0;
let before = 0;
let after = 0;

for await (const file of walk(root)) {
  if (!COMPRESSIBLE.has(extname(file))) continue;
  const buf = await readFile(file);
  if (buf.length < MIN_BYTES) continue;

  const br = brotliCompressSync(buf, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 11,
      [constants.BROTLI_PARAM_SIZE_HINT]: buf.length,
    },
  });
  await writeFile(`${file}.br`, br);
  await writeFile(`${file}.gz`, gzipSync(buf, { level: 9 }));

  files += 1;
  before += buf.length;
  after += br.length;
}

const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
console.log(
  `precompressed ${files} files: ${kb(before)} -> ${kb(after)} brotli ` +
    `(${(100 - (after / before) * 100).toFixed(0)}% smaller)`,
);
