// 订阅页面 - 营销专家×设计专家联合设计版
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';
import { HEAD_SCRIPTS } from './components/head-scripts.js';

export const SUBSCRIPTION_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIP会员 - IPTV搜索 | 一个链接，看遍所有频道</title>
  <meta name="description" content="VIP订阅链接导入播放器，一次性搞定所有频道。不再每次手动搜索，收藏的云同步，多设备随意切换。">
  
  <style>
    :root {
      --accent: #d4af37;
      --accent-hover: #c9a227;
      --accent-glow: rgba(212, 175, 55, 0.3);
      --bg: #0a0a0a;
      --bg-card: #141414;
      --bg-elevated: #1a1a1a;
      --border: 1px solid rgba(255,255,255,0.08);
      --border-accent: 1px solid rgba(212,175,55,0.3);
      --text: #fff;
      --text-secondary: rgba(255,255,255,0.7);
      --text-muted: rgba(255,255,255,0.4);
      --success: #22c55e;
      --gold: #ffd700;
      --gradient-hero: linear-gradient(135deg, #0a0a0a 0%, #1a0505 50%, #0a0a0a 100%);
      --gradient-card: linear-gradient(145deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%);
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      overflow-x: hidden;
    }
    body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; }
    
    /* ========== Hero区 ========== */
    .hero-section {
      min-height: 400px;
      padding: 50px 20px 40px;
      background: var(--gradient-hero);
      text-align: center;
      position: relative;
    }
    .hero-section::before {
      content: '';
      position: absolute;
      top: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .container { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
    
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(229,9,9,0.15);
      border: 1px solid rgba(229,9,9,0.4);
      color: var(--accent);
      padding: 10px 20px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 0;
      margin-bottom: 8px;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(229,9,9,0.4); }
      50% { box-shadow: 0 0 0 10px rgba(229,9,9,0); }
    }

    .hero-badge-new { padding: 6px 14px; font-size: 11px; margin-bottom: 16px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(229,9,9,0.1);
      border: 1px solid rgba(229,9,9,0.3);
      color: var(--accent);
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 0;
      margin-bottom: 10px;
    }

    .hero-title {
      font-size: clamp(2rem, 5vw, 3.2rem);
      font-weight: 900;
      line-height: 1.2;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-title span {
      background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-title-large {
      font-size: clamp(2.5rem, 6vw, 3.8rem);
      font-weight: 900;
      line-height: 1.1;
      margin-bottom: 8px;
      letter-spacing: -1px;
    }

    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      margin-bottom: 12px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-subtitle-large {
      font-size: 1.25rem;
      color: var(--text-secondary);
      margin-bottom: 40px;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    .hero-subtitle-hero { margin-bottom: 20px;
      font-size: 1rem;
      color: var(--text-secondary);
      margin-bottom: 12px;
      line-height: 2;
    }

    /* ========== Hero Features ========== */
    .hero-features {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .hero-feature {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      gap: 8px;
      padding: 10px 16px;
      background: rgba(212,175,55,0.06);
      border: 1px solid rgba(212,175,55,0.15);
      color: var(--text-primary);
      font-size: 0.875rem;
      font-weight: 600;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    .hero-feature .feature-icon {
      width: 16px;
      height: 16px;
      color: var(--accent);
      flex-shrink: 0;
      display: inline-block;
      vertical-align: middle;
    }
    .hero-feature .feature-icon svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .hero-feature .feature-text {
      font-size: 0.875rem;
      line-height: 1;
    }
    .hero-feature:hover {
      background: rgba(212,175,55,0.15);
      border-color: rgba(212,175,55,0.4);
      transform: translateY(-2px);
    }

    .hero-feature::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 200%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.6s ease;
    }

    .hero-feature::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      transition: width 0.35s ease;
    }

    .hero-feature:hover::before {
      left: 100%;
    }

    .hero-feature:hover::after {
      width: 80%;
    }

    .hero-feature:hover {
      transform: translateY(-3px);
      border-color: rgba(212, 175, 55, 0.7);
      box-shadow: 0 12px 32px rgba(212, 175, 55, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.1);
    }



    .hero-feature:hover .feature-icon {
      transform: scale(1.1);
    }

    .feature-text {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text);
      letter-spacing: 0.8px;
    }

    .hero-value-box {
      background: var(--gradient-card);
      border: 1px solid var(--border-accent);
      border-radius: 0;
      padding: 18px 24px;
      margin-bottom: 12px;
      text-align: left;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-value-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .hero-value-items {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .hero-value-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }

    .hero-value-item strong {
      color: var(--text);
      font-weight: 600;
    }
    
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 40px;
    }
    .hero-stat {
      text-align: center;
    }
    .hero-stat-value {
      font-size: 2rem;
      font-weight: 900;
      color: var(--accent);
    }
    .hero-stat-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .hero-cta {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 32px;
      background: var(--accent);
      color: white;
      font-size: 1rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s;
      box-shadow: 0 8px 32px rgba(212,175,55,0.4);
    }
    .hero-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(212,175,55,0.5);
      background: var(--accent-hover);
    }
    
    /* ========== 场景展示区 ========== */
    .scene-section {
      padding: 60px 20px;
      background: linear-gradient(180deg, #0d0d0d 0%, var(--bg) 100%);
    }
    .scene-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    @media (max-width: 900px) {
      .scene-grid { grid-template-columns: 1fr; gap: 16px; }
    }
    @media (max-width: 768px) {
      /* Compact hero for mobile */
      .hero-section {
      min-height: 400px; padding: 40px 16px 30px; }
      .hero-title-large { font-size: 1.8rem; }
      .hero-subtitle-hero { font-size: 0.85rem; margin-bottom: 20px; }
      .hero-features { flex-direction: column; gap: 10px; }
      .hero-feature { padding: 5px 10px; font-size: 0.8rem; gap: 5px; align-items: center; }
      .hero-cta { padding: 12px 24px; font-size: 1rem; width: 100%; justify-content: center; }
      
      /* Compact scene section */
      .scene-section { padding: 50px 16px; }
      .scene-card-img { height: 180px; }
      .scene-card-body { padding: 14px 12px; }
      .scene-card-title { font-size: 1rem; }
      .scene-card-desc { font-size: 0.8rem; }
      
      /* Compact comparison table */
      .comparison-table { font-size: 0.85rem; }
      .comparison-table th, .comparison-table td { padding: 10px 8px; }
      
      /* Compact pricing */
      .pricing-wrapper { gap: 16px; }
      .pricing-left { padding: 18px; }
      .pricing-right { padding: 16px; position: static; }
      .selector-group { margin-bottom: 14px; }
      .selector-label { margin-bottom: 8px; font-size: 0.9rem; }
      .select-option { padding: 10px 8px; }
      .select-option .value { font-size: 0.9rem; }
      .select-option .label { font-size: 0.7rem; }
      .select-option .price-tag { font-size: 0.95rem; }
      .select-option .badge { font-size: 0.65rem; padding: 1px 6px; }
      
      /* Compact payment */
      .payment-options { gap: 8px; }
      .payment-option { padding: 10px 12px; }
      .payment-option-icon img { height: 20px; }
      
      /* Compact testimonials */
      .testimonials-section { padding: 50px 16px; }
      .testimonial-card { padding: 14px; }
        .testimonial-name { font-size: 0.9rem; }
      .testimonial-meta { font-size: 0.75rem; }
      .testimonial-text { font-size: 0.85rem; }
      
      /* Compact subscribe button */
      .subscribe-btn { padding: 14px; font-size: 1rem; }
    }
    }
    .scene-card {
      background: var(--gradient-card);
      border: var(--border);
      border-radius: 0;
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
    }
    .scene-card:hover {
      border-color: rgba(212,175,55,0.4);
      transform: translateY(-6px);
      box-shadow: 0 20px 60px rgba(212,175,55,0.15), 0 0 0 1px rgba(212,175,55,0.2);
    }
    .scene-card:hover::before {
      opacity: 1;
    }
    .scene-card-img {
      width: 100%;
      height: 220px;
      object-fit: cover;
      display: block;
      display: block;
      transition: transform 0.5s ease;
    }
    .scene-card:hover .scene-card-img {
      transform: scale(1.05);
    }
    .scene-card-img-wrapper {
      overflow: hidden;
      position: relative;
    }
    .scene-card-img-wrapper::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60%;
      background: linear-gradient(to top, var(--bg-card), transparent);
      pointer-events: none;
    }
    .scene-card-body {
      padding: 18px 16px;
    }
    .scene-card-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(212,175,55,0.12);
      border: 1px solid rgba(212,175,55,0.25);
      color: var(--accent);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .scene-card-title {
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 10px;
      color: var(--text-primary);
      line-height: 1.3;
    }
    .scene-card-desc {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.7;
    }

    /* ========== 对比表共有权益样式 ========== */
    .comparison-table tr.shared {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-muted);
    }
    .comparison-table tr.shared td {
      padding: 10px 16px;
    }
    .comparison-table tr.shared td:first-child {
      border-left: 3px solid var(--text-muted);
      color: var(--text-secondary);
    }
    .comparison-table tr.shared td[class="vip"] {
      border-right: 3px solid var(--text-muted);
    }
    .comparison-table tr.shared .check {
      opacity: 0.6;
    }

    /* ========== 通用区块样式 ========== */
    .section-header {
      text-align: center;
      margin-bottom: 12px;
    }
    .section-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(212,175,55,0.1);
      border: 1px solid rgba(212,175,55,0.2);
      color: var(--accent);
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-radius: 0;
      margin-bottom: 12px;
    }
    .section-title {
      font-size: clamp(1.6rem, 4vw, 2.4rem);
      font-weight: 800;
      margin-bottom: 10px;
    }
    .section-title span {
      background: linear-gradient(135deg, var(--accent) 0%, #c9a227 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .section-desc {
      color: var(--text-secondary);
      font-size: 1.05rem;
      max-width: 600px;
      margin: 0 auto;
    }

    /* ========== 方案区 ========== */
    .solution-section {
      padding: 60px 20px;
      background: linear-gradient(180deg, #0d0d0d 0%, var(--bg) 100%);
    }
    
    .solution-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 12px;
    }
    
    .solution-card {
      background: var(--gradient-card);
      border: var(--border);
      border-radius: 0;
      padding: 20px 18px;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .solution-card:hover {
      transform: translateY(-4px);
      border-color: rgba(212,175,55,0.3);
      box-shadow: 0 16px 48px rgba(212,175,55,0.12);
    }
    .solution-icon {
      font-size: 3rem;
      margin-bottom: 12px;
      display: block;
    }
    .solution-card-title {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .solution-card-text {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
    }
    
    /* ========== 对比表 ========== */
    .comparison-section {
      padding: 60px 20px;
    }
    
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--gradient-card);
      border-radius: 0;
      overflow: hidden;
      border: var(--border);
    }
    .comparison-table th,
    .comparison-table td {
      padding: 18px 24px;
      text-align: left;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .comparison-table th {
      background: rgba(212,175,55,0.1);
      font-weight: 700;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-secondary);
    }
    .comparison-table th.vip {
      background: rgba(212,175,55,0.2);
      color: var(--accent);
    }
    .comparison-table td {
      color: var(--text-secondary);
    }
    .comparison-table td.vip {
      background: rgba(212,175,55,0.05);
      color: var(--text);
      font-weight: 600;
    }
    .comparison-table tr:last-child td {
      border-bottom: none;
    }
    .comparison-table tr:hover td {
      background: rgba(255,255,255,0.02);
    }
    .comparison-table tr:hover td.vip {
      background: rgba(212,175,55,0.08);
    }
    .check { color: var(--success); }
    .cross { color: #ef4444; }
    
    /* ========== 用户评价区 ========== */
    .testimonials-section {
      padding: 60px 20px;
      background: linear-gradient(180deg, var(--bg) 0%, #0d0d0d 100%);
    }
    
    @keyframes scrollTestimonials {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .testimonials-scroll {
      display: flex;
      gap: 12px;
      overflow: hidden;
      scroll-snap-type: none;
      scroll-behavior: auto;
      padding: 20px 0 30px;
      position: relative;
    }
    .testimonials-track {
      display: flex;
      gap: 12px;
      animation: scrollTestimonials 80s linear infinite;
      width: max-content;
    }
    .testimonials-track:hover {
      animation-play-state: paused;
    }
    
    .testimonial-card {
      flex: 0 0 340px;
      scroll-snap-align: start;
      background: var(--gradient-card);
      border: var(--border);
      border-radius: 0;
      padding: 18px;
      transition: all 0.3s ease;
    }
    .testimonial-card:hover {
      border-color: rgba(212,175,55,0.3);
      transform: translateY(-4px);
      box-shadow: 0 16px 48px rgba(212,175,55,0.12);
    }
    
    .testimonial-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 10px;
    }
    .testimonial-info {
      flex: 1;
    }
    .testimonial-name {
      font-weight: 700;
      font-size: 1rem;
      margin-bottom: 2px;
    }
    .testimonial-meta {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .testimonial-verified {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.75rem;
      color: var(--success);
      background: rgba(34,197,94,0.1);
      padding: 2px 8px;
      border-radius: 0;
      margin-top: 4px;
    }
    
    .testimonial-stars {
      color: var(--gold);
      font-size: 16px;
      margin-bottom: 12px;
      letter-spacing: 2px;
    }
    
    .testimonial-text {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.7;
      font-style: italic;
    }
    .testimonial-text::before { content: '"'; font-size: 1.4rem; color: var(--accent); }
    .testimonial-text::after { content: '"'; font-size: 1.4rem; color: var(--accent); }
    
    .testimonials-hint {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-top: 24px;
    }
    
    /* ========== 价格区 ========== */
    .pricing-section {
      padding: 60px 20px;
      background: linear-gradient(180deg, #0d0d0d 0%, var(--bg) 100%);
    }
    
    .pricing-wrapper {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 12px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .pricing-wrapper { grid-template-columns: 1fr; }
    }
    
    .pricing-left {
      background: var(--gradient-card);
      border: var(--border);
      border-radius: 0;
      padding: 18px;
    }
    
    .pricing-header h2 {
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 8px;
    }
    .pricing-header p {
      color: var(--text-secondary);
      margin-bottom: 12px;
    }
    
    .selector-group {
      margin-bottom: 10px;
    }
    .selector-label {
      font-weight: 600;
      margin-bottom: 12px;
      color: var(--text-secondary);
    }
    .selector-bar {
      display: flex;
      gap: 12px;
    }
    .select-option {
      flex: 1;
      padding: 16px 12px;
      background: rgba(255,255,255,0.03);
      border: 2px solid rgba(255,255,255,0.08);
      border-radius: 0;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .select-option:hover {
      border-color: rgba(212,175,55,0.4);
      background: rgba(212,175,55,0.05);
    }
    .select-option.selected {
      border-color: var(--accent);
      background: rgba(212,175,55,0.15);
    }
    .select-option .value {
      font-weight: 700;
      font-size: 1rem;
      display: block;
      margin-bottom: 4px;
    }
    .select-option .label {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .select-option .price-tag {
      display: block;
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--accent);
      margin-top: 6px;
    }
    .select-option .badge {
      display: inline-block;
      background: var(--success);
      color: white;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 0;
      margin-top: 4px;
    }

    /* ========== 主题选择器 ========== */
    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
    }

    /* 续费场景的方案保留提示 */
    .scheme-renewal-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px 16px;
      background: rgba(212, 175, 55, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.25);
      border-radius: 0;
      margin-bottom: 8px;
    }
    .scheme-renewal-icon { font-size: 22px; line-height: 1; flex-shrink: 0; }
    .scheme-renewal-content { flex: 1; min-width: 0; }
    .scheme-renewal-title { font-size: 14px; color: var(--text-primary); margin-bottom: 4px; }
    .scheme-renewal-title strong { color: var(--accent); }
    .scheme-renewal-hint { font-size: 12px; color: var(--text-secondary); }
    .scheme-renewal-hint a { color: var(--accent); text-decoration: none; font-weight: 600; }
    .scheme-renewal-hint a:hover { text-decoration: underline; }
    .theme-card {
      background: rgba(255,255,255,0.03);
      border: 2px solid rgba(255,255,255,0.08);
      border-radius: 0;
      padding: 16px 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .theme-card:hover {
      border-color: rgba(212,175,55,0.4);
      background: rgba(212,175,55,0.05);
    }
    .theme-card.selected {
      border-color: var(--accent);
      background: rgba(212,175,55,0.15);
    }
    .theme-card-name {
      font-weight: 700;
      font-size: 0.95rem;
      margin-bottom: 4px;
    }
    .theme-card-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    
    .pricing-right {
      background: var(--gradient-card);
      border: var(--border-accent);
      border-radius: 0;
      padding: 16px;
      position: sticky;
      top: 100px;
    }
    
    .order-summary h3 {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 8px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      color: var(--text-secondary);
    }
    .summary-row.total {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--text);
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
      margin-top: 16px;
    }
    .summary-row.total span:last-child {
      color: var(--accent);
    }
    
    .payment-methods {
      margin: 24px 0;
    }
    .payment-methods label {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 12px;
      display: block;
    }
    .payment-options {
      display: flex;
      gap: 12px;
    }
    .payment-option {
      padding: 8px 16px;
      background: rgba(255,255,255,0.03);
      border: 2px solid rgba(255,255,255,0.08);
      border-radius: 0;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .payment-option:hover,
    .payment-option.selected {
      border-color: var(--accent);
      background: rgba(212,175,55,0.1);
    }
    .payment-option-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .payment-option-icon img {
      height: 24px;
      width: auto;
      object-fit: contain;
    }
    .payment-option-name {
      font-size: 0.85rem;
      font-weight: 600;
    }
    
    .subscribe-btn {
      width: 100%;
      padding: 18px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 0;
      font-size: 1.1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 10px;
    }
    .subscribe-btn:hover {
      background: var(--accent-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(212,175,55,0.4);
    }
    
    .guarantee-badges {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .guarantee-badges span {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    /* ========== 最终CTA ========== */
    .final-cta {
      padding: 60px 20px;
      text-align: center;
      background: linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 100%);
    }
    .final-cta h2 {
      font-size: clamp(1.6rem, 4vw, 2.2rem);
      font-weight: 800;
      margin-bottom: 10px;
    }
    .final-cta p {
      color: var(--text-secondary);
      margin-bottom: 12px;
    }
    .final-cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: var(--accent);
      color: white;
      padding: 18px 40px;
      border-radius: 0;
      font-size: 1.1rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.3s;
    }
    .final-cta-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 12px 40px rgba(212,175,55,0.5);
    }
    
    @media (max-width: 768px) {
      .pain-grid { grid-template-columns: 1fr; }
      .solution-grid { grid-template-columns: 1fr; }
      .testimonial-card { flex: 0 0 280px; }
    }

    /* ========== 加载遮罩 ========== */
    .loading {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      z-index: 2500;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 12px;
    }
    .loading.show { display: flex; }
    .loading p { color: #fff; font-size: 14px; }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid rgba(255,255,255,0.2);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ========== 支付模态框 ========== */
    .payment-modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(12px);
      z-index: 2000;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .payment-modal.show { display: flex; }
    .payment-content {
      background: var(--bg-secondary);
      border: var(--border);
      border-radius: 0;
      padding: 0;
      max-width: 480px;
      width: 100%;
      animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes modalSlideIn {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .payment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: var(--border);
    }
    .payment-title {
      font-size: 1.2rem; 
      font-weight: 800; 
      margin: 0;
      display: flex; 
      align-items: center; 
      gap: 12px;
      color: var(--text-primary);
    }
    .payment-title::before {
      content: ''; 
      width: 4px; 
      height: 20px;
      background: linear-gradient(180deg, var(--accent) 0%, #c9a227 100%);
      border-radius: 2px;
      flex-shrink: 0;
    }
    .payment-close {
      background: transparent;
      border: var(--border);
      color: var(--text-secondary);
      font-size: 20px; cursor: pointer;
      width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .payment-close:hover { background: var(--bg-hover); color: var(--text-primary); }
    .payment-body { padding: 16px 20px; }
    .qrcode-section {
      border: var(--border);
      padding: 20px; text-align: center; margin-bottom: 12px;
    }
    .qrcode-wrapper {
      background: #fff; padding: 12px;
      display: inline-block; margin-bottom: 8px;
    }
    .modal-qrcode-image { width: 200px; height: 200px; display: block; }
    .qrcode-tip {
      color: var(--text-secondary);
      font-size: 0.85rem; font-weight: 500;
      margin: 0 0 10px 0;
    }
    .payment-method-indicator {
      color: var(--text-secondary); font-size: 0.85rem; margin: 0 0 10px 0;
    }
    .payment-status {
      margin-top: 12px;
      font-size: 13px;
      color: var(--text-muted);
      padding: 6px 12px;
      background: rgba(255,215,0,0.1);
      border: 1px solid rgba(255,215,0,0.3);
      border-radius: 4px;
      display: inline-block;
    }
    .payment-status::before {
      content: ''; width: 8px; height: 8px;
      background: var(--accent); border-radius: 50%;
      animation: statusBlink 1.5s ease-in-out infinite;
    }
    @keyframes statusBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    .payment-info {
      border: var(--border);
      padding: 16px 20px; margin-bottom: 12px;
    }
    .payment-info-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 8px 0; border-bottom: var(--border);
    }
    .payment-info-item:last-child { border-bottom: none; padding-bottom: 0; }
    .payment-info-item:first-child { padding-top: 0; }
    .payment-info-label {
      color: var(--text-secondary); font-size: 0.75rem;
      font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .payment-info-value { font-size: 0.9rem; font-weight: 600; }
    .payment-amount { color: var(--accent); font-size: 1.1rem; font-weight: 800; }
    .payment-footer { padding: 12px 24px 16px; border-top: var(--border); }
    .payment-test-button {
      width: 100%; background: transparent; color: #4CAF50;
      border: 1px solid #4CAF50; padding: 12px;
      font-size: 0.85rem; font-weight: 600; cursor: pointer;
    }

    /* ========== 成功模态框 ========== */
    .success-modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.92);
      backdrop-filter: blur(10px);
      z-index: 3000;
      align-items: center; justify-content: center; padding: 20px;
    }
    .success-modal.show { display: flex; }
    .success-content {
      background: var(--bg-secondary);
      border: 1px solid var(--accent);
      padding: 24px; max-width: 420px; text-align: center;
      position: relative;
    }
    .success-icon { font-size: 60px; margin-bottom: 12px; }
    .success-title { font-size: 1.6rem; font-weight: 800; margin-bottom: 10px; }
    .success-message {
      color: var(--text-secondary); margin-bottom: 8px;
      line-height: 1.6; font-size: 0.95rem;
    }
    .purchase-details {
      border: var(--border); padding: 16px; margin-bottom: 10px;
    }
    .purchase-detail-item {
      display: flex; justify-content: space-between;
      padding: 8px 0; border-bottom: var(--border);
    }
    .purchase-detail-item:last-child { border-bottom: none; }
    .purchase-detail-label { color: var(--text-secondary); font-size: 0.85rem; }
    .purchase-detail-value { font-weight: 600; font-size: 0.85rem; }
    .code-display {
      border: 1px solid var(--border); padding: 14px;
      font-family: 'SF Mono', 'Courier New', monospace;
      font-size: 0.85rem; word-break: break-all;
      margin-bottom: 10px; color: var(--accent);
    }
    .copy-button {
      background: var(--accent); color: #fff; border: none;
      padding: 14px 32px; font-size: 1rem; font-weight: 700;
      cursor: pointer; width: 100%; transition: background 0.2s;
    }
    .copy-button:hover { background: var(--accent-hover); }
    .next-steps {
      margin-top: 18px; padding-top: 14px; border-top: var(--border);
    }
    .next-steps-hint {
      color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 8px;
    }
    .next-steps-link {
      color: var(--accent); font-size: 0.9rem;
      text-decoration: none; font-weight: 600;
    }
    .next-steps-link:hover { text-decoration: underline; }
    .modal-close {
      position: absolute; top: 16px; right: 16px;
      width: 32px; height: 32px;
      background: transparent; border: var(--border);
      color: var(--text-secondary); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; transition: all 0.2s;
    }
    .modal-close:hover { background: var(--bg-hover); color: var(--text-primary); }
  
            /* Help tooltip */
            .help-icon {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 18px;
              height: 18px;
              min-width: 18px;
              border-radius: 50%;
              background: rgba(212,175,55,0.25);
              color: var(--accent);
              font-size: 11px;
              font-weight: 700;
              cursor: help;
              transition: all 0.2s;
              flex-shrink: 0;
              position: relative;
            }
            .help-icon:hover {
              background: rgba(212,175,55,0.5);
              transform: scale(1.15);
            }
            .help-text {
              display: none;
              position: absolute;
              bottom: 24px;
              left: 50%;
              transform: translateX(-50%);
              background: linear-gradient(135deg, #1e1e1e 0%, #141414 100%);
              border: 1px solid rgba(212,175,55,0.6);
              padding: 10px 14px;
              border-radius: 6px;
              font-size: 12px;
              color: var(--text-secondary);
              white-space: normal;
              width: 260px;
              z-index: 10000;
              box-shadow: 0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.3);
              line-height: 1.6;
              pointer-events: auto;
            }
            .help-text::after {
              content: '';
              position: absolute;
              top: 100%;
              left: 50%;
              transform: translateX(-50%);
              border: 6px solid transparent;
              border-top-color: rgba(212,175,55,0.6);
            }
            .help-text::before {
              content: '';
              position: absolute;
              top: 100%;
              left: 50%;
              transform: translateX(-50%);
              border: 5px solid transparent;
              border-top-color: #141414;
              margin-top: -1px;
            }
            .help-icon:hover .help-text {
              display: block;
            }


            .feature-icon svg, .section-tag svg, .guarantee-badges svg, .order-summary h3 svg {
              width: 1em;
              height: 1em;
              display: inline-block;
              vertical-align: middle;
            }
  </style>
</head>
<body>
  ${PAGE_HEADER}
  
  <main>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <h1 class="hero-title-large">
          全站频道<span class="title-highlight">一键订阅</span>
          <br>告别手动搜索烦恼
        </h1>
        <p class="hero-subtitle-hero">海外华人必备 · 直播回看都有 · 支持所有主流播放器</p>
        <div class="hero-features">
          <div class="hero-feature">
            <span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span>
            <span class="feature-text">自动更新</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg></span>
            <span class="feature-text">去除广告</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
            <span class="feature-text">高清稳定</span>
          </div>
        </div>
        <a href="#pricing" class="hero-cta">立即订阅，首月 ¥20 →</a>
      </div>
    </section>
    
    <!-- 场景展示区 -->
    <section class="scene-section">
      <div class="container">
        <div class="section-header" style="text-align:center;margin-bottom:48px;">
          <h2 class="section-title">随时随地，<span>想看就看</span></h2>
          <p class="section-desc">无论在家、外出还是旅行，都能享受极致观剧体验</p>
        </div>
        <div class="scene-grid">
          <div class="scene-card">
            <div class="scene-card-img-wrapper"><img src="/asset_scene_1.png" alt="家庭影院" class="scene-card-img"></div>
            <div class="scene-card-body">
              <span class="scene-card-tag">家庭时光</span>
              <h3 class="scene-card-title">客厅变身私人影院</h3>
              <p class="scene-card-desc">週末一家人围坐客厅，电视大屏看春晚、追热播剧，享受温馨团圆时光</p>
            </div>
          </div>
          <div class="scene-card">
            <div class="scene-card-img-wrapper"><img src="/asset_scene_2.png" alt="外出观看" class="scene-card-img"></div>
            <div class="scene-card-body">
              <span class="scene-card-tag">移动观看</span>
              <h3 class="scene-card-title">通勤路上不无聊</h3>
              <p class="scene-card-desc">地铁上、火车里，手机平板随时看，直播回看都能用，旅途不再枯燥</p>
            </div>
          </div>
          <div class="scene-card">
            <div class="scene-card-img-wrapper"><img src="/asset_scene_3.png" alt="海外生活" class="scene-card-img"></div>
            <div class="scene-card-body">
              <span class="scene-card-tag">海外华人</span>
              <h3 class="scene-card-title">身在海外，心系祖国</h3>
              <p class="scene-card-desc">看央视新闻了解国家大事，看家乡卫视解乡愁，春节晚会一个都不落</p>
            </div>
          </div>
        </div>
      </div>
    </section>
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">升级<span>VIP</span>，畅享所有权益</h2>
        </div>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>功能</th>
              <th>免费版</th>
              <th class="vip">VIP 会员</th>
            </tr>
          </thead>
          <tbody>
            <!-- 共有权益 -->
            <tr class="shared">
              <td>频道更新</td>
              <td><span class="check">✓</span> 每日更新</td>
              <td class="vip"><span class="check">✓</span> 每日更新</td>
            </tr>
            <tr class="shared">
              <td>高清画质</td>
              <td><span class="check">✓</span> 高清流畅</td>
              <td class="vip"><span class="check">✓</span> 超清流畅</td>
            </tr>
            <tr class="shared">
              <td>稳定在线</td>
              <td><span class="check">✓</span> 99% 在线率</td>
              <td class="vip"><span class="check">✓</span> 99.9% 在线率</td>
            </tr>
            <!-- 差异权益 -->
            <tr>
              <td>收藏夹</td>
              <td><span class="cross">✗</span> 本地储存</td>
              <td class="vip"><span class="check">✓</span> 云端同步</td>
            </tr>
            <tr>
              <td>运营商线路匹配</td>
              <td><span class="cross">✗</span> 无</td>
              <td class="vip"><span class="check">✓</span> 有</td>
            </tr>
            <tr>
              <td>VIP专属订阅</td>
              <td><span class="cross">✗</span> 无</td>
              <td class="vip"><span class="check">✓</span> 有</td>
            </tr>
            <tr>
              <td>多设备支持</td>
              <td><span class="cross">✗</span> 无</td>
              <td class="vip"><span class="check">✓</span> 支持</td>
            </tr>
            <tr>
              <td>播放列表定制 <span class="help-icon">?<span class="help-text">支持将用户收藏夹作为云端播放列表，在【账户中心】-【线路选择】设置为【我的收藏】</span></span></td>
              <td><span class="cross">✗</span> 不支持</td>
              <td class="vip"><span class="check">✓</span> 支持</td>
            </tr>
            <tr>
              <td>广告</td>
              <td><span class="cross">✗</span> 有</td>
              <td class="vip"><span class="check">✓</span> 无</td>
            </tr>
            <tr>
              <td>客服极速响应</td>
              <td><span class="cross">✗</span> 无</td>
              <td class="vip"><span class="check">✓</span> 有</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    
    <!-- 用户评价区 -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">来自全球华人的<span>真实反馈</span></h2>
          <p class="section-desc">他们的故事，就是你的体验</p>
        </div>
        <div class="testimonials-scroll">
          <div class="testimonials-track">
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">张先生</div>
                <div class="testimonial-meta">🇺🇸 美国 · 订阅 2 年</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">在美国待了快十年，每年春节最愁的就是看春晚。以前用VPN看国内APP，不是卡就是黑屏。朋友推荐了这个，用APTV导入就能看，画质比之前流畅多了。今年终于不用躲在房间里刷手机了，客厅电视上看一家人守着，感觉挺好的。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">李女士</div>
                <div class="testimonial-meta">🇬🇧 英国 · 订阅 1 年</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">给孩子看湖南卫视、给老人看CCTV，各看各的互不打扰。最满意的是看英超完全不卡，用Tivimate导入很方便。有个小问题是有时段性卡顿，客服回复挺快的，帮我调了线路就好了。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">王先生</div>
                <div class="testimonial-meta">🇨🇦 加拿大 · 订阅 8 个月</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">配置真的超简单，用Televizo导入后直接能看。把链接给爸妈发了过去，他们自己导入就能看。现在每天晚饭后全家一起看新闻联播，特别温馨。就是频道有点多，找自己想看的还得挑一挑。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">陈女士</div>
                <div class="testimonial-meta">📍 北京 · 订阅 3 个月</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">以前在家只能看地方台，现在用APTV能看央视所有频道和湖南卫视。周末全家一起看新闻联播，爸妈可高兴了。用CarPlay在车上也能听广播，挺方便的。就是有时候频道太多要找一会儿。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">刘先生</div>
                <div class="testimonial-meta">📍 上海 · 订阅 1 年</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">在家想看港澳台频道，找了好几个服务都不稳定。这个用Televizo导入就能看，凤凰卫视、阳光卫视都很清晰。偶尔有卡顿，客服响应很快，给我换了线路就好了。性价比高，推荐。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">赵女士</div>
                <div class="testimonial-meta">🇯🇵 日本 · 订阅 1 年</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">在日本工作，平时最喜欢看家乡的新闻和综艺。用GSE Smart IPTV导入后频道很全，连我们省的地面频道都有，就像在家里一样。有时候网速慢会卡一下，但整体体验不错。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">周先生</div>
                <div class="testimonial-meta">🇸🇬 新加坡 · 订阅 3 个月</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★☆</div>
            <p class="testimonial-text">新加坡华人多，办公室同事一起订阅了。5台设备够用，用APTV都很顺。偶尔会小卡顿，但客服响应很快，总体满意。就是感觉价格能再便宜点就好了。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">吴女士</div>
                <div class="testimonial-meta">📍 成都 · 订阅 4 个月</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">四川人喜欢晚上刷剧看综艺，以前只能看地方台。现在用GSE Smart IPTV能看到湖南卫视、浙江卫视的直播，还能回看。用Tivimate体验更好，界面简洁，操作方便。唯一不满的是想找老电影频道有点难。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">郑先生</div>
                <div class="testimonial-meta">🇰🇷 韩国 · 订阅 5 个月</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">在韩国留学，用Tivimate看国内体育比赛很方便。操作简单，室友都在用，我们群里经常一起聊球赛。画质清晰，基本不卡。</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">孙女士</div>
                <div class="testimonial-meta">🇫🇷 法国 · 订阅 7 个月</div>
                <div class="testimonial-verified">✓ 已验证用户</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">在欧洲生活多年，最想念的就是国内春晚和新闻联播。用APTV导入后解决了我的问题，7天无理由退款也让我放心尝试。虽然偶尔有卡顿，但客服态度很好，整体体验不错。就是希望频道能再分类清楚一点。</p>
          </div>
        </div>
          </div>
        <p class="testimonials-hint">自动滚动中 · 悬停暂停</p>
      </div>
    </section>

    <!-- 价格区 -->
    <section class="pricing-section" id="pricing">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">选一个适合你的<span>会员计划</span></h2>
          <p class="section-desc">所有方案均支持7天无理由退款</p>
        </div>
        <div class="pricing-wrapper">
          <div class="pricing-left">
            <div class="selector-group">
              <div class="selector-label">线路选择</div>
              <div class="scheme-renewal-banner" id="schemeRenewalBanner" style="display:none;">
                <div class="scheme-renewal-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></div>
                <div class="scheme-renewal-content">
                  <div class="scheme-renewal-title">你当前是 <strong id="schemeRenewalName">—</strong> 方案</div>
                  <div class="scheme-renewal-hint">续费后保持不变。需要修改请去 <a href="/account">账户页</a>。</div>
                </div>
              </div>
              <div class="theme-grid" id="themeGrid">
                <!-- 动态加载线路 -->
              </div>
            </div>

            <div class="selector-group">
              <div class="selector-label">订阅时长</div>
              <div class="selector-bar" id="durationGrid">
                <div class="select-option selected" onclick="selectDuration(30)">
                  <span class="value">月度</span>
                  <span class="label">30天</span>
                  <span class="price-tag">¥20</span>
                </div>
                <div class="select-option" onclick="selectDuration(90)">
                  <span class="value">季度</span>
                  <span class="label">90天</span>
                  <span class="badge">立省 25%</span>
                  <span class="price-tag">¥45</span>
                </div>
                <div class="select-option" onclick="selectDuration(365)">
                  <span class="value">年度</span>
                  <span class="label">365天</span>
                  <span class="badge">最划算</span>
                  <span class="price-tag">¥168</span>
                </div>
              </div>
            </div>
            
            <div class="selector-group">
              <div class="selector-label">设备数量</div>
              <div class="selector-bar" id="ipGrid">
                <div class="select-option selected" onclick="selectIP(1)">
                  <span class="value">1台</span>
                </div>
                <div class="select-option" onclick="selectIP(2)">
                  <span class="value">2台</span>
                  <span class="label">+¥10/期</span>
                </div>
                <div class="select-option" onclick="selectIP(3)">
                  <span class="value">3台</span>
                  <span class="label">+¥20/期</span>
                </div>
                <div class="select-option" onclick="selectIP(5)">
                  <span class="value">5台</span>
                  <span class="label">+¥30/期</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="pricing-right">
            <div class="order-summary">
              <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M9 11H1l4-4m0 6l-4 4m14-4h8l-4-4m0 6l4 4"/></svg>订单摘要</h3>
              <div class="summary-row">
                <span>基础价格</span>
                <span id="basePrice">¥20.00</span>
              </div>
              <div class="summary-row">
                <span>设备扩展费</span>
                <span id="ipPrice">¥0.00</span>
              </div>
              <div class="summary-row total">
                <span>总计</span>
                <span id="totalPrice">¥20.00</span>
              </div>
            </div>
            
            <div class="payment-methods">
              <label>选择付款方式</label>
              <div class="payment-options">
                <div class="payment-option selected" onclick="selectPayment('alipay')">
                  <div class="payment-option-icon"><img src="/zhifubao.png" alt="支付宝"></div>
                </div>
                <div class="payment-option" id="wechatOption" onclick="selectPayment('wechat')">
                  <div class="payment-option-icon"><img src="/weixin.png" alt="微信支付"></div>
                </div>
                <div class="payment-option" onclick="selectPayment('usdt')">
                  <div class="payment-option-icon"><img src="/usdt.png" alt="USDT"></div>
                </div>
              </div>
            </div>
            
            <p class="theme-hint" id="themeHint" style="display:none;color:var(--accent);font-size:12px;margin-top:8px;"></p>
            <button class="subscribe-btn" onclick="handleSubscribe()">立即订阅</button>
            
            <div class="guarantee-badges">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>安全支付</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>即时开通</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>7天退款</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 最终CTA -->
    <section class="final-cta">
      <div class="container">
        <h2>还在犹豫？试试<span style="color: var(--accent)">7天免费VIP</span></h2>
        <p>注册即送，无需信用卡，体验全部功能后再决定</p>
        <a href="/login#register" class="final-cta-btn">立即注册获取免费VIP →</a>
      </div>
    </section>

  <!-- 加载遮罩 -->
  <div id="loading" class="loading">
    <div class="spinner"></div>
    <p>处理中...</p>
  </div>

  <!-- 支付模态框 -->
  <div id="paymentModal" class="payment-modal">
    <div class="payment-content">
      <div class="payment-header">
        <h2 class="payment-title" id="paymentModalTitle">完成支付</h2>
        <button class="payment-close" onclick="closePaymentModal()">×</button>
      </div>
      <div class="payment-body">
        <div class="qrcode-section">
          <div class="qrcode-wrapper">
            <img id="modalQrcodeImage" class="modal-qrcode-image" src="" alt="支付二维码">
          </div>
          <p class="qrcode-tip" id="modalQrcodeTip">请用支付宝/微信扫码支付</p>
          <p class="payment-method-indicator" id="paymentMethodIndicator"></p>
          <p class="payment-status" id="paymentStatus">等待支付中...</p>

          <!-- USDT 专用：钱包地址 + 金额 -->
          <div id="usdtAddressBox" style="display:none;margin-top:14px;text-align:left;font-size:12px;color:rgba(255,255,255,.85);">
            <div style="margin-bottom:6px;color:rgba(255,255,255,.6);">收款地址 (TRC20 / Tron)</div>
            <div style="display:flex;gap:8px;align-items:center;">
              <code id="usdtAddressText" style="flex:1;background:rgba(0,0,0,.4);padding:8px 10px;border-radius:6px;word-break:break-all;color:#f0c674;"></code>
              <button id="usdtCopyBtn" type="button" style="background:#d4af37;color:#fff;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;font-size:12px;">复制</button>
            </div>
            <div style="margin-top:10px;color:rgba(255,255,255,.6);">应付金额（精确到 0.0001 USDT）</div>
            <div id="usdtAmountText" style="font-size:18px;font-weight:700;color:#f0c674;margin-top:4px;">- USDT</div>
            <div style="margin-top:6px;color:rgba(255,165,0,.85);font-size:11px;">⚠️ 必须按此金额支付，多付/少付都无法识别</div>
          </div>
        </div>
        <div class="payment-info">
          <div class="payment-info-item">
            <span class="payment-info-label">订阅方案</span>
            <span class="payment-info-value" id="paymentPlanName">-</span>
          </div>
          <div class="payment-info-item">
            <span class="payment-info-label">设备数</span>
            <span class="payment-info-value" id="paymentIPCount">-</span>
          </div>
          <div class="payment-info-item">
            <span class="payment-info-label">应付金额</span>
            <span class="payment-info-value payment-amount" id="paymentAmount">-</span>
          </div>
        </div>
      </div>
      <div class="payment-footer">
        <button id="simulatePaymentBtn" class="payment-test-button" style="display: none;" onclick="simulatePaymentSuccess()">[仅测试] 模拟支付成功</button>
      </div>
    </div>
  </div>

  <!-- 成功模态框 -->
  <div id="successModal" class="success-modal">
    <div class="success-content">
      <button class="modal-close" onclick="closeModal()">×</button>
      <div class="success-icon">✓</div>
      <h2 class="success-title">支付成功！</h2>
      <p class="success-message">您的 VIP 订阅已激活。复制下方订阅链接到播放器即可使用。</p>
      <div class="purchase-details">
        <div class="purchase-detail-item">
          <span class="purchase-detail-label">订阅方案</span>
          <span class="purchase-detail-value" id="successPlanName">-</span>
        </div>
        <div class="purchase-detail-item">
          <span class="purchase-detail-label">设备数</span>
          <span class="purchase-detail-value" id="successIPCount">-</span>
        </div>
        <div class="purchase-detail-item">
          <span class="purchase-detail-label">实付金额</span>
          <span class="purchase-detail-value" id="successAmount">-</span>
        </div>
      </div>
      <div class="code-display" id="generatedCode">-</div>
      <button class="copy-button" onclick="copyCode()">复制订阅链接</button>
      <div class="next-steps">
        <p class="next-steps-hint">下一步：</p>
        <a href="/account" class="next-steps-link">前往账户页查看订阅 →</a>
      </div>
    </div>
  </div>
  </main>
  
  ${PAGE_FOOTER}
  
  <script>
    // 价格计算逻辑
    let selectedDuration = { days: 30, basePrice: 20 };
    let selectedIPs = 1;
    let selectedPaymentMethod = 'alipay';
    
    function selectDuration(days) {
      const prices = { 30: 20, 90: 45, 365: 168 };
      selectedDuration = { days, basePrice: prices[days] };
      
      document.querySelectorAll('#durationGrid .select-option').forEach(el => {
        el.classList.remove('selected');
      });
      event.currentTarget.classList.add('selected');
      
      updateOrderSummary();
    }
    
    function selectIP(count) {
      selectedIPs = count;
      
      document.querySelectorAll('#ipGrid .select-option').forEach(el => {
        el.classList.remove('selected');
      });
      event.currentTarget.classList.add('selected');
      
      updateOrderSummary();
    }
    
    function selectPayment(method) {
      selectedPaymentMethod = method;
      
      document.querySelectorAll('.payment-option').forEach(el => {
        el.classList.remove('selected');
      });
      event.currentTarget.classList.add('selected');
    }
    
    function updateOrderSummary() {
      const ipPrice = Math.max(0, (selectedIPs - 1) * 10);
      const totalPrice = selectedDuration.basePrice + ipPrice;
      
      document.getElementById('basePrice').textContent = '¥' + selectedDuration.basePrice.toFixed(2);
      document.getElementById('ipPrice').textContent = '¥' + ipPrice.toFixed(2);
      document.getElementById('totalPrice').textContent = '¥' + totalPrice.toFixed(2);
    }
    
    let selectedTheme = null;
    let isRenewalFlow = false;       // 续费场景：true = 隐藏选择器，方案保持不变
    let availableTopics = [];        // 当前可用的 topic 列表（含 id + name）

    let checkPaymentInterval = null;
    let currentOrderId = null;

    async function loadThemes() {
      try {
        const grid = document.getElementById('themeGrid');
        const isLoggedIn = localStorage.getItem('auth_token');
        const banner = document.getElementById('schemeRenewalBanner');

        // 1. 检测续费场景：调 /api/auth/orders 拿当前 active code 的方案
        if (isLoggedIn) {
          try {
            const ordersResp = await fetch('/api/auth/orders', {
              headers: { 'Authorization': 'Bearer ' + isLoggedIn }
            });
            const ordersData = await ordersResp.json();
            if (ordersResp.ok && ordersData.success && Array.isArray(ordersData.orders)) {
              const completed = ordersData.orders.filter(function (o) { return o.status === 'completed'; });
              const nowMs = Date.now();
              const activeOrder = completed.find(function (o) {
                if (!o.expired_at) return true;
                return new Date(o.expired_at).getTime() > nowMs;
              });
              if (activeOrder) {
                isRenewalFlow = true;
                showRenewalBanner(activeOrder, grid, banner);
                return;
              }
            }
          } catch (e) {
            console.error('Failed to detect renewal:', e);
          }
        }

        // 2. 新订阅场景：从后台加载线路列表
        const response = await fetch('/api/subscription/topics');
        const data = await response.json();
        availableTopics = (data.success && Array.isArray(data.topics)) ? data.topics : [];

        if (availableTopics.length > 0) {
          availableTopics.forEach((topic, index) => {
            const card = document.createElement('div');
            card.className = 'theme-card' + (index === 0 ? ' selected' : '');
            card.onclick = () => selectTheme(topic.id);
            card.dataset.theme = topic.id;
            const desc = topic.description || '精选频道';
            card.innerHTML = '<div class="theme-card-name">' + topic.name + '</div><div class="theme-card-desc">' + desc + '</div>';
            grid.appendChild(card);
          });
        }

        // 3. 如果登录，添加"我的收藏"
        if (isLoggedIn) {
          const favCard = document.createElement('div');
          favCard.className = 'theme-card';
          favCard.dataset.theme = 'favorites';
          favCard.innerHTML = '<div class="theme-card-name">我的收藏</div><div class="theme-card-desc">仅返回您收藏的频道</div>';
          favCard.onclick = () => selectTheme('favorites');
          grid.appendChild(favCard);
        }
      } catch (error) {
        console.error('Failed to load themes:', error);
      }
    }

    function showRenewalBanner(activeOrder, grid, banner) {
      // 先把 topics 也拉一份，用于解析 topic_id → name
      if (availableTopics.length === 0) {
        fetch('/api/subscription/topics').then(function (r) { return r.json(); }).then(function (d) {
          if (d && d.success && Array.isArray(d.topics)) availableTopics = d.topics;
          paintRenewalBanner(activeOrder, grid, banner);
        }).catch(function () { paintRenewalBanner(activeOrder, grid, banner); });
      } else {
        paintRenewalBanner(activeOrder, grid, banner);
      }
    }
    function paintRenewalBanner(activeOrder, grid, banner) {
      let schemeName = '全部频道';
      if (activeOrder.sub_mode === 'favorites') {
        schemeName = '我的收藏';
      } else if (activeOrder.topic_id) {
        const t = availableTopics.find(function (x) { return String(x.id) === String(activeOrder.topic_id); });
        schemeName = t ? t.name : ('Topic #' + activeOrder.topic_id);
      }
      const nameEl = document.getElementById('schemeRenewalName');
      if (nameEl) nameEl.textContent = schemeName;
      if (banner) banner.style.display = '';
      if (grid) grid.style.display = 'none';
      selectedTheme = null;
    }

    function selectTheme(themeId) {
      selectedTheme = themeId;

      document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('selected');
        // 确保类型一致（都是字符串）
        if (card.dataset.theme === themeId.toString()) {
          card.classList.add('selected');
        }
      });

      // 如果是 favorites，添加提示
      const hintEl = document.getElementById('themeHint');
      if (hintEl) {
        if (themeId === 'favorites') {
          hintEl.textContent = '订阅后将只返回您收藏的频道';
          hintEl.style.display = 'block';
        } else {
          hintEl.textContent = '';
          hintEl.style.display = 'none';
        }
      }
    }

    // 页面加载时获取主题列表
    loadThemes();

    async function handleSubscribeUsdt(token, body) {
      try {
        const resp = await fetch('/api/subscription/usdt/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify(body)
        });
        const data = await resp.json();
        if (!resp.ok || !data.success) {
          showToast(data.error || 'USDT 订单创建失败', 'error');
          showLoading(false);
          return;
        }

        // 填充模态框
        const planLabel = (selectedDuration.days === 30 ? '月度' : selectedDuration.days === 90 ? '季度' : selectedDuration.days === 365 ? '年度' : (selectedDuration.days + '天'));
        document.getElementById('paymentPlanName').textContent = planLabel;
        document.getElementById('paymentIPCount').textContent = selectedIPs + ' 台';
        document.getElementById('paymentAmount').textContent = '¥' + (data.amount_cny != null ? data.amount_cny.toFixed(2) : '-');
        document.getElementById('paymentMethodIndicator').innerHTML = '正在使用 <strong>USDT (TRC20)</strong>';
        document.getElementById('modalQrcodeTip').textContent = '请使用支持 TRC20 的钱包扫码 / 转账';

        // 显示 USDT 专属区
        const addrBox = document.getElementById('usdtAddressBox');
        addrBox.style.display = 'block';
        document.getElementById('usdtAddressText').textContent = data.token || '-';
        document.getElementById('usdtAmountText').textContent = (data.amount_usdt != null ? data.amount_usdt : '-') + ' USDT';

        // 二维码：用钱包地址做内容即可（大部分钱包扫码识别）
        const qrcodeImg = document.getElementById('modalQrcodeImage');
        if (data.token) {
          qrcodeImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent('tron:' + data.token);
        } else {
          qrcodeImg.src = '';
        }

        document.getElementById('paymentStatus').textContent = '等待链上确认（最长 1 分钟）...';
        document.getElementById('paymentStatus').style.color = '';
        document.getElementById('paymentModalTitle').textContent = '等待支付';
        document.getElementById('paymentModal').classList.add('show');
        currentOrderId = data.order_id;

        // 复制按钮
        document.getElementById('usdtCopyBtn').onclick = () => {
          navigator.clipboard.writeText(data.token || '').then(() => showToast('地址已复制', 'success'));
        };

        startUsdtOrderCheck(data.order_id, token);
      } catch (e) {
        console.error('USDT subscribe error:', e);
        showToast('网络错误，请重试', 'error');
      } finally {
        showLoading(false);
      }
    }

    function startUsdtOrderCheck(orderId, token) {
      if (checkPaymentInterval) clearInterval(checkPaymentInterval);
      let checkCount = 0;
      const maxChecks = 90; // ~7.5 分钟（每 5 秒）
      checkPaymentInterval = setInterval(async () => {
        checkCount++;
        if (checkCount > maxChecks) {
          clearInterval(checkPaymentInterval);
          document.getElementById('paymentStatus').textContent = '订单已超时，请重新下单';
          return;
        }
        try {
          const r = await fetch('/api/subscription/usdt/check-status?order_id=' + encodeURIComponent(orderId), {
            headers: { 'Authorization': 'Bearer ' + token }
          });
          const j = await r.json();
          if (j.success && j.paid) {
            clearInterval(checkPaymentInterval);
            document.getElementById('paymentStatus').textContent = '✓ 支付成功！';
            document.getElementById('paymentStatus').style.color = '#4CAF50';
            document.getElementById('paymentModalTitle').textContent = '支付成功';
            setTimeout(() => {
              closePaymentModal();
              const subUrl = window.location.origin + '/sub/' + (j.code || '') + '.m3u';
              // 后端 webhook 完成后激活，code 由 user_orders 查得；这里跳转账户页更稳
              window.location.href = '/account?payment=success';
            }, 1500);
          }
        } catch (e) {
          console.error('USDT check error:', e);
        }
      }, 5000);
    }

    async function handleSubscribe() {
      if (!selectedDuration) {
        showToast('请选择订阅方案', 'error');
        return;
      }
      const token = localStorage.getItem('auth_token');
      if (!token) {
        showToast('请先登录', 'error');
        window.location.href = '/login?redirect=/subscription';
        return;
      }

      showLoading(true);

      try {
        const body = {
          duration_days: Number(selectedDuration.days),
          max_ips: Number(selectedIPs),
          // 新订阅才发送；续费场景由后端保留
          topic_id: (!isRenewalFlow && selectedTheme && selectedTheme !== 'favorites') ? Number(selectedTheme) : null,
          sub_mode: (!isRenewalFlow && selectedTheme === 'favorites') ? 'favorites' : null,
        };

        // USDT 走单独端点
        if (selectedPaymentMethod === 'usdt') {
          await handleSubscribeUsdt(token, body);
          return;
        }

        body.payment_method = selectedPaymentMethod || 'alipay';

        const response = await fetch('/api/subscription/xunhupay/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(body)
        });

        const result = await response.json();

        if (result.success && result.payment_data) {
          const price = calculatePrice();
          const planLabel = (selectedDuration.days === 30 ? '月度' : selectedDuration.days === 90 ? '季度' : selectedDuration.days === 365 ? '年度' : (selectedDuration.days + '天'));

          document.getElementById('paymentPlanName').textContent = planLabel;
          document.getElementById('paymentIPCount').textContent = selectedIPs + ' 台';
          document.getElementById('paymentAmount').textContent = '¥' + price.discounted.toFixed(2);

          const methodIndicator = document.getElementById('paymentMethodIndicator');
          const methodName = selectedPaymentMethod === 'wechat' ? '微信支付' : '支付宝';
          methodIndicator.innerHTML = '正在使用 <strong>' + methodName + '</strong>';

          const qrcodeTip = document.getElementById('modalQrcodeTip');
          qrcodeTip.textContent = selectedPaymentMethod === 'wechat' ? '请用微信扫码支付' : '请用支付宝扫码支付';

          const qrcodeImage = document.getElementById('modalQrcodeImage');
          if (result.payment_data.url_qrcode) {
            qrcodeImage.src = result.payment_data.url_qrcode;
          } else {
            qrcodeImage.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(result.payment_data.url || '');
          }

          document.getElementById('paymentStatus').textContent = '⏳ 等待扫码支付...';
          document.getElementById('paymentStatus').style.color = '#ffd700';
          document.getElementById('paymentModalTitle').textContent = '扫码支付';
          document.getElementById('paymentModal').classList.add('show');
          currentOrderId = result.order_id;

          // 本地环境显示测试按钮
          if (isLocalhost()) {
            const simBtn = document.getElementById('simulatePaymentBtn');
            if (simBtn) simBtn.style.display = 'block';
          }

          startOrderCheck(result.order_id);
        } else {
          showToast(result.error || '支付订单创建失败', 'error');
        }
      } catch (error) {
        console.error('Subscription error:', error);
        showToast('网络错误，请重试', 'error');
      } finally {
        showLoading(false);
      }
    }

    function startOrderCheck(orderId) {
      if (checkPaymentInterval) clearInterval(checkPaymentInterval);
      let checkCount = 0;
      const maxChecks = 60;
      const token = localStorage.getItem('auth_token');

      checkPaymentInterval = setInterval(async function () {
        checkCount++;
        if (checkCount > maxChecks) {
          clearInterval(checkPaymentInterval);
          document.getElementById('paymentStatus').textContent = '支付超时';
          return;
        }
        try {
          const response = await fetch('/api/subscription/xunhupay/check-order?order_id=' + encodeURIComponent(orderId), {
            headers: { 'Authorization': 'Bearer ' + token }
          });
          const result = await response.json();

          if (result.success && result.order && result.order.status === 'completed') {
            clearInterval(checkPaymentInterval);
            document.getElementById('paymentStatus').textContent = '支付成功！';
            document.getElementById('paymentStatus').style.color = '#4CAF50';
            document.getElementById('paymentModalTitle').textContent = '支付成功';
            setTimeout(function () {
              closePaymentModal();
              const subUrl = window.location.origin + '/sub/' + result.order.code + '.m3u';
              const price = calculatePrice();
              const planLabel = (selectedDuration.days === 30 ? '月度' : selectedDuration.days === 90 ? '季度' : selectedDuration.days === 365 ? '年度' : (selectedDuration.days + '天'));
              const purchaseDetails = {
                plan: planLabel,
                ips: selectedIPs + ' 台',
                amount: '¥' + price.discounted.toFixed(2)
              };
              showSuccess(subUrl, purchaseDetails);
            }, 1500);
          }
        } catch (error) {
          console.error('Check order error:', error);
        }
      }, 5000);
    }

    async function simulatePaymentSuccess() {
      if (!currentOrderId) {
        showToast('没有待支付的订单', 'error');
        return;
      }
      const token = localStorage.getItem('auth_token');
      try {
        const response = await fetch('/api/subscription/xunhupay/simulate-success?order_id=' + encodeURIComponent(currentOrderId), {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const result = await response.json();
        if (result.success) {
          clearInterval(checkPaymentInterval);
          document.getElementById('paymentStatus').textContent = '支付成功！';
          document.getElementById('paymentStatus').style.color = '#4CAF50';
          document.getElementById('paymentModalTitle').textContent = '支付成功';
          setTimeout(function () {
            closePaymentModal();
            const subUrl = window.location.origin + '/sub/' + result.code + '.m3u';
            const price = calculatePrice();
            const planLabel = (selectedDuration.days === 30 ? '月度' : selectedDuration.days === 90 ? '季度' : selectedDuration.days === 365 ? '年度' : (selectedDuration.days + '天'));
            const purchaseDetails = {
              plan: planLabel,
              ips: selectedIPs + ' 台',
              amount: '¥' + price.discounted.toFixed(2)
            };
            showSuccess(subUrl, purchaseDetails);
          }, 1500);
        } else {
          showToast(result.error || '模拟失败', 'error');
        }
      } catch (error) {
        console.error('Simulate payment error:', error);
        showToast('模拟失败', 'error');
      }
    }

    function calculatePrice() {
      const ipPrice = Math.max(0, (selectedIPs - 1) * 10);
      return { base: selectedDuration.basePrice, ip: ipPrice, discounted: selectedDuration.basePrice + ipPrice };
    }

    function showLoading(show) {
      document.getElementById('loading').classList.toggle('show', show);
    }

    function closePaymentModal() {
      const modal = document.getElementById('paymentModal');
      if (modal) modal.classList.remove('show');
      if (checkPaymentInterval) {
        clearInterval(checkPaymentInterval);
        checkPaymentInterval = null;
      }
    }

    function closeModal() {
      document.getElementById('successModal').classList.remove('show');
    }

    function showSuccess(subUrl, purchaseDetails) {
      if (purchaseDetails) {
        document.getElementById('successPlanName').textContent = purchaseDetails.plan || '-';
        document.getElementById('successIPCount').textContent = purchaseDetails.ips || '-';
        document.getElementById('successAmount').textContent = purchaseDetails.amount || '-';
      }
      document.getElementById('generatedCode').textContent = subUrl;
      document.getElementById('successModal').classList.add('show');
    }

    function copyCode() {
      const code = document.getElementById('generatedCode').textContent;
      navigator.clipboard.writeText(code).then(function () {
        showToast('订阅链接已复制到剪贴板', 'success');
      }).catch(function (err) {
        console.error('Copy failed:', err);
        showToast('复制失败', 'error');
      });
    }

    function isLocalhost() {
      const h = window.location.hostname;
      return h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.') || h.startsWith('10.');
    }
    
    // 初始化
    updateOrderSummary();

    function showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:12px 20px;border-radius:4px;color:#fff;font-size:14px;z-index:9999;animation:fadeIn 0.3s;';
      if (type === 'error') toast.style.background = 'var(--accent)';
      else if (type === 'success') toast.style.background = '#22c55e';
      else toast.style.background = '#3b82f6';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }
  
// 微信支付未配置时隐藏
(function() {
  var wechatOption = document.getElementById('wechatOption');
  if (wechatOption) {
    // 从后端获取配置状态
    fetch('/api/payment-methods').then(function(r) { return r.json(); }).then(function(data) {
      if (!data.wechat) {
        wechatOption.style.display = 'none';
      }
    }).catch(function() {
      // 如果 API 不可用，假设未配置
      wechatOption.style.display = 'none';
    });
  }
})();
</script>
</body>
</html>`;
