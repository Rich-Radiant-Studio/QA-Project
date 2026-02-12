import React, { useState, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../i18n/withTranslation';
import i18n from '../i18n';
import { getHotListData } from '../data/hotListData';
import TranslateButton from '../components/TranslateButton';

// 区域数据
const regionData = {
  countries: [
    { id: 'cn', name: '中国', flag: '🇨🇳' },
    { id: 'us', name: '美国', flag: '🇺🇸' },
    { id: 'jp', name: '日本', flag: '🇯🇵' },
    { id: 'kr', name: '韩国', flag: '🇰🇷' },
    { id: 'uk', name: '英国', flag: '🇬🇧' },
    { id: 'fr', name: '法国', flag: '🇫🇷' },
    { id: 'de', name: '德国', flag: '🇩🇪' },
    { id: 'ca', name: '加拿大', flag: '🇨🇦' },
    { id: 'au', name: '澳大利亚', flag: '🇦🇺' },
    { id: 'sg', name: '新加坡', flag: '🇸🇬' },
  ],
  cities: {
    cn: [
      { id: 'beijing', name: '北京' },
      { id: 'shanghai', name: '上海' },
      { id: 'guangzhou', name: '广州' },
      { id: 'shenzhen', name: '深圳' },
      { id: 'hangzhou', name: '杭州' },
      { id: 'chengdu', name: '成都' },
      { id: 'wuhan', name: '武汉' },
      { id: 'xian', name: '西安' },
      { id: 'chongqing', name: '重庆' },
      { id: 'nanjing', name: '南京' },
    ],
    us: [
      { id: 'newyork', name: '纽约' },
      { id: 'losangeles', name: '洛杉矶' },
      { id: 'chicago', name: '芝加哥' },
      { id: 'houston', name: '休斯顿' },
      { id: 'sanfrancisco', name: '旧金山' },
    ],
    jp: [
      { id: 'tokyo', name: '东京' },
      { id: 'osaka', name: '大阪' },
      { id: 'kyoto', name: '京都' },
      { id: 'yokohama', name: '横滨' },
    ],
    kr: [
      { id: 'seoul', name: '首尔' },
      { id: 'busan', name: '釜山' },
      { id: 'incheon', name: '仁川' },
    ],
  }
};

const hotTabs = ['全站热榜', '国家热榜', '行业热榜', '企业热榜', '个人热榜'];

const subTabsData = {
  '全站热榜': ['科技数码', 'Python编程', '职场发展', '健康养生', '美食烹饪', '旅游出行'],
  '国家热榜': ['政策法规', '社会民生', '经济发展', '教育医疗', '环境保护', '基础设施'],
  '行业热榜': ['互联网', '金融', '医疗健康', '教育培训', '房地产', '制造业', '餐饮服务'],
  '企业热榜': ['科技公司', '金融机构', '制造企业', '互联网公司', '零售企业', '服务行业'],
  '个人热榜': ['职业发展', '情感生活', '健康养生', '理财投资', '学习成长', '家庭关系'],
};

const hotListData = {
  '全站热榜': [
    { id: 'qz1', rank: 1, title: '如何在三个月内从零基础学会Python编程？', hot: '1856万', tag: '热', tagColor: '#ef4444', author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot1', answers: 2345, isUp: true },
    { id: 'qz2', rank: 2, title: '35岁程序员如何规划职业发展？', hot: '1523万', tag: '热', tagColor: '#ef4444', author: '程序员小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot2', answers: 1892, isUp: true },
    { id: 'qz3', rank: 3, title: '2026年最值得学习的编程语言是什么？', hot: '1245万', tag: '新', tagColor: '#22c55e', author: '技术博主', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot3', answers: 1567, isUp: false },
    { id: 'qz4', rank: 4, title: '第一次养猫需要准备什么？', hot: '986万', tag: '', tagColor: '', author: '李小龙', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot4', answers: 1234, isUp: true },
    { id: 'qz5', rank: 5, title: '长期失眠应该怎么调理？', hot: '876万', tag: '', tagColor: '', author: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hot5', answers: 987, isUp: false },
  ],
  '科技数码': [
    { id: 'kj1', rank: 1, title: 'iPhone 15 Pro值得购买吗？', hot: '1234万', tag: '热', tagColor: '#ef4444', author: '数码评测', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kj1', answers: 1876, isUp: true },
    { id: 'kj2', rank: 2, title: '2026年最值得买的笔记本电脑推荐', hot: '987万', tag: '新', tagColor: '#22c55e', author: '科技达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kj2', answers: 1543, isUp: true },
  ],
  'Python编程': [
    { id: 'py1', rank: 1, title: 'Python爬虫入门教程推荐', hot: '1567万', tag: '热', tagColor: '#ef4444', author: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=py1', answers: 2345, isUp: true },
    { id: 'py2', rank: 2, title: 'Django和Flask该选哪个？', hot: '1234万', tag: '', tagColor: '', author: '后端开发', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=py2', answers: 1876, isUp: false },
  ],
  '职场发展': [
    { id: 'zc1', rank: 1, title: '如何写一份优秀的简历？', hot: '1765万', tag: '热', tagColor: '#ef4444', author: 'HR总监', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zc1', answers: 3234, isUp: true },
    { id: 'zc2', rank: 2, title: '面试时如何谈薪资？', hot: '1543万', tag: '热', tagColor: '#ef4444', author: '职场导师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zc2', answers: 2876, isUp: true },
  ],
  '健康养生': [
    { id: 'jk1', rank: 1, title: '每天喝多少水才健康？', hot: '1543万', tag: '热', tagColor: '#ef4444', author: '营养师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jk1', answers: 2345, isUp: true },
    { id: 'jk2', rank: 2, title: '如何科学减肥不反弹？', hot: '1321万', tag: '新', tagColor: '#22c55e', author: '健身教练', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jk2', answers: 1987, isUp: true },
  ],
  '美食烹饪': [
    { id: 'ms1', rank: 1, title: '有什么简单又好吃的家常菜推荐？', hot: '1432万', tag: '热', tagColor: '#ef4444', author: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ms1', answers: 2134, isUp: true },
    { id: 'ms2', rank: 2, title: '新手如何做出好吃的红烧肉？', hot: '1234万', tag: '', tagColor: '', author: '厨艺大师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ms2', answers: 1765, isUp: false },
  ],
  '旅游出行': [
    { id: 'ly1', rank: 1, title: '2026年国内旅游最值得去的地方', hot: '1654万', tag: '热', tagColor: '#ef4444', author: '旅游博主', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ly1', answers: 2456, isUp: true },
    { id: 'ly2', rank: 2, title: '出国旅游需要准备什么？', hot: '1321万', tag: '新', tagColor: '#22c55e', author: '环球旅行家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ly2', answers: 1876, isUp: true },
  ],
  '国家热榜': [
    { id: 'gj1', rank: 1, title: '2026年新能源汽车补贴政策有哪些变化？', hot: '2156万', tag: '热', tagColor: '#ef4444', author: '政策解读', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gj1', answers: 3456, isUp: true },
    { id: 'gj2', rank: 2, title: '医保改革后个人账户怎么用更划算？', hot: '1823万', tag: '热', tagColor: '#ef4444', author: '社保专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gj2', answers: 2891, isUp: true },
    { id: 'gj3', rank: 3, title: '房产税试点城市有哪些新动态？', hot: '1567万', tag: '新', tagColor: '#22c55e', author: '房产观察', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gj3', answers: 1987, isUp: false },
    { id: 'gj4', rank: 4, title: '延迟退休政策对80后影响有多大？', hot: '1234万', tag: '', tagColor: '', author: '职场分析', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gj4', answers: 1654, isUp: true },
    { id: 'gj5', rank: 5, title: '教育双减政策实施效果如何？', hot: '1098万', tag: '', tagColor: '', author: '教育观察', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gj5', answers: 1432, isUp: false },
  ],
  '行业热榜': [
    { id: 'hy1', rank: 1, title: 'AI大模型会取代程序员吗？', hot: '2567万', tag: '热', tagColor: '#ef4444', author: 'AI研究员', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hy1', answers: 4567, isUp: true },
    { id: 'hy2', rank: 2, title: '新能源行业未来5年发展趋势？', hot: '2134万', tag: '热', tagColor: '#ef4444', author: '行业分析师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hy2', answers: 3456, isUp: true },
    { id: 'hy3', rank: 3, title: '医疗健康行业有哪些创业机会？', hot: '1876万', tag: '新', tagColor: '#22c55e', author: '创业导师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hy3', answers: 2345, isUp: false },
    { id: 'hy4', rank: 4, title: '金融科技如何改变传统银行？', hot: '1543万', tag: '', tagColor: '', author: '金融专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hy4', answers: 1987, isUp: true },
    { id: 'hy5', rank: 5, title: '教育培训行业转型方向在哪？', hot: '1234万', tag: '', tagColor: '', author: '教育从业者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hy5', answers: 1654, isUp: false },
  ],
  '企业热榜': [
    { id: 'qy1', rank: 1, title: '华为2026年新品发布会有哪些亮点？', hot: '2234万', tag: '热', tagColor: '#ef4444', author: '科技观察', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qy1', answers: 3987, isUp: true },
    { id: 'qy2', rank: 2, title: '阿里巴巴组织架构调整意味着什么？', hot: '1987万', tag: '热', tagColor: '#ef4444', author: '互联网分析', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qy2', answers: 3234, isUp: true },
    { id: 'qy3', rank: 3, title: '比亚迪新能源汽车销量为何持续增长？', hot: '1765万', tag: '新', tagColor: '#22c55e', author: '汽车评论', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qy3', answers: 2876, isUp: false },
    { id: 'qy4', rank: 4, title: '字节跳动裁员传闻是真的吗？', hot: '1543万', tag: '', tagColor: '', author: '职场内幕', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qy4', answers: 2345, isUp: true },
    { id: 'qy5', rank: 5, title: '小米造车进展如何？', hot: '1321万', tag: '', tagColor: '', author: '数码博主', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qy5', answers: 1987, isUp: false },
  ],
  '个人热榜': [
    { id: 'gr1', rank: 1, title: '30岁转行还来得及吗？', hot: '1987万', tag: '热', tagColor: '#ef4444', author: '职场导师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gr1', answers: 3567, isUp: true },
    { id: 'gr2', rank: 2, title: '如何克服社交恐惧症？', hot: '1765万', tag: '热', tagColor: '#ef4444', author: '心理咨询师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gr2', answers: 2987, isUp: true },
    { id: 'gr3', rank: 3, title: '年轻人如何开始理财？', hot: '1543万', tag: '新', tagColor: '#22c55e', author: '理财规划师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gr3', answers: 2345, isUp: false },
    { id: 'gr4', rank: 4, title: '异地恋如何维持感情？', hot: '1321万', tag: '', tagColor: '', author: '情感博主', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gr4', answers: 1876, isUp: true },
    { id: 'gr5', rank: 5, title: '如何养成早起的习惯？', hot: '1098万', tag: '', tagColor: '', author: '自律达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gr5', answers: 1543, isUp: false },
  ],
  '政策法规': [
    { id: 'zc1', rank: 1, title: '2026年个税专项附加扣除有哪些新变化？', hot: '1567万', tag: '热', tagColor: '#ef4444', author: '税务专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zc1', answers: 2345, isUp: true },
    { id: 'zc2', rank: 2, title: '新劳动法对加班费有什么规定？', hot: '1234万', tag: '新', tagColor: '#22c55e', author: '劳动法律师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zc2', answers: 1876, isUp: true },
  ],
  '社会民生': [
    { id: 'sh1', rank: 1, title: '养老金并轨后退休金怎么算？', hot: '1876万', tag: '热', tagColor: '#ef4444', author: '社保专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sh1', answers: 2987, isUp: true },
    { id: 'sh2', rank: 2, title: '公租房申请条件和流程是什么？', hot: '1543万', tag: '', tagColor: '', author: '住房顾问', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sh2', answers: 2134, isUp: false },
  ],
  '经济发展': [
    { id: 'jj1', rank: 1, title: 'GDP增速放缓对就业有什么影响？', hot: '1654万', tag: '热', tagColor: '#ef4444', author: '经济学家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jj1', answers: 2567, isUp: true },
  ],
  '教育医疗': [
    { id: 'jy1', rank: 1, title: '高考改革后志愿怎么填更合理？', hot: '1765万', tag: '热', tagColor: '#ef4444', author: '教育专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jy1', answers: 2876, isUp: true },
  ],
  '环境保护': [
    { id: 'hj1', rank: 1, title: '碳中和目标下普通人能做什么？', hot: '1432万', tag: '新', tagColor: '#22c55e', author: '环保达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hj1', answers: 1987, isUp: true },
  ],
  '基础设施': [
    { id: 'jc1', rank: 1, title: '高铁票价会涨吗？', hot: '1321万', tag: '热', tagColor: '#ef4444', author: '交通观察', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jc1', answers: 1876, isUp: false },
  ],
  '互联网': [
    { id: 'hlw1', rank: 1, title: 'ChatGPT对互联网行业的影响有多大？', hot: '2345万', tag: '热', tagColor: '#ef4444', author: '科技博主', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hlw1', answers: 4567, isUp: true },
    { id: 'hlw2', rank: 2, title: '2026年互联网大厂还值得去吗？', hot: '1987万', tag: '热', tagColor: '#ef4444', author: '程序员老王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hlw2', answers: 3456, isUp: true },
  ],
  '金融': [
    { id: 'jr1', rank: 1, title: '数字人民币会取代支付宝微信吗？', hot: '1876万', tag: '热', tagColor: '#ef4444', author: '金融分析师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jr1', answers: 2987, isUp: true },
    { id: 'jr2', rank: 2, title: '银行理财产品还能买吗？', hot: '1543万', tag: '新', tagColor: '#22c55e', author: '理财顾问', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jr2', answers: 2345, isUp: false },
  ],
  '医疗健康': [
    { id: 'yl1', rank: 1, title: '互联网医疗靠谱吗？', hot: '1654万', tag: '热', tagColor: '#ef4444', author: '医疗从业者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yl1', answers: 2567, isUp: true },
  ],
  '教育培训': [
    { id: 'jypx1', rank: 1, title: '在线教育平台怎么选？', hot: '1543万', tag: '热', tagColor: '#ef4444', author: '教育观察', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jypx1', answers: 2345, isUp: true },
  ],
  '房地产': [
    { id: 'fdc1', rank: 1, title: '2026年是买房好时机吗？', hot: '1876万', tag: '热', tagColor: '#ef4444', author: '房产专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fdc1', answers: 2987, isUp: false },
  ],
  '制造业': [
    { id: 'zzy1', rank: 1, title: '智能制造会带来大规模失业吗？', hot: '1432万', tag: '新', tagColor: '#22c55e', author: '制造业观察', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zzy1', answers: 1987, isUp: true },
  ],
  '餐饮服务': [
    { id: 'cy1', rank: 1, title: '开餐饮店需要注意什么？', hot: '1321万', tag: '热', tagColor: '#ef4444', author: '餐饮老板', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cy1', answers: 1876, isUp: true },
  ],
  '科技公司': [
    { id: 'kjgs1', rank: 1, title: '华为Mate 60系列为何能突破封锁？', hot: '2456万', tag: '热', tagColor: '#ef4444', author: '科技评论', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kjgs1', answers: 4321, isUp: true },
    { id: 'kjgs2', rank: 2, title: '苹果Vision Pro值得购买吗？', hot: '2134万', tag: '热', tagColor: '#ef4444', author: '数码达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kjgs2', answers: 3876, isUp: true },
  ],
  '金融机构': [
    { id: 'jrjg1', rank: 1, title: '银行存款利率为何持续下降？', hot: '1987万', tag: '热', tagColor: '#ef4444', author: '金融观察', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jrjg1', answers: 3234, isUp: true },
    { id: 'jrjg2', rank: 2, title: '保险公司理赔难是真的吗？', hot: '1654万', tag: '', tagColor: '', author: '保险专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jrjg2', answers: 2567, isUp: false },
  ],
  '制造企业': [
    { id: 'zzqy1', rank: 1, title: '比亚迪如何超越特斯拉？', hot: '2234万', tag: '热', tagColor: '#ef4444', author: '汽车分析', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zzqy1', answers: 3987, isUp: true },
    { id: 'zzqy2', rank: 2, title: '宁德时代电池技术有多强？', hot: '1876万', tag: '新', tagColor: '#22c55e', author: '新能源观察', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zzqy2', answers: 2987, isUp: true },
  ],
  '互联网公司': [
    { id: 'hlwgs1', rank: 1, title: '字节跳动为何能持续创新？', hot: '2098万', tag: '热', tagColor: '#ef4444', author: '互联网观察', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hlwgs1', answers: 3654, isUp: true },
    { id: 'hlwgs2', rank: 2, title: '阿里云在全球市场表现如何？', hot: '1765万', tag: '', tagColor: '', author: '云计算专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hlwgs2', answers: 2876, isUp: false },
  ],
  '零售企业': [
    { id: 'lsqy1', rank: 1, title: '盒马鲜生的商业模式能复制吗？', hot: '1543万', tag: '热', tagColor: '#ef4444', author: '零售分析', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lsqy1', answers: 2345, isUp: true },
    { id: 'lsqy2', rank: 2, title: '传统超市如何应对电商冲击？', hot: '1321万', tag: '', tagColor: '', author: '商业观察', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lsqy2', answers: 1987, isUp: false },
  ],
  '服务行业': [
    { id: 'fwhy1', rank: 1, title: '海底捞服务为何这么好？', hot: '1654万', tag: '热', tagColor: '#ef4444', author: '餐饮观察', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fwhy1', answers: 2567, isUp: true },
    { id: 'fwhy2', rank: 2, title: '美团外卖如何提升配送效率？', hot: '1432万', tag: '新', tagColor: '#22c55e', author: '物流专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fwhy2', answers: 2134, isUp: true },
  ],
  '职业发展': [
    { id: 'zy1', rank: 1, title: '如何写一份优秀的简历？', hot: '1765万', tag: '热', tagColor: '#ef4444', author: 'HR总监', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zy1', answers: 3234, isUp: true },
    { id: 'zy2', rank: 2, title: '面试时如何谈薪资？', hot: '1543万', tag: '热', tagColor: '#ef4444', author: '职场导师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zy2', answers: 2876, isUp: true },
  ],
  '情感生活': [
    { id: 'qg1', rank: 1, title: '如何判断一个人是否真心喜欢你？', hot: '1654万', tag: '热', tagColor: '#ef4444', author: '情感专家', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qg1', answers: 2987, isUp: true },
    { id: 'qg2', rank: 2, title: '婚姻中如何保持新鲜感？', hot: '1432万', tag: '', tagColor: '', author: '婚姻咨询师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qg2', answers: 2345, isUp: false },
  ],
  '健康养生': [
    { id: 'jkys1', rank: 1, title: '每天喝多少水才健康？', hot: '1543万', tag: '热', tagColor: '#ef4444', author: '营养师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jkys1', answers: 2345, isUp: true },
  ],
  '理财投资': [
    { id: 'lctz1', rank: 1, title: '基金定投真的能赚钱吗？', hot: '1654万', tag: '热', tagColor: '#ef4444', author: '理财达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lctz1', answers: 2567, isUp: true },
  ],
  '学习成长': [
    { id: 'xxcz1', rank: 1, title: '如何高效学习一门新技能？', hot: '1765万', tag: '热', tagColor: '#ef4444', author: '学习达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xxcz1', answers: 2876, isUp: true },
  ],
  '家庭关系': [
    { id: 'jtgx1', rank: 1, title: '如何处理婆媳关系？', hot: '1432万', tag: '热', tagColor: '#ef4444', author: '家庭咨询师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jtgx1', answers: 1987, isUp: false },
  ],
};

const getRankBg = (rank) => {
  if (rank === 1) return '#ef4444';
  if (rank === 2) return '#f97316';
  if (rank === 3) return '#f59e0b';
  return '#9ca3af';
};

// 热榜项组件 - 独立组件避免重渲染问题
function HotItem({ item, onPress, t }) {
  const [translatedTitle, setTranslatedTitle] = useState(null);
  const hasTag = item.tag && item.tag !== '';
  
  const handleTranslated = (translated, isTranslated) => {
    setTranslatedTitle(isTranslated ? translated : null);
  };
  
  return (
    <TouchableOpacity style={styles.hotItem} onPress={onPress}>
      <View style={[styles.rankBadge, { backgroundColor: getRankBg(item.rank) }]}>
        <Text style={styles.rankText}>{item.rank}</Text>
      </View>
      <View style={styles.hotContent}>
        <View style={styles.hotTitleRow}>
          <Text style={styles.hotTitle} numberOfLines={2}>
            {translatedTitle || item.title}
          </Text>
          {hasTag && (
            <View style={[styles.hotTag, { backgroundColor: item.tagColor }]}>
              <Text style={styles.hotTagText}>{item.tag}</Text>
            </View>
          )}
        </View>
        
        {/* 翻译按钮 */}
        <TranslateButton 
          text={item.title}
          onTranslated={handleTranslated}
          compact={true}
          style={styles.translateButton}
        />
        
        <View style={styles.hotMeta}>
          <View style={styles.hotStats}>
            <Text style={styles.hotValue}>{item.hot}</Text>
            <Text style={styles.hotLabel}>{t('screens.hotListScreen.hotLabel')}</Text>
            <Ionicons 
              name={item.isUp ? "trending-up" : "trending-down"} 
              size={14} 
              color={item.isUp ? "#22c55e" : "#ef4444"} 
            />
          </View>
          <View style={styles.hotAuthor}>
            <Image source={{ uri: item.avatar }} style={styles.authorAvatar} />
            <Text style={styles.authorName}>{item.author}</Text>
            <Text style={styles.answerCount}>{item.answers}{t('screens.hotListScreen.answersCount')}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
    </TouchableOpacity>
  );
}

// 二级标签组件
function SubTabItem({ label, isActive, onPress }) {
  return (
    <TouchableOpacity 
      style={[styles.subTabItem, isActive && styles.subTabItemActive]}
      onPress={onPress}
    >
      <Text style={[styles.subTabText, isActive && styles.subTabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function HotListScreen({ navigation }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  // Translation mapping for tabs
  const hotTabs = [
    t('screens.hotListScreen.tabs.siteWide'),
    t('screens.hotListScreen.tabs.national'),
    t('screens.hotListScreen.tabs.industry'),
    t('screens.hotListScreen.tabs.enterprise'),
    t('screens.hotListScreen.tabs.personal')
  ];
  
  // Translation mapping for sub-tabs
  const subTabsData = {
    [t('screens.hotListScreen.tabs.siteWide')]: [
      t('screens.hotListScreen.subTabs.techDigital'),
      t('screens.hotListScreen.subTabs.pythonProgramming'),
      t('screens.hotListScreen.subTabs.careerDevelopment'),
      t('screens.hotListScreen.subTabs.healthWellness'),
      t('screens.hotListScreen.subTabs.foodCooking'),
      t('screens.hotListScreen.subTabs.travelTourism')
    ],
    [t('screens.hotListScreen.tabs.national')]: [
      t('screens.hotListScreen.subTabs.policyRegulation'),
      t('screens.hotListScreen.subTabs.socialLivelihood'),
      t('screens.hotListScreen.subTabs.economicDevelopment'),
      t('screens.hotListScreen.subTabs.educationHealthcare'),
      t('screens.hotListScreen.subTabs.environmentalProtection'),
      t('screens.hotListScreen.subTabs.infrastructure')
    ],
    [t('screens.hotListScreen.tabs.industry')]: [
      t('screens.hotListScreen.subTabs.internet'),
      t('screens.hotListScreen.subTabs.finance'),
      t('screens.hotListScreen.subTabs.medicalHealth'),
      t('screens.hotListScreen.subTabs.educationTraining'),
      t('screens.hotListScreen.subTabs.realEstate'),
      t('screens.hotListScreen.subTabs.manufacturing'),
      t('screens.hotListScreen.subTabs.cateringService')
    ],
    [t('screens.hotListScreen.tabs.enterprise')]: [
      t('screens.hotListScreen.subTabs.techCompanies'),
      t('screens.hotListScreen.subTabs.financialInstitutions'),
      t('screens.hotListScreen.subTabs.manufacturingEnterprises'),
      t('screens.hotListScreen.subTabs.internetCompanies'),
      t('screens.hotListScreen.subTabs.retailEnterprises'),
      t('screens.hotListScreen.subTabs.serviceIndustry')
    ],
    [t('screens.hotListScreen.tabs.personal')]: [
      t('screens.hotListScreen.subTabs.careerGrowth'),
      t('screens.hotListScreen.subTabs.emotionalLife'),
      t('screens.hotListScreen.subTabs.healthWellness'),
      t('screens.hotListScreen.subTabs.financialInvestment'),
      t('screens.hotListScreen.subTabs.learningGrowth'),
      t('screens.hotListScreen.subTabs.familyRelations')
    ]
  };
  
  const [activeTab, setActiveTab] = useState(hotTabs[0]);
  const [activeSubTab, setActiveSubTab] = useState('');
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState({ type: 'country', id: 'cn', name: '中国', flag: '🇨🇳' });
  const [regionType, setRegionType] = useState('country'); // 'country' or 'city'
  const tabScrollViewRef = useRef(null);
  const tabLayouts = useRef({});

  // 创建翻译键到数据键的映射
  const tabToDataKey = useMemo(() => ({
    [t('screens.hotListScreen.tabs.siteWide')]: '全站热榜',
    [t('screens.hotListScreen.tabs.national')]: '国家热榜',
    [t('screens.hotListScreen.tabs.industry')]: '行业热榜',
    [t('screens.hotListScreen.tabs.enterprise')]: '企业热榜',
    [t('screens.hotListScreen.tabs.personal')]: '个人热榜',
  }), [t]);

  const subTabToDataKey = useMemo(() => ({
    [t('screens.hotListScreen.subTabs.techDigital')]: '科技数码',
    [t('screens.hotListScreen.subTabs.pythonProgramming')]: 'Python编程',
    [t('screens.hotListScreen.subTabs.careerDevelopment')]: '职场发展',
    [t('screens.hotListScreen.subTabs.healthWellness')]: '健康养生',
    [t('screens.hotListScreen.subTabs.foodCooking')]: '美食烹饪',
    [t('screens.hotListScreen.subTabs.travelTourism')]: '旅游出行',
    [t('screens.hotListScreen.subTabs.policyRegulation')]: '政策法规',
    [t('screens.hotListScreen.subTabs.socialLivelihood')]: '社会民生',
    [t('screens.hotListScreen.subTabs.economicDevelopment')]: '经济发展',
    [t('screens.hotListScreen.subTabs.educationHealthcare')]: '教育医疗',
    [t('screens.hotListScreen.subTabs.environmentalProtection')]: '环境保护',
    [t('screens.hotListScreen.subTabs.infrastructure')]: '基础设施',
    [t('screens.hotListScreen.subTabs.internet')]: '互联网',
    [t('screens.hotListScreen.subTabs.finance')]: '金融',
    [t('screens.hotListScreen.subTabs.medicalHealth')]: '医疗健康',
    [t('screens.hotListScreen.subTabs.educationTraining')]: '教育培训',
    [t('screens.hotListScreen.subTabs.realEstate')]: '房地产',
    [t('screens.hotListScreen.subTabs.manufacturing')]: '制造业',
    [t('screens.hotListScreen.subTabs.cateringService')]: '餐饮服务',
    [t('screens.hotListScreen.subTabs.techCompanies')]: '科技公司',
    [t('screens.hotListScreen.subTabs.financialInstitutions')]: '金融机构',
    [t('screens.hotListScreen.subTabs.manufacturingEnterprises')]: '制造企业',
    [t('screens.hotListScreen.subTabs.internetCompanies')]: '互联网公司',
    [t('screens.hotListScreen.subTabs.retailEnterprises')]: '零售企业',
    [t('screens.hotListScreen.subTabs.serviceIndustry')]: '服务行业',
    [t('screens.hotListScreen.subTabs.careerGrowth')]: '职业发展',
    [t('screens.hotListScreen.subTabs.emotionalLife')]: '情感生活',
    [t('screens.hotListScreen.subTabs.financialInvestment')]: '理财投资',
    [t('screens.hotListScreen.subTabs.learningGrowth')]: '学习成长',
    [t('screens.hotListScreen.subTabs.familyRelations')]: '家庭关系',
  }), [t]);

  // 计算当前显示的二级标签
  const visibleSubTabs = subTabsData[activeTab] || [];
  const hasSubTabs = visibleSubTabs.length > 0;

  // 根据当前语言获取数据
  const hotListData = useMemo(() => getHotListData(i18n.locale), []);

  // 计算当前显示的数据 - 使用映射获取正确的数据键
  const translatedKey = activeSubTab || activeTab;
  const dataKey = subTabToDataKey[translatedKey] || tabToDataKey[translatedKey] || translatedKey;
  const currentData = hotListData[dataKey] || [];
  const displayTitle = activeSubTab || activeTab;

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    setActiveSubTab('');
    
    // 滚动到选中的标签
    const tabIndex = hotTabs.indexOf(tab);
    if (tabScrollViewRef.current && tabLayouts.current[tab]) {
      const layout = tabLayouts.current[tab];
      tabScrollViewRef.current.scrollTo({
        x: layout.x - 16, // 减去左边距，让标签更居中
        animated: true
      });
    }
  };

  const handleSubTabPress = (sub) => {
    setActiveSubTab(activeSubTab === sub ? '' : sub);
  };

  const handleItemPress = (item) => {
    navigation.navigate('QuestionDetail', { id: item.id });
  };

  const handleRegionSelect = (type, item) => {
    if (type === 'country') {
      setSelectedRegion({ type: 'country', id: item.id, name: item.name, flag: item.flag });
      setRegionType('country');
    } else {
      setSelectedRegion({ type: 'city', id: item.id, name: item.name, countryId: selectedRegion.id });
      setRegionType('city');
    }
    setShowRegionModal(false);
  };

  const getCitiesForSelectedCountry = () => {
    if (selectedRegion.type === 'country') {
      return regionData.cities[selectedRegion.id] || [];
    }
    return regionData.cities[selectedRegion.countryId] || [];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('screens.hotListScreen.title')}</Text>
        <TouchableOpacity 
          style={styles.refreshBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={22} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.regionTabBtn}
          onPress={() => setShowRegionModal(true)}
        >
          <Text style={styles.regionTabText}>
            {selectedRegion.flag} {selectedRegion.name}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#6b7280" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <ScrollView 
            ref={tabScrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            bounces={true}
            alwaysBounceHorizontal={true}
            scrollEnabled={true}
          >
            <View style={styles.tabBarContent}>
              {hotTabs.map((tab) => (
                <TouchableOpacity 
                  key={tab} 
                  style={styles.tabItem}
                  onPress={() => handleTabPress(tab)}
                  onLayout={(e) => {
                    tabLayouts.current[tab] = e.nativeEvent.layout;
                  }}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                  {activeTab === tab && <View style={styles.tabIndicator} />}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {hasSubTabs && (
        <View style={styles.subTabBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <SubTabItem 
              label={t('screens.hotListScreen.allTab')}
              isActive={activeSubTab === ''}
              onPress={() => setActiveSubTab('')}
            />
            {visibleSubTabs.map((sub) => (
              <SubTabItem 
                key={sub}
                label={sub}
                isActive={activeSubTab === sub}
                onPress={() => handleSubTabPress(sub)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.updateInfo}>
        <Ionicons name="time-outline" size={14} color="#9ca3af" />
        <Text style={styles.updateText}>{displayTitle} · {t('screens.hotListScreen.updatedAt', { time: '5分钟前' })}</Text>
      </View>

      <ScrollView style={styles.list}>
        {currentData.map((item) => (
          <HotItem key={item.id} item={item} onPress={() => handleItemPress(item)} t={t} />
        ))}
        <View style={styles.listFooter} />
      </ScrollView>

      {/* 区域选择弹窗 */}
      <Modal
        visible={showRegionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowRegionModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowRegionModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.regionModal, { paddingBottom: 30 }]}>
              <View style={styles.regionModalHandle} />
              <View style={styles.regionModalHeader}>
                <Text style={styles.regionModalTitle}>{t('screens.hotListScreen.selectRegion')}</Text>
                <TouchableOpacity onPress={() => setShowRegionModal(false)}>
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
            
            <View style={styles.regionTypeTabs}>
              <TouchableOpacity 
                style={[styles.regionTypeTab, regionType === 'country' && styles.regionTypeTabActive]}
                onPress={() => setRegionType('country')}
              >
                <Text style={[styles.regionTypeTabText, regionType === 'country' && styles.regionTypeTabTextActive]}>
                  {t('screens.hotListScreen.country')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.regionTypeTab, regionType === 'city' && styles.regionTypeTabActive]}
                onPress={() => setRegionType('city')}
              >
                <Text style={[styles.regionTypeTabText, regionType === 'city' && styles.regionTypeTabTextActive]}>
                  {t('screens.hotListScreen.city')}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.regionList}>
              {regionType === 'country' ? (
                <View style={styles.regionGrid}>
                  {regionData.countries.map((country) => (
                    <TouchableOpacity
                      key={country.id}
                      style={[
                        styles.regionItem,
                        selectedRegion.id === country.id && selectedRegion.type === 'country' && styles.regionItemActive
                      ]}
                      onPress={() => handleRegionSelect('country', country)}
                    >
                      <Text style={styles.regionFlag}>{country.flag}</Text>
                      <Text style={[
                        styles.regionName,
                        selectedRegion.id === country.id && selectedRegion.type === 'country' && styles.regionNameActive
                      ]}>
                        {country.name}
                      </Text>
                      {selectedRegion.id === country.id && selectedRegion.type === 'country' && (
                        <Ionicons name="checkmark-circle" size={16} color="#ef4444" style={styles.regionCheck} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.regionGrid}>
                  {getCitiesForSelectedCountry().map((city) => (
                    <TouchableOpacity
                      key={city.id}
                      style={[
                        styles.regionItem,
                        selectedRegion.id === city.id && selectedRegion.type === 'city' && styles.regionItemActive
                      ]}
                      onPress={() => handleRegionSelect('city', city)}
                    >
                      <Text style={[
                        styles.regionCityName,
                        selectedRegion.id === city.id && selectedRegion.type === 'city' && styles.regionNameActive
                      ]}>
                        {city.name}
                      </Text>
                      {selectedRegion.id === city.id && selectedRegion.type === 'city' && (
                        <Ionicons name="checkmark-circle" size={16} color="#ef4444" style={styles.regionCheck} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937' },
  refreshBtn: { padding: 4 },
  tabBar: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabBarContent: { flexDirection: 'row', alignItems: 'center', paddingRight: 16 },
  tabItem: { paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  tabText: { fontSize: 15, color: '#6b7280' },
  tabTextActive: { color: '#ef4444', fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, height: 2, backgroundColor: '#ef4444', alignSelf: 'center', width: '60%' },
  regionTabBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, marginLeft: 8, marginRight: 16, backgroundColor: '#f9fafb', borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  regionTabText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  subTabBar: { backgroundColor: '#fafafa', paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  subTabItem: { paddingHorizontal: 14, paddingVertical: 6, marginRight: 10, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  subTabItemActive: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  subTabText: { fontSize: 13, color: '#666' },
  subTabTextActive: { color: '#fff', fontWeight: '500' },
  updateInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, backgroundColor: '#fafafa' },
  updateText: { fontSize: 12, color: '#9ca3af', marginLeft: 4 },
  list: { flex: 1 },
  listFooter: { height: 20 },
  hotItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  rankBadge: { width: 24, height: 24, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rankText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  hotContent: { flex: 1 },
  hotTitleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  hotTitle: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1f2937', lineHeight: 22 },
  hotTag: { marginLeft: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  hotTagText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  translateButton: { marginTop: -4, marginBottom: 4 },
  hotMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  hotStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  hotValue: { fontSize: 13, color: '#ef4444', fontWeight: '600' },
  hotLabel: { fontSize: 11, color: '#9ca3af' },
  hotAuthor: { flexDirection: 'row', alignItems: 'center' },
  authorAvatar: { width: 18, height: 18, borderRadius: 9 },
  authorName: { fontSize: 12, color: '#6b7280', marginLeft: 6 },
  answerCount: { fontSize: 11, color: '#9ca3af', marginLeft: 8 },
  
  // 区域选择弹窗样式
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  regionModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  regionModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  regionModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  regionModalTitle: { fontSize: 17, fontWeight: '600', color: '#1f2937' },
  regionTypeTabs: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  regionTypeTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8, backgroundColor: '#f9fafb' },
  regionTypeTabActive: { backgroundColor: '#ef4444' },
  regionTypeTabText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  regionTypeTabTextActive: { color: '#fff', fontWeight: '600' },
  regionList: { maxHeight: 400 },
  regionGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12 },
  regionItem: { width: '30%', margin: '1.66%', paddingVertical: 16, paddingHorizontal: 8, alignItems: 'center', borderRadius: 12, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', position: 'relative' },
  regionItemActive: { backgroundColor: '#fef2f2', borderColor: '#ef4444' },
  regionFlag: { fontSize: 32, marginBottom: 8 },
  regionName: { fontSize: 13, color: '#374151', fontWeight: '500', textAlign: 'center' },
  regionCityName: { fontSize: 14, color: '#374151', fontWeight: '500', textAlign: 'center' },
  regionNameActive: { color: '#ef4444', fontWeight: '600' },
  regionCheck: { position: 'absolute', top: 8, right: 8 },
});
