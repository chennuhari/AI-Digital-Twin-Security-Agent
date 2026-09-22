from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Asset, Port
from neo4j_service import neo4j_service
from agents.threat_agent import threat_agent
from agents.risk_agent import risk_agent
from agents.defense_agent import defense_agent

graph_router = APIRouter(prefix="/api/graph", tags=["Graph Digital Twin"])
analysis_router = APIRouter(prefix="/api/graph-analysis", tags=["Graph Analysis"])

@graph_router.get("/assets/{asset_id}")
def get_graph_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    ports = db.query(Port).filter(Port.asset_id == asset_id).all()
    return {
        "sourceAssetId": asset.id,
        "hostname": asset.hostname or "localhost",
        "ipAddress": asset.ip_address,
        "operatingSystem": asset.operating_system,
        "macAddress": asset.mac_address,
        "status": asset.status,
        "services": [
            {
                "id": f"asset-{asset_id}-port-{p.port_number}-{p.protocol}",
                "portNumber": p.port_number,
                "protocol": p.protocol,
                "serviceName": p.service or "unknown",
                "state": p.state or "open"
            }
            for p in ports
        ]
    }

@graph_router.post("/assets/{asset_id}/sync")
def sync_graph_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    ports = db.query(Port).filter(Port.asset_id == asset_id).all()
    neo4j_service.sync_asset_with_services(asset.id, asset.hostname, asset.ip_address, ports)
    return {"status": "SUCCESS", "message": f"Asset {asset_id} synced with Neo4j."}

def build_memory_graph_for_asset(asset_id: int, db: Session):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        return {"assetId": asset_id, "nodes": [], "edges": []}

    ports = db.query(Port).filter(Port.asset_id == asset_id).all()
    threats = threat_agent.analyze_asset_threats(asset_id, ports)
    risk_res = risk_agent.assess_risk(asset_id, threats)
    defense_res = defense_agent.generate_recommendations(asset_id, threats)

    nodes = []
    edges = []
    seen_nodes = set()
    seen_edges = set()

    asset_node_id = f"asset-{asset_id}"
    nodes.append({
        "id": asset_node_id,
        "type": "ASSET",
        "label": asset.hostname or "localhost",
        "sublabel": asset.ip_address,
        "severity": ""
    })
    seen_nodes.add(asset_node_id)

    # Attach Services (Sockets)
    for p in ports:
        s_node_id = f"service-asset-{asset_id}-port-{p.port_number}-{p.protocol}"
        if s_node_id not in seen_nodes:
            nodes.append({
                "id": s_node_id,
                "type": "SERVICE",
                "label": str(p.port_number),
                "sublabel": p.service or "socket",
                "severity": ""
            })
            seen_nodes.add(s_node_id)
        edge_key = (asset_node_id, s_node_id, "HAS_SERVICE")
        if edge_key not in seen_edges:
            edges.append({"source": asset_node_id, "target": s_node_id, "type": "HAS_SERVICE"})
            seen_edges.add(edge_key)

    # Attach Threats
    for t in threats:
        port_num = t.get("portNumber", 80)
        s_node_id = f"service-asset-{asset_id}-port-{port_num}-tcp"
        t_node_id = f"threat-{asset_id}-{port_num}-{t.get('category', 'THREAT')}"
        if t_node_id not in seen_nodes:
            nodes.append({
                "id": t_node_id,
                "type": "THREAT",
                "label": t.get("category", "THREAT"),
                "sublabel": t.get("severity", "MEDIUM"),
                "severity": t.get("severity", "MEDIUM")
            })
            seen_nodes.add(t_node_id)
        parent_socket = s_node_id if s_node_id in seen_nodes else asset_node_id
        edge_key = (parent_socket, t_node_id, "HAS_THREAT")
        if edge_key not in seen_edges:
            edges.append({"source": parent_socket, "target": t_node_id, "type": "HAS_THREAT"})
            seen_edges.add(edge_key)

    # Attach Risks
    for r in risk_res.get("findings", []):
        port_num = r.get("portNumber", 80)
        t_node_id = f"threat-{asset_id}-{port_num}-{r.get('category', 'THREAT')}"
        r_node_id = f"risk-{asset_id}-{port_num}-{r.get('category', 'RISK')}"
        if r_node_id not in seen_nodes:
            nodes.append({
                "id": r_node_id,
                "type": "RISK",
                "label": f"Risk {r.get('riskScore', 50)}",
                "sublabel": r.get("riskLevel", "MEDIUM"),
                "severity": r.get("riskLevel", "MEDIUM"),
                "riskScore": r.get("riskScore", 50)
            })
            seen_nodes.add(r_node_id)
        parent_threat = t_node_id if t_node_id in seen_nodes else asset_node_id
        edge_key = (parent_threat, r_node_id, "ASSESSED_AS")
        if edge_key not in seen_edges:
            edges.append({"source": parent_threat, "target": r_node_id, "type": "ASSESSED_AS"})
            seen_edges.add(edge_key)

    # Attach Recommendations
    for rec in defense_res.get("recommendations", []):
        port_num = rec.get("portNumber", 80)
        category = rec.get("category", "")
        r_node_id = f"risk-{asset_id}-{port_num}-{category}"
        rec_node_id = f"recommendation-{asset_id}-{port_num}"
        if rec_node_id not in seen_nodes:
            nodes.append({
                "id": rec_node_id,
                "type": "RECOMMENDATION",
                "label": rec.get("priority", "P1"),
                "sublabel": rec.get("title", "Mitigation"),
                "severity": "LOW"
            })
            seen_nodes.add(rec_node_id)
        parent_risk = r_node_id if r_node_id in seen_nodes else asset_node_id
        edge_key = (parent_risk, rec_node_id, "MITIGATED_BY")
        if edge_key not in seen_edges:
            edges.append({"source": parent_risk, "target": rec_node_id, "type": "MITIGATED_BY"})
            seen_edges.add(edge_key)

    return {"assetId": asset_id, "nodes": nodes, "edges": edges}

