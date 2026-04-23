/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'","Georgia","serif"],
        body:    ["'Plus Jakarta Sans'","sans-serif"],
      },
      colors: {
        cream:  { 50:"#fffef9",100:"#fef9ef",200:"#fdf3dc" },
        navy:   { 900:"#0a1628",800:"#0f2040",700:"#162d55" },
        amber:  { DEFAULT:"#d4a843",light:"#e8c06a",dark:"#b8902a" },
        slate2: { 100:"#f1f3f7",200:"#e4e8f0",300:"#cdd3e0",500:"#8694aa",700:"#4a5568",900:"#1a202c" },
      },
      boxShadow: {
        "card":  "0 2px 16px rgba(10,22,40,0.08), 0 1px 4px rgba(10,22,40,0.04)",
        "card-hover": "0 12px 40px rgba(10,22,40,0.14), 0 4px 12px rgba(10,22,40,0.08)",
        "premium": "0 20px 60px rgba(10,22,40,0.12)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
        "shimmer": "shimmer 1.8s ease infinite",
      },
      keyframes: {
        fadeUp:  { from:{ opacity:0, transform:"translateY(24px)" }, to:{ opacity:1, transform:"translateY(0)" } },
        shimmer: { "0%":{ backgroundPosition:"-400% 0" },"100%":{ backgroundPosition:"400% 0" } },
      },
    },
  },
  plugins: [],
}
