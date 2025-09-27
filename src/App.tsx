import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from './components/ui/toaster'
import { Toaster as SonnerToaster } from 'sonner'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import StyleQuiz from './pages/StyleQuiz'
import Measurements from './pages/Measurements'
import RoomGeneration from './pages/RoomGeneration'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Profile from './pages/Profile'
import EmailConfirmation from './pages/EmailConfirmation'
import AdminPanel from './pages/AdminPanel'
import ShoppingCart from './pages/ShoppingCart'
import NotFound from './pages/NotFound'
import ECommerceService from './services/ECommerceService'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    // Initialize e-commerce service
    ECommerceService.init();
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/style-quiz" element={<StyleQuiz />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/room-generation" element={<RoomGeneration />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
        <SonnerToaster position="top-right" />
      </div>
    </AuthProvider>
  )
}

export default App
