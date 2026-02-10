import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';
import IdentitySelector from '../components/IdentitySelector';
import superLikeCreditService from '../services/SuperLikeCreditService';

const answers = [
  { 
    id: 1, 
    author: 'Python老司机', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1', 
    verified: true, 
    adopted: true, 
    title: '资深Python开发 · 10年经验', 
    content: '作为一个从零开始学Python的过来人，我来分享一下我的经验：\n\n1. 学习时间：如果每天能保证2-3小时的学习时间，3个月完全可以入门并做一些简单的项目。\n\n2. 学习路线：\n- 第1个月：Python基础语法、数据类型、函数、面向对象\n- 第2个月：常用库（NumPy、Pandas）、数据处理\n- 第3个月：实战项目、数据可视化\n\n3. 推荐资源：廖雪峰的Python教程（免费）、《Python编程从入门到实践》', 
    likes: 256, 
    dislikes: 3, 
    comments: 23, 
    time: '1小时前',
    invitedBy: { name: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=inviter1' },
    superLikes: 5, // 超级赞数量
    isMyAnswer: false // 是否是我的回答
  },
  { 
    id: 2, 
    author: '数据分析师小王', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer2', 
    verified: false, 
    adopted: false, 
    adoptedCount: 3, // 被采纳的次数
    title: '数据分析师 · 3年经验', 
    content: '我也是文科转行的，现在在做数据分析。给你几点建议：\n\n1. 不要一开始就啃书，先跟着视频教程敲代码\n2. 多做项目，边学边练\n3. 加入一些学习群，有问题可以随时问', 
    likes: 89, 
    dislikes: 1, 
    comments: 12, 
    time: '30分钟前',
    // 添加仲裁信息
    hasArbitration: true,
    arbitrationResult: 'completed', // 'completed': 仲裁已完成
    arbitrationData: {
      status: 'rejected', // 'approved': 推翻, 'rejected': 维持
      votes: { agree: 1, disagree: 2, total: 3 },
      experts: [
        { 
          id: 1, 
          name: '李明', 
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert1', 
          title: 'Python架构师', 
          vote: 'agree', 
          reason: '答案过于简单，缺少具体的学习方法和资源推荐，建议推翻。', 
          time: '2小时前' 
        },
        { 
          id: 2, 
          name: '王芳', 
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert2', 
          title: '数据科学家', 
          vote: 'disagree', 
          reason: '答案虽然简短，但给出了实用的建议，适合初学者，建议维持。', 
          time: '1小时前' 
        },
        { 
          id: 3, 
          name: '赵强', 
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert3', 
          title: '技术总监', 
          vote: 'disagree', 
          reason: '答案简洁明了，重点突出，对于文科转行者来说很有参考价值。', 
          time: '30分钟前' 
        },
      ]
    },
    superLikes: 12, // 超级赞数量
    isMyAnswer: true // 是我的回答，可以购买超级赞
  },
  { 
    id: 3, 
    author: '编程新手', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer3', 
    verified: false, 
    adopted: false, 
    title: '学生', 
    content: '同问！我也想学Python，坐等大佬回答~', 
    likes: 5, 
    dislikes: 2, 
    comments: 0, 
    time: '10分钟前',
    superLikes: 0,
    isMyAnswer: false
  },
];

const answerTabs = ['补充 (4)', '回答 (56)', '评论 (4)', '邀请'];

// 评论数据
const commentsData = [
  { id: 1, author: '技术爱好者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment1', content: '这个问题问得好，我也想知道答案！', likes: 23, time: '2小时前', replies: 3 },
  { id: 2, author: '编程小白', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment2', content: '同问，坐等大佬回复', likes: 15, time: '1小时前', replies: 1 },
  { id: 3, author: '数据分析师', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment3', content: 'Python确实是入门数据分析的好选择，加油！', likes: 45, time: '30分钟前', replies: 5 },
  { id: 4, author: '前端开发者', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment4', content: '建议先从基础语法开始，不要急于求成', likes: 32, time: '20分钟前', replies: 2 },
];

// 回复数据
const repliesData = {
  1: [
    { id: 101, author: '回复者A', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply1', content: '我也是这么想的！', likes: 5, time: '1小时前' },
    { id: 102, author: '回复者B', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply2', content: '确实是个好问题', likes: 3, time: '50分钟前' },
    { id: 103, author: '回复者C', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply3', content: '期待大佬解答', likes: 8, time: '40分钟前' },
  ],
  2: [
    { id: 201, author: '回复者D', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply4', content: '一起等', likes: 2, time: '30分钟前' },
  ],
  3: [
    { id: 301, author: '回复者E', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply5', content: '说得对！', likes: 10, time: '25分钟前' },
    { id: 302, author: '回复者F', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply6', content: '我也在学Python', likes: 7, time: '20分钟前' },
    { id: 303, author: '回复者G', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply7', content: '加油加油！', likes: 4, time: '15分钟前' },
    { id: 304, author: '回复者H', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply8', content: '一起进步', likes: 6, time: '10分钟前' },
    { id: 305, author: '回复者I', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply9', content: '有问题可以互相交流', likes: 9, time: '5分钟前' },
  ],
  4: [
    { id: 401, author: '回复者J', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply10', content: '同意这个观点', likes: 12, time: '15分钟前' },
    { id: 402, author: '回复者K', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reply11', content: '基础很重要', likes: 8, time: '10分钟前' },
  ],
};

// 活动数据
const activitiesData = [
  { id: 1, title: 'Python学习交流会', type: '线上活动', date: '2026-01-20', time: '19:00-21:00', location: '腾讯会议', participants: 45, maxParticipants: 100, organizer: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', status: '报名中' },
  { id: 2, title: 'Python实战项目分享', type: '线下活动', date: '2026-01-25', time: '14:00-17:00', location: '北京市海淀区中关村创业大街', participants: 28, maxParticipants: 50, organizer: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1', status: '报名中' },
  { id: 3, title: '数据分析入门讲座', type: '线上活动', date: '2026-01-18', time: '20:00-21:30', location: 'Zoom会议', participants: 120, maxParticipants: 200, organizer: '数据分析师小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer2', status: '即将开始' },
];

// 补充问题数据
const supplementQuestions = [
  { id: 1, author: '学习者小李', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supp1', location: '上海', content: '请问学Python需要先学什么数学基础吗？我高中数学不太好，会不会影响学习？', likes: 45, dislikes: 2, comments: 8, shares: 12, bookmarks: 23 },
  { id: 2, author: '转行程序员', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supp2', location: '深圳', content: '想问一下，学完Python基础后，做数据分析还需要学哪些工具？比如SQL、Excel这些需要吗？', likes: 32, dislikes: 1, comments: 5, shares: 8, bookmarks: 15 },
  { id: 3, author: '大学生小张', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supp3', location: '广州', content: '有没有推荐的Python练手项目？最好是那种能写进简历的', likes: 28, dislikes: 0, comments: 12, shares: 18, bookmarks: 34 },
  { id: 4, author: '职场新人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=supp4', location: '杭州', content: '自学和报班哪个更好？有没有性价比高的网课推荐？', likes: 19, dislikes: 3, comments: 6, shares: 5, bookmarks: 11 },
];

export default function QuestionDetailScreen({ navigation, route }) {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('补充 (4)');
  const [suppLiked, setSuppLiked] = useState({});
  const [suppDisliked, setSuppDisliked] = useState({});
  const [suppBookmarked, setSuppBookmarked] = useState({});
  const [liked, setLiked] = useState({});
  const [bookmarked, setBookmarked] = useState(false);
  const [hearted, setHearted] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityForm, setActivityForm] = useState({ title: '', description: '', startDate: '', startTime: '', endDate: '', endTime: '', location: '', maxParticipants: '', contact: '', activityType: '线上活动' });
  const [commentLiked, setCommentLiked] = useState({});
  const [sortFilter, setSortFilter] = useState('精选'); // 精选 or 最新
  const [showSuppMoreModal, setShowSuppMoreModal] = useState(false);
  const [currentSuppId, setCurrentSuppId] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [currentAnswerId, setCurrentAnswerId] = useState(null);
  const [answerLiked, setAnswerLiked] = useState({});
  const [answerDisliked, setAnswerDisliked] = useState({});
  const [answerBookmarked, setAnswerBookmarked] = useState({});
  const [showAnswerCommentListModal, setShowAnswerCommentListModal] = useState(false);
  const [showSuppCommentListModal, setShowSuppCommentListModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [showCommentReplyModal, setShowCommentReplyModal] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [isTeamMember, setIsTeamMember] = useState(false); // 是否已加入团队
  const [showProgressBar, setShowProgressBar] = useState(false); // 是否显示进度条
  const [solvedPercentage, setSolvedPercentage] = useState(65); // 已解决的百分比
  const [currentSupplement, setCurrentSupplement] = useState(null); // 当前要回答的补充问题
  const [showSupplementAnswerModal, setShowSupplementAnswerModal] = useState(false); // 补充回答弹窗
  const [currentAnswer, setCurrentAnswer] = useState(null); // 当前要补充回答的答案
  const [supplementAnswerText, setSupplementAnswerText] = useState(''); // 补充回答内容
  
  // 身份选择
  const [answerIdentity, setAnswerIdentity] = useState('personal'); // 回答身份
  const [answerSelectedTeams, setAnswerSelectedTeams] = useState([]); // 回答选中的团队
  const [supplementIdentity, setSupplementIdentity] = useState('personal'); // 补充回答身份
  const [supplementSelectedTeams, setSupplementSelectedTeams] = useState([]); // 补充回答选中的团队
  const [commentIdentity, setCommentIdentity] = useState('personal'); // 评论身份
  const [commentSelectedTeams, setCommentSelectedTeams] = useState([]); // 评论选中的团队
  
  // 无限滚动状态
  const [showAllInvited, setShowAllInvited] = useState(false); // 是否显示全部已邀请用户
  const [showAllSupplements, setShowAllSupplements] = useState(false); // 是否显示全部补充
  const [showAllAnswers, setShowAllAnswers] = useState(false); // 是否显示全部回答
  const [showAllComments, setShowAllComments] = useState(false); // 是否显示全部评论
  
  const [invitedPage, setInvitedPage] = useState(1);
  const [supplementsPage, setSupplementsPage] = useState(1);
  const [answersPage, setAnswersPage] = useState(1);
  
  // 邀请标签页状态
  const [inviteTab, setInviteTab] = useState('本站'); // '本站' or '推特'
  const [searchLocalUser, setSearchLocalUser] = useState(''); // 本站用户搜索
  const [searchTwitterUser, setSearchTwitterUser] = useState(''); // 推特用户搜索
  
  // 获取安全区域
  const insets = useSafeAreaInsets();
  const [commentsPage, setCommentsPage] = useState(1);
  
  const [loadingInvited, setLoadingInvited] = useState(false);
  const [loadingSupplements, setLoadingSupplements] = useState(false);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  
  // 问题标题展开/折叠状态
  const [questionTitleExpanded, setQuestionTitleExpanded] = useState(false);
  const [questionTitleNeedsExpand, setQuestionTitleNeedsExpand] = useState(false);

  // 增加悬赏相关状态
  const [showAddRewardModal, setShowAddRewardModal] = useState(false);
  const [currentReward, setCurrentReward] = useState(50); // 当前悬赏金额
  const [rewardContributors, setRewardContributors] = useState(3); // 追加悬赏的人数
  const [addRewardAmount, setAddRewardAmount] = useState('');
  const [selectedAddRewardAmount, setSelectedAddRewardAmount] = useState(null);
  const [showRewardContributorsModal, setShowRewardContributorsModal] = useState(false); // 显示追加悬赏人员名单

  // 超级赞相关状态
  const [showSuperLikeModal, setShowSuperLikeModal] = useState(false); // 显示购买超级赞弹窗
  const [currentAnswerForSuperLike, setCurrentAnswerForSuperLike] = useState(null); // 当前要购买超级赞的回答
  const [superLikeAmount, setSuperLikeAmount] = useState(''); // 购买超级赞的数量
  const [selectedSuperLikeAmount, setSelectedSuperLikeAmount] = useState(null); // 快速选择的超级赞数量
  const [answerSuperLikes, setAnswerSuperLikes] = useState({}); // 记录每个回答的超级赞数量

  // 追加悬赏人员名单数据
  const rewardContributorsList = [
    { id: 1, name: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', amount: 20, time: '2小时前' },
    { id: 2, name: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1', amount: 15, time: '1小时前' },
    { id: 3, name: '数据分析师小王', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer2', amount: 15, time: '30分钟前' },
  ];

  // 仲裁相关状态
  const [showArbitrationModal, setShowArbitrationModal] = useState(false);
  const [showArbitrationStatusModal, setShowArbitrationStatusModal] = useState(false);
  const [showArbitrationResultModal, setShowArbitrationResultModal] = useState(false);
  const [currentArbitrationResult, setCurrentArbitrationResult] = useState(null);
  const [arbitrationReason, setArbitrationReason] = useState('');
  const [selectedExperts, setSelectedExperts] = useState([]);
  const [arbitrationStatus, setArbitrationStatus] = useState(null); // null: 未申请, 'pending': 投票中, 'rejected': 维持原判, 'approved': 推翻采纳
  const [arbitrationVotes, setArbitrationVotes] = useState({ agree: 0, disagree: 0, total: 0 });
  const [expertSearchText, setExpertSearchText] = useState(''); // 专家搜索文本

  // 可邀请的专家列表
  const expertsList = [
    { id: 1, name: '李明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert1', title: 'Python架构师', verified: true, expertise: 'Python开发', votes: 0 },
    { id: 2, name: '王芳', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert2', title: '数据科学家', verified: true, expertise: '数据分析', votes: 0 },
    { id: 3, name: '赵强', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert3', title: '技术总监', verified: true, expertise: '技术管理', votes: 0 },
    { id: 4, name: '刘洋', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert4', title: 'AI工程师', verified: true, expertise: '机器学习', votes: 0 },
    { id: 5, name: '陈静', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert5', title: '全栈开发', verified: true, expertise: 'Web开发', votes: 0 },
  ];

  // 专家投票详情数据（模拟已完成投票的情况）
  const [expertVoteDetails, setExpertVoteDetails] = useState([
    { id: 1, name: '李明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert1', title: 'Python架构师', vote: 'agree', reason: '原答案中关于学习时间的估计不够准确，对于零基础学习者来说，3个月时间过于乐观。建议重新评估。', time: '2小时前' },
    { id: 2, name: '王芳', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert2', title: '数据科学家', vote: 'agree', reason: '同意推翻。答案缺少对数据分析实际工作场景的介绍，学习路线过于理论化。', time: '1小时前' },
    { id: 3, name: '赵强', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=expert3', title: '技术总监', vote: 'disagree', reason: '我认为原答案基本合理，学习路线清晰，资源推荐也很实用。建议维持原判。', time: '30分钟前' },
  ]);

  // 当前问题数据
  const currentQuestion = {
    id: route?.params?.id || 1,
    title: '如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？',
    author: '张三丰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1'
  };

  const handleCreateActivity = () => {
    if (!activityForm.title.trim()) {
      alert('请输入活动标题');
      return;
    }
    if (activityForm.activityType === '线下活动' && !activityForm.location.trim()) {
      alert('线下活动请填写活动地址');
      return;
    }
    alert('活动创建成功！');
    setShowActivityModal(false);
    setActivityForm({ title: '', description: '', startDate: '', startTime: '', endDate: '', endTime: '', location: '', maxParticipants: '', contact: '', activityType: '线上活动' });
  };

  // 检查是否需要打开回答弹窗
  useEffect(() => {
    if (route?.params?.openAnswerModal) {
      setShowAnswerModal(true);
    }
  }, [route?.params?.openAnswerModal]);

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return;
    // 这里可以添加提交回答的逻辑
    alert('回答提交成功！');
    setAnswerText('');
    setShowAnswerModal(false);
    setCurrentSupplement(null);
  };

  const handleSubmitSupplementAnswer = () => {
    if (!supplementAnswerText.trim()) return;
    alert('补充回答提交成功！');
    setSupplementAnswerText('');
    setShowSupplementAnswerModal(false);
    setCurrentAnswer(null);
  };

  // 处理追加悬赏
  const handleAddReward = () => {
    const amount = selectedAddRewardAmount || parseFloat(addRewardAmount);
    if (!amount || amount <= 0) {
      alert('请输入有效的悬赏金额');
      return;
    }
    if (amount < 5) {
      alert('最低追加金额为 $5');
      return;
    }
    if (amount > 1000) {
      alert('单次追加金额不能超过 $1000');
      return;
    }
    
    setCurrentReward(currentReward + amount);
    setRewardContributors(rewardContributors + 1);
    alert(`成功追加 $${amount} 悬赏！`);
    setShowAddRewardModal(false);
    setAddRewardAmount('');
    setSelectedAddRewardAmount(null);
  };

  // 处理购买超级赞
  const handleBuySuperLike = () => {
    const amount = selectedSuperLikeAmount || parseInt(superLikeAmount);
    if (!amount || amount <= 0) {
      alert('请输入有效的超级赞数量');
      return;
    }
    if (amount < 1) {
      alert('最少购买 1 个超级赞');
      return;
    }
    if (amount > 100) {
      alert('单次最多购买 100 个超级赞');
      return;
    }
    
    const answerId = currentAnswerForSuperLike.id;
    const currentCount = answerSuperLikes[answerId] || currentAnswerForSuperLike.superLikes || 0;
    setAnswerSuperLikes({ ...answerSuperLikes, [answerId]: currentCount + amount });
    
    const totalCost = amount * 2; // 每个超级赞 $2
    alert(`成功购买 ${amount} 个超级赞！\n花费：$${totalCost}\n您的回答排名将会提升！`);
    setShowSuperLikeModal(false);
    setSuperLikeAmount('');
    setSelectedSuperLikeAmount(null);
    setCurrentAnswerForSuperLike(null);
  };

  // 处理仲裁申请
  const handleSubmitArbitration = () => {
    if (!arbitrationReason.trim()) {
      alert('请说明申请仲裁的理由');
      return;
    }
    if (selectedExperts.length < 3) {
      alert('至少需要邀请 3 位专家参与仲裁');
      return;
    }
    if (selectedExperts.length > 5) {
      alert('最多只能邀请 5 位专家');
      return;
    }

    // 提交仲裁申请
    setArbitrationStatus('pending');
    setArbitrationVotes({ agree: 0, disagree: 0, total: selectedExperts.length });
    alert('仲裁申请已提交，等待专家投票中...');
    setShowArbitrationModal(false);
    setArbitrationReason('');
  };

  // 切换专家选择
  const toggleExpertSelection = (expertId) => {
    if (selectedExperts.includes(expertId)) {
      setSelectedExperts(selectedExperts.filter(id => id !== expertId));
    } else {
      if (selectedExperts.length >= 5) {
        alert('最多只能邀请 5 位专家');
        return;
      }
      setSelectedExperts([...selectedExperts, expertId]);
    }
  };

  // 模拟专家投票（实际应该由专家操作）
  const simulateVoting = () => {
    // 随机生成投票结果
    const agreeVotes = Math.floor(Math.random() * (selectedExperts.length + 1));
    const disagreeVotes = selectedExperts.length - agreeVotes;
    const agreePercentage = (agreeVotes / selectedExperts.length) * 100;

    setArbitrationVotes({ 
      agree: agreeVotes, 
      disagree: disagreeVotes, 
      total: selectedExperts.length 
    });

    if (agreePercentage > 50) {
      setArbitrationStatus('approved');
      setShowProgressBar(false); // 回到PK状态
      alert('仲裁通过！问题状态已回到PK状态');
    } else {
      setArbitrationStatus('rejected');
      alert('仲裁未通过，维持原采纳答案');
    }
  };

  // 加载更多数据的函数
  const loadMoreInvited = () => {
    if (loadingInvited) return;
    setLoadingInvited(true);
    setTimeout(() => {
      setInvitedPage(invitedPage + 1);
      setLoadingInvited(false);
    }, 1000);
  };

  const loadMoreSupplements = () => {
    if (loadingSupplements) return;
    setLoadingSupplements(true);
    setTimeout(() => {
      setSupplementsPage(supplementsPage + 1);
      setLoadingSupplements(false);
    }, 1000);
  };

  const loadMoreAnswers = () => {
    if (loadingAnswers) return;
    setLoadingAnswers(true);
    setTimeout(() => {
      setAnswersPage(answersPage + 1);
      setLoadingAnswers(false);
    }, 1000);
  };

  const loadMoreComments = () => {
    if (loadingComments) return;
    setLoadingComments(true);
    setTimeout(() => {
      setCommentsPage(commentsPage + 1);
      setLoadingComments(false);
    }, 1000);
  };

  // 滚动监听处理
  const handleScroll = ({nativeEvent}) => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    
    if (isCloseToBottom) {
      if (activeTab === '邀请 (8)' && showAllInvited) {
        loadMoreInvited();
      } else if (activeTab === '补充 (4)' && showAllSupplements) {
        loadMoreSupplements();
      } else if (activeTab === '回答 (56)' && showAllAnswers) {
        loadMoreAnswers();
      } else if (activeTab === '评论 (4)' && showAllComments) {
        loadMoreComments();
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>问题详情</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={() => alert('分享功能')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-redo-outline" size={22} color="#374151" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Report', { type: 'question' })}>
            <Ionicons name="flag-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* 问题内容 */}
        <View style={styles.questionSection}>
          {/* 隐藏的完整文本用于检测行数 */}
          <Text 
            style={[styles.questionTitle, { position: 'absolute', opacity: 0, zIndex: -1 }]}
            onTextLayout={(e) => {
              const lineCount = e.nativeEvent.lines.length;
              if (lineCount > 3 && !questionTitleNeedsExpand) {
                setQuestionTitleNeedsExpand(true);
              }
            }}
          >
            <Text style={styles.rewardTagInline}>${currentReward} </Text>
            如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？作为一名文科生，之前完全没有接触过编程，最近想转行做数据分析，听说Python是必备技能，想请教各位大神应该如何开始学习，需要掌握哪些核心知识点？
          </Text>
          
          {/* 实际显示的文本 */}
          <TouchableOpacity 
            activeOpacity={questionTitleNeedsExpand ? 0.8 : 1}
            onPress={() => {
              if (questionTitleNeedsExpand) {
                setQuestionTitleExpanded(!questionTitleExpanded);
              }
            }}
          >
            <Text 
              style={styles.questionTitle}
              numberOfLines={questionTitleExpanded ? undefined : 3}
            >
              <Text style={styles.rewardTagInline}>${currentReward} </Text>
              如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？作为一名文科生，之前完全没有接触过编程，最近想转行做数据分析，听说Python是必备技能，想请教各位大神应该如何开始学习，需要掌握哪些核心知识点？
              {questionTitleNeedsExpand && !questionTitleExpanded && (
                <Text style={styles.expandHintInline}>
                  {'  '}
                  <Text style={styles.expandHintText}>...展开</Text>
                </Text>
              )}
              {questionTitleNeedsExpand && questionTitleExpanded && (
                <Text style={styles.expandHintInline}>
                  {'  '}
                  <Text style={styles.expandHintText}>收起</Text>
                </Text>
              )}
            </Text>
          </TouchableOpacity>
          
          {/* 作者信息和操作按钮行 - 紧跟标题 */}
          <View style={styles.authorActionsRow}>
            <View style={styles.authorInfoLeft}>
              <Avatar uri="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" name="张三" size={32} />
              <View style={styles.authorMetaInfo}>
                <View style={styles.authorNameRow}>
                  <Text style={styles.smallAuthorName}>张三丰</Text>
                  <TouchableOpacity style={styles.followBtnSmall}>
                    <Ionicons name="add" size={12} color="#ef4444" />
                    <Text style={styles.followBtnSmallText}>关注 (1.2k)</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.smallPostTime}>2小时前 · 北京</Text>
              </View>
            </View>
            <View style={styles.actionButtonsRight}>
              <TouchableOpacity style={styles.smallActionBtn} onPress={() => navigation.navigate('InviteAnswer')}>
                <Ionicons name="at" size={18} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallActionBtn} onPress={() => navigation.navigate('GroupChat', { question: currentQuestion })}>
                <Ionicons name="chatbubbles-outline" size={18} color="#8b5cf6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallActionBtn} onPress={() => navigation.navigate('QuestionTeams', { 
                questionId: currentQuestion.id,
                questionTitle: currentQuestion.title
              })}>
                <Ionicons name="person-add-outline" size={18} color="#f59e0b" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallActionBtn} onPress={() => navigation.navigate('QuestionActivityList', { questionId: currentQuestion.id, questionTitle: currentQuestion.title })}>
                <Ionicons name="calendar-outline" size={18} color="#22c55e" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.questionContent}>本人是一名文科生，之前完全没有接触过编程。最近想转行做数据分析，听说Python是必备技能。{'\n\n'}想请教各位大神：{'\n'}1. 零基础学Python需要多长时间？{'\n'}2. 有没有推荐的学习路线或者教程？{'\n'}3. 需要买什么书或者报什么课程吗？</Text>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop' }} style={styles.questionImage} />
          
          {/* 悬赏信息卡片 - 移到这里，在图片之后 */}
          <View style={styles.rewardInfoCard}>
            <View style={styles.rewardInfoLeft}>
              {/* 金额 */}
              <Text style={styles.rewardAmountText}>${currentReward}</Text>
              
              {/* 追加按钮 */}
              <TouchableOpacity 
                style={styles.addRewardBtn}
                onPress={() => navigation.navigate('AddReward', { 
                  currentReward, 
                  rewardContributors 
                })}
              >
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.addRewardBtnText}>追加</Text>
              </TouchableOpacity>

              {/* 采纳进度 */}
              <View style={styles.adoptionProgressContainer}>
                <Text style={styles.adoptionProgressText}>已采纳 65%</Text>
              </View>
            </View>

            {/* 追加人数 - 移到右侧 */}
            <TouchableOpacity 
              style={styles.rewardContributorsRow}
              onPress={() => navigation.navigate('Contributors', { 
                currentReward, 
                rewardContributors 
              })}
            >
              <Ionicons name="people-outline" size={12} color="#9ca3af" />
              <Text style={styles.rewardContributorsText}>{rewardContributors} 人追加</Text>
              <Ionicons name="chevron-forward" size={12} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.viewsAndTags}>
            <View style={styles.viewsRow}>
              <Ionicons name="eye-outline" size={14} color="#9ca3af" />
              <Text style={styles.viewsText}>1.2k 浏览</Text>
            </View>
            <View style={styles.topicTags}>
              <Text style={styles.topicTag}>#Python学习</Text>
              <Text style={styles.topicTag}>#编程入门</Text>
              <Text style={styles.topicTag}>#转行</Text>
            </View>
          </View>
          {/* PK进度条 */}
          <View style={styles.pkSection}>
            {!showProgressBar ? (
              // 初始按钮样式
              <View style={styles.pkRow}>
                <View style={styles.pkBarWrapper}>
                  <View style={styles.pkBar}>
                    <TouchableOpacity 
                      style={styles.pkSolvedBar}
                      onPress={() => {
                        setShowProgressBar(true);
                        setSolvedPercentage(65);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.pkSolvedText}>已解决</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.pkUnsolvedBar}
                      onPress={() => {
                        setShowProgressBar(true);
                        setSolvedPercentage(35);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.pkUnsolvedText}>未解决</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pkCenterBadge}>
                    <Text style={styles.pkCenterText}>PK</Text>
                  </View>
                </View>
              </View>
            ) : (
              // 点击后显示进度条样式
              <View style={styles.pkProgressRow}>
                <View style={styles.progressSolvedLabel}>
                  <Text style={styles.progressLabelText}>已解决</Text>
                </View>
                <View style={styles.progressBarWrapper}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressSolvedFill, { width: `${solvedPercentage}%` }]} />
                    <View style={[styles.progressUnsolvedFill, { width: `${100 - solvedPercentage}%` }]} />
                  </View>
                  <View style={[styles.progressPercentLabel, { left: `${solvedPercentage}%` }]}>
                    <Text style={styles.progressPercentText}>{solvedPercentage}%</Text>
                  </View>
                </View>
                <View style={styles.progressUnsolvedLabel}>
                  <Text style={styles.progressLabelText}>未解决</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* 回答区域 */}
        <View style={styles.answersSection}>
          <View style={styles.answerTabs}>
            {answerTabs.map(tab => (
              <TouchableOpacity key={tab} style={styles.answerTabItem} onPress={() => { setActiveTab(tab); setSortFilter('精选'); }}>
                <Text style={[styles.answerTabText, activeTab === tab && styles.answerTabTextActive]}>{tab}</Text>
                {activeTab === tab && <View style={styles.answerTabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* 筛选条 - 仅在补充、回答、评论时显示 */}
          <View style={[styles.sortFilterBar, { display: activeTab !== '邀请' ? 'flex' : 'none' }]}>
            <View style={styles.sortFilterLeft}>
              <TouchableOpacity 
                style={[styles.sortFilterBtn, sortFilter === '精选' && styles.sortFilterBtnActive]}
                onPress={() => setSortFilter('精选')}
              >
                <Ionicons name="star" size={14} color={sortFilter === '精选' ? '#ef4444' : '#9ca3af'} />
                <Text style={[styles.sortFilterText, sortFilter === '精选' && styles.sortFilterTextActive]}>精选</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.sortFilterBtn, sortFilter === '最新' && styles.sortFilterBtnActive]}
                onPress={() => setSortFilter('最新')}
              >
                <Ionicons name="time" size={14} color={sortFilter === '最新' ? '#ef4444' : '#9ca3af'} />
                <Text style={[styles.sortFilterText, sortFilter === '最新' && styles.sortFilterTextActive]}>最新</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sortFilterCount}>
              {activeTab === '补充 (4)' ? '共 4 条补充' : activeTab === '回答 (56)' ? '共 56 条回答' : '共 4 条评论'}
            </Text>
          </View>

          {/* 超级赞购买横幅 - 仅在回答标签页显示 */}
          {activeTab === '回答 (56)' && (
            <TouchableOpacity 
              style={styles.superLikePurchaseBanner}
              onPress={() => navigation.navigate('SuperLikePurchase')}
              activeOpacity={0.8}
            >
              <View style={styles.superLikePurchaseBannerLeft}>
                <Ionicons name="star" size={18} color="#f59e0b" />
                <Text style={styles.superLikePurchaseBannerText}>购买超级赞提升排名</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#f59e0b" />
            </TouchableOpacity>
          )}

          {activeTab === '补充 (4)' ? (
            // 补充问题列表
            <>
              {supplementQuestions.slice(0, showAllSupplements ? supplementQuestions.length : 3).map(item => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.suppCard}
                  onPress={() => {
                    console.log('=== 点击补充问题 ===');
                    console.log('补充问题ID:', item.id);
                    console.log('补充问题作者:', item.author);
                    console.log('导航对象存在:', !!navigation);
                    console.log('准备导航到 SupplementDetail');
                    navigation.navigate('SupplementDetail', { supplement: item });
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.suppHeader}>
                    <Avatar uri={item.avatar} name={item.author} size={28} />
                    <View style={styles.suppAuthorInfo}>
                      <View style={styles.suppAuthorRow}>
                        <Text style={styles.suppAuthor}>{item.author}</Text>
                        <View style={styles.suppLocationRow}>
                          <Ionicons name="location-outline" size={12} color="#9ca3af" />
                          <Text style={styles.suppLocation}>{item.location}</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.suppAnswerBtnTop} 
                      onPress={(e) => { 
                        e.stopPropagation(); 
                        setCurrentSupplement(item);
                        setShowAnswerModal(true);
                      }}
                    >
                      <Ionicons name="create-outline" size={14} color="#fff" />
                      <Text style={styles.suppAnswerTextTop}>回答 (12)</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.suppContent}>{item.content}</Text>
                  <View style={styles.suppFooter}>
                    <View style={styles.suppFooterLeft}>
                      <TouchableOpacity 
                        style={styles.suppActionBtn} 
                        onPress={(e) => { e.stopPropagation(); setSuppLiked({ ...suppLiked, [item.id]: !suppLiked[item.id] }); }}
                      >
                        <Ionicons name={suppLiked[item.id] ? "thumbs-up" : "thumbs-up-outline"} size={16} color={suppLiked[item.id] ? "#ef4444" : "#6b7280"} />
                        <Text style={[styles.suppActionText, suppLiked[item.id] && { color: '#ef4444' }]}>{item.likes + (suppLiked[item.id] ? 1 : 0)}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.suppActionBtn}
                        onPress={(e) => { e.stopPropagation(); setCurrentSuppId(item.id); setShowSuppCommentListModal(true); }}
                      >
                        <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
                        <Text style={styles.suppActionText}>{item.comments}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.suppActionBtn}
                        onPress={(e) => e.stopPropagation()}
                      >
                        <Ionicons name="arrow-redo-outline" size={16} color="#6b7280" />
                        <Text style={styles.suppActionText}>{item.shares}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.suppActionBtn}
                        onPress={(e) => { e.stopPropagation(); setSuppBookmarked({ ...suppBookmarked, [item.id]: !suppBookmarked[item.id] }); }}
                      >
                        <Ionicons name={suppBookmarked[item.id] ? "star" : "star-outline"} size={16} color={suppBookmarked[item.id] ? "#f59e0b" : "#6b7280"} />
                        <Text style={[styles.suppActionText, suppBookmarked[item.id] && { color: '#f59e0b' }]}>{item.bookmarks + (suppBookmarked[item.id] ? 1 : 0)}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.suppActionBtn}
                        onPress={(e) => { e.stopPropagation(); navigation.navigate('GroupChat', { question: { title: '如何在三个月内从零基础学会Python编程？', author: '张三丰', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', memberCount: 128 } }); }}
                      >
                        <Ionicons name="chatbubbles-outline" size={16} color="#6b7280" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.suppFooterRight}>
                      <TouchableOpacity 
                        style={styles.suppMoreBtn} 
                        onPress={(e) => { e.stopPropagation(); setCurrentSuppId(item.id); setShowSuppMoreModal(true); }}
                      >
                        <Ionicons key={`more-${item.id}`} name="ellipsis-horizontal-outline" size={20} color="#6b7280" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {loadingSupplements && (
                <View style={styles.loadingIndicator}>
                  <Text style={styles.loadingText}>加载中...</Text>
                </View>
              )}
              {!showAllSupplements && (
                <TouchableOpacity 
                  style={styles.loadMoreBtn}
                  onPress={() => setShowAllSupplements(true)}
                >
                  <Text style={styles.loadMoreText}>查看更多补充 ({supplementQuestions.length - 3})</Text>
                  <Ionicons name="chevron-down" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
              {showAllSupplements && (
                <TouchableOpacity 
                  style={styles.collapseBtn}
                  onPress={() => {
                    setShowAllSupplements(false);
                    setSupplementsPage(1);
                  }}
                >
                  <Text style={styles.collapseBtnText}>收起</Text>
                  <Ionicons name="chevron-up" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
            </>
          ) : activeTab === '评论 (4)' ? (
            // 评论列表
            <>
              {commentsData.slice(0, showAllComments ? commentsData.length : 3).map(comment => (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <Avatar uri={comment.avatar} name={comment.author} size={28} />
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.commentTime}>{comment.time}</Text>
                  </View>
                  <View style={styles.commentContent}>
                    <Text style={styles.commentText}>{comment.content}</Text>
                    <View style={styles.commentFooter}>
                      <View style={styles.commentFooterLeft}>
                        <TouchableOpacity 
                          style={styles.commentActionBtn}
                          onPress={() => setCommentLiked({ ...commentLiked, [comment.id]: !commentLiked[comment.id] })}
                        >
                          <Ionicons name={commentLiked[comment.id] ? "thumbs-up" : "thumbs-up-outline"} size={14} color={commentLiked[comment.id] ? "#ef4444" : "#9ca3af"} />
                          <Text style={[styles.commentActionText, commentLiked[comment.id] && { color: '#ef4444' }]}>{comment.likes + (commentLiked[comment.id] ? 1 : 0)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.commentActionBtn}
                          onPress={() => { setCurrentCommentId(comment.id); setShowCommentReplyModal(true); }}
                        >
                          <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentActionText}>{comment.replies} 回复</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentActionBtn}>
                          <Ionicons name="arrow-redo-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentActionText}>{comment.shares || 5}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentActionBtn}>
                          <Ionicons name="star-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentActionText}>{comment.bookmarks || 8}</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.commentFooterRight}>
                        <TouchableOpacity style={styles.commentActionBtn}>
                          <Ionicons name="thumbs-down-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentActionText}>{comment.dislikes || 2}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentActionBtn}>
                          <Ionicons name="flag-outline" size={14} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
              {loadingComments && (
                <View style={styles.loadingIndicator}>
                  <Text style={styles.loadingText}>加载中...</Text>
                </View>
              )}
              {!showAllComments && (
                <TouchableOpacity 
                  style={styles.loadMoreBtn}
                  onPress={() => setShowAllComments(true)}
                >
                  <Text style={styles.loadMoreText}>查看更多评论 ({commentsData.length - 3})</Text>
                  <Ionicons name="chevron-down" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
              {showAllComments && (
                <TouchableOpacity 
                  style={styles.collapseBtn}
                  onPress={() => {
                    setShowAllComments(false);
                    setCommentsPage(1);
                  }}
                >
                  <Text style={styles.collapseBtnText}>收起</Text>
                  <Ionicons name="chevron-up" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
            </>
          ) : activeTab === '邀请' ? (
            // 邀请列表 - 二级tab标签
            <View style={styles.inviteContainer}>
              {/* 二级tab标签 */}
              <View style={styles.inviteSubTabs}>
                <TouchableOpacity 
                  style={[styles.inviteSubTabItem, inviteTab === '本站' && styles.inviteSubTabItemActive]}
                  onPress={() => setInviteTab('本站')}
                >
                  <Text style={[styles.inviteSubTabText, inviteTab === '本站' && styles.inviteSubTabTextActive]}>本站</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.inviteSubTabItem, inviteTab === '推特' && styles.inviteSubTabItemActive]}
                  onPress={() => setInviteTab('推特')}
                >
                  <Ionicons name="logo-twitter" size={14} color={inviteTab === '推特' ? '#1DA1F2' : '#9ca3af'} />
                  <Text style={[styles.inviteSubTabText, inviteTab === '推特' && styles.inviteSubTabTextActive]}>推特</Text>
                </TouchableOpacity>
              </View>

              {/* 搜索框 */}
              <View style={styles.inviteSearchContainer}>
                <View style={styles.inviteSearchBox}>
                  <Ionicons name="search" size={14} color="#9ca3af" />
                  <TextInput
                    style={styles.inviteSearchInput}
                    placeholder={inviteTab === '本站' ? '搜索用户' : '搜索推特用户'}
                    placeholderTextColor="#9ca3af"
                    value={inviteTab === '本站' ? searchLocalUser : searchTwitterUser}
                    onChangeText={(text) => {
                      if (inviteTab === '本站') setSearchLocalUser(text);
                      else setSearchTwitterUser(text);
                    }}
                  />
                </View>
              </View>

              {/* 本站用户内容 */}
              {inviteTab === '本站' && (
                <View style={styles.inviteTabContent}>
                  {/* 推荐邀请用户 - 横向滚动 */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendScroll}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <View key={`rec-local-${i}`} style={styles.recommendUserCard}>
                        <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=reclocal${i}` }} style={styles.recommendUserAvatar} />
                        <View style={styles.recommendUserTextContainer}>
                          <Text style={styles.recommendUserName} numberOfLines={1}>推荐用户{i}</Text>
                          <Text style={styles.recommendUserDesc} numberOfLines={1}>{i * 20}回答</Text>
                        </View>
                        <TouchableOpacity style={styles.recommendInviteBtn}>
                          <Ionicons name="add" size={12} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>

                  {/* 已邀请用户列表 */}
                  <Text style={styles.invitedListTitle}>已邀请</Text>
                  {[1, 2, 3, 4, 5, 6, 7, 8].slice(0, showAllInvited ? 8 : 3).map(i => (
                    <View key={`invited-local-${i}`} style={styles.inviteUserCard}>
                      <Avatar uri={`https://api.dicebear.com/7.x/avataaars/svg?seed=local${i}`} name={`用户${i}`} size={40} />
                      <View style={styles.inviteUserInfo}>
                        <Text style={styles.inviteUserName}>用户{i}</Text>
                        <Text style={styles.inviteUserDesc}>Python开发者 · 回答过 {i * 10} 个问题</Text>
                      </View>
                      <View style={styles.invitedTag}>
                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                        <Text style={styles.invitedTagText}>已邀请</Text>
                      </View>
                    </View>
                  ))}
                  {loadingInvited && (
                    <View style={styles.loadingIndicator}>
                      <Text style={styles.loadingText}>加载中...</Text>
                    </View>
                  )}
                  {!showAllInvited && (
                    <TouchableOpacity 
                      style={styles.loadMoreInvitedBtn} 
                      onPress={() => setShowAllInvited(true)}
                    >
                      <Text style={styles.loadMoreInvitedText}>查看更多邀请 (5)</Text>
                      <Ionicons name="chevron-down" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                  {showAllInvited && (
                    <TouchableOpacity 
                      style={styles.collapseBtn}
                      onPress={() => {
                        setShowAllInvited(false);
                        setInvitedPage(1);
                      }}
                    >
                      <Text style={styles.collapseBtnText}>收起</Text>
                      <Ionicons name="chevron-up" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* 推特用户内容 */}
              {inviteTab === '推特' && (
                <View style={styles.inviteTabContent}>
                  {/* 推荐邀请用户 - 横向滚动 */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendScroll}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <View key={`rec-twitter-${i}`} style={styles.recommendUserCard}>
                        <Image source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=rectwitter${i}` }} style={styles.recommendUserAvatar} />
                        <View style={styles.recommendUserTextContainer}>
                          <Text style={styles.recommendUserName} numberOfLines={1}>@user{i}</Text>
                          <Text style={styles.recommendUserDesc} numberOfLines={1}>{i}k粉丝</Text>
                        </View>
                        <TouchableOpacity style={[styles.recommendInviteBtn, styles.recommendInviteBtnTwitter]}>
                          <Ionicons name="logo-twitter" size={12} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>

                  {/* 已邀请用户列表 */}
                  <Text style={styles.invitedListTitle}>已邀请</Text>
                  {[1, 2, 3, 4, 5, 6].slice(0, showAllInvited ? 6 : 3).map(i => (
                    <View key={`invited-twitter-${i}`} style={styles.inviteUserCard}>
                      <Avatar uri={`https://api.dicebear.com/7.x/avataaars/svg?seed=twitter${i}`} name={`@twitter_user${i}`} size={40} />
                      <View style={styles.inviteUserInfo}>
                        <Text style={styles.inviteUserName}>@twitter_user{i}</Text>
                        <Text style={styles.inviteUserDesc}>{i * 1000} 关注者</Text>
                      </View>
                      <View style={styles.invitedTag}>
                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                        <Text style={styles.invitedTagText}>已邀请</Text>
                      </View>
                    </View>
                  ))}
                  {loadingInvited && (
                    <View style={styles.loadingIndicator}>
                      <Text style={styles.loadingText}>加载中...</Text>
                    </View>
                  )}
                  {!showAllInvited && (
                    <TouchableOpacity 
                      style={styles.loadMoreInvitedBtn} 
                      onPress={() => setShowAllInvited(true)}
                    >
                      <Text style={styles.loadMoreInvitedText}>查看更多邀请 (3)</Text>
                      <Ionicons name="chevron-down" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                  {showAllInvited && (
                    <TouchableOpacity 
                      style={styles.collapseBtn}
                      onPress={() => {
                        setShowAllInvited(false);
                        setInvitedPage(1);
                      }}
                    >
                      <Text style={styles.collapseBtnText}>收起</Text>
                      <Ionicons name="chevron-up" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ) : (
            // 回答列表
            <>
              {answers.slice(0, showAllAnswers ? answers.length : 3).map(answer => (
            <TouchableOpacity key={answer.id} style={[styles.answerCard, answer.adopted && styles.answerCardAdopted]} onPress={() => navigation.navigate('AnswerDetail', { answer })}>
              <View style={styles.answerHeader}>
                <Avatar uri={answer.avatar} name={answer.author} size={28} />
                <View style={styles.answerAuthorInfo}>
                  <View style={styles.answerAuthorRow}>
                    <Text style={styles.answerAuthor}>{answer.author}</Text>
                    {answer.verified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />}
                    
                    {/* 采纳按钮 - 放在用户名后面，所有回答都显示 */}
                    <TouchableOpacity 
                      style={styles.adoptAnswerBtn}
                      onPress={(e) => {
                        e.stopPropagation();
                        // 处理采纳逻辑
                        Alert.alert('采纳答案', '确认采纳这个答案吗？', [
                          { text: '取消', style: 'cancel' },
                          { text: '确认', onPress: () => console.log('采纳答案') }
                        ]);
                      }}
                    >
                      <Text style={styles.adoptAnswerBtnText}>采纳</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.answerAuthorTitle}>{answer.title}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.answerSupplementBtnTop} 
                  onPress={(e) => { 
                    e.stopPropagation(); 
                    setCurrentAnswer(answer);
                    setShowSupplementAnswerModal(true);
                  }}
                >
                  <Ionicons name="add-circle-outline" size={14} color="#fff" />
                  <Text style={styles.answerSupplementTextTop}>补充回答 (2)</Text>
                </TouchableOpacity>
              </View>

              {/* 标签区域 - 优化布局 */}
              <View style={styles.answerTagsSection}>
                {/* 超级赞按钮 - 可点击增加 */}
                <TouchableOpacity 
                  style={[
                    styles.superLikeBadge,
                    ((answerSuperLikes[answer.id] || answer.superLikes || 0) === 0) && styles.superLikeBadgeInactive
                  ]}
                  onPress={async (e) => { 
                    e.stopPropagation();
                    
                    // 检查余额
                    const balance = await superLikeCreditService.getBalance();
                    
                    if (balance <= 0) {
                      Alert.alert(
                        '超级赞次数不足',
                        '您的超级赞次数不足，是否购买？',
                        [
                          { text: '取消', style: 'cancel' },
                          { 
                            text: '去购买', 
                            onPress: () => navigation.navigate('SuperLikePurchase')
                          }
                        ]
                      );
                      return;
                    }
                    
                    // 使用超级赞
                    const result = await superLikeCreditService.use(
                      answer.id.toString(), 
                      answer.content.substring(0, 50)
                    );
                    
                    if (result.success) {
                      // 更新本地显示的超级赞数量
                      const currentCount = answerSuperLikes[answer.id] || answer.superLikes || 0;
                      setAnswerSuperLikes({
                        ...answerSuperLikes,
                        [answer.id]: currentCount + 1
                      });
                      // 不显示成功提示，直接更新数字
                    }
                  }}
                >
                  <Ionicons 
                    name="star" 
                    size={14} 
                    color={((answerSuperLikes[answer.id] || answer.superLikes || 0) === 0) ? "#d1d5db" : "#f59e0b"} 
                  />
                  <Text style={[
                    styles.superLikeBadgeText,
                    ((answerSuperLikes[answer.id] || answer.superLikes || 0) === 0) && styles.superLikeBadgeTextInactive
                  ]}>
                    超级赞 x{answerSuperLikes[answer.id] || answer.superLikes || 0}
                  </Text>
                </TouchableOpacity>
                
                {/* 作者已采纳标签 */}
                {answer.adopted && (
                  <View style={styles.authorAdoptedBadge}>
                    <Text style={styles.authorAdoptedBadgeText}>作者已采纳</Text>
                  </View>
                )}
                
                {/* 已采纳数量标签 - 显示其他采纳数 */}
                {answer.adoptedCount && answer.adoptedCount > 0 && (
                  <View style={styles.adoptedCountBadge}>
                    <Text style={styles.adoptedCountBadgeText}>已采纳 x{answer.adoptedCount}</Text>
                  </View>
                )}
                
                {/* 邀请者标签 */}
                {answer.invitedBy && (
                  <View style={styles.inviterBadgeCompact}>
                    <Avatar uri={answer.invitedBy.avatar} name={answer.invitedBy.name} size={14} />
                    <Text style={styles.inviterTextCompact}>由 {answer.invitedBy.name} 邀请</Text>
                  </View>
                )}

                {/* 仲裁结果标签 - 暂时隐藏 */}
                {false && answer.hasArbitration && answer.arbitrationResult === 'completed' && (
                  <View style={[
                    styles.arbitrationResultBadge,
                    answer.arbitrationData.status === 'approved' ? styles.arbitrationResultApproved : styles.arbitrationResultRejected
                  ]}>
                    <Ionicons 
                      name={answer.arbitrationData.status === 'approved' ? "close-circle" : "shield-checkmark"} 
                      size={12} 
                      color={answer.arbitrationData.status === 'approved' ? "#ef4444" : "#22c55e"} 
                    />
                    <Text style={[
                      styles.arbitrationResultText,
                      answer.arbitrationData.status === 'approved' ? styles.arbitrationResultTextApproved : styles.arbitrationResultTextRejected
                    ]}>
                      {answer.arbitrationData.status === 'approved' ? '仲裁推翻' : '仲裁维持'}
                    </Text>
                  </View>
                )}

                {/* 仲裁状态标签 - 暂时隐藏 */}
                {false && answer.adopted && arbitrationStatus === 'pending' && (
                  <View style={styles.arbitrationPendingBadgeCompact}>
                    <Ionicons name="time-outline" size={12} color="#f59e0b" />
                    <Text style={styles.arbitrationPendingTextCompact}>投票中</Text>
                  </View>
                )}
                
                {false && answer.adopted && arbitrationStatus === 'approved' && (
                  <View style={styles.arbitrationApprovedBadgeCompact}>
                    <Ionicons name="close-circle" size={12} color="#ef4444" />
                    <Text style={styles.arbitrationApprovedTextCompact}>已推翻</Text>
                  </View>
                )}

                {/* 右侧操作按钮 */}
                <View style={styles.answerTagsActions}>
                  {/* 查看仲裁结果按钮 - 暂时隐藏 */}
                  {false && answer.hasArbitration && answer.arbitrationResult === 'completed' && (
                    <TouchableOpacity 
                      style={styles.viewArbitrationResultBtn}
                      onPress={(e) => { 
                        e.stopPropagation(); 
                        setCurrentArbitrationResult(answer.arbitrationData);
                        setShowArbitrationResultModal(true);
                      }}
                    >
                      <Ionicons name="document-text-outline" size={12} color="#6b7280" />
                      <Text style={styles.viewArbitrationResultBtnText}>查看仲裁</Text>
                    </TouchableOpacity>
                  )}
                  
                  {/* 申请仲裁按钮 - 暂时隐藏 */}
                  {false && answer.adopted && !arbitrationStatus && (
                    <TouchableOpacity 
                      style={styles.arbitrationBtnCompact}
                      onPress={(e) => { 
                        e.stopPropagation(); 
                        setShowArbitrationModal(true);
                      }}
                    >
                      <Ionicons name="gavel-outline" size={12} color="#6b7280" />
                      <Text style={styles.arbitrationBtnTextCompact}>仲裁</Text>
                    </TouchableOpacity>
                  )}
                  
                  {/* 查看仲裁详情按钮 - 暂时隐藏 */}
                  {false && answer.adopted && arbitrationStatus && (
                    <TouchableOpacity 
                      style={styles.viewArbitrationBtnCompact}
                      onPress={(e) => { 
                        e.stopPropagation(); 
                        setShowArbitrationStatusModal(true);
                      }}
                    >
                      <Text style={styles.viewArbitrationBtnTextCompact}>详情</Text>
                      <Ionicons name="chevron-forward" size={12} color="#6b7280" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              <Text style={styles.answerContent}>{answer.content}</Text>
              
              <View style={styles.answerFooter}>
                <View style={styles.answerFooterLeft}>
                  <TouchableOpacity 
                    style={styles.answerActionBtn} 
                    onPress={(e) => { e.stopPropagation(); setAnswerLiked({ ...answerLiked, [answer.id]: !answerLiked[answer.id] }); }}
                  >
                    <Ionicons name={answerLiked[answer.id] ? "thumbs-up" : "thumbs-up-outline"} size={16} color={answerLiked[answer.id] ? "#ef4444" : "#6b7280"} />
                    <Text style={[styles.answerActionText, answerLiked[answer.id] && { color: '#ef4444' }]}>{answer.likes + (answerLiked[answer.id] ? 1 : 0)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.answerActionBtn} 
                    onPress={(e) => { e.stopPropagation(); setCurrentAnswerId(answer.id); setShowAnswerCommentListModal(true); }}
                  >
                    <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
                    <Text style={styles.answerActionText}>{answer.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.answerActionBtn} onPress={(e) => e.stopPropagation()}>
                    <Ionicons name="arrow-redo-outline" size={16} color="#6b7280" />
                    <Text style={styles.answerActionText}>34</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.answerActionBtn}
                    onPress={(e) => { e.stopPropagation(); setAnswerBookmarked({ ...answerBookmarked, [answer.id]: !answerBookmarked[answer.id] }); }}
                  >
                    <Ionicons name={answerBookmarked[answer.id] ? "star" : "star-outline"} size={16} color={answerBookmarked[answer.id] ? "#f59e0b" : "#6b7280"} />
                    <Text style={[styles.answerActionText, answerBookmarked[answer.id] && { color: '#f59e0b' }]}>89</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.answerFooterRight}>
                  <TouchableOpacity 
                    style={styles.answerActionBtn} 
                    onPress={(e) => { e.stopPropagation(); setAnswerDisliked({ ...answerDisliked, [answer.id]: !answerDisliked[answer.id] }); }}
                  >
                    <Ionicons name={answerDisliked[answer.id] ? "thumbs-down" : "thumbs-down-outline"} size={16} color={answerDisliked[answer.id] ? "#3b82f6" : "#6b7280"} />
                    <Text style={[styles.answerActionText, answerDisliked[answer.id] && { color: '#3b82f6' }]}>{answer.dislikes || 3}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.answerActionBtn} onPress={(e) => e.stopPropagation()}>
                    <Ionicons name="flag-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
              {loadingAnswers && (
                <View style={styles.loadingIndicator}>
                  <Text style={styles.loadingText}>加载中...</Text>
                </View>
              )}
              {!showAllAnswers && (
                <TouchableOpacity 
                  style={styles.loadMoreBtn}
                  onPress={() => setShowAllAnswers(true)}
                >
                  <Text style={styles.loadMoreText}>查看更多回答 ({answers.length - 3})</Text>
                  <Ionicons name="chevron-down" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
              {showAllAnswers && (
                <TouchableOpacity 
                  style={styles.collapseBtn}
                  onPress={() => {
                    setShowAllAnswers(false);
                    setAnswersPage(1);
                  }}
                >
                  <Text style={styles.collapseBtnText}>收起</Text>
                  <Ionicons name="chevron-up" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* 推荐相关问题 - 仅在列表未展开时显示 */}
        {!showAllSupplements && !showAllAnswers && !showAllComments && !showAllInvited && (
        <View style={styles.recommendedSection}>
          <View style={styles.recommendedHeader}>
            <View style={styles.recommendedHeaderLeft}>
              <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
              <Text style={styles.recommendedTitle}>相关推荐</Text>
            </View>
            <Text style={styles.recommendedSubtitle}>继续浏览更多精彩内容</Text>
          </View>

          {/* 推荐问题卡片 */}
          <TouchableOpacity 
            style={styles.recommendedQuestionCard}
            onPress={() => navigation.push('QuestionDetail', { id: 2 })}
            activeOpacity={0.95}
          >
            <Text style={styles.recommendedQuestionTitle}>
              <Text style={styles.rewardTagInline}>$30 </Text>
              <View style={styles.recommendedHotTagInline}>
                <Ionicons name="flame" size={10} color="#ef4444" />
                <Text style={styles.recommendedHotTextInline}>热门</Text>
              </View>
              {' '}React Native开发中如何优化长列表性能？FlatList和ScrollView该如何选择？
            </Text>
            
            <Text style={styles.recommendedQuestionContent} numberOfLines={3}>
              我在开发一个新闻类APP，列表有上千条数据，使用ScrollView会很卡顿。听说FlatList性能更好，但不知道具体该怎么优化。请问有经验的开发者能分享一下最佳实践吗？
            </Text>

            <View style={styles.recommendedQuestionMeta}>
              <View style={styles.recommendedAuthorInfo}>
                <Avatar 
                  uri="https://api.dicebear.com/7.x/avataaars/svg?seed=user2" 
                  name="前端小白"
                  size={24}
                />
                <Text style={styles.recommendedAuthorName}>前端小白</Text>
                <Text style={styles.recommendedQuestionTime}>· 3小时前</Text>
              </View>
              <View style={styles.recommendedQuestionStats}>
                <View style={styles.recommendedStatItem}>
                  <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                  <Text style={styles.recommendedStatText}>89</Text>
                </View>
                <View style={styles.recommendedStatItem}>
                  <Ionicons name="eye-outline" size={14} color="#9ca3af" />
                  <Text style={styles.recommendedStatText}>2.3k</Text>
                </View>
              </View>
            </View>

            <View style={styles.recommendedTopicTags}>
              <Text style={styles.recommendedTopicTag}>#ReactNative</Text>
              <Text style={styles.recommendedTopicTag}>#性能优化</Text>
              <Text style={styles.recommendedTopicTag}>#移动开发</Text>
            </View>
          </TouchableOpacity>

          {/* 第二个推荐问题 */}
          <TouchableOpacity 
            style={styles.recommendedQuestionCard}
            onPress={() => navigation.push('QuestionDetail', { id: 3 })}
            activeOpacity={0.95}
          >
            <Text style={styles.recommendedQuestionTitle}>
              <Text style={styles.rewardTagInline}>$20 </Text>
              如何系统学习JavaScript？从入门到精通需要掌握哪些核心知识点？
            </Text>
            
            <Text style={styles.recommendedQuestionContent} numberOfLines={3}>
              想转行做前端开发，JavaScript是必备技能。但是网上资料太多太杂，不知道该从哪里开始学。希望有经验的前辈能给一个系统的学习路线图。
            </Text>

            <View style={styles.recommendedQuestionMeta}>
              <View style={styles.recommendedAuthorInfo}>
                <Avatar 
                  uri="https://api.dicebear.com/7.x/avataaars/svg?seed=user3" 
                  name="转行者"
                  size={24}
                />
                <Text style={styles.recommendedAuthorName}>转行者</Text>
                <Text style={styles.recommendedQuestionTime}>· 5小时前</Text>
              </View>
              <View style={styles.recommendedQuestionStats}>
                <View style={styles.recommendedStatItem}>
                  <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                  <Text style={styles.recommendedStatText}>156</Text>
                </View>
                <View style={styles.recommendedStatItem}>
                  <Ionicons name="eye-outline" size={14} color="#9ca3af" />
                  <Text style={styles.recommendedStatText}>4.5k</Text>
                </View>
              </View>
            </View>

            <View style={styles.recommendedTopicTags}>
              <Text style={styles.recommendedTopicTag}>#JavaScript</Text>
              <Text style={styles.recommendedTopicTag}>#前端开发</Text>
              <Text style={styles.recommendedTopicTag}>#学习路线</Text>
            </View>
          </TouchableOpacity>
        </View>
        )}
      </ScrollView>

      {/* 底部固定栏 - 主要互动按钮 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomActionBtn} onPress={() => setLiked({ ...liked, main: !liked.main })}>
          <Ionicons name={liked.main ? "thumbs-up" : "thumbs-up-outline"} size={20} color={liked.main ? "#ef4444" : "#6b7280"} />
          <Text style={[styles.bottomActionText, liked.main && { color: '#ef4444' }]}>128</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomActionBtn} onPress={() => setBookmarked(!bookmarked)}>
          <Ionicons name={bookmarked ? "star" : "star-outline"} size={20} color={bookmarked ? "#f59e0b" : "#6b7280"} />
          <Text style={[styles.bottomActionText, bookmarked && { color: '#f59e0b' }]}>89</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomActionBtn} onPress={() => {
          console.log('评论按钮被点击');
          console.log('当前 showCommentModal 状态:', showCommentModal);
          setShowCommentModal(true);
          console.log('设置 showCommentModal 为 true');
        }}>
          <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
          <Text style={styles.bottomActionText}>评论</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomActionBtn} onPress={() => setShowAnswerModal(true)}>
          <Ionicons name="create-outline" size={20} color="#ef4444" />
          <Text style={[styles.bottomActionText, { color: '#ef4444' }]}>回答</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomActionBtn}>
          <Ionicons name="add-circle-outline" size={20} color="#6b7280" />
          <Text style={styles.bottomActionText}>补充</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomActionBtn} onPress={() => setLiked({ ...liked, dislike: !liked.dislike })}>
          <Ionicons name={liked.dislike ? "thumbs-down" : "thumbs-down-outline"} size={20} color={liked.dislike ? "#6b7280" : "#9ca3af"} />
          <Text style={[styles.bottomActionText, liked.dislike && { color: '#6b7280' }]}>12</Text>
        </TouchableOpacity>
      </View>

      {/* 更多操作弹窗 */}
      <Modal visible={showActionModal} transparent animationType="slide" onRequestClose={() => setShowActionModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowActionModal(false)} />
          <View style={[styles.moreActionModal, { paddingBottom: Math.max(insets.bottom, 30) }]}>
            <View style={styles.moreActionModalHandle} />
            
            {/* 纵向操作按钮 */}
            <View style={styles.actionListSection}>
              <TouchableOpacity style={styles.moreActionItem}>
                <Ionicons name="thumbs-down-outline" size={22} color="#6b7280" />
                <Text style={styles.moreActionItemText}>踩一下 (12)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.moreActionItem} onPress={() => { setShowActionModal(false); setShowReportModal(true); }}>
                <Ionicons name="flag-outline" size={22} color="#ef4444" />
                <Text style={[styles.moreActionItemText, { color: '#ef4444' }]}>举报</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.moreActionCancelBtn} onPress={() => setShowActionModal(false)}>
              <Text style={styles.moreActionCancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 举报弹窗 */}
      <Modal visible={showReportModal} transparent animationType="slide" onRequestClose={() => setShowReportModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowReportModal(false)} />
          <View style={[styles.reportModal, { paddingBottom: Math.max(insets.bottom, 30) }]}>
            <View style={styles.reportModalHandle} />
            <Text style={styles.reportModalTitle}>举报问题</Text>
            <TouchableOpacity style={styles.reportItem} onPress={() => { setShowReportModal(false); alert('已提交举报：垃圾广告'); }}>
              <Text style={styles.reportItemText}>垃圾广告</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportItem} onPress={() => { setShowReportModal(false); alert('已提交举报：违法违规'); }}>
              <Text style={styles.reportItemText}>违法违规</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportItem} onPress={() => { setShowReportModal(false); alert('已提交举报：低俗色情'); }}>
              <Text style={styles.reportItemText}>低俗色情</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportItem} onPress={() => { setShowReportModal(false); alert('已提交举报：侵权'); }}>
              <Text style={styles.reportItemText}>侵权</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportItem} onPress={() => { setShowReportModal(false); alert('已提交举报：不实信息'); }}>
              <Text style={styles.reportItemText}>不实信息</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportItem} onPress={() => { setShowReportModal(false); alert('已提交举报：其他'); }}>
              <Text style={styles.reportItemText}>其他</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reportCancelBtn} onPress={() => setShowReportModal(false)}>
              <Text style={styles.reportCancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 补充问题评论列表弹窗 */}
      <Modal visible={showSuppCommentListModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSuppCommentListModal(false)}>
          <View style={styles.commentListModal}>
            <View style={styles.commentListModalHandle} />
            <View style={styles.commentListModalHeader}>
              <View style={styles.commentListHeaderLeft} />
              <Text style={styles.commentListModalTitle}>全部评论</Text>
              <TouchableOpacity onPress={() => setShowSuppCommentListModal(false)} style={styles.commentListCloseBtn}>
                <Ionicons name="close" size={26} color="#1f2937" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentListScroll} showsVerticalScrollIndicator={false}>
              {commentsData.map(comment => (
                <View key={comment.id}>
                  <View style={styles.commentListCard}>
                    <View style={styles.commentListHeader}>
                      <Avatar uri={comment.avatar} name={comment.author} size={28} />
                      <Text style={styles.commentListAuthor}>{comment.author}</Text>
                      <View style={{ flex: 1 }} />
                      <Text style={styles.commentListTime}>{comment.time}</Text>
                    </View>
                    <View style={styles.commentListContent}>
                      <Text style={styles.commentListText}>{comment.content}</Text>
                      <View style={styles.commentListActions}>
                        <TouchableOpacity 
                          style={styles.commentListActionBtn}
                          onPress={() => setCommentLiked({ ...commentLiked, [comment.id]: !commentLiked[comment.id] })}
                        >
                          <Ionicons name={commentLiked[comment.id] ? "thumbs-up" : "thumbs-up-outline"} size={14} color={commentLiked[comment.id] ? "#ef4444" : "#9ca3af"} />
                          <Text style={[styles.commentListActionText, commentLiked[comment.id] && { color: '#ef4444' }]}>{comment.likes + (commentLiked[comment.id] ? 1 : 0)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.commentListActionBtn}
                          onPress={() => setExpandedComments({ ...expandedComments, [comment.id]: !expandedComments[comment.id] })}
                        >
                          <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentListActionText}>{comment.replies} 回复</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentListActionBtn}>
                          <Text style={styles.commentListReplyBtn}>回复</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  
                  {/* 回复列表 */}
                  {expandedComments[comment.id] && repliesData[comment.id] && (
                    <View style={styles.repliesContainer}>
                      {repliesData[comment.id].map(reply => (
                        <View key={reply.id} style={styles.replyCard}>
                          <View style={styles.replyHeader}>
                            <Avatar uri={reply.avatar} name={reply.author} size={28} />
                            <Text style={styles.replyAuthor}>{reply.author}</Text>
                            <View style={{ flex: 1 }} />
                            <Text style={styles.replyTime}>{reply.time}</Text>
                          </View>
                          <Text style={styles.replyText}>{reply.content}</Text>
                          <View style={styles.replyActions}>
                            <TouchableOpacity style={styles.replyActionBtn}>
                              <Ionicons name="thumbs-up-outline" size={12} color="#9ca3af" />
                              <Text style={styles.replyActionText}>{reply.likes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.replyActionBtn}>
                              <Text style={styles.replyReplyBtn}>回复</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.commentListBottomBar}>
              <TouchableOpacity 
                style={styles.commentListWriteBtn} 
                onPress={() => { setShowSuppCommentListModal(false); setShowCommentModal(true); }}
              >
                <Ionicons name="create-outline" size={18} color="#6b7280" />
                <Text style={styles.commentListWriteText}>写评论...</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 补充问题更多操作弹窗 */}
      <Modal visible={showSuppMoreModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSuppMoreModal(false)}>
          <View style={[styles.suppMoreModal, { paddingBottom: insets.bottom + 30 }]}>
            <View style={styles.suppMoreModalHandle} />
            
            <View style={styles.suppMoreActionList}>
              <TouchableOpacity style={styles.suppMoreActionItem}>
                <Ionicons name="logo-twitter" size={22} color="#1DA1F2" />
                <Text style={styles.suppMoreActionText}>@推特用户</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.suppMoreActionItem}>
                <Ionicons name="thumbs-down-outline" size={22} color="#6b7280" />
                <Text style={styles.suppMoreActionText}>踩一下 (12)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.suppMoreActionItem}>
                <Ionicons name="flag-outline" size={22} color="#ef4444" />
                <Text style={[styles.suppMoreActionText, { color: '#ef4444' }]}>举报</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.suppMoreCancelBtn} onPress={() => setShowSuppMoreModal(false)}>
              <Text style={styles.suppMoreCancelText}>取消</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 评论弹窗 */}
      <Modal 
        visible={showCommentModal} 
        animationType="slide"
        presentationStyle="fullScreen"
        onShow={() => console.log('评论弹窗已显示')}
        onRequestClose={() => {
          console.log('评论弹窗请求关闭');
          setShowCommentModal(false);
          setCommentText('');
        }}
      >
        <SafeAreaView style={styles.commentModal}>
          <View style={styles.commentModalHeader}>
            <TouchableOpacity onPress={() => { setShowCommentModal(false); setCommentText(''); }} style={styles.commentCloseBtn}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
            <View style={styles.commentHeaderCenter}>
              <Text style={styles.commentModalTitle}>写评论</Text>
            </View>
            <TouchableOpacity 
              style={[styles.commentPublishBtn, !commentText.trim() && styles.commentPublishBtnDisabled]}
              onPress={() => {
                if (commentText.trim()) {
                  alert('评论发布成功！');
                  setCommentText('');
                  setShowCommentModal(false);
                }
              }}
              disabled={!commentText.trim()}
            >
              <Text style={[styles.commentPublishText, !commentText.trim() && styles.commentPublishTextDisabled]}>发布</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.commentContentArea} keyboardShouldPersistTaps="handled">
            <TextInput
              style={styles.commentTextInput}
              placeholder="写下你的评论..."
              placeholderTextColor="#bbb"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              autoFocus
              textAlignVertical="top"
            />
            
            {/* 身份选择器 */}
            <View style={styles.commentIdentitySection}>
              <IdentitySelector
                selectedIdentity={commentIdentity}
                selectedTeams={commentSelectedTeams}
                onIdentityChange={setCommentIdentity}
                onTeamsChange={setCommentSelectedTeams}
              />
            </View>
          </ScrollView>

          <View style={styles.commentToolbar}>
            <View style={styles.commentToolsLeft}>
              <TouchableOpacity style={styles.commentToolItem}>
                <Ionicons name="image-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentToolItem}>
                <Ionicons name="at-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentToolItem}>
                <Ionicons name="happy-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.commentWordCount}>{commentText.length}/500</Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 评论回复列表弹窗 - 今日头条风格 */}
      <Modal visible={showCommentReplyModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCommentReplyModal(false)}>
          <View style={styles.commentListModal}>
            <View style={styles.commentListModalHandle} />
            
            {/* Header - 显示回复数量 */}
            <View style={styles.commentListModalHeader}>
              <TouchableOpacity 
                onPress={() => setShowCommentReplyModal(false)}
                style={styles.commentListCloseBtn}
              >
                <Ionicons name="close" size={26} color="#1f2937" />
              </TouchableOpacity>
              <Text style={styles.commentListModalTitle}>
                {currentCommentId && repliesData[currentCommentId] ? repliesData[currentCommentId].length : 0}条回复
              </Text>
              <View style={styles.commentListHeaderRight} />
            </View>
            
            {/* 原评论卡片 - 今日头条风格 */}
            {currentCommentId && commentsData.find(c => c.id === currentCommentId) && (
              <View style={styles.originalCommentCard}>
                <View style={styles.originalCommentHeader}>
                  <Avatar 
                    uri={commentsData.find(c => c.id === currentCommentId).avatar}
                    name={commentsData.find(c => c.id === currentCommentId).author}
                    size={32}
                  />
                  <Text style={styles.originalCommentAuthor}>
                    {commentsData.find(c => c.id === currentCommentId).author}
                  </Text>
                  <View style={{ flex: 1 }} />
                  <Text style={styles.originalCommentTime}>
                    {commentsData.find(c => c.id === currentCommentId).time}
                  </Text>
                </View>
                <Text style={styles.originalCommentText}>
                  {commentsData.find(c => c.id === currentCommentId).content}
                </Text>
              </View>
            )}
            
            {/* 全部回复标题 */}
            <View style={styles.repliesSectionHeader}>
              <Text style={styles.repliesSectionTitle}>全部回复</Text>
            </View>
            
            <ScrollView style={styles.commentListScroll} showsVerticalScrollIndicator={false}>
              {currentCommentId && repliesData[currentCommentId] && repliesData[currentCommentId].map(reply => (
                <View key={reply.id} style={styles.replyCard}>
                  <View style={styles.replyHeader}>
                    <Avatar uri={reply.avatar} name={reply.author} size={28} />
                    <Text style={styles.replyAuthor}>{reply.author}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.replyTime}>{reply.time}</Text>
                  </View>
                  <Text style={styles.replyText}>{reply.content}</Text>
                  <View style={styles.replyActions}>
                    <TouchableOpacity style={styles.replyActionBtn}>
                      <Ionicons name="thumbs-up-outline" size={12} color="#9ca3af" />
                      <Text style={styles.replyActionText}>{reply.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.replyActionBtn}>
                      <Text style={styles.replyReplyBtn}>回复</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.commentListBottomBar}>
              <TouchableOpacity 
                style={styles.commentListWriteBtn} 
                onPress={() => { setShowCommentReplyModal(false); setShowCommentModal(true); }}
              >
                <Ionicons name="create-outline" size={18} color="#6b7280" />
                <Text style={styles.commentListWriteText}>写回复...</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 编写回答弹窗 - 今日头条风格 */}
      <Modal visible={showAnswerModal} animationType="slide">
        <SafeAreaView style={styles.answerModal}>
          <View style={styles.answerModalHeader}>
            <TouchableOpacity onPress={() => { setShowAnswerModal(false); setCurrentSupplement(null); }} style={styles.answerCloseBtn}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
            <View style={styles.answerHeaderCenter}>
              <Text style={styles.answerModalTitle}>写回答</Text>
            </View>
            <TouchableOpacity 
              style={[styles.answerPublishBtn, !answerText.trim() && styles.answerPublishBtnDisabled]}
              onPress={handleSubmitAnswer}
              disabled={!answerText.trim()}
            >
              <Text style={[styles.answerPublishText, !answerText.trim() && styles.answerPublishTextDisabled]}>发布</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.answerQuestionCard}>
            <View style={styles.answerQuestionIcon}>
              <Ionicons name="help-circle" size={20} color="#ef4444" />
            </View>
            <View style={styles.answerQuestionContent}>
              <Text style={styles.answerQuestionText} numberOfLines={2}>{currentQuestion.title}</Text>
              {currentSupplement && (
                <View style={styles.answerSupplementInfo}>
                  <Ionicons name="arrow-forward" size={14} color="#f59e0b" />
                  <Text style={styles.answerSupplementLabel}>补充问题：</Text>
                  <Text style={styles.answerSupplementText} numberOfLines={2}>{currentSupplement.content}</Text>
                </View>
              )}
            </View>
          </View>

          <ScrollView style={styles.answerContentArea} keyboardShouldPersistTaps="handled">
            <TextInput
              style={styles.answerTextInput}
              placeholder="写下你的回答，帮助有需要的人..."
              placeholderTextColor="#bbb"
              value={answerText}
              onChangeText={setAnswerText}
              multiline
              autoFocus
              textAlignVertical="top"
            />
            
            {/* 身份选择器 */}
            <View style={styles.answerIdentitySection}>
              <IdentitySelector
                selectedIdentity={answerIdentity}
                selectedTeams={answerSelectedTeams}
                onIdentityChange={setAnswerIdentity}
                onTeamsChange={setAnswerSelectedTeams}
              />
            </View>
          </ScrollView>

          <View style={styles.answerToolbar}>
            <View style={styles.answerToolsLeft}>
              <TouchableOpacity style={styles.answerToolItem}>
                <Ionicons name="image-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.answerToolItem}>
                <Ionicons name="at-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.answerToolItem}>
                <Ionicons name="pricetag-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.answerWordCount}>{answerText.length}/2000</Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 回答评论列表弹窗 */}
      <Modal visible={showAnswerCommentListModal} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowAnswerCommentListModal(false)}>
          <View style={styles.commentListModal}>
            <View style={styles.commentListModalHandle} />
            <View style={styles.commentListModalHeader}>
              <View style={styles.commentListHeaderLeft} />
              <Text style={styles.commentListModalTitle}>全部评论</Text>
              <TouchableOpacity onPress={() => setShowAnswerCommentListModal(false)} style={styles.commentListCloseBtn}>
                <Ionicons name="close" size={26} color="#1f2937" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentListScroll} showsVerticalScrollIndicator={false}>
              {commentsData.map(comment => (
                <View key={comment.id}>
                  <View style={styles.commentListCard}>
                    <View style={styles.commentListHeader}>
                      <Avatar uri={comment.avatar} name={comment.author} size={28} />
                      <Text style={styles.commentListAuthor}>{comment.author}</Text>
                      <View style={{ flex: 1 }} />
                      <Text style={styles.commentListTime}>{comment.time}</Text>
                    </View>
                    <View style={styles.commentListContent}>
                      <Text style={styles.commentListText}>{comment.content}</Text>
                      <View style={styles.commentListActions}>
                        <TouchableOpacity 
                          style={styles.commentListActionBtn}
                          onPress={() => setCommentLiked({ ...commentLiked, [comment.id]: !commentLiked[comment.id] })}
                        >
                          <Ionicons name={commentLiked[comment.id] ? "thumbs-up" : "thumbs-up-outline"} size={14} color={commentLiked[comment.id] ? "#ef4444" : "#9ca3af"} />
                          <Text style={[styles.commentListActionText, commentLiked[comment.id] && { color: '#ef4444' }]}>{comment.likes + (commentLiked[comment.id] ? 1 : 0)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.commentListActionBtn}
                          onPress={() => setExpandedComments({ ...expandedComments, [comment.id]: !expandedComments[comment.id] })}
                        >
                          <Ionicons name="chatbubble-outline" size={14} color="#9ca3af" />
                          <Text style={styles.commentListActionText}>{comment.replies} 回复</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentListActionBtn}>
                          <Text style={styles.commentListReplyBtn}>回复</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  
                  {/* 回复列表 */}
                  {expandedComments[comment.id] && repliesData[comment.id] && (
                    <View style={styles.repliesContainer}>
                      {repliesData[comment.id].map(reply => (
                        <View key={reply.id} style={styles.replyCard}>
                          <View style={styles.replyHeader}>
                            <Avatar uri={reply.avatar} name={reply.author} size={28} />
                            <Text style={styles.replyAuthor}>{reply.author}</Text>
                            <View style={{ flex: 1 }} />
                            <Text style={styles.replyTime}>{reply.time}</Text>
                          </View>
                          <Text style={styles.replyText}>{reply.content}</Text>
                          <View style={styles.replyActions}>
                            <TouchableOpacity style={styles.replyActionBtn}>
                              <Ionicons name="thumbs-up-outline" size={12} color="#9ca3af" />
                              <Text style={styles.replyActionText}>{reply.likes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.replyActionBtn}>
                              <Text style={styles.replyReplyBtn}>回复</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.commentListBottomBar}>
              <TouchableOpacity 
                style={styles.commentListWriteBtn} 
                onPress={() => { setShowAnswerCommentListModal(false); setShowCommentModal(true); }}
              >
                <Ionicons name="create-outline" size={18} color="#6b7280" />
                <Text style={styles.commentListWriteText}>写评论...</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 发起活动弹窗 */}
      <Modal visible={showActivityModal} animationType="slide">
        <SafeAreaView style={styles.activityModal}>
          <View style={styles.activityModalHeader}>
            <TouchableOpacity onPress={() => setShowActivityModal(false)} style={styles.activityCloseBtn}>
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
            <View style={styles.activityHeaderCenter}>
              <Text style={styles.activityModalTitle}>发起活动</Text>
            </View>
            <TouchableOpacity 
              style={[styles.activityPublishBtn, !activityForm.title.trim() && styles.activityPublishBtnDisabled]}
              onPress={handleCreateActivity}
              disabled={!activityForm.title.trim()}
            >
              <Text style={[styles.activityPublishText, !activityForm.title.trim() && styles.activityPublishTextDisabled]}>发布</Text>
            </TouchableOpacity>
          </View>

          {/* 绑定问题显示 */}
          <View style={styles.boundQuestionCard}>
            <View style={styles.boundQuestionHeader}>
              <Ionicons name="link" size={16} color="#22c55e" />
              <Text style={styles.boundQuestionLabel}>绑定问题</Text>
            </View>
            <Text style={styles.boundQuestionText} numberOfLines={2}>{currentQuestion.title}</Text>
          </View>

          <ScrollView style={styles.activityFormArea} keyboardShouldPersistTaps="handled">
            {/* 活动类型选择 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>活动类型 *</Text>
              <View style={styles.activityTypeSelector}>
                <TouchableOpacity 
                  style={[styles.activityTypeSelectorBtn, activityForm.activityType === '线上活动' && styles.activityTypeSelectorBtnActive]}
                  onPress={() => setActivityForm({...activityForm, activityType: '线上活动'})}
                >
                  <Ionicons name="videocam" size={18} color={activityForm.activityType === '线上活动' ? '#fff' : '#6b7280'} />
                  <Text style={[styles.activityTypeSelectorText, activityForm.activityType === '线上活动' && styles.activityTypeSelectorTextActive]}>线上活动</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.activityTypeSelectorBtn, activityForm.activityType === '线下活动' && styles.activityTypeSelectorBtnActive]}
                  onPress={() => setActivityForm({...activityForm, activityType: '线下活动'})}
                >
                  <Ionicons name="location" size={18} color={activityForm.activityType === '线下活动' ? '#fff' : '#6b7280'} />
                  <Text style={[styles.activityTypeSelectorText, activityForm.activityType === '线下活动' && styles.activityTypeSelectorTextActive]}>线下活动</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>活动标题 *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="请输入活动标题"
                placeholderTextColor="#bbb"
                value={activityForm.title}
                onChangeText={(text) => setActivityForm({...activityForm, title: text})}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>活动描述</Text>
              <TextInput
                style={[styles.formInput, styles.formTextarea]}
                placeholder="请输入活动描述..."
                placeholderTextColor="#bbb"
                value={activityForm.description}
                onChangeText={(text) => setActivityForm({...activityForm, description: text})}
                multiline
                textAlignVertical="top"
              />
            </View>

            {/* 开始日期时间 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>开始时间</Text>
              <View style={styles.formRow}>
                <TouchableOpacity style={[styles.formSelectBtn, { flex: 1, marginRight: 8 }]}>
                  <Ionicons name="calendar-outline" size={18} color="#6b7280" />
                  <Text style={styles.formSelectText}>{activityForm.startDate || '选择日期'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.formSelectBtn, { flex: 1, marginLeft: 8 }]}>
                  <Ionicons name="time-outline" size={18} color="#6b7280" />
                  <Text style={styles.formSelectText}>{activityForm.startTime || '选择时间'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 结束日期时间 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>结束时间</Text>
              <View style={styles.formRow}>
                <TouchableOpacity style={[styles.formSelectBtn, { flex: 1, marginRight: 8 }]}>
                  <Ionicons name="calendar-outline" size={18} color="#6b7280" />
                  <Text style={styles.formSelectText}>{activityForm.endDate || '选择日期'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.formSelectBtn, { flex: 1, marginLeft: 8 }]}>
                  <Ionicons name="time-outline" size={18} color="#6b7280" />
                  <Text style={styles.formSelectText}>{activityForm.endTime || '选择时间'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 活动地址 - 仅线下活动显示 */}
            <View style={[styles.formGroup, { display: activityForm.activityType === '线下活动' ? 'flex' : 'none' }]}>
              <Text style={styles.formLabel}>
                活动地址 <Text style={{ color: '#ef4444' }}>*</Text>
              </Text>
              <View style={styles.formInputWithIcon}>
                <Ionicons name="location-outline" size={18} color="#6b7280" />
                <TextInput
                  style={styles.formInputInner}
                  placeholder="请输入详细地址（必填）"
                  placeholderTextColor="#bbb"
                  value={activityForm.location}
                  onChangeText={(text) => setActivityForm({...activityForm, location: text})}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>人数上限</Text>
              <View style={styles.formInputWithIcon}>
                <Ionicons name="people-outline" size={18} color="#6b7280" />
                <TextInput
                  style={styles.formInputInner}
                  placeholder="不限"
                  placeholderTextColor="#bbb"
                  value={activityForm.maxParticipants}
                  onChangeText={(text) => setActivityForm({...activityForm, maxParticipants: text})}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>联系方式</Text>
              <View style={styles.formInputWithIcon}>
                <Ionicons name="call-outline" size={18} color="#6b7280" />
                <TextInput
                  style={styles.formInputInner}
                  placeholder="请输入联系方式（手机号/微信/邮箱）"
                  placeholderTextColor="#bbb"
                  value={activityForm.contact}
                  onChangeText={(text) => setActivityForm({...activityForm, contact: text})}
                />
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* 补充回答弹窗 */}
      <Modal visible={showSupplementAnswerModal} animationType="slide">
        <SafeAreaView style={styles.answerModal}>
          <View style={styles.answerModalHeader}>
            <TouchableOpacity 
              onPress={() => { 
                setShowSupplementAnswerModal(false); 
                setCurrentAnswer(null); 
                setSupplementAnswerText('');
              }} 
              style={styles.answerCloseBtn}
            >
              <Ionicons name="close" size={26} color="#333" />
            </TouchableOpacity>
            <View style={styles.answerHeaderCenter}>
              <Text style={styles.answerModalTitle}>补充回答</Text>
            </View>
            <TouchableOpacity 
              style={[styles.answerPublishBtn, !supplementAnswerText.trim() && styles.answerPublishBtnDisabled]}
              onPress={handleSubmitSupplementAnswer}
              disabled={!supplementAnswerText.trim()}
            >
              <Text style={[styles.answerPublishText, !supplementAnswerText.trim() && styles.answerPublishTextDisabled]}>发布</Text>
            </TouchableOpacity>
          </View>

          {currentAnswer && (
            <View style={styles.supplementAnswerContext}>
              <View style={styles.supplementAnswerHeader}>
                <Ionicons name="document-text" size={18} color="#3b82f6" />
                <Text style={styles.supplementAnswerLabel}>原回答</Text>
              </View>
              <View style={styles.supplementAnswerAuthor}>
                <Avatar uri={currentAnswer.avatar} name={currentAnswer.author} size={24} />
                <Text style={styles.supplementAnswerAuthorName}>{currentAnswer.author}</Text>
              </View>
              <Text style={styles.supplementAnswerContent} numberOfLines={3}>{currentAnswer.content}</Text>
            </View>
          )}

          <ScrollView style={styles.answerContentArea} keyboardShouldPersistTaps="handled">
            <TextInput
              style={styles.answerTextInput}
              placeholder="补充你的回答，提供更多信息..."
              placeholderTextColor="#bbb"
              value={supplementAnswerText}
              onChangeText={setSupplementAnswerText}
              multiline
              autoFocus
              textAlignVertical="top"
            />
            
            {/* 身份选择器 */}
            <View style={styles.answerIdentitySection}>
              <IdentitySelector
                selectedIdentity={supplementIdentity}
                selectedTeams={supplementSelectedTeams}
                onIdentityChange={setSupplementIdentity}
                onTeamsChange={setSupplementSelectedTeams}
              />
            </View>
          </ScrollView>

          <View style={styles.answerToolbar}>
            <View style={styles.answerToolsLeft}>
              <TouchableOpacity style={styles.answerToolItem}>
                <Ionicons name="image-outline" size={24} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.answerToolItem}>
                <Ionicons name="at-outline" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Text style={styles.answerWordCount}>{supplementAnswerText.length}/2000</Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* 追加悬赏弹窗 */}
      <Modal visible={showAddRewardModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.addRewardModal, { paddingBottom: insets.bottom + 30 }]}>
            <View style={styles.addRewardModalHandle} />
            <Text style={styles.addRewardModalTitle}>追加悬赏</Text>
            
            <View style={styles.addRewardContent}>
              {/* 当前悬赏信息 */}
              <View style={styles.currentRewardInfo}>
                <View style={styles.currentRewardRow}>
                  <Text style={styles.currentRewardLabel}>当前悬赏</Text>
                  <Text style={styles.currentRewardAmount}>${currentReward}</Text>
                </View>
                <View style={styles.currentRewardRow}>
                  <Text style={styles.currentRewardDesc}>已有 {rewardContributors} 人追加悬赏</Text>
                </View>
              </View>

              {/* 快速选择金额 */}
              <Text style={styles.addRewardSectionTitle}>选择追加金额</Text>
              <View style={styles.quickAmountGrid}>
                {[10, 20, 50, 100, 200, 500].map(amount => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.quickAmountBtn,
                      selectedAddRewardAmount === amount && styles.quickAmountBtnActive
                    ]}
                    onPress={() => {
                      setSelectedAddRewardAmount(amount);
                      setAddRewardAmount('');
                    }}
                  >
                    <Text style={[
                      styles.quickAmountText,
                      selectedAddRewardAmount === amount && styles.quickAmountTextActive
                    ]}>${amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 自定义金额 */}
              <Text style={styles.addRewardSectionTitle}>或输入自定义金额</Text>
              <View style={styles.customAmountInput}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.customAmountField}
                  placeholder="最低 $5"
                  placeholderTextColor="#9ca3af"
                  value={addRewardAmount}
                  onChangeText={(text) => {
                    setAddRewardAmount(text);
                    setSelectedAddRewardAmount(null);
                  }}
                  keyboardType="numeric"
                />
              </View>

              {/* 提示信息 */}
              <View style={styles.addRewardTips}>
                <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
                <Text style={styles.addRewardTipsText}>
                  追加的悬赏将与原悬赏合并，吸引更多优质回答
                </Text>
              </View>

              {/* 确认按钮 */}
              <TouchableOpacity
                style={[
                  styles.confirmAddRewardBtn,
                  (!selectedAddRewardAmount && !addRewardAmount) && styles.confirmAddRewardBtnDisabled
                ]}
                onPress={handleAddReward}
                disabled={!selectedAddRewardAmount && !addRewardAmount}
              >
                <Text style={styles.confirmAddRewardBtnText}>
                  确认追加 ${selectedAddRewardAmount || addRewardAmount || 0}
                </Text>
              </TouchableOpacity>

              {/* 取消按钮 */}
              <TouchableOpacity
                style={styles.cancelAddRewardBtn}
                onPress={() => {
                  setShowAddRewardModal(false);
                  setAddRewardAmount('');
                  setSelectedAddRewardAmount(null);
                }}
              >
                <Text style={styles.cancelAddRewardBtnText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 购买超级赞弹窗 */}
      <Modal visible={showSuperLikeModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.superLikeModal}>
            <View style={styles.superLikeModalHandle} />
            <View style={styles.superLikeModalHeader}>
              <Ionicons name="star" size={24} color="#f59e0b" />
              <Text style={styles.superLikeModalTitle}>购买超级赞</Text>
            </View>
            
            <ScrollView 
              style={styles.superLikeScrollContent}
              contentContainerStyle={styles.superLikeContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* 当前超级赞信息 */}
              <View style={styles.currentSuperLikeInfo}>
                <View style={styles.superLikeInfoCard}>
                  <View style={styles.superLikeInfoRow}>
                    <Text style={styles.superLikeInfoLabel}>当前超级赞</Text>
                    <View style={styles.superLikeCountBadge}>
                      <Ionicons name="star" size={16} color="#f59e0b" />
                      <Text style={styles.superLikeCountText}>
                        {answerSuperLikes[currentAnswerForSuperLike?.id] || currentAnswerForSuperLike?.superLikes || 0}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.superLikeInfoDesc}>
                    超级赞越多，您的回答排名越靠前，获得更多曝光
                  </Text>
                </View>
              </View>

              {/* 快速选择数量 */}
              <Text style={styles.superLikeSectionTitle}>选择购买数量</Text>
              <View style={styles.quickSuperLikeGrid}>
                {[5, 10, 20, 50, 100].map(amount => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.quickSuperLikeBtn,
                      selectedSuperLikeAmount === amount && styles.quickSuperLikeBtnActive
                    ]}
                    onPress={() => {
                      setSelectedSuperLikeAmount(amount);
                      setSuperLikeAmount('');
                    }}
                  >
                    <Ionicons name="star" size={18} color={selectedSuperLikeAmount === amount ? "#fff" : "#f59e0b"} />
                    <Text style={[
                      styles.quickSuperLikeText,
                      selectedSuperLikeAmount === amount && styles.quickSuperLikeTextActive
                    ]}>x{amount}</Text>
                    <Text style={[
                      styles.quickSuperLikePrice,
                      selectedSuperLikeAmount === amount && styles.quickSuperLikePriceActive
                    ]}>${amount * 2}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 自定义数量 */}
              <Text style={styles.superLikeSectionTitle}>或输入自定义数量</Text>
              <View style={styles.customSuperLikeInput}>
                <Ionicons name="star-outline" size={20} color="#f59e0b" />
                <TextInput
                  style={styles.customSuperLikeField}
                  placeholder="最少 1 个"
                  placeholderTextColor="#9ca3af"
                  value={superLikeAmount}
                  onChangeText={(text) => {
                    setSuperLikeAmount(text);
                    setSelectedSuperLikeAmount(null);
                  }}
                  keyboardType="numeric"
                />
                <Text style={styles.superLikePriceHint}>
                  ${(parseInt(superLikeAmount) || 0) * 2}
                </Text>
              </View>

              {/* 价格说明 */}
              <View style={styles.superLikePriceInfo}>
                <View style={styles.priceInfoRow}>
                  <Text style={styles.priceInfoLabel}>单价</Text>
                  <Text style={styles.priceInfoValue}>$2 / 个</Text>
                </View>
                <View style={styles.priceInfoRow}>
                  <Text style={styles.priceInfoLabel}>购买数量</Text>
                  <Text style={styles.priceInfoValue}>
                    {selectedSuperLikeAmount || superLikeAmount || 0} 个
                  </Text>
                </View>
                <View style={[styles.priceInfoRow, styles.priceInfoTotal]}>
                  <Text style={styles.priceInfoTotalLabel}>总计</Text>
                  <Text style={styles.priceInfoTotalValue}>
                    ${(selectedSuperLikeAmount || parseInt(superLikeAmount) || 0) * 2}
                  </Text>
                </View>
              </View>

              {/* 提示信息 */}
              <View style={styles.superLikeTips}>
                <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
                <Text style={styles.superLikeTipsText}>
                  购买超级赞后，您的回答将获得更高的排名权重，增加曝光机会
                </Text>
              </View>
            </ScrollView>

            {/* 底部按钮区域 - 固定在底部 */}
            <View style={[styles.superLikeFooter, { paddingBottom: insets.bottom + 20 }]}>
              {/* 确认按钮 */}
              <TouchableOpacity
                style={[
                  styles.confirmSuperLikeBtn,
                  (!selectedSuperLikeAmount && !superLikeAmount) && styles.confirmSuperLikeBtnDisabled
                ]}
                onPress={handleBuySuperLike}
                disabled={!selectedSuperLikeAmount && !superLikeAmount}
              >
                <Ionicons name="star" size={18} color="#fff" />
                <Text style={styles.confirmSuperLikeBtnText}>
                  立即购买 {selectedSuperLikeAmount || superLikeAmount || 0} 个超级赞
                </Text>
              </TouchableOpacity>

              {/* 取消按钮 */}
              <TouchableOpacity
                style={styles.cancelSuperLikeBtn}
                onPress={() => {
                  setShowSuperLikeModal(false);
                  setSuperLikeAmount('');
                  setSelectedSuperLikeAmount(null);
                  setCurrentAnswerForSuperLike(null);
                }}
              >
                <Text style={styles.cancelSuperLikeBtnText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 追加悬赏人员名单弹窗 */}
      <Modal visible={showRewardContributorsModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.contributorsModal, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.contributorsModalHandle} />
            <View style={styles.contributorsModalHeader}>
              <Text style={styles.contributorsModalTitle}>追加悬赏名单</Text>
              <TouchableOpacity onPress={() => setShowRewardContributorsModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.contributorsTotalInfo}>
              <View style={styles.contributorsTotalRow}>
                <Text style={styles.contributorsTotalLabel}>当前总悬赏</Text>
                <Text style={styles.contributorsTotalAmount}>${currentReward}</Text>
              </View>
              <Text style={styles.contributorsTotalDesc}>共 {rewardContributors} 人追加悬赏</Text>
            </View>

            <ScrollView style={styles.contributorsList} showsVerticalScrollIndicator={false}>
              {rewardContributorsList.map((contributor, index) => (
                <View key={contributor.id} style={styles.contributorItem}>
                  <View style={styles.contributorRank}>
                    <Text style={styles.contributorRankText}>#{index + 1}</Text>
                  </View>
                  <Avatar uri={contributor.avatar} name={contributor.name} size={40} />
                  <View style={styles.contributorInfo}>
                    <Text style={styles.contributorName}>{contributor.name}</Text>
                    <Text style={styles.contributorTime}>{contributor.time}</Text>
                  </View>
                  <View style={styles.contributorAmountBadge}>
                    <Ionicons name="add" size={12} color="#ef4444" />
                    <Text style={styles.contributorAmountText}>${contributor.amount}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.contributorsCloseBtn}
              onPress={() => setShowRewardContributorsModal(false)}
            >
              <Text style={styles.contributorsCloseBtnText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 申请仲裁弹窗 - 暂时隐藏 */}
      <Modal visible={false && showArbitrationModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.arbitrationModal}>
            <View style={styles.arbitrationModalHandle} />
            <View style={styles.arbitrationModalHeader}>
              <Text style={styles.arbitrationModalTitle}>申请仲裁</Text>
              <TouchableOpacity onPress={() => setShowArbitrationModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.arbitrationContent} showsVerticalScrollIndicator={false}>
              {/* 说明 */}
              <View style={styles.arbitrationInfo}>
                <Ionicons name="information-circle" size={20} color="#3b82f6" />
                <Text style={styles.arbitrationInfoText}>
                  如果您对已采纳的答案持有不同意见，可以申请仲裁。邀请至少3位专家投票，超过50%同意则推翻采纳。
                </Text>
              </View>

              {/* 仲裁理由 */}
              <Text style={styles.arbitrationSectionTitle}>仲裁理由</Text>
              <TextInput
                style={styles.arbitrationReasonInput}
                placeholder="请详细说明您申请仲裁的理由..."
                placeholderTextColor="#9ca3af"
                value={arbitrationReason}
                onChangeText={setArbitrationReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              {/* 邀请专家 */}
              <View style={styles.arbitrationExpertsHeader}>
                <Text style={styles.arbitrationSectionTitle}>邀请专家投票</Text>
                <Text style={styles.arbitrationExpertsCount}>
                  已选 {selectedExperts.length}/5 位
                </Text>
              </View>

              {/* 专家搜索框 */}
              <View style={styles.expertSearchBox}>
                <Ionicons name="search-outline" size={18} color="#9ca3af" />
                <TextInput
                  style={styles.expertSearchInput}
                  placeholder="搜索专家姓名、职称或领域..."
                  placeholderTextColor="#9ca3af"
                  value={expertSearchText}
                  onChangeText={setExpertSearchText}
                />
                {expertSearchText.length > 0 && (
                  <TouchableOpacity onPress={() => setExpertSearchText('')}>
                    <Ionicons name="close-circle" size={18} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>

              {/* 推荐专家标题 */}
              <View style={styles.recommendedExpertsHeader}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.recommendedExpertsTitle}>推荐专家</Text>
              </View>

              {expertsList
                .filter(expert => {
                  if (!expertSearchText) return true;
                  const searchLower = expertSearchText.toLowerCase();
                  return (
                    expert.name.toLowerCase().includes(searchLower) ||
                    expert.title.toLowerCase().includes(searchLower) ||
                    expert.expertise.toLowerCase().includes(searchLower)
                  );
                })
                .map(expert => (
                <TouchableOpacity
                  key={expert.id}
                  style={[
                    styles.expertItem,
                    selectedExperts.includes(expert.id) && styles.expertItemSelected
                  ]}
                  onPress={() => toggleExpertSelection(expert.id)}
                >
                  <Avatar uri={expert.avatar} name={expert.name} size={44} />
                  <View style={styles.expertInfo}>
                    <View style={styles.expertNameRow}>
                      <Text style={styles.expertName}>{expert.name}</Text>
                      {expert.verified && <Ionicons name="checkmark-circle" size={14} color="#3b82f6" />}
                    </View>
                    <Text style={styles.expertTitle}>{expert.title}</Text>
                    <Text style={styles.expertExpertise}>擅长：{expert.expertise}</Text>
                  </View>
                  <View style={[
                    styles.expertCheckbox,
                    selectedExperts.includes(expert.id) && styles.expertCheckboxSelected
                  ]}>
                    {selectedExperts.includes(expert.id) && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}

              {/* 搜索无结果提示 */}
              {expertSearchText && expertsList.filter(expert => {
                const searchLower = expertSearchText.toLowerCase();
                return (
                  expert.name.toLowerCase().includes(searchLower) ||
                  expert.title.toLowerCase().includes(searchLower) ||
                  expert.expertise.toLowerCase().includes(searchLower)
                );
              }).length === 0 && (
                <View style={styles.noExpertsFound}>
                  <Ionicons name="search-outline" size={32} color="#d1d5db" />
                  <Text style={styles.noExpertsFoundText}>未找到匹配的专家</Text>
                  <Text style={styles.noExpertsFoundDesc}>试试其他关键词</Text>
                </View>
              )}

              <View style={{ height: 20 }} />
            </ScrollView>

            <View style={[styles.arbitrationModalFooter, { paddingBottom: insets.bottom + 16 }]}>
              <TouchableOpacity
                style={[
                  styles.submitArbitrationBtn,
                  (!arbitrationReason.trim() || selectedExperts.length < 3) && styles.submitArbitrationBtnDisabled
                ]}
                onPress={handleSubmitArbitration}
                disabled={!arbitrationReason.trim() || selectedExperts.length < 3}
              >
                <Text style={styles.submitArbitrationBtnText}>
                  提交仲裁申请
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelArbitrationBtn}
                onPress={() => {
                  setShowArbitrationModal(false);
                  setArbitrationReason('');
                  setSelectedExperts([]);
                }}
              >
                <Text style={styles.cancelArbitrationBtnText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 仲裁状态弹窗 - 暂时隐藏 */}
      <Modal visible={false && showArbitrationStatusModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.arbitrationStatusModal, { paddingBottom: insets.bottom + 30 }]}>
            <View style={styles.arbitrationModalHandle} />
            <Text style={styles.arbitrationStatusTitle}>仲裁投票详情</Text>

            {/* 投票进度 */}
            <View style={styles.votingProgress}>
              <View style={styles.votingProgressBar}>
                <View style={[styles.votingAgreeBar, { width: `${(arbitrationVotes.agree / arbitrationVotes.total) * 100}%` }]} />
                <View style={[styles.votingDisagreeBar, { width: `${(arbitrationVotes.disagree / arbitrationVotes.total) * 100}%` }]} />
              </View>
              <View style={styles.votingStats}>
                <View style={styles.votingStatItem}>
                  <View style={styles.votingAgreeIndicator} />
                  <Text style={styles.votingStatText}>同意推翻：{arbitrationVotes.agree} 票</Text>
                </View>
                <View style={styles.votingStatItem}>
                  <View style={styles.votingDisagreeIndicator} />
                  <Text style={styles.votingStatText}>维持原判：{arbitrationVotes.disagree} 票</Text>
                </View>
              </View>
              <Text style={styles.votingPercentage}>
                {((arbitrationVotes.agree / arbitrationVotes.total) * 100).toFixed(1)}% 同意推翻
              </Text>
            </View>

            {/* 投票结果 */}
            {arbitrationStatus === 'pending' && (
              <View style={styles.arbitrationPendingInfo}>
                <Ionicons name="time-outline" size={24} color="#f59e0b" />
                <Text style={styles.arbitrationPendingInfoText}>
                  等待专家投票中...
                </Text>
                <TouchableOpacity 
                  style={styles.simulateVoteBtn}
                  onPress={simulateVoting}
                >
                  <Text style={styles.simulateVoteBtnText}>模拟投票结果</Text>
                </TouchableOpacity>
              </View>
            )}

            {arbitrationStatus === 'approved' && (
              <View style={styles.arbitrationApprovedInfo}>
                <Ionicons name="checkmark-circle" size={32} color="#22c55e" />
                <Text style={styles.arbitrationResultTitle}>仲裁通过</Text>
                <Text style={styles.arbitrationResultDesc}>
                  超过50%的专家同意推翻原采纳答案，问题状态已回到PK状态
                </Text>
              </View>
            )}

            {arbitrationStatus === 'rejected' && (
              <View style={styles.arbitrationRejectedInfo}>
                <Ionicons name="close-circle" size={32} color="#ef4444" />
                <Text style={styles.arbitrationResultTitle}>仲裁未通过</Text>
                <Text style={styles.arbitrationResultDesc}>
                  未达到50%同意率，维持原采纳答案
                </Text>
              </View>
            )}

            {/* 专家投票详情列表 */}
            {arbitrationStatus && (
              <View style={styles.expertVotesSection}>
                <Text style={styles.expertVotesSectionTitle}>专家投票详情</Text>
                <ScrollView style={styles.expertVotesList} showsVerticalScrollIndicator={false}>
                  {expertVoteDetails.map(expert => (
                    <View key={expert.id} style={styles.expertVoteCard}>
                      <View style={styles.expertVoteHeader}>
                        <Avatar uri={expert.avatar} name={expert.name} size={40} />
                        <View style={styles.expertVoteInfo}>
                          <View style={styles.expertVoteNameRow}>
                            <Text style={styles.expertVoteName}>{expert.name}</Text>
                            <View style={[
                              styles.expertVoteBadge,
                              expert.vote === 'agree' ? styles.expertVoteAgreeBadge : styles.expertVoteDisagreeBadge
                            ]}>
                              <Ionicons 
                                name={expert.vote === 'agree' ? "checkmark" : "close"} 
                                size={12} 
                                color="#fff" 
                              />
                              <Text style={styles.expertVoteBadgeText}>
                                {expert.vote === 'agree' ? '同意推翻' : '维持原判'}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.expertVoteTitle}>{expert.title}</Text>
                        </View>
                      </View>
                      <View style={styles.expertVoteReasonBox}>
                        <Text style={styles.expertVoteReasonLabel}>投票理由：</Text>
                        <Text style={styles.expertVoteReasonText}>{expert.reason}</Text>
                      </View>
                      <Text style={styles.expertVoteTime}>{expert.time}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeArbitrationStatusBtn}
              onPress={() => setShowArbitrationStatusModal(false)}
            >
              <Text style={styles.closeArbitrationStatusBtnText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 仲裁结果弹窗 - 暂时隐藏 */}
      <Modal visible={false && showArbitrationResultModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.arbitrationStatusModal, { paddingBottom: insets.bottom + 30 }]}>
            <View style={styles.arbitrationModalHandle} />
            <Text style={styles.arbitrationStatusTitle}>仲裁结果</Text>

            {currentArbitrationResult && (
              <>
                {/* 投票进度 */}
                <View style={styles.votingProgress}>
                  <View style={styles.votingProgressBar}>
                    <View style={[styles.votingAgreeBar, { width: `${(currentArbitrationResult.votes.agree / currentArbitrationResult.votes.total) * 100}%` }]} />
                    <View style={[styles.votingDisagreeBar, { width: `${(currentArbitrationResult.votes.disagree / currentArbitrationResult.votes.total) * 100}%` }]} />
                  </View>
                  <View style={styles.votingStats}>
                    <View style={styles.votingStatItem}>
                      <View style={styles.votingAgreeIndicator} />
                      <Text style={styles.votingStatText}>同意推翻：{currentArbitrationResult.votes.agree} 票</Text>
                    </View>
                    <View style={styles.votingStatItem}>
                      <View style={styles.votingDisagreeIndicator} />
                      <Text style={styles.votingStatText}>维持原判：{currentArbitrationResult.votes.disagree} 票</Text>
                    </View>
                  </View>
                  <Text style={styles.votingPercentage}>
                    {((currentArbitrationResult.votes.agree / currentArbitrationResult.votes.total) * 100).toFixed(1)}% 同意推翻
                  </Text>
                </View>

                {/* 投票结果 */}
                {currentArbitrationResult.status === 'approved' ? (
                  <View style={styles.arbitrationApprovedInfo}>
                    <Ionicons name="checkmark-circle" size={32} color="#22c55e" />
                    <Text style={styles.arbitrationResultTitle}>仲裁通过</Text>
                    <Text style={styles.arbitrationResultDesc}>
                      超过50%的专家同意推翻原采纳答案
                    </Text>
                  </View>
                ) : (
                  <View style={styles.arbitrationRejectedInfo}>
                    <Ionicons name="shield-checkmark" size={32} color="#22c55e" />
                    <Text style={styles.arbitrationResultTitle}>仲裁未通过</Text>
                    <Text style={styles.arbitrationResultDesc}>
                      未达到50%同意率，维持原答案
                    </Text>
                  </View>
                )}

                {/* 专家投票详情列表 */}
                <View style={styles.expertVotesSection}>
                  <Text style={styles.expertVotesSectionTitle}>专家投票详情</Text>
                  <ScrollView style={styles.expertVotesList} showsVerticalScrollIndicator={false}>
                    {currentArbitrationResult.experts.map(expert => (
                      <View key={expert.id} style={styles.expertVoteCard}>
                        <View style={styles.expertVoteHeader}>
                          <Avatar uri={expert.avatar} name={expert.name} size={40} />
                          <View style={styles.expertVoteInfo}>
                            <View style={styles.expertVoteNameRow}>
                              <Text style={styles.expertVoteName}>{expert.name}</Text>
                              <View style={[
                                styles.expertVoteBadge,
                                expert.vote === 'agree' ? styles.expertVoteAgreeBadge : styles.expertVoteDisagreeBadge
                              ]}>
                                <Ionicons 
                                  name={expert.vote === 'agree' ? "checkmark" : "close"} 
                                  size={12} 
                                  color="#fff" 
                                />
                                <Text style={styles.expertVoteBadgeText}>
                                  {expert.vote === 'agree' ? '同意推翻' : '维持原判'}
                                </Text>
                              </View>
                            </View>
                            <Text style={styles.expertVoteTitle}>{expert.title}</Text>
                          </View>
                        </View>
                        <View style={styles.expertVoteReasonBox}>
                          <Text style={styles.expertVoteReasonLabel}>投票理由：</Text>
                          <Text style={styles.expertVoteReasonText}>{expert.reason}</Text>
                        </View>
                        <Text style={styles.expertVoteTime}>{expert.time}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.closeArbitrationStatusBtn}
              onPress={() => {
                setShowArbitrationResultModal(false);
                setCurrentArbitrationResult(null);
              }}
            >
              <Text style={styles.closeArbitrationStatusBtnText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  shareBtnText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  content: { flex: 1 },
  questionSection: { backgroundColor: '#fff', padding: 16 },
  questionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', lineHeight: 26, marginBottom: 8 },
  expandHint: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 },
  expandHintText: { fontSize: 13, color: '#3b82f6', fontWeight: '500' },
  expandHintInline: { fontSize: 13, color: '#3b82f6', fontWeight: '500' },
  rewardTagInline: { 
    backgroundColor: 'transparent', 
    paddingHorizontal: 0, 
    paddingVertical: 0, 
    borderRadius: 0,
    fontSize: 19, 
    color: '#ef4444', 
    fontWeight: '600',
    includeFontPadding: false,
    lineHeight: 26,
  },
  // 悬赏信息卡片样式 - 缩小版
  rewardInfoCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fee2e2', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  rewardInfoLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rewardAmountText: { fontSize: 24, fontWeight: '800', color: '#ef4444', letterSpacing: 0.5 },
  addRewardBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    backgroundColor: '#ef4444', 
    paddingHorizontal: 14, 
    paddingVertical: 5, 
    borderRadius: 20,
    minWidth: 76, 
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3
  },
  addRewardBtnText: { fontSize: 14, color: '#fff', fontWeight: '700', letterSpacing: 0.3 },
  adoptionProgressContainer: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  adoptionProgressText: { fontSize: 12, color: '#10b981', fontWeight: '600' },
  rewardContributorsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 2 },
  rewardContributorsText: { fontSize: 11, color: '#9ca3af' },
  questionContent: { fontSize: 14, color: '#4b5563', lineHeight: 22, marginTop: -3, marginBottom: 12 },
  questionImage: { width: '100%', height: 180, borderRadius: 8, marginBottom: 12 },
  viewsAndTags: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  viewsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewsText: { fontSize: 12, color: '#9ca3af' },
  topicTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topicTag: { fontSize: 12, color: '#6b7280', backgroundColor: '#f3f4f6', paddingHorizontal: 8, paddingVertical: 0, borderRadius: 12, lineHeight: 16, textAlignVertical: 'center', height: 20 },
  // 作者信息和操作按钮行
  authorActionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', marginBottom: 12 },
  authorInfoLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  smallAvatar: { width: 32, height: 32, borderRadius: 16 },
  authorMetaInfo: { marginLeft: 8, flex: 1 },
  authorNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  smallAuthorName: { fontSize: 13, fontWeight: '500', color: '#1f2937' },
  followBtnSmall: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, gap: 2 },
  followBtnSmallText: { fontSize: 10, color: '#ef4444', fontWeight: '500' },
  smallPostTime: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  actionButtonsRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  smallActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  pkSection: { marginTop: 6, marginBottom: 6 },
  pkRow: { flexDirection: 'row', alignItems: 'center' },
  pkBarWrapper: { flex: 1, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  pkBar: { flexDirection: 'row', height: 36, borderRadius: 18, overflow: 'hidden', width: '100%' },
  pkSolvedBar: { backgroundColor: '#3b82f6', flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 15 },
  pkUnsolvedBar: { backgroundColor: '#ef4444', flex: 1, alignItems: 'center', justifyContent: 'center', paddingLeft: 15 },
  pkSolvedText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  pkUnsolvedText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  pkCenterBadge: { position: 'absolute', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, borderWidth: 1.5, borderColor: '#e5e7eb', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  pkCenterText: { fontSize: 12, color: '#ef4444', fontWeight: '700' },
  // 进度条样式
  pkProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressSolvedLabel: { backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: '#bfdbfe' },
  progressUnsolvedLabel: { backgroundColor: '#fef2f2', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: '#fecaca' },
  progressLabelText: { fontSize: 10, color: '#6b7280', fontWeight: '600' },
  progressBarWrapper: { flex: 1, position: 'relative' },
  progressBar: { flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', backgroundColor: '#f3f4f6' },
  progressSolvedFill: { backgroundColor: '#3b82f6', height: '100%' },
  progressUnsolvedFill: { backgroundColor: '#ef4444', height: '100%' },
  progressPercentLabel: { position: 'absolute', top: -18, transform: [{ translateX: -12 }] },
  progressPercentText: { fontSize: 10, color: '#6b7280', fontWeight: '600' },
  // 底部固定栏样式
  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  bottomActionBtn: { flexDirection: 'column', alignItems: 'center', gap: 4 },
  bottomActionText: { fontSize: 11, color: '#6b7280', fontWeight: '500' },
  answersSection: { marginTop: 0, backgroundColor: '#fff' },
  answerTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  answerTabItem: { flex: 1, paddingVertical: 12, position: 'relative', alignItems: 'center' },
  answerTabText: { fontSize: 14, color: '#6b7280' },
  answerTabTextActive: { color: '#ef4444', fontWeight: '600' },
  answerTabIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: '#ef4444', borderRadius: 1 },
  // 筛选条样式
  sortFilterBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fafafa', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  sortFilterLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  sortFilterBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12 },
  sortFilterBtnActive: { backgroundColor: '#fef2f2' },
  sortFilterText: { fontSize: 13, color: '#9ca3af' },
  sortFilterTextActive: { color: '#ef4444', fontWeight: '500' },
  sortFilterCount: { fontSize: 12, color: '#9ca3af' },
  
  // 超级赞购买横幅样式
  superLikePurchaseBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fffbeb', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#fef3c7' },
  superLikePurchaseBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  superLikePurchaseBannerText: { fontSize: 13, color: '#f59e0b', fontWeight: '600' },
  answerCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  answerCardAdopted: { backgroundColor: '#fef2f210' },
  // 答案标签区域 - 优化布局，禁止换行
  answerTagsSection: { flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap', gap: 6, marginBottom: 10, overflow: 'hidden' },
  answerTagsActions: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6 },
  // 紧凑版标签样式
  adoptedBadgeCompact: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#bbf7d0' },
  adoptedBadgeCompactText: { fontSize: 11, color: '#22c55e', fontWeight: '600' },
  // 作者已采纳标签样式
  authorAdoptedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#f0fdf4', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#bbf7d0' },
  authorAdoptedBadgeText: { fontSize: 11, color: '#22c55e', fontWeight: '600' },
  // 已采纳数量标签样式
  adoptedCountBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#bfdbfe' },
  adoptedCountBadgeText: { fontSize: 11, color: '#3b82f6', fontWeight: '600' },
  inviterBadgeCompact: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#bfdbfe' },
  inviterTextCompact: { fontSize: 10, color: '#3b82f6', fontWeight: '500' },
  arbitrationPendingBadgeCompact: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#fffbeb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#fde68a' },
  arbitrationPendingTextCompact: { fontSize: 10, color: '#f59e0b', fontWeight: '600' },
  arbitrationApprovedBadgeCompact: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#fecaca' },
  arbitrationApprovedTextCompact: { fontSize: 10, color: '#ef4444', fontWeight: '600' },
  arbitrationResultBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  arbitrationResultApproved: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  arbitrationResultRejected: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  arbitrationResultText: { fontSize: 10, fontWeight: '600' },
  arbitrationResultTextApproved: { color: '#ef4444' },
  arbitrationResultTextRejected: { color: '#22c55e' },
  viewArbitrationResultBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#f9fafb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  viewArbitrationResultBtnText: { fontSize: 10, color: '#6b7280', fontWeight: '500' },
  arbitrationBtnCompact: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#f9fafb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  arbitrationBtnTextCompact: { fontSize: 10, color: '#6b7280', fontWeight: '500' },
  viewArbitrationBtnCompact: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 2 },
  viewArbitrationBtnTextCompact: { fontSize: 10, color: '#6b7280' },
  answerHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  answerAvatar: { width: 40, height: 40, borderRadius: 20 },
  answerAuthorInfo: { flex: 1, marginLeft: 12 },
  answerAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  answerAuthor: { fontSize: 12, fontWeight: '500', color: '#1f2937' },
  // 采纳按钮样式 - 简洁设计，无图标
  adoptAnswerBtn: { 
    backgroundColor: '#f0fdf4', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 14, 
    borderWidth: 1.5, 
    borderColor: '#22c55e',
    marginLeft: 6
  },
  adoptAnswerBtnText: { 
    fontSize: 12, 
    color: '#22c55e', 
    fontWeight: '700',
    letterSpacing: 0.2
  },
  adoptedTag: { backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  adoptedTagText: { fontSize: 10, color: '#fff', fontWeight: '500' },
  answerAuthorTitle: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  answerSupplementBtnTop: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  answerSupplementTextTop: { fontSize: 12, color: '#fff', fontWeight: '600' },
  answerContent: { fontSize: 14, color: '#374151', lineHeight: 22 },
  answerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  answerFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  answerFooterRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  answerActions: { flexDirection: 'row', gap: 20 },
  answerActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  answerActionText: { fontSize: 13, color: '#6b7280' },
  answerSupplementBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#ef4444', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  answerSupplementText: { fontSize: 12, color: '#fff', fontWeight: '500' },
  answerCommentBtn: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  answerCommentText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  answerMoreBtn: { padding: 6 },
  answerTime: { fontSize: 12, color: '#9ca3af' },
  loadMoreBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, gap: 4 },
  loadMoreText: { fontSize: 14, color: '#ef4444' },
  // 补充问题样式
  suppCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  suppHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  suppAvatar: { width: 40, height: 40, borderRadius: 20 },
  suppAuthorInfo: { flex: 1, marginLeft: 12 },
  suppAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  suppAuthor: { fontSize: 12, fontWeight: '500', color: '#1f2937' },
  suppLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  suppLocation: { fontSize: 12, color: '#9ca3af' },
  suppAnswerBtnTop: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#ef4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  suppAnswerTextTop: { fontSize: 11, color: '#fff', fontWeight: '500' },
  suppContent: { fontSize: 14, color: '#374151', lineHeight: 22 },
  suppFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  suppFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  suppFooterRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  suppActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  suppActionText: { fontSize: 13, color: '#6b7280' },
  suppAnswerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  suppAnswerText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  suppCommentBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  suppCommentText: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  suppMoreBtn: { padding: 6 },
  // 补充问题更多弹窗
  suppMoreModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  suppMoreModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  suppMoreActionList: { paddingTop: 8 },
  suppMoreActionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  suppMoreActionText: { fontSize: 15, color: '#1f2937', marginLeft: 14 },
  suppMoreCancelBtn: { marginTop: 8, marginHorizontal: 16, backgroundColor: '#f3f4f6', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  suppMoreCancelText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  // 更多操作弹窗样式
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  moreActionModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  moreActionModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  actionListSection: { paddingTop: 8 },
  moreActionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  moreActionItemText: { fontSize: 15, color: '#1f2937', marginLeft: 14 },
  moreActionCancelBtn: { marginTop: 8, marginHorizontal: 16, backgroundColor: '#f3f4f6', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  moreActionCancelText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  // 评论弹窗样式
  commentModal: { flex: 1, backgroundColor: '#fff' },
  commentModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  commentCloseBtn: { padding: 4, zIndex: 10 },
  commentHeaderCenter: { flex: 1, alignItems: 'center' },
  commentModalTitle: { fontSize: 17, fontWeight: '600', color: '#222' },
  commentPublishBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, zIndex: 1 },
  commentPublishBtnDisabled: { backgroundColor: '#ffcdd2' },
  commentPublishText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  commentPublishTextDisabled: { color: '#fff' },
  commentContentArea: { flex: 1, backgroundColor: '#fff' },
  commentTextInput: { padding: 16, fontSize: 16, color: '#333', lineHeight: 26, minHeight: 200 },
  commentIdentitySection: { paddingHorizontal: 16, paddingBottom: 16 },
  commentToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fff' },
  commentToolsLeft: { flexDirection: 'row', alignItems: 'center' },
  commentToolItem: { padding: 10 },
  commentWordCount: { fontSize: 13, color: '#999' },
  // 评论列表弹窗样式 - 今日头条风格
  commentListModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  commentListModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  commentListModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  commentListHeaderLeft: { width: 40 },
  commentListCloseBtn: { position: 'absolute', right: 16, padding: 4, zIndex: 10 },
  commentListModalTitle: { fontSize: 17, fontWeight: '600', color: '#1f2937' },
  // 原评论卡片样式 - 今日头条风格
  originalCommentCard: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 8, borderBottomColor: '#f9fafb' },
  originalCommentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  originalCommentAuthor: { fontSize: 13, fontWeight: '500', color: '#9ca3af' },
  originalCommentTime: { fontSize: 13, color: '#9ca3af' },
  originalCommentText: { fontSize: 16, color: '#1f2937', lineHeight: 24, marginBottom: 0 },
  originalCommentActions: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  originalCommentActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  originalCommentActionText: { fontSize: 13, color: '#9ca3af' },
  // 回复区域标题
  repliesSectionHeader: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fafafa' },
  repliesSectionTitle: { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
  commentListScroll: { maxHeight: 500, backgroundColor: '#fff' },
  commentListCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  commentListHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  commentListAuthor: { fontSize: 12, fontWeight: '500', color: '#9ca3af' },
  commentListTime: { fontSize: 12, color: '#9ca3af' },
  commentListContent: { flex: 1 },
  commentListText: { fontSize: 15, color: '#1f2937', lineHeight: 22, marginBottom: 10 },
  commentListActions: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  commentListActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentListActionText: { fontSize: 12, color: '#9ca3af' },
  commentListReplyBtn: { fontSize: 12, color: '#ef4444' },
  commentListBottomBar: { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  commentListWriteBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f9fafb', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  commentListWriteText: { fontSize: 14, color: '#9ca3af' },
  // 今日头条风格回答弹窗
  answerModal: { flex: 1, backgroundColor: '#fff' },
  answerModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  answerCloseBtn: { padding: 4, zIndex: 10 },
  answerHeaderCenter: { flex: 1, alignItems: 'center' },
  answerModalTitle: { fontSize: 17, fontWeight: '600', color: '#222' },
  answerPublishBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, zIndex: 1 },
  answerPublishBtnDisabled: { backgroundColor: '#ffcdd2' },
  answerPublishText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  answerPublishTextDisabled: { color: '#fff' },
  answerQuestionCard: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, backgroundColor: '#fafafa', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  answerQuestionIcon: { marginRight: 8, marginTop: 2 },
  answerQuestionContent: { flex: 1 },
  answerQuestionLabel: { fontSize: 12, color: '#f59e0b', fontWeight: '600', marginBottom: 6 },
  answerQuestionText: { flex: 1, fontSize: 15, color: '#333', lineHeight: 22, fontWeight: '500' },
  answerSupplementInfo: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e5e7eb', gap: 4 },
  answerSupplementLabel: { fontSize: 12, color: '#f59e0b', fontWeight: '600' },
  answerSupplementText: { flex: 1, fontSize: 13, color: '#6b7280', lineHeight: 18 },
  answerQuestionAuthor: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  answerQuestionAuthorText: { fontSize: 12, color: '#9ca3af' },
  answerContentArea: { flex: 1, backgroundColor: '#fff' },
  answerTextInput: { padding: 16, fontSize: 16, color: '#333', lineHeight: 26, minHeight: 300 },
  answerIdentitySection: { paddingHorizontal: 16, paddingBottom: 16 },
  answerToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fff' },
  answerToolsLeft: { flexDirection: 'row', alignItems: 'center' },
  answerToolItem: { padding: 10 },
  answerWordCount: { fontSize: 13, color: '#999' },
  // 补充回答弹窗样式
  supplementAnswerContext: { backgroundColor: '#f0f9ff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#e0f2fe' },
  supplementAnswerHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  supplementAnswerLabel: { fontSize: 13, color: '#3b82f6', fontWeight: '600' },
  supplementAnswerAuthor: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  supplementAnswerAuthorName: { fontSize: 14, fontWeight: '500', color: '#1f2937' },
  supplementAnswerContent: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  // 发起活动弹窗样式
  activityModal: { flex: 1, backgroundColor: '#fff' },
  activityModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  activityCloseBtn: { padding: 4, zIndex: 10 },
  activityHeaderCenter: { flex: 1, alignItems: 'center' },
  activityModalTitle: { fontSize: 17, fontWeight: '600', color: '#222' },
  activityPublishBtn: { backgroundColor: '#22c55e', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, zIndex: 1 },
  activityPublishBtnDisabled: { backgroundColor: '#bbf7d0' },
  activityPublishText: { fontSize: 14, color: '#fff', fontWeight: '600' },
  activityPublishTextDisabled: { color: '#fff' },
  boundQuestionCard: { backgroundColor: '#f0fdf4', padding: 12, marginHorizontal: 16, marginTop: 12, borderRadius: 8, borderWidth: 1, borderColor: '#bbf7d0' },
  boundQuestionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  boundQuestionLabel: { fontSize: 12, color: '#22c55e', fontWeight: '500', marginLeft: 6 },
  boundQuestionText: { fontSize: 14, color: '#166534', lineHeight: 20 },
  activityFormArea: { flex: 1, padding: 16 },
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  formInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  formTextarea: { minHeight: 100, textAlignVertical: 'top' },
  formRow: { flexDirection: 'row' },
  formSelectBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, gap: 8 },
  formSelectText: { fontSize: 15, color: '#6b7280' },
  formInputWithIcon: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, gap: 8 },
  formInputInner: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#1f2937' },
  // 评论样式 - 横向布局
  commentCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  commentAuthor: { fontSize: 12, fontWeight: '500', color: '#9ca3af' },
  commentTime: { fontSize: 12, color: '#9ca3af' },
  commentContent: { flex: 1 },
  commentText: { fontSize: 15, color: '#1f2937', lineHeight: 22, marginBottom: 10 },
  commentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  commentFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  commentFooterRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentActions: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 20 },
  commentActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  commentActionText: { fontSize: 12, color: '#9ca3af' },
  commentReplyBtn: { fontSize: 12, color: '#ef4444' },
  // 活动卡片样式
  activityCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  activityCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  activityTypeTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, gap: 4 },
  onlineTag: { backgroundColor: '#3b82f6' },
  offlineTag: { backgroundColor: '#22c55e' },
  activityTypeText: { fontSize: 11, color: '#fff', fontWeight: '500' },
  activityStatusTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusOpen: { backgroundColor: '#fef3c7' },
  statusSoon: { backgroundColor: '#dbeafe' },
  activityStatusText: { fontSize: 11, color: '#92400e', fontWeight: '500' },
  activityTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 10 },
  activityInfo: { gap: 6 },
  activityInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  activityInfoText: { fontSize: 13, color: '#6b7280', flex: 1 },
  activityCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  activityOrganizer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activityOrganizerAvatar: { width: 28, height: 28, borderRadius: 14 },
  activityOrganizerName: { fontSize: 13, color: '#6b7280' },
  activityJoinBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  activityJoinText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  // 活动类型选择器
  activityTypeSelector: { flexDirection: 'row', gap: 12 },
  activityTypeSelectorBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f9fafb', gap: 8 },
  activityTypeSelectorBtnActive: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  activityTypeSelectorText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  activityTypeSelectorTextActive: { color: '#fff' },
  // 举报弹窗样式
  reportModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  reportModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  reportModalTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937', textAlign: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  reportItem: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  reportItemText: { fontSize: 15, color: '#1f2937', textAlign: 'center' },
  reportCancelBtn: { marginTop: 8, marginHorizontal: 16, backgroundColor: '#f3f4f6', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  reportCancelText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  // 邀请列表样式
  inviteContainer: { backgroundColor: '#fff' },
  inviteSubTabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingHorizontal: 16 },
  inviteSubTabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, gap: 3, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  inviteSubTabItemActive: { borderBottomColor: '#ef4444' },
  inviteSubTabText: { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
  inviteSubTabTextActive: { color: '#ef4444', fontWeight: '600' },
  inviteSearchContainer: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fafafa', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  inviteSearchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7, gap: 8 },
  inviteSearchInput: { flex: 1, fontSize: 13, color: '#1f2937', padding: 0 },
  inviteTabContent: { paddingHorizontal: 16, paddingTop: 16 },
  // 推荐用户横向滚动
  recommendScroll: { marginBottom: 16 },
  recommendUserCard: { flexDirection: 'row', alignItems: 'center', marginRight: 10, backgroundColor: '#fafafa', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1, borderColor: '#f3f4f6', gap: 8 },
  recommendUserAvatar: { width: 36, height: 36, borderRadius: 18 },
  recommendUserTextContainer: { flex: 1 },
  recommendUserName: { fontSize: 12, fontWeight: '500', color: '#1f2937', marginBottom: 2 },
  recommendUserDesc: { fontSize: 10, color: '#9ca3af' },
  recommendInviteBtn: { backgroundColor: '#ef4444', width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  recommendInviteBtnText: { fontSize: 10, color: '#fff', fontWeight: '500' },
  recommendInviteBtnTwitter: { backgroundColor: '#1DA1F2' },
  recommendInviteBtnFacebook: { backgroundColor: '#4267B2' },
  // 已邀请列表
  invitedListTitle: { fontSize: 13, fontWeight: '600', color: '#6b7280', marginBottom: 8, marginTop: 4 },
  inviteUserCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  inviteUserAvatar: { width: 44, height: 44, borderRadius: 22 },
  inviteUserInfo: { flex: 1, marginLeft: 12 },
  inviteUserName: { fontSize: 14, fontWeight: '500', color: '#1f2937', marginBottom: 4 },
  inviteUserDesc: { fontSize: 12, color: '#9ca3af' },
  invitedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  invitedTagText: { fontSize: 12, color: '#22c55e', fontWeight: '500' },
  loadMoreInvitedBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, gap: 4, marginTop: 8 },
  loadMoreInvitedText: { fontSize: 14, color: '#ef4444', fontWeight: '500' },
  inviteBtn: { backgroundColor: '#ef4444', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 4 },
  inviteBtnText: { fontSize: 13, color: '#fff', fontWeight: '500' },
  inviteBtnTwitter: { backgroundColor: '#1DA1F2' },
  inviteBtnFacebook: { backgroundColor: '#4267B2' },
  // 邀请回答弹窗样式
  inviteModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  inviteModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  inviteModalTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', textAlign: 'center', marginBottom: 16 },
  invitePlatformTabs: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 16, gap: 8 },
  invitePlatformTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', gap: 4 },
  invitePlatformTabActive: { backgroundColor: '#eff6ff', borderColor: '#3b82f6' },
  invitePlatformTabText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  invitePlatformTabTextActive: { color: '#3b82f6', fontWeight: '600' },
  inviteSearchContainer: { paddingHorizontal: 16, marginBottom: 16 },
  inviteSearchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  inviteSearchInput: { flex: 1, fontSize: 14, color: '#1f2937', padding: 0 },
  inviteUserList: { maxHeight: 400, paddingHorizontal: 16 },
  inviteUserItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  inviteUserAvatar: { width: 44, height: 44, borderRadius: 22 },
  inviteUserInfo: { flex: 1, marginLeft: 12 },
  inviteUserName: { fontSize: 14, fontWeight: '500', color: '#1f2937', marginBottom: 4 },
  inviteUserDesc: { fontSize: 12, color: '#9ca3af' },
  inviteUserBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, gap: 4 },
  inviteUserBtnText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  inviteUserBtnFacebook: { backgroundColor: '#4267B2' },
  inviteUserBtnTwitter: { backgroundColor: '#1DA1F2' },
  // 团队弹窗样式
  teamModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  teamModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 12 },
  teamHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  teamTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  // 团队成员区域
  teamMembersSection: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  teamMembersTitle: { fontSize: 14, fontWeight: '600', color: '#6b7280', paddingHorizontal: 16, marginBottom: 12 },
  teamMembersScroll: { paddingHorizontal: 16 },
  teamMemberItem: { alignItems: 'center', marginRight: 16 },
  teamMemberAvatarWrapper: { position: 'relative', marginBottom: 6 },
  teamMemberAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: '#f59e0b' },
  teamLeaderBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#f59e0b', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  teamMemberName: { fontSize: 12, color: '#1f2937', fontWeight: '500', marginBottom: 2 },
  teamMemberRole: { fontSize: 10, color: '#f59e0b', fontWeight: '600' },
  // 团队聊天区域
  teamChatSection: { flex: 1, paddingTop: 16 },
  teamChatTitle: { fontSize: 14, fontWeight: '600', color: '#6b7280', paddingHorizontal: 16, marginBottom: 12 },
  teamChatMessages: { maxHeight: 300, paddingHorizontal: 16 },
  teamChatMessage: { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  teamChatAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  teamChatBubble: { flex: 1, backgroundColor: '#f9fafb', borderRadius: 12, padding: 10 },
  teamChatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  teamChatUser: { fontSize: 13, fontWeight: '600', color: '#1f2937' },
  teamChatTime: { fontSize: 11, color: '#9ca3af' },
  teamChatText: { fontSize: 13, color: '#374151', lineHeight: 18 },
  teamChatInputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  teamChatInput: { flex: 1, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#1f2937' },
  teamChatSendBtn: { backgroundColor: '#f59e0b', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  // 团队操作按钮
  teamActions: { paddingHorizontal: 16, paddingTop: 16 },
  teamJoinBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f59e0b', paddingVertical: 14, borderRadius: 12, gap: 8 },
  teamJoinBtnText: { fontSize: 15, color: '#fff', fontWeight: '600' },
  teamLeaveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2', paddingVertical: 14, borderRadius: 12, gap: 8, borderWidth: 1, borderColor: '#fecaca' },
  teamLeaveBtnText: { fontSize: 15, color: '#ef4444', fontWeight: '600' },
  // 回复样式 - 横向布局
  repliesContainer: { paddingLeft: 48, backgroundColor: '#fafafa', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  replyCard: { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  replyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  replyAuthor: { fontSize: 12, fontWeight: '500', color: '#9ca3af' },
  replyTime: { fontSize: 12, color: '#9ca3af' },
  replyText: { fontSize: 15, color: '#1f2937', lineHeight: 22, marginBottom: 10 },
  replyActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  replyActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  replyActionText: { fontSize: 11, color: '#9ca3af' },
  replyReplyBtn: { fontSize: 11, color: '#ef4444' },
  // 推荐问题样式
  recommendedSection: { backgroundColor: '#f9fafb', paddingTop: 16 },
  recommendedHeader: { paddingHorizontal: 16, marginBottom: 16 },
  recommendedHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  recommendedTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  recommendedSubtitle: { fontSize: 12, color: '#9ca3af', marginLeft: 28 },
  recommendedQuestionCard: { backgroundColor: '#fff', marginBottom: 8, padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  recommendedHotTagInline: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#fef2f2', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  recommendedHotTextInline: { fontSize: 10, color: '#ef4444', fontWeight: '600' },
  recommendedQuestionTitle: { fontSize: 17, fontWeight: '600', color: '#1f2937', lineHeight: 26, marginBottom: 12 },
  recommendedQuestionContent: { fontSize: 14, color: '#6b7280', lineHeight: 22, marginBottom: 12 },
  recommendedQuestionMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  recommendedAuthorInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recommendedAuthorAvatar: { width: 24, height: 24, borderRadius: 12 },
  recommendedAuthorName: { fontSize: 13, fontWeight: '500', color: '#374151' },
  recommendedQuestionTime: { fontSize: 12, color: '#9ca3af' },
  recommendedQuestionStats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recommendedStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  recommendedStatText: { fontSize: 12, color: '#9ca3af' },
  recommendedTopicTags: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  recommendedTopicTag: { fontSize: 12, color: '#3b82f6', backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  // 加载指示器样式
  loadingIndicator: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 13, color: '#9ca3af' },
  // 收起按钮样式（在列表内部）
  collapseBtn: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 16, 
    marginTop: 16, 
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: '#fef2f2', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  collapseBtnText: { fontSize: 15, color: '#ef4444', fontWeight: '600', marginRight: 4 },
  // 追加悬赏弹窗样式
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  addRewardModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  addRewardModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  addRewardModalTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', textAlign: 'center', marginBottom: 20 },
  addRewardContent: { paddingHorizontal: 20 },
  currentRewardInfo: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, marginBottom: 20 },
  currentRewardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  currentRewardLabel: { fontSize: 14, color: '#6b7280' },
  currentRewardAmount: { fontSize: 28, fontWeight: '700', color: '#ef4444' },
  currentRewardDesc: { fontSize: 12, color: '#9ca3af' },
  addRewardSectionTitle: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 },
  quickAmountGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  quickAmountBtn: { width: '30%', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  quickAmountBtnActive: { backgroundColor: '#fef2f2', borderColor: '#ef4444', borderWidth: 2 },
  quickAmountText: { fontSize: 16, fontWeight: '600', color: '#6b7280' },
  quickAmountTextActive: { color: '#ef4444' },
  customAmountInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 },
  currencySymbol: { fontSize: 18, fontWeight: '600', color: '#6b7280', marginRight: 8 },
  customAmountField: { flex: 1, fontSize: 16, color: '#1f2937', padding: 0 },
  addRewardTips: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#eff6ff', borderRadius: 8, padding: 12, marginBottom: 20 },
  addRewardTipsText: { flex: 1, fontSize: 12, color: '#6b7280', lineHeight: 18 },
  confirmAddRewardBtn: { backgroundColor: '#ef4444', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  confirmAddRewardBtnDisabled: { backgroundColor: '#fca5a5' },
  confirmAddRewardBtnText: { fontSize: 15, color: '#fff', fontWeight: '600' },
  cancelAddRewardBtn: { backgroundColor: '#f3f4f6', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cancelAddRewardBtnText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  // 追加悬赏人员名单弹窗样式
  contributorsModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' },
  contributorsModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 12 },
  contributorsModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  contributorsModalTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  contributorsTotalInfo: { backgroundColor: '#fef2f2', marginHorizontal: 20, marginTop: 16, marginBottom: 12, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#fee2e2' },
  contributorsTotalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  contributorsTotalLabel: { fontSize: 13, color: '#6b7280' },
  contributorsTotalAmount: { fontSize: 24, fontWeight: '700', color: '#ef4444' },
  contributorsTotalDesc: { fontSize: 12, color: '#9ca3af' },
  contributorsList: { maxHeight: 300, paddingHorizontal: 20 },
  contributorItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  contributorRank: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#f9fafb', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  contributorRankText: { fontSize: 12, fontWeight: '600', color: '#9ca3af' },
  contributorInfo: { flex: 1, marginLeft: 10 },
  contributorName: { fontSize: 14, fontWeight: '500', color: '#1f2937', marginBottom: 2 },
  contributorTime: { fontSize: 11, color: '#9ca3af' },
  contributorAmountBadge: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: '#fef2f2', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: '#fee2e2' },
  contributorAmountText: { fontSize: 13, fontWeight: '600', color: '#ef4444' },
  contributorsCloseBtn: { marginHorizontal: 20, marginTop: 12, backgroundColor: '#f3f4f6', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  contributorsCloseBtnText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  
  // 超级赞徽章样式
  superLikeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fffbeb', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1, borderColor: '#fef3c7', flexShrink: 0 },
  superLikeBadgeInactive: { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' },
  superLikeBadgeText: { fontSize: 11, color: '#f59e0b', fontWeight: '600', flexShrink: 0, whiteSpace: 'nowrap' },
  superLikeBadgeTextInactive: { color: '#9ca3af' },
  
  // 购买超级赞弹窗样式
  superLikeModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  superLikeModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  superLikeModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 },
  superLikeModalTitle: { fontSize: 20, fontWeight: '700', color: '#1f2937' },
  superLikeScrollContent: { maxHeight: 450 },
  superLikeContentContainer: { paddingHorizontal: 20, paddingBottom: 10 },
  superLikeContent: { paddingHorizontal: 20 },
  currentSuperLikeInfo: { marginBottom: 20 },
  superLikeInfoCard: { backgroundColor: '#fffbeb', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#fef3c7' },
  superLikeInfoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  superLikeInfoLabel: { fontSize: 14, color: '#92400e', fontWeight: '500' },
  superLikeCountBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  superLikeCountText: { fontSize: 16, fontWeight: '700', color: '#f59e0b' },
  superLikeInfoDesc: { fontSize: 12, color: '#92400e', lineHeight: 18 },
  superLikeSectionTitle: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 },
  quickSuperLikeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  quickSuperLikeBtn: { width: '30%', backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fef3c7', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', gap: 4 },
  quickSuperLikeBtnActive: { backgroundColor: '#f59e0b', borderColor: '#f59e0b', borderWidth: 2 },
  quickSuperLikeText: { fontSize: 15, fontWeight: '600', color: '#f59e0b' },
  quickSuperLikeTextActive: { color: '#fff' },
  quickSuperLikePrice: { fontSize: 11, color: '#92400e' },
  quickSuperLikePriceActive: { color: '#fff' },
  customSuperLikeInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16, gap: 10 },
  customSuperLikeField: { flex: 1, fontSize: 16, color: '#1f2937', padding: 0 },
  superLikePriceHint: { fontSize: 14, fontWeight: '600', color: '#f59e0b' },
  superLikePriceInfo: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 14, marginBottom: 16 },
  priceInfoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  priceInfoLabel: { fontSize: 13, color: '#6b7280' },
  priceInfoValue: { fontSize: 13, color: '#1f2937', fontWeight: '500' },
  priceInfoTotal: { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 8, marginTop: 4 },
  priceInfoTotalLabel: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  priceInfoTotalValue: { fontSize: 18, fontWeight: '700', color: '#f59e0b' },
  superLikeTips: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#eff6ff', borderRadius: 8, padding: 12, marginBottom: 20 },
  superLikeTipsText: { flex: 1, fontSize: 12, color: '#6b7280', lineHeight: 18 },
  superLikeFooter: { paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6', backgroundColor: '#fff' },
  confirmSuperLikeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#f59e0b', borderRadius: 12, paddingVertical: 14, marginBottom: 12 },
  confirmSuperLikeBtnDisabled: { backgroundColor: '#fcd34d' },
  confirmSuperLikeBtnText: { fontSize: 15, color: '#fff', fontWeight: '600' },
  cancelSuperLikeBtn: { backgroundColor: '#f3f4f6', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cancelSuperLikeBtnText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  
  // 仲裁申请弹窗样式
  arbitrationModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '85%' },
  arbitrationModalHandle: { width: 40, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 12 },
  arbitrationModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  arbitrationModalTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  arbitrationContent: { maxHeight: 500, paddingHorizontal: 20, paddingTop: 16 },
  arbitrationInfo: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#eff6ff', borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#dbeafe' },
  arbitrationInfoText: { flex: 1, fontSize: 13, color: '#1e40af', lineHeight: 20 },
  arbitrationSectionTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937', marginBottom: 10 },
  arbitrationReasonInput: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, fontSize: 14, color: '#1f2937', minHeight: 100, marginBottom: 20 },
  arbitrationExpertsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  arbitrationExpertsCount: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  // 专家搜索框样式
  expertSearchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16, gap: 8 },
  expertSearchInput: { flex: 1, fontSize: 14, color: '#1f2937', padding: 0 },
  // 推荐专家标题样式
  recommendedExpertsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  recommendedExpertsTitle: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  // 搜索无结果样式
  noExpertsFound: { alignItems: 'center', paddingVertical: 40 },
  noExpertsFoundText: { fontSize: 15, fontWeight: '500', color: '#6b7280', marginTop: 12 },
  noExpertsFoundDesc: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
  expertItem: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#f9fafb', borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  expertItemSelected: { backgroundColor: '#eff6ff', borderColor: '#3b82f6', borderWidth: 2 },
  expertInfo: { flex: 1, marginLeft: 12 },
  expertNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  expertName: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  expertTitle: { fontSize: 12, color: '#6b7280', marginBottom: 2 },
  expertExpertise: { fontSize: 11, color: '#9ca3af' },
  expertCheckbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#d1d5db', alignItems: 'center', justifyContent: 'center' },
  expertCheckboxSelected: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  arbitrationModalFooter: { paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  submitArbitrationBtn: { backgroundColor: '#ef4444', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  submitArbitrationBtnDisabled: { backgroundColor: '#fca5a5' },
  submitArbitrationBtnText: { fontSize: 15, color: '#fff', fontWeight: '600' },
  cancelArbitrationBtn: { backgroundColor: '#f3f4f6', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cancelArbitrationBtnText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  // 仲裁状态弹窗样式
  arbitrationStatusModal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20 },
  arbitrationStatusTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', textAlign: 'center', marginTop: 20, marginBottom: 20 },
  votingProgress: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, marginBottom: 20 },
  votingProgressBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: '#e5e7eb', marginBottom: 12 },
  votingAgreeBar: { backgroundColor: '#22c55e', height: '100%' },
  votingDisagreeBar: { backgroundColor: '#ef4444', height: '100%' },
  votingStats: { gap: 8, marginBottom: 12 },
  votingStatItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  votingAgreeIndicator: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#22c55e' },
  votingDisagreeIndicator: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ef4444' },
  votingStatText: { fontSize: 13, color: '#6b7280' },
  votingPercentage: { fontSize: 16, fontWeight: '700', color: '#1f2937', textAlign: 'center' },
  arbitrationPendingInfo: { alignItems: 'center', paddingVertical: 20 },
  arbitrationPendingInfoText: { fontSize: 14, color: '#6b7280', marginTop: 10, marginBottom: 16 },
  simulateVoteBtn: { backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  simulateVoteBtnText: { fontSize: 13, color: '#fff', fontWeight: '600' },
  arbitrationApprovedInfo: { alignItems: 'center', paddingVertical: 20 },
  arbitrationRejectedInfo: { alignItems: 'center', paddingVertical: 20 },
  arbitrationResultTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937', marginTop: 12, marginBottom: 8 },
  arbitrationResultDesc: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
  closeArbitrationStatusBtn: { backgroundColor: '#f3f4f6', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  closeArbitrationStatusBtnText: { fontSize: 15, color: '#6b7280', fontWeight: '500' },
  // 专家投票详情样式
  expertVotesSection: { marginTop: 20, maxHeight: 400 },
  expertVotesSectionTitle: { fontSize: 15, fontWeight: '600', color: '#1f2937', marginBottom: 12, paddingHorizontal: 20 },
  expertVotesList: { maxHeight: 350, paddingHorizontal: 20 },
  expertVoteCard: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  expertVoteHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  expertVoteInfo: { flex: 1, marginLeft: 12 },
  expertVoteNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  expertVoteName: { fontSize: 14, fontWeight: '600', color: '#1f2937' },
  expertVoteBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  expertVoteAgreeBadge: { backgroundColor: '#22c55e' },
  expertVoteDisagreeBadge: { backgroundColor: '#ef4444' },
  expertVoteBadgeText: { fontSize: 10, color: '#fff', fontWeight: '600' },
  expertVoteTitle: { fontSize: 12, color: '#6b7280' },
  expertVoteReasonBox: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 8 },
  expertVoteReasonLabel: { fontSize: 12, fontWeight: '600', color: '#6b7280', marginBottom: 4 },
  expertVoteReasonText: { fontSize: 13, color: '#374151', lineHeight: 20 },
  expertVoteTime: { fontSize: 11, color: '#9ca3af', textAlign: 'right' },
});
