# 设计文档 - 可分享用户主页

## 概述

本设计文档描述了可分享用户主页功能的技术实现方案。该功能将创建一个新的PublicProfileScreen组件，用于展示任何用户的公开信息，与现有的ProfileScreen（个人中心）区分开来。PublicProfileScreen专注于展示用户的公开信息给访客查看，而ProfileScreen用于当前登录用户管理自己的账户。

### 设计目标

1. **独立性**: 创建完全独立的页面组件，不影响现有ProfileScreen
2. **可分享性**: 支持通过URL参数加载任意用户的主页
3. **可复用性**: 最大化复用现有组件（Avatar、SuperLikeBalance等）
4. **响应式**: 适配不同屏幕尺寸，提供流畅的用户体验
5. **性能优化**: 实现分页加载和数据缓存

## 架构

### 组件层次结构

```
PublicProfileScreen (主容器)
├── Header (顶部导航栏)
│   ├── BackButton (返回按钮)
│   ├── UserBioTitle (用户简介标题 - 居中显示)
│   └── MoreActionsButton (更多操作按钮)
├── ProfileHeader (用户信息头部)
│   ├── UserInfoRow (用户信息行)
│   │   ├── LeftSection (左侧区域)
│   │   │   ├── UserName (用户名 - 左上方)
│   │   │   ├── VerificationBadge (认证标识)
│   │   │   └── StatsRow (统计数据行)
│   │   │       ├── FollowingStat (关注数)
│   │   │       ├── FollowersStat (粉丝数)
│   │   │       └── LikesStat (获赞数)
│   │   └── RightSection (右侧区域)
│   │       └── Avatar (头像 - 右上角，带认证角标)
│   ├── VerificationInfo (认证信息文字)
│   ├── UserTags (用户标签)
│   └── UserMeta (地区、性别、MCN等元信息)
├── ActionButtons (操作按钮区)
│   ├── FollowButton (关注按钮 - 红色突出显示)
│   └── MessageButton (发私信按钮 - 白色边框)
├── ShowcaseSection (TA的橱窗 - 可选)
│   ├── ShowcaseTitle (橱窗标题)
│   ├── ShowcaseCards (橱窗内容卡片)
│   └── ViewMoreButton (查看更多按钮)
├── ContentTabs (内容标签栏)
│   ├── AllTab (全部标签)
│   ├── ArticleTab (文章标签)
│   ├── VideoTab (视频标签)
│   ├── MicroPostTab (微头条标签)
│   ├── RepostTab (转发标签)
│   └── RightIcons (右侧图标)
│       ├── SearchIcon (搜索图标)
│       └── AudioIcon (音频图标)
└── ContentList (内容列表)
    ├── ArticleCard (文章卡片)
    ├── VideoCard (视频卡片)
    ├── MicroPostCard (微头条卡片)
    └── RepostCard (转发卡片)
```

### 数据流

```
用户访问 → 路由参数(userId) → PublicProfileScreen
                                    ↓
                            加载用户数据 (API)
                                    ↓
                            渲染用户信息和内容
                                    ↓
                            用户交互 (关注/私信/查看内容)
                                    ↓
                            更新状态 / 导航到其他页面
```

## 组件和接口

### 1. PublicProfileScreen 组件

主容器组件，负责整体布局和状态管理。

**Props:**
```typescript
interface PublicProfileScreenProps {
  navigation: NavigationProp;
  route: {
    params: {
      userId: string;  // 要查看的用户ID
    };
  };
}
```

**State:**
```typescript
interface PublicProfileScreenState {
  // 用户数据
  userData: UserProfile | null;
  
  // 内容数据
  contentData: ContentItem[];
  activeTab: 'all' | 'articles' | 'videos' | 'microposts' | 'reposts';
  
  // 橱窗数据
  showcaseData: ShowcaseItem[];
  
  // 加载状态
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  
  // 错误状态
  error: string | null;
  
  // 关注状态
  isFollowing: boolean;
  
  // 分页
  currentPage: number;
}
```

### 2. UserProfile 数据模型

