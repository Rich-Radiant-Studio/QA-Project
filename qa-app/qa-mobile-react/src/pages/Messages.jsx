import { useState } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const messages = [
  {
    id: 1,
    type: 'urgent',
    priority: 'high',
    icon: 'fa-exclamation',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    title: '悬赏问题即将过期',
    content: '您发布的悬赏问题「如何在三个月内从零基础学会Python编程？」将在2小时后过期，目前有3个待采纳回答。',
    time: '5分钟前',
    actions: ['立即处理', '延长时间']
  },
  {
    id: 2,
    type: 'reply',
    priority: 'high',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg1',
    author: 'Python老司机',
    verified: true,
    title: null,
    content: '回答了您的悬赏问题，并请求您尽快采纳：「作为一个从零开始学Python的过来人，我来分享一下我的经验...」',
    time: '10分钟前',
    actions: ['查看回答', '采纳']
  },
  {
    id: 3,
    type: 'system',
    priority: 'medium',
    icon: 'fa-bell',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
    title: '账户余额提醒',
    content: '您的账户余额不足 $20，可能影响悬赏问题的发布。建议及时充值。',
    time: '30分钟前',
    actions: ['立即充值']
  },
  {
    id: 4,
    type: 'reply',
    priority: 'low',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg2',
    author: '数据分析师小王',
    verified: false,
    content: '回复了您的评论：「谢谢分享！我也是文科转行的，你的建议很有帮助~」',
    time: '1小时前'
  },
  {
    id: 5,
    type: 'like',
    priority: 'low',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=msg3',
    author: '编程新手',
    content: '赞了您的回答：「如何在三个月内从零基础学会Python编程？」',
    time: '2小时前'
  }
]

function Messages() {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = ['全部', '回复我的', '@我的', '系统']
  const priorities = ['全部', '紧急', '重要', '普通']
  const [activePriority, setActivePriority] = useState(0)

  const priorityClass = {
    high: 'urgent-high',
    medium: 'urgent-medium',
    low: 'urgent-low'
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      <div className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-bold text-lg">紧急消息</span>
          <div className="flex items-center gap-3">
            <button className="text-gray-600 text-sm">全部已读</button>
            <button className="text-gray-600"><i className="fas fa-cog"></i></button>
          </div>
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

      {/* 优先级筛选 */}
      <div className="bg-white mt-2 px-4 py-3">
        <div className="flex items-center gap-2">
          {priorities.map((p, index) => (
            <button
              key={p}
              className={`px-3 py-1.5 rounded-full text-xs flex items-center ${
                activePriority === index ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setActivePriority(index)}
            >
              {index > 0 && (
                <span className={`w-2 h-2 rounded-full mr-1 ${
                  index === 1 ? 'bg-red-500' : index === 2 ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></span>
              )}
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 消息列表 */}
      <div className="mt-2 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`bg-white ${priorityClass[msg.priority]}`}>
            <div className="px-4 py-3">
              <div className="flex items-start">
                {msg.avatar ? (
                  <img src={msg.avatar} className="w-10 h-10 rounded-full flex-shrink-0" alt="" />
                ) : (
                  <div className={`w-10 h-10 ${msg.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <i className={`fas ${msg.icon} ${msg.iconColor}`}></i>
                  </div>
                )}
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{msg.author || msg.title}</span>
                      {msg.verified && <i className="fas fa-check-circle text-blue-500 text-xs ml-1"></i>}
                      {msg.priority === 'high' && (
                        <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded">紧急</span>
                      )}
                      {msg.priority === 'medium' && (
                        <span className="ml-2 px-1.5 py-0.5 bg-yellow-500 text-white text-xs rounded">重要</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{msg.content}</p>
                  {msg.actions && (
                    <div className="flex items-center gap-2 mt-2">
                      {msg.actions.map((action, idx) => (
                        <Link
                          key={action}
                          to="/question/1"
                          className={`px-3 py-1 rounded-full text-xs ${
                            idx === 0
                              ? msg.priority === 'high' ? 'bg-primary text-white' : msg.priority === 'medium' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-600'
                              : 'border border-gray-300 text-gray-600'
                          }`}
                        >
                          {action}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}

export default Messages
