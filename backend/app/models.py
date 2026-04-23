from . import db
from datetime import datetime
import json

class User(db.Model):
    __tablename__ = "users"
    id          = db.Column(db.Integer, primary_key=True)
    username    = db.Column(db.String(100), nullable=False)
    email       = db.Column(db.String(120), unique=True, nullable=False)
    password    = db.Column(db.String(255), nullable=False)
    avatar      = db.Column(db.String(255), nullable=True)
    phone       = db.Column(db.String(20), nullable=True)
    bio         = db.Column(db.Text, nullable=True)
    role        = db.Column(db.String(20), default="user")
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    is_verified = db.Column(db.Boolean, default=False)
    properties  = db.relationship("Property", backref="owner", lazy=True, cascade="all, delete-orphan")
    saves       = db.relationship("SavedProperty", backref="user", lazy=True, cascade="all, delete-orphan")
    reviews     = db.relationship("Review", backref="author", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id, "username": self.username, "email": self.email,
            "avatar": self.avatar, "phone": self.phone, "bio": self.bio,
            "role": self.role, "created_at": self.created_at.isoformat(),
            "is_verified": self.is_verified,
            "total_properties": len(self.properties)
        }

class Property(db.Model):
    __tablename__ = "properties"
    id            = db.Column(db.Integer, primary_key=True)
    title         = db.Column(db.String(200), nullable=False)
    description   = db.Column(db.Text, nullable=False)
    price         = db.Column(db.Float, nullable=False)
    location      = db.Column(db.String(200), nullable=False)
    city          = db.Column(db.String(100), nullable=False)
    state         = db.Column(db.String(100), nullable=True)
    pincode       = db.Column(db.String(10), nullable=True)
    property_type = db.Column(db.String(50), nullable=False)
    listing_type  = db.Column(db.String(20), nullable=False, default="sell")
    bedrooms      = db.Column(db.Integer, nullable=True)
    bathrooms     = db.Column(db.Integer, nullable=True)
    area_sqft     = db.Column(db.Float, nullable=True)
    floor         = db.Column(db.Integer, nullable=True)
    total_floors  = db.Column(db.Integer, nullable=True)
    facing        = db.Column(db.String(20), nullable=True)
    age_years     = db.Column(db.Integer, nullable=True)
    furnishing    = db.Column(db.String(30), nullable=True)
    parking       = db.Column(db.Integer, nullable=True)
    amenities     = db.Column(db.Text, nullable=True)
    images        = db.Column(db.Text, nullable=True)
    is_featured   = db.Column(db.Boolean, default=False)
    is_verified   = db.Column(db.Boolean, default=False)
    is_available  = db.Column(db.Boolean, default=True)
    rera_number   = db.Column(db.String(50), nullable=True)
    views         = db.Column(db.Integer, default=0)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at    = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id       = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    saves         = db.relationship("SavedProperty", backref="property", lazy=True, cascade="all, delete-orphan")
    reviews       = db.relationship("Review", backref="property", lazy=True, cascade="all, delete-orphan")

    def to_dict(self, include_owner=False):
        data = {
            "id": self.id, "title": self.title, "description": self.description,
            "price": self.price, "location": self.location, "city": self.city,
            "state": self.state, "pincode": self.pincode,
            "property_type": self.property_type, "listing_type": self.listing_type,
            "bedrooms": self.bedrooms, "bathrooms": self.bathrooms,
            "area_sqft": self.area_sqft, "floor": self.floor,
            "total_floors": self.total_floors, "facing": self.facing,
            "age_years": self.age_years, "furnishing": self.furnishing,
            "parking": self.parking,
            "amenities": json.loads(self.amenities) if self.amenities else [],
            "images": json.loads(self.images) if self.images else [],
            "is_featured": self.is_featured, "is_verified": self.is_verified,
            "is_available": self.is_available, "rera_number": self.rera_number,
            "views": self.views,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "user_id": self.user_id,
            "saves_count": len(self.saves),
            "avg_rating": round(sum(r.rating for r in self.reviews) / len(self.reviews), 1) if self.reviews else 0,
            "review_count": len(self.reviews)
        }
        if include_owner and self.owner:
            data["owner"] = {
                "id": self.owner.id, "username": self.owner.username,
                "email": self.owner.email, "avatar": self.owner.avatar,
                "phone": self.owner.phone, "role": self.owner.role
            }
        return data

class SavedProperty(db.Model):
    __tablename__ = "saved_properties"
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

class Review(db.Model):
    __tablename__ = "reviews"
    id          = db.Column(db.Integer, primary_key=True)
    rating      = db.Column(db.Integer, nullable=False)
    comment     = db.Column(db.Text, nullable=True)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id, "rating": self.rating, "comment": self.comment,
            "created_at": self.created_at.isoformat(),
            "user": {"id": self.author.id, "username": self.author.username, "avatar": self.author.avatar}
        }
