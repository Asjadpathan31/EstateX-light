from flask import Blueprint, jsonify
main = Blueprint("main", __name__)

@main.route("/")
def home():
    return jsonify({"message":"EstateX API Running","version":"3.0"})

@main.route("/api/health")
def health():
    return jsonify({"status":"ok"})
