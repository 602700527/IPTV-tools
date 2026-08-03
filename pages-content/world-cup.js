// World Cup 2026 IPTV Landing Page
export const pageTitle = 'World Cup 2026 Live Stream - Watch FIFA World Cup Games Free on IPTV';
export const pageDescription = 'Watch World Cup 2026 live streaming free on IPTV. Full match coverage including FIFA World Cup qualifiers, group stages, and finals. No subscription required.';

export const styles = `
:root{
--accent:#ff6b35;
--bg:#0a0a0a;
--bg-card:#141414;
--border:1px solid rgba(255,255,255,0.08);
--text:#fff;
--text-secondary:rgba(255,255,255,0.6);
--radius:0
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-padding-top:70px}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--bg);min-height:100vh;display:flex;flex-direction:column;color:var(--text)}
[data-theme="light"] body{background:#ffffff;color:#0a0a0a}
.main-content{flex:1;width:100%;margin-top:70px;padding:20px 0}
.container{max-width:1200px;margin:0 auto;padding:0 20px}
.page-header{text-align:center;padding:3rem 0 2rem}
.page-header h1{font-size:2.5rem;font-weight:800;margin-bottom:1rem;color:var(--text)}
[data-theme="light"] .page-header h1{color:#0a0a0a}
.page-header p{font-size:1.1rem;color:var(--text-secondary);max-width:600px;margin:0 auto}
[data-theme="light"] .page-header p{color:#666}
.section{margin-bottom:3rem}
.section-title{font-size:1.5rem;font-weight:700;margin-bottom:1.5rem;padding-bottom:0.75rem;border-bottom:var(--border)}
.match-banner{background:linear-gradient(135deg,#1a4f3a 0%,#0d2818 100%);border:2px solid #ff6b35;border-radius:var(--radius);padding:2rem;margin-bottom:2rem;text-align:center}
.match-banner h2{color:#fff;font-size:1.5rem;margin-bottom:0.5rem}
.match-banner p{color:rgba(255,255,255,0.8);font-size:1rem}
.match-banner .match-time{color:#ff6b35;font-weight:700;font-size:1.25rem;margin-top:1rem}
.countdown{display:flex;justify-content:center;gap:2rem;margin:2rem 0;flex-wrap:wrap}
.countdown-item{text-align:center}
.countdown-item .number{font-size:2.5rem;font-weight:800;color:#ff6b35}
.countdown-item .label{font-size:0.85rem;color:var(--text-secondary);text-transform:uppercase}
[data-theme="light"] .countdown-item .label{color:#666}
.feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:0}
.feature-card{background:transparent;border:var(--border);border-radius:var(--radius);padding:1.5rem}
.feature-card h3{font-size:1.1rem;font-weight:600;margin-bottom:0.75rem;color:#ff6b35}
.feature-card p{color:var(--text-secondary);font-size:0.95rem;line-height:1.6}
[data-theme="light"] .feature-card p{color:#666}
.channel-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0}
.channel-item{background:transparent;border:var(--border);border-radius:var(--radius);padding:1rem;display:flex;align-items:center;gap:0.75rem;text-decoration:none}
.channel-item:hover{border-color:#ff6b35}
.channel-item span{font-size:0.9rem;color:var(--text)}
[data-theme="light"] .channel-item span{color:#0a0a0a}
.faq-list{max-width:800px;margin:0 auto}
.faq-item{background:transparent;border:var(--border);border-radius:var(--radius);padding:1.5rem;margin-bottom:0}
.faq-item h3{font-size:1.1rem;font-weight:600;margin-bottom:0.75rem;color:var(--text)}
[data-theme="light"] .faq-item h3{color:#0a0a0a}
.faq-item p{color:var(--text-secondary);line-height:1.7}
[data-theme="light"] .faq-item p{color:#666}
.cta-section{background:transparent;border:var(--border);border-radius:var(--radius);padding:3rem;text-align:center;margin:2rem 0}
.cta-section h2{font-size:1.75rem;font-weight:700;margin-bottom:1rem;color:var(--text)}
[data-theme="light"] .cta-section h2{color:#0a0a0a}
.cta-section p{font-size:1.1rem;opacity:0.9;margin-bottom:1.5rem;color:var(--text-secondary)}
[data-theme="light"] .cta-section p{color:#666}
.cta-btn{display:inline-block;background:#ff6b35;color:#fff;padding:14px 32px;border-radius:var(--radius);font-weight:600;text-decoration:none;transition:transform 0.2s}
.cta-btn:hover{transform:scale(1.02)}
.teams-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1rem;margin-top:1.5rem}
.team-badge{background:var(--bg-card);border:var(--border);border-radius:var(--radius);padding:1rem;text-align:center;font-size:0.9rem;color:var(--text-secondary)}
[data-theme="light"] .team-badge{background:#f5f5f5;color:#666}
@media(max-width:768px){
.main-content{margin-top:80px}
.container{padding:0 16px}
.page-header{padding:2rem 0 1.5rem}
.page-header h1{font-size:1.75rem}
.countdown{gap:1rem}
.countdown-item .number{font-size:1.75rem}
.feature-grid{grid-template-columns:1fr}
.channel-list{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:480px){
.main-content{margin-top:70px}
.container{padding:0 12px}
.page-header{padding:1.5rem 0 1rem}
.page-header h1{font-size:1.4rem}
.page-header p{font-size:0.95rem}
.feature-grid{grid-template-columns:1fr}
.channel-list{grid-template-columns:1fr}
.cta-section{padding:2rem 1rem}
.cta-section h2{font-size:1.4rem}
}
`;

