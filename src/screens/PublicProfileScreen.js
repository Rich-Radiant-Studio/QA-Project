import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../i18n/useTranslation';
import ProfileHeader from '../components/ProfileHeader';
import PublicProfileHeader from '../components/PublicProfileHeader';
import ContentTabs from '../components/ContentTabs';
import ContentCard from '../components/ContentCard';

/**
 * @typedef {Object} UserVerification
 * @property {'none' | 'personal' | 'enterprise' | 'government'} type - 认证类型
 * @property {boolean} verified - 是否已认证
 * @property {string | null} verifiedAt - 认证时间
 * @property {string} verificationText - 认证信息文字
 */

/**
 * @typedef {Object} UserMCN
 * @property {boolean} hasMcn - 是否有MCN
 * @property {string | null} mcnName - MCN名称
 * @property {string | null} mcnId - MCN ID
 */

/**
 * @typedef {Object} UserStats
 * @property {number} followingCount - 关注数
 * @property {number} followersCount - 粉丝数
 * @property {number} likesCount - 获赞数
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id - 用户ID
 * @property {string} username - 用户名
 * @property {string} avatar - 头像URL
 * @property {string} bio - 用户简介
 * @property {string} location - 地区
 * @property {string} occupation - 职业
 * @property {'male' | 'female' | 'other' | null} gender - 性别
 * @property {UserVerification} verification - 认证信息
 * @property {string[]} tags - 用户标签
 * @property {UserMCN} mcn - MCN信息
 * @property {UserStats} stats - 统计数据
 * @property {number} influence - 影响力
 * @property {number} wisdomIndex - 智慧指数
 */

/**
 * @typedef {Object} ContentItem
 * @property {string} id - 内容ID
 * @property {'article' | 'video' | 'micropost' | 'repost'} type - 内容类型
 * @property {string} createdAt - 创建时间
 * @property {string} [title] - 标题（文章/视频）
 * @property {string} [coverImage] - 封面图（文章）
 * @property {string} [summary] - 摘要（文章）
 * @property {string} [videoUrl] - 视频URL
 * @property {number} [videoDuration] - 视频时长（秒）
 * @property {string} [videoThumbnail] - 视频缩略图
 * @property {string} [content] - 内容文字（微头条）
 * @property {string[]} [images] - 配图（微头条）
 * @property {ContentItem} [originalContent] - 原内容（转发）
 * @property {string} [repostComment] - 转发评论
 * @property {number} viewsCount - 浏览数
 * @property {number} commentsCount - 评论数
 * @property {number} likesCount - 点赞数
 * @property {number} sharesCount - 分享数
 * @property {number} collectsCount - 收藏数
 */

/**
 * @typedef {Object} ShowcaseItem
 * @property {string} id - 橱窗ID
 * @property {string} title - 标题
 * @property {string} coverImage - 封面图
 * @property {string} description - 描述
 * @property {'product' | 'content' | 'course'} type - 类型
 * @property {number} [price] - 价格
 */

/**
 * 可分享用户主页组件
 * @param {Object} props
 * @param {Object} props.navigation - 导航对象
 * @param {Object} props.route - 路由对象
 * @param {Object} props.route.params - 路由参数
 * @param {string} props.route.params.userId - 用户ID
 */
