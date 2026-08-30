// 订阅页面 - 营销专家×设计专家联合设计版
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';
import { HEAD_SCRIPTS } from './components/head-scripts.js';

export const SUBSCRIPTION_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  ${HEAD_SCRIPTS}
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIP Subscription - IPTV Search | One Link to All Channels</title>
  <meta name="description" content="IPTV VIP subscription: unlock thousands of IPTV channels with a single link. Cloud-synced favorites, multi-device switching, ad-free HD streaming. From ¥20/mo.">
  
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
      text-shadow: 0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.1);
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
    .scene-note {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 6px;
      opacity: 0.8;
    }

    /* ========== 对比表共Yes权益样式 ========== */
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
    .discount-code-box {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    .discount-code-box input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.15);
      color: var(--text);
      font-size: 0.9rem;
      border-radius: 0;
    }
    .discount-code-box input:focus {
      outline: none;
      border-color: var(--accent);
    }
    .discount-code-box button {
      padding: 10px 18px;
      background: var(--accent);
      color: #fff;
      border: none;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      border-radius: 0;
    }
    .discount-code-box button:hover {
      background: var(--accent-hover);
    }
    #discountStatus {
      font-size: 0.85rem;
      margin-top: 6px;
    }
    #discountStatus.success { color: #22c55e; }
    #discountStatus.error { color: #ef4444; }
    
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
      border: 1px solid rgba(34, 197, 94, 0.4);
      padding: 32px; max-width: 420px; text-align: center;
      position: relative;
      box-shadow: 0 0 40px rgba(34, 197, 94, 0.15);
    }
    .success-icon { 
      font-size: 64px; 
      margin-bottom: 16px;
      color: #22c55e;
      text-shadow: 0 0 30px rgba(34, 197, 94, 0.5);
    }
    .success-title { 
      font-size: 1.8rem; 
      font-weight: 800; 
      margin-bottom: 12px;
      color: #22c55e;
    }
    .success-message {
      color: rgba(255,255,255,0.7); margin-bottom: 20px;
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
      margin-bottom: 10px; color: #22c55e;
    }
    .copy-button {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); 
      color: #fff; border: none;
      padding: 14px 32px; font-size: 1rem; font-weight: 700;
      cursor: pointer; width: 100%; transition: all 0.2s;
      box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
    }
    .copy-button:hover { 
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 24px rgba(34, 197, 94, 0.4);
    }
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

    /* ============================================================
       Mobile responsive — comprehensive (complements existing rules)
       ============================================================ */
    @media (max-width: 768px) {
      /* Generic sections */
      .section-header { margin-bottom: 24px !important; }
      .section-title { font-size: 1.4rem !important; }
      .section-desc { font-size: 0.85rem; }

      /* Hero */
      .hero-section { min-height: 380px; padding: 32px 16px 24px; }
      .hero-badge { font-size: 10px; padding: 4px 12px; }
      .hero-title-large { font-size: 1.65rem; line-height: 1.15; }
      .hero-subtitle-hero { font-size: 0.85rem; margin-bottom: 18px; }
      .hero-features { flex-direction: column; gap: 8px; align-items: stretch; }
      .hero-feature { padding: 8px 12px; font-size: 0.8rem; gap: 6px; }
      .hero-feature .feature-icon svg { width: 14px; height: 14px; }
      .hero-stats { gap: 14px; flex-wrap: wrap; }
      .hero-stat-value { font-size: 1.6rem; }
      .hero-stat-label { font-size: 0.65rem; }
      .hero-value-box { padding: 14px; }
      .hero-value-title { font-size: 0.95rem; }
      .hero-value-items { font-size: 0.82rem; }
      .hero-cta { padding: 12px 24px; font-size: 0.95rem; width: 100%; justify-content: center; }

      /* Scene */
      .scene-section { padding: 40px 16px; }
      .scene-card-img { height: 180px; }
      .scene-card-body { padding: 14px; }
      .scene-card-title { font-size: 1rem; }
      .scene-card-desc { font-size: 0.82rem; }

      /* Pain + Solution */
      .pain-grid, .solution-grid { grid-template-columns: 1fr; }
      .solution-card { padding: 14px; }

      /* Comparison — KEY FIX: hide 'Free' column on mobile.
         Users decide VIP vs free; the alternative column is
         redundant noise on narrow screens. */
      .comparison-section { padding: 40px 16px; }
      .comparison-table { font-size: 0.82rem; }
      .comparison-table th,
      .comparison-table td { padding: 8px 6px; }
      .comparison-table th:nth-child(2),
      .comparison-table td:nth-child(2) { display: none; }
      .comparison-table th:first-child,
      .comparison-table td:first-child { padding-left: 12px; font-weight: 600; }

      /* Testimonials */
      .testimonials-section { padding: 40px 16px; }
      .testimonial-card { padding: 14px; flex: 0 0 280px; }
      .testimonial-name { font-size: 0.88rem; }
      .testimonial-meta { font-size: 0.72rem; }
      .testimonial-text { font-size: 0.82rem; }
      .testimonials-hint { font-size: 0.7rem; }

      /* Pricing */
      .pricing-section { padding: 40px 16px; }
      .pricing-wrapper { grid-template-columns: 1fr; gap: 14px; }
      .pricing-left,
      .pricing-right { padding: 16px; position: static; }
      .pricing-header h2 { font-size: 1.4rem; }
      .pricing-header p { font-size: 0.85rem; }
      .selector-group { margin-bottom: 12px; }
      .selector-bar { gap: 8px; }
      .select-option { padding: 10px 6px; }
      .select-option .value { font-size: 0.85rem; }
      .select-option .label { font-size: 0.68rem; }
      .select-option .price-tag { font-size: 0.9rem; }
      .select-option .badge { font-size: 0.62rem; padding: 1px 5px; }
      .scheme-renewal-banner { padding: 12px 14px; gap: 10px; }
      .scheme-renewal-title { font-size: 0.85rem; }
      .scheme-renewal-hint { font-size: 0.72rem; }

      /* Theme cards: 2-col on tablet, 1-col on tiny phones (in 480 block) */
      .theme-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
      .theme-card { padding: 12px 8px; }
      .theme-card-name { font-size: 0.82rem; }
      .theme-card-desc { font-size: 0.7rem; }

      /* Order summary */
      .order-summary h3 { font-size: 1rem; }
      .summary-row { font-size: 0.82rem; padding: 6px 0; }
      .discount-code-box input { font-size: 0.82rem; padding: 10px 12px; }
      .discount-code-box button { padding: 10px 14px; font-size: 0.78rem; }
      .payment-options { gap: 8px; }
      .payment-option { padding: 10px 12px; }
      .payment-option-name { font-size: 0.82rem; }
      .payment-option-icon img { height: 20px; }
      .subscribe-btn { padding: 14px; font-size: 1rem; width: 100%; }
      .guarantee-badges { gap: 8px; flex-wrap: wrap; }
      .guarantee-badges span { font-size: 0.7rem; }

      /* Final CTA */
      .final-cta { padding: 40px 16px; }
      .final-cta h2 { font-size: 1.5rem; }
      .final-cta p { font-size: 0.85rem; margin-bottom: 18px; }
      .final-cta-btn { padding: 12px 28px; font-size: 0.95rem; width: 100%; justify-content: center; }
    }

    /* Extra-small phones (iPhone SE 1st gen, etc.) */
    @media (max-width: 480px) {
      .hero-section { min-height: 340px; padding: 24px 14px 18px; }
      .hero-title-large { font-size: 1.4rem; }
      .hero-subtitle-hero { font-size: 0.78rem; }
      .hero-stats { gap: 10px; }
      .hero-stat-value { font-size: 1.4rem; }
      .hero-features { gap: 6px; }
      .hero-feature { padding: 6px 10px; font-size: 0.75rem; }

      .scene-section,
      .testimonials-section,
      .comparison-section,
      .pricing-section,
      .final-cta { padding: 32px 14px; }

      /* Selector options stack vertically on tiny phones —
         3-col side-by-side is too cramped at 360px */
      .selector-bar { flex-direction: column; gap: 6px; }
      .select-option { padding: 12px; }

      .theme-grid { grid-template-columns: 1fr; }
      .pricing-left,
      .pricing-right { padding: 14px; }

      .section-title { font-size: 1.2rem !important; }
      .hero-cta,
      .subscribe-btn,
      .final-cta-btn { font-size: 0.95rem; }
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
          One-Click Subscribe<br>
          <span class="title-highlight">All Channels</span>
        </h1>
        <p class="hero-subtitle-hero">For Overseas Chinese · Live & VOD · Works with All Major Players</p>
        <div class="hero-features">
          <div class="hero-feature">
            <span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></span>
            <span class="feature-text">Auto Updates</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg></span>
            <span class="feature-text">Ad-Free</span>
          </div>
          <div class="hero-feature">
            <span class="feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
            <span class="feature-text">HD & Stable</span>
          </div>
        </div>
        <a href="#pricing" class="hero-cta">Subscribe Now</a>
      </div>
    </section>
    
    <!-- Scene Showcase -->
    <section class="scene-section">
      <div class="container">
        <div class="section-header" style="text-align:center;margin-bottom:48px;">
          <h2 class="section-title">Watch Anywhere,<span>Anytime</span></h2>
          <p class="section-desc">Enjoy premium viewing at home, on the go, or while traveling</p>
        </div>
        <div class="scene-grid">
          <div class="scene-card">
            <div class="scene-card-img-wrapper"><img src="/asset_scene_1.png" alt="Home Theater" class="scene-card-img"></div>
            <div class="scene-card-body">
              <span class="scene-card-tag">Home Cinema</span>
              <h3 class="scene-card-title">Your Living Room, Your Private Cinema</h3>
              <p class="scene-card-desc">Gather around the big screen for Spring Festival Gala, binge-watch hits, and enjoy quality time together</p>
            </div>
          </div>
          <div class="scene-card">
            <div class="scene-card-img-wrapper"><img src="/asset_scene_2.png" alt="Watch on the Go" class="scene-card-img"></div>
            <div class="scene-card-body">
              <span class="scene-card-tag">On the Go</span>
              <h3 class="scene-card-title">Never Bored on Your Commute</h3>
              <p class="scene-card-desc">Watch live TV and catch-up on your phone or tablet during your commute — no more boring trips<span class="scene-note">*Catch-up depends on source and player support</span></p>
            </div>
          </div>
          <div class="scene-card">
            <div class="scene-card-img-wrapper"><img src="/asset_scene_3.png" alt="Overseas Life" class="scene-card-img"></div>
            <div class="scene-card-body">
              <span class="scene-card-tag">Overseas Chinese</span>
              <h3 class="scene-card-title">Stay Connected to Home, No Matter Where</h3>
              <p class="scene-card-desc">Watch CCTV news to stay informed, regional channels for a taste of home, and never miss the Spring Festival Gala</p>
            </div>
          </div>
        </div>
      </div>
    </section>
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Upgrade to <span>VIP</span> for Full Access</h2>
        </div>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Free</th>
              <th class="vip">VIP Member</th>
            </tr>
          </thead>
          <tbody>
            <!-- Exclusive Benefits -->
            <tr class="shared">
              <td>Channel Updates</td>
              <td><span class="check">✓</span> Daily Updates</td>
              <td class="vip"><span class="check">✓</span> Daily Updates</td>
            </tr>
            <tr class="shared">
              <td>HD Quality</td>
              <td><span class="check">✓</span> HD Smooth</td>
              <td class="vip"><span class="check">✓</span> Ultra HD Smooth</td>
            </tr>
            <tr class="shared">
              <td>Online Stability</td>
              <td><span class="check">✓</span> 99% Uptime</td>
              <td class="vip"><span class="check">✓</span> 99.9% Uptime</td>
            </tr>
            <!-- Premium Features -->
            <tr>
              <td>Favorites</td>
              <td><span class="cross">✗</span> Local Storage</td>
              <td class="vip"><span class="check">✓</span> Cloud Sync</td>
            </tr>
            <tr>
              <td>ISP Route Matching</td>
              <td><span class="cross">✗</span> None</td>
              <td class="vip"><span class="check">✓</span> Yes</td>
            </tr>
            <tr>
              <td>VIP Exclusive Subscription</td>
              <td><span class="cross">✗</span> None</td>
              <td class="vip"><span class="check">✓</span> Yes</td>
            </tr>
            <tr>
              <td>Multi-Device Support</td>
              <td><span class="cross">✗</span> None</td>
              <td class="vip"><span class="check">✓</span> Supported</td>
            </tr>
            <tr>
              <td>Playlist Customization <span class="help-icon">?<span class="help-text">Set your favorites as cloud playlists via Account Center > Channel Selection > My Favorites</span></span></td>
              <td><span class="cross">✗</span> Not Available</td>
              <td class="vip"><span class="check">✓</span> Supported</td>
            </tr>
            <tr>
              <td>Ads</td>
              <td><span class="cross">✗</span> Yes</td>
              <td class="vip"><span class="check">✓</span> None</td>
            </tr>
            <tr>
              <td>24/7 Customer Support</td>
              <td><span class="cross">✗</span> None</td>
              <td class="vip"><span class="check">✓</span> Yes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    
    <!-- User Reviews -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">What Our Subscribers Say</h2>
          <p class="section-desc">Real stories from real subscribers around the world</p>
        </div>
        <div class="testimonials-scroll">
          <div class="testimonials-track">
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">Mr. Zhang</div>
                <div class="testimonial-meta">🇺🇸 United States · 2-Year Plan</div>
                <div class="testimonial-verified">✓ Verified Subscriber</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">Lived in the US for nearly a decade. VPN for Chinese apps was always laggy or buffering. A friend recommended this, imported via APTV and the quality is much smoother now. Can watch on the living room TV with my whole family, feels great.</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">Ms. Li</div>
                <div class="testimonial-meta">🇬🇧 United Kingdom · 1-Year Plan</div>
                <div class="testimonial-verified">✓ Verified Subscriber</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">Kids watch Hunan TV, grandparents watch CCTV — everyone happy. Premier League streams are buttery smooth with Tivimate. Only minor buffering issues but support fixed it quickly by switching servers.</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">Mr. Wang</div>
                <div class="testimonial-meta">🇨🇦 Canada · 8-Month Plan</div>
                <div class="testimonial-verified">✓ Verified Subscriber</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">Setup was super easy with Televizo. Shared the link with my parents and they got it working themselves. Now our whole family watches the news together after dinner. Only wish channel organization was better.</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">Ms. Chen</div>
                <div class="testimonial-meta">📍 Beijing · 3-Month Plan</div>
                <div class="testimonial-verified">✓ Verified Subscriber</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">Used to only have local channels at home. Now with APTV I get all CCTV channels and Hunan TV. Family watches news together on weekends and my parents love it. CarPlay radio on the go is convenient too.</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">Mr. Liu</div>
                <div class="testimonial-meta">📍 Shanghai · 1-Year Plan</div>
                <div class="testimonial-verified">✓ Verified Subscriber</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">Was looking for HK/Macau/Taiwan channels everywhere, none were stable. This one works with Televizo — Phoenix and Sun TV are both clear. Support switched servers quickly when there was buffering. Great value.</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">Ms. Zhao</div>
                <div class="testimonial-meta">🇯🇵 Japan · 1-Year Plan</div>
                <div class="testimonial-verified">✓ Verified Subscriber</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">Working in Japan, love watching hometown news and shows. GSE Smart IPTV has all channels including my province local ones — feels like home. Sometimes buffers on slow networks but overall great.</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">Mr. Zhou</div>
                <div class="testimonial-meta">🇸🇬 Singapore · 3-Month Plan</div>
                <div class="testimonial-verified">✓ Verified Subscriber</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★☆</div>
            <p class="testimonial-text">Many Chinese in Singapore, my office colleagues all subscribed. 5 devices is plenty, APTV works smoothly. Occasional small hiccups but responsive support. Just wish the price was a bit lower.</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">Ms. Wu</div>
                <div class="testimonial-meta">📍 Chengdu · 4-Month Plan</div>
                <div class="testimonial-verified">✓ Verified Subscriber</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">Sichuan people love evening dramas and variety shows. Now I can watch Hunan and Zhejiang TV live with GSE, plus replay. Tivimate has the best interface. Only wish older movie channels were easier to find.</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">Mr. Zheng</div>
                <div class="testimonial-meta">🇰🇷 South Korea · 5-Month Plan</div>
                <div class="testimonial-verified">✓ Verified Subscriber</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">Studying in Korea, Tivimate makes watching domestic sports convenient. Easy to set up, roommates use it too, we often chat about matches in our group. Clear quality, rarely buffers.</p>
          </div>
          
          <div class="testimonial-card">
            <div class="testimonial-header">
                <div class="testimonial-info">
                <div class="testimonial-name">Ms. Sun</div>
                <div class="testimonial-meta">🇫🇷 France · 7-Month Plan</div>
                <div class="testimonial-verified">✓ Verified Subscriber</div>
              </div>
            </div>
            <div class="testimonial-stars">★★★★★</div>
            <p class="testimonial-text">Lived in Europe for years, missed Spring Festival Gala and evening news. APTV solved it, and the 7-day refund policy gave me confidence to try. Occasional buffering but great support overall.</p>
          </div>
        </div>
          </div>
        <p class="testimonials-hint">Auto-scrolling · Hover to pause</p>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing-section" id="pricing">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Pick Your <span>Membership Plan</span></h2>
          <p class="section-desc">All plans include a 7-day money-back guarantee</p>
        </div>
        <div class="pricing-wrapper">
          <div class="pricing-left">
            <div class="selector-group">
              <div class="selector-label">Channel Selection</div>
              <div class="scheme-renewal-banner" id="schemeRenewalBanner" style="display:none;">
                <div class="scheme-renewal-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg></div>
                <div class="scheme-renewal-content">
                  <div class="scheme-renewal-title">Your current plan: <strong id="schemeRenewalName">—</strong></div>
                  <div class="scheme-renewal-hint">Stays the same after renewal. To change, visit <a href="/account">Account Page</a>.</div>
                </div>
              </div>
              <div class="theme-grid" id="themeGrid">
                <!-- Dynamic Channel Loading -->
              </div>
            </div>

            <div class="selector-group">
              <div class="selector-label">Subscription Length</div>
              <div class="selector-bar" id="durationGrid">
                <div class="select-option selected" onclick="selectDuration(30)">
                  <span class="value">Monthly</span>
                  <span class="label">30 days</span>
                  <span class="price-tag">¥20</span>
                </div>
                <div class="select-option" onclick="selectDuration(90)">
                  <span class="value">Quarterly</span>
                  <span class="label">90 days</span>
                  <span class="badge">Save 25%</span>
                  <span class="price-tag">¥45</span>
                </div>
                <div class="select-option" onclick="selectDuration(365)">
                  <span class="value">Yearly</span>
                  <span class="label">365 days</span>
                  <span class="badge">Best Value</span>
                  <span class="price-tag">¥168</span>
                </div>
              </div>
            </div>
            
            <div class="selector-group">
              <div class="selector-label">Number of Devices</div>
              <div class="selector-bar" id="ipGrid">
                <div class="select-option selected" onclick="selectIP(1)">
                  <span class="value">1 Device</span>
                </div>
                <div class="select-option" onclick="selectIP(2)">
                  <span class="value">2 Devices</span>
                  <span class="label">+¥10/period</span>
                </div>
                <div class="select-option" onclick="selectIP(3)">
                  <span class="value">3 Devices</span>
                  <span class="label">+¥20/period</span>
                </div>
                <div class="select-option" onclick="selectIP(5)">
                  <span class="value">5 Devices</span>
                  <span class="label">+¥30/period</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="pricing-right">
            <div class="order-summary">
              <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;display:inline-block;vertical-align:middle;margin-right:6px;"><path d="M9 11H1l4-4m0 6l-4 4m14-4h8l-4-4m0 6l4 4"/></svg>Order Summary</h3>
              <div class="summary-row">
                <span>Base Price</span>
                <span id="basePrice">¥20.00</span>
              </div>
              <div class="summary-row">
                <span>Additional Devices</span>
                <span id="ipPrice">¥0.00</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span id="totalPrice">¥20.00</span>
              </div>
              <div class="summary-row" id="discountRow" style="display:none;color:var(--success);">
                <span>Discount Code</span>
                <span id="discountAmount">-¥0.00</span>
              </div>
            </div>
            
            <div class="discount-code-box">
              <input type="text" id="discountCodeInput" placeholder="Enter promo code">
              <button onclick="validateDiscountCode()">Apply</button>
              <span id="discountStatus"></span>
            </div>
            
            <div class="payment-methods">
              <label>Select Payment Method</label>
              <div class="payment-options">
                <div class="payment-option selected" onclick="selectPayment('alipay')">
                  <div class="payment-option-icon"><img src="/zhifubao.png" alt="Alipay"></div>
                </div>
                <div class="payment-option" id="wechatOption" onclick="selectPayment('wechat')">
                  <div class="payment-option-icon"><img src="/weixin.png" alt="WeChat Pay"></div>
                </div>
                <div class="payment-option" onclick="selectPayment('usdt')">
                  <div class="payment-option-icon"><img src="/usdt.png" alt="USDT"></div>
                </div>
              </div>
            </div>
            
            <p class="theme-hint" id="themeHint" style="display:none;color:var(--accent);font-size:12px;margin-top:8px;"></p>
            <button class="subscribe-btn" onclick="handleSubscribe()">Subscribe Now</button>
            
            <div class="guarantee-badges">
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Secure Payment</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>Instant Activation</span>
              <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:4px;"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>7-Day Refund</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Final CTA -->
    <section class="final-cta">
      <div class="container">
        <h2>Still hesitant? Try <span style="color: var(--accent)">7 Days Free VIP</span></h2>
        <p>Free with registration — no credit card required. Try all features before you decide.</p>
        <a href="/login#register" class="final-cta-btn">Sign Up for Free VIP →</a>
      </div>
    </section>

  <!-- Loading Overlay -->
  <div id="loading" class="loading">
    <div class="spinner"></div>
    <p>Processing...</p>
  </div>

  <!-- Payment Modal -->
  <div id="paymentModal" class="payment-modal">
    <div class="payment-content">
      <div class="payment-header">
        <h2 class="payment-title" id="paymentModalTitle">Complete Payment</h2>
        <button class="payment-close" onclick="closePaymentModal()">×</button>
      </div>
      <div class="payment-body">
        <div class="qrcode-section">
          <div class="qrcode-wrapper">
            <img id="modalQrcodeImage" class="modal-qrcode-image" src="" alt="Payment QR Code">
          </div>
          <p class="qrcode-tip" id="modalQrcodeTip">Scan QR code to pay</p>
          <p class="payment-method-indicator" id="paymentMethodIndicator"></p>
          <p class="payment-status" id="paymentStatus">Waiting for payment...</p>

          <!-- USDT: Wallet Address + Amount -->
          <div id="usdtAddressBox" style="display:none;margin-top:14px;text-align:left;font-size:12px;color:rgba(255,255,255,.85);">
            <div style="margin-bottom:6px;color:rgba(255,255,255,.6);">Payment Address (TRC20 / Tron)</div>
            <div style="display:flex;gap:8px;align-items:center;">
              <code id="usdtAddressText" style="flex:1;background:rgba(0,0,0,.4);padding:8px 10px;border-radius:6px;word-break:break-all;color:#f0c674;"></code>
              <button id="usdtCopyBtn" type="button" style="background:#d4af37;color:#fff;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Copy</button>
            </div>
            <div style="margin-top:10px;color:rgba(255,255,255,.6);">Amount Due (exact to 0.0001 USDT)</div>
            <div id="usdtAmountText" style="font-size:18px;font-weight:700;color:#f0c674;margin-top:4px;">- USDT</div>
            <div style="margin-top:6px;color:rgba(255,165,0,.85);font-size:11px;">⚠️ Pay exact amount only; over/under payment cannot be detected</div>
          </div>
        </div>
        <div class="payment-info">
          <div class="payment-info-item">
            <span class="payment-info-label">Plan</span>
            <span class="payment-info-value" id="paymentPlanName">-</span>
          </div>
          <div class="payment-info-item">
            <span class="payment-info-label">Devices</span>
            <span class="payment-info-value" id="paymentIPCount">-</span>
          </div>
          <div class="payment-info-item">
            <span class="payment-info-label">Amount Due</span>
            <span class="payment-info-value payment-amount" id="paymentAmount">-</span>
          </div>
        </div>
      </div>
      <div class="payment-footer">
        <button id="simulatePaymentBtn" class="payment-test-button" style="display: none;" onclick="simulatePaymentSuccess()">[Test Only] Simulate Payment</button>
      </div>
    </div>
  </div>

  <!-- Success Modal -->
  <div id="successModal" class="success-modal">
    <div class="success-content">
      <button class="modal-close" onclick="closeModal()">×</button>
      <div class="success-icon">✓</div>
      <h2 class="success-title">Payment Successful!</h2>
      <p class="success-message">Your VIP subscription is activated. Copy the link below into your player to start watching.</p>
      <div class="purchase-details">
        <div class="purchase-detail-item">
          <span class="purchase-detail-label">Plan</span>
          <span class="purchase-detail-value" id="successPlanName">-</span>
        </div>
        <div class="purchase-detail-item">
          <span class="purchase-detail-label">Devices</span>
          <span class="purchase-detail-value" id="successIPCount">-</span>
        </div>
        <div class="purchase-detail-item">
          <span class="purchase-detail-label">Amount Paid</span>
          <span class="purchase-detail-value" id="successAmount">-</span>
        </div>
      </div>
      <div class="code-display" id="generatedCode">-</div>
      <button class="copy-button" onclick="copyCode()">Copy Subscription Link</button>
      <div class="next-steps">
        <p class="next-steps-hint">Next step:</p>
        <a href="/account" class="next-steps-link">View subscription in your account →</a>
      </div>
    </div>
  </div>
  </main>
  
  ${PAGE_FOOTER}
  
  <script>
    // 价格计算逻辑
    let selectedDuration = { days: 30, basePrice: 20 };
    let appliedDiscount = null;  // { discountAmount, finalAmount }
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
    
    async function validateDiscountCode() {
      const input = document.getElementById('discountCodeInput');
      const status = document.getElementById('discountStatus');
      const code = input.value.trim().toUpperCase();
      
      if (!code) {
        status.textContent = 'Please enter promo code';
        status.className = 'error';
        return;
      }
      
      const ipPrice = Math.max(0, (selectedIPs - 1) * 10);
      const orderAmount = selectedDuration.basePrice + ipPrice;
      
      try {
        const resp = await fetch('/api/subscription/validate-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, amount: orderAmount })
        });
        const result = await resp.json();
        
        if (result.success) {
          appliedDiscount = result;
          status.textContent = '✓ Promo code applied';
          status.className = 'success';
          document.getElementById('discountRow').style.display = 'flex';
          document.getElementById('discountAmount').textContent = '-¥' + result.discountAmount.toFixed(2);
          updateOrderSummary();
        } else {
          appliedDiscount = null;
          status.textContent = result.error || 'Invalid promo code';
          status.className = 'error';
          document.getElementById('discountRow').style.display = 'none';
        }
      } catch (e) {
        status.textContent = 'Validation failed, please retry';
        status.className = 'error';
      }
    }
    
    function updateOrderSummary() {
      const ipPrice = Math.max(0, (selectedIPs - 1) * 10);
      let totalPrice = selectedDuration.basePrice + ipPrice;
      if (appliedDiscount) {
        totalPrice = appliedDiscount.finalAmount;
      }
      
      document.getElementById('basePrice').textContent = '¥' + selectedDuration.basePrice.toFixed(2);
      document.getElementById('ipPrice').textContent = '¥' + ipPrice.toFixed(2);
      document.getElementById('totalPrice').textContent = '¥' + totalPrice.toFixed(2);
    }
    
    let selectedTheme = 0;
    let isRenewalFlow = false;       // renewal flow: true = hide selector, keep plan
    let availableTopics = [];        // currently available topics list (id + name)

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
            // id === 0 is injected by backend as All Channels, selected by default
            const isSelected = topic.id === 0;
            card.className = 'theme-card' + (isSelected ? ' selected' : '');
            card.onclick = () => selectTheme(topic.id);
            card.dataset.theme = topic.id;
            const desc = topic.description || 'Featured Channels';
            card.innerHTML = '<div class="theme-card-name">' + topic.name + '</div><div class="theme-card-desc">' + desc + '</div>';
            grid.appendChild(card);
          });
        }

        // 3. If logged in, add My Favorites
        if (isLoggedIn) {
          const favCard = document.createElement('div');
          favCard.className = 'theme-card';
          favCard.dataset.theme = 'favorites';
          favCard.innerHTML = '<div class="theme-card-name">My Favorites</div><div class="theme-card-desc">Only return your favorited channels</div>';
          favCard.onclick = () => selectTheme('favorites');
          grid.appendChild(favCard);
        }
      } catch (error) {
        console.error('Failed to load themes:', error);
      }
    }

    function showRenewalBanner(activeOrder, grid, banner) {
      // Fetch topics list for topic_id to name resolution
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
      let schemeName = 'All Channels';
      if (activeOrder.sub_mode === 'favorites') {
        schemeName = 'My Favorites';
      } else if (activeOrder.topic_id) {
        const t = availableTopics.find(function (x) { return String(x.id) === String(activeOrder.topic_id); });
        schemeName = t ? t.name : ('Topic #' + activeOrder.topic_id);
      }
      const nameEl = document.getElementById('schemeRenewalName');
      if (nameEl) nameEl.textContent = schemeName;
      if (banner) banner.style.display = '';
      if (grid) grid.style.display = 'none';
      selectedTheme = 0;
    }

    function selectTheme(themeId) {
      selectedTheme = themeId;

      document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('selected');
        // Ensure type consistency (all strings)
        if (card.dataset.theme === themeId.toString()) {
          card.classList.add('selected');
        }
      });

      // If favorites theme, show hint
      const hintEl = document.getElementById('themeHint');
      if (hintEl) {
        if (themeId === 'favorites') {
          hintEl.textContent = 'Subscription will only return your favorited channels';
          hintEl.style.display = 'block';
        } else {
          hintEl.textContent = '';
          hintEl.style.display = 'none';
        }
      }
    }

    // Fetch topic list on page load
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
          showToast(data.error || 'USDT order creation failed', 'error');
          showLoading(false);
          return;
        }

        // Populate modal
        const planLabel = (selectedDuration.days === 30 ? 'Monthly' : selectedDuration.days === 90 ? 'Quarterly' : selectedDuration.days === 365 ? 'Yearly' : (selectedDuration.days + ' days'));
        document.getElementById('paymentPlanName').textContent = planLabel;
        document.getElementById('paymentIPCount').textContent = selectedIPs + ' device(s)';
        document.getElementById('paymentAmount').textContent = '¥' + (data.amount_cny != null ? data.amount_cny.toFixed(2) : '-');
        document.getElementById('paymentMethodIndicator').innerHTML = 'Using <strong>USDT (TRC20)</strong>';
        document.getElementById('modalQrcodeTip').textContent = 'Scan with a TRC20-compatible wallet';

        // Show USDT area
        const addrBox = document.getElementById('usdtAddressBox');
        addrBox.style.display = 'block';
        document.getElementById('usdtAddressText').textContent = data.token || '-';
        document.getElementById('usdtAmountText').textContent = (data.amount_usdt != null ? data.amount_usdt : '-') + ' USDT';

        // QR code: wallet address is sufficient content
        const qrcodeImg = document.getElementById('modalQrcodeImage');
        if (data.token) {
          qrcodeImg.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent('tron:' + data.token);
        } else {
          qrcodeImg.src = '';
        }

        document.getElementById('paymentStatus').textContent = 'Waiting for on-chain confirmation (up to 1 minute)...';
        document.getElementById('paymentStatus').style.color = '';
        document.getElementById('paymentModalTitle').textContent = 'Waiting for Payment';
        document.getElementById('paymentModal').classList.add('show');
        currentOrderId = data.order_id;

        // Copy button
        document.getElementById('usdtCopyBtn').onclick = () => {
          navigator.clipboard.writeText(data.token || '').then(() => showToast('Address copied', 'success'));
        };

        startUsdtOrderCheck(data.order_id, token);
      } catch (e) {
        console.error('USDT subscribe error:', e);
        showToast('Network error, please retry', 'error');
      } finally {
        showLoading(false);
      }
    }

    function startUsdtOrderCheck(orderId, token) {
      if (checkPaymentInterval) clearInterval(checkPaymentInterval);
      let checkCount = 0;
      const maxChecks = 90; // ~15 min (every 10 seconds)
      checkPaymentInterval = setInterval(async () => {
        checkCount++;
        if (checkCount > maxChecks) {
          clearInterval(checkPaymentInterval);
          document.getElementById('paymentStatus').textContent = 'Order has timed out, please place a new order';
          return;
        }
        try {
          const r = await fetch('/api/subscription/usdt/check-status?order_id=' + encodeURIComponent(orderId), {
            headers: { 'Authorization': 'Bearer ' + token }
          });
          const j = await r.json();
          if (j.success && j.paid) {
            clearInterval(checkPaymentInterval);
            document.getElementById('paymentStatus').textContent = '✓ Payment Successful!';
            document.getElementById('paymentStatus').style.color = '#4CAF50';
            document.getElementById('paymentModalTitle').textContent =  'Payment Successful';
            setTimeout(() => {
              closePaymentModal();
              const subUrl = window.location.origin + '/sub/' + (j.code || '') + '.m3u';
              // Backend webhook activates; skip to account page is more reliable
              window.location.href = '/account?payment=success';
            }, 1500);
          }
        } catch (e) {
          console.error('USDT check error:', e);
        }
      }, 10000);
    }

    async function handleSubscribe() {
      if (!selectedDuration) {
        showToast('Please select a subscription plan', 'error');
        return;
      }
      const token = localStorage.getItem('auth_token');
      if (!token) {
        showToast('Please log in first', 'error');
        window.location.href = '/login?redirect=/subscription';
        return;
      }

      showLoading(true);

      try {
        const body = {
          duration_days: Number(selectedDuration.days),
          max_ips: Number(selectedIPs),
          // Only sent for new subscriptions; renewal kept by backend
          topic_id: (!isRenewalFlow && selectedTheme && selectedTheme !== 'favorites' && selectedTheme !== 0) ? Number(selectedTheme) : null,
          sub_mode: (!isRenewalFlow && selectedTheme === 'favorites') ? 'favorites' : null,
          discount_code: appliedDiscount ? document.getElementById('discountCodeInput').value.trim().toUpperCase() : null,
        };

        // USDT uses separate endpoint
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
          const planLabel = (selectedDuration.days === 30 ? 'Monthly' : selectedDuration.days === 90 ? 'Quarterly' : selectedDuration.days === 365 ? 'Yearly' : (selectedDuration.days + ' days'));

          document.getElementById('paymentPlanName').textContent = planLabel;
          document.getElementById('paymentIPCount').textContent = selectedIPs + ' device(s)';
          document.getElementById('paymentAmount').textContent = '¥' + price.discounted.toFixed(2);

          const methodIndicator = document.getElementById('paymentMethodIndicator');
          const methodName = selectedPaymentMethod === 'wechat' ? 'WeChat Pay' : 'Alipay';
          methodIndicator.innerHTML = 'Using <strong>' + methodName + '</strong>';

          const qrcodeTip = document.getElementById('modalQrcodeTip');
          qrcodeTip.textContent = selectedPaymentMethod === 'wechat' ? 'Scan with WeChat' : 'Scan with Alipay';

          const qrcodeImage = document.getElementById('modalQrcodeImage');
          if (result.payment_data.url_qrcode) {
            qrcodeImage.src = result.payment_data.url_qrcode;
          } else {
            qrcodeImage.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(result.payment_data.url || '');
          }

          document.getElementById('paymentStatus').textContent = '⏳ Waiting for payment...';
          document.getElementById('paymentStatus').style.color = '#ffd700';
          document.getElementById('paymentModalTitle').textContent = 'Scan to Pay';
          document.getElementById('paymentModal').classList.add('show');
          currentOrderId = result.order_id;

          // Show test button in local environment
          if (isLocalhost()) {
            const simBtn = document.getElementById('simulatePaymentBtn');
            if (simBtn) simBtn.style.display = 'block';
          }

          startOrderCheck(result.order_id);
        } else {
          showToast(result.error || 'Payment order creation failed', 'error');
        }
      } catch (error) {
        console.error('Subscription error:', error);
        showToast('Network error, please retry', 'error');
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
          document.getElementById('paymentStatus').textContent = 'Payment Timed Out';
          return;
        }
        try {
          const response = await fetch('/api/subscription/xunhupay/check-order?order_id=' + encodeURIComponent(orderId), {
            headers: { 'Authorization': 'Bearer ' + token }
          });
          const result = await response.json();

          if (result.success && result.order && result.order.status === 'completed') {
            clearInterval(checkPaymentInterval);
            document.getElementById('paymentStatus').textContent = 'Payment Successful!';
            document.getElementById('paymentStatus').style.color = '#4CAF50';
            document.getElementById('paymentModalTitle').textContent =  'Payment Successful';
            setTimeout(function () {
              closePaymentModal();
              const subUrl = window.location.origin + '/sub/' + result.order.code + '.m3u';
              const price = calculatePrice();
              const planLabel = (selectedDuration.days === 30 ? 'Monthly' : selectedDuration.days === 90 ? 'Quarterly' : selectedDuration.days === 365 ? 'Yearly' : (selectedDuration.days + ' days'));
              const purchaseDetails = {
                plan: planLabel,
                ips: selectedIPs + ' device(s)',
                amount: '¥' + price.discounted.toFixed(2)
              };
              showSuccess(subUrl, purchaseDetails);
            }, 1500);
          }
        } catch (error) {
          console.error('Check order error:', error);
        }
      }, 10000);
    }

    async function simulatePaymentSuccess() {
      if (!currentOrderId) {
        showToast('No pending payment orders', 'error');
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
          document.getElementById('paymentStatus').textContent = 'Payment Successful!';
          document.getElementById('paymentStatus').style.color = '#4CAF50';
          document.getElementById('paymentModalTitle').textContent =  'Payment Successful';
          setTimeout(function () {
            closePaymentModal();
            const subUrl = window.location.origin + '/sub/' + result.code + '.m3u';
            const price = calculatePrice();
            const planLabel = (selectedDuration.days === 30 ? 'Monthly' : selectedDuration.days === 90 ? 'Quarterly' : selectedDuration.days === 365 ? 'Yearly' : (selectedDuration.days + ' days'));
            const purchaseDetails = {
              plan: planLabel,
              ips: selectedIPs + ' device(s)',
              amount: '¥' + price.discounted.toFixed(2)
            };
            showSuccess(subUrl, purchaseDetails);
          }, 1500);
        } else {
          showToast(result.error || 'Simulation failed', 'error');
        }
      } catch (error) {
        console.error('Simulate payment error:', error);
        showToast('Simulation failed', 'error');
      }
    }

    function calculatePrice() {
      const ipPrice = Math.max(0, (selectedIPs - 1) * 10);
      let discounted = selectedDuration.basePrice + ipPrice;
      if (appliedDiscount) {
        discounted = appliedDiscount.finalAmount;
      }
      return { base: selectedDuration.basePrice, ip: ipPrice, discounted };
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
        showToast('Subscription link copied to clipboard', 'success');
      }).catch(function (err) {
        console.error('Copy failed:', err);
        showToast('Copy failed', 'error');
      });
    }

    function isLocalhost() {
      const h = window.location.hostname;
      return h === 'localhost' || h === '127.0.0.1' || h.startsWith('192.168.') || h.startsWith('10.');
    }
    
    // Initialize
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
  
// Hide WeChat Pay when not configured
(function() {
  var wechatOption = document.getElementById('wechatOption');
  if (wechatOption) {
    // Fetch config status from backend
    fetch('/api/payment-methods').then(function(r) { return r.json(); }).then(function(data) {
      if (!data.wechat) {
        wechatOption.style.display = 'none';
      }
    }).catch(function() {
      // Assume not configured if API unavailable
      wechatOption.style.display = 'none';
    });
  }
})();
</script>
</body>
</html>`;
