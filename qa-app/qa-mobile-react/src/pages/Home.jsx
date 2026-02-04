import { useState } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import QuestionCard from '../components/QuestionCard'

const tabs = ['推荐', '热榜', '同城', '国家', '行业', '个人', '职场', '教育']

const mockQuestions = [
  {
    id: 1,
    author: '张三丰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    verified: false,
    type: 'reward',
    reward: 50,
    time: '2小时前',
    title: '如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？',
    images: ['https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop'],
    solvedRate: 65,
    likes: 128,
    dislikes: 12,
    comments: 56
  },
  {
    id: 2,
    author: '李小龙',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    verified: false,
    type: 'free',
    time: '5小时前',
    title: '第一次养猫需要准备什么？有哪些新手容易踩的坑？',
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=200&h=200&fit=crop'
    ],
    solvedRate: 80,
    likes: 256,
    dislikes: 8,
    comments: 89
  },
  {
    id: 3,
    author: '王医生',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
    verified: true,
    type: 'targeted',
    time: '昨天 18:30',
    title: '长期失眠应该怎么调理？吃褪黑素有用吗？求专业医生解答',
    images: [],
    solvedRate: 45,
    likes: 512,
    dislikes: 5,
    comments: 234
  },
  {
    id: 4,
    author: '程序员小明',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4',
    verified: false,
    type: 'reward',
    reward: 100,
    time: '3小时前',
    title: '35岁程序员如何规划职业发展？是继续技术深耕还是转管理？',
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop'],
    solvedRate: 30,
    likes: 1200,
    dislikes: 23,
    comments: 456
  }
]

function Home() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      {/* 顶部搜索栏 */}
      <div className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center px-3 py-2 gap-2">
          <Link to="/search" className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-2">
            <i className="fas fa-search text-gray-400 text-sm"></i>
            <span className="flex-1 ml-2 text-sm text-gray-400">搜索问题、话题或用户</span>
          </Link>
          <Link to="/search" className="px-3 py-2 text-primary text-sm font-medium">搜索</Link>
          <Link to="/messages" className="relative p-2">
            <i className="fas fa-bell text-gray-600 text-lg"></i>
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Link>
          <Link to="/publish" className="bg-primary text-white px-3 py-1.5 rounded-full text-sm font-medium">
            <i className="fas fa-plus mr-1"></i>发布
          </Link>
        </div>
      </div>

      {/* 标签栏 */}
      <div className="bg-white sticky top-14 z-40 border-b border-gray-100">
        <div className="flex items-center overflow-x-auto hide-scrollbar">
          <div className="flex px-2 py-2 gap-1">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm whitespace-nowrap ${
                  activeTab === index
                    ? 'text-primary border-b-2 border-primary font-semibold'
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="px-3 py-2 border-l border-gray-100 bg-white">
            <i className="fas fa-bars text-gray-500"></i>
          </button>
        </div>
      </div>

      {/* 问题列表 */}
      <div className="px-3 py-3 space-y-3">
        {mockQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>

      <BottomNav />
    </div>
  )
}

export default Home
