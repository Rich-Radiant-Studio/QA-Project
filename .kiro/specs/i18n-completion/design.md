# 设计文档

## 概述

本设计文档描述了为React Native问答社区应用添加完整国际化支持的技术实现方案。应用已有基础的i18n框架（SimpleI18n类和useTranslation hook），本设计将系统化地为所有未国际化的页面和组件添加多语言支持。

设计目标：
- 为20+个未国际化页面添加多语言支持
- 为6个核心组件添加多语言支持
- 建立清晰的翻译键命名和组织规范
- 确保中英文翻译文件的完整性和一致性
- 保持代码的可维护性和可扩展性

## 架构

### 现有i18n架构

应用已有的国际化架构包括：

1. **SimpleI18n类** (src/i18n/index.js)
   - 管理翻译资源和当前语言
   - 提供`t(key)`方法用于获取翻译文本
   - 自动检测系统语言（通过expo-localization）
   - 支持fallback机制（当前语言缺失时使用默认语言）

2. **useTranslation Hook** (src/i18n/withTranslation.js)
   - 提供React组件访问翻译函数的接口
   - 返回`{ t }`对象，其中`t`是翻译函数

3. **翻译文件**
   - src/i18n/locales/zh.json - 中文翻译
   - src/i18n/locales/en.json - 英文翻译
   - 使用嵌套JSON结构组织翻译键

### 扩展架构设计

本设计将在现有架构基础上扩展：

```
src/
├── i18n/
│   ├── index.js                 # SimpleI18n类（已存在）
│   ├── withTranslation.js       # useTranslation hook（已存在）
│   └── locales/
│       ├── zh.json              # 中文翻译（扩展）
│       └── en.json              # 英文翻译（扩展）
├── screens/                     # 页面组件（添加国际化）
│   ├── QuestionDetailScreen.js
│   ├── QuestionActivityListScreen.js
│   ├── QuestionRankingScreen.js
│   ├── QuestionBankScreen.js
│   ├── QuestionTeamsScreen.js
│   ├── ActivityScreen.js
│   ├── CreateActivityScreen.js
│   ├── WisdomIndexScreen.js
│   ├── WisdomExamScreen.js
│   ├── ExamDetailScreen.js
│   ├── ExamHistoryScreen.js
│   ├── SettingsScreen.js
│   ├── ProfileScreen.js
│   ├── InviteAnswerScreen.js
│   ├── InviteTeamMemberScreen.js
│   ├── SearchScreen.js
│   ├── ReportScreen.js
│   ├── UploadBankScreen.js
│   ├── TeamDetailScreen.js
│   ├── SupplementDetailScreen.js
│   ├── SuperLikeHistoryScreen.js
│   ├── SuperLikePurchaseScreen.js
│   ├── MessagesScreen.js
│   ├── GroupChatScreen.js
│   ├── HotListScreen.js
│   ├── IncomeRankingScreen.js
│   ├── ContributorsScreen.js
│   ├── AddRewardScreen.js
│   └── AnswerDetailScreen.js
└── components/                  # 组件（添加国际化）
    ├── AnswerListItem.js
    ├── QuestionListItem.js
    ├── FavoriteListItem.js
    ├── SuperLikeBalance.js
    ├── UseSuperLikeButton.js
    └── IdentitySelector.js
```

## 组件和接口

### 翻译键命名规范

翻译键使用点分隔的命名空间结构，遵循以下规范：

1. **页面翻译键**: `screens.{pageName}.{key}`
   - 示例: `screens.questionDetail.title`
   - 示例: `screens.questionDetail.tabs.supplements`

2. **组件翻译键**: `components.{componentName}.{key}`
   - 示例: `components.answerListItem.adopted`
   - 示例: `components.questionListItem.views`

3. **通用翻译键**: `common.{key}`
   - 示例: `common.loading`
   - 示例: `common.confirm`

4. **命名约定**:
   - 使用驼峰命名法（camelCase）
   - 使用描述性名称
   - 避免缩写（除非是广泛认可的缩写）
   - 复用现有的通用键（如common命名空间中的键）

### 页面国际化接口

每个页面组件将遵循以下模式：

```javascript
import { useTranslation } from '../i18n/withTranslation';

export default function ExampleScreen({ navigation }) {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('screens.example.title')}</Text>
      <Button title={t('common.submit')} />
    </View>
  );
}
```

