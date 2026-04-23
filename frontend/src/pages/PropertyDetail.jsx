import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Bed, Bath, Maximize2, Eye, Heart, Share2, Phone, Mail, ArrowLeft, Check, ChevronLeft, ChevronRight, Star, CheckCircle, Calendar, Home } from 'lucide-react'
import API from '../api/api'
import { useAuth } from '../context/AuthContext'
import { getImg, TYPE_IMAGES } from '../utils/images'
import { fmtPrice, fmtDate, fmtArea } from '../utils/format'
import toast from 'react-hot-toast'

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={14} className={n <= rating ? 'star-filled' : 'star-empty'} />
      ))}
    </div>
  )
}

export default function PropertyDetail() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const [prop, setProp]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved]     = useState(false)
  const [imgIdx, setImgIdx]   = useState(0)
  const [reviews, setReviews] = useState([])
  const [newRev, setNewRev]   = useState({ rating: 5, comment: '' })
  const [subRev, setSubRev]   = useState(false)

  useEffect(() => {
    Promise.all([
      API.get(`/properties/${id}`),
      API.get(`/reviews/${id}`),
    ]).then(([r1, r2]) => { setProp(r1.data); setReviews(r2.data) })
      .catch(() => navigate('/properties'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleSave = async () => {
    if (!user) { toast.error('Login to save properties'); return }
    try {
      const res = await API.post(`/properties/save/${id}`)
      setSaved(res.data.saved); toast.success(res.data.message)
    } catch { toast.error('Error') }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied!')
  }

  const submitReview = async () => {
    if (!user) { toast.error('Login to leave a review'); return }
    setSubRev(true)
    try {
      const res = await API.post(`/reviews/${id}`, newRev)
      setReviews(p => [res.data.review, ...p])
      setNewRev({ rating: 5, comment: '' })
      toast.success('Review added!')
    } catch { toast.error('Could not add review') }
    finally { setSubRev(false) }
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f7f8fc', paddingTop:72 }}>
      <div style={{ width:40, height:40, borderRadius:'50%', border:'2px solid transparent', borderTopColor:'#d4a843', borderRightColor:'#d4a843', animation:'spin 0.8s linear infinite' }} />
    </div>
  )
  if (!prop) return null

  const imgs = prop.images?.length > 0 ? prop.images : [TYPE_IMAGES[prop.property_type] || TYPE_IMAGES.default]

  const details = [
    { label: 'Property Type', value: prop.property_type },
    { label: 'Listing Type',  value: prop.listing_type === 'rent' ? 'For Rent' : 'For Sale' },
    { label: 'City',          value: prop.city },
    { label: 'Furnishing',    value: prop.furnishing || '—' },
    { label: 'Facing',        value: prop.facing    || '—' },
    { label: 'Age',           value: prop.age_years != null ? `${prop.age_years} yr${prop.age_years !== 1 ? 's' : ''}` : '—' },
    { label: 'Parking',       value: prop.parking   || '—' },
    { label: 'Floor',         value: prop.floor && prop.total_floors ? `${prop.floor} / ${prop.total_floors}` : '—' },
    { label: 'Listed',        value: fmtDate(prop.created_at) },
    ...(prop.rera_number ? [{ label: 'RERA No.', value: prop.rera_number }] : []),
  ]

  return (
    <div style={{ background: '#f7f8fc', minHeight: '100vh', paddingTop: 72 }}>
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '28px 24px' }}>

        {/* Back */}
        <motion.button initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
          onClick={() => navigate(-1)}
          style={{ display:'flex', alignItems:'center', gap:6, marginBottom:24, background:'none', border:'none', cursor:'pointer', color:'#8694aa', fontSize:'0.875rem' }}>
          <ArrowLeft size={15} /> Back to Properties
        </motion.button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 28 }} className="detail-grid">

          {/* LEFT col */}
          <div>
            {/* Gallery */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              style={{ position:'relative', borderRadius:24, overflow:'hidden', height:'clamp(260px,45vw,500px)', marginBottom:20, background:'#fff' }}>
              <AnimatePresence mode="wait">
                <motion.img key={imgIdx} src={imgs[imgIdx]} alt={prop.title}
                  initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                  onError={e => e.target.src = TYPE_IMAGES.default} />
              </AnimatePresence>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(7,7,10,0.65) 0%, transparent 50%)' }} />

              {/* Badges */}
              <div style={{ position:'absolute', top:14, left:14, display:'flex', gap:6 }}>
                <span className="badge badge-gold">{prop.listing_type === 'rent' ? 'For Rent' : 'For Sale'}</span>
                {prop.is_featured && <span className="badge badge-gold">★ Featured</span>}
                {prop.is_verified && <span className="badge badge-green"><CheckCircle size={10} /> Verified</span>}
              </div>

              {/* Actions */}
              <div style={{ position:'absolute', top:14, right:14, display:'flex', gap:8 }}>
                {[
                  { icon: Heart,  onClick: handleSave,  filled: saved,  fillColor:'#f43f5e' },
                  { icon: Share2, onClick: handleShare, filled: false },
                ].map((btn, i) => (
                  <motion.button key={i} whileTap={{ scale:0.85 }} onClick={btn.onClick}
                    style={{ width:38, height:38, borderRadius:11, background:'rgba(7,7,10,0.65)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(8px)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <btn.icon size={16} fill={btn.filled ? btn.fillColor : 'none'} color={btn.filled ? btn.fillColor : '#0a1628'} />
                  </motion.button>
                ))}
              </div>

              {imgs.length > 1 && (
                <>
                  {[{ dir:-1, Icon:ChevronLeft, side:'left' }, { dir:1, Icon:ChevronRight, side:'right' }].map(({ dir, Icon, side }) => (
                    <button key={side} onClick={() => setImgIdx(i => (i + dir + imgs.length) % imgs.length)}
                      style={{ position:'absolute', [side]:14, top:'50%', transform:'translateY(-50%)', width:38, height:38, borderRadius:11, background:'rgba(7,7,10,0.65)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(8px)', cursor:'pointer', color:'#0a1628', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={20} />
                    </button>
                  ))}
                  <div style={{ position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)', display:'flex', gap:5 }}>
                    {imgs.map((_, i) => (
                      <div key={i} onClick={() => setImgIdx(i)} className={`gallery-dot${i===imgIdx?' active':''}`}
                        style={{ width: i===imgIdx ? 24 : 8, cursor:'pointer' }} />
                    ))}
                  </div>
                </>
              )}

              <div style={{ position:'absolute', bottom:14, right:14, display:'flex', alignItems:'center', gap:5, background:'rgba(7,7,10,0.65)', backdropFilter:'blur(8px)', padding:'5px 10px', borderRadius:9, fontSize:'0.75rem', color:'rgba(255,255,255,0.5)' }}>
                <Eye size={12} /> {prop.views}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {imgs.length > 1 && (
              <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
                {imgs.map((src, i) => (
                  <div key={i} onClick={() => setImgIdx(i)} style={{ width:72, height:52, borderRadius:10, overflow:'hidden', flexShrink:0, cursor:'pointer', border: i===imgIdx ? '2px solid #d4a843' : '2px solid transparent', transition:'border 0.25s', opacity: i===imgIdx ? 1 : 0.55 }}>
                    <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={e => e.target.src=TYPE_IMAGES.default} />
                  </div>
                ))}
              </div>
            )}

            {/* Title card */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
              className="card" style={{ borderRadius:22, padding:'28px', marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:12 }}>
                <h1 className="font-display" style={{ fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:700, color:'#0a1628', lineHeight:1.15 }}>{prop.title}</h1>
                {prop.avg_rating > 0 && (
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                    <Stars rating={Math.round(prop.avg_rating)} />
                    <span style={{ fontSize:'0.8rem', color:'#8694aa' }}>({prop.review_count})</span>
                  </div>
                )}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:20 }}>
                <MapPin size={14} style={{ color:'#d4a843', flexShrink:0 }} />
                <span style={{ color:'#4a5568', fontSize:'0.9rem' }}>{prop.location}, {prop.city}{prop.state ? `, ${prop.state}` : ''}</span>
              </div>

              {/* Specs */}
              {(prop.bedrooms || prop.bathrooms || prop.area_sqft) && (
                <div style={{ display:'flex', gap:20, paddingTop:20, borderTop:'1px solid #1e1e2c' }}>
                  {prop.bedrooms   && <div style={{ textAlign:'center' }}><Bed size={20} style={{ color:'#d4a843', margin:'0 auto 6px' }} /><p style={{ fontWeight:600, color:'#0a1628' }}>{prop.bedrooms} BHK</p><p style={{ fontSize:'0.72rem', color:'#cdd3e0' }}>Bedrooms</p></div>}
                  {prop.bathrooms  && <div style={{ textAlign:'center' }}><Bath size={20} style={{ color:'#d4a843', margin:'0 auto 6px' }} /><p style={{ fontWeight:600, color:'#0a1628' }}>{prop.bathrooms}</p><p style={{ fontSize:'0.72rem', color:'#cdd3e0' }}>Bathrooms</p></div>}
                  {prop.area_sqft  && <div style={{ textAlign:'center' }}><Maximize2 size={20} style={{ color:'#d4a843', margin:'0 auto 6px' }} /><p style={{ fontWeight:600, color:'#0a1628' }}>{fmtArea(prop.area_sqft)}</p><p style={{ fontSize:'0.72rem', color:'#cdd3e0' }}>Area</p></div>}
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
              className="card" style={{ borderRadius:22, padding:'28px', marginBottom:16 }}>
              <h2 className="font-display" style={{ fontSize:'1.25rem', fontWeight:700, color:'#0a1628', marginBottom:14 }}>About This Property</h2>
              <p style={{ color:'#4a5568', lineHeight:1.8, fontSize:'0.9rem' }}>{prop.description}</p>
            </motion.div>

            {/* Amenities */}
            {prop.amenities?.length > 0 && (
              <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                className="card" style={{ borderRadius:22, padding:'28px', marginBottom:16 }}>
                <h2 className="font-display" style={{ fontSize:'1.25rem', fontWeight:700, color:'#0a1628', marginBottom:16 }}>Amenities</h2>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
                  {prop.amenities.map(a => (
                    <div key={a} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderRadius:12, background:'rgba(245,200,66,0.04)', border:'1px solid rgba(245,200,66,0.09)' }}>
                      <div style={{ width:20, height:20, borderRadius:6, background:'rgba(34,197,94,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Check size={11} color="#4ade80" strokeWidth={3} />
                      </div>
                      <span style={{ fontSize:'0.82rem', color:'#4a5568' }}>{a}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Details grid */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
              className="card" style={{ borderRadius:22, padding:'28px', marginBottom:16 }}>
              <h2 className="font-display" style={{ fontSize:'1.25rem', fontWeight:700, color:'#0a1628', marginBottom:16 }}>Property Details</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
                {details.map(d => (
                  <div key={d.label} style={{ padding:'12px 14px', borderRadius:12, background:'rgba(255,255,255,0.025)' }}>
                    <p style={{ fontSize:'0.68rem', color:'#cdd3e0', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>{d.label}</p>
                    <p style={{ fontSize:'0.875rem', fontWeight:500, color:'#0a1628', textTransform:'capitalize' }}>{d.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
              className="card" style={{ borderRadius:22, padding:'28px' }}>
              <h2 className="font-display" style={{ fontSize:'1.25rem', fontWeight:700, color:'#0a1628', marginBottom:20 }}>
                Reviews {reviews.length > 0 && `(${reviews.length})`}
              </h2>

              {/* Add review */}
              {user && (
                <div style={{ marginBottom:24, padding:20, borderRadius:16, background:'rgba(245,200,66,0.04)', border:'1px solid rgba(245,200,66,0.09)' }}>
                  <p style={{ fontSize:'0.8rem', fontWeight:600, color:'#4a5568', marginBottom:10 }}>Your Rating</p>
                  <div style={{ display:'flex', gap:6, marginBottom:12 }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setNewRev(p => ({ ...p, rating:n }))}
                        style={{ background:'none', border:'none', cursor:'pointer', padding:0 }}>
                        <Star size={22} className={n <= newRev.rating ? 'star-filled' : 'star-empty'} />
                      </button>
                    ))}
                  </div>
                  <textarea placeholder="Share your experience…" value={newRev.comment}
                    onChange={e => setNewRev(p => ({ ...p, comment:e.target.value }))} rows={3}
                    className="inp" style={{ padding:'10px 14px', borderRadius:14, resize:'none', marginBottom:10 }} />
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={submitReview} disabled={subRev}
                    className="btn btn-primary" style={{ padding:'10px 24px', borderRadius:12, border:'none', cursor:'pointer', fontSize:'0.85rem', opacity:subRev?0.7:1 }}>
                    {subRev ? 'Submitting…' : 'Submit Review'}
                  </motion.button>
                </div>
              )}

              {reviews.length === 0 ? (
                <p style={{ color:'#cdd3e0', fontSize:'0.875rem', textAlign:'center', padding:'24px 0' }}>No reviews yet. Be the first!</p>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {reviews.map(r => (
                    <div key={r.id} style={{ padding:'16px', borderRadius:14, background:'rgba(255,255,255,0.025)', border:'1px solid #1e1e2c' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#ffe566,#f5c842)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.8rem', color:'#f7f8fc' }}>
                            {r.user?.username?.[0]?.toUpperCase()}
                          </div>
                          <span style={{ fontWeight:500, fontSize:'0.875rem', color:'#0a1628' }}>{r.user?.username}</span>
                        </div>
                        <Stars rating={r.rating} />
                      </div>
                      {r.comment && <p style={{ fontSize:'0.85rem', color:'#4a5568', lineHeight:1.6 }}>{r.comment}</p>}
                      <p style={{ fontSize:'0.72rem', color:'#cdd3e0', marginTop:6 }}>{fmtDate(r.created_at)}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div>
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15 }}
              className="card" style={{ borderRadius:22, padding:'28px', position:'sticky', top:90 }}>
              <p style={{ fontSize:'0.68rem', color:'#cdd3e0', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:4 }}>
                {prop.listing_type === 'rent' ? 'Monthly Rent' : 'Asking Price'}
              </p>
              <p className="price font-display" style={{ fontSize:'2.2rem', marginBottom:4 }}>{fmtPrice(prop.price)}</p>
              {prop.area_sqft && (
                <p style={{ fontSize:'0.78rem', color:'#8694aa', marginBottom:20 }}>
                  ₹{Math.round(prop.price / prop.area_sqft).toLocaleString('en-IN')} per sq.ft
                </p>
              )}

              <div className="divider" style={{ marginBottom:20 }} />

              {/* Owner */}
              {prop.owner && (
                <div style={{ marginBottom:20 }}>
                  <p style={{ fontSize:'0.68rem', color:'#cdd3e0', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>Listed By</p>
                  <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:14, background:'rgba(255,255,255,0.03)', border:'1px solid #1e1e2c' }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#ffe566,#f5c842)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.9rem', color:'#f7f8fc', flexShrink:0 }}>
                      {prop.owner.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight:600, fontSize:'0.875rem', color:'#0a1628' }}>{prop.owner.username}</p>
                      <p style={{ fontSize:'0.72rem', color:'#cdd3e0', marginTop:2 }}>
                        {prop.owner.role === 'agent' ? '🏅 Verified Agent' : 'Owner'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {prop.owner?.phone ? (
                  <a href={`tel:${prop.owner.phone}`} style={{ textDecoration:'none' }}>
                    <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                      className="btn btn-primary" style={{ width:'100%', padding:'13px', borderRadius:14, fontSize:'0.9rem', gap:8 }}>
                      <Phone size={15} /> Call Owner
                    </motion.button>
                  </a>
                ) : (
                  <motion.button whileHover={{ scale:1.01 }} className="btn btn-primary" style={{ width:'100%', padding:'13px', borderRadius:14, fontSize:'0.9rem', gap:8 }}>
                    <Phone size={15} /> Contact Owner
                  </motion.button>
                )}
                {prop.owner?.email && (
                  <a href={`mailto:${prop.owner.email}?subject=Enquiry: ${prop.title}`} style={{ textDecoration:'none' }}>
                    <motion.button whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                      className="btn btn-outline-amber" style={{ width:'100%', padding:'13px', borderRadius:14, fontSize:'0.9rem', gap:8 }}>
                      <Mail size={15} /> Send Enquiry
                    </motion.button>
                  </a>
                )}
                {!user && (
                  <Link to="/login" style={{ textDecoration:'none' }}>
                    <button className="btn btn-outline-amber" style={{ width:'100%', padding:'13px', borderRadius:14, fontSize:'0.9rem', cursor:'pointer' }}>
                      Login to Contact
                    </button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) { .detail-grid { grid-template-columns: 1fr 340px !important; } }
      `}</style>
    </div>
  )
}
