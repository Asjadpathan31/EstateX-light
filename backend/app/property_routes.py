from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import Property, SavedProperty
from . import db
import json

property_bp = Blueprint("property", __name__)

@property_bp.route("/", methods=["GET"])
def get_all():
    page       = request.args.get("page",1,type=int)
    per_page   = request.args.get("per_page",12,type=int)
    p_type     = request.args.get("type")
    l_type     = request.args.get("listing_type")
    city       = request.args.get("city")
    min_price  = request.args.get("min_price",type=float)
    max_price  = request.args.get("max_price",type=float)
    bedrooms   = request.args.get("bedrooms",type=int)
    furnishing = request.args.get("furnishing")
    search     = request.args.get("search")
    sort_by    = request.args.get("sort_by","created_at")
    q = Property.query.filter_by(is_available=True)
    if p_type:     q = q.filter_by(property_type=p_type)
    if l_type:     q = q.filter_by(listing_type=l_type)
    if city:       q = q.filter(Property.city.ilike(f"%{city}%"))
    if min_price:  q = q.filter(Property.price >= min_price)
    if max_price:  q = q.filter(Property.price <= max_price)
    if bedrooms:   q = q.filter_by(bedrooms=bedrooms)
    if furnishing: q = q.filter_by(furnishing=furnishing)
    if search:
        q = q.filter(db.or_(
            Property.title.ilike(f"%{search}%"),
            Property.location.ilike(f"%{search}%"),
            Property.city.ilike(f"%{search}%"),
            Property.description.ilike(f"%{search}%")
        ))
    if sort_by=="price_asc":   q=q.order_by(Property.price.asc())
    elif sort_by=="price_desc": q=q.order_by(Property.price.desc())
    elif sort_by=="views":      q=q.order_by(Property.views.desc())
    elif sort_by=="area":       q=q.order_by(Property.area_sqft.desc())
    else:                       q=q.order_by(Property.created_at.desc())
    pag = q.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "properties":[p.to_dict(include_owner=True) for p in pag.items],
        "total":pag.total,"pages":pag.pages,"current_page":pag.page,
        "has_next":pag.has_next,"has_prev":pag.has_prev
    })

@property_bp.route("/featured", methods=["GET"])
def get_featured():
    props = Property.query.filter_by(is_featured=True,is_available=True).order_by(Property.views.desc()).limit(9).all()
    return jsonify([p.to_dict(include_owner=True) for p in props])

@property_bp.route("/stats", methods=["GET"])
def get_stats():
    return jsonify({
        "total":    Property.query.filter_by(is_available=True).count(),
        "for_sale": Property.query.filter_by(listing_type="sell",is_available=True).count(),
        "for_rent": Property.query.filter_by(listing_type="rent",is_available=True).count(),
        "cities":   db.session.query(Property.city).distinct().count()
    })

@property_bp.route("/<int:id>", methods=["GET"])
def get_one(id):
    prop = Property.query.get_or_404(id)
    prop.views += 1
    db.session.commit()
    return jsonify(prop.to_dict(include_owner=True))

@property_bp.route("/add", methods=["POST"])
@jwt_required()
def add_property():
    try:
        user_id = int(get_jwt_identity())
        d = request.get_json()
        prop = Property(
            title=d.get("title"), description=d.get("description"),
            price=float(d.get("price",0)),
            location=d.get("location"), city=d.get("city"), state=d.get("state"),
            pincode=d.get("pincode"), property_type=d.get("property_type"),
            listing_type=d.get("listing_type","sell"),
            bedrooms=d.get("bedrooms"), bathrooms=d.get("bathrooms"),
            area_sqft=d.get("area_sqft"), floor=d.get("floor"),
            total_floors=d.get("total_floors"), facing=d.get("facing"),
            age_years=d.get("age_years"), furnishing=d.get("furnishing"),
            parking=d.get("parking"),
            amenities=json.dumps(d.get("amenities",[])),
            images=json.dumps(d.get("images",[])),
            rera_number=d.get("rera_number"), user_id=user_id
        )
        db.session.add(prop)
        db.session.commit()
        return jsonify({"message":"Property listed successfully","property":prop.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500

@property_bp.route("/update/<int:id>", methods=["PUT"])
@jwt_required()
def update_property(id):
    user_id = int(get_jwt_identity())
    prop = Property.query.get_or_404(id)
    if prop.user_id != user_id:
        return jsonify({"message":"Unauthorized"}), 403
    d = request.get_json()
    for field in ["title","description","price","location","city","state","property_type",
                  "listing_type","bedrooms","bathrooms","area_sqft","furnishing","parking"]:
        if field in d: setattr(prop, field, d[field])
    if "amenities" in d: prop.amenities = json.dumps(d["amenities"])
    if "images"    in d: prop.images    = json.dumps(d["images"])
    db.session.commit()
    return jsonify({"message":"Updated","property":prop.to_dict()})

@property_bp.route("/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_property(id):
    user_id = int(get_jwt_identity())
    prop = Property.query.get_or_404(id)
    if prop.user_id != user_id:
        return jsonify({"message":"Unauthorized"}), 403
    db.session.delete(prop)
    db.session.commit()
    return jsonify({"message":"Property deleted"})

@property_bp.route("/save/<int:id>", methods=["POST"])
@jwt_required()
def toggle_save(id):
    user_id = int(get_jwt_identity())
    existing = SavedProperty.query.filter_by(user_id=user_id,property_id=id).first()
    if existing:
        db.session.delete(existing); db.session.commit()
        return jsonify({"message":"Removed from saved","saved":False})
    db.session.add(SavedProperty(user_id=user_id,property_id=id))
    db.session.commit()
    return jsonify({"message":"Property saved","saved":True})

@property_bp.route("/saved", methods=["GET"])
@jwt_required()
def get_saved():
    saves = SavedProperty.query.filter_by(user_id=int(get_jwt_identity())).all()
    return jsonify([s.property.to_dict(include_owner=True) for s in saves if s.property])

@property_bp.route("/my-listings", methods=["GET"])
@jwt_required()
def my_listings():
    props = Property.query.filter_by(user_id=int(get_jwt_identity())).order_by(Property.created_at.desc()).all()
    return jsonify([p.to_dict() for p in props])
