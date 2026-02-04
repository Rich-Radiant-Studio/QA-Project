const QRCode = require('qrcode');

// Expo tunnel URL
const url = 'exp://atllyxa-anonymous-8081.exp.direct';

// 生成大尺寸二维码图片（适合打印和分享）
QRCode.toFile('expo-public-qrcode.png', url, {
  width: 800,
  margin: 4,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, function (err) {
  if (err) {
    console.error('生成二维码失败:', err);
  } else {
    console.log('✅ 大尺寸二维码已生成: expo-public-qrcode.png');
    console.log('📱 扫描此二维码访问应用');
    console.log('🌐 公网访问地址:', url);
    console.log('📏 尺寸: 800x800 像素');
    console.log('🖨️  适合打印和分享');
  }
});
