# 团队权限展示说明

## 展示场景

在"我的团队"页面中，有两个团队展示不同的权限场景：

### 场景1：队长权限（管理员）

**团队信息**：
- 团队名称：Python学习互助团队
- 角色：队长
- 创建者ID：1
- 当前用户ID：1
- 是否管理员：是

**权限展示**：
当点击这个团队进入详情页时，右上角会显示：
1. ✅ **邀请按钮**（绿色人员添加图标）- 可以邀请用户加入团队
2. ✅ **发起活动按钮**（蓝色日历图标）- 可以发起团队活动
3. ✅ **发布公告按钮**（橙色喇叭图标）- 可以发布团队公告

**页面截图说明**：
```
┌─────────────────────────────────┐
│ ← 团队详情页  [👤+][📅][📢]     │
│                                 │
│ Python学习互助团队               │
│ 队长                            │
│                                 │
│ 专注Python学习，互帮互助         │
│                                 │
│ 👥 12成员  💬 45问题            │
└─────────────────────────────────┘
```

**功能说明**：
- 作为队长（创建者），拥有所有管理权限
- 可以邀请新成员加入团队
- 可以发起团队活动
- 可以发布团队公告
- 可以管理团队成员

---

### 场景2：普通成员权限

**团队信息**：
- 团队名称：数据分析实战团队
- 角色：成员
- 创建者ID：2（不是当前用户）
- 当前用户ID：3（队长3）
- 是否管理员：否

**权限展示**：
当点击这个团队进入详情页时，右上角会显示：
1. ✅ **申请管理员按钮**（紫色盾牌图标）- 可以申请成为管理员

**页面截图说明**：
```
┌─────────────────────────────────┐
│ ← 团队详情页  [🛡️ 申请管理员]   │
│                                 │
│ 数据分析实战团队                 │
│ 成员                            │
│                                 │
│ 数据分析实战项目，分享经验       │
│                                 │
│ 👥 8成员  💬 23问题             │
└─────────────────────────────────┘
```

**功能说明**：
- 作为普通成员，没有管理权限
- 可以申请成为管理员
- 申请需要团队创建者审核
- 申请后按钮变为"已申请"状态
- 可以参与团队讨论和查看公告

---

## 权限对比表

| 功能 | 队长/管理员 | 普通成员 |
|------|------------|---------|
| 邀请用户 | ✅ | ❌ |
| 发起活动 | ✅ | ❌ |
| 发布公告 | ✅ | ❌ |
| 申请管理员 | ❌ | ✅ |
| 参与讨论 | ✅ | ✅ |
| 查看公告 | ✅ | ✅ |
| 查看成员 | ✅ | ✅ |
| 退出团队 | ✅ | ✅ |

## 测试步骤

### 测试场景1（队长权限）

1. 打开应用，进入"我的"页面
2. 点击"我的团队"
3. 点击第一个团队"Python学习互助团队"
4. 观察右上角显示三个按钮：
   - 绿色邀请按钮
   - 蓝色发起活动按钮
   - 橙色发布公告按钮
5. 点击邀请按钮，测试邀请功能
6. 点击发起活动按钮，测试活动创建
7. 点击发布公告按钮，测试公告发布

### 测试场景2（普通成员权限）

1. 在"我的团队"页面
2. 点击第二个团队"数据分析实战团队"
3. 观察右上角只显示一个按钮：
   - 紫色申请管理员按钮
4. 点击申请管理员按钮
5. 填写申请理由
6. 提交申请
7. 观察按钮变为"已申请"状态（灰色，不可点击）

## 数据配置

### 团队1（队长）
```javascript
{
  id: 1,
  name: 'Python学习互助团队',
  avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=team1',
  role: '队长',
  members: 12,
  questions: 45,
  description: '专注Python学习，互帮互助，共同进步',
  createdAt: '2025-12-15',
  isActive: true,
  creatorId: 1,      // 创建者ID
  currentUserId: 1,  // 当前用户ID（相同，表示是创建者）
  isAdmin: true      // 是管理员
}
```

### 团队2（普通成员）
```javascript
{
  id: 2,
  name: '数据分析实战团队',
  avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=team2',
  role: '成员',
  members: 8,
  questions: 23,
  description: '数据分析实战项目，分享经验与技巧',
  createdAt: '2026-01-05',
  isActive: true,
  creatorId: 2,      // 创建者ID（不是当前用户）
  currentUserId: 3,  // 当前用户ID（队长3）
  isAdmin: false     // 不是管理员
}
```

## 权限判断逻辑

```javascript
// 在TeamDetailScreen.js中
{team.isAdmin && (
  <>
    {/* 邀请按钮 */}
    <TouchableOpacity onPress={() => setShowInviteModal(true)}>
      <Ionicons name="person-add" size={22} color="#22c55e" />
    </TouchableOpacity>
    
    {/* 发起活动按钮 */}
    <TouchableOpacity onPress={() => navigation.navigate(...)}>
      <Ionicons name="calendar" size={22} color="#3b82f6" />
    </TouchableOpacity>
    
    {/* 发布公告按钮 */}
    <TouchableOpacity onPress={() => setShowPublishAnnouncementModal(true)}>
      <Ionicons name="megaphone" size={22} color="#f59e0b" />
    </TouchableOpacity>
  </>
)}

{!team.isAdmin && team.currentUserId !== team.creatorId && (
  /* 申请管理员按钮 */
  <TouchableOpacity onPress={() => setShowApplyAdminModal(true)}>
    <Ionicons name="shield-checkmark-outline" size={18} color="#8b5cf6" />
    <Text>申请管理员</Text>
  </TouchableOpacity>
)}
```

## 视觉效果

### 队长视图
- 三个图标按钮横向排列
- 绿色（邀请）+ 蓝色（活动）+ 橙色（公告）
- 图标清晰，易于识别
- 点击后弹出对应的功能弹窗

### 普通成员视图
- 一个文字按钮
- 紫色背景，带盾牌图标
- 显示"申请管理员"文字
- 申请后变为灰色"已申请"

## 注意事项

1. **权限控制**：确保只有管理员能看到管理功能按钮
2. **状态同步**：申请管理员后按钮状态要正确更新
3. **用户体验**：按钮位置和颜色要清晰易懂
4. **防重复操作**：申请管理员后禁用按钮，防止重复申请

---

**更新时间**：2026-01-27  
**相关文件**：
- `qa-app/qa-native-app/src/screens/MyTeamsScreen.js`
- `qa-app/qa-native-app/src/screens/TeamDetailScreen.js`
- `qa-app/TEAM_INVITE_AND_ADMIN_FEATURE.md`