@analysis_router.get("/assets/{asset_id}/full")
def get_full_analysis_graph(asset_id: int, db: Session = Depends(get_db)):
    # Query Neo4j if available
    full = neo4j_service.get_full_graph(asset_id)
    if not full or not full.get("nodes"):
        # High-fidelity in-memory topology fallback
        return build_memory_graph_for_asset(asset_id, db)
    return full

@analysis_router.get("/environment/full")
def get_environment_full_graph(db: Session = Depends(get_db)):
    env = neo4j_service.get_environment_graph()
    if not env or env.get("assetCount", 0) == 0:
        assets = db.query(Asset).all()
        all_nodes = []
        all_edges = []
        seen_nodes = set()
        seen_edges = set()
        for a in assets:
            ag = build_memory_graph_for_asset(a.id, db)
            for n in ag.get("nodes", []):
                if n["id"] not in seen_nodes:
                    all_nodes.append(n)
                    seen_nodes.add(n["id"])
            for e in ag.get("edges", []):
                ek = (e["source"], e["target"], e["type"])
                if ek not in seen_edges:
                    all_edges.append(e)
                    seen_edges.add(ek)
        return {
            "assetCount": len(assets),
            "totalNodes": len(all_nodes),
            "totalEdges": len(all_edges),
            "nodes": all_nodes,
            "edges": all_edges
        }
    return env

@analysis_router.post("/assets/{asset_id}/sync")
def sync_analysis_graph(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    ports = db.query(Port).filter(Port.asset_id == asset_id).all()
    threats = threat_agent.analyze_asset_threats(asset_id, ports)
    risk_res = risk_agent.assess_risk(asset_id, threats)
    defense_res = defense_agent.generate_recommendations(asset_id, threats)

    neo4j_service.sync_asset_with_services(asset.id, asset.hostname, asset.ip_address, ports)
    neo4j_service.sync_analysis(asset.id, threats, risk_res, defense_res)

    return {
        "assetId": asset_id,
        "threatCount": len(threats),
        "riskCount": len(risk_res.get("findings", [])),
        "recommendationCount": len(defense_res.get("recommendations", [])),
        "message": "Full Digital Twin security chain synchronized in Neo4j."
    }
