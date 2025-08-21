import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Home from './pages/Home'
import StyleQuiz from './pages/StyleQuiz'
import Measurements from './pages/Measurements'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/style-quiz" element={<StyleQuiz />} />
          <Route path="/measurements" element={<Measurements />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
