import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'
  const [form, setForm] = useState({ email:'', password:'' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email='Email required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email='Enter valid email'
    if (!form.password) e.password='Password required'
    setErr(e); return !Object.keys(e).length
  }
  const s = (k,v) => { setForm(p=>({...p,[k]:v})); setErr(p=>({...p,[k]:''})) }

  const submit = async e => {
    e.preventDefault(); if (!validate()) return
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back! 🏠'); navigate(from,{replace:true})
    } catch(ex) {
      const msg = ex.response?.data?.message||'Login failed'
      toast.error(msg)
      if (msg.toLowerCase().includes('password')) setErr({password:msg})
      else setErr({email:msg})
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'#f7f8fc' }}>
      {/* Left panel */}
      <motion.div initial={{ opacity:0,x:-40 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.7 }}
        style={{ display:'none', flex:'0 0 44%', background:'linear-gradient(135deg,#0a1628,#162d55)', padding:'52px', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden' }}
        className="left-panel">
        <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'rgba(212,168,67,0.08)', top:'-10%', right:'-10%', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', width:250, height:250, borderRadius:'50%', background:'rgba(255,255,255,0.04)', bottom:'5%', left:'-8%', pointerEvents:'none' }}/>
        <Link to="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10, position:'relative', zIndex:1 }}>
          <div style={{ width:38,height:38,borderRadius:11,background:'linear-gradient(135deg,#e8c06a,#d4a843)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Building2 size={19} color="#0a1628"/>
          </div>
          <span className="font-display" style={{ fontSize:'1.5rem',fontWeight:700,color:'#fff' }}>Estate<span style={{color:'#d4a843'}}>X</span></span>
        </Link>
        <div style={{ position:'relative', zIndex:1 }}>
          <p className="font-display" style={{ fontSize:'1.8rem',fontWeight:700,color:'#fff',lineHeight:1.3,marginBottom:14 }}>
            "The best investment<br/>on Earth is earth."
          </p>
          <p style={{ fontSize:'0.82rem',color:'rgba(255,255,255,0.45)' }}>— Louis Glickman</p>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,position:'relative',zIndex:1 }}>
          {[['300+','Properties'],['8.5K+','Clients'],['15+','Cities']].map(([v,l]) => (
            <div key={l} style={{ textAlign:'center',padding:'14px 8px',borderRadius:14,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)' }}>
              <p className="font-display" style={{ fontSize:'1.3rem',fontWeight:700,color:'#d4a843' }}>{v}</p>
              <p style={{ fontSize:'0.7rem',color:'rgba(255,255,255,0.45)',marginTop:3 }}>{l}</p>
            </div>
          ))}
        </div>
        <style>{`.left-panel{display:flex!important}@media(max-width:900px){.left-panel{display:none!important}}`}</style>
      </motion.div>

      {/* Right */}
      <div style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'80px 24px' }}>
        <motion.div initial={{ opacity:0,y:26 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6,delay:0.1 }} style={{ width:'100%',maxWidth:420 }}>
          <Link to="/" style={{ textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10,marginBottom:36 }} className="mobile-logo">
            <div style={{ width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#162d55,#0a1628)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Building2 size={17} color="#d4a843"/>
            </div>
            <span className="font-display" style={{ fontSize:'1.3rem',fontWeight:700,color:'#0a1628' }}>Estate<span style={{color:'#d4a843'}}>X</span></span>
          </Link>
          <style>{`.mobile-logo{display:inline-flex!important}@media(min-width:901px){.mobile-logo{display:none!important}}`}</style>

          <h1 className="font-display" style={{ fontSize:'2.2rem',fontWeight:800,color:'#0a1628',marginBottom:6 }}>Welcome back</h1>
          <p style={{ fontSize:'0.9rem',color:'#8694aa',marginBottom:32 }}>Sign in to your EstateX account</p>

          <form onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:16 }}>
            <div>
              <label className="lbl">Email Address</label>
              <div style={{ position:'relative' }}>
                <Mail size={15} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#cdd3e0' }}/>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={e=>s('email',e.target.value)}
                  className={`inp${err.email?' error':''}`} style={{ padding:'13px 14px 13px 42px',borderRadius:12 }}/>
              </div>
              {err.email && <p style={{ fontSize:'0.73rem',color:'#dc2626',marginTop:4 }}>{err.email}</p>}
            </div>
            <div>
              <label className="lbl">Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#cdd3e0' }}/>
                <input type={show?'text':'password'} placeholder="Your password" value={form.password} onChange={e=>s('password',e.target.value)}
                  className={`inp${err.password?' error':''}`} style={{ padding:'13px 44px 13px 42px',borderRadius:12 }}/>
                <button type="button" onClick={()=>setShow(v=>!v)}
                  style={{ position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#8694aa' }}>
                  {show?<EyeOff size={16}/>:<Eye size={16}/>}
                </button>
              </div>
              {err.password && <p style={{ fontSize:'0.73rem',color:'#dc2626',marginTop:4 }}>{err.password}</p>}
            </div>
            <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }} type="submit" disabled={loading}
              className="btn btn-primary" style={{ padding:'14px',borderRadius:14,fontSize:'0.95rem',marginTop:4,opacity:loading?0.7:1 }}>
              {loading?<div style={{ width:20,height:20,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',animation:'spin 0.8s linear infinite' }}/>:<>Sign In <ArrowRight size={16}/></>}
            </motion.button>
          </form>
          <div className="divider" style={{ margin:'24px 0' }}/>
          <p style={{ textAlign:'center',fontSize:'0.875rem',color:'#8694aa' }}>
            No account?{' '}<Link to="/register" style={{ color:'#d4a843',textDecoration:'none',fontWeight:700 }}>Create one free</Link>
          </p>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
