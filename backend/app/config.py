import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "estatex_secret_2025_change_in_prod")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///estatex.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "estatex_jwt_2025_change_in_prod")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
