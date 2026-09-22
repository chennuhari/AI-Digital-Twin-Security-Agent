from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from database import get_db
from models import Asset, Port

router = APIRouter(prefix="/api/assets", tags=["Assets"])

class PortResponse(BaseModel):
    id: int
    portNumber: int
    protocol: str
    service: str | None = None
    state: str | None = None

    class Config:
        from_attributes = True

class AssetResponse(BaseModel):
    id: int
    hostname: str | None = None
    ipAddress: str
    operatingSystem: str | None = None
    macAddress: str | None = None
    status: str | None = None

    class Config:
        from_attributes = True

@router.get("", response_model=List[AssetResponse])
def get_assets(db: Session = Depends(get_db)):
    assets = db.query(Asset).order_by(Asset.id).all()
    # Format to match spring boot property casing (ipAddress, operatingSystem, macAddress)
    return [
        {
            "id": a.id,
            "hostname": a.hostname,
            "ipAddress": a.ip_address,
            "operatingSystem": a.operating_system,
            "macAddress": a.mac_address,
            "status": a.status
        }
        for a in assets
    ]

@router.get("/by-ip/{ip_address:path}", response_model=AssetResponse)
def get_asset_by_ip(ip_address: str, db: Session = Depends(get_db)):
    clean = ip_address.strip()
    asset = db.query(Asset).filter(
        (Asset.ip_address == clean) | (Asset.hostname.ilike(f"%{clean}%"))
    ).first()
    if not asset:
        raise HTTPException(status_code=404, detail=f"Asset with IP '{clean}' not found")
    return {
        "id": asset.id,
        "hostname": asset.hostname,
        "ipAddress": asset.ip_address,
        "operatingSystem": asset.operating_system,
        "macAddress": asset.mac_address,
        "status": asset.status
    }

@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return {
        "id": asset.id,
        "hostname": asset.hostname,
        "ipAddress": asset.ip_address,
        "operatingSystem": asset.operating_system,
        "macAddress": asset.mac_address,
        "status": asset.status
    }

@router.get("/{asset_id}/ports")
def get_asset_ports(asset_id: int, db: Session = Depends(get_db)):
    ports = db.query(Port).filter(Port.asset_id == asset_id).order_by(Port.port_number).all()
    return [
        {
            "id": p.id,
            "portNumber": p.port_number,
            "protocol": p.protocol,
            "service": p.service,
            "state": p.state
        }
        for p in ports
    ]