```typescript
interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  occupation: string;
  gender: 'male' | 'female' | 'other' | null;
  
  // 认证信息
  verification: {
    type: 'none' | 'personal' | 'enterprise' | 'government';
    verified: boolean;
    verifiedAt: string | null;
    verificationText: string; // 认证信息文字，如"联合国军事观察员 军事学博士"
  };
  
  // 用户标签
  tags: string[]; // 如["军事学博士", "主要研究领域为军事思想", "军事历史", "军事文化"]
  
  // MCN信息
  mcn: {
    hasMcn: boolean;
    mcnName: string | null;
    mcnId: string | null;
  };
  
  // 统计数据
  stats: {
    followingCount: number;
    followersCount: number;
    likesCount: number;
  };
  
  // 影响力和智慧指数
  influence: number;
  wisdomIndex: number;
}
```

### 3. ContentItem 数据模型

```typescript
interface ContentItem {
  id: string;
  type: 'article' | 'video' | 'micropost' | 'repost';
  createdAt: string;
  
  // 文章相关
  title?: string;
  coverImage?: string;
  summary?: string;
  
  // 视频相关
  videoUrl?: string;
  videoDuration?: number;
  videoThumbnail?: string;
  
  // 微头条相关
  content?: string;
  images?: string[];
  
  // 转发相关
  originalContent?: ContentItem;
  repostComment?: string;
  
  // 统计
  viewsCount: number;
  commentsCount: number;
  likesCount: number;
  sharesCount: number;
  collectsCount: number;
}

interface ShowcaseItem {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  type: 'product' | 'content' | 'course';
  price?: number;
}
```

### 4. API 接口

#### 获取用户公开信息
```typescript
GET /api/users/:userId/public-profile

Response: {
  success: boolean;
  data: UserProfile;
}
```

#### 获取用户内容列表
```typescript
GET /api/users/:userId/contents

Query Parameters:
  - type: 'all' | 'articles' | 'videos' | 'microposts' | 'reposts'  // 内容类型
  - page: number                // 页码
  - limit: number               // 每页数量

Response: {
  success: boolean;
  data: {
    items: ContentItem[];
    hasMore: boolean;
    total: number;
  };
}
```

#### 获取用户橱窗内容
```typescript
GET /api/users/:userId/showcase

Query Parameters:
  - limit: number  // 数量限制，默认3

Response: {
  success: boolean;
  data: {
    items: ShowcaseItem[];
    total: number;
  };
}
```

#### 关注/取消关注用户
```typescript
POST /api/users/:userId/follow

Request Body: {
  action: 'follow' | 'unfollow';
}

Response: {
  success: boolean;
  data: {
    isFollowing: boolean;
    followersCount: number;
  };
}
```

#### 检查关注状态
```typescript
GET /api/users/:userId/follow-status

Response: {
  success: boolean;
  data: {
    isFollowing: boolean;
  };
}
```

### 5. 分享功能接口

```typescript
interface ShareService {
  // 生成分享链接
  generateShareLink(userId: string): string;
  
  // 生成二维码
  generateQRCode(userId: string): Promise<string>;
  
  // 调用系统分享
  shareProfile(userId: string, username: string): Promise<void>;
  
  // 复制链接到剪贴板
  copyLinkToClipboard(userId: string): Promise<void>;
}
```

## 数据模型

### 用户主页数据结构

```typescript
// 完整的用户主页数据
interface PublicProfileData {
  profile: UserProfile;
  showcase: ShowcaseItem[];
  contents: {
    all: ContentItem[];
    articles: ContentItem[];
    videos: ContentItem[];
    microposts: ContentItem[];
    reposts: ContentItem[];
  };
  pagination: {
    all: PaginationInfo;
    articles: PaginationInfo;
    videos: PaginationInfo;
    microposts: PaginationInfo;
    reposts: PaginationInfo;
  };
}

interface PaginationInfo {
  currentPage: number;
  hasMore: boolean;
  total: number;
}
```

### 本地状态管理

使用React的useState和useEffect进行状态管理：

