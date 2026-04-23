import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Plus, X, ArrowRight } from 'lucide-react'
import API from '../api/api'
import toast from 'react-hot-toast'

const AMENITIES = ['Swimming Pool','Gym','Club House','24x7 Security','CCTV','Power Backup','Lift','Visitor Parking','Children Play Area','Jogging Track','Intercom','Solar Panels','Terrace Garden','Co-working Space','EV Charging','Spa & Sauna','Amphitheatre','Indoor Games Room']
const STEPS = ['Basic Info','Location & Price','Property Specs','Amenities','Review & Submit']
const PROP_TYPES = ['apartment','villa','house','commercial','plot','penthouse','studio']

export default function AddProperty() {
  const navigate = useNavigate()
  const [step, setStep]     = useState(0)
  const [loading, setLoading] = useState(false)
  const [err, setErr]       = useState({})

  const [f, setF] = useState({
    title:'', description:'', listing_type:'sell', property_type:'apartment',
    price:'', location:'', city:'', state:'', pincode:'',
    bedrooms:'', bathrooms:'', area_sqft:'', floor:'', total_floors:'',
    facing:'', age_years:'', furnishing:'', parking:'', rera_number:'',
    amenities:[], images:[], imgUrl:'',
  })

  const s = (k, v) => { setF(p => ({ ...p, [k]: v })); setErr(p => ({ ...p, [k]:'' })) }
  const togAmenity = a => setF(p => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x=>x!==a) : [...p.amenities,a] }))
  const addImg = () => {
    const url = f.imgUrl.trim()
    if (!url || !url.startsWith('http')) { toast.error('Enter a valid image URL'); return }
    setF(p => ({ ...p, images:[...p.images,url], imgUrl:'' }))
  }
  const rmImg = i => setF(p => ({ ...p, images:p.images.filter((_,idx)=>idx!==i) }))

  const validate = () => {
    const e = {}
    if (step===0) {
      if (!f.title.trim())       e.title       = 'Title required'
      if (!f.description.trim()) e.description = 'Description required'
    }
    if (step===1) {
      if (!f.location.trim()) e.location = 'Location required'
      if (!f.city.trim())     e.city     = 'City required'
      if (!f.price || isNaN(+f.price) || +f.price<=0) e.price = 'Enter valid price'
    }
    setErr(e); return !Object.keys(e).length
  }

  const next = () => { if (validate()) setStep(s => Math.min(s+1, STEPS.length-1)) }
  const back = () => setStep(s => Math.max(s-1, 0))

  const submit = async () => {
    setLoading(true)
    try {
      const payload = { ...f, price:+f.price, bedrooms:f.bedrooms?+f.bedrooms:null, bathrooms:f.bathrooms?+f.bathrooms:null, area_sqft:f.area_sqft?+f.area_sqft:null, floor:f.floor?+f.floor:null, total_floors:f.total_floors?+f.total_floors:null, age_years:f.age_years?+f.age_years:null, parking:f.parking?+f.parking:null }
      delete payload.imgUrl
      await API.post('/properties/add', payload)
      toast.success('Property listed! 🎉')
      navigate('/dashboard')
    } catch (ex) { toast.error(ex.response?.data?.error || 'Failed to list') }
    finally { setLoading(false) }
  }

  const inp = (label, key, opts={}) => (
    <div>
      <label className="lbl">{label}</label>
      <input type={opts.type||'text'} placeholder={opts.placeholder||''} value={f[key]}
        onChange={e => s(key, e.target.value)}
        className={`inp${err[key]?' error':''}`}
        style={{ padding:'12px 14px', borderRadius:14, marginTop:4 }} />
      {err[key] && <p style={{ fontSize:'0.75rem', color:'#f43f5e', marginTop:4 }}>{err[key]}</p>}
    </div>
  )

  return (
    <div style={{ background:'#f7f8fc', minHeight:'100vh', paddingTop:72 }}>
      <div style={{ maxWidth:780, margin:'0 auto', padding:'40px 24px' }}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <span className="eyebrow" style={{ marginBottom:10, display:'inline-flex' }}>New Listing</span>
          <h1 className="font-display" style={{ fontSize:'2.4rem', fontWeight:700, color:'#0a1628', marginBottom:32 }}>List Your Property</h1>
        </motion.div>

        {/* Steps */}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:36, overflowX:'auto', paddingBottom:4 }}>
          {STEPS.map((lbl, i) => (
            <div key={lbl} style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div className={`step-dot ${i<step?'done':i===step?'active':'pending'}`}>
                  {i<step ? <Check size={13} strokeWidth={3}/> : i+1}
                </div>
                <span style={{ fontSize:'0.65rem', color:i===step?'#d4a843':'#cdd3e0', whiteSpace:'nowrap' }}>{lbl}</span>
              </div>
              {i<STEPS.length-1 && <div style={{ width:28, height:1, background:i<step?'rgba(34,197,94,0.4)':'#e4e8f0', marginBottom:16 }} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
            transition={{ duration:0.28 }} className="card" style={{ borderRadius:24, padding:32 }}>

            {/* Step 0 */}
            {step===0 && (
              <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <h2 className="font-display" style={{ fontSize:'1.5rem', fontWeight:700, color:'#0a1628', marginBottom:4 }}>Basic Information</h2>
                {inp('Property Title *','title',{ placeholder:'e.g. Luxury 3 BHK Apartment in Bandra' })}
                <div>
                  <label className="lbl">Description *</label>
                  <textarea placeholder="Describe your property in detail…" value={f.description}
                    onChange={e => s('description',e.target.value)} rows={4}
                    className={`inp${err.description?' error':''}`}
                    style={{ padding:'12px 14px', borderRadius:14, resize:'none', marginTop:4 }} />
                  {err.description && <p style={{ fontSize:'0.75rem', color:'#f43f5e', marginTop:4 }}>{err.description}</p>}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div>
                    <label className="lbl">Listing Type</label>
                    <div style={{ display:'flex', gap:8, marginTop:6 }}>
                      {[['sell','For Sale'],['rent','For Rent']].map(([v,l]) => (
                        <button key={v} onClick={() => s('listing_type',v)}
                          style={{ flex:1, padding:'10px', borderRadius:12, fontSize:'0.85rem', fontWeight:600, background:f.listing_type===v?'linear-gradient(135deg,#ffe566,#f5c842)':'rgba(255,255,255,0.04)', border:f.listing_type===v?'none':'1px solid #1e1e2c', color:f.listing_type===v?'#f7f8fc':'#8694aa', cursor:'pointer', transition:'all 0.2s' }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="lbl">Property Type</label>
                    <select value={f.property_type} onChange={e => s('property_type',e.target.value)}
                      className="inp" style={{ padding:'12px 14px', borderRadius:14, marginTop:6, cursor:'pointer' }}>
                      {PROP_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 */}
            {step===1 && (
              <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <h2 className="font-display" style={{ fontSize:'1.5rem', fontWeight:700, color:'#0a1628', marginBottom:4 }}>Location & Pricing</h2>
                {inp('Full Address / Locality *','location',{ placeholder:'e.g. Koramangala, Bengaluru' })}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  {inp('City *','city',{ placeholder:'Mumbai' })}
                  {inp('State','state',{ placeholder:'Maharashtra' })}
                  {inp('Pincode','pincode',{ placeholder:'400001' })}
                  {inp('RERA Number','rera_number',{ placeholder:'MH/RERA/…' })}
                </div>
                <div>
                  <label className="lbl">Price (₹) *</label>
                  <div style={{ position:'relative' }}>
                    <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#d4a843', fontWeight:700 }}>₹</span>
                    <input type="number" placeholder="e.g. 5000000" value={f.price} onChange={e => s('price',e.target.value)}
                      className={`inp${err.price?' error':''}`} style={{ padding:'12px 14px 12px 30px', borderRadius:14, marginTop:4 }} />
                  </div>
                  {err.price && <p style={{ fontSize:'0.75rem', color:'#f43f5e', marginTop:4 }}>{err.price}</p>}
                  {f.price && !isNaN(+f.price) && (
                    <p style={{ fontSize:'0.78rem', color:'#d4a843', marginTop:5 }}>
                      {+f.price>=10000000 ? `₹${(+f.price/10000000).toFixed(2)} Crore` : +f.price>=100000 ? `₹${(+f.price/100000).toFixed(2)} Lakh` : `₹${(+f.price).toLocaleString('en-IN')}`}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step===2 && (
              <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                <h2 className="font-display" style={{ fontSize:'1.5rem', fontWeight:700, color:'#0a1628', marginBottom:4 }}>Property Specifications</h2>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
                  {inp('Bedrooms','bedrooms',{ type:'number', placeholder:'3' })}
                  {inp('Bathrooms','bathrooms',{ type:'number', placeholder:'2' })}
                  {inp('Area (sq.ft)','area_sqft',{ type:'number', placeholder:'1200' })}
                  {inp('Floor No.','floor',{ type:'number', placeholder:'5' })}
                  {inp('Total Floors','total_floors',{ type:'number', placeholder:'20' })}
                  {inp('Parking Spots','parking',{ type:'number', placeholder:'1' })}
                  {inp('Age (years)','age_years',{ type:'number', placeholder:'2' })}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div>
                    <label className="lbl">Facing</label>
                    <select value={f.facing} onChange={e => s('facing',e.target.value)} className="inp" style={{ padding:'12px 14px', borderRadius:14, marginTop:4, cursor:'pointer' }}>
                      <option value="">Select</option>
                      {['North','South','East','West','North-East','North-West','South-East','South-West'].map(d => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="lbl">Furnishing</label>
                    <select value={f.furnishing} onChange={e => s('furnishing',e.target.value)} className="inp" style={{ padding:'12px 14px', borderRadius:14, marginTop:4, cursor:'pointer' }}>
                      <option value="">Select</option>
                      {['Unfurnished','Semi-Furnished','Fully Furnished'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>
                {/* Images */}
                <div>
                  <label className="lbl">Property Images (URL)</label>
                  <div style={{ display:'flex', gap:8, marginTop:4 }}>
                    <input type="text" placeholder="https://images.unsplash.com/…" value={f.imgUrl}
                      onChange={e => s('imgUrl',e.target.value)}
                      onKeyDown={e => e.key==='Enter' && (e.preventDefault(), addImg())}
                      className="inp" style={{ flex:1, padding:'11px 14px', borderRadius:14 }} />
                    <motion.button whileTap={{ scale:0.95 }} onClick={addImg}
                      className="btn btn-primary" style={{ padding:'11px 18px', borderRadius:14, border:'none', cursor:'pointer', gap:5, flexShrink:0 }}>
                      <Plus size={15} /> Add
                    </motion.button>
                  </div>
                  {f.images.length>0 && (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(80px,1fr))', gap:8, marginTop:10 }}>
                      {f.images.map((url,i) => (
                        <div key={i} style={{ position:'relative', height:64, borderRadius:10, overflow:'hidden' }}>
                          <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e=>e.target.src='https://placehold.co/80x64/131318/555?text=img'} />
                          <button onClick={() => rmImg(i)} style={{ position:'absolute', top:3, right:3, width:18, height:18, borderRadius:'50%', background:'rgba(244,63,94,0.85)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step===3 && (
              <div>
                <h2 className="font-display" style={{ fontSize:'1.5rem', fontWeight:700, color:'#0a1628', marginBottom:6 }}>Amenities</h2>
                <p style={{ fontSize:'0.85rem', color:'#8694aa', marginBottom:20 }}>Select all amenities available in your property</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:8 }}>
                  {AMENITIES.map(a => (
                    <button key={a} onClick={() => togAmenity(a)}
                      style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderRadius:12, textAlign:'left', cursor:'pointer', transition:'all 0.2s', background:f.amenities.includes(a)?'rgba(245,200,66,0.08)':'rgba(255,255,255,0.03)', border:f.amenities.includes(a)?'1px solid rgba(245,200,66,0.28)':'1px solid #1e1e2c', color:f.amenities.includes(a)?'#f5c842':'#4a5568', fontSize:'0.82rem', fontWeight:500 }}>
                      <div style={{ width:18, height:18, borderRadius:5, background:f.amenities.includes(a)?'#f5c842':'rgba(255,255,255,0.06)', border:f.amenities.includes(a)?'none':'1px solid #1e1e2c', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' }}>
                        {f.amenities.includes(a) && <Check size={11} color="#07070a" strokeWidth={3} />}
                      </div>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step===4 && (
              <div>
                <h2 className="font-display" style={{ fontSize:'1.5rem', fontWeight:700, color:'#0a1628', marginBottom:20 }}>Review & Submit</h2>
                <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                  {[
                    ['Title',         f.title],
                    ['Type',          `${f.listing_type==='sell'?'For Sale':'For Rent'} · ${f.property_type}`],
                    ['Location',      [f.location,f.city,f.state].filter(Boolean).join(', ')],
                    ['Price',         f.price ? (f.price>=10000000?`₹${(+f.price/10000000).toFixed(2)} Cr`:f.price>=100000?`₹${(+f.price/100000).toFixed(2)} L`:`₹${(+f.price).toLocaleString('en-IN')}`):'-'],
                    ['Specs',         [f.bedrooms&&`${f.bedrooms} BHK`, f.bathrooms&&`${f.bathrooms} Bath`, f.area_sqft&&`${f.area_sqft} sq.ft`].filter(Boolean).join(' · ')||'—'],
                    ['Furnishing',    f.furnishing||'—'],
                    ['Amenities',     f.amenities.length?`${f.amenities.length} selected`:'None'],
                    ['Images',        `${f.images.length} image(s)`],
                  ].map(([l,v]) => (
                    <div key={l} style={{ display:'flex', gap:16, padding:'13px 0', borderBottom:'1px solid #1e1e2c' }}>
                      <span style={{ fontSize:'0.78rem', color:'#cdd3e0', width:100, flexShrink:0 }}>{l}</span>
                      <span style={{ fontSize:'0.875rem', color:'#0a1628', textTransform:'capitalize' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:20 }}>
          <button onClick={back} disabled={step===0}
            style={{ padding:'11px 24px', borderRadius:14, background:'rgba(255,255,255,0.05)', border:'1px solid #1e1e2c', color:step===0?'#cdd3e0':'#4a5568', cursor:step===0?'not-allowed':'pointer', opacity:step===0?0.4:1, fontSize:'0.875rem' }}>
            ← Back
          </button>
          {step<STEPS.length-1 ? (
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={next}
              className="btn btn-primary" style={{ padding:'11px 28px', borderRadius:14, border:'none', cursor:'pointer', gap:8 }}>
              Continue <ArrowRight size={15} />
            </motion.button>
          ) : (
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={submit} disabled={loading}
              className="btn btn-primary" style={{ padding:'11px 28px', borderRadius:14, border:'none', cursor:loading?'not-allowed':'pointer', gap:8, opacity:loading?0.7:1 }}>
              {loading ? <div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(0,0,0,0.25)', borderTopColor:'#f7f8fc', animation:'spin 0.8s linear infinite' }} /> : <><Check size={15} /> Submit Listing</>}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
