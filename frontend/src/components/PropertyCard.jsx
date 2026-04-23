import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Bed, Bath, Maximize2, Heart, Eye, ArrowUpRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getImg } from '../utils/images'
import { fmtPrice, fmtArea } from '../utils/format'
import API from '../api/api'
import toast from 'react-hot-toast'

export default function PropertyCard({ property, index = 0 }) {
  const { user } = useAuth()
  const [saved, setSaved]   = useState(false)
  const [saving, setSaving] = useState(false)
  const img = getImg(property)

  const handleSave = async e => {
    e.preventDefault(); e.stopPropagation()
    if (!user) { toast.error('Login to save properties'); return }
    setSaving(true)
    try {
      const res = await API.post(`/properties/save/${property.id}`)
      setSaved(res.data.saved)
      toast.success(res.data.message)
    } catch { toast.error('Something went wrong') }
    finally { setSaving(false) }
  }

  return (
    <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:index*0.05, ease:[0.22,1,0.36,1] }}>
      <Link to={`/properties/${property.id}`} style={{ textDecoration:'none', display:'block' }}>
        <motion.div whileHover={{ y:-5 }} transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
          className="card" style={{ borderRadius:20, overflow:'hidden', cursor:'pointer' }}>

          {/* Image */}
          <div className="prop-img" style={{ position:'relative', height:220, overflow:'hidden' }}>
            <img src={img} alt={property.title}
              onError={e => e.target.src='https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=85'}
              style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(10,22,40,0.55) 0%,transparent 55%)' }}/>

            {/* Badges */}
            <div style={{ position:'absolute', top:12, left:12, display:'flex', gap:6 }}>
              <span className="badge badge-white" style={{ fontSize:'0.67rem', fontWeight:700 }}>
                {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
              {property.is_featured && <span className="badge badge-amber">★ Featured</span>}
              {property.is_verified && (
                <span className="badge badge-white" style={{ color:'#059669', fontSize:'0.67rem' }}>
                  <CheckCircle size={9}/> Verified
                </span>
              )}
            </div>

            {/* Save */}
            <motion.button whileTap={{ scale:0.85 }} onClick={handleSave} disabled={saving}
              style={{ position:'absolute', top:12, right:12, width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.9)', backdropFilter:'blur(8px)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(10,22,40,0.15)' }}>
              <Heart size={15} fill={saved?'#dc2626':'none'} color={saved?'#dc2626':'#4a5568'}/>
            </motion.button>

            {/* Bottom overlay */}
            <div style={{ position:'absolute', bottom:12, left:12, right:12, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <span style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.9)', background:'rgba(10,22,40,0.55)', backdropFilter:'blur(8px)', padding:'4px 10px', borderRadius:7 }}>
                {property.property_type}
              </span>
              <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.7rem', color:'rgba(255,255,255,0.7)', background:'rgba(10,22,40,0.5)', padding:'4px 8px', borderRadius:7, backdropFilter:'blur(8px)' }}>
                <Eye size={11}/> {property.views}
              </span>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding:'18px 20px 20px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:8 }}>
              <h3 className="line-clamp-1 font-display" style={{ fontSize:'1.05rem', fontWeight:700, color:'#0a1628', flex:1, lineHeight:1.3 }}>
                {property.title}
              </h3>
              <ArrowUpRight size={15} style={{ color:'#d4a843', flexShrink:0, marginTop:3 }}/>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:12 }}>
              <MapPin size={12} style={{ color:'#8694aa', flexShrink:0 }}/>
              <span className="line-clamp-1" style={{ fontSize:'0.78rem', color:'#8694aa' }}>
                {property.location}, {property.city}
              </span>
            </div>

            {(property.bedrooms || property.bathrooms || property.area_sqft) && (
              <div style={{ display:'flex', gap:16, paddingBottom:14, marginBottom:14, borderBottom:'1px solid #f1f3f7' }}>
                {property.bedrooms && (
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <Bed size={13} style={{ color:'#cdd3e0' }}/>
                    <span style={{ fontSize:'0.78rem', color:'#4a5568', fontWeight:500 }}>{property.bedrooms} BHK</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <Bath size={13} style={{ color:'#cdd3e0' }}/>
                    <span style={{ fontSize:'0.78rem', color:'#4a5568', fontWeight:500 }}>{property.bathrooms} Bath</span>
                  </div>
                )}
                {property.area_sqft && (
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <Maximize2 size={12} style={{ color:'#cdd3e0' }}/>
                    <span style={{ fontSize:'0.78rem', color:'#4a5568', fontWeight:500 }}>{fmtArea(property.area_sqft)}</span>
                  </div>
                )}
              </div>
            )}

            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
              <div>
                <p style={{ fontSize:'0.65rem', color:'#8694aa', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>
                  {property.listing_type==='rent' ? 'Monthly Rent' : 'Asking Price'}
                </p>
                <p className="price" style={{ fontSize:'1.35rem' }}>{fmtPrice(property.price)}</p>
              </div>
              {property.furnishing && (
                <span style={{ fontSize:'0.68rem', color:'#8694aa', background:'#f1f3f7', border:'1px solid #e4e8f0', borderRadius:7, padding:'3px 9px', fontWeight:500 }}>
                  {property.furnishing.replace('-Furnished','').trim()}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