export default function PublicProfileScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { userId } = route.params;

  // 用户数据状态
  const [userData, setUserData] = useState(/** @type {UserProfile | null} */ (null));
  
  // 橱窗数据状态
  const [showcaseData, setShowcaseData] = useState(/** @type {ShowcaseItem[]} */ ([]));
  
  // 内容数据状态
  const [contentData, setContentData] = useState(/** @type {ContentItem[]} */ ([]));
  const [activeTab, setActiveTab] = useState(/** @type {'all' | 'articles' | 'videos' | 'microposts' | 'reposts'} */ ('all'));
  
  // 加载状态
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // 错误状态
  const [error, setError] = useState(/** @type {string | null} */ (null));
  
  // 关注状态
  const [isFollowing, setIsFollowing] = useState(false);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);

  // 加载用户数据
  useEffect(() => {
    loadUserData();
  }, [userId]);

  /**
   * 加载用户数据
   */
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: 实现API调用
      // const response = await getUserPublicProfile(userId);
      // setUserData(response.data);
      
      // 模拟数据（临时）
      setTimeout(() => {
        setUserData({
          id: userId,
          username: '张三',
          avatar: 'https://via.placeholder.com/100',
          coverImage: 'https://fakeimg.pl/800x400/0066cc/ffffff/?text=分享前沿话题+了解国际战略+回顾经典战例&font=noto', // 带文字的背景图
          bio: '分享前沿话题，了解国际战略，回顾经典战例',
          location: '四川',
          occupation: '军事学博士',
          gender: 'male',
          verification: {
            type: 'personal',
            verified: true,
            verifiedAt: '2024-01-01',
            verificationText: '联合国军事观察员 军事学博士',
          },
          tags: ['军事学博士', '主要研究领域为军事思想', '军事历史', '军事文化'],
          mcn: {
            hasMcn: true,
            mcnName: '慕容智造',
            mcnId: 'mcn123',
          },
          stats: {
            likesCount: 3500, // 点赞 3.5K
            followersCount: 1200, // 粉丝 1.2K
            followingCount: 128, // 关注 128
            friendsCount: 56, // 朋友 56
          },
          influence: 95,
          wisdomIndex: 88,
        });
        
        // 加载模拟内容数据
        loadContentData('all');
        
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message || '加载失败');
      setIsLoading(false);
    }
  };

  /**
   * 加载内容数据
   */
  const loadContentData = async (tab = activeTab, page = 1) => {
    try {
      if (page === 1) {
        setContentData([]);
      } else {
        setIsLoadingMore(true);
      }
      
      // TODO: 实现API调用
      // const response = await getUserContents(userId, tab, page);
      
      // 模拟数据
      setTimeout(() => {
        const mockData = [
          {
            id: '1',
            type: 'article',
            title: '歼-35战机模型遭老外曝光，此人身份曝光，已被中方制裁',
            summary: '目前，一张照片在海外社交媒体上引起讨论。一个...',
            coverImage: 'https://via.placeholder.com/400x200',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            viewsCount: 15000,
            commentsCount: 1,
            likesCount: 22,
            sharesCount: 4,
            collectsCount: 8,
          },
          {
            id: '2',
            type: 'micropost',
            content: '中东"三小强"打算调停美伊，提出5大条款，不如姐任伊朗直接美援',
            images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            commentsCount: 5,
            likesCount: 7,
            sharesCount: 2,
            collectsCount: 3,
          },
        ];
        
        if (page === 1) {
          setContentData(mockData);
        } else {
          setContentData([...contentData, ...mockData]);
        }
        
        setHasMore(page < 3); // 模拟只有3页
        setIsLoadingMore(false);
        setCurrentPage(page);
      }, 800);
    } catch (err) {
      console.error('Load content failed:', err);
      setIsLoadingMore(false);
    }
  };

  /**
   * 重试加载
   */
  const handleRetry = () => {
    loadUserData();
  };

  /**
   * 返回上一页
   */
  const handleGoBack = () => {
    navigation.goBack();
  };

  /**
   * 处理统计数据点击
   * @param {'following' | 'followers' | 'likes'} type
   */
  const handleStatPress = (type) => {
    switch (type) {
      case 'following':
        // TODO: 导航到关注列表
        console.log('Navigate to following list');
        break;
      case 'followers':
        // TODO: 导航到粉丝列表
        console.log('Navigate to followers list');
        break;
      case 'likes':
        // TODO: 显示获赞详情
        console.log('Show likes detail');
        break;
    }
  };

  /**
   * 处理分享
   */
  const handleShare = () => {
    // TODO: 实现分享功能
    console.log('Share profile');
  };

  /**
   * 处理关注/取消关注
   * @param {boolean} follow - true表示关注，false表示取消关注
   */
  const handleFollowPress = async (follow) => {
    try {
      // TODO: 调用API
      // await followUser(userId, follow);
      setIsFollowing(follow);
      console.log(follow ? 'Followed user' : 'Unfollowed user');
    } catch (err) {
      console.error('Follow action failed:', err);
    }
  };

  /**
   * 处理发私信
   */
  const handleMessagePress = () => {
    // TODO: 导航到私信页面
    console.log('Navigate to messages');
  };

  /**
   * 处理需要登录
   */
  const handleLoginRequired = () => {
    // TODO: 导航到登录页面
    console.log('Navigate to login');
  };

  /**
   * 检查是否是自己的主页
   */
  const isOwnProfile = () => {
    // TODO: 实现检查逻辑
    // return currentUserId === userId;
    return false;
  };

  /**
   * 处理标签切换
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    loadContentData(tab, 1);
  };

  /**
   * 处理搜索
   */
  const handleSearchPress = () => {
    console.log('Search in user content');
  };

  /**
   * 处理音频
   */
  const handleAudioPress = () => {
    console.log('Audio mode');
  };

  /**
   * 处理内容卡片点击
   */
  const handleContentPress = (item) => {
    console.log('Navigate to content detail:', item.type, item.id);
    // TODO: 根据类型导航到不同的详情页面
  };

  /**
   * 处理加载更多
   */
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadContentData(activeTab, currentPage + 1);
    }
  };

  /**
   * 处理下拉刷新
   */
  const handleRefresh = () => {
    loadUserData();
  };

  // 加载中状态
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 错误状态
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 用户不存在
  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="person-outline" size={48} color="#9ca3af" />
          <Text style={styles.errorMessage}>{t('profile.userNotFound')}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleGoBack}>
            <Text style={styles.retryButtonText}>{t('common.goBack')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <PublicProfileHeader 
        bio={userData.bio} 
        onBack={handleGoBack}
        onShare={handleShare}
      />
      
      <FlatList
        data={contentData}
        renderItem={({ item }) => (
          <ContentCard 
            item={item} 
            userData={userData}
            onPress={handleContentPress}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <>
            {/* 用户信息头部 */}
            <ProfileHeader 
              userData={userData} 
              onStatPress={handleStatPress}
              isFollowing={isFollowing}
              onFollowPress={handleFollowPress}
              isOwnProfile={isOwnProfile()}
            />
            
            {/* 内容标签栏 */}
            <ContentTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onSearchPress={handleSearchPress}
              onAudioPress={handleAudioPress}
            />
          </>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('profile.noContent')}</Text>
          </View>
        )}
        ListFooterComponent={() => {
          if (isLoadingMore) {
            return (
              <View style={styles.footerContainer}>
                <ActivityIndicator size="small" color="#ef4444" />
              </View>
            );
          }
          if (!hasMore && contentData.length > 0) {
            return (
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>{t('common.noMoreContent')}</Text>
              </View>
            );
          }
          return null;
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={['#ef4444']}
            tintColor="#ef4444"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorMessage: {
    marginTop: 12,
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  footerContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
  },
});
