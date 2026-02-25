# 翻译按钮已添加到 Hot List 页面

## 修改内容

### 1. 导入 TranslateButton 组件
```javascript
import TranslateButton from '../components/TranslateButton';
```

### 2. 修改 HotItem 组件
添加了翻译功能：
- 添加状态管理翻译后的文本
- 在标题下方添加翻译按钮
- 支持显示原文/译文切换

### 3. 添加样式
```javascript
translateButtonContainer: { marginTop: 6, marginBottom: 4 }
```

## 功能说明

### 翻译按钮行为
1. **自动检测**: 只在文本语言与系统语言不同时显示
2. **紧凑模式**: 使用 `compact={true}`，只显示图标
3. **点击翻译**: 第一次点击显示译文
4. **点击还原**: 再次点击显示原文

### 用户体验
- 系统语言为英文时，中文标题会显示翻译按钮
- 点击翻译按钮后，标题变为英文
- 再次点击可以切换回中文原文
- 翻译结果会被缓存，提高性能

## 测试步骤

1. 重新加载应用（按 `r` 键）
2. 进入 Hot List 页面
3. 查看每个问题标题下方是否有翻译按钮（地球图标）
4. 点击翻译按钮，标题应该变为英文
5. 再次点击，标题应该恢复为中文

## 技术细节

### TranslateButton 组件特性
- 使用 `translationService` 进行翻译
- 支持缓存机制，避免重复翻译
- 自动检测文本语言
- 支持紧凑模式（只显示图标）

### 状态管理
```javascript
const [translatedTitle, setTranslatedTitle] = useState(null);
const [showTranslated, setShowTranslated] = useState(false);
```

### 显示逻辑
```javascript
const displayTitle = showTranslated && translatedTitle ? translatedTitle : item.title;
```

## 其他可以添加翻译按钮的地方

如果需要，可以在以下地方也添加翻译按钮：
1. 问题详情页的问题标题
2. 回答内容
3. 评论内容
4. 用户简介
5. 活动描述

只需要按照相同的模式：
1. 导入 `TranslateButton`
2. 添加状态管理
3. 在需要翻译的文本下方添加按钮
4. 处理翻译回调

## 注意事项

- 翻译功能依赖 `translationService`
- 目前使用模拟翻译（实际应用需要接入真实翻译 API）
- 翻译按钮只在文本语言与系统语言不同时显示
- 使用紧凑模式以节省空间
