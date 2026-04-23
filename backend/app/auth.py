from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from .models import User
from . import db, bcrypt

auth = Blueprint("auth", __name__)

@auth.route("/signup", methods=["POST"])
def signup():
    d = request.get_json()
    username = d.get("username","").strip()
    email    = d.get("email","").strip().lower()
    password = d.get("password","")
    if not username or not email or not password:
        return jsonify({"message":"All fields are required"}), 400
    if len(password) < 6:
        return jsonify({"message":"Password must be at least 6 characters"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"message":"Email already registered"}), 409
    hashed = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(username=username, email=email, password=hashed)
    db.session.add(user)
    db.session.commit()
    return jsonify({
        "message":"Account created successfully",
        "access_token": create_access_token(identity=str(user.id)),
        "refresh_token": create_refresh_token(identity=str(user.id)),
        "user": user.to_dict()
    }), 201

@auth.route("/login", methods=["POST"])
def login():
    d = request.get_json()
    email    = d.get("email","").strip().lower()
    password = d.get("password","")
    if not email or not password:
        return jsonify({"message":"Email and password required"}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message":"Invalid credentials"}), 401
    return jsonify({
        "message":"Login successful",
        "access_token": create_access_token(identity=str(user.id)),
        "refresh_token": create_refresh_token(identity=str(user.id)),
        "user": user.to_dict()
    })

@auth.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    return jsonify({"access_token": create_access_token(identity=get_jwt_identity())})

@auth.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    return jsonify(User.query.get_or_404(int(get_jwt_identity())).to_dict())
