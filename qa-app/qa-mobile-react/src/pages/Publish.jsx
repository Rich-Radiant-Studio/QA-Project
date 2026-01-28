import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const questionTypes = [
  { id: 'free', icon: 'fa-gift', name: '公开问题', desc: '公开提问' },
  { id: 'reward', icon: 'fa-coins', name: '悬赏问题', desc: '付费求答' },
  { id: 'targeted', icon: 'fa-bullseye', name: '定向问题', desc: '指定回答' }
]

const rewardAmounts = [10, 20, 50, 100]
const topics = ['职场', '教育', '科技', '生活', '健康', '情感', '理财', '美食']

function Publish() {
  const navigate = useNavigate()
  const [type, setType] = useState('free')
  const [reward, setReward] = useState(0)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [selectedTopics, setSelectedTopics] = useState([])
  const [anonymous, setAnonymous] = useState(false)

  const toggleTopic = (topic) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  const handlePublish = () => {
    if (title.length < 5) {
      alert('请输入至少5个字的问题标题')
      return
    }
    alert('发布成功！')
    navigate('/')
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* 顶部导航 */}
      <div className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-gray-600">
            <i className="fas fa-times text-xl"></i>
          </Link>
          <span className="font-medium">发布问题</span>
          <button className="text-primary font-medium">存草稿</button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 问题类型 */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-3">选择问题类型</h3>
          <div className="grid grid-cols-3 gap-3">
            {questionTypes.map((item) => (
              <div
                key={item.id}
                className={`border-2 rounded-xl p-3 text-center cursor-pointer ${
                  type === item.id ? 'border-primary bg-red-50' : 'border-gray-200'
                }`}
                onClick={() => setType(item.id)}
              >
                <div className={`text-2xl mb-1 ${type === item.id ? 'text-primary' : 'text-gray-400'}`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-gray-400">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 悬赏金额 */}
        {type === 'reward' && (
          <div className="bg-white rounded-xl p-4">
            <h3 className="font-medium text-gray-900 mb-3">设置悬赏金额</h3>
            <div className="grid grid-cols-4 gap-2">
              {rewardAmounts.map((amount) => (
                <button
                  key={amount}
                  className={`py-2 border rounded-lg text-sm ${
                    reward === amount ? 'bg-primary text-white border-primary' : 'border-gray-200'
                  }`}
                  onClick={() => setReward(amount)}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-gray-500">自定义金额：</span>
              <input
                type="number"
                placeholder="输入金额"
                className="flex-1 ml-2 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
                onChange={(e) => setReward(Number(e.target.value))}
              />
              <span className="ml-2 text-gray-500">$</span>
            </div>
          </div>
        )}

        {/* 问题标题 */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-3">问题标题</h3>
          <input
            type="text"
            placeholder="请输入问题标题（5-50字）"
            className="w-full px-3 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
            maxLength={50}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="text-right text-xs text-gray-400 mt-1">{title.length}/50</div>
        </div>

        {/* 问题描述 */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-3">问题描述</h3>
          <textarea
            placeholder="详细描述你的问题，让回答者更好地理解..."
            className="w-full px-3 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary resize-none"
            rows={5}
            maxLength={2000}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className="text-right text-xs text-gray-400 mt-1">{desc.length}/2000</div>
        </div>

        {/* 选择话题 */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-medium text-gray-900 mb-3">选择话题</h3>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <button
                key={topic}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  selectedTopics.includes(topic) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => toggleTopic(topic)}
              >
                #{topic}
              </button>
            ))}
          </div>
        </div>

        {/* 更多设置 */}
        <div className="bg-white rounded-xl divide-y divide-gray-100">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <i className="fas fa-map-marker-alt text-gray-400 mr-3"></i>
              <span className="text-sm">添加位置</span>
            </div>
            <div className="flex items-center text-gray-400">
              <span className="text-sm">北京市</span>
              <i className="fas fa-chevron-right ml-2"></i>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <i className="fas fa-user-secret text-gray-400 mr-3"></i>
              <span className="text-sm">匿名提问</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* 发布按钮 */}
        <button
          className="w-full bg-primary text-white py-3 rounded-xl font-medium text-lg"
          onClick={handlePublish}
        >
          发布问题
        </button>

        <div className="h-4"></div>
      </div>
    </div>
  )
}

export default Publish
