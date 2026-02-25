# 翻译键映射文档 / Translation Key Mapping Document

本文档记录了应用中所有翻译键的映射关系，包括中文、英文翻译以及使用位置。

This document records the mapping of all translation keys in the application, including Chinese and English translations and their usage locations.

## 使用说明 / Usage Instructions

- **翻译键 (Translation Key)**: 用于代码中引用的键路径，格式为 `namespace.key`
- **中文 (Chinese)**: 中文翻译文本
- **英文 (English)**: 英文翻译文本
- **使用位置 (Usage Location)**: 该翻译键在代码中的使用位置

## 命名规范 / Naming Conventions

1. **页面翻译键**: `screens.{pageName}.{key}`
   - 示例: `screens.questionDetail.title`

2. **组件翻译键**: `components.{componentName}.{key}`
   - 示例: `components.answerListItem.adopted`

3. **通用翻译键**: `common.{key}`
   - 示例: `common.loading`

## 翻译键映射表 / Translation Key Mapping Table

### Common 命名空间 / Common Namespace

| 翻译键 | 中文 | 英文 | 使用位置 |
|--------|------|------|----------|
| common.cancel | 取消 | Cancel | 多处 / Multiple locations |
| common.confirm | 确认 | Confirm | 多处 / Multiple locations |
| common.save | 保存 | Save | 多处 / Multiple locations |
| common.delete | 删除 | Delete | 多处 / Multiple locations |
| common.edit | 编辑 | Edit | 多处 / Multiple locations |
| common.loading | 加载中... | Loading... | 多处 / Multiple locations |
| common.noData | 暂无数据 | No data | 多处 / Multiple locations |
| common.loadMore | 加载更多 | Load more | 多处 / Multiple locations |
| common.refresh | 刷新 | Refresh | 多处 / Multiple locations |
| common.submit | 提交 | Submit | 多处 / Multiple locations |
| common.back | 返回 | Back | 多处 / Multiple locations |
| common.next | 下一步 | Next | 多处 / Multiple locations |
| common.done | 完成 | Done | 多处 / Multiple locations |
| common.close | 关闭 | Close | 多处 / Multiple locations |
| common.ok | 确定 | OK | 多处 / Multiple locations |
| common.yes | 是 | Yes | 多处 / Multiple locations |
| common.no | 否 | No | 多处 / Multiple locations |
| common.all | 全部 | All | 多处 / Multiple locations |
| common.filter | 筛选 | Filter | 多处 / Multiple locations |
| common.sort | 排序 | Sort | 多处 / Multiple locations |
| common.search | 搜索 | Search | 多处 / Multiple locations |
| common.translate | 查看翻译 | See translation | 多处 / Multiple locations |
| common.translating | 翻译中... | Translating... | 多处 / Multiple locations |
| common.showOriginal | 显示原文 | Show original | 多处 / Multiple locations |
| common.translateError | 翻译失败 | Translation failed | 多处 / Multiple locations |
| common.share | 分享 | Share | 多处 / Multiple locations |
| common.report | 举报 | Report | 多处 / Multiple locations |
| common.block | 拉黑 | Block | 多处 / Multiple locations |
| common.retry | 重试 | Retry | 多处 / Multiple locations |
| common.goBack | 返回 | Go back | 多处 / Multiple locations |
| common.noMoreContent | 没有更多内容了 | No more content | 多处 / Multiple locations |
| common.follow | 关注 | Follow | 多处 / Multiple locations |
| common.unfollow | 取消关注 | Unfollow | 多处 / Multiple locations |
| common.views | 浏览 | views | 多处 / Multiple locations |
| common.answers | 回答 | answers | 多处 / Multiple locations |
| common.likes | 赞 | likes | 多处 / Multiple locations |
| common.comments | 评论 | comments | 多处 / Multiple locations |
| common.followers | 关注者 | followers | 多处 / Multiple locations |
| common.following | 关注 | following | 多处 / Multiple locations |
| common.questions | 问题 | questions | 多处 / Multiple locations |

### Screens 命名空间 / Screens Namespace

#### ExamDetailScreen

