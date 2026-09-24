from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging

from database import engine, Base
from routers.auth import router as auth_router
from routers.assets import router as assets_router
from routers.recon import router as recon_router
from routers.threat import router as threat_router
from routers.defense import router as defense_router
from routers.risk import router as risk_router
from routers.graph import graph_router, analysis_router
from routers.history import router as history_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AI-Digital-Twin")

# Create tables if not present
Base.metadata.create_all(bind=engine)

def seed_initial_data():
    from database import SessionLocal
    from models import Asset, Port, User
    import bcrypt

    db = SessionLocal()
    try:
        # Create default user if missing
        user = db.query(User).filter(User.username == "testuser3").first()
        if not user:
            try:
                hashed = bcrypt.hashpw("Test@123".encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            except Exception:
                hashed = "Test@123"
            db.add(User(username="testuser3", email="admin@digitaltwin.ai", password=hashed, role="ADMIN"))
            db.commit()

        # Create default fleet if empty
        if db.query(Asset).count() == 0:
            a1 = Asset(ip_address="192.168.1.10", hostname="gateway-edge-router", operating_system="Cisco IOS 15.2", status="UP")
            a2 = Asset(ip_address="127.0.0.1", hostname="primary-security-twin", operating_system="Ubuntu 22.04 LTS", status="UP")
            a3 = Asset(ip_address="192.168.1.50", hostname="production-sql-db", operating_system="Red Hat Enterprise Linux 9", status="UP")
            db.add_all([a1, a2, a3])
            db.commit()

            db.refresh(a1)
            db.refresh(a2)
            db.refresh(a3)

            p1 = Port(asset_id=a2.id, port_number=80, protocol="tcp", service="http", state="open")
            p2 = Port(asset_id=a2.id, port_number=443, protocol="tcp", service="https", state="open")
            p3 = Port(asset_id=a2.id, port_number=22, protocol="tcp", service="ssh", state="open")
            p4 = Port(asset_id=a2.id, port_number=3306, protocol="tcp", service="mysql", state="open")
            p5 = Port(asset_id=a2.id, port_number=8080, protocol="tcp", service="http-proxy", state="open")

            p6 = Port(asset_id=a1.id, port_number=53, protocol="udp", service="domain", state="open")
            p7 = Port(asset_id=a1.id, port_number=443, protocol="tcp", service="https", state="open")

            p8 = Port(asset_id=a3.id, port_number=5432, protocol="tcp", service="postgresql", state="open")
            p9 = Port(asset_id=a3.id, port_number=22, protocol="tcp", service="ssh", state="open")

            db.add_all([p1, p2, p3, p4, p5, p6, p7, p8, p9])
            db.commit()
            logger.info("Default Digital Twin fleet and initial telemetry initialized.")
    except Exception as e:
        logger.warning(f"Data seeding notice: {e}")
    finally:
        db.close()

seed_initial_data()

app = FastAPI(
    title="AI Digital Twin Security Agent API",
    description="Intelligent Cybersecurity Platform with Autonomous Agents (Recon, Threat, Defense, Risk) and 3D Twin Modeling.",
    version="2.4.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router)
app.include_router(assets_router)
app.include_router(recon_router)
app.include_router(threat_router)
app.include_router(defense_router)
app.include_router(risk_router)
app.include_router(graph_router)
app.include_router(analysis_router)
app.include_router(history_router)

@app.get("/")
def root():
    return {
        "platform": "AI Digital Twin Security Agent",
        "version": "2.4.0",
        "status": "ONLINE",
        "agents": {
            "recon": "Active",
            "threat": "Active (Attack Path Simulator Enabled)",
            "defense": "Active (CIS/NIST Playbooks Enabled)",
            "risk": "Active (Quantitative Risk Engine Online)"
        },
        "docs": "/docs"
    }

@app.get("/api/health")
def health():
    return {"status": "UP", "service": "AI Digital Twin FastAPI Backend"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
