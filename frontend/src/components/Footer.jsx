import { Link } from 'react-router-dom'
import { Building2, MapPin, Phone, Mail, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background:'#0a1628', color:'#fff' }}>
      <div style={{ maxWidth:1320, margin:'0 auto', padding:'64px 24px 32px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:40, marginBottom:48 }}>
          <div>
            <Link to="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#e8c06a,#d4a843)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Building2 size={17} color="#0a1628"/>
              </div>
              <span className="font-display" style={{ fontSize:'1.3rem',fontWeight:700,color:'#fff' }}>
                Estate<span style={{ color:'#d4a843' }}>X</span>
              </span>
            </Link>
            <p style={{ fontSize:'0.85rem',color:'rgba(255,255,255,0.55)',lineHeight:1.7,marginBottom:20,maxWidth:240 }}>
              India's trusted premium real estate platform. Verified properties across 15+ cities.
            </p>
            <div style={{ display:'flex', gap:8 }}>
              {[Instagram,Twitter,Linkedin,Youtube].map((Icon,i) => (
                <a key={i} href="#" style={{ width:34,height:34,borderRadius:9,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.55)',textDecoration:'none',transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(212,168,67,0.2)'; e.currentTarget.style.color='#d4a843'; e.currentTarget.style.borderColor='rgba(212,168,67,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='rgba(255,255,255,0.55)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.12)' }}>
                  <Icon size={15}/>
                </a>
              ))}
            </div>
          </div>

          {[
            { title:'Explore', links:[['/', 'Home'],['/properties','All Properties'],['/properties?listing_type=sell','Buy Property'],['/properties?listing_type=rent','Rent Property'],['/add-property','List Property']] },
            { title:'Property Types', links:[['/properties?type=apartment','Apartments'],['/properties?type=villa','Villas'],['/properties?type=penthouse','Penthouses'],['/properties?type=commercial','Commercial'],['/properties?type=plot','Plots']] },
          ].map(section => (
            <div key={section.title}>
              <h4 style={{ fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'#d4a843',marginBottom:16 }}>{section.title}</h4>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:9 }}>
                {section.links.map(([to,label]) => (
                  <li key={to}>
                    <Link to={to} style={{ fontSize:'0.85rem',color:'rgba(255,255,255,0.55)',textDecoration:'none',transition:'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color='#d4a843'}
                      onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.55)'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 style={{ fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'#d4a843',marginBottom:16 }}>Contact</h4>
            {[{ Icon:MapPin,text:'Mumbai, Maharashtra, India' },{ Icon:Phone,text:'+91 98765 43210' },{ Icon:Mail,text:'hello@estatex.in' }].map(({ Icon,text }) => (
              <div key={text} style={{ display:'flex',alignItems:'flex-start',gap:10,marginBottom:12 }}>
                <Icon size={14} style={{ color:'#d4a843',marginTop:3,flexShrink:0 }}/>
                <span style={{ fontSize:'0.85rem',color:'rgba(255,255,255,0.55)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height:1, background:'rgba(255,255,255,0.1)', marginBottom:24 }}/>
        <div style={{ display:'flex',flexWrap:'wrap',justifyContent:'space-between',alignItems:'center',gap:12 }}>
          <p style={{ fontSize:'0.78rem',color:'rgba(255,255,255,0.35)' }}>© {new Date().getFullYear()} EstateX. All rights reserved. Made with ❤️ in India.</p>
          <div style={{ display:'flex',gap:20 }}>
            {['Privacy','Terms','Cookies'].map(t => (
              <a key={t} href="#" style={{ fontSize:'0.78rem',color:'rgba(255,255,255,0.35)',textDecoration:'none',transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='#d4a843'}
                onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.35)'}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
