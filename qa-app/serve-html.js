const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log(`请求: ${req.url}`);
  
  // 读取HTML文件
  const filePath = path.join(__dirname, 'ACCESS_PAGE.html');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('服务器错误');
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n✅ HTTP服务器已启动！`);
  console.log(`📍 本地访问: http://localhost:${PORT}`);
  console.log(`\n💡 提示: 使用 ngrok 创建公网链接:`);
  console.log(`   npx ngrok http ${PORT}\n`);
});