```typescript
// 用户数据状态
const [userData, setUserData] = useState<UserProfile | null>(null);

// 橱窗数据状态
const [showcaseData, setShowcaseData] = useState<ShowcaseItem[]>([]);

// 内容数据状态
const [contentData, setContentData] = useState<ContentItem[]>([]);
const [activeTab, setActiveTab] = useState<'all' | 'articles' | 'videos' | 'microposts' | 'reposts'>('all');

// 加载状态
const [isLoading, setIsLoading] = useState(true);
const [isLoadingMore, setIsLoadingMore] = useState(false);
const [hasMore, setHasMore] = useState(true);

// 关注状态
const [isFollowing, setIsFollowing] = useState(false);

// 分页状态
const [currentPage, setCurrentPage] = useState(1);
```

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式陈述。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*


### 属性 1: 用户ID参数加载正确性
*对于任何*有效的用户ID，当通过路由参数传递给PublicProfileScreen时，系统应该加载并显示该用户的正确数据
**验证需求: 1.3**

### 属性 2: 用户信息完整性渲染
*对于任何*包含完整信息的用户数据，渲染后的页面应该包含所有必需的用户信息元素（头像在右上角、用户名在左上方、统计数据）以及所有可选信息元素（简介在顶部导航栏、认证标识、认证信息文字、用户标签、地区、性别、职业、MCN信息）当它们存在时
**验证需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 8.3, 8.4, 13.1, 13.2, 13.3, 14.1, 14.2, 15.1, 15.2**

### 属性 3: 关注按钮状态一致性
*对于任何*用户主页，关注按钮的显示状态应该与当前的关注关系一致：未关注时显示"关注"按钮，已关注时显示"已关注"按钮，查看自己主页时隐藏按钮
**验证需求: 3.1, 3.2, 3.7**

### 属性 4: 关注操作状态变更
*对于任何*用户，当执行关注操作时，关注状态应该从false变为true；当执行取消关注操作时，关注状态应该从true变为false
**验证需求: 3.3, 3.5**

### 属性 5: 内容标签过滤正确性
*对于任何*内容列表，当选择"全部"标签时应该显示所有类型的内容，当选择"文章"标签时应该只显示type为"article"的内容，当选择"视频"标签时应该只显示type为"video"的内容，当选择"微头条"标签时应该只显示type为"micropost"的内容，当选择"转发"标签时应该只显示type为"repost"的内容
**验证需求: 5.2, 5.3, 5.4, 5.5, 5.6**

### 属性 6: 内容卡片导航正确性
*对于任何*内容卡片，点击后应该导航到对应的详情页面，文章类型导航到ArticleDetail，视频类型导航到VideoDetail，微头条类型导航到MicroPostDetail，转发类型导航到原内容详情页面
**验证需求: 5.9**

### 属性 7: 文章卡片信息完整性
*对于任何*文章类型的内容，渲染的卡片应该包含标题、封面图、摘要、浏览数、评论数、点赞数、分享数、收藏数、发布时间
**验证需求: 6.1, 6.6**

### 属性 8: 视频卡片信息完整性
*对于任何*视频类型的内容，渲染的卡片应该包含标题、视频缩略图、视频时长、浏览数、评论数、点赞数、分享数、收藏数、发布时间
**验证需求: 6.4, 6.6**

### 属性 9: 微头条卡片信息完整性
*对于任何*微头条类型的内容，渲染的卡片应该包含内容文字、配图（如果有）、评论数、点赞数、分享数、收藏数、发布时间
**验证需求: 6.4, 6.6**

### 属性 10: 转发卡片信息完整性
*对于任何*转发类型的内容，渲染的卡片应该包含转发评论、原内容信息、评论数、点赞数、分享数、收藏数、发布时间
**验证需求: 6.4, 6.6**

### 属性 11: 分享链接格式正确性
*对于任何*用户ID，生成的分享链接应该包含该用户ID作为参数，并且该链接应该能够正确加载用户主页
**验证需求: 7.3, 7.6**

### 属性 12: 二维码内容正确性
*对于任何*用户ID，生成的二维码解码后应该得到包含该用户ID的有效分享链接
**验证需求: 7.4**

