#!/usr/bin/env node

/**
 * 静态站点生成器 CLI
 * 
 * 用法:
 *   node scripts/generate-static-site.js                    # 生成所有
 *   node scripts/generate-static-site.js --type homepage   # 仅生成首页
 *   node scripts/generate-static-site.js --type categories # 仅生成分类页
 *   node scripts/generate-static-site.js --type channels   # 仅生成频道页
 *   node scripts/generate-static-site.js --output-dir ./static-output
 */

import { D1Database } from '@cloudflare/workers-types';
import { generateSEOHomepage, generateCategoryPage, generateChannelDetailPage } from '../handlers/seo-handler.js';
import { getDB, createTables } from '../database.js';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// 命令行参数解析
const args = process.argv.slice(2);
const options = {
  type: 'all', // homepage, categories, channels, all
  outputDir: join(PROJECT_ROOT, 'static-output'),
  origin: 'https://iptv-search.com',
  limit: 100,
  categoryLimit: 500,
  channelLimit: 10000,
  batchSize: {
    categories: 100,
    channels: 500
  }
};

// 解析参数
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
    case '--help':
    case '-h':
      console.log(`
Static Site Generator CLI

用法:
  node scripts/generate-static-site.js [选项]

选项:
  --type, -t <type>     生成类型: homepage, categories, channels, all (默认: all)
  --output-dir, -o <dir> 输出目录 (默认: ./static-output)
  --origin <url>        网站 origin (默认: https://iptv-search.com)
  --help, -h            显示帮助

示例:
  node scripts/generate-static-site.js
  node scripts/generate-static-site.js --type homepage
  node scripts/generate-static-site.js --type categories
  node scripts/generate-static-site.js --type channels --output-dir ./my-static
`);
      process.exit(0);
  }
}

// 确保输出目录存在
async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

// 写入文件
async function writeHtmlFile(filePath, content) {
  await ensureDir(dirname(filePath));
  await writeFile(filePath, content, 'utf-8');
}

// Slugify - 支持中文、英文、数字、emoji 和连字符
function slugify(str) {
  if (!str) return '';
  return str
    .trim()
    .replace(/\s+/g, '-')  // 空格转连字符
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff\uff00-\uffef\ufe00-\ufeff\u3000-\u303f\u2000-\u206f\ufe30-\ufe4f\u2600-\u26ff-]/g, '')  // 保留中文、英文、数字、emoji和连字符
    .replace(/-+/g, '-')   // 多个连字符合并
    .replace(/^-+|-+$/g, '');  // 去除首尾连字符
}

// 日志
function log(level, message, ...args) {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  console.log(`[${timestamp}] [${level}] ${message}`, ...args);
}

function info(message, ...args) { log('INFO', message, ...args); }
function warn(message, ...args) { log('WARN', message, ...args); }
function error(message, ...args) { log('ERROR', message, ...args); }

// 进度条
function progress(current, total, label = '') {
  const percent = Math.round((current / total) * 100);
  const bar = '█'.repeat(Math.round(percent / 5)) + '░'.repeat(20 - Math.round(percent / 5));
  process.stdout.write(`\r[${bar}] ${percent}% ${label} (${current}/${total})`);
  if (current >= total) {
    process.stdout.write('\n');
  }
}

// 生成首页
async function generateHomepage() {
  info('Generating homepage...');
  const startTime = Date.now();

  try {
    const html = await generateSEOHomepage({
      origin: options.origin,
      limit: options.limit
    });

    const filePath = join(options.outputDir, 'index.html');
    await writeHtmlFile(filePath, html);

    const duration = Date.now() - startTime;
    info(`✓ Homepage generated: ${filePath} (${duration}ms)`);
    return true;
  } catch (err) {
    error(`Failed to generate homepage:`, err.message);
    return false;
  }
}

// 生成分类页
async function generateCategories() {
  info('Generating category pages...');
  const startTime = Date.now();

  try {
    const db = getDB();

    // 获取所有分组
    const groupsResult = await db.prepare(`
      SELECT c.group_title, COUNT(*) as count
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE c.is_active = 1 AND s.is_active = 1
        AND c.group_title IS NOT NULL AND c.group_title != ''
      GROUP BY c.group_title
      ORDER BY c.group_title
    `).all();

    const groups = groupsResult.results || [];
    const total = groups.length;

    info(`Found ${total} categories`);

    // 确保 category 目录存在
    await ensureDir(join(options.outputDir, 'category'));

    let successCount = 0;
    let failCount = 0;

    // 分批处理
    for (let i = 0; i < groups.length; i += options.batchSize.categories) {
      const batch = groups.slice(i, i + options.batchSize.categories);

      await Promise.all(batch.map(async (group) => {
        const categoryName = group.group_title;
        const slug = slugify(categoryName);
        const count = group.count;

        try {
          const html = await generateCategoryPage({
            origin: options.origin,
            category: categoryName,
            slug: slug,
            limit: options.categoryLimit
          });

          const filePath = join(options.outputDir, 'category', `${slug}.html`);
          await writeHtmlFile(filePath, html);
          successCount++;
        } catch (err) {
          error(`Failed to generate category ${categoryName}:`, err.message);
          failCount++;
        }
      }));

      progress(Math.min(i + options.batchSize.categories, total), total, 'categories');
    }

    const duration = Date.now() - startTime;
    info(`✓ Categories generated: ${successCount} success, ${failCount} failed (${duration}ms)`);
    return failCount === 0;
  } catch (err) {
    error(`Failed to generate categories:`, err.message);
    return false;
  }
}

