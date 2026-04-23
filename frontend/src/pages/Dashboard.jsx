import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Heart, Eye, Plus, Trash2, LogOut, LayoutDashboard, ChevronRight, AlertTriangle, Check, User, Phone, Mail, Lock } from 'lucide-react'
import API from '../api/api'
import { useAuth } from '../context/AuthContext'
import { fmtPrice, fmtDate } from '../utils/format'
import toast from 'react-hot-toast'

const TABS = [{ key:'overview',label:'Overview' },{ key:'listings',label:'My Listings' },{ key:'saved',label:'Saved' },{ key:'profile',label:'Profile' }]

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab]       = useState('overview')
  const [listings, setListings] = useState([])
  const [saved, setSaved]   = useState([])
  const [loadL, setLoadL]   = useState(false)
  const [loadS, setLoadS]   = useState(false)
  const [delId, setDelId]   = useState(null)
  const [pForm, setPForm]   = useState({ username:user?.username||'', phone:user?.phone||'', bio:user?.bio||'' })
  const [pLoad, setPLoad]   = useState(false)
  const [pw, setPw]         = useState({ old_password:'', new_password:'', confirm:'' })
  const [pwLoad, setPwLoad] = useState(false)

  useEffect(() => {
    if (tab==='listings' && !listings.length) {
      setLoadL(true)
      API.get('/properties/my-listings').then(r=>setListings(r.data)).catch(()=>{}).finally(()=>setLoadL(false))
    }
    if (tab==='saved' && !saved.length) {
      setLoadS(true)
      API.get('/properties/saved').then(r=>setSaved(r.data)).catch(()=>{}).finally(()=>setLoadS(false))
    }
  }, [tab])

  const doDelete = async id => {
    try { await API.delete(`/properties/delete/${id}`); setListings(p=>p.filter(l=>l.id!==id)); toast.success('Deleted') }
    catch { toast.error('Failed to delete') }
    setDelId(null)
  }

  const saveProfile = async () => {
    setPLoad(true)
    try { const res = await API.put('/users/profile', pForm); updateUser(res.data.user); toast.success('Profile updated!') }
    catch { toast.error('Failed') } finally { setPLoad(false) }
  }

  const changePw = async () => {
    if (pw.new_password!==pw.confirm) { toast.error("Passwords don't match"); return }
    if (pw.new_password.length<6) { toast.error('Too short'); return }
    setPwLoad(true)
    try { await API.put('/users/change-password',{ old_password:pw.old_password, new_password:pw.new_password }); toast.success('Password updated!'); setPw({ old_password:'', new_password:'', confirm:'' }) }
    catch(ex) { toast.error(ex.response?.data?.message||'Failed') } finally { setPwLoad(false) }
  }

  const stats = [
    { label:'Total Listings', value:user?.total_properties||0, color:'#f5c842', Icon:Building2 },
    { label:'Saved',          value:saved.length,              color:'#f43f5e', Icon:Heart },
    { label:'Total Views',    value:listings.reduce((a,b)=>a+(b.views||0),0), color:'#3b82f6', Icon:Eye },
  ]

  return (
    <div style={{ background:'#f7f8fc', minHeight:'100vh', paddingTop:72 }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'36px 24px' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14, marginBottom:32 }}>
          <div>
            <span className="eyebrow" style={{ marginBottom:6, display:'inline-flex' }}>Dashboard</span>
            <h1 className="font-display" style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, color:'#0a1628' }}>
              Welcome back, {user?.username?.split(' ')[0]} 👋
            </h1>
          </div>
          <Link to="/add-property" style={{ textDecoration:'none' }}>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              className="btn btn-primary" style={{ padding:'11px 22px', borderRadius:14, border:'none', cursor:'pointer', gap:8, fontSize:'0.875rem' }}>
              <Plus size={15} /> New Listing
            </motion.button>
          </Link>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, padding:6, background:'#fff', border:'1px solid #1e1e2c', borderRadius:18, width:'fit-content', marginBottom:32 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding:'9px 20px', borderRadius:13, fontSize:'0.875rem', fontWeight:500, background:tab===t.key?'linear-gradient(135deg,#ffe566,#f5c842)':'transparent', color:tab===t.key?'#f7f8fc':'#8694aa', border:'none', cursor:'pointer', transition:'all 0.25s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab==='overview' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
              {stats.map((s,i) => (
                <motion.div key={s.label} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
                  className="card" style={{ borderRadius:20, padding:'24px 20px' }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:`${s.color}18`, border:`1px solid ${s.color}28`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                    <s.Icon size={18} style={{ color:s.color }} />
                  </div>
                  <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'2.4rem', fontWeight:700, color:s.color, lineHeight:1 }}>{s.value}</p>
                  <p style={{ fontSize:'0.82rem', color:'#8694aa', marginTop:4 }}>{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Profile card */}
            <div className="card" style={{ borderRadius:20, padding:'20px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:54, height:54, borderRadius:14, background:'linear-gradient(135deg,#ffe566,#f5c842)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garamond,serif', fontSize:'1.6rem', fontWeight:700, color:'#f7f8fc', flexShrink:0 }}>
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight:600, color:'#0a1628' }}>{user?.username}</p>
                  <p style={{ fontSize:'0.82rem', color:'#8694aa' }}>{user?.email}</p>
                  {user?.phone && <p style={{ fontSize:'0.78rem', color:'#cdd3e0', marginTop:2 }}>{user.phone}</p>}
                </div>
              </div>
              <button onClick={()=>setTab('profile')} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:'#d4a843', fontSize:'0.85rem', fontWeight:500 }}>
                Edit Profile <ChevronRight size={13} />
              </button>
            </div>

            {/* Quick actions */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:12 }}>
              {[
                { label:'Add Listing',   Icon:Plus,          action:()=>navigate('/add-property'), color:'#f5c842' },
                { label:'My Listings',   Icon:Building2,     action:()=>setTab('listings'),         color:'#a78bfa' },
                { label:'Saved',         Icon:Heart,         action:()=>setTab('saved'),            color:'#f43f5e' },
                { label:'Sign Out',      Icon:LogOut,        action:()=>{ logout(); navigate('/') }, color:'#f43f5e', danger:true },
              ].map(item => (
                <motion.button key={item.label} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={item.action}
                  style={{ padding:'18px 12px', borderRadius:18, background:item.danger?'rgba(244,63,94,0.06)':'rgba(255,255,255,0.03)', border:item.danger?'1px solid rgba(244,63,94,0.18)':'1px solid #1e1e2c', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:11, background:`${item.color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <item.Icon size={17} style={{ color:item.color }} />
                  </div>
                  <span style={{ fontSize:'0.78rem', fontWeight:500, color:item.danger?'#f43f5e':'#4a5568' }}>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* LISTINGS */}
        {tab==='listings' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {loadL ? (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[1,2,3].map(i => <div key={i} className="skel" style={{ height:72, borderRadius:16 }} />)}
              </div>
            ) : listings.length===0 ? (
              <div style={{ textAlign:'center', padding:'80px 0' }}>
                <Building2 size={48} style={{ color:'#cdd3e0', margin:'0 auto 14px' }} />
                <h3 className="font-display" style={{ fontSize:'1.4rem', color:'#0a1628', marginBottom:10 }}>No listings yet</h3>
                <p style={{ color:'#8694aa', marginBottom:20 }}>Start listing your first property today.</p>
                <Link to="/add-property"><button className="btn btn-primary" style={{ padding:'11px 24px', borderRadius:14, border:'none', cursor:'pointer' }}>Add Property</button></Link>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {listings.map((l,i) => (
                  <motion.div key={l.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                    className="card" style={{ borderRadius:18, padding:'16px 18px', display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:'rgba(245,200,66,0.08)', border:'1px solid rgba(245,200,66,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Building2 size={18} style={{ color:'#f5c842' }} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontWeight:500, fontSize:'0.875rem', color:'#0a1628', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.title}</p>
                      <p style={{ fontSize:'0.75rem', color:'#8694aa', marginTop:2 }}>
                        {l.city} · {l.property_type} · <span style={{ color:'#d4a843' }}>{fmtPrice(l.price)}</span>
                      </p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.75rem', color:'#cdd3e0', flexShrink:0 }}>
                      <Eye size={12} /> {l.views}
                    </div>
                    <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                      <Link to={`/properties/${l.id}`}>
                        <motion.button whileTap={{ scale:0.9 }} style={{ width:34, height:34, borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid #1e1e2c', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#8694aa' }}>
                          <Eye size={14} />
                        </motion.button>
                      </Link>
                      <motion.button whileTap={{ scale:0.9 }} onClick={() => setDelId(l.id)}
                        style={{ width:34, height:34, borderRadius:10, background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.2)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#f43f5e' }}>
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* SAVED */}
        {tab==='saved' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            {loadS ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
                {[1,2].map(i => <div key={i} className="skel" style={{ height:80, borderRadius:16 }} />)}
              </div>
            ) : saved.length===0 ? (
              <div style={{ textAlign:'center', padding:'80px 0' }}>
                <Heart size={48} style={{ color:'#cdd3e0', margin:'0 auto 14px' }} />
                <h3 className="font-display" style={{ fontSize:'1.4rem', color:'#0a1628', marginBottom:10 }}>Nothing saved yet</h3>
                <p style={{ color:'#8694aa', marginBottom:20 }}>Browse properties and save your favourites.</p>
                <Link to="/properties"><button className="btn btn-primary" style={{ padding:'11px 24px', borderRadius:14, border:'none', cursor:'pointer' }}>Browse Properties</button></Link>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
                {saved.map((p,i) => (
                  <motion.div key={p.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.05 }}
                    className="card" style={{ borderRadius:18, padding:'16px 18px', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:11, background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Heart size={17} style={{ color:'#f43f5e' }} fill="#f43f5e" />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontWeight:500, fontSize:'0.875rem', color:'#0a1628', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</p>
                      <p style={{ fontSize:'0.75rem', color:'#8694aa', marginTop:2 }}>{p.city} · <span style={{ color:'#d4a843' }}>{fmtPrice(p.price)}</span></p>
                    </div>
                    <Link to={`/properties/${p.id}`}>
                      <button style={{ padding:'6px 12px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid #1e1e2c', cursor:'pointer', color:'#4a5568', fontSize:'0.78rem' }}>View</button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* PROFILE */}
        {tab==='profile' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ maxWidth:480, display:'flex', flexDirection:'column', gap:20 }}>
            <div className="card" style={{ borderRadius:22, padding:28 }}>
              <h2 className="font-display" style={{ fontSize:'1.35rem', fontWeight:700, color:'#0a1628', marginBottom:20 }}>Edit Profile</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {[
                  { label:'Full Name', key:'username', Icon:User,  placeholder:'Your name' },
                  { label:'Phone',     key:'phone',    Icon:Phone, placeholder:'+91 98765 43210' },
                ].map(({label,key,Icon,placeholder}) => (
                  <div key={key}>
                    <label className="lbl">{label}</label>
                    <div style={{ position:'relative' }}>
                      <Icon size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#cdd3e0' }} />
                      <input type="text" placeholder={placeholder} value={pForm[key]}
                        onChange={e => setPForm(p=>({...p,[key]:e.target.value}))}
                        className="inp" style={{ padding:'12px 14px 12px 38px', borderRadius:14 }} />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="lbl">Bio</label>
                  <textarea placeholder="Tell something about yourself…" value={pForm.bio}
                    onChange={e => setPForm(p=>({...p,bio:e.target.value}))} rows={3}
                    className="inp" style={{ padding:'12px 14px', borderRadius:14, resize:'none' }} />
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.78rem', color:'#cdd3e0' }}>
                  <Mail size={12} /> {user?.email} (cannot be changed)
                </div>
                <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }} onClick={saveProfile} disabled={pLoad}
                  className="btn btn-primary" style={{ padding:'12px', borderRadius:14, border:'none', cursor:'pointer', gap:8, opacity:pLoad?0.7:1 }}>
                  {pLoad?<div style={{ width:16,height:16,borderRadius:'50%',border:'2px solid rgba(0,0,0,0.25)',borderTopColor:'#f7f8fc',animation:'spin 0.8s linear infinite' }}/>:<><Check size={14}/> Save Changes</>}
                </motion.button>
              </div>
            </div>

            <div className="card" style={{ borderRadius:22, padding:28 }}>
              <h2 className="font-display" style={{ fontSize:'1.35rem', fontWeight:700, color:'#0a1628', marginBottom:20 }}>Change Password</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {[['Current Password','old_password'],['New Password','new_password'],['Confirm New Password','confirm']].map(([l,k]) => (
                  <div key={k}>
                    <label className="lbl">{l}</label>
                    <div style={{ position:'relative' }}>
                      <Lock size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#cdd3e0' }} />
                      <input type="password" placeholder="••••••••" value={pw[k]}
                        onChange={e => setPw(p=>({...p,[k]:e.target.value}))}
                        className="inp" style={{ padding:'12px 14px 12px 38px', borderRadius:14 }} />
                    </div>
                  </div>
                ))}
                <motion.button whileHover={{ scale:1.01 }} onClick={changePw} disabled={pwLoad}
                  className="btn btn-outline-amber" style={{ padding:'12px', borderRadius:14, cursor:'pointer', opacity:pwLoad?0.7:1 }}>
                  {pwLoad?'Updating…':'Update Password'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {delId && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:800, display:'flex', alignItems:'center', justifyContent:'center', padding:24, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(6px)' }}
            onClick={() => setDelId(null)}>
            <motion.div initial={{ scale:0.88, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.88, opacity:0 }}
              style={{ background:'#fff', border:'1px solid #1e1e2c', borderRadius:24, padding:36, maxWidth:360, width:'100%', textAlign:'center' }}
              onClick={e=>e.stopPropagation()}>
              <div style={{ width:52, height:52, borderRadius:16, background:'rgba(244,63,94,0.12)', border:'1px solid rgba(244,63,94,0.25)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
                <AlertTriangle size={24} style={{ color:'#f43f5e' }} />
              </div>
              <h3 className="font-display" style={{ fontSize:'1.3rem', fontWeight:700, color:'#0a1628', marginBottom:8 }}>Delete Property?</h3>
              <p style={{ fontSize:'0.85rem', color:'#8694aa', marginBottom:24, lineHeight:1.6 }}>This action cannot be undone. The listing will be permanently removed.</p>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={()=>setDelId(null)} style={{ flex:1, padding:'12px', borderRadius:14, background:'rgba(255,255,255,0.05)', border:'1px solid #1e1e2c', cursor:'pointer', color:'#4a5568', fontSize:'0.875rem' }}>Cancel</button>
                <button onClick={()=>doDelete(delId)} style={{ flex:1, padding:'12px', borderRadius:14, background:'rgba(244,63,94,0.14)', border:'1px solid rgba(244,63,94,0.3)', cursor:'pointer', color:'#f43f5e', fontSize:'0.875rem', fontWeight:600 }}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
