from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import Review, Property
from . import db

review_bp = Blueprint("review", __name__)

@review_bp.route("/<int:property_id>", methods=["GET"])
def get_reviews(property_id):
    reviews = Review.query.filter_by(property_id=property_id).order_by(Review.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviews])

@review_bp.route("/<int:property_id>", methods=["POST"])
@jwt_required()
def add_review(property_id):
    Property.query.get_or_404(property_id)
    d = request.get_json()
    rating = int(d.get("rating",5))
    if not (1 <= rating <= 5):
        return jsonify({"message":"Rating must be 1-5"}), 400
    review = Review(rating=rating, comment=d.get("comment",""),
                    user_id=int(get_jwt_identity()), property_id=property_id)
    db.session.add(review); db.session.commit()
    return jsonify({"message":"Review added","review":review.to_dict()}), 201

@review_bp.route("/<int:review_id>", methods=["DELETE"])
@jwt_required()
def delete_review(review_id):
    review = Review.query.get_or_404(review_id)
    if review.user_id != int(get_jwt_identity()):
        return jsonify({"message":"Unauthorized"}), 403
    db.session.delete(review); db.session.commit()
    return jsonify({"message":"Review deleted"})
