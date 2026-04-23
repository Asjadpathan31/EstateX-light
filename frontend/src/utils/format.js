export function fmtPrice(price, listing_type) {
  if (!price) return '—'
  let s
  if (price >= 10000000)    s = `₹${(price/10000000).toFixed(2)} Cr`
  else if (price >= 100000) s = `₹${(price/100000).toFixed(2)} L`
  else                      s = `₹${price.toLocaleString('en-IN')}`
  if (listing_type === 'rent') s += '/mo'
  return s
}

export function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' })
}

export function fmtArea(sqft) {
  if (!sqft) return null
  return `${Number(sqft).toLocaleString('en-IN')} sq.ft`
}
