import os

DATABASE_URI = os.getenv(
    'DATABASE_URL', 
    'postgresql://postgres:postgres@localhost/tabibdb'
)

KAFKA_BROKER = os.getenv(
    'KAFKA_BROKER', 
    'localhost:9092'
)
