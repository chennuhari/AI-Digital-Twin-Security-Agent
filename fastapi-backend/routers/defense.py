from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import Asset, Port
from agents.threat_agent import threat_agent
from agents.defense_agent import defense_agent
from agents.risk_agent import risk_agent
from neo4j_service import neo4j_service

router = APIRouter(prefix="/api/defense", tags=["Defense Agent"])

class RemediateRequest(BaseModel):
    portNumber: int | None = None
    action: str = "HARDEN"

@router.get("/assets/{asset_id}")
def get_defense_recommendations(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    ports = db.query(Port).filter(Port.asset_id == asset_id).all()
    threats = threat_agent.analyze_asset_threats(asset_id, ports)
    return defense_agent.generate_recommendations(asset_id, threats)

@router.post("/assets/{asset_id}/remediate")
def apply_simulated_remediation(asset_id: int, req: RemediateRequest, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # In digital twin, virtual hardening modifies the state of the simulated port or adds protection
    target_port = req.portNumber
    if target_port is None:
        first_p = db.query(Port).filter(Port.asset_id == asset_id).first()
        target_port = first_p.port_number if first_p else 80

    port = db.query(Port).filter(Port.asset_id == asset_id, Port.port_number == target_port).first()
    if port:
        port.state = "filtered (hardened by AI defense agent)"
        db.commit()

    ports = db.query(Port).filter(Port.asset_id == asset_id).all()
    threats = threat_agent.analyze_asset_threats(asset_id, ports)
    risk_res = risk_agent.assess_risk(asset_id, threats)
    defense_res = defense_agent.generate_recommendations(asset_id, threats)

    # Re-sync twin in Neo4j
    try:
        neo4j_service.sync_analysis(asset_id, threats, risk_res, defense_res)
    except Exception:
        pass

    return {
        "status": "SUCCESS",
        "message": f"Port {req.portNumber} hardened in virtual digital twin. Posture updated.",
        "newRiskScore": risk_res.get("overallScore"),
        "newRiskLevel": risk_res.get("overallRiskLevel")
    }