| 翻译键 | 中文 | 英文 | 使用位置 |
|--------|------|------|----------|
| screens.examDetail.title | 考核详情 | Exam Details | ExamDetailScreen - 页面标题 |
| screens.examDetail.scoreLabel | 考核成绩 | Exam Score | ExamDetailScreen - 分数标签 |
| screens.examDetail.scoreUnit | 分 | pts | ExamDetailScreen - 分数单位 |
| screens.examDetail.stats.correct | 答对 | Correct | ExamDetailScreen - 答对统计 |
| screens.examDetail.stats.wrong | 答错 | Wrong | ExamDetailScreen - 答错统计 |
| screens.examDetail.stats.duration | 用时 | Duration | ExamDetailScreen - 用时统计 |
| screens.examDetail.examTime | 考试时间： | Exam Time:  | ExamDetailScreen - 考试时间标签 |
| screens.examDetail.questionsTitle | 答题详情 | Answer Details | ExamDetailScreen - 答题详情标题 |
| screens.examDetail.questionNumber | 第 {number} 题 | Question {number} | ExamDetailScreen - 题目编号 |
| screens.examDetail.status.correct | 正确 | Correct | ExamDetailScreen - 正确状态 |
| screens.examDetail.status.wrong | 错误 | Wrong | ExamDetailScreen - 错误状态 |
| screens.examDetail.answerNote.yourAnswer | 您的答案： | Your Answer:  | ExamDetailScreen - 用户答案标签 |
| screens.examDetail.answerNote.correctAnswer | 正确答案： | Correct Answer:  | ExamDetailScreen - 正确答案标签 |
| screens.examDetail.rank.excellent | 优秀 | Excellent | ExamDetailScreen - 优秀等级 |
| screens.examDetail.rank.good | 良好 | Good | ExamDetailScreen - 良好等级 |
| screens.examDetail.rank.pass | 及格 | Pass | ExamDetailScreen - 及格等级 |
| screens.examDetail.rank.fail | 不及格 | Fail | ExamDetailScreen - 不及格等级 |

#### ExamHistoryScreen

| 翻译键 | 中文 | 英文 | 使用位置 |
|--------|------|------|----------|
| screens.examHistory.title | 考核历史 | Exam History | ExamHistoryScreen - 页面标题 |

#### SuperLikePurchaseScreen

| 翻译键 | 中文 | 英文 | 使用位置 |
|--------|------|------|----------|
| superLike.purchase.title | 购买超级赞 | Purchase Super Likes | SuperLikePurchaseScreen - 页面标题 |
| superLike.purchase.currentBalance | 当前余额 | Current Balance | SuperLikePurchaseScreen - 当前余额标签 |
| superLike.credits | 次 | credits | SuperLikePurchaseScreen - 次数单位 |
| superLike.purchase.infoDescription | 购买超级赞次数后，您可以在任意回答上使用它们来提升排名 | After purchasing super likes, you can use them on any answer to boost ranking | SuperLikePurchaseScreen - 信息描述 |
| superLike.purchase.selectAmount | 选择购买数量 | Select Amount | SuperLikePurchaseScreen - 选择数量标题 |
| superLike.purchase.customAmount | 或输入自定义数量 | Or enter custom amount | SuperLikePurchaseScreen - 自定义数量标题 |
| superLike.purchase.minAmount | 最少 1 个 | Minimum 1 | SuperLikePurchaseScreen - 最小数量占位符 |
| superLike.purchase.unitPrice | 单价 | Unit Price | SuperLikePurchaseScreen - 单价标签 |
| superLike.purchase.pricePerCredit | $2 / 次 | $2 / credit | SuperLikePurchaseScreen - 单价值 |
| superLike.purchase.quantity | 购买数量 | Quantity | SuperLikePurchaseScreen - 数量标签 |
| superLike.purchase.total | 总计 | Total | SuperLikePurchaseScreen - 总计标签 |
| superLike.purchase.tipsText | 购买超级赞次数后，您可以在任意回答上使用它们来提升排名，增加曝光机会 | After purchasing super likes, you can use them on any answer to boost ranking and increase exposure | SuperLikePurchaseScreen - 提示文本 |
| superLike.purchase.processing | 处理中... | Processing... | SuperLikePurchaseScreen - 处理中状态 |
| superLike.purchase.confirmButton | 立即购买 {amount} 个超级赞 | Purchase {amount} Super Likes | SuperLikePurchaseScreen - 确认按钮 |
| superLike.purchase.cancelButton | 取消 | Cancel | SuperLikePurchaseScreen - 取消按钮 |
| superLike.purchase.alertTitle | 提示 | Notice | SuperLikePurchaseScreen - 提示对话框标题 |
| superLike.purchase.alertInvalidAmount | 请输入有效的购买数量 | Please enter a valid amount | SuperLikePurchaseScreen - 无效数量提示 |
| superLike.purchase.alertInvalidRange | 请输入有效的购买数量（1-100） | Please enter a valid amount (1-100) | SuperLikePurchaseScreen - 数量范围提示 |
| superLike.purchase.successTitle | 购买成功 | Purchase Successful | SuperLikePurchaseScreen - 成功对话框标题 |
| superLike.purchase.successMessage | 成功购买 {amount} 个超级赞！\n花费：${cost}\n您可以在任意回答上使用它们！ | Successfully purchased {amount} super likes!\nCost: ${cost}\nYou can use them on any answer! | SuperLikePurchaseScreen - 成功消息 |
| superLike.purchase.alertPurchaseFailed | 购买失败，请稍后重试 | Purchase failed, please try again later | SuperLikePurchaseScreen - 购买失败提示 |
| common.confirm | 确定 | Confirm | SuperLikePurchaseScreen - 确认按钮 |

