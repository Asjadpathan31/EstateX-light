from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import User
from . import db, bcrypt

user_bp = Blueprint("user", __name__)

@user_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user = User.query.get_or_404(int(get_jwt_identity()))
    d = request.get_json()
    for f in ["username","phone","bio","avatar"]:
        if f in d: setattr(user, f, d[f])
    db.session.commit()
    return jsonify({"message":"Profile updated","user":user.to_dict()})

@user_bp.route("/change-password", methods=["PUT"])
@jwt_required()
def change_password():
    user = User.query.get_or_404(int(get_jwt_identity()))
    d = request.get_json()
    if not bcrypt.check_password_hash(user.password, d.get("old_password","")):
        return jsonify({"message":"Current password is incorrect"}), 401
    new_pw = d.get("new_password","")
    if len(new_pw) < 6:
        return jsonify({"message":"Password too short"}), 400
    user.password = bcrypt.generate_password_hash(new_pw).decode("utf-8")
    db.session.commit()
    return jsonify({"message":"Password updated"})
