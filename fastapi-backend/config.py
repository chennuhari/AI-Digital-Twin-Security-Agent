import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:2003@localhost:5432/digital_twin"
)

NEO4J_URI = os.getenv("NEO4J_URI", "neo4j://127.0.0.1:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "Hari@2003")

JWT_SECRET = os.getenv(
    "JWT_SECRET",
    "DigitalTwinSecurityAgentSecretKeyForJWT2026VerySecureKey123456789"
)
JWT_ALGORITHM = "HS512"
JWT_EXPIRATION_HOURS = 24

FASTAPI_PORT = int(os.getenv("FASTAPI_PORT", "8001"))
