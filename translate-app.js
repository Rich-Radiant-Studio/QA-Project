// 这个脚本用于批量翻译 APP 中的中文文本
// 使用方法：node translate-app.js

const fs = require('fs');
const path = require('path');

// 中文到翻译键的映射
const translations = {
  // 导航和标签
  '首页': 'tabs.home',
  '活动': 'tabs.activity',
  '发布': 'tabs.publish',
  '紧急求助': 'tabs.emergency',
  '我的': 'tabs.profile',
  
  // 首页
  '搜索问题...': 'home.search',
  '关注': 'home.follow',
  '话题': 'home.topics',
  '推荐': 'home.recommend',
  '热榜': 'home.hotList',
  '收益榜': 'home.incomeRanking',
  '同城': 'home.sameCity',
  '国家': 'home.country',
  '行业': 'home.industry',
  '个人': 'home.personal',
  '职场': 'home.workplace',
  '教育': 'home.education',
  '小时前': 'home.hoursAgo',
  '昨天': 'home.yesterday',
  '悬赏': 'home.reward',
  '付费': 'home.paid',
  '定向': 'home.targeted',
  '免费': 'home.free',
  '赞': 'home.likes',
  '回答': 'home.answers',
  '分享': 'home.shares',
  '收藏': 'home.bookmarks',
  '已解决': 'home.solvedPercent',
  '查看详情': 'home.viewDetails',
  
  // 个人中心
  '我的问题': 'profile.myQuestions',
  '我的回答': 'profile.myAnswers',
  '我的团队': 'profile.myTeams',
  '智慧指数': 'profile.wisdomIndex',
  '设置': 'profile.settings',
  '退出登录': 'profile.logout',
  '频道管理': 'profile.channelManage',
  '粉丝': 'profile.followers',
  '关注': 'profile.following',
  '问题': 'profile.questions',
  
  // 通用
  '取消': 'common.cancel',
  '确认': 'common.confirm',
  '保存': 'common.save',
  '删除': 'common.delete',
  '编辑': 'common.edit',
  '加载中...': 'common.loading',
  '暂无数据': 'common.noData',
  '加载更多': 'common.loadMore',
  '刷新': 'common.refresh',
  '提交': 'common.submit',
  '返回': 'common.back',
  '下一步': 'common.next',
  '完成': 'common.done',
  '关闭': 'common.close',
  '确定': 'common.ok',
  '是': 'common.yes',
  '否': 'common.no',
  '全部': 'common.all',
  '筛选': 'common.filter',
  '排序': 'common.sort',
  '搜索': 'common.search',
};

console.log('翻译映射表已准备好');
console.log(`共有 ${Object.keys(translations).length} 个翻译项`);
console.log('\n请手动在代码中使用 t() 函数替换这些文本');
console.log('例如：<Text>首页</Text> => <Text>{t("tabs.home")}</Text>');
