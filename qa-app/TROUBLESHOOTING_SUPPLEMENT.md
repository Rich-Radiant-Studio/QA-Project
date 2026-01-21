# 补充问题跳转问题 - 故障排查指南

## 🔍 问题描述
点击补充问题卡片后没有跳转到补充问题详情页

## ✅ 检查清单

### 1. 确认路由配置
检查 `App.js` 中是否正确配置了路由:

```javascript
// 1. 检查导入
import SupplementDetailScreen from './src/screens/SupplementDetailScreen';

// 2. 检查路由配置
<Stack.Screen name="SupplementDetail" component={SupplementDetailScreen} />
```

**验证方法:**
- 打开 `qa-app/qa-native-app/App.js`
- 搜索 "SupplementDetail"
- 确认有导入和路由配置

### 2. 重新启动应用
路由配置更改后需要重新启动应用:

```bash
# 停止当前运行的应用 (Ctrl+C)
# 然后重新启动
cd qa-app/qa-native-app
npm start
# 或
expo start
```

**重要:** 按 `r` 键重新加载可能不够,需要完全重启

### 3. 清除缓存
如果重启后仍然不工作,尝试清除缓存:

```bash
cd qa-app/qa-native-app

# 清除 Expo 缓存
expo start -c

# 或者清除 npm 缓存
rm -rf node_modules
npm install
npm start
```

### 4. 检查控制台错误
查看终端或浏览器控制台是否有错误信息:

- 红色错误信息
- 黄色警告信息
- 导航相关的错误

### 5. 添加调试日志
在点击事件中添加 console.log 来调试:

```javascript
<TouchableOpacity 
  onPress={() => {
    console.log('点击补充问题:', item.id);
    console.log('导航到 SupplementDetail');
    navigation.navigate('SupplementDetail', { supplement: item });
  }}
>
```

### 6. 验证 navigation 对象
确认 QuestionDetailScreen 接收到了 navigation 对象:

```javascript
export default function QuestionDetailScreen({ navigation, route }) {
  console.log('navigation 对象:', navigation);
  console.log('可用的路由:', navigation.getState());
  // ...
}
```

### 7. 检查 TouchableOpacity 是否被覆盖
确认没有其他元素覆盖在 TouchableOpacity 上:

```javascript
// 检查 zIndex 和 position 样式
suppCard: { 
  padding: 16, 
  borderBottomWidth: 1, 
  borderBottomColor: '#f3f4f6',
  // 不应该有 pointerEvents: 'none'
}
```

## 🔧 快速修复步骤

### 步骤 1: 验证文件存在
```bash
# 检查文件是否存在
ls qa-app/qa-native-app/src/screens/SupplementDetailScreen.js
```

### 步骤 2: 验证导入路径
在 App.js 中:
```javascript
// 确保路径正确
import SupplementDetailScreen from './src/screens/SupplementDetailScreen';
```

### 步骤 3: 完全重启应用
```bash
# 1. 停止应用 (Ctrl+C)
# 2. 清除缓存并重启
cd qa-app/qa-native-app
expo start -c
```

### 步骤 4: 测试导航
在 QuestionDetailScreen 中添加测试按钮:
```javascript
<TouchableOpacity 
  style={{ padding: 20, backgroundColor: 'red' }}
  onPress={() => {
    console.log('测试导航');
    navigation.navigate('SupplementDetail', { 
      supplement: supplementQuestions[0] 
    });
  }}
>
  <Text style={{ color: 'white' }}>测试跳转</Text>
</TouchableOpacity>
```

## 🐛 常见问题

### 问题 1: "Cannot read property 'navigate' of undefined"
**原因:** navigation 对象未传递
**解决:** 确保 QuestionDetailScreen 在 Stack.Navigator 中

### 问题 2: "The action 'NAVIGATE' with payload ... was not handled"
**原因:** 路由未配置
**解决:** 在 App.js 中添加路由配置

### 问题 3: 点击没有反应
**原因:** 可能是事件被子元素拦截
**解决:** 检查子元素的 stopPropagation

### 问题 4: 应用崩溃
**原因:** SupplementDetailScreen 有语法错误
**解决:** 检查文件语法,运行 `npm run lint`

## 📝 验证代码

### App.js (第20行)
```javascript
import SupplementDetailScreen from './src/screens/SupplementDetailScreen';
```

### App.js (第270行)
```javascript
<Stack.Screen name="SupplementDetail" component={SupplementDetailScreen} />
```

### QuestionDetailScreen.js (第269行)
```javascript
onPress={() => navigation.navigate('SupplementDetail', { supplement: item })}
```

## 🎯 测试方法

### 方法 1: 添加 Alert
```javascript
<TouchableOpacity 
  onPress={() => {
    alert('点击了补充问题: ' + item.id);
    navigation.navigate('SupplementDetail', { supplement: item });
  }}
>
```

### 方法 2: 使用 console.log
```javascript
<TouchableOpacity 
  onPress={() => {
    console.log('=== 补充问题点击 ===');
    console.log('ID:', item.id);
    console.log('作者:', item.author);
    console.log('导航对象:', navigation);
    navigation.navigate('SupplementDetail', { supplement: item });
  }}
>
```

### 方法 3: 检查路由状态
```javascript
useEffect(() => {
  console.log('当前路由:', navigation.getState());
}, []);
```

## 🔄 完整重置流程

如果以上都不工作,执行完整重置:

```bash
# 1. 停止应用
# Ctrl+C

# 2. 删除缓存
cd qa-app/qa-native-app
rm -rf node_modules
rm -rf .expo
rm package-lock.json

# 3. 重新安装
npm install

# 4. 清除缓存启动
expo start -c

# 5. 在新终端重新加载
# 按 'r' 重新加载
# 或按 'a' 在 Android 上运行
# 或按 'i' 在 iOS 上运行
```

## 📞 获取帮助

如果问题仍然存在:

1. 检查终端的完整错误信息
2. 检查浏览器控制台的错误
3. 截图错误信息
4. 提供以下信息:
   - 操作系统
   - Node.js 版本 (`node -v`)
   - npm 版本 (`npm -v`)
   - Expo 版本 (`expo --version`)
   - 完整的错误日志

## ✅ 成功标志

导航成功的标志:
- 点击补充问题后有页面切换动画
- 新页面显示补充问题详情
- 顶部显示"补充问题详情"标题
- 可以点击返回按钮回到问题详情页
- 控制台没有错误信息

## 🎉 验证成功

测试以下场景:
1. ✅ 点击第一个补充问题
2. ✅ 点击第二个补充问题
3. ✅ 点击第三个补充问题
4. ✅ 点击第四个补充问题
5. ✅ 每次都能正确跳转
6. ✅ 显示的内容与点击的补充问题匹配
7. ✅ 返回按钮正常工作