#### HotListScreen

| 翻译键 | 中文 | 英文 | 使用位置 |
|--------|------|------|----------|
| screens.hotListScreen.title | 热榜 | Hot List | HotListScreen - 页面标题 |
| screens.hotListScreen.hotLabel | 热度 | Heat | HotListScreen - 热度标签 |
| screens.hotListScreen.answersCount | 回答 | answers | HotListScreen - 回答数量后缀 |
| screens.hotListScreen.allTab | 全部 | All | HotListScreen - 全部标签 |
| screens.hotListScreen.updatedAt | 更新于 {time} | Updated {time} ago | HotListScreen - 更新时间 |
| screens.hotListScreen.selectRegion | 选择区域 | Select Region | HotListScreen - 选择区域标题 |
| screens.hotListScreen.country | 国家 | Country | HotListScreen - 国家标签 |
| screens.hotListScreen.city | 城市 | City | HotListScreen - 城市标签 |
| screens.hotListScreen.tabs.siteWide | 全站热榜 | Site-wide Hot List | HotListScreen - 全站热榜标签 |
| screens.hotListScreen.tabs.national | 国家热榜 | National Hot List | HotListScreen - 国家热榜标签 |
| screens.hotListScreen.tabs.industry | 行业热榜 | Industry Hot List | HotListScreen - 行业热榜标签 |
| screens.hotListScreen.tabs.enterprise | 企业热榜 | Enterprise Hot List | HotListScreen - 企业热榜标签 |
| screens.hotListScreen.tabs.personal | 个人热榜 | Personal Hot List | HotListScreen - 个人热榜标签 |
| screens.hotListScreen.subTabs.techDigital | 科技数码 | Tech & Digital | HotListScreen - 科技数码子标签 |
| screens.hotListScreen.subTabs.pythonProgramming | Python编程 | Python Programming | HotListScreen - Python编程子标签 |
| screens.hotListScreen.subTabs.careerDevelopment | 职场发展 | Career Development | HotListScreen - 职场发展子标签 |
| screens.hotListScreen.subTabs.healthWellness | 健康养生 | Health & Wellness | HotListScreen - 健康养生子标签 |
| screens.hotListScreen.subTabs.foodCooking | 美食烹饪 | Food & Cooking | HotListScreen - 美食烹饪子标签 |
| screens.hotListScreen.subTabs.travelTourism | 旅游出行 | Travel & Tourism | HotListScreen - 旅游出行子标签 |
| screens.hotListScreen.subTabs.policyRegulation | 政策法规 | Policy & Regulation | HotListScreen - 政策法规子标签 |
| screens.hotListScreen.subTabs.socialLivelihood | 社会民生 | Social Livelihood | HotListScreen - 社会民生子标签 |
| screens.hotListScreen.subTabs.economicDevelopment | 经济发展 | Economic Development | HotListScreen - 经济发展子标签 |
| screens.hotListScreen.subTabs.educationHealthcare | 教育医疗 | Education & Healthcare | HotListScreen - 教育医疗子标签 |
| screens.hotListScreen.subTabs.environmentalProtection | 环境保护 | Environmental Protection | HotListScreen - 环境保护子标签 |
| screens.hotListScreen.subTabs.infrastructure | 基础设施 | Infrastructure | HotListScreen - 基础设施子标签 |
| screens.hotListScreen.subTabs.internet | 互联网 | Internet | HotListScreen - 互联网子标签 |
| screens.hotListScreen.subTabs.finance | 金融 | Finance | HotListScreen - 金融子标签 |
| screens.hotListScreen.subTabs.medicalHealth | 医疗健康 | Medical Health | HotListScreen - 医疗健康子标签 |
| screens.hotListScreen.subTabs.educationTraining | 教育培训 | Education & Training | HotListScreen - 教育培训子标签 |
| screens.hotListScreen.subTabs.realEstate | 房地产 | Real Estate | HotListScreen - 房地产子标签 |
| screens.hotListScreen.subTabs.manufacturing | 制造业 | Manufacturing | HotListScreen - 制造业子标签 |
| screens.hotListScreen.subTabs.cateringService | 餐饮服务 | Catering Service | HotListScreen - 餐饮服务子标签 |
| screens.hotListScreen.subTabs.techCompanies | 科技公司 | Tech Companies | HotListScreen - 科技公司子标签 |
| screens.hotListScreen.subTabs.financialInstitutions | 金融机构 | Financial Institutions | HotListScreen - 金融机构子标签 |
| screens.hotListScreen.subTabs.manufacturingEnterprises | 制造企业 | Manufacturing Enterprises | HotListScreen - 制造企业子标签 |
| screens.hotListScreen.subTabs.internetCompanies | 互联网公司 | Internet Companies | HotListScreen - 互联网公司子标签 |
| screens.hotListScreen.subTabs.retailEnterprises | 零售企业 | Retail Enterprises | HotListScreen - 零售企业子标签 |
| screens.hotListScreen.subTabs.serviceIndustry | 服务行业 | Service Industry | HotListScreen - 服务行业子标签 |
| screens.hotListScreen.subTabs.careerGrowth | 职业发展 | Career Growth | HotListScreen - 职业发展子标签 |
| screens.hotListScreen.subTabs.emotionalLife | 情感生活 | Emotional Life | HotListScreen - 情感生活子标签 |
| screens.hotListScreen.subTabs.financialInvestment | 理财投资 | Financial Investment | HotListScreen - 理财投资子标签 |
| screens.hotListScreen.subTabs.learningGrowth | 学习成长 | Learning & Growth | HotListScreen - 学习成长子标签 |
| screens.hotListScreen.subTabs.familyRelations | 家庭关系 | Family Relations | HotListScreen - 家庭关系子标签 |

