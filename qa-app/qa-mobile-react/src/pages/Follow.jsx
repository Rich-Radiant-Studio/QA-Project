import { useState } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const followedUsers = [
  { id: 1, name: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow1', gradient: 'from-red-500 to-orange-500' },
  { id: 2, name: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow2', gradient: 'from-blue-500 to-purple-500' },
  { id: 3, name: '美食达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow3', gradient: 'from-green-500 to-teal-500' },
  { id: 4, name: '程序员小明', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow4', gradient: '' },
]

const dynamics = [
  {
    id: 1,
    user: { name: 'Python老司机', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow1', verified: true },
    action: '回答了问题',
    time: '30分钟前',
    question: { type: 'reward', reward: 50, title: '如何在三个月内从零基础学会Python编程？' },
    content: '作为一个从零开始学Python的过来人，我来分享一下我的经验：如果每天能保证2-3小时的学习时间，3个月完全可以入门...',
    likes: 256,
    comments: 23
  },
  {
    id: 2,
    user: { name: '王医生', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=follow2', verified: true },
    action: '提出了问题',
    time: '1小时前',
    question: { type: 'free', title: '作为医生，如何平衡工作和生活？有没有同行分享一下经验？' },
    solvedRate: 25,
    likes: 89,
    comments: 12
  }
]

function Follow() {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = ['动态', '用户', '话题']

  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      <div className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-bold text-lg">关注</span>
          <button className="text-gray-600"><i className="fas fa-search text-lg"></i></button>
        </div>
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
      </div>

      {/* 关注的用户 */}
      <div className="bg-white mt-2 py-3">
        <div className="flex items-center overflow-x-auto hide-scrollbar px-4 gap-4">
          {followedUsers.map((user) => (
            <div key={user.id} className="flex flex-col items-center flex-shrink-0">
              <div className={`w-14 h-14 rounded-full ${user.gradient ? `bg-gradient-to-r ${user.gradient}` : 'bg-gray-200'} p-0.5`}>
                <img src={user.avatar} className="w-full h-full rounded-full border-2 border-white" alt="" />
              </div>
              <span className="text-xs mt-1 text-gray-600 w-14 text-center truncate">{user.name}</span>
            </div>
          ))}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
              <i className="fas fa-plus text-gray-400"></i>
            </div>
            <span className="text-xs mt-1 text-gray-400">发现更多</span>
          </div>
        </div>
      </div>

      {/* 动态列表 */}
      <div className="mt-2 space-y-2">
        {dynamics.map((item) => (
          <Link key={item.id} to="/question/1" className="block bg-white">
            <div className="flex items-center px-4 pt-4 pb-2">
              <img src={item.user.avatar} className="w-10 h-10 rounded-full" alt="" />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <span className="font-medium text-sm">{item.user.name}</span>
                  {item.user.verified && <i className="fas fa-check-circle text-blue-500 text-xs ml-1"></i>}
                </div>
                <span className="text-xs text-gray-400">{item.action} · {item.time}</span>
              </div>
              <button className="text-gray-400"><i className="fas fa-ellipsis-h"></i></button>
            </div>
            <div className="px-4 pb-3">
              {item.question && (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center mb-1">
                    <span className={`${item.question.type === 'reward' ? 'question-type-reward' : 'question-type-free'} text-white text-xs px-2 py-0.5 rounded-full`}>
                      {item.question.type === 'reward' ? `悬赏 $${item.question.reward}` : '免费'}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{item.question.title}</h3>
                </div>
              )}
              {item.content && (
                <p className="text-sm text-gray-700 leading-relaxed">{item.content}</p>
              )}
              {item.solvedRate !== undefined && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-primary font-medium">已解决 {item.solvedRate}%</span>
                    <span className="text-blue-500 font-medium">未解决 {100 - item.solvedRate}%</span>
                  </div>
                  <div className="relative flex h-2 rounded-full overflow-hidden bg-gray-100">
                    <div className="bg-primary h-full" style={{ width: `${item.solvedRate}%` }}></div>
                    <div className="bg-blue-500 h-full" style={{ width: `${100 - item.solvedRate}%` }}></div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
              <div className="flex items-center gap-4">
                <span className="flex items-center text-gray-500 text-sm">
                  <i className="far fa-thumbs-up mr-1"></i>{item.likes}
                </span>
                <span className="flex items-center text-gray-500 text-sm">
                  <i className="far fa-comment mr-1"></i>{item.comments}
                </span>
              </div>
              {item.content ? (
                <span className="text-primary text-sm">查看完整回答</span>
              ) : (
                <button className="bg-primary text-white text-sm px-3 py-1 rounded-full">
                  <i className="fas fa-pen mr-1"></i>回答
                </button>
              )}
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}

export default Follow
