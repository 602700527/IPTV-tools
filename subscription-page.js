// 订阅支付页面HTML
import { PAGE_HEADER } from './components/page-header.js';
import { PAGE_FOOTER } from './components/page-footer.js';


export const SUBSCRIPTION_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title data-i18n-title="pageTitle">订阅购买 - TV Live Service</title>
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
      padding: 15px;
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
      max-height: 90vh;
      overflow-y: auto;
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
      padding: 24px 28px;
      background: linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(184, 29, 36, 0.05) 100%);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px 24px 0 0;
    }

    .payment-title {
      font-size: 20px;
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
      height: 20px;
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
      width: 36px;
      height: 36px;
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
      padding: 28px;
    }

    .payment-info {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 20px 24px;
      margin-bottom: 28px;
    }

    .payment-info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .payment-info-item:last-child {
      border-bottom: none;
      padding-bottom: 8px;
    }

    .payment-info-item:first-child {
      padding-top: 8px;
    }

    .payment-info-label {
      color: rgba(255, 255, 255, 0.5);
      font-size: 13px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .payment-info-value {
      color: #fff;
      font-size: 15px;
      font-weight: 600;
    }

    .payment-amount {
      color: #e50914;
      font-size: 24px;
      font-weight: 800;
      text-shadow: 0 0 20px rgba(229, 9, 20, 0.3);
    }

    .qrcode-section {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 30px;
      text-align: center;
    }

    .qrcode-wrapper {
      background: #fff;
      padding: 16px;
      border-radius: 16px;
      display: inline-block;
      margin-bottom: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .modal-qrcode-image {
      width: 220px;
      height: 220px;
      border: none;
      display: block;
    }

    .qrcode-tip {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      font-weight: 500;
      margin: 0 0 16px 0;
    }

    .payment-status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #e50914;
      font-size: 15px;
      font-weight: 700;
      padding: 10px 20px;
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
      padding: 16px 28px 28px 28px;
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
        padding: 24px 20px;
      }

      .payment-header {
        padding: 20px;
        border-radius: 20px 20px 0 0;
      }

      .payment-title {
        font-size: 18px;
      }

      .payment-info {
        padding: 18px;
        margin-bottom: 24px;
      }

      .qrcode-section {
        padding: 24px 20px;
      }

      .modal-qrcode-image {
        width: 200px;
        height: 200px;
      }

      .payment-footer {
        padding: 14px 20px 24px 20px;
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
        font-size: 16px;
      }

      .payment-body {
        padding: 20px 16px;
      }

      .payment-info {
        padding: 16px;
      }

      .payment-info-label {
        font-size: 12px;
      }

      .payment-info-value {
        font-size: 14px;
      }

      .payment-amount {
        font-size: 20px;
      }

      .qrcode-section {
        padding: 20px 16px;
      }

      .modal-qrcode-image {
        width: 180px;
        height: 180px;
      }

      .qrcode-wrapper {
        padding: 12px;
      }

       .qrcode-tip {
        font-size: 13px;
      }
      
      .payment-hint {
        background: rgba(255, 204, 0, 0.1);
        border: 1px solid rgba(255, 204, 0, 0.3);
        border-radius: 8px;
        padding: 10px 14px;
        margin-top: 12px;
        font-size: 13px;
        color: #ffcc00;
        line-height: 1.5;
      }
      
      .payment-status {
        font-size: 14px;
        padding: 8px 16px;
      }
    }
  </style>
