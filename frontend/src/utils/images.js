export const TYPE_IMAGES = {
  apartment:  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=85',
  villa:      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=85',
  house:      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=85',
  commercial: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=85',
  plot:       'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=85',
  penthouse:  'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=85',
  studio:     'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=85',
  default:    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=85',
}
export const getImg = p => p?.images?.[0] || TYPE_IMAGES[p?.property_type] || TYPE_IMAGES.default
