# 需求文档 - 可分享用户主页

## 简介

本功能旨在创建一个独立的、可分享的用户主页页面，类似今日头条的用户主页。该主页允许用户通过分享链接让其他人查看自己的公开信息、发布内容和统计数据。这个主页与现有的ProfileScreen（个人中心）不同，ProfileScreen用于当前登录用户管理自己的账户，而PublicProfileScreen用于展示任何用户的公开信息给访客查看。

## 术语表

- **System**: 问答社区应用系统
- **PublicProfileScreen**: 可分享的公开用户主页页面组件
- **ProfileScreen**: 当前登录用户的个人中心页面
- **Visitor**: 访问用户主页的访客（可能是登录用户或未登录用户）
- **ProfileOwner**: 主页所属的用户
- **ContentTab**: 内容标签页（全部、文章、视频、微头条、转发）
- **VerificationBadge**: 认证标识（个人认证、企业认证、政府认证）
- **ShareLink**: 分享链接
- **QRCode**: 二维码

## 需求

### 需求 1: 独立主页页面

**用户故事:** 作为用户，我想要有一个独立的可分享主页页面，以便其他人可以通过链接访问我的公开信息。

#### 验收标准

1. THE System SHALL 创建一个名为PublicProfileScreen的独立页面组件
2. WHEN 用户通过分享链接访问主页时，THE System SHALL 显示PublicProfileScreen而不是ProfileScreen
3. THE System SHALL 支持通过用户ID参数加载对应用户的主页数据
4. WHEN 访问不存在的用户ID时，THE System SHALL 显示"用户不存在"的错误提示

### 需求 2: 用户基本信息展示

**用户故事:** 作为访客，我想要查看用户的基本信息，以便了解该用户的身份和背景。

#### 验收标准

1. WHEN 主页加载时，THE System SHALL 在顶部区域显示用户头像
2. WHEN 主页加载时，THE System SHALL 显示用户名称
3. WHEN 主页加载时，THE System SHALL 显示用户的关注数、粉丝数、获赞数统计
4. WHEN 用户有个人简介时，THE System SHALL 显示用户简介文本
5. WHEN 用户有认证信息时，THE System SHALL 显示对应的VerificationBadge（个人认证、企业认证或政府认证）
6. WHEN 用户有地区信息时，THE System SHALL 显示用户所在地区
7. WHEN 用户有性别信息时，THE System SHALL 显示用户性别
8. WHEN 用户有职业信息时，THE System SHALL 显示用户职业

### 需求 3: 关注功能

**用户故事:** 作为访客，我想要关注感兴趣的用户，以便接收他们的最新内容更新。

#### 验收标准

1. WHEN 访客是登录用户且未关注ProfileOwner时，THE System SHALL 显示"关注"按钮
2. WHEN 访客是登录用户且已关注ProfileOwner时，THE System SHALL 显示"已关注"按钮
3. WHEN 访客点击"关注"按钮时，THE System SHALL 将ProfileOwner添加到访客的关注列表
4. WHEN 访客点击"已关注"按钮时，THE System SHALL 显示取消关注确认对话框
5. WHEN 访客确认取消关注时，THE System SHALL 将ProfileOwner从访客的关注列表中移除
6. WHEN 访客未登录时，THE System SHALL 显示"关注"按钮但点击时跳转到登录页面
7. WHEN 访客查看自己的主页时，THE System SHALL 隐藏关注按钮

### 需求 4: 私信功能

**用户故事:** 作为访客，我想要给用户发送私信，以便与他们进行私密交流。

#### 验收标准

1. WHEN 访客是登录用户时，THE System SHALL 显示"发私信"按钮
2. WHEN 访客点击"发私信"按钮时，THE System SHALL 导航到与ProfileOwner的私信对话页面
3. WHEN 访客未登录时，THE System SHALL 显示"发私信"按钮但点击时跳转到登录页面
4. WHEN 访客查看自己的主页时，THE System SHALL 隐藏"发私信"按钮

### 需求 5: 内容列表展示

**用户故事:** 作为访客，我想要查看用户发布的内容，以便了解他们的贡献和专业领域。

#### 验收标准

1. THE System SHALL 显示包含以下ContentTab的标签栏：全部、文章、视频、微头条、转发
2. WHEN 访客选择"全部"标签时，THE System SHALL 显示用户发布的所有类型内容
3. WHEN 访客选择"文章"标签时，THE System SHALL 仅显示用户发布的文章内容
4. WHEN 访客选择"视频"标签时，THE System SHALL 仅显示用户发布的视频内容
5. WHEN 访客选择"微头条"标签时，THE System SHALL 仅显示用户发布的微头条内容
6. WHEN 访客选择"转发"标签时，THE System SHALL 仅显示用户转发的内容
7. THE System SHALL 在标签栏右侧显示搜索图标和音频图标
8. WHEN 内容列表为空时，THE System SHALL 显示"暂无内容"的提示信息
9. WHEN 访客点击内容卡片时，THE System SHALL 导航到对应的内容详情页面

### 需求 6: 内容卡片信息

**用户故事:** 作为访客，我想要在内容列表中看到内容的关键信息，以便快速判断是否感兴趣。

#### 验收标准

1. WHEN 显示问题内容时，THE System SHALL 显示问题标题、浏览数、评论数、点赞数
2. WHEN 问题是悬赏问题时，THE System SHALL 显示悬赏金额标识
3. WHEN 问题已解决时，THE System SHALL 显示"已解决"标识
4. WHEN 显示回答内容时，THE System SHALL 显示问题标题、回答摘要、点赞数、评论数
5. WHEN 回答被采纳时，THE System SHALL 显示"已采纳"标识
6. WHEN 显示内容时，THE System SHALL 显示发布时间