### 属性 13: 统计数据导航正确性
*对于任何*统计数据项（关注数、粉丝数、获赞数），点击后应该导航到对应的页面或显示对应的信息
**验证需求: 9.1, 9.2, 9.3**

### 属性 14: 加载状态UI一致性
*对于任何*数据加载操作，在加载期间应该显示加载指示器，加载成功后隐藏指示器并显示数据，加载失败后显示错误信息和重试按钮
**验证需求: 11.1, 11.2, 11.3**

### 属性 15: 分页加载连续性
*对于任何*内容列表，当滚动到底部且hasMore为true时，应该自动加载下一页内容并追加到现有列表中，页码应该递增
**验证需求: 12.1**

### 属性 16: 分页加载状态正确性
*对于任何*分页加载操作，在加载期间应该显示底部加载指示器，加载成功后隐藏指示器，没有更多内容时显示"没有更多内容"提示，加载失败时显示错误和重试选项
**验证需求: 12.2, 12.3, 12.4**

### 属性 17: 橱窗内容显示正确性
*对于任何*用户，当用户有橱窗内容时应该显示"TA的橱窗"区域并显示橱窗卡片（最多3个），当用户没有橱窗内容时应该隐藏该区域
**验证需求: 13.1, 13.2, 13.3, 13.5**

### 属性 18: 橱窗导航正确性
*对于任何*橱窗内容卡片，点击后应该导航到对应的橱窗详情页面；当橱窗内容超过3个时，点击"查看更多"按钮应该导航到完整的橱窗列表页面
**验证需求: 13.4, 13.6, 13.7**

### 属性 19: 用户标签显示正确性
*对于任何*用户，当用户有标签信息时应该显示用户标签，当标签数量超过3个时应该显示前3个标签并显示"..."表示更多
**验证需求: 14.1, 14.2, 14.3**

### 属性 20: MCN信息显示正确性
*对于任何*用户，当用户属于MCN机构时应该显示MCN信息和机构名称，当用户不属于MCN机构时应该隐藏MCN信息
**验证需求: 15.1, 15.2, 15.4**

## 错误处理

### 错误类型

1. **网络错误**
   - 无网络连接
   - 请求超时
   - 服务器错误 (5xx)

2. **数据错误**
   - 用户不存在 (404)
   - 无权限访问 (403)
   - 数据格式错误

3. **客户端错误**
   - 参数缺失或无效
   - 状态不一致

### 错误处理策略

```typescript
// 错误处理函数
function handleError(error: Error, context: string): void {
  console.error(`[${context}] Error:`, error);
  
  if (error.message.includes('Network')) {
    // 网络错误
    showErrorMessage('网络连接失败，请检查网络设置');
  } else if (error.message.includes('404')) {
    // 用户不存在
    showErrorMessage('用户不存在');
    navigation.goBack();
  } else if (error.message.includes('403')) {
    // 无权限
    showErrorMessage('无权限访问该用户主页');
  } else {
    // 其他错误
    showErrorMessage('加载失败，请稍后重试');
  }
}

// 重试机制
function retryWithBackoff(
  fn: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> {
  return fn().catch((error) => {
    if (maxRetries === 0) {
      throw error;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(retryWithBackoff(fn, maxRetries - 1, delay * 2));
      }, delay);
    });
  });
}
```

### 错误状态UI

```typescript
// 错误状态组件
function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
      <Text style={styles.errorMessage}>{message}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>重试</Text>
      </TouchableOpacity>
    </View>
  );
}

// 空状态组件
function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-outline" size={48} color="#9ca3af" />
      <Text style={styles.emptyMessage}>{message}</Text>
    </View>
  );
}
```

## 测试策略

### 测试方法

本功能将采用**双重测试方法**：

1. **单元测试**: 验证特定示例、边缘情况和错误条件
2. **属性测试**: 验证跨所有输入的通用属性

两者是互补的，对于全面覆盖都是必需的。单元测试捕获具体的错误，属性测试验证一般正确性。

### 单元测试重点

单元测试应该专注于：
- 特定示例（如特定用户数据的渲染）
- 组件之间的集成点
- 边缘情况和错误条件（如空数据、网络错误）

