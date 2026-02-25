const zh = require('./src/i18n/locales/zh.json');
const en = require('./src/i18n/locales/en.json');

function findKey(obj, path, currentPath = '') {
  for (const key in obj) {
    const newPath = currentPath ? `${currentPath}.${key}` : key;
    
    if (newPath.includes(path)) {
      console.log(`Found: ${newPath}`);
      if (typeof obj[key] === 'string') {
        console.log(`  Value (zh): ${obj[key]}`);
      }
    }
    
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      findKey(obj[key], path, newPath);
    }
  }
}

console.log('=== Searching for "questionDetail" in zh.json ===');
findKey(zh, 'questionDetail');

console.log('\n=== Searching for "actions.follow" in zh.json ===');
findKey(zh, 'actions.follow');

console.log('\n=== Testing specific paths ===');
console.log('zh.screens?.questionDetail?.actions?.follow:', zh.screens?.questionDetail?.actions?.follow);
console.log('zh.questionDetail?.actions?.follow:', zh.questionDetail?.actions?.follow);

// 查找所有包含 "follow" 的键
console.log('\n=== All paths containing "follow" ===');
findKey(zh, 'follow');
