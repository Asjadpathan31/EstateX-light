import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Building2 } from 'lucide-react'
import API from '../api/api'
import PropertyCard from '../components/PropertyCard'

const TYPES      = ['apartment','villa','house','commercial','plot','penthouse','studio']
const FURNISHING = ['Unfurnished','Semi-Furnished','Fully Furnished']
const SORT_OPTS  = [
  { v:'created_at',  l:'Newest First' },
  { v:'price_asc',   l:'Price: Low → High' },
  { v:'price_desc',  l:'Price: High → Low' },
  { v:'views',       l:'Most Popular' },
  { v:'area',        l:'Largest Area' },
]

function Skel() {
  return (
    <div style={{ borderRadius: 22, overflow: 'hidden', background: '#fff', border: '1px solid #1e1e2c' }}>
      <div className="skel" style={{ height: 228 }} />
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skel" style={{ height: 16, width: '72%' }} />
        <div className="skel" style={{ height: 12, width: '48%' }} />
        <div className="skel" style={{ height: 10, width: '60%' }} />
        <div className="skel" style={{ height: 22, width: '38%', marginTop: 8 }} />
      </div>
    </div>
  )
}

export default function Properties() {
  const [sp, setSp] = useSearchParams()
  const [data, setData] = useState({ properties: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [f, setF] = useState({
    search:       sp.get('search')       || '',
    listing_type: sp.get('listing_type') || '',
    type:         sp.get('type')         || '',
    city:         sp.get('city')         || '',
    bedrooms:     sp.get('bedrooms')     || '',
    furnishing:   '',
    min_price:    '',
    max_price:    '',
    sort_by:      'created_at',
    page:         1,
  })

  const upd = (k, v) => setF(p => ({ ...p, [k]: v, page: 1 }))
  const clear = () => setF({ search:'', listing_type:'', type:'', city:'', bedrooms:'', furnishing:'', min_price:'', max_price:'', sort_by:'created_at', page:1 })

  const fetch_ = useCallback(async () => {
    setLoading(true)
    try {
      const q = new URLSearchParams()
      Object.entries(f).forEach(([k, v]) => { if (v !== '' && k !== 'page') q.set(k, v) })
      q.set('page', f.page); q.set('per_page', 12)
      const res = await API.get(`/properties/?${q}`)
      setData(res.data)
    } catch { setData({ properties:[], total:0, pages:1 }) }
    finally { setLoading(false) }
  }, [f])

  useEffect(() => { fetch_() }, [fetch_])

  const activeCount = [f.listing_type, f.type, f.city, f.bedrooms, f.furnishing, f.min_price, f.max_price].filter(Boolean).length

  return (
    <div style={{ background: '#f7f8fc', minHeight: '100vh', paddingTop: 72 }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #1e1e2c', padding: '40px 24px 28px' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <span className="eyebrow" style={{ marginBottom: 10, display: 'inline-flex' }}>Explore</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
            <div>
              <h1 className="font-display" style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 700, color: '#0a1628' }}>All Properties</h1>
              {!loading && <p style={{ fontSize: '0.85rem', color: '#8694aa', marginTop: 4 }}>{data.total.toLocaleString('en-IN')} properties found</p>}
            </div>
            {/* Search + filter toggle */}
            <div style={{ display: 'flex', gap: 10, flex: '1 1 300px', maxWidth: 560 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#cdd3e0' }} />
                <input type="text" placeholder="Search city, title, locality…" value={f.search}
                  onChange={e => upd('search', e.target.value)}
                  className="inp" style={{ padding: '11px 14px 11px 38px', borderRadius: 14 }} />
              </div>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setFiltersOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '11px 16px', borderRadius: 14,
                  background: filtersOpen ? 'rgba(245,200,66,0.1)' : 'rgba(255,255,255,0.04)',
                  border: filtersOpen ? '1px solid rgba(245,200,66,0.35)' : '1px solid #1e1e2c',
                  color: filtersOpen ? '#f5c842' : '#4a5568', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: 500, position: 'relative', flexShrink: 0,
                }}>
                <SlidersHorizontal size={15} /> Filters
                {activeCount > 0 && (
                  <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#f5c842', color: '#f7f8fc', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {activeCount}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Listing tabs */}
          <div style={{ display: 'flex', gap: 6 }}>
            {[['', 'All'], ['sell', 'Buy'], ['rent', 'Rent']].map(([v, l]) => (
              <button key={v} onClick={() => upd('listing_type', v)} className={`chip${f.listing_type === v ? ' on' : ''}`}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }} style={{ overflow: 'hidden', background: '#fff', borderBottom: '1px solid #1e1e2c' }}>
            <div style={{ maxWidth: 1320, margin: '0 auto', padding: '28px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
                {/* Type */}
                <div>
                  <label className="lbl">Property Type</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {TYPES.map(t => (
                      <button key={t} onClick={() => upd('type', f.type === t ? '' : t)} className={`chip capitalize${f.type === t ? ' on' : ''}`}>{t}</button>
                    ))}
                  </div>
                </div>
                {/* BHK */}
                <div>
                  <label className="lbl">Bedrooms (BHK)</label>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => upd('bedrooms', f.bedrooms == n ? '' : n)}
                        style={{ width: 36, height: 36, borderRadius: 10, border: f.bedrooms == n ? '1px solid rgba(245,200,66,0.4)' : '1px solid #1e1e2c', background: f.bedrooms == n ? 'rgba(245,200,66,0.12)' : 'rgba(255,255,255,0.03)', color: f.bedrooms == n ? '#f5c842' : '#8694aa', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Furnishing */}
                <div>
                  <label className="lbl">Furnishing</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
                    {FURNISHING.map(fv => (
                      <button key={fv} onClick={() => upd('furnishing', f.furnishing === fv ? '' : fv)} className={`chip${f.furnishing === fv ? ' on' : ''}`} style={{ justifyContent: 'flex-start' }}>{fv}</button>
                    ))}
                  </div>
                </div>
                {/* Price */}
                <div>
                  <label className="lbl">Price Range (₹)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                    <input type="number" placeholder="Min price" value={f.min_price} onChange={e => upd('min_price', e.target.value)}
                      className="inp" style={{ padding: '10px 12px', borderRadius: 12, fontSize: '0.85rem' }} />
                    <input type="number" placeholder="Max price" value={f.max_price} onChange={e => upd('max_price', e.target.value)}
                      className="inp" style={{ padding: '10px 12px', borderRadius: 12, fontSize: '0.85rem' }} />
                  </div>
                </div>
                {/* City */}
                <div>
                  <label className="lbl">City</label>
                  <input type="text" placeholder="e.g. Mumbai" value={f.city} onChange={e => upd('city', e.target.value)}
                    className="inp" style={{ padding: '10px 12px', borderRadius: 12, fontSize: '0.85rem', marginTop: 8 }} />
                </div>
                {/* Sort */}
                <div>
                  <label className="lbl">Sort By</label>
                  <select value={f.sort_by} onChange={e => upd('sort_by', e.target.value)}
                    className="inp" style={{ padding: '10px 12px', borderRadius: 12, fontSize: '0.85rem', marginTop: 8, cursor: 'pointer' }}>
                    {SORT_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, paddingTop: 20, borderTop: '1px solid #1e1e2c' }}>
                <button onClick={clear} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#f43f5e', fontSize: '0.85rem', fontWeight: 500 }}>
                  <X size={14} /> Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '40px 24px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {Array(12).fill(0).map((_, i) => <Skel key={i} />)}
          </div>
        ) : data.properties.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '100px 0' }}>
            <Building2 size={52} style={{ color: '#cdd3e0', margin: '0 auto 16px' }} />
            <h3 className="font-display" style={{ fontSize: '1.6rem', color: '#0a1628', marginBottom: 10 }}>No Properties Found</h3>
            <p style={{ color: '#8694aa', marginBottom: 24 }}>Try adjusting your search or clear filters</p>
            <button onClick={clear} className="btn btn-primary" style={{ padding: '12px 28px', borderRadius: 14, border: 'none', cursor: 'pointer' }}>Clear Filters</button>
          </motion.div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {data.properties.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
            </div>

            {/* Pagination */}
            {data.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 56 }}>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setF(p => ({ ...p, page: p.page - 1 }))} disabled={f.page === 1}
                  style={{ width: 38, height: 38, borderRadius: 11, border: '1px solid #1e1e2c', background: 'rgba(255,255,255,0.04)', color: '#4a5568', cursor: f.page === 1 ? 'not-allowed' : 'pointer', opacity: f.page === 1 ? 0.35 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronLeft size={17} />
                </motion.button>
                {Array.from({ length: Math.min(data.pages, 8) }, (_, i) => i + 1).map(n => (
                  <motion.button key={n} whileTap={{ scale: 0.9 }} onClick={() => setF(p => ({ ...p, page: n }))}
                    style={{ width: 38, height: 38, borderRadius: 11, border: f.page === n ? 'none' : '1px solid #1e1e2c', background: f.page === n ? 'linear-gradient(135deg,#ffe566,#f5c842)' : 'rgba(255,255,255,0.04)', color: f.page === n ? '#f7f8fc' : '#4a5568', cursor: 'pointer', fontSize: '0.85rem', fontWeight: f.page === n ? 700 : 400 }}>
                    {n}
                  </motion.button>
                ))}
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setF(p => ({ ...p, page: p.page + 1 }))} disabled={f.page === data.pages}
                  style={{ width: 38, height: 38, borderRadius: 11, border: '1px solid #1e1e2c', background: 'rgba(255,255,255,0.04)', color: '#4a5568', cursor: f.page === data.pages ? 'not-allowed' : 'pointer', opacity: f.page === data.pages ? 0.35 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ChevronRight size={17} />
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
