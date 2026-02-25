# 个人资料编辑 API 集成完成

## 实现概述
已完成设置页面中昵称、个人简介、职业三个字段的 API 集成，使用居中对话框进行编辑。

## 实现细节

### 1. API 端点
- **URL**: `PUT /app/user/profile`
- **请求头**: `Authorization: Bearer {token}` (由 apiClient 自动添加)
- **请求体结构**:
```json
{
  "nickName": "用户昵称" | null,
  "signature": "个人简介" | null,
  "profession": "职业" | null
}
```

### 2. 字段映射
前端字段名 → API 字段名：
- `name` → `nickName` (昵称)
- `bio` → `signature` (个人简介)
- `occupation` → `profession` (职业)
- `location` → `location` (所在地，暂未使用)

### 3. API 调用逻辑
- 用户编辑某个字段时，只发送该字段的值
- 其他字段设置为 `null`，表示不修改
- 空字符串也会转换为 `null` 发送

### 4. 修改的文件

#### `src/screens/SettingsScreen.js`
- 导入 `userApi` 和 `ActivityIndicator`
- 添加 `isLoading` 状态管理
- 更新 `handleSaveText` 函数：
  - 改为异步函数 `async`
  - 添加字段名映射逻辑
  - 构建 API 请求数据
  - 调用 `userApi.updateProfile()`
  - 处理成功/失败响应
  - 显示加载状态
- 传递 `loading={isLoading}` 给 EditTextModal

#### `src/components/EditTextModal.js`
- 导入 `ActivityIndicator`
- 添加 `loading` prop (默认 false)
- 保存按钮在 loading 时：
  - 显示加载指示器
  - 禁用按钮
  - 应用禁用样式

### 5. 用户体验
1. 用户点击编辑按钮 → 打开居中对话框
2. 输入新内容 → 点击保存
3. 显示加载指示器 → 调用 API
4. 成功：显示成功提示，更新本地状态
5. 失败：显示错误信息，保持原值

### 6. 错误处理
- API 返回错误码：显示 `response.msg`
- 网络错误：显示 "网络错误，请检查连接后重试"
- 未知字段：显示 "未知的字段类型"

## 测试建议

### 在模拟器/真机上测试：
1. 打开设置页面
2. 点击"昵称"进行编辑
3. 输入新昵称（2-20字符）
4. 点击保存，观察：
   - 保存按钮显示加载指示器
   - API 请求发送到后端
   - 成功后显示提示并更新界面
5. 重复测试"个人简介"和"职业"字段

### 调试 API 请求：
```bash
# 在终端查看 API 请求日志
# apiClient 会自动打印请求和响应信息
```

## API 响应格式
```json
{
  "code": 200,
  "msg": "string",
  "data": {}
}
```

## 注意事项
1. 必须在模拟器或真机上测试，不要在 Web 浏览器测试（CORS 问题）
2. Token 由 apiClient 自动添加到请求头
3. 所在地 (location) 字段已准备好，但 API 可能不支持，需要后端确认
4. 字段验证在前端完成，后端也应该有验证

## 下一步
- 测试 API 集成是否正常工作
- 如需支持所在地编辑，确认后端 API 是否支持 location 字段
- 考虑添加头像上传功能
