# 需求文档

## 介绍

本文档定义了为React Native问答社区应用添加完整国际化支持的需求。应用已有基础的i18n框架（使用expo-localization和自定义SimpleI18n类），并且部分页面已实现国际化。本需求旨在系统化地为所有未国际化的页面和组件添加多语言支持，确保应用能够根据系统语言自动在中文(zh)和英文(en)之间切换。

## 术语表

- **I18n_System**: 应用的国际化系统，包括SimpleI18n类、翻译文件和useTranslation hook
- **Translation_Key**: 翻译键，用于在翻译文件中查找对应语言的文本，格式为点分隔的路径（如"screens.questionDetail.title"）
- **Translation_File**: 存储翻译文本的JSON文件，位于src/i18n/locales/目录下
- **Screen**: React Native页面组件，通常位于src/screens/目录
- **Component**: React Native可复用组件，通常位于src/components/目录
- **useTranslation_Hook**: 自定义React Hook，用于在组件中获取翻译函数
- **System_Language**: 设备的系统语言设置，由expo-localization检测
- **Hardcoded_Text**: 直接写在代码中的文本字符串，未使用翻译系统

## 需求

### 需求 1: 页面国际化

**用户故事:** 作为用户，我希望所有页面的文本都能根据我的系统语言显示，以便我能用母语使用应用。

#### 验收标准

1. WHEN 用户打开任何问题相关页面（QuestionDetailScreen, QuestionActivityListScreen, QuestionRankingScreen, QuestionBankScreen, QuestionTeamsScreen），THEN I18n_System SHALL 显示与System_Language对应的文本
2. WHEN 用户打开任何活动相关页面（ActivityScreen, CreateActivityScreen），THEN I18n_System SHALL 显示与System_Language对应的文本
3. WHEN 用户打开任何考试相关页面（WisdomIndexScreen, WisdomExamScreen, ExamDetailScreen, ExamHistoryScreen），THEN I18n_System SHALL 显示与System_Language对应的文本
4. WHEN 用户打开任何用户相关页面（SettingsScreen, ProfileScreen, InviteAnswerScreen, InviteTeamMemberScreen），THEN I18n_System SHALL 显示与System_Language对应的文本
5. WHEN 用户打开任何其他页面（SearchScreen, ReportScreen, UploadBankScreen, TeamDetailScreen, SupplementDetailScreen, SuperLikeHistoryScreen, SuperLikePurchaseScreen, MessagesScreen, GroupChatScreen, HotListScreen, IncomeRankingScreen, ContributorsScreen, AddRewardScreen, AnswerDetailScreen），THEN I18n_System SHALL 显示与System_Language对应的文本

### 需求 2: 组件国际化

**用户故事:** 作为用户，我希望所有可复用组件的文本都能根据我的系统语言显示，以便整个应用的语言体验保持一致。

#### 验收标准

1. WHEN 用户看到AnswerListItem组件，THEN I18n_System SHALL 显示与System_Language对应的文本
2. WHEN 用户看到QuestionListItem组件，THEN I18n_System SHALL 显示与System_Language对应的文本
3. WHEN 用户看到FavoriteListItem组件，THEN I18n_System SHALL 显示与System_Language对应的文本
4. WHEN 用户看到SuperLikeBalance组件，THEN I18n_System SHALL 显示与System_Language对应的文本
5. WHEN 用户看到UseSuperLikeButton组件，THEN I18n_System SHALL 显示与System_Language对应的文本
6. WHEN 用户看到IdentitySelector组件，THEN I18n_System SHALL 显示与System_Language对应的文本

### 需求 3: 翻译键组织

**用户故事:** 作为开发者，我希望翻译键按功能模块有序组织，以便我能快速找到和维护翻译文本。

#### 验收标准

1. WHEN 添加页面翻译键时，THEN Translation_File SHALL 将其组织在"screens.{pageName}"命名空间下
2. WHEN 添加组件翻译键时，THEN Translation_File SHALL 将其组织在"components.{componentName}"命名空间下
3. WHEN 添加通用翻译键时，THEN Translation_File SHALL 将其组织在"common"命名空间下
4. WHEN 翻译键名称被创建时，THEN Translation_Key SHALL 使用驼峰命名法（camelCase）且具有描述性
5. WHEN 同一文本在多处使用时，THEN I18n_System SHALL 复用现有Translation_Key而不是创建重复键

### 需求 4: 翻译文件完整性

**用户故事:** 作为用户，我希望所有支持的语言都有完整的翻译，以便我不会看到缺失的文本或错误的语言。

#### 验收标准

1. WHEN 在zh.json中添加Translation_Key时，THEN I18n_System SHALL 在en.json中添加对应的英文翻译
2. WHEN 在en.json中添加Translation_Key时，THEN I18n_System SHALL 在zh.json中添加对应的中文翻译
3. WHEN Translation_Key在某个Translation_File中缺失时，THEN I18n_System SHALL 返回默认语言的翻译或Translation_Key本身
4. WHEN 所有Hardcoded_Text被替换后，THEN I18n_System SHALL 确保zh.json和en.json具有相同的键结构