### 组件国际化接口

可复用组件将遵循以下模式：

```javascript
import { useTranslation } from '../i18n/withTranslation';

export default function ExampleComponent({ item }) {
  const { t } = useTranslation();
  
  return (
    <View>
      <Text>{t('components.example.label')}</Text>
      <Text>{item.value}</Text>
    </View>
  );
}
```

### 动态文本处理

对于包含动态变量的文本，使用模板字符串：

```javascript
// 翻译文件中
{
  "screens.example.greeting": "Hello, {name}!"
}

// 组件中
const greeting = t('screens.example.greeting').replace('{name}', userName);
// 或使用模板字符串
const greeting = `${t('screens.example.greetingPrefix')} ${userName}${t('screens.example.greetingSuffix')}`;
```

## 数据模型

### 翻译文件结构

翻译文件使用嵌套JSON结构，按功能模块组织：

```json
{
  "screens": {
    "questionDetail": {
      "title": "问题详情",
      "tabs": {
        "supplements": "补充",
        "answers": "回答",
        "comments": "评论",
        "invite": "邀请"
      },
      "actions": {
        "follow": "关注",
        "answer": "回答",
        "share": "分享",
        "report": "举报"
      },
      "stats": {
        "views": "浏览",
        "answers": "回答",
        "followers": "关注者"
      }
    }
  },
  "components": {
    "answerListItem": {
      "adopted": "已采纳",
      "justNow": "刚刚",
      "hoursAgo": "小时前",
      "yesterday": "昨天",
      "daysAgo": "天前"
    }
  },
  "common": {
    "loading": "加载中...",
    "confirm": "确认",
    "cancel": "取消",
    "submit": "提交",
    "save": "保存",
    "delete": "删除",
    "edit": "编辑"
  }
}
```

### 翻译键映射表

为确保翻译的完整性，需要维护一个翻译键映射表（在实现过程中）：

| 翻译键 | 中文 | 英文 | 使用位置 |
|--------|------|------|----------|
| screens.questionDetail.title | 问题详情 | Question Detail | QuestionDetailScreen |
| components.answerListItem.adopted | 已采纳 | Adopted | AnswerListItem |
| common.loading | 加载中... | Loading... | 多处 |

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 属性 1: 翻译键存在性

*对于任何*在代码中使用的翻译键，zh.json和en.json中都应该存在对应的翻译文本。

**验证: 需求 4.1, 4.2, 4.4**

### 属性 2: 翻译键结构一致性

*对于任何*翻译文件（zh.json或en.json），其JSON结构（键的层级和路径）应该完全一致。

**验证: 需求 4.4**

### 属性 3: 硬编码文本消除

*对于任何*已国际化的页面或组件，不应该存在硬编码的用户可见文本（除了开发调试信息）。

**验证: 需求 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

### 属性 4: 翻译函数调用正确性

*对于任何*使用翻译的组件，应该通过useTranslation hook获取翻译函数，并使用`t('key')`格式调用。

**验证: 需求 5.1, 5.2, 5.4**

### 属性 5: 语言切换响应性

*对于任何*系统语言设置，应用应该显示对应语言的翻译文本（zh对应中文，en对应英文，其他对应默认语言）。

**验证: 需求 6.1, 6.2, 6.3, 6.4, 6.5**

### 属性 6: UI布局保持性

*对于任何*已国际化的页面或组件，在不同语言下的UI布局和样式应该保持一致（除了文本长度导致的自然变化）。

**验证: 需求 5.5**

### 属性 7: 翻译键命名规范性

*对于任何*新增的翻译键，应该遵循命名规范（使用驼峰命名法，具有描述性，按模块组织）。

**验证: 需求 3.1, 3.2, 3.3, 3.4**

### 属性 8: 翻译键复用性

*对于任何*在多处使用的相同文本，应该复用同一个翻译键而不是创建重复的键。

**验证: 需求 3.5**

### 属性 9: 特殊文本格式化

*对于任何*特殊格式的文本（日期、时间、数字、货币），应该使用对应语言的格式化方式。

**验证: 需求 7.1, 7.2, 7.3, 7.4, 7.5**

### 属性 10: 错误消息国际化

*对于任何*用户可见的错误消息、提示、对话框，应该使用翻译系统而不是硬编码文本。