避免编写过多的单元测试 - 基于属性的测试处理大量输入的覆盖。

### 属性测试配置

- **测试库**: 使用fast-check进行基于属性的测试
- **最小迭代次数**: 每个属性测试100次（由于随机化）
- **标签格式**: **Feature: shareable-user-profile, Property {number}: {property_text}**
- **要求**: 每个正确性属性必须由单个基于属性的测试实现

### 测试用例示例

#### 单元测试示例

```typescript
describe('PublicProfileScreen', () => {
  it('should render user profile with complete data', () => {
    const mockUser = {
      id: '123',
      username: 'testuser',
      avatar: 'https://example.com/avatar.jpg',
      bio: 'Test bio',
      // ... other fields
    };
    
    const { getByText, getByTestId } = render(
      <PublicProfileScreen route={{ params: { userId: '123' } }} />
    );
    
    expect(getByText('testuser')).toBeTruthy();
    expect(getByTestId('user-avatar')).toBeTruthy();
  });
  
  it('should show error when user does not exist', async () => {
    // Mock API to return 404
    mockAPI.getUserProfile.mockRejectedValue(new Error('404'));
    
    const { getByText } = render(
      <PublicProfileScreen route={{ params: { userId: 'invalid' } }} />
    );
    
    await waitFor(() => {
      expect(getByText('用户不存在')).toBeTruthy();
    });
  });
});
```

#### 属性测试示例

```typescript
import fc from 'fast-check';

describe('PublicProfileScreen Properties', () => {
  // Feature: shareable-user-profile, Property 1: 用户ID参数加载正确性
  it('should load correct user data for any valid user ID', () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1 }), // Generate random user IDs
        async (userId) => {
          const mockUser = generateMockUser(userId);
          mockAPI.getUserProfile.mockResolvedValue(mockUser);
          
          const { getByTestId } = render(
            <PublicProfileScreen route={{ params: { userId } }} />
          );
          
          await waitFor(() => {
            const displayedUserId = getByTestId('user-id').props.children;
            expect(displayedUserId).toContain(userId);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
  
  // Feature: shareable-user-profile, Property 9: 分享链接格式正确性
  it('should generate valid share link for any user ID', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        (userId) => {
          const shareLink = generateShareLink(userId);
          
          // Verify link contains user ID
          expect(shareLink).toContain(userId);
          
          // Verify link is valid URL
          expect(() => new URL(shareLink)).not.toThrow();
          
          // Verify link can be parsed to extract user ID
          const extractedUserId = extractUserIdFromLink(shareLink);
          expect(extractedUserId).toBe(userId);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### 测试覆盖目标

- **组件渲染**: 100%覆盖所有UI组件
- **状态管理**: 100%覆盖所有状态转换
- **API调用**: 100%覆盖所有API端点
- **错误处理**: 100%覆盖所有错误场景
- **属性验证**: 所有14个正确性属性都有对应的属性测试

## 实现注意事项

### 性能优化

1. **数据缓存**: 使用React Query或SWR缓存用户数据
2. **图片懒加载**: 使用React Native的Image组件的懒加载特性
3. **列表虚拟化**: 使用FlatList的虚拟化功能优化长列表性能
4. **防抖处理**: 对滚动事件和搜索输入进行防抖处理

### 可访问性

1. **语义化标签**: 使用accessibilityLabel和accessibilityHint
2. **键盘导航**: 支持键盘导航和焦点管理
3. **屏幕阅读器**: 确保所有交互元素可被屏幕阅读器识别
4. **对比度**: 确保文本和背景的对比度符合WCAG标准

### 国际化

1. **文本翻译**: 所有UI文本使用i18n-js进行翻译
2. **日期格式**: 根据用户语言环境格式化日期
3. **数字格式**: 根据用户语言环境格式化数字（如统计数据）

### 安全性

1. **输入验证**: 验证所有用户输入和URL参数
2. **XSS防护**: 对用户生成的内容进行转义
3. **深度链接验证**: 验证深度链接的来源和参数
4. **权限检查**: 在客户端和服务端都进行权限检查
