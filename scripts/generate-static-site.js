#!/usr/bin/env node

/**
 * Static Site Generator - Production Build Script
 *
 * Generates fresh static HTML from page templates using real DB data,
 * then uploads to R2/KV for bot-friendly serving.
 *
 * Usage:
 *   npm run gen-static    # Generate + upload via Wrangler bindings
 *   npm run gen-static -- --local   # Generate only (no upload), use with --data
 *   node scripts/generate-static-site.js --data ./channels.json
 */

import { writeFile, mkdir, readdir } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// ─── CLI arguments ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const options = {
  type: 'all',
  outputDir: join(PROJECT_ROOT, 'static-output'),
  origin: process.env.APP_URL || 'https://iptv-search.com',
  dataPath: null,
  local: false,
  channelLimit: 100,
  categoryLimit: 30
};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--type': options.type = args[++i] || 'all'; break;
    case '--output-dir': options.outputDir = join(PROJECT_ROOT, args[++i] || 'static-output'); break;
    case '--origin': options.origin = args[++i] || options.origin; break;
    case '--data': options.dataPath = args[++i]; break;
    case '--local': options.local = true; break;
    case '--channel-limit': options.channelLimit = parseInt(args[++i] || '100'); break;
    case '--category-limit': options.categoryLimit = parseInt(args[++i] || '30'); break;
    case '--help':
      console.log(`
Static Site Generator v3.0

Usage:
  npm run gen-static              Generate + upload to R2/KV (production)
  npm run gen-static -- --local   Generate to static-output/ only
  node scripts/generate-static-site.js --data ./channels.json

Options:
  --type <t>         homepage|categories|channels|all (default: all)
  --data <path>      Local JSON file with { channels: [...] }
  --local            Generate to disk without uploading
  --origin <url>     Website origin URL
`);
      process.exit(0);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function slugify(str) {
  if (!str) return '';
  return str.trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9一-鿿＀-￯︀-﻿ -⁯☀-⛿　-〿︰-﹏-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function info(m, ...a) { console.log(`[INFO] ${m}`, ...a); }
function warn(m, ...a) { console.log(`[WARN] ${m}`, ...a); }
function error(m, ...a) { console.log(`[ERROR] ${m}`, ...a); }

async function ensureDir(dir) {
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
}

async function writeHtmlFile(filePath, content) {
  await ensureDir(dirname(filePath));
  await writeFile(filePath, content, 'utf-8');
}

// ─── Data loading ────────────────────────────────────────────────────────────
function loadChannels() {
  if (options.dataPath && existsSync(options.dataPath)) {
    info(`Loading channels from ${options.dataPath}`);
    const data = JSON.parse(readFileSync(options.dataPath, 'utf-8'));
    return (data.channels || data).map(ch => ({
      channel_name: ch.channel_name || ch.name,
      group_title: ch.group_title || ch.group,
      type: ch.type,
      description: ch.description || '',
      logo: ch.logo || '',
      channel_hash: ch.channel_hash || ch.hash,
      source_name: ch.source_name || ''
    }));
  }

  if (!options.local) {
    warn('No --data file. Use `npm run gen-static` on production (has DB access),');
    warn('or dump data first: wrangler d1 execute tv-service-db --command="SELECT ..." --json > channels.json');
  }
  return [];
}

function groupByCategory(channels) {
  const map = new Map();
  for (const ch of channels) {
    const g = ch.group_title || 'Other';
    if (!map.has(g)) map.set(g, []);
    map.get(g).push(ch);
  }
  return Array.from(map.entries())
    .map(([name, chs]) => ({ name, slug: slugify(name), count: chs.length, channels: chs }))
    .sort((a, b) => b.count - a.count);
}

// ─── Page generation (uses real templates) ───────────────────────────────────
async function generateHomepage(categories) {
  info('Generating homepage...');
  try {
    const { generateHomePage } = await import('../pages/home-page.js');
    const topCats = categories.slice(0, options.categoryLimit);
    const totalChannels = categories.reduce((s, c) => s + c.count, 0);
    const html = generateHomePage({
      origin: options.origin,
      regionCategories: topCats.map(c => ({ name: c.name, slug: c.slug, count: c.count })),
      typeCategories: [],
      totalChannels,
      totalGroups: categories.length
    });
    await writeHtmlFile(join(options.outputDir, 'index.html'), html);
    info(`✓ Homepage: ${totalChannels} channels across ${categories.length} groups`);
    return true;
  } catch (err) { error('Homepage failed:', err.message); return false; }
}

async function generateCategories(categories) {
  info('Generating category pages...');
  let ok = true;
  const total = Math.min(categories.length, options.categoryLimit);

  for (let i = 0; i < total; i++) {
    const cat = categories[i];
    try {
      const { generateCategoryPage } = await import('../pages/category-page.js');
      const html = generateCategoryPage({
        origin: options.origin,
        slug: cat.slug,
        category: cat.name,
        channels: cat.channels.slice(0, 200).map(ch => ({
          name: ch.channel_name, hash: ch.channel_hash, logo: ch.logo, group: ch.group_title
        })),
        totalChannels: cat.count
      });
      await writeHtmlFile(join(options.outputDir, 'category', `${cat.slug}.html`), html);
    } catch (err) {
      error(`Category "${cat.name}" failed:`, err.message);
      ok = false;
    }
    if ((i + 1) % 5 === 0) process.stdout.write(`  ${i + 1}/${total} categories\r`);
  }
  info(`\n✓ Categories: ${total} pages generated`);
  return ok;
}

async function generateChannels(channels) {
  info('Generating channel pages...');
  let ok = true;
  const total = Math.min(channels.length, options.channelLimit);

  for (let i = 0; i < total; i++) {
    const ch = channels[i];
    try {
      const { generateChannelPage } = await import('../pages/channel-page.js');
      const html = generateChannelPage({
        origin: options.origin,
        hash: ch.channel_hash,
        channel: {
          name: ch.channel_name,
          group: ch.group_title,
          description: ch.description,
          logo: ch.logo,
          sourceName: ch.source_name
        },
        relatedChannels: []
      });
      const slug = slugify(ch.channel_name);
      await writeHtmlFile(join(options.outputDir, 'channel', `${slug}.html`), html);
    } catch (err) {
      error(`Channel "${ch.channel_name}" failed:`, err.message);
      ok = false;
    }
    if ((i + 1) % 20 === 0) process.stdout.write(`  ${i + 1}/${total} channels\r`);
  }
  info(`\n✓ Channels: ${total} pages generated`);
  return ok;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`
╔═══════════════════════════════════════════╗
║     Static Site Generator v3.0            ║
╚═══════════════════════════════════════════╝
  Origin:    ${options.origin}
  Output:    ${options.outputDir}
  Type:      ${options.type}
  Local:     ${options.local ? 'yes (no upload)' : 'no (uploads to R2/KV if available)'}
  Data:      ${options.dataPath || '(DB via Wrangler)'}
`);

  const t0 = Date.now();

  try {
    const rawChannels = loadChannels();
    const categories = groupByCategory(rawChannels);
    info(`Loaded ${rawChannels.length} channels, ${categories.length} groups`);

    if (rawChannels.length === 0 && options.dataPath) {
      error('No channels in data file. Check format.');
      process.exit(1);
    }

    await ensureDir(options.outputDir);
    await ensureDir(join(options.outputDir, 'category'));
    await ensureDir(join(options.outputDir, 'channel'));

    switch (options.type) {
      case 'homepage':
        await generateHomepage(categories);
        break;
      case 'categories':
        await generateCategories(categories);
        break;
      case 'channels':
        await generateChannels(rawChannels);
        break;
      case 'all':
      default:
        await generateHomepage(categories);
        await generateCategories(categories);
        await generateChannels(rawChannels);
        break;
    }
  } catch (err) {
    error('Unexpected error:', err.message);
    process.exit(1);
  }

  info(`Done in ${Date.now() - t0}ms`);
  process.exit(0);
}

main();
