const QRCode = require('qrcode');
const fs = require('fs');

// Expo tunnel URL
const url = 'exp://atllyxa-anonymous-8081.exp.direct';

// 生成二维码图片
QRCode.toFile('expo-qrcode.png', url, {
  width: 500,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, function (err) {
  if (err) {
    console.error('生成二维码失败:', err);
  } else {
    console.log('✅ 二维码已生成: expo-qrcode.png');
    console.log('📱 扫描此二维码访问应用');
    console.log('🌐 URL:', url);
  }
});