export const content = `
<div class="main-content">
  <div class="container">
    <div class="page-header">
      <h1>🏆 World Cup 2026 Live Stream</h1>
      <p>Watch FIFA World Cup 2026 live matches free on IPTV. Qualifiers, group stages, and finals - all on your favorite devices</p>
    </div>

    <div class="match-banner">
      <h2>🇺🇸🇨🇦🇲🇽 FIFA World Cup 2026</h2>
      <p>United States • Canada • Mexico</p>
      <div class="match-time">June 11 - July 19, 2026</div>
    </div>

    <div class="countdown" id="countdown">
      <div class="countdown-item">
        <div class="number" id="days">--</div>
        <div class="label">Days</div>
      </div>
      <div class="countdown-item">
        <div class="number" id="hours">--</div>
        <div class="label">Hours</div>
      </div>
      <div class="countdown-item">
        <div class="number" id="minutes">--</div>
        <div class="label">Minutes</div>
      </div>
      <div class="countdown-item">
        <div class="number" id="seconds">--</div>
        <div class="label">Seconds</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Why Watch World Cup on IPTV?</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <h3>⚽ Live Match Coverage</h3>
          <p>Watch all World Cup matches live including qualifiers, group stages, quarterfinals, semifinals, and the grand final</p>
        </div>
        <div class="feature-card">
          <h3>📺 Multiple Screen Angles</h3>
          <p>Access sports channels from multiple countries offering different commentary and coverage options</p>
        </div>
        <div class="feature-card">
          <h3>📱 Multi-Device Streaming</h3>
          <p>Watch on Smart TV, phone, tablet, or computer. One subscription works across all your devices</p>
        </div>
        <div class="feature-card">
          <h3>🔄 Auto-Playlist Updates</h3>
          <p>Channel lists update automatically - never miss a match when broadcasters change</p>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Participating Teams (Qualified & Qualifiers)</h2>
      <div class="teams-grid">
        <div class="team-badge">🇺🇸 USA (Host)</div>
        <div class="team-badge">🇨🇦 Canada (Host)</div>
        <div class="team-badge">🇲🇽 Mexico (Host)</div>
        <div class="team-badge">🇧🇷 Brazil</div>
        <div class="team-badge">🇩🇪 Germany</div>
        <div class="team-badge">🇫🇷 France</div>
        <div class="team-badge">🏴󠁧󠁢󠁥󠁮󠁧󠁿 England</div>
        <div class="team-badge">🇦🇷 Argentina</div>
        <div class="team-badge">🇵🇹 Portugal</div>
        <div class="team-badge">🇪🇸 Spain</div>
        <div class="team-badge">🇳🇱 Netherlands</div>
        <div class="team-badge">🇧🇪 Belgium</div>
        <div class="team-badge">🇮🇹 Italy</div>
        <div class="team-badge">🇭🇷 Croatia</div>
        <div class="team-badge">🇺🇾 Uruguay</div>
        <div class="team-badge">🇰🇷 South Korea</div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Sports Channels for World Cup</h2>
      <div id="channelList" class="channel-list">
        <div style="text-align:center;padding:2rem;color:rgba(255,255,255,0.5)">Loading channels...</div>
      </div>
    </div>

    <div class="cta-section">
      <h2>Watch World Cup 2026 Live</h2>
      <p>Get instant access to live sports channels for World Cup and other major football events</p>
      <p style="margin-top:0.5rem;font-size:0.95rem;opacity:0.9;">Updates pushed to your player automatically. Ensure your player has "auto-update playlist" enabled.</p>
      <a href="/plans" class="cta-btn">View Plans →</a>
    </div>
  </div>
</div>
<script>
(function() {
  // Countdown to World Cup 2026 (June 11, 2026)
  function updateCountdown() {
    const target = new Date('2026-06-11T20:00:00Z').getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('days').textContent = '0';
      document.getElementById('hours').textContent = '0';
      document.getElementById('minutes').textContent = '0';
      document.getElementById('seconds').textContent = '0';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Search for World Cup relevant channels using multiple keywords
  var allWorldCupChannels = [];
  var searchKeywords = ['Sports', 'sport', 'ESPN', 'Fox', 'bein', 'football', 'soccer', 'FIFA', 'beIN', 'TNT', 'NBC', 'CBS', 'ABC', 'CBS'];
  var searchCount = 0;
  var channelMap = {};

  function searchWorldCupChannels(keyword) {
    return fetch('/api/search?q=' + encodeURIComponent(keyword) + '&type=channel')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.data && data.data.results) {
          data.data.results.forEach(function(ch) {
            if (!channelMap[ch.hash]) {
              channelMap[ch.hash] = ch;
              allWorldCupChannels.push(ch);
            }
          });
        }
      })
      .catch(function(e) {
        console.log('Search failed for keyword:', keyword);
      });
  }

  // Search for sports-related channels
  Promise.all(searchKeywords.map(searchWorldCupChannels))
    .then(function() {
      var container = document.getElementById('channelList');
      if (allWorldCupChannels.length > 0) {
        // Shuffle and take up to 50
        allWorldCupChannels.sort(function() { return Math.random() - 0.5; });
        allWorldCupChannels = allWorldCupChannels.slice(0, 50);
        container.innerHTML = allWorldCupChannels.map(function(ch) {
          return '<a href="/channel/' + ch.slug + '" class="channel-item"><span>' + ch.name + '</span></a>';
        }).join('');
      } else {
        container.innerHTML = '<p style="color:rgba(255,255,255,0.5);text-align:center;padding:2rem">No sports channels available. Check back later for World Cup coverage.</p>';
      }
    });
})();
</script>
`;