# 🎯 QA Admin 后台管理系统 - 访问信息

## ✅ 服务器状态

### Admin后台管理系统
- **状态**：✅ 运行中
- **进程ID**：9
- **端口**：3001
- **启动命令**：`npm run dev`
- **技术栈**：Vue 3 + Vite + Element Plus + Tailwind CSS

---

## 🌐 访问地址

### 本地访问（推荐）
```
http://localhost:3001
```

**访问步骤**：
1. 打开浏览器
2. 访问 http://localhost:3001
3. 开始使用后台管理系统

**特点**：
- ✅ 最快速度
- ✅ 无需等待
- ✅ 完整功能
- ✅ 开发调试方便

---

### 局域网访问
如果需要在同一局域网内的其他设备访问：

1. 查看本机IP地址：
```bash
ipconfig
```

2. 找到IPv4地址（例如：192.168.1.100）

3. 在其他设备访问：
```
http://192.168.1.100:3001
```

---

### 公网访问（ngrok）

**注意**：ngrok免费版只能同时运行一个隧道。

**当前情况**：
- Native App的ngrok正在运行（端口8081）
- Admin系统暂时无法同时创建ngrok隧道

**解决方案**：

#### 方案1：停止Native App的ngrok，启动Admin的ngrok
```bash
# 停止Native App的ngrok
# 然后启动Admin的ngrok
cd qa-app/qa-admin-vue
npx ngrok http 3001
```

#### 方案2：使用其他公网隧道服务
- **LocalTunnel**：`npx localtunnel --port 3001`
- **Cloudflare Tunnel**：免费且稳定
- **Serveo**：`ssh -R 80:localhost:3001 serveo.net`

#### 方案3：升级ngrok付费版
- 可以同时运行多个隧道
- 更稳定的连接
- 自定义域名

---

## 📊 当前运行的服务

| 服务 | 端口 | 状态 | 公网访问 |
|------|------|------|----------|
| Native App (Expo) | 8081 | ✅ 运行中 | exp://atllyxa-anonymous-8081.exp.direct |
| Native App (Web) | 8081 | ✅ 运行中 | ❌ ngrok已停止 |
| Admin 后台 | 3001 | ✅ 运行中 | ⏳ 待配置 |

---

## 🎨 Admin后台功能模块

### 已实现功能
1. **Dashboard** - 数据概览
   - 用户统计
   - 问题统计
   - 回答统计
   - 活动统计

2. **用户管理** - Users
   - 用户列表
   - 用户详情
   - 权限管理
   - 封禁/解封

3. **内容管理**
   - **Questions** - 问题管理
   - **Answers** - 回答管理
   - **Comments** - 评论管理
   - **Topics** - 话题管理

4. **活动管理** - Activities
   - 活动列表
   - 创建活动
   - 活动审核
   - 数据统计

5. **热榜管理**
   - **HotList** - 热榜配置
   - **HotListTags** - 热榜标签

6. **财务管理** - Finance
   - 收入统计
   - 提现管理
   - 交易记录

7. **消息管理** - Messages
   - 系统消息
   - 推送通知
   - 消息模板

8. **举报管理** - Reports
   - 举报列表
   - 举报处理
   - 违规记录

9. **紧急求助** - Emergency
   - 求助列表
   - 求助处理
   - 位置追踪

10. **系统设置**
    - **Settings** - 系统配置
    - **Categories** - 分类管理
    - **Regions** - 地区管理
    - **Permissions** - 权限配置
    - **Groups** - 用户组管理

---

## 🔧 开发命令

### 启动开发服务器
```bash
cd qa-app/qa-admin-vue
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

---

## 📱 快速访问方式

### 方式1：直接访问本地
最简单的方式，打开浏览器访问：
```
http://localhost:3001
```

### 方式2：使用LocalTunnel创建公网链接
```bash
cd qa-app/qa-admin-vue
npx localtunnel --port 3001
```

会得到类似这样的地址：
```
https://random-name.loca.lt
```

### 方式3：使用Cloudflare Tunnel
1. 安装cloudflared
2. 运行：`cloudflared tunnel --url http://localhost:3001`

---

## 🎯 登录信息

### 默认管理员账号
```
用户名：admin
密码：admin123
```

### 测试账号
```
用户名：test
密码：test123
```

**注意**：这些是演示账号，实际使用时请修改密码！

---

## 🌟 技术特点

### 前端技术栈
- **Vue 3**：最新的Vue框架
- **Vite**：极速的构建工具
- **Element Plus**：企业级UI组件库
- **Tailwind CSS**：实用优先的CSS框架
- **Vue Router**：官方路由管理
- **Pinia**：新一代状态管理
- **Axios**：HTTP请求库

### 特色功能
- ✅ 响应式设计
- ✅ 暗色模式支持
- ✅ 权限管理系统
- ✅ 数据可视化
- ✅ 实时数据更新
- ✅ 导出功能
- ✅ 批量操作

---

## 📊 页面结构

```
qa-admin-vue/
├── src/
│   ├── views/              # 页面组件
│   │   ├── Dashboard.vue   # 仪表盘
│   │   ├── Users.vue       # 用户管理
│   │   ├── Questions.vue   # 问题管理
│   │   ├── Answers.vue     # 回答管理
│   │   ├── Comments.vue    # 评论管理
│   │   ├── Topics.vue      # 话题管理
│   │   ├── Activities.vue  # 活动管理
│   │   ├── HotList.vue     # 热榜管理
│   │   ├── HotListTags.vue # 热榜标签
│   │   ├── Finance.vue     # 财务管理
│   │   ├── Messages.vue    # 消息管理
│   │   ├── Reports.vue     # 举报管理
│   │   ├── Emergency.vue   # 紧急求助
│   │   ├── Settings.vue    # 系统设置
│   │   ├── Categories.vue  # 分类管理
│   │   ├── Regions.vue     # 地区管理
│   │   ├── Permissions.vue # 权限管理
│   │   └── Groups.vue      # 用户组管理
│   ├── components/         # 公共组件
│   │   ├── Header.vue      # 头部组件
│   │   ├── Sidebar.vue     # 侧边栏
│   │   └── StatCard.vue    # 统计卡片
│   ├── router/             # 路由配置
│   ├── styles/             # 样式文件
│   └── App.vue             # 根组件
```

---

## 💡 使用建议

### 开发环境
- 使用本地访问（http://localhost:3001）
- 速度最快，功能完整
- 方便调试和开发

### 演示环境
- 使用LocalTunnel或Cloudflare Tunnel
- 可以分享给团队成员
- 适合远程演示

### 生产环境
- 部署到服务器
- 使用Nginx反向代理
- 配置HTTPS证书
- 使用CDN加速

---

## 🔒 安全建议

1. **修改默认密码**
   - 首次登录后立即修改
   - 使用强密码

2. **配置权限**
   - 根据角色分配权限
   - 定期审查权限

3. **启用HTTPS**
   - 生产环境必须使用HTTPS
   - 保护数据传输安全

4. **日志监控**
   - 记录操作日志
   - 监控异常行为

---

## 📞 技术支持

如有问题，请查看：
- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Element Plus 文档](https://element-plus.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)

---

## 🎉 快速开始

1. **启动服务器**（已完成）
   ```bash
   cd qa-app/qa-admin-vue
   npm run dev
   ```

2. **打开浏览器**
   访问：http://localhost:3001

3. **登录系统**
   使用默认账号：admin / admin123

4. **开始管理**
   探索各个功能模块

---

**最后更新**：2026-01-29  
**服务状态**：✅ 运行中  
**访问地址**：http://localhost:3001