**验证: 需求 8.1, 8.2, 8.3, 8.4, 8.5**

## 错误处理

### 翻译键缺失处理

当翻译键在当前语言的翻译文件中缺失时：

1. SimpleI18n类会尝试使用默认语言（en）的翻译
2. 如果默认语言也缺失，返回翻译键本身
3. 在开发环境中，应该在控制台输出警告信息

```javascript
// SimpleI18n类中的处理逻辑（已存在）
t(key) {
  const keys = key.split('.');
  let translation = this.translations[this.locale];
  
  if (!translation) {
    translation = this.translations[this.defaultLocale];
  }
  
  for (const k of keys) {
    if (translation && typeof translation === 'object') {
      translation = translation[k];
    } else {
      // Fallback to default locale
      let fallback = this.translations[this.defaultLocale];
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object') {
          fallback = fallback[fk];
        } else {
          return key; // Return key if not found
        }
      }
      return fallback || key;
    }
  }
  
  return translation || key;
}
```

### 语言检测失败处理

当expo-localization无法检测系统语言时：

1. 使用默认语言（en）
2. 记录错误日志
3. 应用继续正常运行

### 翻译文件加载失败处理

当翻译文件加载失败时：

1. 使用内置的最小翻译集（包含关键文本）
2. 显示错误提示
3. 尝试重新加载

## 测试策略

### 单元测试

单元测试用于验证特定示例、边缘情况和错误条件：

1. **翻译键存在性测试**
   - 测试所有在代码中使用的翻译键在zh.json和en.json中都存在
   - 测试翻译文件的JSON结构有效性

2. **翻译函数测试**
   - 测试`t()`函数正确返回翻译文本
   - 测试翻译键缺失时的fallback行为
   - 测试嵌套翻译键的访问

3. **语言切换测试**
   - 测试系统语言为zh时使用中文翻译
   - 测试系统语言为en时使用英文翻译
   - 测试不支持的语言使用默认语言

4. **组件渲染测试**
   - 测试组件在不同语言下正确渲染
   - 测试动态文本正确插值

### 属性测试

属性测试用于验证通用属性在所有输入下都成立：

**配置**: 使用fast-check库，每个测试运行最少100次迭代

**属性测试 1: 翻译键结构一致性**
- **属性**: 对于任何翻译文件，zh.json和en.json的键结构应该完全一致
- **标签**: Feature: i18n-completion, Property 2: Translation key structure consistency
- **实现**: 递归比较两个JSON对象的键结构

**属性测试 2: 翻译键命名规范**
- **属性**: 对于任何翻译键，应该符合命名规范（驼峰命名法，无特殊字符）
- **标签**: Feature: i18n-completion, Property 7: Translation key naming convention
- **实现**: 使用正则表达式验证所有翻译键的命名

**属性测试 3: 翻译文本非空**
- **属性**: 对于任何翻译键，其对应的翻译文本不应该为空字符串
- **标签**: Feature: i18n-completion, Property 1: Translation key existence
- **实现**: 遍历所有翻译键，验证值非空

### 集成测试

集成测试用于验证端到端的国际化流程：

1. **页面国际化集成测试**
   - 测试页面在不同语言下的完整渲染
   - 测试页面切换语言后的重新渲染

2. **组件国际化集成测试**
   - 测试组件在不同语言下的交互
   - 测试组件接收不同语言的props

3. **导航国际化集成测试**
   - 测试导航标题和按钮的国际化
   - 测试页面间导航时语言保持一致

### 手动测试

手动测试用于验证视觉效果和用户体验：

1. **视觉回归测试**
   - 在不同语言下截图对比
   - 验证文本长度变化不会破坏布局

2. **用户体验测试**
   - 验证翻译文本的准确性和自然性
   - 验证文化适应性（如日期格式、数字格式）

3. **设备测试**
   - 在不同系统语言的设备上测试
   - 验证语言自动检测功能

### 测试覆盖率目标

- 单元测试覆盖率: 90%以上
- 属性测试: 覆盖所有关键正确性属性
- 集成测试: 覆盖所有主要用户流程
- 手动测试: 覆盖所有页面和组件

### 测试工具

- **单元测试**: Jest + React Native Testing Library
- **属性测试**: fast-check
- **集成测试**: Detox (可选)
- **视觉测试**: 手动截图对比或使用视觉回归测试工具
