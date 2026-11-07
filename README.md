# 🏠 EstateX — Premium Real Estate Platform

**React + Flask | Light Theme | 300 Pre-seeded Properties | JWT Auth | Full CRUD**

---

## ⚡ Quick Start

### Backend (Terminal 1)
```bash
cd backend
python -m venv venv

# Activate:
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt
python seed.py               # Seed 300 properties (run ONCE)
python run.py                # Server starts on http://localhost:5000
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev                  # Opens http://localhost:5173
```

---

## 👤 Demo Accounts (after seed.py)
| Email | Password |
|-------|----------|
| asjad@demo.com | demo1234 |
| priya@demo.com | demo1234 |
| rohit@demo.com | demo1234 |

---

## 📁 Project Structure
```
EstateX/
├── backend/
│   ├── app/
│   │   ├── __init__.py          Flask app factory
│   │   ├── config.py            JWT + DB config
│   │   ├── models.py            User, Property, SavedProperty, Review
│   │   ├── auth.py              Login / Signup / Refresh / /me
│   │   ├── property_routes.py   Full CRUD + Save + Filter + Pagination
│   │   ├── user_routes.py       Profile + Password change
│   │   ├── review_routes.py     Star reviews per property
│   │   └── routes.py            Health check
│   ├── run.py                   Entry point (auto creates DB)
│   ├── seed.py                  ← RUN THIS for 300 properties
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── main.jsx             Entry point
    │   ├── App.jsx              Router + Protected routes
    │   ├── index.css            Light premium design system
    │   ├── api/api.js           Axios + JWT auto-refresh
    │   ├── context/AuthContext  Global auth state
    │   ├── utils/               format.js, images.js
    │   ├── components/          Navbar, Footer, PropertyCard, ScrollToTop
    │   └── pages/               Home, Login, Register, Properties,
    │                            PropertyDetail, AddProperty, Dashboard
    ├── index.html               Playfair Display + Plus Jakarta Sans fonts
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh | Refresh token |
| GET | /api/auth/me | Current user |
| GET | /api/properties/ | List all (with filters) |
| GET | /api/properties/featured | Featured 9 |
| GET | /api/properties/stats | Counts |
| GET | /api/properties/:id | Detail + view++ |
| POST | /api/properties/add | Create (auth) |
| PUT | /api/properties/update/:id | Update (auth + owner) |
| DELETE | /api/properties/delete/:id | Delete (auth + owner) |
| POST | /api/properties/save/:id | Toggle save (auth) |
| GET | /api/properties/saved | Saved list (auth) |
| GET | /api/properties/my-listings | User's listings (auth) |
| GET | /api/reviews/:property_id | Get reviews |
| POST | /api/reviews/:property_id | Add review (auth) |
| PUT | /api/users/profile | Update profile (auth) |
| PUT | /api/users/change-password | Change password (auth) |

---

## 🚀 Deploy on Render + Vercel

### Backend → Render (free)
1. Go to render.com → New → Web Service
2. Connect your GitHub repo
3. Settings:
   - Root: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn run:app`
4. Add env vars: `SECRET_KEY`, `JWT_SECRET_KEY`
5. Deploy → copy the URL (e.g. https://estatex-api.onrender.com)

### Frontend → Vercel (free)
1. Go to vercel.com → Import project from GitHub
2. Root: `frontend`
3. Add env var: `VITE_API_URL=https://estatex-api.onrender.com/api`
4. In `frontend/src/api/api.js`, change:
   ```js
   baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'
   ```
5. Deploy → Live!

---

## Repository safety

- Clone the repository into a new folder; do not delete or overwrite an existing repository's contents as part of setup.
- Configure production secrets using environment variables. The demo accounts above are for local seeded development only; change or disable them before any public deployment.
- Keep the frontend and backend setup steps separate as described above.

## Author

Asjad Pathan · [GitHub](https://github.com/Asjadpathan31) · [Portfolio](https://asjadpathan31.github.io/portfolio/)