*其他页面待添加 / Other screens to be added*

### Components 命名空间 / Components Namespace

*待添加 / To be added*

## 更新日志 / Change Log

- **2024-01-XX**: 创建文档，添加 common 命名空间基础翻译键 / Created document, added common namespace base translation keys
- **2024-01-XX**: 添加 screens 和 components 命名空间结构 / Added screens and components namespace structure
- **2026-01-XX**: 添加 ExamDetailScreen 和 ExamHistoryScreen 翻译键 / Added ExamDetailScreen and ExamHistoryScreen translation keys
- **2026-01-XX**: 添加 SuperLikePurchaseScreen 翻译键，完成任务 8.2 / Added SuperLikePurchaseScreen translation keys, completed task 8.2
- **2026-01-XX**: 添加 HotListScreen 翻译键，完成任务 8.5 / Added HotListScreen translation keys, completed task 8.5

## 注意事项 / Notes

1. 添加新翻译键时，请同时更新 zh.json、en.json 和本映射文档
   When adding new translation keys, please update zh.json, en.json, and this mapping document simultaneously

2. 复用现有翻译键而不是创建重复的键
   Reuse existing translation keys instead of creating duplicates

3. 使用驼峰命名法（camelCase）命名翻译键
   Use camelCase for naming translation keys

4. 确保翻译文本准确、自然、符合语言习惯
   Ensure translations are accurate, natural, and idiomatic
