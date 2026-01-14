import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('综合');

  const searchHistory = ['Python学习', '养猫攻略', '职业规划', '数据分析'];
  
  const hotSearches = [
    { rank: 1, text: '2024年最值得学习的编程语言', tag: '热', color: 'red' },
    { rank: 2, text: '如何高效学习新技能', tag: '升', color: 'orange' },
    { rank: 3, text: '远程办公的利与弊', tag: null, color: 'yellow' },
    { rank: 4, text: '健康饮食指南', tag: null, color: 'gray' },
    { rank: 5, text: '理财入门知识', tag: null, color: 'gray' },
    { rank: 6, text: '如何提高睡眠质量', tag: null, color: 'gray' },
  ];

  const hotTopics = [
    { name: '#职场', color: 'red' },
    { name: '#科技', color: 'blue' },
    { name: '#健康', color: 'green' },
    { name: '#教育', color: 'purple' },
    { name: '#美食', color: 'orange' },
    { name: '#情感', color: 'pink' },
  ];

  const tabs = ['综合', '问题', '回答', '用户', '话题'];

  const handleSearch = (value) => {
    setSearchQuery(value);
    setIsSearching(value.length > 0);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const getRankBgColor = (rank) => {
    if (rank === 1) return 'bg-red-500';
    if (rank === 2) return 'bg-orange-500';
    if (rank === 3) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={i} className="text-red-500">{part}</span> : part
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-4">
      {/* 搜索栏 */}
      <div className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center px-3 py-2 gap-2">
          <button onClick={() => navigate(-1)} className="text-gray-600 p-2">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
            <i className="fas fa-search text-gray-400 text-sm"></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索问题、话题或用户"
              className="flex-1 bg-transparent ml-2 text-sm outline-none"
              autoFocus
            />
            {searchQuery && (
              <button className="text-gray-400" onClick={clearSearch}>
                <i className="fas fa-times-circle"></i>
              </button>
            )}
          </div>
          <button className="px-3 py-2 text-red-500 text-sm font-medium">搜索</button>
        </div>
      </div>

      {/* 搜索前：热门搜索 */}
      {!isSearching && (
        <div>
          {/* 搜索历史 */}
          <div className="bg-white mt-2 px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">搜索历史</span>
              <button className="text-gray-400 text-sm"><i className="fas fa-trash-alt"></i></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((item, index) => (
                <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm cursor-pointer"
                  onClick={() => handleSearch(item)}>{item}</span>
              ))}
            </div>
          </div>

          {/* 热门搜索 */}
          <div className="bg-white mt-2 px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">热门搜索</span>
              <button className="text-gray-400 text-sm"><i className="fas fa-sync-alt"></i> 换一批</button>
            </div>
            <div className="space-y-3">
              {hotSearches.map((item) => (
                <div key={item.rank} className="flex items-center cursor-pointer" onClick={() => handleSearch(item.text)}>
                  <span className={`w-5 h-5 ${getRankBgColor(item.rank)} text-white text-xs rounded flex items-center justify-center font-bold`}>
                    {item.rank}
                  </span>
                  <span className="ml-3 text-sm flex-1">{item.text}</span>
                  {item.tag && (
                    <span className={`text-xs text-${item.color}-500`}>
                      <i className={`fas fa-${item.tag === '热' ? 'fire' : 'arrow-up'}`}></i> {item.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 热门话题 */}
          <div className="bg-white mt-2 px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">热门话题</span>
              <button className="text-red-500 text-sm">查看更多</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {hotTopics.map((topic, index) => (
                <span key={index} className={`px-3 py-1.5 bg-${topic.color}-50 text-${topic.color}-500 rounded-full text-sm cursor-pointer`}>
                  {topic.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 搜索后：搜索结果 */}
      {isSearching && (
        <div>
          {/* 结果标签 */}
          <div className="bg-white sticky top-14 z-40 border-b border-gray-100">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-3 text-sm ${activeTab === tab ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 搜索结果列表 */}
          <div className="mt-2 space-y-2">
            {/* 问题结果 */}
            <div className="bg-white px-4 py-3">
              <div className="flex items-center mb-2">
                <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full">悬赏 $50</span>
                <span className="ml-2 text-xs text-gray-400">56 回答</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900">
                如何在三个月内从零基础学会{highlightText('Python', searchQuery)}编程？
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                本人是一名文科生，之前完全没有接触过编程。最近想转行做数据分析，听说Python是必备技能...
              </p>
              <div className="flex items-center gap-3 mt-2">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" className="w-5 h-5 rounded-full" alt="" />
                <span className="text-xs text-gray-400">张三丰 · 2小时前</span>
              </div>
            </div>

            {/* 用户结果 */}
            <div className="bg-white px-4 py-3">
              <div className="flex items-center">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=python" className="w-12 h-12 rounded-full" alt="" />
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{highlightText('Python', searchQuery)}老司机</span>
                    <i className="fas fa-check-circle text-blue-500 text-xs ml-1"></i>
                  </div>
                  <p className="text-xs text-gray-400">资深{highlightText('Python', searchQuery)}开发 · 1.2k 粉丝</p>
                </div>
                <button className="px-3 py-1 border border-red-500 text-red-500 rounded-full text-sm">+ 关注</button>
              </div>
            </div>

            {/* 话题结果 */}
            <div className="bg-white px-4 py-3">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-code text-blue-500 text-xl"></i>
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="font-medium text-sm">#{highlightText('Python', searchQuery)}学习</h4>
                  <p className="text-xs text-gray-400">8.5万 关注 · 3.2万 问题</p>
                </div>
                <button className="px-3 py-1 border border-red-500 text-red-500 rounded-full text-sm">+ 关注</button>
              </div>
            </div>

            {/* 更多问题结果 */}
            <div className="bg-white px-4 py-3">
              <div className="flex items-center mb-2">
                <span className="px-2 py-0.5 bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs rounded-full">免费</span>
                <span className="ml-2 text-xs text-gray-400">89 回答</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900">{highlightText('Python', searchQuery)}和Java哪个更适合初学者？</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">想学编程但不知道选哪门语言，听说Python简单易学，但Java就业面更广...</p>
            </div>

            <div className="bg-white px-4 py-3">
              <div className="flex items-center mb-2">
                <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full">悬赏 $30</span>
                <span className="ml-2 text-xs text-gray-400">34 回答</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900">学{highlightText('Python', searchQuery)}需要什么基础？数学不好能学吗？</h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">高中数学就不太好，现在想学Python做数据分析，担心学不会...</p>
            </div>
          </div>

          {/* 加载更多 */}
          <div className="py-4 text-center">
            <button className="text-red-500 text-sm">加载更多 <i className="fas fa-chevron-down ml-1"></i></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
