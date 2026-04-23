import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Building2, Menu, X, ChevronDown, LayoutDashboard, LogOut, PlusCircle } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenu, setUserMenu]     = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const doLogout = () => { logout(); setUserMenu(false); navigate('/') }

  const navStyle = {
    position:'fixed', top:0, left:0, right:0, zIndex:500,
    background: scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: scrolled ? '1px solid #e4e8f0' : '1px solid rgba(255,255,255,0.5)',
    boxShadow: scrolled ? '0 2px 16px rgba(10,22,40,0.08)' : 'none',
    transition: 'all 0.35s ease',
  }

  return (
    <>
      <motion.nav initial={{ y:-70,opacity:0 }} animate={{ y:0,opacity:1 }} transition={{ duration:0.6, ease:[0.22,1,0.36,1] }} style={navStyle}>
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'0 24px', height:70, display:'flex', alignItems:'center', justifyContent:'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:10 }}>
            <motion.div whileHover={{ scale:1.04 }} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#162d55,#0a1628)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(10,22,40,0.2)' }}>
                <Building2 size={19} color="#d4a843" strokeWidth={2} />
              </div>
              <span className="font-display" style={{ fontSize:'1.4rem', fontWeight:700, color:'#0a1628', letterSpacing:'-0.02em' }}>
                Estate<span style={{ color:'#d4a843' }}>X</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop Links */}
          <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:32 }}>
            {[['/', 'Home'], ['/properties', 'Properties']].map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>{label}</NavLink>
            ))}
            {user && <NavLink to="/add-property" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>List Property</NavLink>}
          </div>

          {/* Auth */}
          <div className="hide-mobile" style={{ display:'flex', alignItems:'center', gap:10 }}>
            {user ? (
              <div style={{ position:'relative' }}>
                <motion.button whileHover={{ scale:1.02 }} onClick={() => setUserMenu(v => !v)}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:12, background:'#f1f3f7', border:'1px solid #e4e8f0', cursor:'pointer', color:'#0a1628' }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#162d55,#0a1628)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.78rem', color:'#d4a843' }}>
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize:'0.875rem', fontWeight:600, color:'#0a1628' }}>{user.username?.split(' ')[0]}</span>
                  <ChevronDown size={13} style={{ color:'#8694aa' }} />
                </motion.button>

                <AnimatePresence>
                  {userMenu && (
                    <motion.div initial={{ opacity:0,y:10,scale:0.96 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0,y:10,scale:0.96 }} transition={{ duration:0.15 }}
                      style={{ position:'absolute', right:0, top:'calc(100% + 8px)', width:220, borderRadius:16, overflow:'hidden', background:'#fff', border:'1px solid #e4e8f0', boxShadow:'0 20px 60px rgba(10,22,40,0.14)', zIndex:600 }}>
                      <div style={{ padding:'14px 16px', borderBottom:'1px solid #f1f3f7' }}>
                        <p style={{ fontSize:'0.875rem', fontWeight:700, color:'#0a1628' }}>{user.username}</p>
                        <p style={{ fontSize:'0.75rem', color:'#8694aa', marginTop:2 }}>{user.email}</p>
                      </div>
                      {[{ Icon:LayoutDashboard, label:'Dashboard', to:'/dashboard' }, { Icon:PlusCircle, label:'List Property', to:'/add-property' }].map(item => (
                        <Link key={item.to} to={item.to} onClick={() => setUserMenu(false)}
                          style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 16px', textDecoration:'none', color:'#4a5568', fontSize:'0.875rem' }}
                          onMouseEnter={e => e.currentTarget.style.background='#f7f8fc'}
                          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                          <item.Icon size={15} /> {item.label}
                        </Link>
                      ))}
                      <button onClick={doLogout}
                        style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 16px', width:'100%', background:'none', border:'none', cursor:'pointer', color:'#dc2626', fontSize:'0.875rem' }}
                        onMouseEnter={e => e.currentTarget.style.background='#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background='none'}>
                        <LogOut size={15} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login"><motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} className="btn btn-outline" style={{ padding:'9px 20px', borderRadius:10 }}>Sign In</motion.button></Link>
                <Link to="/register"><motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} className="btn btn-primary" style={{ padding:'9px 22px', borderRadius:10 }}>Get Started</motion.button></Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(v => !v)} className="show-mobile"
            style={{ background:'#f1f3f7', border:'1px solid #e4e8f0', borderRadius:10, padding:9, cursor:'pointer', color:'#0a1628' }}>
            {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity:0,x:'100%' }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:'100%' }}
            transition={{ type:'spring', damping:28, stiffness:280 }}
            style={{ position:'fixed', inset:0, zIndex:490, background:'#fff', paddingTop:86, padding:'86px 24px 40px', display:'flex', flexDirection:'column', gap:6 }}>
            {[['/', 'Home'], ['/properties','Properties'], ...(user ? [['/add-property','List Property'],['/dashboard','Dashboard']] : [])].map(([to,label],i) => (
              <motion.div key={to} initial={{ opacity:0,x:30 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*0.06 }}>
                <NavLink to={to} onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({ display:'block', padding:'14px 18px', borderRadius:14, textDecoration:'none', fontSize:'1.05rem', fontWeight:600, color:isActive?'#0a1628':'#4a5568', background:isActive?'#f1f3f7':'transparent' })}>
                  {label}
                </NavLink>
              </motion.div>
            ))}
            <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap:10 }}>
              {user ? (
                <button onClick={() => { doLogout(); setMobileOpen(false) }}
                  style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:14, padding:14, cursor:'pointer', color:'#dc2626', fontSize:'0.95rem', fontWeight:600 }}>
                  Sign Out
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}><button className="btn btn-outline" style={{ width:'100%', padding:14, borderRadius:14 }}>Sign In</button></Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}><button className="btn btn-primary" style={{ width:'100%', padding:14, borderRadius:14 }}>Get Started</button></Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {userMenu && <div style={{ position:'fixed', inset:0, zIndex:490 }} onClick={() => setUserMenu(false)} />}
    </>
  )
}
