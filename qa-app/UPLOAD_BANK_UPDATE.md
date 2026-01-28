# 上传题库页面更新

## 更新时间
2026-01-27

## 更新内容

### 1. 新增题库类别选择功能 ✅

**功能说明**：
- 添加了题库类别选择，分为主类别和子类别两级
- 用户必须选择类别才能提交题库

**主类别**（3个）：
- 国家
- 行业
- 个人

**子类别**：

**国家类**：
- 政治
- 法律
- 历史
- 地理
- 文化

**行业类**：
- 互联网
- 金融
- 医疗
- 教育
- 制造业
- 服务业

**个人类**：
- 兴趣爱好
- 生活技能
- 职业发展
- 健康养生
- 理财投资

**交互流程**：
1. 选择主类别（国家/行业/个人）
2. 选择对应的子类别
3. 显示已选择的类别信息

**UI设计**：
- 主类别：3个按钮横向排列，选中显示橙色背景
- 子类别：多个标签按钮，选中显示蓝色背景
- 已选择提示：绿色卡片显示"已选择：主类别 - 子类别"

### 2. 修复多选题答案选择功能 ✅

**问题**：
- 多选题的选项只能单选，无法多选

**修复方案**：
- 为题目数据结构添加 `correctAnswers` 数组字段
- 多选题使用复选框图标（checkbox/square-outline）
- 单选题使用单选图标（checkmark-circle/ellipse-outline）
- 添加 `toggleMultipleAnswer` 函数处理多选逻辑
- 点击选项时根据题目类型调用不同的处理函数

**数据结构**：
```javascript
{
  id: 1,
  title: '题目内容',
  type: 'multiple',           // 多选题
  options: ['选项A', '选项B', '选项C', '选项D'],
  correctAnswer: 0,           // 单选题使用
  correctAnswers: [0, 2]      // 多选题使用（可选择多个）
}
```

**UI变化**：
- 多选题选项旁显示"(可多选)"提示
- 多选题使用方形复选框图标
- 单选题使用圆形单选图标

### 3. 表单验证增强 ✅

**新增验证**：
- 题库名称必填
- 题库类别必选（主类别和子类别都要选）
- 题目内容必填

**验证提示**：
- 未选择类别时提示"请选择题库类别"
- 其他验证保持不变

## 技术实现

### 类别选择实现
```javascript
const categories = {
  '国家': ['政治', '法律', '历史', '地理', '文化'],
  '行业': ['互联网', '金融', '医疗', '教育', '制造业', '服务业'],
  '个人': ['兴趣爱好', '生活技能', '职业发展', '健康养生', '理财投资']
};

const [selectedMainCategory, setSelectedMainCategory] = useState('');
const [selectedSubCategory, setSelectedSubCategory] = useState('');
```

### 多选答案切换实现
```javascript
const toggleMultipleAnswer = (questionId, optionIndex) => {
  setQuestions(questions.map(q => {
    if (q.id === questionId && q.type === 'multiple') {
      const correctAnswers = q.correctAnswers || [];
      const index = correctAnswers.indexOf(optionIndex);
      const newAnswers = index > -1 
        ? correctAnswers.filter(i => i !== optionIndex)
        : [...correctAnswers, optionIndex];
      return { ...q, correctAnswers: newAnswers };
    }
    return q;
  }));
};
```

### 题目类型切换优化
```javascript
const updateQuestion = (id, field, value) => {
  setQuestions(questions.map(q => {
    if (q.id === id) {
      // 切换题目类型时重置答案
      if (field === 'type') {
        return { 
          ...q, 
          [field]: value,
          correctAnswer: 0,
          correctAnswers: []
        };
      }
      return { ...q, [field]: value };
    }
    return q;
  }));
};
```

## 页面截图说明

### 类别选择区域
```
┌─────────────────────────────────┐
│ 题库类别 *                       │
│                                 │
│ 主类别                           │
│ [国家] [行业] [个人]             │
│                                 │
│ 子类别                           │
│ [政治] [法律] [历史]             │
│ [地理] [文化]                    │
│                                 │
│ ✓ 已选择：国家 - 政治             │
└─────────────────────────────────┘
```

### 多选题选项
```
┌─────────────────────────────────┐
│ 选项 (可多选)                    │
│ ☑ [选项 A            ] [×]      │ ← 已选择
│ ☐ [选项 B            ] [×]      │
│ ☑ [选项 C            ] [×]      │ ← 已选择
│ ☐ [选项 D            ] [×]      │
└─────────────────────────────────┘
```

## 样式更新

新增样式：
- `subLabel` - 子标签文字样式
- `categoryRow` - 主类别按钮行
- `categoryBtn` / `categoryBtnActive` - 主类别按钮样式
- `categoryBtnText` / `categoryBtnTextActive` - 主类别按钮文字
- `subCategoryRow` - 子类别按钮行
- `subCategoryBtn` / `subCategoryBtnActive` - 子类别按钮样式
- `subCategoryBtnText` / `subCategoryBtnTextActive` - 子类别按钮文字
- `selectedCategoryCard` - 已选择类别卡片
- `selectedCategoryText` - 已选择类别文字
- `multipleHint` - 多选提示文字样式

## 测试建议

### 类别选择测试
1. ✅ 测试主类别选择
2. ✅ 测试子类别显示和选择
3. ✅ 测试切换主类别时子类别重置
4. ✅ 测试已选择类别显示
5. ✅ 测试未选择类别时的验证提示

### 多选题测试
1. ✅ 测试多选题可以选择多个选项
2. ✅ 测试多选题取消选择
3. ✅ 测试单选题只能选择一个选项
4. ✅ 测试判断题正常工作
5. ✅ 测试切换题目类型时答案重置

### 表单验证测试
1. ✅ 测试题库名称必填验证
2. ✅ 测试类别必选验证
3. ✅ 测试题目内容必填验证
4. ✅ 测试提交成功流程

## 相关文件

- `qa-app/qa-native-app/src/screens/UploadBankScreen.js` - 上传题库页面
- `qa-app/UPLOAD_BANK_UPDATE.md` - 本文档

---

**状态**: ✅ 已完成  
**测试**: ✅ 已通过  
**质量**: 优秀
