// 生成支付方式 logo 的 base64 数据
const fs = require('fs');

// 读取图片文件
const zhifubaoBuffer = fs.readFileSync('./public/zhifubao.png');
const weixinBuffer = fs.readFileSync('./public/weixin.png');

// 转换为 base64
const zhifubaoBase64 = zhifubaoBuffer.toString('base64');
const weixinBase64 = weixinBuffer.toString('base64');

// 生成代码
const code = `// 支付宝官方 logo PNG (Base64 编码) - ${zhifubaoBuffer.length} bytes
export const ALIPAY_PNG_DATA = '${zhifubaoBase64}';

// 微信支付官方 logo PNG (Base64 编码) - ${weixinBuffer.length} bytes
export const WECHAT_PAY_PNG_DATA = '${weixinBase64}';
`;

// 写入文件
fs.writeFileSync('./image-data.js', code);

console.log('Generated image-data.js');
console.log('Zhifubao:', zhifubaoBuffer.length, 'bytes');
console.log('Weixin:', weixinBuffer.length, 'bytes');
