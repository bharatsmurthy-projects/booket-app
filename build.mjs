import { createRequire } from 'module';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isWatch = process.argv.includes('--watch');

// ── Find esbuild wherever it lives ──────────────────────────
function findEsbuild() {
  const candidates = [];

  // 1. Local node_modules (after npm install) — PREFERRED
  const localEsbuild = resolve(__dirname, 'node_modules/esbuild/lib/main.js');
  if (existsSync(localEsbuild)) return localEsbuild;

  // 2. Try resolving via require from project root
  try {
    const req = createRequire(resolve(__dirname, 'package.json'));
    return req.resolve('esbuild');
  } catch {}

  // 3. npm global root
  try {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8', stdio: ['pipe','pipe','pipe'] }).trim();
    const globalEsbuild = resolve(globalRoot, 'esbuild/lib/main.js');
    if (existsSync(globalEsbuild)) return globalEsbuild;
    // Also check tsx bundled esbuild
    const tsxEsbuild = resolve(globalRoot, 'tsx/node_modules/esbuild/lib/main.js');
    if (existsSync(tsxEsbuild)) return tsxEsbuild;
  } catch {}

  // 4. which esbuild
  try {
    const bin = execSync('which esbuild', { encoding: 'utf8', stdio: ['pipe','pipe','pipe'] }).trim();
    if (bin) {
      // Resolve from binary to package
      const pkgMain = resolve(dirname(bin), '../lib/main.js');
      if (existsSync(pkgMain)) return pkgMain;
    }
  } catch {}

  throw new Error(`
❌  esbuild not found!

Run this first inside the booket-app folder:

    npm install

Then try again:

    node build.mjs
`);
}

// ── Find node_modules for React ──────────────────────────────
function findNodeModules() {
  const local = resolve(__dirname, 'node_modules');
  if (existsSync(local)) return local;

  try {
    return execSync('npm root -g', { encoding: 'utf8', stdio: ['pipe','pipe','pipe'] }).trim();
  } catch {}

  return null;
}

const esbuildPath = findEsbuild();
console.log(`✓ esbuild:       ${esbuildPath}`);

const { build, context } = await import(esbuildPath);

const nodeModulesPath = findNodeModules();
console.log(`✓ node_modules:  ${nodeModulesPath}`);

const outDir = resolve(__dirname, 'dist');
mkdirSync(outDir, { recursive: true });

const sharedConfig = {
  entryPoints: [resolve(__dirname, 'src/main.tsx')],
  bundle: true,
  outfile: resolve(outDir, 'bundle.js'),
  jsx: 'automatic',
  jsxImportSource: 'react',
  format: 'esm',
  target: ['es2020', 'chrome90', 'firefox88', 'safari14'],
  minify: !isWatch,
  sourcemap: isWatch ? 'inline' : false,
  define: {
    'process.env.NODE_ENV': isWatch ? '"development"' : '"production"',
  },
  ...(nodeModulesPath ? { nodePaths: [nodeModulesPath] } : {}),
  logLevel: 'info',
};

function copyAssets() {
  copyFileSync(resolve(__dirname, 'src/styles.css'), resolve(outDir, 'styles.css'));

  let html = readFileSync(resolve(__dirname, 'public/index.html'), 'utf8');
  let supabaseUrl = '';
  let supabaseKey = '';

  try {
    const envContent = readFileSync(resolve(__dirname, '.env'), 'utf8');
    for (const line of envContent.split('\n')) {
      const [key, ...rest] = line.split('=');
      const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
      if (key && key.trim() === 'VITE_SUPABASE_URL') supabaseUrl = val;
      if (key && key.trim() === 'VITE_SUPABASE_ANON_KEY') supabaseKey = val;
    }
    console.log('✓ Supabase credentials loaded from .env');
  } catch {
    console.log('ℹ️  No .env found — app will use localStorage fallback (still fully playable!)');
  }

  html = html
    .replace('%%SUPABASE_URL%%', supabaseUrl)
    .replace('%%SUPABASE_ANON_KEY%%', supabaseKey);

  writeFileSync(resolve(outDir, 'index.html'), html);
  console.log('✅ Assets written to dist/');
}

if (isWatch) {
  const ctx = await context(sharedConfig);
  await ctx.watch();
  copyAssets();
  console.log('👀 Watching for changes…');
} else {
  await build(sharedConfig);
  copyAssets();
  console.log('\n🏏 Booket build complete!\n   Open:  dist/index.html\n   Or run: cd dist && python3 -m http.server 3000\n');
}
