"""Run once: python seed.py"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app import create_app, db
from app.models import User, Property
from flask_bcrypt import Bcrypt
import json, random

app   = create_app()
bc    = Bcrypt(app)

# ── Beautiful real property images ──────────────────────────────
IMGS = {
  "apartment": [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=85",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=85",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=85",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=85",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=85",
    "https://images.unsplash.com/photo-1560448205-4d9b3e6bb6db?w=800&q=85",
  ],
  "villa": [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=85",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=85",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=85",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=85",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=85",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=85",
  ],
  "house": [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=85",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=85",
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&q=85",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85",
    "https://images.unsplash.com/photo-1430285561322-7808604715df?w=800&q=85",
  ],
  "penthouse": [
    "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=85",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=85",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=85",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=85",
  ],
  "commercial": [
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=85",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=85",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=85",
  ],
  "plot": [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=85",
    "https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800&q=85",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=85",
  ],
  "studio": [
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=85",
    "https://images.unsplash.com/photo-1505873242700-f289a29e1724?w=800&q=85",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=85",
  ],
}

CITIES = [
    ("Mumbai","Maharashtra"), ("Delhi","Delhi"), ("Bengaluru","Karnataka"),
    ("Hyderabad","Telangana"), ("Pune","Maharashtra"), ("Chennai","Tamil Nadu"),
    ("Ahmedabad","Gujarat"), ("Kolkata","West Bengal"), ("Jaipur","Rajasthan"),
    ("Noida","Uttar Pradesh"), ("Gurgaon","Haryana"), ("Kochi","Kerala"),
    ("Chandigarh","Punjab"), ("Surat","Gujarat"), ("Lucknow","Uttar Pradesh"),
]
LOCALITIES = {
    "Mumbai":["Bandra West","Juhu","Andheri West","Powai","Lower Parel","Worli","Malad West"],
    "Delhi":["Connaught Place","South Extension","Defence Colony","Vasant Kunj","Dwarka"],
    "Bengaluru":["Koramangala","Indiranagar","Whitefield","JP Nagar","HSR Layout"],
    "Hyderabad":["Banjara Hills","Jubilee Hills","Gachibowli","Madhapur","Hitec City"],
    "Pune":["Koregaon Park","Kalyani Nagar","Viman Nagar","Kharadi","Baner"],
    "Chennai":["Anna Nagar","Adyar","OMR","Velachery","T Nagar"],
    "Ahmedabad":["Satellite","Prahlad Nagar","SG Highway","Thaltej"],
    "Kolkata":["Salt Lake","New Town","Ballygunge","Park Street"],
    "Jaipur":["Vaishali Nagar","Malviya Nagar","C-Scheme","Jagatpura"],
    "Noida":["Sector 18","Sector 62","Sector 137","Sector 150"],
    "Gurgaon":["DLF Phase 1","Sohna Road","Golf Course Road","Sector 56"],
    "Kochi":["Marine Drive","Kakkanad","Edapally","Aluva"],
    "Chandigarh":["Sector 17","Sector 22","Panchkula"],
    "Surat":["Adajan","Vesu","Pal","Piplod"],
    "Lucknow":["Gomti Nagar","Hazratganj","Aliganj","Indira Nagar"],
}
PTYPES = ["apartment","villa","house","commercial","plot","penthouse","studio"]
AMENITIES = ["Swimming Pool","Gym","Club House","24x7 Security","CCTV","Power Backup",
             "Lift","Visitor Parking","Children Play Area","Jogging Track","Intercom",
             "Rainwater Harvesting","Solar Panels","Terrace Garden","EV Charging","Spa & Sauna"]
FURNISHING = ["Unfurnished","Semi-Furnished","Fully Furnished"]
FACINGS    = ["North","South","East","West","North-East","North-West"]
PREFIXES   = ["Luxurious","Premium","Modern","Spacious","Elegant","Stunning","Grand",
              "Contemporary","Charming","Prestigious","Beautiful","Brand New","Prime Location"]
DESCS = [
    "A meticulously designed property offering the finest blend of luxury and comfort. Floor-to-ceiling windows flood the interiors with natural light, while premium finishes elevate every corner.",
    "Experience unmatched urban living in this thoughtfully crafted space. Nestled in a prime locality with easy access to schools, hospitals, and commercial hubs.",
    "Stunning property with premium fittings, modular kitchen, and spacious bedrooms perfect for a growing family. Modern architecture meets classic comfort.",
    "An architectural marvel that redefines sophisticated living. The open-plan layout creates a seamless flow between living and dining areas, ideal for entertaining.",
    "Set within a gated community with world-class amenities, this property offers the perfect balance of privacy and community living.",
    "A rare opportunity to own prime real estate. The property comes with modern fittings and a breathtaking view of the cityscape.",
    "Thoughtfully planned interiors with imported marble flooring, designer bathrooms, and a fully-equipped modular kitchen. A home you deserve.",
    "Ideal for investors and end-users alike. The locality has seen exceptional appreciation, making this a smart investment with high rental yield.",
]

def get_price(ptype, l_type, city):
    premium = city in {"Mumbai","Delhi","Bengaluru","Gurgaon","Hyderabad"}
    sell = {"penthouse":(15000000,80000000),"villa":(8000000,50000000),"house":(4000000,25000000),
            "apartment":(2500000,15000000),"commercial":(3000000,30000000),"studio":(1500000,6000000),"plot":(1000000,20000000)}
    rent = {"penthouse":(80000,500000),"villa":(50000,300000),"house":(20000,100000),
            "apartment":(10000,80000),"commercial":(30000,200000),"studio":(8000,30000),"plot":(5000,20000)}
    pool = rent if l_type=="rent" else sell
    lo,hi = pool.get(ptype,(2000000,10000000))
    if premium: hi = int(hi*1.4)
    step = 500 if l_type=="rent" else 100000
    return random.randint(lo//step, hi//step)*step

with app.app_context():
    db.create_all()
    users_data = [
        {"username":"Asjad Pathan","email":"asjad@demo.com","password":"demo1234"},
        {"username":"Priya Sharma","email":"priya@demo.com","password":"demo1234"},
        {"username":"Rohit Verma", "email":"rohit@demo.com","password":"demo1234"},
    ]
    demo_users = []
    for ud in users_data:
        u = User.query.filter_by(email=ud["email"]).first()
        if not u:
            u = User(username=ud["username"], email=ud["email"],
                     password=bc.generate_password_hash(ud["password"]).decode("utf-8"),
                     is_verified=True, role="agent")
            db.session.add(u); db.session.flush()
        demo_users.append(u)
    db.session.commit()

    existing = Property.query.count()
    if existing >= 300:
        print(f"Already have {existing} properties.")
    else:
        needed = 300 - existing
        print(f"Seeding {needed} properties...")
        props = []
        for i in range(needed):
            ptype   = PTYPES[i % len(PTYPES)]
            l_type  = "sell" if i % 3 != 0 else "rent"
            city, state = random.choice(CITIES)
            locality    = random.choice(LOCALITIES.get(city, ["Main Area"]))
            beds = random.choice([1,1,2,2,2,3,3,3,4,5]) if ptype not in ("plot","commercial","studio") else (None if ptype in ("plot","commercial") else 1)
            baths = max(1,(beds or 1)-1) if beds else None
            area = {"penthouse":random.randint(3000,8000),"villa":random.randint(2000,6000),
                    "house":random.randint(1200,4000),"apartment":random.randint(600,2500),
                    "commercial":random.randint(500,5000),"studio":random.randint(300,600),
                    "plot":random.randint(1000,10000)}.get(ptype,1200)
            pool = IMGS.get(ptype, IMGS["apartment"])
            imgs = random.sample(pool, min(random.randint(2,4), len(pool)))
            title = f"{random.choice(PREFIXES)} {f'{beds} BHK ' if beds else ''}{ptype.title()} in {locality}".strip()
            props.append(Property(
                title=title, description=random.choice(DESCS),
                price=get_price(ptype,l_type,city),
                location=locality, city=city, state=state,
                pincode=str(random.randint(100000,999999)),
                property_type=ptype, listing_type=l_type,
                bedrooms=beds, bathrooms=baths, area_sqft=float(area),
                floor=random.randint(1,20) if ptype in ("apartment","penthouse","studio") else None,
                total_floors=random.randint(5,40) if ptype in ("apartment","penthouse","studio") else None,
                facing=random.choice(FACINGS), age_years=random.randint(0,15),
                furnishing=random.choice(FURNISHING), parking=random.randint(1,3),
                amenities=json.dumps(random.sample(AMENITIES, random.randint(5,12))),
                images=json.dumps(imgs),
                is_featured=(i < 18), is_verified=random.choice([True,True,True,False]),
                views=random.randint(20,3000),
                user_id=random.choice(demo_users).id
            ))
        db.session.bulk_save_objects(props)
        db.session.commit()
        print(f"✅ {needed} properties seeded!")
    print("\n👤 Demo Accounts:")
    for u in users_data:
        print(f"   {u['email']}  |  {u['password']}")
