import { useState } from 'react'
import { Link } from 'react-router-dom'

function QuestionCard({ question }) {
  const [likes, setLikes] = useState(question.likes)
  const [liked, setLiked] = useState(false)

  const handleLike = (e) => {
    e.preventDefault()
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  const typeClass = {
    reward: 'question-type-reward',
    free: 'question-type-free',
    targeted: 'question-type-targeted'
  }

  return (
    <Link to={`/question/${question.id}`} className="block bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center px-4 pt-4 pb-2">
        <img src={question.avatar} className="w-10 h-10 rounded-full" alt="" />
        <div className="ml-3 flex-1">
          <div className="flex items-center">
            <span className="font-medium text-sm">{question.author}</span>
            {question.verified && <i className="fas fa-check-circle text-blue-500 text-xs ml-1"></i>}
            <span className={`${typeClass[question.type]} text-white text-xs px-2 py-0.5 rounded-full ml-2`}>
              {question.type === 'reward' ? `悬赏 $${question.reward}` : question.type === 'free' ? '公开' : '定向'}
            </span>
          </div>
          <span className="text-xs text-gray-400">{question.time}</span>
        </div>
        <button className="text-gray-400 text-sm" onClick={(e) => e.preventDefault()}>
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>

      <div className="px-4 pb-3">
        <h3 className="text-base font-medium text-gray-900 leading-relaxed">{question.title}</h3>
      </div>

      {question.images && question.images.length > 0 && (
        <div className={`px-4 pb-3 ${question.images.length === 1 ? '' : 'flex gap-2'}`}>
          {question.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              className={question.images.length === 1 ? 'w-full h-40 object-cover rounded-lg' : 'w-28 h-28 object-cover rounded-lg'}
              alt=""
            />
          ))}
        </div>
      )}

      <div className="px-4 pb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-primary font-medium">已解决 {question.solvedRate}%</span>
          <span className="text-blue-500 font-medium">未解决 {100 - question.solvedRate}%</span>
        </div>
        <div className="relative flex h-3 rounded-full overflow-visible bg-gray-100">
          <div className="bg-primary h-full rounded-l-full" style={{ width: `${question.solvedRate}%` }}></div>
          <div className="bg-blue-500 h-full rounded-r-full" style={{ width: `${100 - question.solvedRate}%` }}></div>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50">
        <div className="flex items-center gap-4">
          <button
            className={`flex items-center text-sm ${liked ? 'text-primary' : 'text-gray-500'}`}
            onClick={handleLike}
          >
            <i className={`${liked ? 'fas' : 'far'} fa-thumbs-up mr-1`}></i>
            <span>{likes}</span>
          </button>
          <button className="flex items-center text-gray-500 text-sm" onClick={(e) => e.preventDefault()}>
            <i className="far fa-thumbs-down mr-1"></i>
            <span>{question.dislikes}</span>
          </button>
          <button className="flex items-center text-gray-500 text-sm" onClick={(e) => e.preventDefault()}>
            <i className="far fa-comment mr-1"></i>
            <span>{question.comments}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-500 text-sm px-2 py-1 border border-gray-200 rounded-full" onClick={(e) => e.preventDefault()}>
            <i className="fas fa-users mr-1"></i>群聊
          </button>
          <button className="bg-primary text-white text-sm px-3 py-1 rounded-full" onClick={(e) => e.preventDefault()}>
            <i className="fas fa-pen mr-1"></i>回答
          </button>
        </div>
      </div>
    </Link>
  )
}

export default QuestionCard
