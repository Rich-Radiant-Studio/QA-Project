import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

const mockQuestion = {
  id: 1,
  author: '张三丰',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
  type: 'reward',
  reward: 50,
  time: '2小时前',
  location: '北京',
  title: '如何在三个月内从零基础学会Python编程？有没有系统的学习路线推荐？',
  content: '本人是一名文科生，之前完全没有接触过编程。最近想转行做数据分析，听说Python是必备技能。\n\n想请教各位大神：\n1. 零基础学Python需要多长时间？\n2. 有没有推荐的学习路线或者教程？\n3. 需要买什么书或者报什么课程吗？',
  image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=300&fit=crop',
  tags: ['Python学习', '编程入门', '转行'],
  solvedRate: 65,
  likes: 128,
  answers: 56,
  views: 1200,
  favorites: 89
}

const mockAnswers = [
  {
    id: 1,
    author: 'Python老司机',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer1',
    verified: true,
    title: '资深Python开发 · 10年经验',
    adopted: true,
    content: '作为一个从零开始学Python的过来人，我来分享一下我的经验：\n\n1. 学习时间：如果每天能保证2-3小时的学习时间，3个月完全可以入门并做一些简单的项目。\n\n2. 学习路线：\n- 第1个月：Python基础语法、数据类型、函数、面向对象\n- 第2个月：常用库（NumPy、Pandas）、数据处理\n- 第3个月：实战项目、数据可视化\n\n3. 推荐资源：廖雪峰的Python教程（免费）、《Python编程从入门到实践》',
    likes: 256,
    dislikes: 3,
    comments: 23,
    time: '1小时前'
  },
  {
    id: 2,
    author: '数据分析师小王',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=answer2',
    verified: false,
    title: '数据分析师 · 3年经验',
    adopted: false,
    content: '我也是文科转行的，现在在做数据分析。给你几点建议：\n\n1. 不要一开始就啃书，先跟着视频教程敲代码\n2. 多做项目，边学边练\n3. 加入一些学习群，有问题可以随时问',
    likes: 89,
    dislikes: 1,
    comments: 12,
    time: '30分钟前'
  }
]

function QuestionDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState(0)
  const answerTabs = ['全部回答 (56)', '精选回答', '最新']

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      {/* 顶部导航 */}
      <div className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-gray-600">
            <i className="fas fa-arrow-left text-lg"></i>
          </Link>
          <span className="font-medium">问题详情</span>
          <div className="flex items-center gap-3">
            <button className="text-gray-600"><i className="fas fa-share-alt"></i></button>
            <button className="text-gray-600"><i className="fas fa-ellipsis-h"></i></button>
          </div>
        </div>
      </div>

      {/* 问题内容 */}
      <div className="bg-white">
        <div className="flex items-center px-4 pt-4 pb-3">
          <img src={mockQuestion.avatar} className="w-12 h-12 rounded-full" alt="" />
          <div className="ml-3 flex-1">
            <div className="flex items-center">
              <span className="font-medium">{mockQuestion.author}</span>
              <span className="question-type-reward text-white text-xs px-2 py-0.5 rounded-full ml-2">
                悬赏 ${mockQuestion.reward}
              </span>
            </div>
            <span className="text-xs text-gray-400">{mockQuestion.time} · {mockQuestion.location}</span>
          </div>
          <button className="px-4 py-1.5 border border-primary text-primary rounded-full text-sm">+ 关注</button>
        </div>

        <div className="px-4 pb-3">
          <h1 className="text-lg font-bold text-gray-900 leading-relaxed">{mockQuestion.title}</h1>
        </div>

        <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {mockQuestion.content}
        </div>

        <div className="px-4 pb-4">
          <img src={mockQuestion.image} className="w-full h-48 object-cover rounded-lg" alt="" />
        </div>

        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {mockQuestion.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">#{tag}</span>
          ))}
        </div>

        {/* 解决率 */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-primary font-medium">已解决 {mockQuestion.solvedRate}%</span>
            <span className="text-blue-500 font-medium">未解决 {100 - mockQuestion.solvedRate}%</span>
          </div>
          <div className="relative flex h-3 rounded-full overflow-hidden bg-gray-100">
            <div className="bg-primary h-full" style={{ width: `${mockQuestion.solvedRate}%` }}></div>
            <div className="bg-blue-500 h-full" style={{ width: `${100 - mockQuestion.solvedRate}%` }}></div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-3">
            <button className="flex items-center gap-1 px-4 py-2 bg-red-50 text-primary rounded-full text-sm">
              <i className="fas fa-check-circle"></i> 已解决
            </button>
            <button className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-500 rounded-full text-sm">
              <i className="fas fa-times-circle"></i> 未解决
            </button>
          </div>
        </div>

        {/* 互动数据 */}
        <div className="flex items-center justify-around px-4 py-3 border-t border-gray-100">
          <div className="text-center">
            <div className="font-bold text-gray-900">{mockQuestion.likes}</div>
            <div className="text-xs text-gray-500">点赞</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900">{mockQuestion.answers}</div>
            <div className="text-xs text-gray-500">回答</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900">{mockQuestion.views}</div>
            <div className="text-xs text-gray-500">浏览</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900">{mockQuestion.favorites}</div>
            <div className="text-xs text-gray-500">收藏</div>
          </div>
        </div>
      </div>

      {/* 回答区域 */}
      <div className="mt-2 bg-white">
        <div className="flex items-center border-b border-gray-100">
          {answerTabs.map((tab, index) => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm ${activeTab === index ? 'text-primary border-b-2 border-primary font-medium' : 'text-gray-500'}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-100">
          {mockAnswers.map((answer) => (
            <div key={answer.id} className={`p-4 ${answer.adopted ? 'bg-red-50/30' : ''}`}>
              <div className="flex items-center mb-3">
                <img src={answer.avatar} className="w-10 h-10 rounded-full" alt="" />
                <div className="ml-3 flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{answer.author}</span>
                    {answer.verified && <i className="fas fa-check-circle text-blue-500 text-xs ml-1"></i>}
                    {answer.adopted && <span className="bg-primary text-white text-xs px-2 py-0.5 rounded ml-2">已采纳</span>}
                  </div>
                  <span className="text-xs text-gray-400">{answer.title}</span>
                </div>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{answer.content}</div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <button className={`flex items-center text-sm ${answer.adopted ? 'text-primary' : 'text-gray-500'}`}>
                    <i className={`${answer.adopted ? 'fas' : 'far'} fa-thumbs-up mr-1`}></i>
                    <span>{answer.likes}</span>
                  </button>
                  <button className="flex items-center text-gray-500 text-sm">
                    <i className="far fa-thumbs-down mr-1"></i><span>{answer.dislikes}</span>
                  </button>
                  <button className="flex items-center text-gray-500 text-sm">
                    <i className="far fa-comment mr-1"></i><span>{answer.comments}</span>
                  </button>
                </div>
                <span className="text-xs text-gray-400">{answer.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center px-4 py-2 gap-2">
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
            <input type="text" placeholder="写回答..." className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <button className="p-2 text-gray-500"><i className="far fa-heart text-xl"></i></button>
          <button className="p-2 text-gray-500"><i className="far fa-bookmark text-xl"></i></button>
          <button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">回答</button>
        </div>
      </div>
    </div>
  )
}

export default QuestionDetail