// 生成频道详情页
async function generateChannels() {
  info('Generating channel detail pages...');
  const startTime = Date.now();

  try {
    const db = getDB();

    // 获取频道总数
    const countResult = await db.prepare(`
      SELECT COUNT(*) as total
      FROM channels c
      INNER JOIN sources s ON c.source_id = s.id
      WHERE c.is_active = 1 AND s.is_active = 1
    `).first();
    const total = Math.min(countResult?.total || 0, options.channelLimit);

    info(`Found ${countResult?.total || 0} channels, generating up to ${total}`);

    // 确保 channel 目录存在
    await ensureDir(join(options.outputDir, 'channel'));

    let successCount = 0;
    let failCount = 0;
    let processed = 0;
    const usedSlugs = new Map();

    // 分批查询和生成
    while (processed < total) {
      const batchSize = options.batchSize.channels;

      const channelsResult = await db.prepare(`
        SELECT c.id, c.channel_name, c.group_title, c.logo, c.play_url, c.headers, c.channel_hash, c.is_active
        FROM channels c
        INNER JOIN sources s ON c.source_id = s.id
        WHERE c.is_active = 1 AND s.is_active = 1
        ORDER BY c.id
        LIMIT ? OFFSET ?
      `).bind(batchSize, processed).all();

      const channels = channelsResult.results || [];

      if (channels.length === 0) break;

      await Promise.all(channels.map(async (channel) => {
        try {
          const html = await generateChannelDetailPage({
            origin: options.origin,
            channel: channel,
            channelHash: channel.channel_hash
          });

          // 使用 slug 而不是 channel_hash 命名文件
          let channelSlug = slugify(channel.channel_name);
          if (!channelSlug) {
            channelSlug = channel.channel_hash;
          }

          // 处理重名频道：添加数字后缀
          if (usedSlugs.has(channelSlug)) {
            const count = usedSlugs.get(channelSlug) + 1;
            usedSlugs.set(channelSlug, count);
            channelSlug = `${channelSlug}-${count}`;
          } else {
            usedSlugs.set(channelSlug, 1);
          }

          const filePath = join(options.outputDir, 'channel', `${channelSlug}.html`);
          await writeHtmlFile(filePath, html);
          successCount++;
        } catch (err) {
          error(`Failed to generate channel ${channel.channel_name}:`, err.message);
          failCount++;
        }
      }));

      processed += channels.length;
      progress(processed, total, 'channels');
    }

    const duration = Date.now() - startTime;
    info(`✓ Channels generated: ${successCount} success, ${failCount} failed (${duration}ms)`);
    return failCount === 0;
  } catch (err) {
    error(`Failed to generate channels:`, err.message);
    return false;
  }
}

// 主函数
async function main() {
  console.log(`
╔═══════════════════════════════════════════╗
║     Static Site Generator v1.0            ║
╚═══════════════════════════════════════════╝
  Origin: ${options.origin}
  Output: ${options.outputDir}
  Type:   ${options.type}
`);

  const startTime = Date.now();
  let success = true;

  try {
    // 确保输出目录存在
    await ensureDir(options.outputDir);
    await ensureDir(join(options.outputDir, 'category'));
    await ensureDir(join(options.outputDir, 'channel'));

    switch (options.type) {
      case 'homepage':
        success = await generateHomepage();
        break;
      case 'categories':
        success = await generateCategories();
        break;
      case 'channels':
        success = await generateChannels();
        break;
      case 'all':
      default:
        success = await generateHomepage() && success;
        success = await generateCategories() && success;
        success = await generateChannels() && success;
        break;
    }
  } catch (err) {
    error(`Unexpected error:`, err.message);
    success = false;
  }

  const duration = Date.now() - startTime;
  console.log(`\nTotal time: ${duration}ms`);

  if (success) {
    info('✓ All tasks completed successfully!');
    process.exit(0);
  } else {
    error('✗ Some tasks failed');
    process.exit(1);
  }
}

main();