from neo4j import GraphDatabase
import logging
from config import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD

logger = logging.getLogger(__name__)

class Neo4jService:
    def __init__(self):
        try:
            self.driver = GraphDatabase.driver(
                NEO4J_URI,
                auth=(NEO4J_USER, NEO4J_PASSWORD)
            )
            self.driver.verify_connectivity()
            logger.info("Connected to Neo4j successfully.")
        except Exception as e:
            logger.warning(f"Neo4j connection failed: {e}")
            self.driver = None

    def close(self):
        if self.driver:
            self.driver.close()

    def sync_asset_with_services(self, asset_id: int, hostname: str, ip_address: str, ports: list):
        if not self.driver:
            return
        with self.driver.session() as session:
            # Merge Asset Node
            session.run("""
                MERGE (a:Asset {sourceAssetId: $assetId})
                SET a.hostname = $hostname,
                    a.ipAddress = $ipAddress,
                    a.status = 'UP'
            """, assetId=asset_id, hostname=hostname or "localhost", ipAddress=ip_address)

            # Detach existing services to refresh
            session.run("""
                MATCH (a:Asset {sourceAssetId: $assetId})-[r:HAS_SERVICE]->(s:Service)
                DETACH DELETE s
            """, assetId=asset_id)

            # Create service nodes and edges
            for port in ports:
                service_id = f"asset-{asset_id}-port-{port.port_number}-{port.protocol}"
                session.run("""
                    MATCH (a:Asset {sourceAssetId: $assetId})
                    CREATE (s:Service {
                        id: $serviceId,
                        portNumber: $portNumber,
                        protocol: $protocol,
                        serviceName: $serviceName,
                        state: $state
                    })
                    CREATE (a)-[:HAS_SERVICE]->(s)
                """, assetId=asset_id, serviceId=service_id, portNumber=port.port_number,
                     protocol=port.protocol, serviceName=port.service or "unknown", state=port.state or "open")

    def sync_analysis(self, asset_id: int, threats: list, risk_assessment: dict, defense_report: dict):
        if not self.driver:
            return
        with self.driver.session() as session:
            # Clear old threat, risk, and recommendation nodes for this asset's services
            session.run("""
                MATCH (a:Asset {sourceAssetId: $assetId})-[:HAS_SERVICE]->(s:Service)
                OPTIONAL MATCH (s)-[:HAS_THREAT]->(t:Threat)
                OPTIONAL MATCH (t)-[:ASSESSED_AS]->(r:Risk)
                OPTIONAL MATCH (r)-[:MITIGATED_BY]->(d:Recommendation)
                DETACH DELETE t, r, d
            """, assetId=asset_id)

            # Attach threats
            for threat in threats:
                port_num = threat.get("portNumber")
                category = threat.get("category", "SECURITY_ALERT")
                severity = threat.get("severity", "LOW")
                desc = threat.get("description", "")
                threat_id = f"threat-{asset_id}-{port_num}-{category}"

                session.run("""
                    MATCH (a:Asset {sourceAssetId: $assetId})-[:HAS_SERVICE]->(s:Service {portNumber: $portNum})
                    CREATE (t:Threat {
                        id: $threatId,
                        category: $category,
                        severity: $severity,
                        description: $desc
                    })
                    CREATE (s)-[:HAS_THREAT]->(t)
                """, assetId=asset_id, portNum=port_num, threatId=threat_id,
                     category=category, severity=severity, desc=desc)

            # Attach risks
            for item in risk_assessment.get("findings", []):
                port_num = item.get("portNumber")
                category = item.get("category", "")
                score = item.get("riskScore", 50)
                level = item.get("riskLevel", "MEDIUM")
                rationale = item.get("rationale", "")
                risk_id = f"risk-{asset_id}-{port_num}-{category}"
                threat_id = f"threat-{asset_id}-{port_num}-{category}"

                session.run("""
                    MATCH (t:Threat {id: $threatId})
                    CREATE (r:Risk {
                        id: $riskId,
                        riskScore: $score,
                        riskLevel: $level,
                        rationale: $rationale
                    })
                    CREATE (t)-[:ASSESSED_AS]->(r)
                """, threatId=threat_id, riskId=risk_id, score=score, level=level, rationale=rationale)

            # Attach recommendations
            for rec in defense_report.get("recommendations", []):
                port_num = rec.get("portNumber")
                category = rec.get("category", "")
                priority = rec.get("priority", "P2")
                text = rec.get("recommendation", "")
                rec_id = f"recommendation-{asset_id}-{port_num}"
                risk_id = f"risk-{asset_id}-{port_num}-{category}"

                # Link from risk if matched, else directly from threat or service
                session.run("""
                    MATCH (r:Risk {id: $riskId})
                    CREATE (d:Recommendation {
                        id: $recId,
                        priority: $priority,
                        recommendation: $text
                    })
                    CREATE (r)-[:MITIGATED_BY]->(d)
                """, riskId=risk_id, recId=rec_id, priority=priority, text=text)

    def get_full_graph(self, asset_id: int):
        if not self.driver:
            return {"assetId": asset_id, "nodes": [], "edges": []}

        nodes = []
        edges = []
        seen_nodes = set()
        seen_edges = set()

        with self.driver.session() as session:
            # Fetch asset info
            asset_res = session.run("""
                MATCH (a:Asset {sourceAssetId: $assetId})
                RETURN a.hostname as hostname, a.ipAddress as ipAddress, a.status as status
            """, assetId=asset_id).single()

            if asset_res:
                asset_node_id = f"asset-{asset_id}"
                nodes.append({
                    "id": asset_node_id,
                    "type": "ASSET",
                    "label": asset_res["hostname"] or "localhost",
                    "sublabel": asset_res["ipAddress"] or "",
                    "severity": ""
                })
                seen_nodes.add(asset_node_id)

            # Fetch chained graph
            records = session.run("""
                MATCH (a:Asset {sourceAssetId: $assetId})-[:HAS_SERVICE]->(s:Service)
                OPTIONAL MATCH (s)-[:HAS_THREAT]->(t:Threat)
                OPTIONAL MATCH (t)-[:ASSESSED_AS]->(r:Risk)
                OPTIONAL MATCH (r)-[:MITIGATED_BY]->(d:Recommendation)
                RETURN s.id as serviceId, s.portNumber as portNumber, s.serviceName as serviceName,
                       t.id as threatId, t.category as threatCategory, t.severity as threatSeverity,
                       r.id as riskId, r.riskScore as riskScore, r.riskLevel as riskLevel,
                       d.id as recommendationId, d.priority as recommendationPriority, d.recommendation as recommendationText
                ORDER BY s.portNumber
            """, assetId=asset_id)

            for rec in records:
                s_id = rec["serviceId"]
                if s_id:
                    s_node_id = f"service-{s_id}"
                    if s_node_id not in seen_nodes:
                        nodes.append({
                            "id": s_node_id,
                            "type": "SERVICE",
                            "label": str(rec["portNumber"]),
                            "sublabel": rec["serviceName"] or "unknown",
                            "severity": ""
                        })
                        seen_nodes.add(s_node_id)
                    edge_key = (f"asset-{asset_id}", s_node_id, "HAS_SERVICE")
                    if edge_key not in seen_edges:
                        edges.append({"source": f"asset-{asset_id}", "target": s_node_id, "type": "HAS_SERVICE"})
                        seen_edges.add(edge_key)

                t_id = rec["threatId"]
                if t_id and s_id:
                    t_node_id = f"threat-{t_id}"
                    if t_node_id not in seen_nodes:
                        nodes.append({
                            "id": t_node_id,
                            "type": "THREAT",
                            "label": rec["threatCategory"] or "THREAT",
                            "sublabel": rec["threatSeverity"] or "LOW",
                            "severity": rec["threatSeverity"] or "LOW"
                        })
                        seen_nodes.add(t_node_id)
                    edge_key = (f"service-{s_id}", t_node_id, "HAS_THREAT")
                    if edge_key not in seen_edges:
                        edges.append({"source": f"service-{s_id}", "target": t_node_id, "type": "HAS_THREAT"})
                        seen_edges.add(edge_key)

                r_id = rec["riskId"]
                if r_id and t_id:
                    r_node_id = f"risk-{r_id}"
                    if r_node_id not in seen_nodes:
                        nodes.append({
                            "id": r_node_id,
                            "type": "RISK",
                            "label": f"Risk {rec['riskScore']}",
                            "sublabel": rec["riskLevel"] or "MEDIUM",
                            "severity": rec["riskLevel"] or "MEDIUM",
                            "riskScore": rec["riskScore"]
                        })
                        seen_nodes.add(r_node_id)
                    edge_key = (f"threat-{t_id}", r_node_id, "ASSESSED_AS")
                    if edge_key not in seen_edges:
                        edges.append({"source": f"threat-{t_id}", "target": r_node_id, "type": "ASSESSED_AS"})
                        seen_edges.add(edge_key)

                d_id = rec["recommendationId"]
                if d_id and r_id:
                    d_node_id = f"rec-{d_id}"
                    if d_node_id not in seen_nodes:
                        nodes.append({
                            "id": d_node_id,
                            "type": "RECOMMENDATION",
                            "label": rec["recommendationPriority"] or "P2",
                            "sublabel": (rec["recommendationText"] or "Mitigation")[:20] + "...",
                            "severity": ""
                        })
                        seen_nodes.add(d_node_id)
                    edge_key = (f"risk-{r_id}", d_node_id, "MITIGATED_BY")
                    if edge_key not in seen_edges:
                        edges.append({"source": f"risk-{r_id}", "target": d_node_id, "type": "MITIGATED_BY"})
                        seen_edges.add(edge_key)

        return {
            "assetId": asset_id,
            "nodes": nodes,
            "edges": edges
        }

    def get_environment_graph(self):
        if not self.driver:
            return {"assetCount": 0, "assets": []}

        with self.driver.session() as session:
            asset_ids = session.run("""
                MATCH (a:Asset)
                RETURN a.sourceAssetId as id
                ORDER BY a.sourceAssetId
            """)
            ids = [record["id"] for record in asset_ids if record["id"] is not None]

        graphs = [self.get_full_graph(aid) for aid in ids]
        return {
            "assetCount": len(ids),
            "assets": graphs
        }

neo4j_service = Neo4jService()
