const QRCode = require('qrcode');
const fs = require('fs');

// Expo公网访问地址
const expoUrl = 'exp://atllyxa-anonymous-8081.exp.direct';

// 生成二维码并保存为图片
QRCode.toFile('expo-public-qrcode.png', expoUrl, {
  width: 400,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, function (err) {
  if (err) {
    console.error('生成二维码失败:', err);
  } else {
    console.log('✅ 二维码已生成: expo-public-qrcode.png');
    console.log('📱 Expo公网访问地址:', expoUrl);
    console.log('\n使用方法:');
    console.log('1. 在手机上安装 Expo Go 应用');
    console.log('2. 打开 Expo Go，扫描二维码');
    console.log('3. 或者直接在 Expo Go 中输入上面的地址');
  }
});
