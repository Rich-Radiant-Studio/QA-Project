const QRCode = require('qrcode');
const fs = require('fs');

const tunnelUrl = 'exp://atllyxa-anonymous-8081.exp.direct';

// 生成大尺寸二维码
QRCode.toFile('expo-tunnel-qrcode.png', tunnelUrl, {
  width: 800,
  margin: 2,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, function (err) {
  if (err) {
    console.error('生成二维码失败:', err);
  } else {
    console.log('✅ 二维码已生成: expo-tunnel-qrcode.png');
    console.log('📱 公网链接:', tunnelUrl);
    console.log('\n使用方法:');
    console.log('1. 在手机上安装 Expo Go 应用');
    console.log('2. 打开 Expo Go，扫描生成的二维码');
    console.log('3. 或者直接在 Expo Go 中输入链接');
  }
});

// 同时生成 HTML 页面
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QA App - 公网访问</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .qrcode-wrapper {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
        }
        .qrcode-wrapper img {
            width: 100%;
            max-width: 300px;
            height: auto;
        }
        .url-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            word-break: break-all;
            font-family: monospace;
            font-size: 12px;
            color: #495057;
        }
        .instructions {
            text-align: left;
            background: #e7f3ff;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .instructions h3 {
            color: #0066cc;
            margin-bottom: 15px;
            font-size: 16px;
        }
        .instructions ol {
            margin-left: 20px;
            color: #333;
        }
        .instructions li {
            margin-bottom: 10px;
            line-height: 1.6;
        }
        .badge {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            margin-bottom: 20px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 QA App</h1>
        <div class="subtitle">React Native 问答应用</div>
        <div class="badge">✓ 公网访问已启用</div>
        
        <div class="qrcode-wrapper">
            <img src="expo-tunnel-qrcode.png" alt="QR Code">
        </div>
        
        <div class="url-box">
            ${tunnelUrl}
        </div>
        
        <div class="instructions">
            <h3>📱 使用说明</h3>
            <ol>
                <li>在手机上下载并安装 <strong>Expo Go</strong> 应用
                    <br>• iOS: App Store 搜索 "Expo Go"
                    <br>• Android: Google Play 或应用商店搜索 "Expo Go"
                </li>
                <li>打开 Expo Go 应用</li>
                <li>使用应用内的扫码功能扫描上方二维码</li>
                <li>或者在 Expo Go 中手动输入上方链接</li>
                <li>等待应用加载完成即可使用</li>
            </ol>
        </div>
        
        <div class="footer">
            ⚡ Tunnel 模式 | 可在任何网络环境访问
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync('expo-tunnel-page.html', html);
console.log('✅ HTML 页面已生成: expo-tunnel-page.html');
