import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';

// 生成网站地图 XML
export function generateSitemap(origin) {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${origin}/activate</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${origin}/privacy-policy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${origin}/terms</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
}

// 生成 robots.txt
export function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# 禁止爬取管理后台
Disallow: /admin/
Disallow: /admin

# 禁止爬取API接口
Disallow: /api/

# 禁止爬取激活页面
Disallow: /activate/

# 网站地图
Sitemap: https://iptv-search.com/sitemap.xml`;
}

// 生成隐私政策页面
export function generatePrivacyPolicy() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>隐私政策 - IPTV Live</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff;line-height:1.6;padding:0;display:flex;flex-direction:column;min-height:100vh}
    .main-content{flex:1;padding-top:70px}
    .container{max-width:900px;margin:0 auto;padding:40px 20px}
    h1{font-size:28px;margin-bottom:20px;color:#e50914}
    h2{font-size:22px;margin:30px 0 15px;color:#fff}
    h3{font-size:18px;margin:20px 0 10px;color:rgba(255,255,255,.9)}
    p{margin-bottom:15px;color:rgba(255,255,255,.8)}
    ul{margin-bottom:15px;padding-left:30px;color:rgba(255,255,255,.8)}
    li{margin-bottom:8px}
    .section{background:#141414;padding:25px;border-radius:8px;margin-bottom:20px;border:1px solid rgba(255,255,255,0.1)}
    .last-updated{color:rgba(255,255,255,.5);font-size:14px;margin-bottom:20px}
    a{color:#e50914;text-decoration:none}
    a:hover{text-decoration:underline}
    @media (max-width:768px){
      .main-content{padding-top:60px}
      .container{padding:30px 15px}
      h1{font-size:24px}
      h2{font-size:20px}
      .section{padding:20px}
    }
    @media (max-width:480px){
      .main-content{padding-top:50px}
      .container{padding:20px 10px}
      h1{font-size:20px}
      h2{font-size:18px}
      .section{padding:15px}
    }
  </style>
</head>
<body>
${PAGE_HEADER}
  <div class="main-content">
    <div class="container">
      <h1>隐私政策</h1>
      <p class="last-updated">最后更新日期：2024年1月1日</p>

      <div class="section">
        <h2>引言</h2>
        <p>IPTV Live（以下简称"我们"）尊重并保护您的隐私权。本隐私政策旨在说明我们如何收集、使用、存储和保护您的个人信息。使用我们的服务即表示您同意本政策的条款。</p>
      </div>

      <div class="section">
        <h2>1. 信息收集</h2>
        <h3>1.1 我们收集的信息类型：</h3>
        <ul>
          <li><strong>浏览信息：</strong>您的IP地址、浏览器类型、设备信息、访问时间和页面浏览记录</li>
          <li><strong>使用信息：</strong>您观看的频道、搜索记录、收藏和播放历史（存储在本地）</li>
          <li><strong>技术信息：</strong>Cookies、Web信标和其他跟踪技术</li>
        </ul>

        <h3>1.2 信息收集方式：</h3>
        <ul>
          <li>自动收集：通过浏览器和服务器日志</li>
          <li>本地存储：通过浏览器 localStorage 存储用户偏好和历史记录</li>
        </ul>
      </div>

      <div class="section">
        <h2>2. 信息使用</h2>
        <p>我们使用收集的信息用于：</p>
        <ul>
          <li>提供、维护和改进我们的服务</li>
          <li>分析用户使用情况，优化用户体验</li>
          <li>防止欺诈、滥用和安全威胁</li>
          <li>符合法律要求和监管义务</li>
        </ul>
      </div>

      <div class="section">
        <h2>3. 信息存储</h2>
        <ul>
          <li>您的观看历史和收藏存储在本地浏览器的 localStorage 中，不会上传到我们的服务器</li>
          <li>服务器日志可能包含IP地址等信息，但不会与个人身份关联</li>
          <li>数据采用行业标准的安全措施进行保护</li>
        </ul>
      </div>

      <div class="section">
        <h2>4. 信息共享</h2>
        <p>我们不会出售、出租或交易您的个人信息。但在以下情况下，我们可能会共享信息：</p>
        <ul>
          <li><strong>服务提供商：</strong>与帮助我们提供服务的第三方共享必要信息（如Cloudflare等）</li>
          <li><strong>法律要求：</strong>响应法律要求、法院命令或政府调查</li>
          <li><strong>业务转让：</strong>在合并、收购或资产转让的情况下</li>
          <li><strong>第三方广告：</strong>我们可能使用第三方广告服务（如Google AdSense），这些服务可能会收集您的浏览信息</li>
        </ul>
      </div>

      <div class="section">
        <h2>5. Cookies</h2>
        <p>我们使用 Cookies 和类似技术来：</p>
        <ul>
          <li>记住您的语言偏好和设置</li>
          <li>分析网站流量和使用模式</li>
          <li>提供个性化内容</li>
        </ul>
        <p>您可以通过浏览器设置禁用 Cookies，但这可能会影响网站的某些功能。</p>
      </div>

      <div class="section">
        <h2>6. 第三方链接</h2>
        <p>我们的网站可能包含指向第三方网站的链接。我们对这些第三方网站的隐私政策和做法不承担任何责任。我们建议您查看这些网站的隐私政策。</p>
      </div>

      <div class="section">
        <h2>7. 数据安全</h2>
        <p>我们采取适当的技术和组织措施来保护您的个人信息免受未经授权的访问、使用或披露。然而，没有任何互联网传输或存储方法是100%安全的。</p>
      </div>

      <div class="section">
        <h2>8. 您的权利</h2>
        <p>根据适用的数据保护法律，您可能拥有以下权利：</p>
        <ul>
          <li>访问和获取您的个人信息副本</li>
          <li>更正不准确的信息</li>
          <li>删除您的个人信息</li>
          <li>反对或限制某些处理活动</li>
          <li>数据可携带性</li>
        </ul>
      </div>

      <div class="section">
        <h2>9. 儿童隐私</h2>
        <p>我们的服务不针对13岁以下的儿童。我们不会故意收集13岁以下儿童的个人信息。如果我们发现收集了此类信息，将立即删除。</p>
      </div>

      <div class="section">
        <h2>10. 国际数据传输</h2>
        <p>您的信息可能会传输到您所在国家或地区以外的国家或地区，并在那里进行处理。这些国家/地区的数据保护法律可能与您所在司法管辖区不同。</p>
      </div>

      <div class="section">
        <h2>11. 政策变更</h2>
        <p>我们可能会不时更新本隐私政策。更新后的政策将在本页面上发布，并更新"最后更新日期"。重大变更时，我们将通过网站通知您。</p>
      </div>

      <div class="section">
        <h2>12. 联系我们</h2>
        <p>如果您对本隐私政策有任何问题或疑虑，请通过以下方式联系我们：</p>
        <ul>
          <li>电子邮件：support@iptv-search.com</li>
          <li>网站：<a href="https://iptv-search.com">https://iptv-search.com</a></li>
        </ul>
      </div>
    </div>
  </div>

${PAGE_FOOTER}
</body>
</html>`;
}

// 生成服务条款页面
export function generateTermsOfService() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>服务条款 - IPTV Live</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;background:#0a0a0a;color:#fff;line-height:1.6;padding:0;display:flex;flex-direction:column;min-height:100vh}
    .main-content{flex:1;padding-top:70px}
    .container{max-width:900px;margin:0 auto;padding:40px 20px}
    h1{font-size:28px;margin-bottom:20px;color:#e50914}
    h2{font-size:22px;margin:30px 0 15px;color:#fff}
    h3{font-size:18px;margin:20px 0 10px;color:rgba(255,255,255,.9)}
    p{margin-bottom:15px;color:rgba(255,255,255,.8)}
    ul{margin-bottom:15px;padding-left:30px;color:rgba(255,255,255,.8)}
    li{margin-bottom:8px}
    .section{background:#141414;padding:25px;border-radius:8px;margin-bottom:20px;border:1px solid rgba(255,255,255,0.1)}
    .last-updated{color:rgba(255,255,255,.5);font-size:14px;margin-bottom:20px}
    a{color:#e50914;text-decoration:none}
    a:hover{text-decoration:underline}
    .warning{background:rgba(231,9,20,.1);border-left:4px solid #e50914;padding:15px;margin:15px 0}
    @media (max-width:768px){
      .main-content{padding-top:60px}
      .container{padding:30px 15px}
      h1{font-size:24px}
      h2{font-size:20px}
      .section{padding:20px}
    }
    @media (max-width:480px){
      .main-content{padding-top:50px}
      .container{padding:20px 10px}
      h1{font-size:20px}
      h2{font-size:18px}
      .section{padding:15px}
    }
  </style>
</head>
<body>
${PAGE_HEADER}
  <div class="main-content">
    <div class="container">
      <h1>服务条款</h1>
      <p class="last-updated">最后更新日期：2024年1月1日</p>

      <div class="section">
        <h2>欢迎使用 IPTV Live</h2>
        <p>感谢您使用 IPTV Live 服务（以下简称"本服务"）。通过使用本服务，您同意遵守以下服务条款。如果您不同意这些条款，请不要使用本服务。</p>
      </div>

      <div class="section">
        <h2>1. 服务说明</h2>
        <h3>1.1 服务内容：</h3>
        <ul>
          <li>IPTV Live 提供免费的在线电视观看服务</li>
          <li>服务包括频道列表、搜索、收藏、播放历史等功能</li>
          <li>用户可以通过网页浏览器访问本服务</li>
        </ul>

        <h3>1.2 服务性质：</h3>
        <ul>
          <li>本服务为免费服务，不收取任何费用</li>
          <li>我们保留随时修改、暂停或终止服务的权利</li>
          <li>服务的可用性可能受到网络状况和技术限制的影响</li>
        </ul>
      </div>

      <div class="section">
        <h2>2. 用户责任</h2>
        <h3>2.1 使用要求：</h3>
        <ul>
          <li>您必须年满13岁才能使用本服务</li>
          <li>您有责任确保您的账户安全</li>
          <li>您不得共享您的账户信息或凭据</li>
        </ul>

        <h3>2.2 禁止行为：</h3>
        <ul>
          <li>不得将本服务用于任何非法目的</li>
          <li>不得干扰或破坏本服务的正常运行</li>
          <li>不得上传病毒、恶意代码或其他有害软件</li>
          <li>不得尝试未经授权访问我们的系统或数据</li>
          <li>不得侵犯他人的知识产权或隐私权</li>
          <li>不得使用自动化工具（如机器人、爬虫）访问本服务</li>
        </ul>
      </div>

      <div class="section">
        <h2>3. 内容版权</h2>
        <div class="warning">
          <strong>重要声明：</strong>
          <p>IPTV Live 仅作为内容聚合平台，提供频道链接服务。本平台不拥有、不制作、不存储任何视频内容。所有频道的版权属于其各自的所有者。</p>
        </div>

        <h3>3.1 知识产权：</h3>
        <ul>
          <li>本网站的界面、设计、文本、图形等受版权保护</li>
          <li>未经许可，不得复制、修改、分发本网站的内容</li>
          <li>频道内容的知识产权属于其原始所有者</li>
        </ul>

        <h3>3.2 用户内容：</h3>
        <ul>
          <li>您对提交的内容保留所有权</li>
          <li>通过使用本服务，您授予我们展示和使用相关内容的权利</li>
          <li>您保证拥有所有必要权利来提交这些内容</li>
        </ul>
      </div>

      <div class="section">
        <h2>4. 免责声明</h2>
        <h3>4.1 服务按"现状"提供：</h3>
        <ul>
          <li>本服务按"现状"和"可用"基础提供</li>
          <li>我们不对服务的准确性、可靠性或完整性做出任何保证</li>
          <li>我们不保证服务不会中断或无错误</li>
        </ul>

        <h3>4.2 间接损失：</h3>
        <p>在任何情况下，我们都不对任何间接、偶然、特殊或后果性损害承担责任，包括但不限于利润损失、数据丢失或业务中断。</p>

        <h3>4.3 第三方内容：</h3>
        <ul>
          <li>我们不对第三方提供的内容或服务承担责任</li>
          <li>频道内容的质量、可用性和准确性由内容提供者负责</li>
          <li>我们不对频道的版权问题负责</li>
        </ul>
      </div>

      <div class="section">
        <h2>5. 服务中断</h2>
        <ul>
          <li>我们保留随时修改、暂停或终止全部或部分服务的权利</li>
          <li>服务中断可能发生在系统维护、升级或不可抗力情况下</li>
          <li>我们不对服务中断造成的损失承担责任</li>
        </ul>
      </div>

      <div class="section">
        <h2>6. 账户与安全</h2>
        <ul>
          <li>您对使用您账户的所有活动负责</li>
          <li>如发现任何未经授权使用您账户的情况，请立即通知我们</li>
          <li>我们不对因用户未能保护其账户而造成的损失负责</li>
        </ul>
      </div>

      <div class="section">
        <h2>7. 隐私保护</h2>
        <p>您的隐私对我们很重要。请查看我们的<a href="/privacy-policy">隐私政策</a>，了解我们如何收集、使用和保护您的个人信息。</p>
      </div>

      <div class="section">
        <h2>8. 适用法律</h2>
        <p>本条款受您所在国家/地区的法律管辖。如果因使用本服务产生任何争议，应通过协商解决。</p>
      </div>

      <div class="section">
        <h2>9. 条款修改</h2>
        <ul>
          <li>我们保留随时修改这些条款的权利</li>
          <li>修改后的条款将在本页面发布</li>
          <li>继续使用本服务即表示您接受修改后的条款</li>
          <li>重大变更将通过网站通知您</li>
        </ul>
      </div>

      <div class="section">
        <h2>10. 终止服务</h2>
        <ul>
          <li>如果您违反这些条款，我们有权暂停或终止您使用本服务的权利</li>
          <li>您可以随时停止使用本服务</li>
          <li>服务终止后，某些条款仍将继续有效</li>
        </ul>
      </div>

      <div class="section">
        <h2>11. 不可抗力</h2>
        <p>我们不对因不可抗力事件导致的服务中断或延迟承担责任，包括但不限于自然灾害、战争、政府行为、网络攻击等。</p>
      </div>

      <div class="section">
        <h2>12. 完整协议</h2>
        <p>这些条款构成您与我们之间关于使用本服务的完整协议。这些条款取代所有先前的协议或谅解。</p>
      </div>

      <div class="section">
        <h2>13. 可分割性</h2>
        <p>如果这些条款的任何条款被认定为不可执行或无效，其余条款仍将保持完全有效和可执行。</p>
      </div>

      <div class="section">
        <h2>14. 联系我们</h2>
        <p>如果您对本服务条款有任何问题或疑虑，请通过以下方式联系我们：</p>
        <ul>
          <li>电子邮件：support@iptv-search.com</li>
          <li>网站：<a href="https://iptv-search.com">https://iptv-search.com</a></li>
        </ul>
      </div>
    </div>
  </div>

${PAGE_FOOTER}
</body>
</html>`;
}
