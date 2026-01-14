import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import QuestionDetail from './pages/QuestionDetail'
import Publish from './pages/Publish'
import Follow from './pages/Follow'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import Search from './pages/Search'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/question/:id" element={<QuestionDetail />} />
      <Route path="/publish" element={<Publish />} />
      <Route path="/follow" element={<Follow />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  )
}

export default App
