from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from database import get_db
from models import Asset, Port, ScanHistory
from agents.recon_agent import recon_agent
from agents.threat_agent import threat_agent
from agents.risk_agent import risk_agent
from agents.defense_agent import defense_agent
from neo4j_service import neo4j_service

router = APIRouter(prefix="/api/recon", tags=["Recon Agent"])

class ScanRequest(BaseModel):
    target: str = "127.0.0.1"

@router.post("/scan")
def trigger_recon_scan(req: ScanRequest, db: Session = Depends(get_db)):
    try:
        scan_res = recon_agent.scan_target(req.target, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    asset_id = scan_res.get("asset_id")
    if asset_id:
        # Evaluate threats, risk, defense for scan history snapshot
        ports = db.query(Port).filter(Port.asset_id == asset_id).all()
        threats = threat_agent.analyze_asset_threats(asset_id, ports)
        risk_res = risk_agent.assess_risk(asset_id, threats)
        defense_res = defense_agent.generate_recommendations(asset_id, threats)

        # Record scan history
        history_entry = ScanHistory(
            asset_id=asset_id,
            hostname=scan_res.get("hostname", "localhost"),
            ip_address=scan_res.get("ip_address", req.target),
            open_port_count=len(ports),
            threat_count=len(threats),
            risk_score=risk_res.get("overallScore", 0),
            risk_level=risk_res.get("overallRiskLevel", "LOW"),
            recommendation_count=defense_res.get("recommendationCount", 0),
            scanned_at=datetime.utcnow()
        )
        db.add(history_entry)
        db.commit()

        try:
            neo4j_service.sync_analysis(asset_id, threats, risk_res, defense_res)
        except Exception:
            pass

    return {
        "status": "SUCCESS",
        "asset_id": asset_id,
        "ip_address": scan_res.get("ip_address", req.target),
        "hostname": scan_res.get("hostname", "localhost"),
        "ports_count": scan_res.get("ports_discovered", 0),
        "raw_output": scan_res.get("raw_output", [])
    }
