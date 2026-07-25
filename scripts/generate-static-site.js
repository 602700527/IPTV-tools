#!/usr/bin/env node

/**
 * Static Site Generator CLI (v2.0 — works locally)
 *
 * Generates static HTML files for all pages.
 * Works on Cloudflare Workers (with D1) or locally (with JSON data).
 *
 * Usage:
 *   node scripts/generate-static-site.js --type homepage
 *   node scripts/generate-static-site.js --type all --data ./channels.json
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

const args = process.argv.slice(2);
const options = {
  type: 'all',
  outputDir: join(PROJECT_ROOT, 'static-output'),
  origin: 'https://iptv-search.com',
  dataPath: null,
  channelLimit: 50,
  categoryLimit: 100
};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--type':
    case '-t':
      options.type = args[++i] || 'all';
      break;
    case '--output-dir':
    case '-o':
      options.outputDir = join(PROJECT_ROOT, args[++i] || 'static-output');
      break;
    case '--origin':
      options.origin = args[++i] || 'https://iptv-search.com';
      break;
    case '--data':
      options.dataPath = args[++i];
      break;
    case '--channel-limit':
      options.channelLimit = parseInt(args[++i] || '50');
      break;
    case '--category-limit':
      options.categoryLimit = parseInt(args[++i] || '100');
      break;
    case '--help':
    case '-h':
      console.log(`
Static Site Generator v2.0 (no dependencies)

Usage:
  node scripts/generate-static-site.js [options]

Options:
  --type, -t <type>       Generate type: homepage, categories, channels, all
  --output-dir, -o <dir>  Output directory (default: ./static-output)
  --origin <url>          Website origin (default: https://iptv-search.com)
  --data <path>           Local channel data JSON file
  --channel-limit <n>     Limit channels (default: 50)
  --category-limit <n>    Limit categories (default: 100)
  --help, -h              Show help

Example:
  node scripts/generate-static-site.js --type all
`);
      process.exit(0);
  }
}

function slugify(str) {
  if (!str) return '';
  return str.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u3000-\u303f\u2000-\u206f\ufe30-\ufe4f\u2600-\u26ff-]/g, '').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

function info(m, ...a) { console.log(`[INFO] ${m}`, ...a); }
function warn(m, ...a) { console.log(`[WARN] ${m}`, ...a); }
function error(m, ...a) { console.log(`[ERROR] ${m}`, ...a); }

function progress(current, total, label = '') {
  if (total === 0) return;
  const percent = Math.round((current / total) * 100);
  const bar = '█'.repeat(Math.round(percent / 5)) + '░'.repeat(20 - Math.round(percent / 5));
  process.stdout.write(`\r[${bar}] ${percent}% ${label} (${current}/${total})`);
  if (current >= total) process.stdout.write('\n');
}

async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function writeHtmlFile(filePath, content) {
  await ensureDir(dirname(filePath));
  await writeFile(filePath, content, 'utf-8');
}

// Load channel data (from JSON file or generate mock)
function loadChannels() {
  if (options.dataPath && existsSync(options.dataPath)) {
    info(`Loading channel data from ${options.dataPath}`);
    const data = JSON.parse(readFileSync(options.dataPath, 'utf-8'));
    return data.channels || [];
  }

  // Fallback: try to fetch from API (no-op if not available)
  warn('No --data file provided. Using empty channel list.');
  warn('For production, run this on Cloudflare Workers with D1 binding.');
  warn('For local testing, generate a JSON dump first:');
  warn('  wrangler d1 execute tv-service-db --command="SELECT * FROM channels LIMIT 1000" --json > channels.json');
  return [];
}

// Group channels by group_title
function groupByCategory(channels) {
  const map = new Map();
  for (const ch of channels) {
    const group = ch.group_title || 'Other';
    if (!map.has(group)) map.set(group, []);
    map.get(group).push(ch);
  }
  return Array.from(map.entries()).map(([name, chs]) => ({
    name,
    slug: slugify(name),
    count: chs.length,
    channels: chs
  })).sort((a, b) => b.count - a.count);
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ===== PAGE GENERATORS =====
async function generateHomepage(categories) {
  info('Generating homepage...');
  const startTime = Date.now();

  try {
    const topCategories = categories.slice(0, options.categoryLimit);
    const totalChannels = categories.reduce((sum, c) => sum + c.count, 0);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Free IPTV Search - 8000+ Channels from 150+ Countries</title>
  <meta name="description" content="Search 8000+ free IPTV channels from 150+ countries. Browse live TV by region including USA, UK, China, Brazil. No registration. Updated daily.">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="Free IPTV Search - 8000+ Channels from 150+ Countries">
  <meta property="og:description" content="Browse IPTV channels by country/region. No registration required.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${options.origin}/">
  <meta property="og:image" content="${options.origin}/og-image.jpg">
  <link rel="canonical" href="${options.origin}/">
  <script type="application/ld+json">
${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "IPTV Search",
      "url": options.origin,
      "description": "Free IPTV channel directory with 8000+ live TV channels from 150+ countries",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${options.origin}/search?q={query}`,
        "query-input": "required name=query"
      },
      "publisher": {
        "@type": "Organization",
        "name": "IPTV Search",
        "url": options.origin
      }
    }, null, 2)}
  </script>
</head>
<body>
  <header><h1>Free IPTV Search Engine</h1></header>
  <nav><a href="/">Home</a> | <a href="/plans">Plans</a> | <a href="/tutorial">Tutorial</a></nav>
  <h2>Browse by Country (${topCategories.length} categories, ${totalChannels} channels)</h2>
  <ul>
${topCategories.map(c => `    <li><a href="/category/${encodeURIComponent(c.slug)}">${escapeHtml(c.name)}</a> (${c.count})</li>`).join('\n')}
  </ul>
</body>
</html>`;

    const filePath = join(options.outputDir, 'index.html');
    await writeHtmlFile(filePath, html);
    const duration = Date.now() - startTime;
    info(`✓ Homepage: ${filePath} (${duration}ms)`);
    return true;
  } catch (err) {
    error('Homepage failed:', err.message);
    return false;
  }
}

async function generateCategories(categories) {
  info('Generating category pages...');
  let successCount = 0;
  let failCount = 0;

  await ensureDir(join(options.outputDir, 'category'));

  const total = Math.min(categories.length, options.categoryLimit);
  info(`Will generate ${total} category pages`);

  for (let i = 0; i < total; i++) {
    const cat = categories[i];
    try {
      const channels = cat.channels.slice(0, 50);  // Limit per page
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(cat.name)} IPTV Channels - Free Live TV Streams</title>
  <meta name="description" content="Watch free ${escapeHtml(cat.name)} IPTV channels live online. ${escapeHtml(cat.name)} TV streaming - ${cat.count} channels. No signup required.">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${escapeHtml(cat.name)} IPTV Channels">
  <meta property="og:description" content="Free ${escapeHtml(cat.name)} IPTV streaming - ${cat.count} channels">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${options.origin}/category/${cat.slug}">
  <link rel="canonical" href="${options.origin}/category/${cat.slug}">
  <script type="application/ld+json">
${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${cat.name} Channels`,
        "description": `${cat.count} IPTV channels from ${cat.name}`,
        "url": `${options.origin}/category/${cat.slug}`,
        "publisher": {
          "@type": "Organization",
          "name": "IPTV Search",
          "url": options.origin
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": options.origin + "/"},
            {"@type": "ListItem", "position": 2, "name": cat.name, "item": `${options.origin}/category/${cat.slug}`}
          ]
        },
        "mainEntity": {
          "@type": "ItemList",
          "name": `${cat.name} TV Channels`,
          "numberOfItems": channels.length,
          "itemListElement": channels.map((ch, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
              "@type": "VideoObject",
              "name": ch.channel_name,
              "url": `${options.origin}/channel/${slugify(ch.channel_name)}`,
              "thumbnailUrl": ch.logo || `${options.origin}/og-image.jpg`
            }
          }))
        }
      }, null, 2)}
  </script>
</head>
<body>
  <nav><a href="/">Home</a> &raquo; ${escapeHtml(cat.name)}</nav>
  <h1>${escapeHtml(cat.name)} IPTV Channels</h1>
  <p>${cat.count} channels from ${escapeHtml(cat.name)}. M3U compatible. Updated daily.</p>
  <ul>
${channels.map(ch => `    <li><a href="/channel/${slugify(ch.channel_name)}">${escapeHtml(ch.channel_name)}</a></li>`).join('\n')}
  </ul>
</body>
</html>`;

      const filePath = join(options.outputDir, 'category', `${cat.slug}.html`);
      await writeHtmlFile(filePath, html);
      successCount++;
    } catch (err) {
      error(`Category ${cat.name} failed:`, err.message);
      failCount++;
    }
    progress(i + 1, total, 'categories');
  }

  info(`✓ Categories: ${successCount} success, ${failCount} failed`);
  return failCount === 0;
}

async function generateChannels(channels) {
  info('Generating channel pages...');
  let successCount = 0;
  let failCount = 0;
  const usedSlugs = new Map();

  await ensureDir(join(options.outputDir, 'channel'));

  const total = Math.min(channels.length, options.channelLimit);
  info(`Will generate ${total} channel pages`);

  for (let i = 0; i < total; i++) {
    const ch = channels[i];
    try {
      let channelSlug = slugify(ch.channel_name);
      if (!channelSlug) channelSlug = ch.channel_hash;

      if (usedSlugs.has(channelSlug)) {
        const count = usedSlugs.get(channelSlug) + 1;
        usedSlugs.set(channelSlug, count);
        channelSlug = `${channelSlug}-${count}`;
      } else {
        usedSlugs.set(channelSlug, 1);
      }

      const categorySlug = slugify(ch.group_title);
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(ch.channel_name)} - Free IPTV Live Stream | ${escapeHtml(ch.group_title || 'Live TV')}</title>
  <meta name="description" content="Watch ${escapeHtml(ch.channel_name)} live online free. ${escapeHtml(ch.group_title || 'IPTV')} streaming with M3U M3U8 download. No signup required.">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${escapeHtml(ch.channel_name)} - Free IPTV Live Stream">
  <meta property="og:description" content="Watch ${escapeHtml(ch.channel_name)} live online free">
  <meta property="og:type" content="video.other">
  <meta property="og:url" content="${options.origin}/channel/${channelSlug}">
  <link rel="canonical" href="${options.origin}/channel/${channelSlug}">
  <script type="application/ld+json">
${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": ch.channel_name,
        "description": `Live stream for ${ch.channel_name} from ${ch.group_title || 'IPTV'}`,
        "uploadDate": "2024-01-01",
        "thumbnailUrl": ch.logo || `${options.origin}/og-image.jpg`,
        "contentUrl": `${options.origin}/play/${ch.channel_hash}`,
        "embedUrl": `${options.origin}/play/${ch.channel_hash}`,
        "genre": ch.group_title || "TV Channel"
      }, null, 2)}
  </script>
</head>
<body>
  <nav><a href="/">Home</a> &raquo; <a href="/category/${categorySlug}">${escapeHtml(ch.group_title || 'Other')}</a></nav>
  <h1>${escapeHtml(ch.channel_name)}</h1>
  <p>Live stream from ${escapeHtml(ch.group_title || 'IPTV')}.</p>
  <p>Stream URL: <code>${options.origin}/play/${escapeHtml(ch.channel_hash)}</code></p>
</body>
</html>`;

      const filePath = join(options.outputDir, 'channel', `${channelSlug}.html`);
      await writeHtmlFile(filePath, html);
      successCount++;
    } catch (err) {
      error(`Channel ${ch.channel_name} failed:`, err.message);
      failCount++;
    }
    progress(i + 1, total, 'channels');
  }

  info(`✓ Channels: ${successCount} success, ${failCount} failed`);
  return failCount === 0;
}

async function main() {
  console.log(`
╔═══════════════════════════════════════════╗
║     Static Site Generator v2.0            ║
╚═══════════════════════════════════════════╝
  Origin:   ${options.origin}
  Output:   ${options.outputDir}
  Type:     ${options.type}
  Data:     ${options.dataPath || '(none - will generate empty pages)'}
  Limits:   categories=${options.categoryLimit}, channels=${options.channelLimit}
`);

  const startTime = Date.now();
  let success = true;

  try {
    const rawChannels = loadChannels();
    const categories = groupByCategory(rawChannels);
    info(`Loaded ${rawChannels.length} channels across ${categories.length} categories`);

    if (rawChannels.length === 0) {
      warn('No channels in data file. Pages will be empty placeholders.');
    }

    await ensureDir(options.outputDir);
    await ensureDir(join(options.outputDir, 'category'));
    await ensureDir(join(options.outputDir, 'channel'));

    switch (options.type) {
      case 'homepage':
        success = await generateHomepage(categories);
        break;
      case 'categories':
        success = await generateCategories(categories);
        break;
      case 'channels':
        success = await generateChannels(rawChannels);
        break;
      case 'all':
      default:
        success = await generateHomepage(categories) && success;
        success = await generateCategories(categories) && success;
        success = await generateChannels(rawChannels) && success;
        break;
    }
  } catch (err) {
    error('Unexpected error:', err.message);
    success = false;
  }

  const duration = Date.now() - startTime;
  console.log(`\nTotal time: ${duration}ms`);

  if (success) {
    info('✓ All tasks completed!');
    process.exit(0);
  } else {
    error('✗ Some tasks failed');
    process.exit(1);
  }
}

main();
