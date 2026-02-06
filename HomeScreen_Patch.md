# 🔧 HomeScreen.js 翻译补丁

## ✅ 翻译键已更新

所有需要的翻译键已添加到 `en.json` 和 `zh.json`。

## 📝 需要在 HomeScreen.js 中做的修改

### 修改 1：添加导入（文件顶部，第 6 行后）

在 `import Avatar from '../components/Avatar';` 后面添加：

```javascript
import { useTranslation } from '../i18n/withTranslation';
```

### 修改 2：删除全局 tabs 数组（第 18 行）

**删除这行：**
```javascript
const tabs = ['关注', '话题', '推荐', '热榜', '收入榜', '同城', '国家', '行业', '个人', '职场', '教育'];
```

### 修改 3：在组件开头添加翻译 Hook 和 tabs（第 111 行后）

在 `export default function HomeScreen({ navigation }) {` 后面添加：

```javascript
export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  
  // 标签数组
  const tabs = [
    t('home.follow'),
    t('home.topics'),
    t('home.recommend'),
    t('home.hotList'),
    t('home.incomeRanking'),
    t('home.sameCity'),
    t('home.country'),
    t('home.industry'),
    t('home.personal'),
    t('home.workplace'),
    t('home.education')
  ];
  
  const [activeTab, setActiveTab] = useState(t('home.recommend'));
  // ... 其他代码继续
```

### 修改 4：修改 formatTime 函数的返回值

找到 `formatTime` 函数（约第 135-165 行），修改返回语句：

**原代码：**
```javascript
if (days >= 1) {
  return '昨天';
} else if (hours >= 1) {
  return `${hours}小时前`;
} else if (minutes >= 1) {
  return `${minutes}分钟前`;
} else {
  return '刚刚';
}
```

**修改为：**
```javascript
if (days >= 1) {
  return t('home.yesterday');
} else if (hours >= 1) {
  return `${hours} ${t('home.hoursAgo')}`;
} else if (minutes >= 1) {
  return `${minutes} ${t('home.minutesAgo')}`;
} else {
  return t('home.justNow');
}
```

### 修改 5：修改搜索框 placeholder

找到搜索框的 Text 组件（约第 472 行），修改：

**原代码：**
```javascript
<Text style={styles.searchPlaceholder}>搜索问题、话题或用户</Text>
```

**修改为：**
```javascript
<Text style={styles.searchPlaceholder}>{t('home.search')}</Text>
```

---

## 🎯 完成后的效果

- ✅ 标签栏会根据系统语言显示
- ✅ 搜索框文本会翻译
- ✅ 时间显示会翻译（2小时前 / 2 hours ago）
- ✅ 所有 UI 文本支持多语言

---

## 💡 提示

由于 HomeScreen.js 文件很大（1500+ 行），且包含大量示例数据（城市名、问题标题等），我只翻译了用户界面的关键文本。

示例数据（如问题标题、用户名、城市名）保持原样，因为实际使用时这些数据会从服务器获取。

---

需要我帮你应用这些修改吗？
