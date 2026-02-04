const fs = require('fs');
const path = require('path');

const files = [
  'src/screens/TeamDetailScreen.js',
  'src/screens/SupplementDetailScreen.js',
  'src/screens/SettingsScreen.js',
  'src/screens/SearchScreen.js',
  'src/screens/QuestionDetailScreen.js',
  'src/screens/QuestionActivityListScreen.js',
  'src/screens/PublishScreen.js',
  'src/screens/ProfileScreen.js',
  'src/screens/MyTeamsScreen.js',
  'src/screens/MessagesScreen.js',
  'src/screens/LoginScreen.js',
  'src/screens/GroupChatScreen.js',
  'src/screens/FollowScreen.js',
  'src/screens/AnswerDetailScreen.js',
  'src/screens/ActivityScreen.js',
  'src/screens/HotListScreen.js'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  文件不存在: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否已经使用了正确的导入
  if (content.includes("from 'react-native-safe-area-context'")) {
    console.log(`✅ 已更新: ${file}`);
    return;
  }
  
  // 替换导入语句
  const oldImportPattern = /import\s+{([^}]*SafeAreaView[^}]*)}\s+from\s+'react-native';/;
  const match = content.match(oldImportPattern);
  
  if (match) {
    const imports = match[1];
    // 移除SafeAreaView
    const newImports = imports.split(',').map(i => i.trim()).filter(i => i !== 'SafeAreaView').join(', ');
    
    // 替换原导入
    content = content.replace(oldImportPattern, `import { ${newImports} } from 'react-native';`);
    
    // 添加SafeAreaView导入
    content = content.replace(
      /import { ([^}]+) } from 'react-native';/,
      `import { $1 } from 'react-native';\nimport { SafeAreaView } from 'react-native-safe-area-context';`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ 已修复: ${file}`);
  } else {
    console.log(`⚠️  未找到SafeAreaView导入: ${file}`);
  }
});

console.log('\n🎉 所有文件处理完成！');
