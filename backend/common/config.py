import os

DATABASE_URI = os.getenv(
    'DATABASE_URL', 
    'postgresql://postgres:postgres@localhost/tabibdb'
)

KAFKA_BROKER = os.getenv(
    'KAFKA_BROKER', 
    'localhost:9092'
)

class Config:
    # Configuration de la base de données PostgreSQL
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        'postgresql://postgres:postgres@localhost/tabibdb'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Autres configurations (si nécessaire)
    DEBUG = True
    SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
