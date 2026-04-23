from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from .config import Config

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, origins=["http://localhost:5173","http://localhost:3000","https://*.vercel.app"], supports_credentials=True)
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    from . import models
    from .auth import auth
    from .property_routes import property_bp
    from .user_routes import user_bp
    from .review_routes import review_bp
    from .routes import main
    app.register_blueprint(main)
    app.register_blueprint(auth,        url_prefix="/api/auth")
    app.register_blueprint(property_bp, url_prefix="/api/properties")
    app.register_blueprint(user_bp,     url_prefix="/api/users")
    app.register_blueprint(review_bp,   url_prefix="/api/reviews")
    return app
