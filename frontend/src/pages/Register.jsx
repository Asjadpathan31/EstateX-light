import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, Building2, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const RULES = [
  { l:'At least 6 characters', t:v=>v.length>=6 },
  { l:'Contains a number',     t:v=>/\d/.test(v) },
  { l:'Contains a letter',     t:v=>/[a-zA-Z]/.test(v) },
]

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form,setForm] = useState({ username:'',email:'',password:'',confirm:'' })
  const [showP,setShowP] = useState(false)
  const [showC,setShowC] = useState(false)
  const [loading,setLoading] = useState(false)
  const [err,setErr] = useState({})

  const validate = () => {
    const e = {}
    if (!form.username.trim()||form.username.length<3) e.username='Name must be at least 3 chars'
    if (!form.email||!/\S+@\S+\.\S+/.test(form.email)) e.email='Enter a valid email'
    if (form.password.length<6) e.password='Password too short'
    if (form.password!==form.confirm) e.confirm='Passwords do not match'
    setErr(e); return !Object.keys(e).length
  }
  const s = (k,v) => { setForm(p=>({...p,[k]:v})); setErr(p=>({...p,[k]:''})) }

  const submit = async e => {
    e.preventDefault(); if (!validate()) return
    setLoading(true)
    try {
      await register(form.username,form.email,form.password)
      toast.success('Welcome to EstateX! 🏠'); navigate('/')
    } catch(ex) {
      const msg = ex.response?.data?.message||'Registration failed'
      toast.error(msg)
      if (msg.toLowerCase().includes('email')) setErr({email:msg})
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh',display:'flex',background:'#f7f8fc' }}>
      <motion.div initial={{ opacity:0,x:-40 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.7 }}
        style={{ display:'none',flex:'0 0 44%',background:'linear-gradient(135deg,#0a1628,#162d55)',padding:'52px',flexDirection:'column',justifyContent:'space-between',position:'relative',overflow:'hidden' }}
        className="left-p">
        <div style={{ position:'absolute',width:350,height:350,borderRadius:'50%',background:'rgba(212,168,67,0.08)',bottom:'-5%',right:'-8%',pointerEvents:'none' }}/>
        <Link to="/" style={{ textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10,position:'relative',zIndex:1 }}>
          <div style={{ width:38,height:38,borderRadius:11,background:'linear-gradient(135deg,#e8c06a,#d4a843)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <Building2 size={19} color="#0a1628"/>
          </div>
          <span className="font-display" style={{ fontSize:'1.5rem',fontWeight:700,color:'#fff' }}>Estate<span style={{color:'#d4a843'}}>X</span></span>
        </Link>
        <div style={{ position:'relative',zIndex:1,display:'flex',flexDirection:'column',gap:12 }}>
          {[['🔒','Bank-Level Security','End-to-end encryption protects your data 24/7.'],
            ['✅','Verified Listings','All properties undergo strict manual verification.'],
            ['⚡','List in 5 Minutes','Simple wizard to post your property instantly.']
          ].map(([e,t,d]) => (
            <div key={t} style={{ display:'flex',gap:14,alignItems:'flex-start',padding:'14px 16px',borderRadius:14,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.09)' }}>
              <span style={{ fontSize:'1.3rem',flexShrink:0 }}>{e}</span>
              <div>
                <p style={{ fontWeight:700,fontSize:'0.875rem',color:'#fff',marginBottom:2 }}>{t}</p>
                <p style={{ fontSize:'0.78rem',color:'rgba(255,255,255,0.5)',lineHeight:1.6 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize:'0.75rem',color:'rgba(255,255,255,0.3)',position:'relative',zIndex:1 }}>Trusted by 8,500+ families across India</p>
        <style>{`.left-p{display:flex!important}@media(max-width:900px){.left-p{display:none!important}}`}</style>
      </motion.div>

      <div style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'80px 24px' }}>
        <motion.div initial={{ opacity:0,y:26 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6,delay:0.1 }} style={{ width:'100%',maxWidth:420 }}>
          <Link to="/" style={{ textDecoration:'none',display:'inline-flex',alignItems:'center',gap:10,marginBottom:36 }} className="mob-logo">
            <div style={{ width:34,height:34,borderRadius:10,background:'linear-gradient(135deg,#162d55,#0a1628)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Building2 size={17} color="#d4a843"/>
            </div>
            <span className="font-display" style={{ fontSize:'1.3rem',fontWeight:700,color:'#0a1628' }}>Estate<span style={{color:'#d4a843'}}>X</span></span>
          </Link>
          <style>{`.mob-logo{display:inline-flex!important}@media(min-width:901px){.mob-logo{display:none!important}}`}</style>

          <h1 className="font-display" style={{ fontSize:'2.2rem',fontWeight:800,color:'#0a1628',marginBottom:6 }}>Create Account</h1>
          <p style={{ fontSize:'0.9rem',color:'#8694aa',marginBottom:32 }}>Join India's premium real estate platform</p>

          <form onSubmit={submit} style={{ display:'flex',flexDirection:'column',gap:14 }}>
            {[{ l:'Full Name',k:'username',t:'text',p:'Asjad Pathan',I:User },{ l:'Email',k:'email',t:'email',p:'you@example.com',I:Mail }].map(({l,k,t,p,I}) => (
              <div key={k}>
                <label className="lbl">{l}</label>
                <div style={{ position:'relative' }}>
                  <I size={15} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#cdd3e0' }}/>
                  <input type={t} placeholder={p} value={form[k]} onChange={e=>s(k,e.target.value)}
                    className={`inp${err[k]?' error':''}`} style={{ padding:'12px 14px 12px 42px',borderRadius:12 }}/>
                </div>
                {err[k] && <p style={{ fontSize:'0.73rem',color:'#dc2626',marginTop:4 }}>{err[k]}</p>}
              </div>
            ))}
            <div>
              <label className="lbl">Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#cdd3e0' }}/>
                <input type={showP?'text':'password'} placeholder="Create a strong password" value={form.password} onChange={e=>s('password',e.target.value)}
                  className={`inp${err.password?' error':''}`} style={{ padding:'12px 44px 12px 42px',borderRadius:12 }}/>
                <button type="button" onClick={()=>setShowP(v=>!v)} style={{ position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#8694aa' }}>
                  {showP?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
              {err.password && <p style={{ fontSize:'0.73rem',color:'#dc2626',marginTop:4 }}>{err.password}</p>}
              {form.password && (
                <div style={{ marginTop:8,display:'flex',flexDirection:'column',gap:4 }}>
                  {RULES.map(r => (
                    <div key={r.l} style={{ display:'flex',alignItems:'center',gap:7 }}>
                      <div style={{ width:15,height:15,borderRadius:'50%',background:r.t(form.password)?'#059669':'#e4e8f0',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,transition:'background 0.25s' }}>
                        {r.t(form.password) && <Check size={9} color="white" strokeWidth={3}/>}
                      </div>
                      <span style={{ fontSize:'0.73rem',color:r.t(form.password)?'#059669':'#8694aa' }}>{r.l}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="lbl">Confirm Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={15} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#cdd3e0' }}/>
                <input type={showC?'text':'password'} placeholder="Repeat password" value={form.confirm} onChange={e=>s('confirm',e.target.value)}
                  className={`inp${err.confirm?' error':''}`} style={{ padding:'12px 44px 12px 42px',borderRadius:12 }}/>
                <button type="button" onClick={()=>setShowC(v=>!v)} style={{ position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#8694aa' }}>
                  {showC?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
              {err.confirm && <p style={{ fontSize:'0.73rem',color:'#dc2626',marginTop:4 }}>{err.confirm}</p>}
            </div>
            <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }} type="submit" disabled={loading}
              className="btn btn-primary" style={{ padding:'14px',borderRadius:14,fontSize:'0.95rem',marginTop:4,opacity:loading?0.7:1 }}>
              {loading?<div style={{ width:20,height:20,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',animation:'spin 0.8s linear infinite' }}/>:<>Create Account <ArrowRight size={16}/></>}
            </motion.button>
          </form>
          <div className="divider" style={{ margin:'24px 0' }}/>
          <p style={{ textAlign:'center',fontSize:'0.875rem',color:'#8694aa' }}>
            Already have an account?{' '}<Link to="/login" style={{ color:'#d4a843',textDecoration:'none',fontWeight:700 }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