### 需求 5: 代码实现模式

**用户故事:** 作为开发者，我希望有统一的国际化实现模式，以便代码保持一致性和可维护性。

#### 验收标准

1. WHEN Screen或Component需要使用翻译时，THEN I18n_System SHALL 通过useTranslation_Hook获取翻译函数
2. WHEN 使用翻译函数时，THEN I18n_System SHALL 使用格式`t('namespace.key')`调用
3. WHEN 翻译文本包含动态变量时，THEN I18n_System SHALL 支持字符串插值（如`${variable}`）
4. WHEN 导入useTranslation_Hook时，THEN I18n_System SHALL 从'../i18n/withTranslation'路径导入
5. WHEN 移除Hardcoded_Text时，THEN I18n_System SHALL 保持原有的UI布局和样式不变

### 需求 6: 语言切换

**用户故事:** 作为用户，我希望应用能自动检测我的系统语言并显示对应的文本，以便我无需手动设置。

#### 验收标准

1. WHEN 应用启动时，THEN I18n_System SHALL 通过expo-localization检测System_Language
2. WHEN System_Language为中文（zh, zh-CN, zh-TW等）时，THEN I18n_System SHALL 使用zh.json中的翻译
3. WHEN System_Language为英文（en, en-US, en-GB等）时，THEN I18n_System SHALL 使用en.json中的翻译
4. WHEN System_Language不是zh或en时，THEN I18n_System SHALL 使用默认语言（en）的翻译
5. WHEN 用户更改设备系统语言后重启应用时，THEN I18n_System SHALL 显示新语言的翻译

### 需求 7: 特殊文本处理

**用户故事:** 作为用户，我希望日期、时间、数字等特殊格式的文本也能根据我的语言习惯显示，以便我能更自然地理解信息。

#### 验收标准

1. WHEN 显示相对时间（如"2小时前"）时，THEN I18n_System SHALL 使用对应语言的时间表达方式
2. WHEN 显示数字格式（如"25.6万"）时，THEN I18n_System SHALL 使用对应语言的数字表达习惯
3. WHEN 显示货币金额时，THEN I18n_System SHALL 保持货币符号（$）但使用对应语言的描述文本
4. WHEN 显示百分比时，THEN I18n_System SHALL 使用对应语言的百分比表达方式
5. WHEN 显示计数单位（如"人"、"次"）时，THEN I18n_System SHALL 使用对应语言的单位词

### 需求 8: 错误和提示信息

**用户故事:** 作为用户，我希望所有错误提示、确认对话框和Toast消息都能用我的语言显示，以便我能理解系统的反馈。

#### 验收标准

1. WHEN 系统显示错误消息时，THEN I18n_System SHALL 使用对应语言的错误文本
2. WHEN 系统显示确认对话框时，THEN I18n_System SHALL 使用对应语言的对话框文本
3. WHEN 系统显示Toast通知时，THEN I18n_System SHALL 使用对应语言的通知文本
4. WHEN 系统显示表单验证错误时，THEN I18n_System SHALL 使用对应语言的验证消息
5. WHEN 系统显示加载状态文本时，THEN I18n_System SHALL 使用对应语言的状态文本

### 需求 9: 占位符和空状态

**用户故事:** 作为用户，我希望输入框占位符、空状态提示等辅助文本也能用我的语言显示，以便我能理解如何使用界面。

#### 验收标准

1. WHEN 显示TextInput占位符时，THEN I18n_System SHALL 使用对应语言的占位符文本
2. WHEN 显示空列表状态时，THEN I18n_System SHALL 使用对应语言的空状态提示
3. WHEN 显示搜索无结果状态时，THEN I18n_System SHALL 使用对应语言的无结果提示
4. WHEN 显示加载失败状态时，THEN I18n_System SHALL 使用对应语言的失败提示
5. WHEN 显示引导文本时，THEN I18n_System SHALL 使用对应语言的引导内容

### 需求 10: 按钮和操作文本

**用户故事:** 作为用户，我希望所有按钮、链接和操作文本都能用我的语言显示，以便我能理解每个操作的含义。

#### 验收标准

1. WHEN 显示主要操作按钮（如"提交"、"保存"）时，THEN I18n_System SHALL 使用对应语言的按钮文本
2. WHEN 显示次要操作按钮（如"取消"、"返回"）时，THEN I18n_System SHALL 使用对应语言的按钮文本
3. WHEN 显示链接文本（如"查看详情"）时，THEN I18n_System SHALL 使用对应语言的链接文本
4. WHEN 显示Tab标签时，THEN I18n_System SHALL 使用对应语言的标签文本
5. WHEN 显示菜单项时，THEN I18n_System SHALL 使用对应语言的菜单文本
