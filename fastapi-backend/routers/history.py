from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import ScanHistory

router = APIRouter(prefix="/api/history", tags=["Scan History"])

@router.get("/recent")
def get_recent_history(limit: int = 15, db: Session = Depends(get_db)):
    items = db.query(ScanHistory).order_by(ScanHistory.scanned_at.desc()).limit(limit).all()
    return [
        {
            "id": h.id,
            "assetId": h.asset_id,
            "hostname": h.hostname,
            "ipAddress": h.ip_address,
            "openPortCount": h.open_port_count,
            "threatCount": h.threat_count,
            "riskScore": h.risk_score,
            "riskLevel": h.risk_level,
            "recommendationCount": h.recommendation_count,
            "scannedAt": h.scanned_at.isoformat() if h.scanned_at else None
        }
        for h in items
    ]
