from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Asset, Port
from agents.threat_agent import threat_agent
from agents.risk_agent import risk_agent

router = APIRouter(prefix="/api/risk", tags=["Risk Agent"])

@router.get("/assets/{asset_id}")
def get_asset_risk(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    ports = db.query(Port).filter(Port.asset_id == asset_id).all()
    threats = threat_agent.analyze_asset_threats(asset_id, ports)
    return risk_agent.assess_risk(asset_id, threats)

@router.get("/environment")
def get_environment_risk(db: Session = Depends(get_db)):
    assets = db.query(Asset).all()
    scores = []
    for a in assets:
        ports = db.query(Port).filter(Port.asset_id == a.id).all()
        threats = threat_agent.analyze_asset_threats(a.id, ports)
        res = risk_agent.assess_risk(a.id, threats)
        if res.get("overallScore") is not None:
            scores.append(res.get("overallScore"))

    avg_score = int(round(sum(scores) / len(scores))) if scores else 0
    return {
        "assetCount": len(assets),
        "environmentAverageRisk": avg_score,
        "environmentRiskLevel": risk_agent._level_for_score(avg_score)
    }
