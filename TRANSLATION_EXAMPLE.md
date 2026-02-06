# 🌍 翻译示例

## 完整的翻译示例

### 示例 1：简单文本翻译

**之前的代码：**
```javascript
import React from 'react';
import { View, Text } from 'react-native';

function HomeScreen() {
  return (
    <View>
      <Text>首页</Text>
      <Text>搜索问题...</Text>
      <Text>关注</Text>
      <Text>推荐</Text>
    </View>
  );
}
```

**翻译后的代码：**
```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from '../i18n/withTranslation';

function HomeScreen() {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('tabs.home')}</Text>
      <Text>{t('home.search')}</Text>
      <Text>{t('home.follow')}</Text>
      <Text>{t('home.recommend')}</Text>
    </View>
  );
}
```

### 示例 2：带 placeholder 的输入框

**之前的代码：**
```javascript
<TextInput 
  placeholder="搜索问题..."
  value={searchText}
  onChangeText={setSearchText}
/>
```

**翻译后的代码：**
```javascript
const { t } = useTranslation();

<TextInput 
  placeholder={t('home.search')}
  value={searchText}
  onChangeText={setSearchText}
/>
```

### 示例 3：动态文本

**之前的代码：**
```javascript
<Text>{likes} 赞</Text>
<Text>{answers} 回答</Text>
<Text>{views} 浏览</Text>
```

**翻译后的代码：**
```javascript
const { t } = useTranslation();

<Text>{likes} {t('home.likes')}</Text>
<Text>{answers} {t('home.answers')}</Text>
<Text>{views} {t('question.views')}</Text>
```

### 示例 4：Alert 消息

**之前的代码：**
```javascript
alert('发布成功！');
alert('确定要删除吗？');
```

**翻译后的代码：**
```javascript
const { t } = useTranslation();

alert(t('common.publishSuccess'));
alert(t('common.confirmDelete'));
```

### 示例 5：按钮文本

**之前的代码：**
```javascript
<TouchableOpacity onPress={handleSubmit}>
  <Text>提交</Text>
</TouchableOpacity>

<TouchableOpacity onPress={handleCancel}>
  <Text>取消</Text>
</TouchableOpacity>
```

**翻译后的代码：**
```javascript
const { t } = useTranslation();

<TouchableOpacity onPress={handleSubmit}>
  <Text>{t('common.submit')}</Text>
</TouchableOpacity>

<TouchableOpacity onPress={handleCancel}>
  <Text>{t('common.cancel')}</Text>
</TouchableOpacity>
```

### 示例 6：数组数据

**之前的代码：**
```javascript
const tabs = ['关注', '话题', '推荐', '热榜'];

{tabs.map((tab, index) => (
  <Text key={index}>{tab}</Text>
))}
```

**翻译后的代码：**
```javascript
const { t } = useTranslation();

const tabs = [
  { key: 'follow', label: t('home.follow') },
  { key: 'topics', label: t('home.topics') },
  { key: 'recommend', label: t('home.recommend') },
  { key: 'hotList', label: t('home.hotList') }
];

{tabs.map((tab) => (
  <Text key={tab.key}>{tab.label}</Text>
))}
```

## 🎯 快速翻译清单

### 需要在每个文件中做的事情：

1. **导入翻译 Hook**
```javascript
import { useTranslation } from '../i18n/withTranslation';
```

2. **在组件中使用**
```javascript
function MyComponent() {
  const { t } = useTranslation();
  
  // 使用 t() 函数...
}
```

3. **替换所有中文文本**
- 找到所有 `<Text>中文</Text>`
- 替换为 `<Text>{t('key')}</Text>`
- 找到所有 `placeholder="中文"`
- 替换为 `placeholder={t('key')}`

## 📋 常用翻译键速查表

| 中文 | 翻译键 | 英文 |
|------|--------|------|
| 首页 | tabs.home | Home |
| 活动 | tabs.activity | Activity |
| 发布 | tabs.publish | Publish |
| 我的 | tabs.profile | Profile |
| 搜索 | common.search | Search |
| 取消 | common.cancel | Cancel |
| 确认 | common.confirm | Confirm |
| 提交 | common.submit | Submit |
| 保存 | common.save | Save |
| 删除 | common.delete | Delete |
| 编辑 | common.edit | Edit |
| 返回 | common.back | Back |
| 加载中 | common.loading | Loading... |
| 暂无数据 | common.noData | No data |

## 🚀 实施建议

由于你的 APP 有 20+ 个页面，建议：

1. **先翻译 5 个核心页面**（我可以帮你完成）
   - App.js（紧急求助弹窗）
   - HomeScreen.js
   - ProfileScreen.js  
   - PublishScreen.js
   - QuestionDetailScreen.js

2. **测试这 5 个页面**，确保翻译正确

3. **根据模式翻译其余页面**

需要我现在帮你翻译这 5 个核心页面吗？
