// 订阅支付页面HTML
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';


export const SUBSCRIPTION_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title data-i18n-title="pageTitle">Subscription - TV Live Service</title>
  <meta name="description" content="Subscribe to TV Live Service for unlimited access to live TV channels. Choose a plan that fits your needs.">
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="https://iptv-search.com/subscription">
  <link rel="alternate" hreflang="en" href="https://iptv-search.com/subscription">
  <link rel="alternate" hreflang="zh-CN" href="https://iptv-search.com/subscription?lang=zh-CN">
  <link rel="alternate" hreflang="x-default" href="https://iptv-search.com/subscription">
  <meta property="og:title" content="Subscription - TV Live Service">
  <meta property="og:description" content="Subscribe to TV Live Service for unlimited access to live TV channels. Choose a plan that fits your needs.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://iptv-search.com/subscription">
  <meta property="og:image" content="https://iptv-search.com/og-homepage.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="TV Live Service">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Subscription - TV Live Service">
  <meta name="twitter:description" content="Subscribe to TV Live Service for unlimited access to live TV channels. Choose a plan that fits your needs.">
  <meta name="twitter:image" content="https://iptv-search.com/og-homepage.png">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #0a0a0a;
      min-height: 100vh;
      color: #fff;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .header p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }

    .plans-container {
      background: #141414;
      backdrop-filter: blur(20px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 30px;
      margin-bottom: 40px;
    }

    .selection-section {
      margin-bottom: 30px;
    }

    .selection-label {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 15px;
      display: block;
    }

    .option-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }

    .option-card {
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      position: relative;
    }

    .option-card:hover {
      border-color: rgba(229, 9, 20, 0.5);
      background: rgba(229, 9, 20, 0.05);
    }

    .option-card.selected {
      border-color: #e50914;
      background: rgba(229, 9, 20, 0.15);
      box-shadow: 0 0 20px rgba(229, 9, 20, 0.2);
    }

    .option-card.selected::after {
      content: '✓';
      position: absolute;
      top: 8px;
      right: 8px;
      color: #e50914;
      font-size: 16px;
      font-weight: bold;
    }

    .option-title {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }

    .option-subtitle {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
    }

    .option-price {
      font-size: 24px;
      font-weight: 700;
      color: #e50914;
      margin: 10px 0 5px;
    }

    .option-discount {
      display: inline-block;
      background: linear-gradient(135deg, #ffcc00 0%, #ff9500 100%);
      color: white;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 700;
    }

    .payment-summary {
      background: rgba(229, 9, 20, 0.1);
      border: 2px solid #e50914;
      border-radius: 16px;
      padding: 25px;
      margin-bottom: 30px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .summary-row:last-child {
      border-bottom: none;
    }

    .summary-label {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
    }

    .summary-value {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }

    .total-row {
      background: rgba(229, 9, 20, 0.2);
      border-radius: 10px;
      padding: 20px;
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .total-label {
      color: #fff;
      font-size: 18px;
      font-weight: 700;
    }

    .total-price {
      font-size: 36px;
      font-weight: 700;
      color: #e50914;
    }

    .ip-selector {
      margin-bottom: 20px;
    }

    .ip-selector label {
      display: block;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .ip-selector select {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .ip-selector select:focus {
      outline: none;
      border-color: #e50914;
    }

    .payment-section {
      background: #141414;
      backdrop-filter: blur(20px);
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 40px 30px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }

    .payment-methods {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .payment-method-tab {
      background: rgba(255, 255, 255, 0.05);
      border: 2px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 12px 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .payment-method-tab:hover {
      border-color: rgba(229, 9, 20, 0.5);
      background: rgba(229, 9, 20, 0.05);
    }

    .payment-method-tab.active {
      border-color: #e50914;
      background: rgba(229, 9, 20, 0.15);
    }

    .payment-method-icon {
      width: 24px;
      height: 24px;
      display: inline-block;
      flex-shrink: 0;
    }

    .payment-method-icon svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .payment-method-name {
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }



    .qrcode-container {
      display: none;
      background: white;
      padding: 20px;
      border-radius: 12px;
      margin: 0 auto;
    }

    .qrcode-container.show {
      display: block;
    }

    .qrcode-image {
      width: 200px;
      height: 200px;
      border: none;
    }

    .qrcode-tip {
      color: #333;
      font-size: 14px;
      margin-top: 15px;
      text-align: center;
    }

    .success-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }

    .success-modal.show {
      display: flex;
    }

    .success-content {
      background: #141414;
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 40px;
      max-width: 400px;
      text-align: center;
      border: 2px solid #34c759;
      box-shadow: 0 20px 60px rgba(52, 199, 89, 0.3);
    }

    .success-icon {
      font-size: 60px;
      margin-bottom: 20px;
    }

    .success-title {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }

    .success-message {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .code-display {
      background: rgba(229, 9, 20, 0.1);
      border: 2px solid #e50914;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 15px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      word-break: break-all;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .copy-button {
      background: #e50914;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
      -webkit-tap-highlight-color: transparent;
    }

    .copy-button:hover {
      background: #f7262c;
    }

    .close-button {
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 12px 30px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
      -webkit-tap-highlight-color: transparent;
    }

    .close-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .copy-message {
      padding: 12px 16px;
      border-radius: 10px;
      margin-top: 12px;
      font-size: 14px;
      text-align: center;
      display: none;
    }

    .copy-message.success {
      background: rgba(52, 199, 89, 0.15);
      border: 1px solid rgba(52, 199, 89, 0.3);
      color: #34c759;
      display: block;
    }

    .copy-message.error {
      background: rgba(255, 59, 48, 0.15);
      border: 1px solid rgba(255, 59, 48, 0.3);
      color: #ff3b30;
      display: block;
    }

    .modal-tips {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-tip {
      color: rgba(255, 255, 255, 0.6);
      font-size: 13px;
      line-height: 1.6;
      margin-bottom: 8px;
    }

    .modal-tip:last-child {
      margin-bottom: 0;
    }

    .modal-tip-highlight {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      margin-top: 12px;
    }

    .modal-close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-size: 20px;
      line-height: 1;
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.9);
    }

    .loading {
      display: none;
      text-align: center;
      padding: 40px;
    }

    .loading.show {
      display: block;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #e50914;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 15px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-message {
      background: rgba(255, 59, 48, 0.15);
      border: 1px solid rgba(255, 59, 48, 0.3);
      border-radius: 10px;
      padding: 15px;
      margin: 20px auto;
      max-width: 400px;
      text-align: center;
      color: #ff3b30;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .plans-container {
        padding: 15px;
      }

      .option-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }

      .option-card {
        padding: 15px;
      }

      .option-title {
        font-size: 14px;
      }

      .option-price {
        font-size: 20px;
      }

      .payment-summary {
        padding: 15px;
      }

      .summary-row {
        padding: 10px 0;
      }

      .total-row {
        padding: 15px;
      }

      .total-price {
        font-size: 28px;
      }

      .container {
        padding: 15px 10px;
      }

      .header h1 {
        font-size: 24px;
      }

      .lang-switch {
        top: 15px;
        right: 15px;
      }

      .lang-btn {
        padding: 6px 14px;
        font-size: 12px;
      }

      .lang-switch {
        top: 15px;
        right: 15px;
      }

      .lang-btn {
        padding: 6px 14px;
        font-size: 12px;
      }
    }

    body {
      padding-top: 70px !important;
    }

    @media (max-width: 768px) {
      body {
        padding-top: 60px !important;
      }
    }

    @media (max-width: 480px) {
      body {
        padding-top: 50px !important;
      }
    }

    /* 支付弹窗样式 */
    .payment-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(12px);
      z-index: 2000;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow-y: auto;
    }

    .payment-modal.show {
      display: flex;
    }

    .payment-content {
      background: linear-gradient(135deg, #1e1e1e 0%, #0a0a0a 100%);
      border-radius: 24px;
      padding: 0;
      max-width: 480px;
      width: 100%;
      margin: auto;
      border: 1px solid rgba(229, 9, 20, 0.2);
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
      animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .payment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(184, 29, 36, 0.05) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px 24px 0 0;
    }

    .payment-title {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .payment-title::before {
      content: '';
      width: 4px;
      height: 18px;
      background: linear-gradient(180deg, #e50914 0%, #ff3b30 100%);
      border-radius: 2px;
    }

    .payment-close {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.6);
      font-size: 20px;
      cursor: pointer;
      padding: 8px;
      width: 32px;
      height: 32px;
      border-radius: 10px;
      line-height: 1;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .payment-close:hover {
      background: rgba(229, 9, 20, 0.2);
      color: #fff;
      border-color: rgba(229, 9, 20, 0.3);
      transform: rotate(90deg);
    }

    .payment-body {
      padding: 24px;
    }

    .payment-info {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 20px;
    }

    .payment-info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .payment-info-item:last-child {
      border-bottom: none;
      padding-bottom: 6px;
    }

    .payment-info-item:first-child {
      padding-top: 6px;
    }

    .payment-info-label {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .payment-info-value {
      color: #fff;
      font-size: 14px;
      font-weight: 600;
    }

    .payment-amount {
      color: #e50914;
      font-size: 20px;
      font-weight: 800;
      text-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
    }

    .qrcode-section {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 24px;
      text-align: center;
      margin-bottom: 20px;
    }

    .qrcode-wrapper {
      background: #fff;
      padding: 12px;
      border-radius: 16px;
      display: inline-block;
      margin-bottom: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .modal-qrcode-image {
      width: 200px;
      height: 200px;
      border: none;
      display: block;
    }

    .qrcode-tip {
      color: rgba(255, 255, 255, 0.7);
      font-size: 13px;
      font-weight: 500;
      margin: 0 0 12px 0;
    }

    .payment-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #e50914;
      font-size: 13px;
      font-weight: 700;
      padding: 8px 16px;
      background: rgba(229, 9, 20, 0.1);
      border-radius: 25px;
      border: 1px solid rgba(229, 9, 20, 0.2);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(229, 9, 20, 0.3);
      }
      50% {
        box-shadow: 0 0 0 8px rgba(229, 9, 20, 0);
      }
    }

    .payment-status::before {
      content: '';
      width: 8px;
      height: 8px;
      background: #e50914;
      border-radius: 50%;
      animation: statusBlink 1.5s ease-in-out infinite;
    }

    @keyframes statusBlink {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.3;
      }
    }

    .payment-footer {
      padding: 16px 24px 24px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .payment-close-button {
      width: 100%;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
      color: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 16px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .payment-close-button:hover {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.25);
      transform: translateY(-1px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    }

    .payment-close-button:active {
      transform: translateY(0);
    }

    @media (max-width: 600px) {
      .payment-content {
        max-width: 95%;
        border-radius: 20px;
      }

      .payment-body {
        padding: 20px 18px;
      }

      .payment-header {
        padding: 18px 20px;
        border-radius: 20px 20px 0 0;
      }

      .payment-title {
        font-size: 16px;
      }

      .payment-info {
        padding: 16px;
        margin-bottom: 18px;
      }

      .qrcode-section {
        padding: 20px 18px;
        margin-bottom: 18px;
      }

      .modal-qrcode-image {
        width: 180px;
        height: 180px;
      }

      .qrcode-wrapper {
        padding: 10px;
        margin-bottom: 12px;
      }

      .qrcode-tip {
        font-size: 12px;
        margin-bottom: 10px;
      }

      .payment-status {
        font-size: 12px;
        padding: 6px 14px;
      }

      .payment-footer {
        padding: 12px 20px 20px 20px;
      }
    }

    @media (max-width: 480px) {
      .payment-content {
        max-width: 98%;
        border-radius: 16px;
      }

      .payment-header {
        padding: 16px;
      }

      .payment-title {
        font-size: 15px;
      }

      .payment-body {
        padding: 18px 16px;
      }

      .payment-info {
        padding: 14px;
        margin-bottom: 16px;
      }

      .payment-info-label {
        font-size: 11px;
      }

      .payment-info-value {
        font-size: 13px;
      }

      .payment-amount {
        font-size: 18px;
      }

      .qrcode-section {
        padding: 18px 16px;
        margin-bottom: 16px;
      }

      .modal-qrcode-image {
        width: 160px;
        height: 160px;
      }

      .qrcode-wrapper {
        padding: 8px;
        margin-bottom: 10px;
      }

      .qrcode-tip {
        font-size: 11px;
        margin-bottom: 8px;
      }

      .payment-status {
        font-size: 11px;
        padding: 6px 12px;
      }

      .payment-hint {
        background: rgba(255, 204, 0, 0.1);
        border: 1px solid rgba(255, 204, 0, 0.3);
        border-radius: 8px;
        padding: 8px 12px;
        margin-top: 10px;
        font-size: 11px;
        color: #ffcc00;
        line-height: 1.4;
      }

      .payment-footer {
        padding: 10px 16px 18px 16px;
      }
    }
  </style>

</head>
<body>
  ${PAGE_HEADER}


  <div class="container">
    <div class="header">
      <h1 data-i18n="title">👑 Premium Subscription</h1>
      <p data-i18n="subtitle">Choose the perfect plan for your HD streaming needs</p>
    </div>

    <div id="plansContainer" class="plans-container">
      <!-- 时长和IP选择器将通过JS动态生成 -->
    </div>

    <div class="payment-summary" id="paymentSummary">
      <!-- 价格汇总将通过JS动态生成 -->
    </div>

    <div class="payment-section" id="paymentSection">
      <div class="payment-methods">
        <!-- 支付方式将通过 JS 动态加载 -->
      </div>

      <div id="xunhupay-button-container" style="margin: 20px 0;">
        <button id="pay-button" onclick="handlePayClick()" style="background: #e50914; color: white; border: none; padding: 16px 40px; border-radius: 12px; cursor: pointer; font-size: 18px; font-weight: 600; transition: all 0.3s; width: 100%; max-width: 300px;">
          Pay Now
        </button>
      </div>

      <div id="loading" class="loading">
      <div class="spinner"></div>
      <p data-i18n="processing">Processing...</p>
    </div>

    <div id="errorMessage" class="error-message" style="display: none;"></div>
  </div>

  <div id="successModal" class="success-modal">
    <div class="success-content">
      <button class="modal-close" onclick="closeModal()">×</button>
      <div class="success-icon">🎉</div>
      <h2 class="success-title" data-i18n="paymentSuccess">Payment Successful!</h2>
      <p class="success-message" data-i18n="subUrlGenerated">Your subscription URL has been generated</p>
      <div class="code-display" id="generatedCode" style="font-size: 14px; word-break: break-all;">-</div>
      <button class="copy-button" onclick="copyCode()" data-i18n="copyUrl">Copy Subscription URL</button>
      <div class="copy-message" id="copyMessage"></div>
      <div style="text-align: center; margin-top: 15px;">
        <a href="/tutorial" style="display: inline-flex; align-items: center; gap: 8px; color: rgba(255, 255, 255, 0.7); text-decoration: none; font-size: 14px; transition: all 0.2s;" onmouseover="this.style.color='#e50914'" onmouseout="this.style.color='rgba(255, 255, 255, 0.7)'">
          <span>📺</span>
          <span style="text-decoration: underline;">How to add to player</span>
        </a>
      </div>
      <div class="modal-tips">
        <p class="modal-tip">You can add this subscription URL directly to your player</p>
        <p class="modal-tip-highlight">You can view order details in your account page after closing this window</p>
      </div>
    </div>
  </div>

  <div id="paymentModal" class="payment-modal">
    <div class="payment-content">
      <div class="payment-header">
        <h2 class="payment-title" id="paymentModalTitle">Scan to Pay</h2>
        <button class="payment-close" onclick="closePaymentModal()">×</button>
      </div>
      <div class="payment-body">
        <div class="qrcode-section">
          <div class="qrcode-wrapper">
            <img id="modalQrcodeImage" class="modal-qrcode-image" src="" alt="Payment QR Code">
          </div>
          <p class="qrcode-tip" id="modalQrcodeTip" data-i18n="scanQrcode">Scan QR code to pay</p>
          <!-- 支付提示 -->
          <p class="payment-hint" id="paymentHint"></p>
          <p class="payment-status" id="paymentStatus">Waiting for payment...</p>
        </div>
        <div class="payment-info">
          <div class="payment-info-item">
            <span class="payment-info-label">Plan</span>
            <span class="payment-info-value" id="paymentPlanName">-</span>
          </div>
          <div class="payment-info-item">
            <span class="payment-info-label">IPs</span>
            <span class="payment-info-value" id="paymentIPCount">-</span>
          </div>
          <div class="payment-info-item">
            <span class="payment-info-label">Payment</span>
            <span class="payment-info-value" id="paymentMethod">-</span>
          </div>
          <div class="payment-info-item">
            <span class="payment-info-label">Amount</span>
            <span class="payment-info-value payment-amount" id="paymentAmount">-</span>
          </div>
        </div>
      </div>
      <div class="payment-footer">
        <!-- 调试：模拟支付成功按钮（仅开发环境显示） -->
        <button id="simulatePaymentBtn" class="payment-close-button" style="background: rgba(76, 175, 80, 0.2); border-color: #4CAF50; color: #4CAF50; display: none;" onclick="simulatePaymentSuccess()">[Debug] Simulate Payment Success</button>
      </div>
    </div>
  </div>

  <script>
    const API_BASE = '/api';

    // 智能判断浏览器语言
    function detectBrowserLanguage() {
      const savedLang = localStorage.getItem('subscription_lang');
      if (savedLang) return savedLang;

      const browserLang = navigator.language || navigator.userLanguage || 'en';
      return browserLang.startsWith('zh') && (browserLang.includes('CN') || browserLang === 'zh') ? 'zh-CN' : 'en';
    }

    let currentLang = detectBrowserLanguage();
    let selectedDuration = null;
    let selectedIPs = 3;
    let durationOptions = [];
    let planNames = {};

    // IP数量配置
    const ipOptions = [1, 2, 3, 5];

    // 从数据库加载套餐配置
    async function loadPlans() {
      try {
        const response = await fetch('/api/mall/plans');
        const data = await response.json();
        if (data.success && data.plans) {
          durationOptions = data.plans.map(plan => ({
            days: plan.days,
            basePrice: plan.base_price,
            pricePerIP: plan.price_per_ip,
            discount: plan.discount,
            name: 'plan_' + plan.id
          }));

          // 更新套餐名称
          translations.planNames = data.plans.reduce((acc, plan) => {
            acc['plan_' + plan.id] = plan.name;
            return acc;
          }, {});

          // 如果没有选中的套餐，默认选中第一个
          if (durationOptions.length > 0 && !selectedDuration) {
            selectedDuration = durationOptions[0];
          }

          renderPlans();
        }
      } catch (error) {
        console.error('Failed to load plans:', error);
        // 如果加载失败，使用默认配置
        durationOptions = [
          { days: 30, basePrice: 20, pricePerIP: 9, discount: 0, name: 'plan_default_1' },
          { days: 90, basePrice: 79, pricePerIP: 18, discount: 0, name: 'plan_default_2' },
          { days: 180, basePrice: 149, pricePerIP: 28, discount: 10, name: 'plan_default_3' },
          { days: 365, basePrice: 279, pricePerIP: 49, discount: 20, name: 'plan_default_4' }
        ];
        selectedDuration = durationOptions[0];
        renderPlans();
      }
    }


    const commonFeatures = [
      { icon: '✓', name: 'feature', label: 'feature_hd_quality' },
      { icon: '✓', name: 'feature', label: 'feature_multi_device' }
    ];

    // 翻译函数 - 使用 translate.js 处理页面翻译
    // Dynamic content uses English, translate.js will auto-translate
    const translations = {
      'planNames': {
        'month_1': '1 Month',
        'month_3': '3 Months',
        'month_6': '6 Months',
        'month_12': '1 Year'
      },
      'error': {
        'selectPlan': 'Please select a plan',
        'paymentError': 'Payment failed, please try again',
        'paymentNotConfigured': 'Payment method not configured',
        'networkError': 'Network error, please try again later',
        'notLoggedIn': 'Please login first'
      }
    };

    function t(key) {
      if (key === 'selectDuration') return 'Select Duration';
      if (key === 'selectIPs') return 'Select IP Count';
      if (key === 'summary') return 'Order Summary';
      if (key === 'basePrice') return 'Base Price';
      if (key === 'ipPrice') return 'IP Price';
      if (key === 'discount') return 'Discount';
      if (key === 'total') return 'Total';
      if (key === 'scanQrcode') return 'Scan QR code to pay';
      if (key === 'waitingPayment') return 'Waiting for payment...';
      if (key === 'planNames') return translations.planNames;
      if (key === 'error') return translations.error;
      return key;
    }

    function formatPrice(price, currency = 'CNY') {
      return '¥' + price.toFixed(2);
    }

    function calculatePrice(plan, ipCount) {
      const price = plan.basePrice + (plan.pricePerIP * ipCount);
      const discountedPrice = price * (1 - plan.discount / 100);
      return {
        original: price,
        discounted: discountedPrice,
        discount: plan.discount
      };
    }

    function renderPlans() {
      const container = document.getElementById('plansContainer');
      let html = '';

      // Duration selector
      html += '<div class="selection-section">';
      html += '<span class="selection-label">Select Duration</span>';
      html += '<div class="option-grid">';
      durationOptions.forEach(duration => {
        const price = calculatePrice(duration, selectedIPs);
        const isSelected = selectedDuration.name === duration.name;
        const daysText = duration.days === -1 ? 'Lifetime' : duration.days + ' days';
        html += '<div class="option-card ' + (isSelected ? 'selected' : '') + '" onclick="selectDuration(' + "'" + duration.name + "'" + ')">';
        html += '<div class="option-title">' + t('planNames')[duration.name] + '</div>';
        html += '<div class="option-subtitle">' + daysText + '</div>';
        html += '<div class="option-price">¥' + price.discounted.toFixed(2) + '</div>';
        if (duration.discount > 0) {
          html += '<div class="option-discount">-' + duration.discount + '%</div>';
        }
        html += '</div>';
      });
      html += '</div></div>';

      // IP选择器
      html += '<div class="selection-section">';
      html += '<span class="selection-label">' + t('selectIPs') + '</span>';
      html += '<div class="option-grid">';
      ipOptions.forEach(ip => {
        const isSelected = selectedIPs === ip;
        html += '<div class="option-card ' + (isSelected ? 'selected' : '') + '" onclick="selectIP(' + ip + ')">';
        html += '<div class="option-title">' + ip + ' IP' + (ip > 1 ? 's' : '') + '</div>';
        html += '</div>';
      });
      html += '</div></div>';

      container.innerHTML = html;

      // Render price summary
      renderPaymentSummary();
    }

    function renderPaymentSummary() {
      const summaryEl = document.getElementById('paymentSummary');
      const price = calculatePrice(selectedDuration, selectedIPs);

      const daysText = selectedDuration.days === -1 ? 'Lifetime' : selectedDuration.days + ' days';

      let html = '<h3 style="color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 20px;">' + t('summary') + '</h3>';

      // Base price
      html += '<div class="summary-row">';
      html += '<span class="summary-label">' + t('basePrice') + ' (' + daysText + ')</span>';
      html += '<span class="summary-value">¥' + selectedDuration.basePrice.toFixed(2) + '</span>';
      html += '</div>';

      // IP price
      html += '<div class="summary-row">';
      html += '<span class="summary-label">' + t('ipPrice') + ' (' + selectedIPs + ' IP)</span>';
      html += '<span class="summary-value">¥' + (selectedDuration.pricePerIP * selectedIPs).toFixed(2) + '</span>';
      html += '</div>';

      // Discount
      if (selectedDuration.discount > 0) {
        const discountAmount = price.original - price.discounted;
        html += '<div class="summary-row">';
        html += '<span class="summary-label" style="color: #ffcc00;">' + t('discount') + ' (' + selectedDuration.discount + '%)</span>';
        html += '<span class="summary-value" style="color: #ffcc00;">-¥' + discountAmount.toFixed(2) + '</span>';
        html += '</div>';
      }

      // Total
      html += '<div class="total-row">';
      html += '<span class="total-label">' + t('total') + '</span>';
      html += '<span class="total-price">¥' + price.discounted.toFixed(2) + '</span>';
      html += '</div>';

      summaryEl.innerHTML = html;
    }

    function selectDuration(durationName) {
      selectedDuration = durationOptions.find(d => d.name === durationName);
      renderPlans();
    }

    function selectIP(ipCount) {
      selectedIPs = ipCount;
      renderPlans();
    }

    function getToken() {
      return localStorage.getItem('auth_token');
    }

    function isLoggedIn() {
      return !!getToken();
    }

    async function processPayment() {
      if (!selectedDuration) {
        showError(t('error').selectPlan);
        return;
      }

      if (!isLoggedIn()) {
        // 显示登录提示模态框
        showLoginModal();
        return;
      }

      showLoading(true);
      hideError();

      try {
        // 虎皮椒支付会自动处理支付流程
      } catch (error) {
        console.error('Payment error:', error);
        showError(t('error').paymentError);
        showLoading(false);
      }
    }

    function showLoading(show) {
      document.getElementById('loading').classList.toggle('show', show);
    }

    function showError(message) {
      const errorEl = document.getElementById('errorMessage');
      errorEl.textContent = message;
      errorEl.style.display = 'block';

      setTimeout(() => {
        errorEl.style.display = 'none';
      }, 5000);
    }

    function hideError() {
      document.getElementById('errorMessage').style.display = 'none';
    }

    function showLoginModal() {
      const modal = document.createElement('div');
      modal.id = 'loginModal';
      Object.assign(modal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      });
      modal.innerHTML = '<div style="background: #141414; border-radius: 20px; padding: 40px; max-width: 400px; text-align: center; border: 2px solid #e50914; box-shadow: 0 20px 60px rgba(229, 9, 20, 0.3);"><div style="font-size: 48px; margin-bottom: 20px;">🔐</div><h2 style="font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 10px;">Please Login First</h2><p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin-bottom: 30px; line-height: 1.6;">Please login to continue your subscription purchase</p><button onclick="window.location.href=' + "'/'" + '" style="background: #e50914; color: white; border: none; padding: 16px 40px; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.2s;">Login Now</button><button onclick="document.getElementById(' + "'loginModal'" + ').remove()" style="background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); padding: 16px 30px; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 600; margin-top: 15px; transition: all 0.2s;">Later</button></div>';
      document.body.appendChild(modal);
    }

    function showSuccessModal(subUrl) {
      document.getElementById('generatedCode').textContent = subUrl;
      document.getElementById('successModal').classList.add('show');
    }

    function closeModal() {
      document.getElementById('successModal').classList.remove('show');
    }

    function copyCode() {
      const subUrl = document.getElementById('generatedCode').textContent;
      const messageEl = document.getElementById('copyMessage');

      navigator.clipboard.writeText(subUrl).then(() => {
        messageEl.textContent = '✓ Subscription URL copied!';
        messageEl.className = 'copy-message success';
        setTimeout(() => {
          messageEl.className = 'copy-message';
        }, 3000);
      }).catch(err => {
        messageEl.textContent = '✗ Failed to copy URL';
        messageEl.className = 'copy-message error';
        setTimeout(() => {
          messageEl.className = 'copy-message';
        }, 3000);
        console.error('Copy failed:', err);
      });
    }


    // 支付方式切换
    let currentPaymentMethod = 'alipay';
    let checkPaymentInterval = null;
    let currentOrderId = null;

    function switchPaymentMethod(method) {
      currentPaymentMethod = method;

      // 更新UI
      document.querySelectorAll('.payment-method-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.method === method);
      });

      // 根据支付方式显示对应区域（但不立即创建订单）
      if (method === 'alipay' || method === 'wechat') {
        // 显示支付按钮
        showPaymentInfo(method);
      }
    }

    function showPaymentInfo(method) {
      // Show payment button
      const payButton = document.getElementById('pay-button');
      const xunhupayButtonContainer = document.getElementById('xunhupay-button-container');

      if (method === 'alipay' || method === 'wechat') {
        payButton.textContent = method === 'alipay' ? 'Pay with Alipay' : 'Pay with WeChat';
        xunhupayButtonContainer.style.display = 'block';
      }
    }

    // 处理支付按钮点击
    async function handlePayClick() {
      if (!selectedDuration) {
        showError(t('error').selectPlan);
        return;
      }

      if (!isLoggedIn()) {
        showLoginModal();
        return;
      }

      // 根据支付方式调用相应的初始化函数
      if (currentPaymentMethod === 'alipay' || currentPaymentMethod === 'wechat') {
        await initXunhuPay(currentPaymentMethod);
      } else if (currentPaymentMethod === 'coinbase') {
        await initCoinbasePay();
      } else if (currentPaymentMethod === 'usdt' || currentPaymentMethod === 'usdc') {
        await initCryptoPayment(currentPaymentMethod);
      } else {
        showError('Payment method not supported');
      }
    }

    // 关闭支付弹窗
    function closePaymentModal() {
      const modal = document.getElementById('paymentModal');
      modal.classList.remove('show');

      // 停止轮询订单状态
      if (checkPaymentInterval) {
        clearInterval(checkPaymentInterval);
        checkPaymentInterval = null;
      }

      // 恢复支付按钮显示
      document.getElementById('xunhupay-button-container').style.display = 'block';
    }

    // 初始化虎皮椒支付
    async function initXunhuPay(paymentMethod) {
      if (!selectedDuration) {
        showError(t('error').selectPlan);
        return;
      }

      if (!isLoggedIn()) {
        showLoginModal();
        return;
      }

      showLoading(true);
      hideError();

      try {
        const response = await fetch(API_BASE + '/subscription/xunhupay/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify({
            duration_days: selectedDuration.days,
            max_ips: selectedIPs,
            payment_method: paymentMethod
          })
        });

        const result = await response.json();

        if (response.ok && result.success && result.payment_data) {
          // Calculate price
          const price = calculatePrice(selectedDuration, selectedIPs);

          // Update modal info
          const modal = document.getElementById('paymentModal');
          const planDaysText = selectedDuration.days === -1 ? 'Lifetime' : selectedDuration.days + ' days';
          document.getElementById('paymentPlanName').textContent = planDaysText;
          document.getElementById('paymentIPCount').textContent = selectedIPs + ' IP' + (selectedIPs > 1 ? 's' : '');
          document.getElementById('paymentMethod').textContent = paymentMethod === 'alipay' ? 'Alipay' : 'WeChat Pay';
          document.getElementById('paymentAmount').textContent = '¥' + price.discounted.toFixed(2);

          // 显示二维码
          const qrcodeImage = document.getElementById('modalQrcodeImage');
          const qrcodeTip = document.getElementById('modalQrcodeTip');

          // 如果虎皮椒返回了二维码URL
          if (result.payment_data.url_qrcode) {
            qrcodeImage.src = result.payment_data.url_qrcode;
          } else {
            // 使用 QR Code API 生成二维码
            qrcodeImage.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(result.payment_data.url);
          }

          qrcodeTip.textContent = t('scanQrcode');
          document.getElementById('paymentStatus').textContent = t('waitingPayment');

           // 显示弹窗
          modal.classList.add('show');

          // 保存当前订单ID
          currentOrderId = result.order_id;

          // 在开发环境下显示调试按钮
          if (isLocalhost()) {
            document.getElementById('simulatePaymentBtn').style.display = 'inline-block';
          }

          // 开始轮询订单状态
          startOrderCheck(result.order_id);
        } else {
          showError(result.error || t('error').paymentNotConfigured);
        }
      } catch (error) {
        console.error('XunhuPay error:', error);
        showError(t('error').networkError);
      } finally {
        showLoading(false);
      }
    }

    // 轮询订单状态
    function startOrderCheck(orderId) {
      // Clear previous timer
      if (checkPaymentInterval) {
        clearInterval(checkPaymentInterval);
      }

      let checkCount = 0;
      const maxChecks = 60; // Max 60 checks (5 minutes)

      checkPaymentInterval = setInterval(async () => {
        checkCount++;

        if (checkCount > maxChecks) {
          clearInterval(checkPaymentInterval);
          document.getElementById('paymentStatus').textContent = 'Payment timeout, please try again';
          return;
        }

        try {
          const response = await fetch(API_BASE + '/subscription/xunhupay/check-order?order_id=' + orderId, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + getToken()
            }
          });

          const result = await response.json();

          if (response.ok && result.success) {
            if (result.order.status === 'completed') {
              clearInterval(checkPaymentInterval);

              // Update payment status
              document.getElementById('paymentStatus').textContent = 'Payment successful!';
              document.getElementById('paymentStatus').style.color = '#4CAF50';

              // 延迟关闭支付弹窗
              setTimeout(() => {
                closePaymentModal();

                // 查询订阅地址
                fetch(API_BASE + '/auth/orders', {
                  method: 'GET',
                  headers: {
                    'Authorization': 'Bearer ' + getToken()
                  }
                }).then(codeResult => {
                  if (codeResult.ok) {
                    return codeResult.json();
                  }
                }).then(codeData => {
                  if (codeData && codeData.success && codeData.orders && codeData.orders.length > 0) {
                    const latestOrder = codeData.orders[0];
                    const subUrl = window.location.origin + '/sub/' + latestOrder.code + '.m3u';
                    showSuccessModal(subUrl);
                  }
                }).catch(err => {
                  console.error('Fetch orders error:', err);
                });
              }, 1500);
            }
          }
        } catch (error) {
          console.error('Order check error:', error);
        }
      }, 5000); // 每5秒检查一次
    }

    // 初始化 Coinbase 支付
    async function initCoinbasePay() {
      if (!selectedDuration) {
        showError(t('error').selectPlan);
        return;
      }

      if (!isLoggedIn()) {
        showLoginModal();
        return;
      }

      showLoading(true);
      hideError();

      try {
        const response = await fetch(API_BASE + '/subscription/crypto/coinbase-create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify({
            duration_days: selectedDuration.days,
            max_ips: selectedIPs
          })
        });

        const result = await response.json();

        if (response.ok && result.success && result.payment_data) {
          // Calculate price (convert CNY to USD)
          const price = calculatePrice(selectedDuration, selectedIPs);
          const priceUSD = (price.discounted / 7.2).toFixed(2); // 假设汇率 1 USD = 7.2 CNY

          // Update modal info
          const modal = document.getElementById('paymentModal');
          const planDaysText = selectedDuration.days === -1 ? 'Lifetime' : selectedDuration.days + ' days';
          document.getElementById('paymentPlanName').textContent = planDaysText;
          document.getElementById('paymentIPCount').textContent = selectedIPs + ' IP' + (selectedIPs > 1 ? 's' : '');
          document.getElementById('paymentMethod').textContent = 'Coinbase Commerce';
          document.getElementById('paymentAmount').textContent = '$' + priceUSD;

          // 显示二维码
          const qrcodeImage = document.getElementById('modalQrcodeImage');
          const qrcodeTip = document.getElementById('modalQrcodeTip');

          // 如果 Coinbase 返回了二维码URL
          if (result.payment_data.url_qrcode) {
            qrcodeImage.src = result.payment_data.url_qrcode;
          } else {
            // 使用 QR Code API 生成二维码
            qrcodeImage.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(result.payment_data.url);
          }

          qrcodeTip.textContent = 'Scan QR code to pay';
          document.getElementById('paymentStatus').textContent = 'Waiting for payment...';

          // 显示支付提示
          const paymentHint = document.getElementById('paymentHint');
          if (paymentHint) {
            paymentHint.textContent = 'Support: BTC, ETH, USDC, USDT, DAI, DOGE, LTC, etc.';
          }

          // 显示弹窗
          modal.classList.add('show');

          // 保存当前订单ID
          currentOrderId = result.order_id;

          // 隐藏调试按钮（Coinbase 不需要）
          document.getElementById('simulatePaymentBtn').style.display = 'none';

          // 开始轮询订单状态
          startCoinbaseOrderCheck(result.order_id);
        } else {
          showError(result.error || t('error').paymentNotConfigured);
        }
      } catch (error) {
        console.error('Coinbase error:', error);
        showError(t('error').networkError);
      } finally {
        showLoading(false);
      }
    }

    // 轮询 Coinbase 订单状态
    function startCoinbaseOrderCheck(orderId) {
      // Clear previous timer
      if (checkPaymentInterval) {
        clearInterval(checkPaymentInterval);
      }

      let checkCount = 0;
      const maxChecks = 120; // Max 120 checks (10 minutes, Coinbase may take longer)

      checkPaymentInterval = setInterval(async () => {
        checkCount++;

        if (checkCount > maxChecks) {
          clearInterval(checkPaymentInterval);
          document.getElementById('paymentStatus').textContent = 'Payment timeout, please try again';
          return;
        }

        try {
          const response = await fetch(API_BASE + '/subscription/crypto/coinbase-check-order?order_id=' + orderId, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + getToken()
            }
          });

          const result = await response.json();

          if (response.ok && result.success) {
            if (result.order.status === 'completed') {
              clearInterval(checkPaymentInterval);

              // Update payment status
              document.getElementById('paymentStatus').textContent = 'Payment successful!';
              document.getElementById('paymentStatus').style.color = '#4CAF50';

              // 延迟关闭支付弹窗
              setTimeout(() => {
                closePaymentModal();

                // 显示成功模态框
                if (result.order.code) {
                  const subUrl = window.location.origin + '/sub/' + result.order.code + '.m3u';
                  showSuccessModal(subUrl);
                }
              }, 1500);
            }
          }
        } catch (error) {
          console.error('Coinbase order check error:', error);
        }
      }, 5000); // 每5秒检查一次
    }

    // 初始化直接稳定币支付（USDT/USDC）
    async function initCryptoPayment(paymentMethod) {
      if (!selectedDuration) {
        showError(t('error').selectPlan);
        return;
      }

      if (!isLoggedIn()) {
        showLoginModal();
        return;
      }

      showLoading(true);
      hideError();

      try {
        const response = await fetch(API_BASE + '/subscription/crypto/direct-create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
          },
          body: JSON.stringify({
            duration_days: selectedDuration.days,
            max_ips: selectedIPs,
            payment_method: paymentMethod
          })
        });

        const result = await response.json();

        if (response.ok && result.success && result.payment_data) {
          // Calculate price (convert CNY to USD)
          const price = calculatePrice(selectedDuration, selectedIPs);
          const priceUSD = (price.discounted / 7.2).toFixed(2); // 假设汇率 1 USD = 7.2 CNY

          // Update modal info
          const modal = document.getElementById('paymentModal');
          const planDaysText = selectedDuration.days === -1 ? 'Lifetime' : selectedDuration.days + ' days';
          document.getElementById('paymentPlanName').textContent = planDaysText;
          document.getElementById('paymentIPCount').textContent = selectedIPs + ' IP' + (selectedIPs > 1 ? 's' : '');
          document.getElementById('paymentMethod').textContent = paymentMethod.toUpperCase() + ' (' + result.payment_data.network + ')';
          document.getElementById('paymentAmount').textContent = '$' + priceUSD;

          // 显示钱包地址（而不是二维码）
          const qrcodeImage = document.getElementById('modalQrcodeImage');
          const qrcodeTip = document.getElementById('modalQrcodeTip');

          // 隐藏二维码，显示钱包信息
          qrcodeImage.style.display = 'none';
          qrcodeTip.innerHTML = '<div style="font-size: 14px; font-weight: 600; color: #fff;">Wallet Address:</div><div style="font-size: 18px; font-weight: 700; color: #fff; margin: 10px 0; word-break: break-all;">' + result.payment_data.wallet_address + '</div><div style="font-size: 14px; color: rgba(255,255,255,0.6); margin-top: 10px;">Network: ' + result.payment_data.network + '</div><div style="font-size: 14px; color: rgba(255,255,255,0.6); margin-top: 5px;">Amount: ' + result.payment_data.amount + ' ' + result.payment_data.currency + '</div>';

          document.getElementById('paymentStatus').textContent = 'Waiting for payment...';

          // 显示支付提示
          const paymentHint = document.getElementById('paymentHint');
          if (paymentHint) {
            paymentHint.textContent = 'Please send exact amount. Include Order ID in memo: ' + result.payment_data.memo;
          }

          // 显示弹窗
          modal.classList.add('show');

          // 保存当前订单ID
          currentOrderId = result.order_id;

          // 隐藏调试按钮和二维码
          document.getElementById('simulatePaymentBtn').style.display = 'none';

          // 不轮询订单状态（直接支付需要管理员手动确认）
          // 显示手动确认提示
          document.getElementById('paymentStatus').textContent = 'Payment will be confirmed after manual review';
        } else {
          showError(result.error || t('error').paymentNotConfigured);
        }
      } catch (error) {
        console.error('Crypto payment error:', error);
        showError(t('error').networkError);
      } finally {
        showLoading(false);
      }
    }

    // Debug: Simulate payment success
    async function simulatePaymentSuccess() {
      if (!currentOrderId) {
        showError('No pending order');
        return;
      }

      const btn = document.getElementById('simulatePaymentBtn');
      btn.disabled = true;
      btn.textContent = 'Simulating...';

      try {
        const response = await fetch(API_BASE + '/subscription/xunhupay/simulate-success?order_id=' + currentOrderId, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Stop polling
          if (checkPaymentInterval) {
            clearInterval(checkPaymentInterval);
            checkPaymentInterval = null;
          }

          // Update payment status
          document.getElementById('paymentStatus').textContent = 'Payment successful!';
          document.getElementById('paymentStatus').style.color = '#4CAF50';

          // 延迟关闭支付弹窗
          setTimeout(() => {
            closePaymentModal();
            
            // 显示成功模态框
            if (result.code) {
              const subUrl = window.location.origin + '/sub/' + result.code + '.m3u';
              showSuccessModal(subUrl);
            }
          }, 1500);
        } else {
          showError(result.error || 'Simulation failed');
        }
      } catch (error) {
        console.error('Simulate payment error:', error);
        showError('Simulation failed: ' + error.message);
      } finally {
        btn.disabled = false;
        btn.textContent = '[Debug] Simulate Payment Success';
      }
    }

    // 检测是否为本地开发环境
    function isLocalhost() {
      return window.location.hostname === 'localhost' || 
             window.location.hostname === '127.0.0.1' ||
             window.location.hostname.startsWith('192.168.') ||
             window.location.hostname.startsWith('10.');
    }




    // 加载支付方式列表
    async function loadPaymentMethods() {
      try {
        const response = await fetch('/api/mall/payment-methods');
        const data = await response.json();

        if (data.success && data.payment_methods) {
          const enabledMethods = data.payment_methods.filter(m => m.enabled);
          renderPaymentMethods(enabledMethods);
        }
      } catch (error) {
        console.error('Failed to load payment methods:', error);
        // 加载失败时显示默认的支付方式
      }
    }

    // 渲染支付方式选项卡
    function renderPaymentMethods(methods) {
      const paymentMethodsContainer = document.querySelector('.payment-methods');
      if (!paymentMethodsContainer) return;

      if (methods.length === 0) {
        paymentMethodsContainer.innerHTML = '<p style="color:rgba(255,255,255,0.6);text-align:center;padding:20px;">No payment methods available</p>';
        return;
      }

      let html = '';
      methods.forEach((method, index) => {
        let iconHtml = '';
        const activeClass = index === 0 ? 'active' : '';

        // 根据支付类型设置对应的图标
        switch (method.type) {
          case 'alipay':
            iconHtml = '<img src="/public/zhifubao.png" class="payment-method-icon" alt="Alipay">';
            break;
          case 'wechat':
            iconHtml = '<img src="/public/weixin.png" class="payment-method-icon" alt="WeChat Pay">';
            break;
          case 'coinbase':
            iconHtml = '<svg class="payment-method-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#0052FF"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">₿</text></svg>';
            break;
          case 'usdt':
            iconHtml = '<svg class="payment-method-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#26A17B"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="9" font-weight="bold">₮</text></svg>';
            break;
          case 'usdc':
            iconHtml = '<svg class="payment-method-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#2775CA"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="9" font-weight="bold">$</text></svg>';
            break;
          case 'paypal':
            iconHtml = '<svg class="payment-method-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#003087"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">P</text></svg>';
            break;
          default:
            iconHtml = '<svg class="payment-method-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#666"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">?</text></svg>';
        }

        html += '<div class="payment-method-tab ' + activeClass + '" onclick="switchPaymentMethod(&quot;' + method.type + '&quot;)" data-method="' + method.type + '">';
        html += iconHtml;
        html += '<span class="payment-method-name">' + method.name + '</span>';
        html += '</div>';
      });

      paymentMethodsContainer.innerHTML = html;

      // 默认选中第一个支付方式
      if (methods.length > 0) {
        currentPaymentMethod = methods[0].type;
      }
    }

    // 主题初始化
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved ? saved === 'dark' : prefersDark;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
    })();
    function updateThemeIcons(isDark) {
      const sun = document.querySelector('.sun-icon');
      const moon = document.querySelector('.moon-icon');
      if (sun && moon) {
        sun.style.display = isDark ? 'none' : 'block';
        moon.style.display = isDark ? 'block' : 'none';
      }
    }

    // 主题切换
    document.getElementById('themeToggle')?.addEventListener('click', function() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      const sun = document.querySelector('.sun-icon');
      const moon = document.querySelector('.moon-icon');
      if (sun && moon) {
        sun.style.display = next === 'dark' ? 'none' : 'block';
        moon.style.display = next === 'dark' ? 'block' : 'none';
      }
    });

    // 页面加载时直接渲染套餐,不检查登录状态
    document.addEventListener('DOMContentLoaded', () => {
      loadPlans(); // 从数据库加载套餐配置
      loadPaymentMethods(); // 加载支付方式列表
      // translate.js 由 page-footer 统一加载
    });
  </script>

  <!-- Translate.js 自动翻译 -->
  <script src="https://cdn.jsdelivr.net/gh/xnx3/translate@4.0.0/translate.js/translate.js"></script>
  <script>
    // 等待 translate.js 加载完成后初始化
    function initTranslate() {
      console.log('translate:', typeof translate);
      console.log('window.translate:', typeof window.translate);
      
      // 手动将 translate 暴露到 window（兼容某些环境）
      if (typeof translate !== 'undefined' && !window.translate) {
        window.translate = translate;
      }
      
      if (typeof translate !== 'undefined' && translate.language) {
        translate.language.setLocal('english');
        translate.service.use('client.edge');
        translate.listener.start();
        translate.setAutoDiscriminateLocalLanguage();
        translate.execute();
        console.log('Translate.js initialized successfully');
      } else {
        console.log('Waiting for translate.js to load...');
        setTimeout(initTranslate, 100);
      }
    }
    
    // 页面加载完成后也尝试初始化
    window.addEventListener('load', initTranslate);
    initTranslate();
    
    function changeLanguage(lang) {
      var t = window.translate || translate;
      if (t && t.changeLanguage) {
        t.changeLanguage(lang);
      }
    }
  </script>

  ${PAGE_FOOTER}
  
</body>
</html>`;

