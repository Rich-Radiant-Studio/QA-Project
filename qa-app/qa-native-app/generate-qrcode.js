const QRCode = require('qrcode');
const fs = require('fs');

const url = 'exp://atllyxa-anonymous-8082.exp.direct';

QRCode.toFile('expo-qrcode.png', url, {
  width: 400,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#ffffff'
  }
}, function (err) {
  if (err) throw err;
  console.log('二维码已生成: expo-qrcode.png');
  console.log('扫描地址: ' + url);
});
