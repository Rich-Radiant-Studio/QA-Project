import { useState } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const userInfo = {
  name: '张三丰',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=myuser',
  verified: true,
  level: 5,
  id: '12345678',
  bio: '热爱学习，乐于分享。专注Python、数据分析领域。',
  location: '北京',
  job: '数据分析师',
  following: 128,
  followers: 1200,
  questions: 56,
  answers: 234,
  likes: 8900,
  balance: 256.50
}

const myQuestions = [
  { id: 1, type: 'reward', reward: 50, title: '如何在三个月内从零基础学会Python编程？', time: '2小时前', views: 1200, comments: 56, likes: 128 },
  { id: 2, type: 'free', solved: true, title: '第一次养猫需要准备什么？', time: '昨天', views: 2500, comments: 89, likes: 256 },
  { id: 3, type: 'reward', reward: 100, title: '35岁程序员如何规划职业发展？', time: '3天前', views: 5600, comments: 456, likes: 1200 }
]

const menuItems = [
  { icon: 'fa-star', color: 'text-yellow-500', label: '我的收藏', count: 89 },
  { icon: 'fa-history', color: 'text-blue-500', label: '浏览历史' },
  { icon: 'fa-file-alt', color: 'text-green-500', label: '我的草稿', count: 3 },
  { icon: 'fa-users', color: 'text-purple-500', label: '我的群聊', count: 5 }
]

const settingItems = [
  { icon: 'fa-shield-alt', label: '账号与安全' },
  { icon: 'fa-bell', label: '消息通知' },
  { icon: 'fa-lock', label: '隐私设置' },
  { icon: 'fa-question-circle', label: '帮助与反馈' },
  { icon: 'fa-info-circle', label: '关于我们' }
]

function Profile() {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = ['我的提问', '我的回答', '获得赞同']

  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      {/* 顶部背景 */}
      <div className="bg-gradient-to-b from-primary to-red-400 pt-10 pb-20 px-4 relative">
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <button className="text-white"><i className="fas fa-share-alt"></i></button>
          <button className="text-white"><i className="fas fa-cog"></i></button>
        </div>
      </div>

      {/* 用户信息卡片 */}
      <div className="bg-white mx-4 -mt-16 rounded-xl shadow-sm relative z-10">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-start">
            <img src={userInfo.avatar} className="w-20 h-20 rounded-full border-4 border-white shadow-lg -mt-12" alt="" />
            <div className="ml-4 flex-1 pt-2">
              <div className="flex items-center">
                <span className="font-bold text-lg">{userInfo.name}</span>
                {userInfo.verified && <i className="fas fa-check-circle text-blue-500 ml-1"></i>}
                <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-600 text-xs rounded">Lv.{userInfo.level}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">ID: {userInfo.id}</p>
            </div>
            <button className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-600">编辑资料</button>
          </div>
          <p className="text-sm text-gray-600 mt-3">{userInfo.bio}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span><i className="fas fa-map-marker-alt mr-1"></i>{userInfo.location}</span>
            <span><i className="fas fa-briefcase mr-1"></i>{userInfo.job}</span>
          </div>
        </div>

        <div className="flex items-center justify-around py-4 border-t border-gray-100">
          <div className="text-center">
            <div className="font-bold text-lg">{userInfo.following}</div>
            <div className="text-xs text-gray-500">关注</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{userInfo.followers >= 1000 ? `${(userInfo.followers / 1000).toFixed(1)}k` : userInfo.followers}</div>
            <div className="text-xs text-gray-500">粉丝</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{userInfo.questions}</div>
            <div className="text-xs text-gray-500">提问</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{userInfo.answers}</div>
            <div className="text-xs text-gray-500">回答</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{userInfo.likes >= 1000 ? `${(userInfo.likes / 1000).toFixed(1)}k` : userInfo.likes}</div>
            <div className="text-xs text-gray-500">获赞</div>
          </div>
        </div>
      </div>

      {/* 钱包卡片 */}
      <div className="bg-white mx-4 mt-3 rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fas fa-wallet text-yellow-500"></i>
            </div>
            <div className="ml-3">
              <div className="text-sm text-gray-500">我的钱包</div>
              <div className="font-bold text-lg">${userInfo.balance.toFixed(2)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-primary text-white rounded-full text-sm">充值</button>
            <button className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-full text-sm">提现</button>
          </div>
        </div>
      </div>

      {/* 功能菜单 */}
      <div className="bg-white mx-4 mt-3 rounded-xl shadow-sm divide-y divide-gray-100">
        {menuItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <i className={`fas ${item.icon} ${item.color} w-6`}></i>
              <span className="ml-3 text-sm">{item.label}</span>
            </div>
            <div className="flex items-center text-gray-400">
              {item.count && <span className="text-sm">{item.count}</span>}
              <i className="fas fa-chevron-right ml-2 text-xs"></i>
            </div>
          </div>
        ))}
      </div>

      {/* 我的内容 */}
      <div className="bg-white mx-4 mt-3 rounded-xl shadow-sm">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`flex-1 py-3 text-sm ${activeTab === index ? 'text-primary border-b-2 border-primary font-semibold' : 'text-gray-500'}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-100">
          {myQuestions.map((q) => (
            <Link key={q.id} to={`/question/${q.id}`} className="block px-4 py-3">
              <div className="flex items-center mb-1">
                <span className={`px-2 py-0.5 ${q.type === 'reward' ? 'question-type-reward' : 'question-type-free'} text-white text-xs rounded-full`}>
                  {q.type === 'reward' ? `悬赏 $${q.reward}` : '免费'}
                </span>
                {q.solved && <span className="ml-2 text-xs text-green-500">已解决</span>}
                <span className="ml-2 text-xs text-gray-400">{q.time}</span>
              </div>
              <h4 className="text-sm font-medium">{q.title}</h4>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span><i className="far fa-eye mr-1"></i>{q.views >= 1000 ? `${(q.views / 1000).toFixed(1)}k` : q.views}</span>
                <span><i className="far fa-comment mr-1"></i>{q.comments}</span>
                <span><i className="far fa-thumbs-up mr-1"></i>{q.likes >= 1000 ? `${(q.likes / 1000).toFixed(1)}k` : q.likes}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="py-3 text-center border-t border-gray-100">
          <button className="text-primary text-sm">查看全部 <i className="fas fa-chevron-right ml-1"></i></button>
        </div>
      </div>

      {/* 设置菜单 */}
      <div className="bg-white mx-4 mt-3 rounded-xl shadow-sm divide-y divide-gray-100">
        {settingItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <i className={`fas ${item.icon} text-gray-500 w-6`}></i>
              <span className="ml-3 text-sm">{item.label}</span>
            </div>
            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
          </div>
        ))}
      </div>

      <div className="h-6"></div>

      <BottomNav />
    </div>
  )
}

export default Profile
