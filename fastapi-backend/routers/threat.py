from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Asset, Port
from agents.threat_agent import threat_agent

router = APIRouter(prefix="/api/threat", tags=["Threat Agent"])

@router.get("/assets/{asset_id}")
def get_threats_for_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    ports = db.query(Port).filter(Port.asset_id == asset_id).all()
    return threat_agent.analyze_asset_threats(asset_id, ports)

@router.get("/attack-paths/{asset_id}")
def get_attack_paths_for_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    ports = db.query(Port).filter(Port.asset_id == asset_id).all()
    return threat_agent.simulate_attack_paths(asset_id, asset.hostname or "localhost", ports)
