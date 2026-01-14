import { Link, useLocation } from 'react-router-dom'

function BottomNav() {
  const location = useLocation()
  const path = location.pathname

  const navItems = [
    { to: '/', icon: 'fa-home', label: '首页' },
    { to: '/follow', icon: 'fa-heart', label: '关注' },
    { to: '/publish', icon: 'fa-plus', label: '发布', isCenter: true },
    { to: '/messages', icon: 'fa-exclamation-triangle', label: '紧急消息', badge: 3 },
    { to: '/profile', icon: 'fa-user', label: '我的' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center py-1 px-4 ${
              item.isCenter ? 'relative -top-3' : ''
            } ${path === item.to ? 'text-primary' : 'text-gray-500'}`}
          >
            {item.isCenter ? (
              <>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <i className={`fas ${item.icon} text-white text-xl`}></i>
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </>
            ) : (
              <>
                <div className="relative">
                  <i className={`fas ${item.icon} text-lg`}></i>
                  {item.badge && (
                    <span className="absolute -top-2 -right-3 bg-primary text-white text-xs px-1.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BottomNav