### 需求 7: 分享功能

**用户故事:** 作为用户，我想要分享我的主页给其他人，以便扩大我的影响力。

#### 验收标准

1. THE System SHALL 在主页顶部显示分享按钮
2. WHEN 用户点击分享按钮时，THE System SHALL 显示分享选项菜单
3. WHEN 用户选择"复制链接"时，THE System SHALL 生成ShareLink并复制到剪贴板
4. WHEN 用户选择"生成二维码"时，THE System SHALL 生成包含ShareLink的QRCode并显示
5. WHEN 用户选择"分享到..."时，THE System SHALL 调用系统分享功能
6. THE ShareLink SHALL 包含用户ID参数以便正确加载用户主页

### 需求 8: 页面导航

**用户故事:** 作为访客，我想要方便地导航和返回，以便流畅地浏览应用。

#### 验收标准

1. THE System SHALL 在主页顶部显示返回按钮
2. WHEN 访客点击返回按钮时，THE System SHALL 返回到上一个页面
3. THE System SHALL 在主页顶部中间位置显示ProfileOwner的用户简介文字
4. WHEN 用户简介文字过长时，THE System SHALL 截断并显示省略号
5. THE System SHALL 在主页顶部显示更多操作按钮（三个点）
6. WHEN 访客点击更多操作按钮时，THE System SHALL 显示操作菜单（举报、拉黑等选项）

### 需求 9: 统计数据交互

**用户故事:** 作为访客，我想要点击统计数据查看详细信息，以便深入了解用户的社交关系。

#### 验收标准

1. WHEN 访客点击"关注数"时，THE System SHALL 导航到ProfileOwner的关注列表页面
2. WHEN 访客点击"粉丝数"时，THE System SHALL 导航到ProfileOwner的粉丝列表页面
3. WHEN 访客点击"获赞数"时，THE System SHALL 显示获赞统计详情对话框

### 需求 10: 响应式布局

**用户故事:** 作为用户，我想要主页在不同设备上都能正常显示，以便在任何设备上分享和查看。

#### 验收标准

1. THE System SHALL 使用SafeAreaView确保内容不被系统UI遮挡
2. THE System SHALL 支持垂直滚动查看所有内容
3. WHEN 内容超出屏幕高度时，THE System SHALL 显示滚动指示器
4. THE System SHALL 适配不同屏幕尺寸的移动设备

### 需求 11: 加载状态

**用户故事:** 作为访客，我想要看到加载状态提示，以便知道数据正在加载中。

#### 验收标准

1. WHEN 主页数据正在加载时，THE System SHALL 显示加载指示器
2. WHEN 数据加载失败时，THE System SHALL 显示错误提示信息
3. WHEN 数据加载失败时，THE System SHALL 提供重试按钮
4. WHEN 访客点击重试按钮时，THE System SHALL 重新加载主页数据

### 需求 12: 内容分页加载

**用户故事:** 作为访客，我想要在滚动到底部时自动加载更多内容，以便查看用户的所有发布内容。

#### 验收标准

1. WHEN 访客滚动到内容列表底部时，THE System SHALL 自动加载下一页内容
2. WHEN 正在加载更多内容时，THE System SHALL 在列表底部显示加载指示器
3. WHEN 没有更多内容时，THE System SHALL 显示"没有更多内容"的提示
4. WHEN 加载更多内容失败时，THE System SHALL 显示错误提示并提供重试选项

### 需求 13: TA的橱窗

**用户故事:** 作为访客，我想要查看用户的橱窗内容，以便了解用户的特色内容或商品。

#### 验收标准

1. WHEN 用户有橱窗内容时，THE System SHALL 在用户信息区域下方显示"TA的橱窗"区域
2. THE System SHALL 在橱窗区域显示橱窗标题
3. THE System SHALL 在橱窗区域显示橱窗内容卡片（最多显示3个）
4. WHEN 访客点击橱窗内容卡片时，THE System SHALL 导航到对应的橱窗详情页面
5. WHEN 用户没有橱窗内容时，THE System SHALL 隐藏"TA的橱窗"区域
6. WHEN 橱窗内容超过3个时，THE System SHALL 显示"查看更多"按钮
7. WHEN 访客点击"查看更多"按钮时，THE System SHALL 导航到完整的橱窗列表页面

### 需求 14: 用户标签展示

**用户故事:** 作为访客，我想要查看用户的标签信息，以便快速了解用户的专业领域和特点。

#### 验收标准

1. WHEN 用户有标签信息时，THE System SHALL 在用户信息区域显示用户标签
2. THE System SHALL 以标签形式显示用户的专业领域、研究方向等信息
3. WHEN 标签数量超过3个时，THE System SHALL 显示前3个标签并显示"..."表示更多
4. WHEN 访客点击标签时，THE System SHALL 导航到该标签的相关内容页面

### 需求 15: MCN信息展示

**用户故事:** 作为访客，我想要查看用户的MCN信息，以便了解用户是否属于某个内容创作机构。

#### 验收标准

1. WHEN 用户属于MCN机构时，THE System SHALL 在用户信息区域显示MCN信息
2. THE System SHALL 显示MCN机构的名称
3. WHEN 访客点击MCN信息时，THE System SHALL 导航到MCN机构的详情页面
4. WHEN 用户不属于MCN机构时，THE System SHALL 隐藏MCN信息
