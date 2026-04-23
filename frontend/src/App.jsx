import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import AddProperty from './pages/AddProperty'
import Dashboard from './pages/Dashboard'

function Loader() {
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f7f8fc'}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
        <div style={{width:44,height:44,borderRadius:'50%',border:'3px solid #e4e8f0',borderTopColor:'#d4a843',borderRightColor:'#d4a843',animation:'spin 0.8s linear infinite'}}/>
        <p style={{color:'#8694aa',fontFamily:'Plus Jakarta Sans',fontSize:'0.82rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>Loading</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function Protected({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />
        <Route path="/properties"     element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/add-property"   element={<Protected><AddProperty /></Protected>} />
        <Route path="/dashboard"      element={<Protected><Dashboard /></Protected>} />
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
