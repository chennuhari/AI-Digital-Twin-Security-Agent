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