</head>
<body>
  ${PAGE_HEADER}
  <div class="container">
    <div class="header">
      <h1 data-i18n="title">👑 会员订阅</h1>
      <p data-i18n="subtitle">选择适合您的订阅套餐，享受高清直播服务</p>
    </div>

    <div id="plansContainer" class="plans-container">
      <!-- 时长和IP选择器将通过JS动态生成 -->
    </div>

    <div class="payment-summary" id="paymentSummary">
      <!-- 价格汇总将通过JS动态生成 -->
    </div>

    <div class="payment-section" id="paymentSection">
      <div class="payment-methods">
        <div class="payment-method-tab active" onclick="switchPaymentMethod('alipay')" data-method="alipay">
          <img src="/public/zhifubao.png" class="payment-method-icon" alt="支付宝">
          <span class="payment-method-name">支付宝</span>
        </div>
          <div class="payment-method-tab" onclick="switchPaymentMethod('wechat')" data-method="wechat">
          <img src="/public/weixin.png" class="payment-method-icon" alt="微信支付">
          <span class="payment-method-name">微信支付</span>
        </div>
      </div>

      <div id="xunhupay-button-container" style="margin: 20px 0;">
        <button id="pay-button" onclick="handlePayClick()" style="background: #e50914; color: white; border: none; padding: 16px 40px; border-radius: 12px; cursor: pointer; font-size: 18px; font-weight: 600; transition: all 0.3s; width: 100%; max-width: 300px;">
          立即支付
        </button>
      </div>

      <div id="loading" class="loading">
      <div class="spinner"></div>
      <p data-i18n="processing">处理中...</p>
    </div>

    <div id="errorMessage" class="error-message" style="display: none;"></div>
  </div>
  ${PAGE_FOOTER}

  <div id="successModal" class="success-modal">
    <div class="success-content">
      <div class="success-icon">🎉</div>
      <h2 class="success-title" data-i18n="paymentSuccess">支付成功！</h2>
      <p class="success-message" data-i18n="subUrlGenerated">您的订阅地址已生成</p>
      <div class="code-display" id="generatedCode" style="font-size: 14px; word-break: break-all;">-</div>
      <button class="copy-button" onclick="copyCode()" data-i18n="copyUrl">复制订阅地址</button>
      <br><br>
      <p style="color: rgba(255, 255, 255, 0.6); font-size: 12px; margin-top: 15px;">您可以直接使用此订阅地址在播放器中添加</p>
      <button class="close-button" onclick="closeModal()" data-i18n="closeButton">关闭</button>
    </div>
  </div>

  <div id="paymentModal" class="payment-modal">
    <div class="payment-content">
      <div class="payment-header">
        <h2 class="payment-title" id="paymentModalTitle">扫码支付</h2>
        <button class="payment-close" onclick="closePaymentModal()">×</button>
      </div>
      <div class="payment-body">
        <div class="qrcode-section">
          <div class="qrcode-wrapper">
            <img id="modalQrcodeImage" class="modal-qrcode-image" src="" alt="Payment QR Code">
          </div>
          <p class="qrcode-tip" id="modalQrcodeTip" data-i18n="scanQrcode">请使用手机扫码支付</p>
          <!-- 支付提示 -->
          <p class="payment-hint" id="paymentHint"></p>
          <p class="payment-status" id="paymentStatus">等待支付中...</p>
        </div>
        <div class="payment-info">
          <div class="payment-info-item">
            <span class="payment-info-label">套餐</span>
            <span class="payment-info-value" id="paymentPlanName">-</span>
          </div>
          <div class="payment-info-item">
            <span class="payment-info-label">IP数量</span>
            <span class="payment-info-value" id="paymentIPCount">-</span>
          </div>
          <div class="payment-info-item">
            <span class="payment-info-label">支付方式</span>
            <span class="payment-info-value" id="paymentMethod">-</span>
          </div>
          <div class="payment-info-item">
            <span class="payment-info-label">订单金额</span>
            <span class="payment-info-value payment-amount" id="paymentAmount">-</span>
          </div>
        </div>
      </div>
      <div class="payment-footer">
        <!-- 调试：模拟支付成功按钮（仅开发环境显示） -->
        <button id="simulatePaymentBtn" class="payment-close-button" style="background: rgba(76, 175, 80, 0.2); border-color: #4CAF50; color: #4CAF50; display: none;" onclick="simulatePaymentSuccess()">[调试] 模拟支付成功</button>
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

          // 更新翻译中的套餐名称
          if (translations['zh-CN']) {
            translations['zh-CN'].planNames = data.plans.reduce((acc, plan) => {
              acc['plan_' + plan.id] = plan.name;
              return acc;
            }, {});
          }
          if (translations['en']) {
            translations['en'].planNames = data.plans.reduce((acc, plan) => {
              acc['plan_' + plan.id] = plan.name_en || plan.name;
              return acc;
            }, {});
          }

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

    // 初始化默认选择
    selectedDuration = durationOptions[2];

    // 通用功能特性
    const commonFeatures = [
      { icon: '✓', name: 'feature', label: 'feature_hd_quality' },
      { icon: '✓', name: 'feature', label: 'feature_multi_device' }
    ];

    // 多语言翻译
    const translations = {
      'zh-CN': {
        pageTitle: '会员订阅 - 电视直播服务',
        title: '👑 会员订阅',
        subtitle: '选择适合您的会员套餐，享受高清直播服务',
        selectIPs: '选择IP数量',
        summary: '订单汇总',
        paymentSuccess: '支付成功！',
        subUrlGenerated: '您的订阅地址已生成',
        copyUrl: '复制订阅地址',
        closeButton: '关闭',
        loginNow: '立即登录',
        loginHint: '请先登录以完成支付',
        paymentHint: '⚠️ 支付后请勿关闭此窗口。您的订阅地址将自动显示。',
        scanQrcode: '请使用手机扫码支付',
        waitingPayment: '等待支付中...',
        feature_hd_quality: 'HD 高清画质',
        feature_multi_device: '多设备同时观看',
        feature_cloud_recording: '云录制功能',
        feature_24_7_support: '24/7 技术支持',
        selectDuration: '选择订阅时长',
        selectIPs: '选择IP数量',
        summary: '订单汇总',
        basePrice: '基础价格',
        ipPrice: 'IP费用',
        discount: '折扣',
        total: '总计',
        ipCount: 'IP数量',
        planNames: {
          'month_1': '1个月',
          'month_3': '3个月',
          'month_6': '半年',
          'month_12': '1年'
        },
        error: {
          notLoggedIn: '请先登录账户',
          paymentError: '支付失败，请重试',
          networkError: '网络错误，请稍后重试',
          selectPlan: '请选择一个套餐'
        }
      },
      'en': {
        pageTitle: 'Membership - TV Live Service',
        title: '👑 Membership',
        subtitle: 'Choose the plan that suits you, enjoy HD live streaming',
        summary: 'Order Summary',
        paymentSuccess: 'Payment Successful!',
        subUrlGenerated: 'Your subscription URL has been generated',
        copyUrl: 'Copy URL',
        closeButton: 'Close',
        loginNow: 'Login Now',
        loginHint: 'Please login to complete payment',
        paymentHint: '⚠️ Please do not close this window after payment. Your subscription URL will be displayed automatically.',
        scanQrcode: 'Please scan the QR code to pay',
        waitingPayment: 'Waiting for payment...',
        feature_hd_quality: 'HD Quality',
        feature_multi_device: 'Multi-device Support',
        feature_cloud_recording: 'Cloud Recording',
        feature_24_7_support: '24/7 Support',
        selectDuration: 'Select Subscription Duration',
        selectIPs: 'Select IP Count',
        summary: 'Order Summary',
        basePrice: 'Base Price',
        ipPrice: 'IP Price',
        discount: 'Discount',
        total: 'Total',
        ipCount: 'IP Count',
        planNames: {
          'month_1': '1 Month',
          'month_3': '3 Months',
          'month_6': '6 Months',
          'month_12': '1 Year'
        },
        error: {
          notLoggedIn: 'Please login first',
          paymentError: 'Payment failed, please try again',
          networkError: 'Network error, please try again later',
          selectPlan: 'Please select a plan'
        }
      }
    };

    function t(key) {
      return translations[currentLang][key] || translations['en'][key] || key;
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

      // 时长选择器
      html += '<div class="selection-section">';
      html += '<span class="selection-label">' + t('selectDuration') + '</span>';
      html += '<div class="option-grid">';
      durationOptions.forEach(duration => {
        const price = calculatePrice(duration, selectedIPs);
        const isSelected = selectedDuration.name === duration.name;
        html += '<div class="option-card ' + (isSelected ? 'selected' : '') + '" onclick="selectDuration(' + "'" + duration.name + "'" + ')">';
        html += '<div class="option-title">' + t('planNames')[duration.name] + '</div>';
        html += '<div class="option-subtitle">' + duration.days + ' ' + (currentLang === 'zh-CN' ? '天' : 'days') + '</div>';
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

      // 渲染价格汇总
      renderPaymentSummary();
    }

    function renderPaymentSummary() {
      const summaryEl = document.getElementById('paymentSummary');
      const price = calculatePrice(selectedDuration, selectedIPs);

      let html = '<h3 style="color: #fff; font-size: 18px; font-weight: 700; margin-bottom: 20px;">' + t('summary') + '</h3>';

      // 基础价格
      html += '<div class="summary-row">';
      html += '<span class="summary-label">' + t('basePrice') + ' (' + selectedDuration.days + ' ' + (currentLang === 'zh-CN' ? '天' : 'days') + ')</span>';
      html += '<span class="summary-value">¥' + selectedDuration.basePrice.toFixed(2) + '</span>';
      html += '</div>';

      // IP费用
      html += '<div class="summary-row">';
      html += '<span class="summary-label">' + t('ipPrice') + ' (' + selectedIPs + ' IP)</span>';
      html += '<span class="summary-value">¥' + (selectedDuration.pricePerIP * selectedIPs).toFixed(2) + '</span>';
      html += '</div>';

      // 折扣
      if (selectedDuration.discount > 0) {
        const discountAmount = price.original - price.discounted;
        html += '<div class="summary-row">';
        html += '<span class="summary-label" style="color: #ffcc00;">' + t('discount') + ' (' + selectedDuration.discount + '%)</span>';
        html += '<span class="summary-value" style="color: #ffcc00;">-¥' + discountAmount.toFixed(2) + '</span>';
        html += '</div>';
      }

      // 总计
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
      modal.innerHTML = '<div style="background: #141414; border-radius: 20px; padding: 40px; max-width: 400px; text-align: center; border: 2px solid #e50914; box-shadow: 0 20px 60px rgba(229, 9, 20, 0.3);"><div style="font-size: 48px; margin-bottom: 20px;">🔐</div><h2 style="font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 10px;">' + t('error').notLoggedIn + '</h2><p style="color: rgba(255, 255, 255, 0.8); font-size: 14px; margin-bottom: 30px; line-height: 1.6;">' + t('loginHint') + '</p><button onclick="window.location.href=' + "'/'" + '" style="background: #e50914; color: white; border: none; padding: 16px 40px; border-radius: 12px; cursor: pointer; font-size: 16px; font-weight: 600; transition: all 0.2s;">' + t('loginNow') + '</button><button onclick="document.getElementById(' + "'loginModal'" + ').remove()" style="background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); padding: 16px 30px; border-radius: 12px; cursor: pointer; font-size: 14px; font-weight: 600; margin-top: 15px; transition: all 0.2s;">' + (currentLang === 'zh-CN' ? '稍后登录' : 'Login Later') + '</button></div>';
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
      navigator.clipboard.writeText(subUrl).then(() => {
        alert(currentLang === 'zh-CN' ? '订阅地址已复制到剪贴板！' : 'Subscription URL copied to clipboard!');
      }).catch(err => {
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
      // 显示支付按钮
      const payButton = document.getElementById('pay-button');
      const xunhupayButtonContainer = document.getElementById('xunhupay-button-container');

      if (method === 'alipay' || method === 'wechat') {
        payButton.textContent = method === 'alipay' ? '使用支付宝支付' : '使用微信支付';
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

      // 初始化虎皮椒支付并显示弹窗
      await initXunhuPay(currentPaymentMethod);
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
          // 计算价格
          const price = calculatePrice(selectedDuration, selectedIPs);

          // 更新弹窗信息
          const modal = document.getElementById('paymentModal');
          document.getElementById('paymentPlanName').textContent = selectedDuration.days + ' ' + (currentLang === 'zh-CN' ? '天' : 'days');
          document.getElementById('paymentIPCount').textContent = selectedIPs + ' IP' + (selectedIPs > 1 ? 's' : '');
          document.getElementById('paymentMethod').textContent = paymentMethod === 'alipay' ? '支付宝' : '微信支付';
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
      // 清除之前的定时器
      if (checkPaymentInterval) {
        clearInterval(checkPaymentInterval);
      }

      let checkCount = 0;
      const maxChecks = 60; // 最多检查60次（5分钟）

      checkPaymentInterval = setInterval(async () => {
        checkCount++;

        if (checkCount > maxChecks) {
          clearInterval(checkPaymentInterval);
          document.getElementById('paymentStatus').textContent = '支付超时，请重新发起支付';
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

              // 更新支付状态
              document.getElementById('paymentStatus').textContent = '支付成功！';
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

    // 调试：模拟支付成功
    async function simulatePaymentSuccess() {
      if (!currentOrderId) {
        showError('没有正在进行的订单');
        return;
      }

      const btn = document.getElementById('simulatePaymentBtn');
      btn.disabled = true;
      btn.textContent = '模拟中...';

      try {
        const response = await fetch(API_BASE + '/subscription/xunhupay/simulate-success?order_id=' + currentOrderId, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + getToken()
          }
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // 停止轮询
          if (checkPaymentInterval) {
            clearInterval(checkPaymentInterval);
            checkPaymentInterval = null;
          }

          // 更新支付状态
          document.getElementById('paymentStatus').textContent = '支付成功！';
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
          showError(result.error || '模拟失败');
        }
      } catch (error) {
        console.error('Simulate payment error:', error);
        showError('模拟失败: ' + error.message);
      } finally {
        btn.disabled = false;
        btn.textContent = '[调试] 模拟支付成功';
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
        paymentMethodsContainer.innerHTML = '<p style="color:rgba(255,255,255,0.6);text-align:center;padding:20px;">暂无可用支付方式</p>';
        return;
      }

      let html = '';
      methods.forEach((method, index) => {
        const iconSrc = method.type === 'alipay' ? '/public/zhifubao.png' : (method.type === 'wechat' ? '/public/weixin.png' : '');
        const activeClass = index === 0 ? 'active' : '';
        html += \`
          <div class="payment-method-tab \${activeClass}" onclick="switchPaymentMethod('\${method.type}')" data-method="\${method.type}">
            <img src="\${iconSrc}" class="payment-method-icon" alt="\${method.name}">
            <span class="payment-method-name">\${method.name}</span>
          </div>
        \`;
      });

      paymentMethodsContainer.innerHTML = html;

      // 默认选中第一个支付方式
      if (methods.length > 0) {
        currentPaymentMethod = methods[0].type;
      }
    }

    // 页面加载时直接渲染套餐,不检查登录状态
    document.addEventListener('DOMContentLoaded', () => {
      loadPlans(); // 从数据库加载套餐配置
      loadPaymentMethods(); // 加载支付方式列表
      // 设置支付提示翻译
      const paymentHintEl = document.getElementById('paymentHint');
      if (paymentHintEl && typeof t === 'function') {
        paymentHintEl.textContent = t('paymentHint');
      }
    });
  </script>
</body>
</html>`;

