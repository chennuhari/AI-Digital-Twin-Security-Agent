from sqlalchemy import Column, BigInteger, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    username = Column(String(255), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="USER")

class Asset(Base):
    __tablename__ = "assets"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    hostname = Column(String(255), nullable=True)
    ip_address = Column(String(255), nullable=False, index=True)
    mac_address = Column(String(255), nullable=True)
    operating_system = Column(String(255), nullable=True)
    status = Column(String(255), default="UP")

    ports = relationship("Port", back_populates="asset", cascade="all, delete-orphan")

class Port(Base):
    __tablename__ = "ports"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    port_number = Column(Integer, nullable=False)
    protocol = Column(String(255), nullable=False, default="tcp")
    service = Column(String(255), nullable=True)
    state = Column(String(255), nullable=True)
    asset_id = Column(BigInteger, ForeignKey("assets.id"), nullable=False)

    asset = relationship("Asset", back_populates="ports")

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    asset_id = Column(BigInteger, nullable=False)
    hostname = Column(String(255), nullable=True)
    ip_address = Column(String(255), nullable=False)
    open_port_count = Column(Integer, default=0)
    recommendation_count = Column(Integer, default=0)
    risk_level = Column(String(255), default="LOW")
    risk_score = Column(Integer, default=0)
    scanned_at = Column(DateTime, default=datetime.utcnow)
    threat_count = Column(Integer, default=0)
