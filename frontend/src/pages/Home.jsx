import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { Search, MapPin, ArrowRight, Shield, TrendingUp, Star, Award, ChevronDown } from 'lucide-react'
import API from '../api/api'
import PropertyCard from '../components/PropertyCard'

function Count({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0; const step = to / 60
    const t = setInterval(() => { start += step; if (start >= to) { setVal(to); clearInterval(t) } else setVal(Math.floor(start)) }, 18)
    return () => clearInterval(t)
  }, [inView, to])
  return <span ref={ref}>{val.toLocaleString('en-IN')}{suffix}</span>
}

const STATS  = [{ v:300,s:'+',l:'Properties Listed' },{ v:8500,s:'+',l:'Happy Families' },{ v:50,s:'+',l:'Cities Covered' },{ v:2000,s:' Cr+',l:'Deals Closed (₹)' }]
const FEATS  = [
  { I:Shield,    t:'Verified Listings',d:'Every property manually verified by our expert team before listing.' },
  { I:TrendingUp,t:'Price Analytics',  d:'Real-time price trends and neighbourhood insights at your fingertips.' },
  { I:Star,      t:'Premium Support',  d:'Dedicated relationship managers available 7 days a week.' },
  { I:Award,     t:'RERA Compliant',   d:'All projects verified for RERA compliance to protect your investment.' },
]
const CITIES = [
  { city:'Mumbai',    img:'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600&q=85' },
  { city:'Bengaluru', img:'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=85' },
  { city:'Hyderabad', img:'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=600&q=85' },
  { city:'Delhi',     img:'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=85' },
  { city:'Pune',      img:'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=85' },
  { city:'Chennai',   img:'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&q=85' },
]

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch]     = useState('')
  const [tab, setTab]           = useState('sell')
  const [featured, setFeatured] = useState([])
  const [loadingF, setLoadingF] = useState(true)

  useEffect(() => {
    API.get('/properties/featured').then(r=>setFeatured(r.data)).catch(()=>{}).finally(()=>setLoadingF(false))
  }, [])

  const handleSearch = e => { e.preventDefault(); navigate(`/properties?search=${encodeURIComponent(search)}&listing_type=${tab}`) }

  return (
    <div style={{ background:'#f7f8fc' }}>
      {/* HERO */}
      <section style={{ position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',overflow:'hidden',background:'#fff' }}>
        <div style={{ position:'absolute',top:0,right:0,bottom:0,width:'50%',overflow:'hidden' }} className="hero-img-panel">
          <motion.img initial={{ scale:1.1 }} animate={{ scale:1 }} transition={{ duration:1.5,ease:[0.22,1,0.36,1] }}
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=90" alt="hero"
            style={{ width:'100%',height:'100%',objectFit:'cover',display:'block' }}/>
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(to right,rgba(255,255,255,0.95) 0%,rgba(255,255,255,0.15) 40%,transparent 65%)' }}/>
        </div>
        <div className="hero-pattern" style={{ position:'absolute',inset:0,opacity:0.4 }}/>
        <div style={{ position:'relative',zIndex:2,maxWidth:1320,margin:'0 auto',padding:'0 24px',width:'100%',paddingTop:90,paddingBottom:80 }}>
          <div style={{ maxWidth:620 }}>
            <motion.div initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6 }}>
              <span className="eyebrow" style={{ marginBottom:18,display:'inline-flex' }}>India's Premium Real Estate</span>
            </motion.div>
            <motion.h1 initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.75,delay:0.1,ease:[0.22,1,0.36,1] }}
              className="font-display"
              style={{ fontSize:'clamp(2.6rem,6vw,5rem)',fontWeight:900,lineHeight:1.06,letterSpacing:'-0.03em',color:'#0a1628',marginBottom:18 }}>
              Find Your<br/><span className="text-amber-grad">Dream Home</span><br/>In India
            </motion.h1>
            <motion.p initial={{ opacity:0,y:18 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.22 }}
              style={{ fontSize:'1.05rem',color:'#4a5568',maxWidth:480,lineHeight:1.75,marginBottom:38 }}>
              300+ verified properties across 15 cities. From studios to sprawling villas — your perfect home is one search away.
            </motion.p>
            <motion.div initial={{ opacity:0,y:26 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.32 }}
              style={{ background:'#fff',borderRadius:20,padding:10,boxShadow:'0 8px 40px rgba(10,22,40,0.12)',border:'1px solid #e4e8f0',maxWidth:580 }}>
              <div style={{ display:'flex',gap:4,marginBottom:8,padding:'0 4px' }}>
                {[['sell','Buy'],['rent','Rent']].map(([v,l]) => (
                  <button key={v} onClick={()=>setTab(v)}
                    style={{ padding:'7px 18px',borderRadius:11,fontSize:'0.85rem',fontWeight:700,border:'none',cursor:'pointer',transition:'all 0.22s',
                      background:tab===v?'linear-gradient(135deg,#162d55,#0a1628)':'transparent',color:tab===v?'#fff':'#8694aa' }}>
                    {l}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSearch} style={{ display:'flex',gap:8 }}>
                <div style={{ flex:1,display:'flex',alignItems:'center',gap:10,background:'#f7f8fc',border:'1.5px solid #e4e8f0',borderRadius:14,padding:'0 14px' }}>
                  <MapPin size={16} style={{ color:'#cdd3e0',flexShrink:0 }}/>
                  <input type="text" placeholder="City, locality, or property type…"
                    value={search} onChange={e=>setSearch(e.target.value)}
                    style={{ flex:1,background:'transparent',border:'none',outline:'none',color:'#0a1628',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'0.9rem',padding:'13px 0' }}/>
                </div>
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} type="submit"
                  className="btn btn-primary" style={{ padding:'13px 26px',borderRadius:14,fontSize:'0.9rem',flexShrink:0 }}>
                  <Search size={15}/> Search
                </motion.button>
              </form>
            </motion.div>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.48 }}
              style={{ display:'flex',flexWrap:'wrap',gap:8,marginTop:16 }}>
              {[['apartment','🏢 Apartment'],['villa','🏡 Villa'],['penthouse','🏙 Penthouse'],['commercial','🏬 Commercial'],['plot','🌿 Plot']].map(([v,l]) => (
                <Link key={v} to={`/properties?type=${v}`} style={{ textDecoration:'none' }}>
                  <span className="chip" style={{ fontSize:'0.78rem' }}>{l}</span>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
        <motion.div animate={{ y:[0,10,0] }} transition={{ repeat:Infinity,duration:2 }}
          style={{ position:'absolute',bottom:26,left:'50%',transform:'translateX(-50%)',zIndex:2,display:'flex',flexDirection:'column',alignItems:'center',gap:4,color:'#cdd3e0' }}>
          <span style={{ fontSize:'0.62rem',letterSpacing:'0.15em',textTransform:'uppercase' }}>Scroll</span>
          <ChevronDown size={14}/>
        </motion.div>
        <style>{`@media(max-width:768px){.hero-img-panel{display:none!important}}`}</style>
      </section>

      {/* STATS */}
      <section style={{ background:'#0a1628',padding:'52px 24px' }}>
        <div style={{ maxWidth:1320,margin:'0 auto' }}>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:28,textAlign:'center' }}>
            {STATS.map((s,i) => (
              <motion.div key={s.l} initial={{ opacity:0,y:16 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}>
                <p className="font-display" style={{ fontSize:'2.6rem',fontWeight:900,color:'#d4a843',lineHeight:1 }}><Count to={s.v} suffix={s.s}/></p>
                <p style={{ fontSize:'0.82rem',color:'rgba(255,255,255,0.5)',marginTop:6 }}>{s.l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ padding:'88px 24px' }}>
        <div style={{ maxWidth:1320,margin:'0 auto' }}>
          <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:14,marginBottom:48 }}>
            <div>
              <span className="eyebrow" style={{ marginBottom:10,display:'inline-flex' }}>Handpicked For You</span>
              <h2 className="font-display" style={{ fontSize:'clamp(1.8rem,3.5vw,2.6rem)',fontWeight:800,color:'#0a1628' }}>Featured Properties</h2>
            </div>
            <Link to="/properties" style={{ textDecoration:'none' }}>
              <motion.div whileHover={{ x:4 }} style={{ display:'flex',alignItems:'center',gap:6,fontSize:'0.875rem',fontWeight:700,color:'#d4a843' }}>
                View All <ArrowRight size={15}/>
              </motion.div>
            </Link>
          </div>
          {loadingF ? (
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:24 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ borderRadius:20,overflow:'hidden',background:'#fff',border:'1px solid #e4e8f0' }}>
                  <div className="skel" style={{ height:220,borderRadius:0 }}/>
                  <div style={{ padding:'18px 20px',display:'flex',flexDirection:'column',gap:10 }}>
                    <div className="skel" style={{ height:16,width:'72%' }}/><div className="skel" style={{ height:12,width:'50%' }}/>
                    <div className="skel" style={{ height:20,width:'36%',marginTop:8 }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:24 }}>
              {featured.map((p,i) => <PropertyCard key={p.id} property={p} index={i}/>)}
            </div>
          ) : (
            <div style={{ textAlign:'center',padding:'80px 0',color:'#8694aa' }}><p>No featured listings yet.</p></div>
          )}
        </div>
      </section>

      {/* CITIES */}
      <section style={{ background:'#fff',padding:'88px 24px' }}>
        <div style={{ maxWidth:1320,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:48 }}>
            <span className="eyebrow" style={{ marginBottom:12,justifyContent:'center',display:'inline-flex' }}>Browse by Location</span>
            <h2 className="font-display" style={{ fontSize:'clamp(1.8rem,3.5vw,2.6rem)',fontWeight:800,color:'#0a1628' }}>Properties Across India</h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(185px,1fr))',gap:16 }}>
            {CITIES.map((c,i) => (
              <motion.div key={c.city} initial={{ opacity:0,scale:0.96 }} whileInView={{ opacity:1,scale:1 }} viewport={{ once:true }} transition={{ delay:i*0.07 }} whileHover={{ y:-5 }}>
                <Link to={`/properties?city=${c.city}`} style={{ textDecoration:'none',display:'block',borderRadius:18,overflow:'hidden',position:'relative',height:168,cursor:'pointer',boxShadow:'0 4px 16px rgba(10,22,40,0.1)' }}>
                  <img src={c.img} alt={c.city} style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s',display:'block' }}
                    onMouseEnter={e=>e.target.style.transform='scale(1.07)'}
                    onMouseLeave={e=>e.target.style.transform='scale(1)'}/>
                  <div style={{ position:'absolute',inset:0,background:'linear-gradient(to top,rgba(10,22,40,0.8) 0%,rgba(10,22,40,0.1) 65%)' }}/>
                  <div style={{ position:'absolute',bottom:13,left:14 }}>
                    <p className="font-display" style={{ fontSize:'1.05rem',fontWeight:700,color:'#fff',lineHeight:1 }}>{c.city}</p>
                    <p style={{ fontSize:'0.7rem',color:'#d4a843',marginTop:3,fontWeight:600 }}>View Properties →</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding:'88px 24px',background:'#f7f8fc' }}>
        <div style={{ maxWidth:1320,margin:'0 auto' }}>
          <div style={{ textAlign:'center',marginBottom:52 }}>
            <span className="eyebrow" style={{ marginBottom:12,justifyContent:'center',display:'inline-flex' }}>Why EstateX</span>
            <h2 className="font-display" style={{ fontSize:'clamp(1.8rem,3.5vw,2.6rem)',fontWeight:800,color:'#0a1628' }}>The EstateX Advantage</h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:20 }}>
            {FEATS.map((f,i) => (
              <motion.div key={f.t} initial={{ opacity:0,y:22 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                className="card" style={{ borderRadius:20,padding:'28px 24px',background:'#fff' }}>
                <div style={{ width:48,height:48,borderRadius:14,background:'linear-gradient(135deg,#fef3c7,#fde68a)',border:'1px solid rgba(212,168,67,0.3)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:18 }}>
                  <f.I size={22} style={{ color:'#d4a843' }}/>
                </div>
                <h3 className="font-display" style={{ fontSize:'1.1rem',fontWeight:700,color:'#0a1628',marginBottom:8 }}>{f.t}</h3>
                <p style={{ fontSize:'0.85rem',color:'#8694aa',lineHeight:1.7 }}>{f.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'0 24px 88px' }}>
        <div style={{ maxWidth:1320,margin:'0 auto' }}>
          <motion.div initial={{ opacity:0,y:22 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}
            style={{ borderRadius:28,overflow:'hidden',position:'relative',display:'flex',flexWrap:'wrap',alignItems:'stretch',boxShadow:'0 20px 60px rgba(10,22,40,0.14)' }}>
            <div style={{ flex:'1 1 400px',background:'linear-gradient(135deg,#0a1628,#162d55)',padding:'64px 48px',position:'relative' }}>
              <div style={{ position:'absolute',top:-40,right:-40,width:200,height:200,borderRadius:'50%',background:'rgba(212,168,67,0.08)',pointerEvents:'none' }}/>
              <span className="eyebrow" style={{ marginBottom:14,display:'inline-flex',color:'#d4a843' }}>Start Today</span>
              <h2 className="font-display" style={{ fontSize:'clamp(1.8rem,3vw,2.8rem)',fontWeight:800,color:'#fff',marginBottom:16,lineHeight:1.15 }}>
                Ready to List<br/>Your Property?
              </h2>
              <p style={{ fontSize:'1rem',color:'rgba(255,255,255,0.6)',marginBottom:32,lineHeight:1.7,maxWidth:380 }}>
                Join 12,000+ property owners. List in 5 minutes and reach thousands of verified buyers across India.
              </p>
              <div style={{ display:'flex',flexWrap:'wrap',gap:12 }}>
                <Link to="/add-property" style={{ textDecoration:'none' }}>
                  <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                    className="btn btn-amber" style={{ padding:'13px 32px',borderRadius:14,fontSize:'0.9rem' }}>
                    List Property <ArrowRight size={16}/>
                  </motion.button>
                </Link>
                <Link to="/properties" style={{ textDecoration:'none' }}>
                  <motion.button whileHover={{ scale:1.04 }}
                    style={{ padding:'13px 28px',borderRadius:14,fontSize:'0.9rem',fontWeight:600,background:'rgba(255,255,255,0.1)',border:'1.5px solid rgba(255,255,255,0.25)',color:'#fff',cursor:'pointer' }}>
                    Browse Properties
                  </motion.button>
                </Link>
              </div>
            </div>
            <div style={{ flex:'1 1 300px',minHeight:320,position:'relative' }}>
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=90" alt="cta"
                style={{ width:'100%',height:'100%',objectFit:'cover',display:'block' }}/>
              <div style={{ position:'absolute',inset:0,background:'linear-gradient(to right,rgba(10,22,40,0.45) 0%,transparent 50%)' }}/>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
