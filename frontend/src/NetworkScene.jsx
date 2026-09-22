import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Html,
  Line,
  OrbitControls,
  Sphere,
  Torus,
  Stars,
} from "@react-three/drei";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { cyberAudio } from "./soundEffects";

// Color palettes for nodes
function nodeColor(type, severity = "", isSimulatedAttack = false) {
  if (isSimulatedAttack) return "#ff0055"; // Laser crimson
  if (type === "ASSET") return "#00f0ff"; // Holographic cyan
  if (type === "SERVICE") return "#38bdf8"; // Sky blue
  if (type === "THREAT") {
    if (severity === "HIGH" || severity === "CRITICAL") return "#f43f5e";
    return "#fb923c";
  }
  if (type === "RISK") {
    if (severity === "CRITICAL") return "#ef4444";
    if (severity === "HIGH") return "#f97316";
    if (severity === "MEDIUM") return "#eab308";
    return "#10b981";
  }
  if (type === "RECOMMENDATION") return "#00ff9d"; // Neon emerald
  return "#94a3b8";
}

function edgeColor(type, isAttackEdge = false) {
  if (isAttackEdge) return "#ff0055";
  if (type === "HAS_SERVICE") return "#00f0ff";
  if (type === "HAS_THREAT") return "#f43f5e";
  if (type === "ASSESSED_AS") return "#f59e0b";
  if (type === "MITIGATED_BY") return "#00ff9d";
  return "#475569";
}

// Glowing Holographic Energy Ring around Assets
function AssetEnergyRing({ radius, speed, color = "#00f0ff" }) {
  const ringRef = useRef();

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * speed * 0.7;
      ringRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <Torus ref={ringRef} args={[radius, 0.016, 12, 48]}>
      <meshBasicMaterial color={color} transparent opacity={0.65} />
    </Torus>
  );
}

// Data packet travelling along edge (Optimized: cached vectors, 0 per-frame allocations)
function DataPacket({ start, end, speed = 1.6, color = "#00f0ff", size = 0.06 }) {
  const meshRef = useRef();
  const progress = useRef(Math.random());
  const p1 = useMemo(() => new THREE.Vector3(start[0], start[1], start[2]), [start[0], start[1], start[2]]);
  const p2 = useMemo(() => new THREE.Vector3(end[0], end[1], end[2]), [end[0], end[1], end[2]]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    progress.current = (progress.current + delta * speed * 0.4) % 1;
    meshRef.current.position.lerpVectors(p1, p2, progress.current);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// 3D Node with Hover & Selection Effects (Optimized: minimal DOM overlays)
function TwinNode({
  node,
  position,
  multiAsset,
  isSelected,
  isAttackActive,
  dimmed,
  onSelect,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const isAsset = node.type === "ASSET";

  const color = useMemo(
    () => nodeColor(node.type, node.severity || node.sublabel, isAttackActive),
    [node.type, node.severity, node.sublabel, isAttackActive]
  );

  const baseSize = useMemo(() => {
    const factor = multiAsset ? 0.85 : 1.0;
    if (isAsset) return 0.34 * factor;
    if (node.type === "SERVICE") return 0.18 * factor;
    if (node.type === "THREAT") return 0.17 * factor;
    if (node.type === "RISK") return 0.16 * factor;
    if (node.type === "RECOMMENDATION") return 0.15 * factor;
    return 0.13 * factor;
  }, [node.type, isAsset, multiAsset]);

  // Only animate active / hovered / selected nodes to maintain rock-solid 60 FPS
  useFrame((state) => {
    if (!meshRef.current) return;
    if (isAsset || isAttackActive || hovered || isSelected) {
      const time = state.clock.getElapsedTime();
      const pulseFactor = isAttackActive ? 0.16 : isAsset ? 0.08 : 0.04;
      const speed = isAttackActive ? 5 : isAsset ? 2 : 1.5;
      const pulse = 1 + Math.sin(time * speed + position[0] * 2) * pulseFactor;
      meshRef.current.scale.setScalar(hovered || isSelected ? pulse * 1.25 : pulse);
    }
  });

  const opacity = dimmed ? 0.15 : 1.0;

  // CRITICAL LAG FIX: Only render HTML overlays for the central ASSET, or on hover / selection / active attack!
  const showHtmlLabel = (isAsset || hovered || isSelected || isAttackActive) && !dimmed;

  return (
    <group position={position}>
      {isAsset && !dimmed && (
        <>
          <AssetEnergyRing radius={0.55} speed={0.9} color={isAttackActive ? "#ff0055" : "#00f0ff"} />
          <AssetEnergyRing radius={0.72} speed={-0.6} color={isAttackActive ? "#f43f5e" : "#8b5cf6"} />
        </>
      )}

      <Sphere
        ref={meshRef}
        args={[baseSize, 16, 16]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect && onSelect(node, position);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 3.5 : hovered ? 2.8 : isAttackActive ? 3.0 : isAsset ? 2.0 : 1.3}
          roughness={0.25}
          metalness={0.45}
          transparent
          opacity={opacity}
        />
      </Sphere>

      {/* Outer Holographic Glow Shell on Hover/Select */}
      {(hovered || isSelected || isAttackActive) && !dimmed && (
        <Sphere args={[baseSize * 1.45, 14, 14]}>
          <meshBasicMaterial color={color} transparent opacity={0.22} wireframe />
        </Sphere>
      )}

      {/* High-Performance Floating Interactive Label */}
      {showHtmlLabel && (
        <Html
          center
          distanceFactor={multiAsset ? 11 : 8.5}
          position={[0, isAsset ? -0.56 : -0.34, 0]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className={`transition-all duration-200 pointer-events-none select-none px-2 py-1 rounded-md backdrop-blur-md border ${
              isSelected
                ? "border-cyan-400 bg-slate-950/95 shadow-[0_0_20px_rgba(0,240,255,0.7)] scale-110"
                : isAttackActive
                ? "border-rose-500 bg-slate-950/95 shadow-[0_0_20px_rgba(244,63,94,0.7)]"
                : "border-white/15 bg-slate-950/85"
            }`}
            style={{
              textAlign: "center",
              whiteSpace: "nowrap",
              fontSize: isAsset ? "12px" : "10px",
              fontFamily: "monospace",
              letterSpacing: "0.04em",
              textShadow: "0 0 12px rgba(0,0,0,0.95)",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: isAttackActive ? "#f43f5e" : isAsset ? "#00f0ff" : "#f1f5f9",
              }}
            >
              {node.label}
            </div>
            {node.sublabel && (
              <div style={{ color: "#94a3b8", fontSize: "8px", marginTop: "1px" }}>
                {node.sublabel}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// Outer Holographic Gyroscope Orbit Rings that spin in 3D
function GyroscopeRings({ isSpinning, speed = 0.35, multiAsset = false }) {
  const ringX = useRef();
  const ringY = useRef();
  const ringZ = useRef();

  const radius = multiAsset ? 8.2 : 5.6;

  useFrame((_, delta) => {
    if (!isSpinning) return;
    if (ringX.current) ringX.current.rotation.x += delta * speed * 0.45;
    if (ringY.current) ringY.current.rotation.y += delta * speed * 0.65;
    if (ringZ.current) ringZ.current.rotation.z -= delta * speed * 0.35;
  });

  return (
    <group>
      <Torus ref={ringX} args={[radius, 0.016, 12, 48]} rotation={[Math.PI / 6, 0, 0]}>
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.32} />
      </Torus>
      <Torus ref={ringY} args={[radius + 0.6, 0.016, 12, 48]} rotation={[0, Math.PI / 4, 0]}>
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.28} />
      </Torus>
      <Torus ref={ringZ} args={[radius + 1.2, 0.014, 12, 48]} rotation={[0, 0, Math.PI / 3]}>
        <meshBasicMaterial color="#00ff9d" transparent opacity={0.22} />
      </Torus>
    </group>
  );
}

// 3D Cyber Radar Floor Grid
function CyberGridFloor() {
  const gridRef = useRef();

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper args={[26, 26, "#00f0ff", "#1e293b"]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh ref={gridRef}>
        <ringGeometry args={[12.2, 12.6, 64]} />
        <meshBasicMaterial color="#00f0ff" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Layout single asset constellation
function buildSingleAssetPositions(nodes) {
  const positions = {};
  const asset = nodes.find((node) => node.type === "ASSET");

  if (asset) {
    positions[asset.id] = [0, 0, 0];
  }

  const services = nodes.filter((node) => node.type === "SERVICE");
  const threats = nodes.filter((node) => node.type === "THREAT");
  const risks = nodes.filter((node) => node.type === "RISK");
  const recommendations = nodes.filter((node) => node.type === "RECOMMENDATION");

  const placeRing = (items, radius, z, phase = 0) => {
    items.forEach((item, index) => {
      const angle = phase + (index / Math.max(items.length, 1)) * Math.PI * 2;
      positions[item.id] = [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        z + (index % 2 === 0 ? 0.2 : -0.2),
      ];
    });
  };

  placeRing(services, 1.85, 0.15, 0);
  placeRing(threats, 2.95, -0.2, Math.PI / 5);
  placeRing(risks, 3.85, 0.2, Math.PI / 3);
  placeRing(recommendations, 4.65, -0.15, Math.PI / 4);

  return positions;
}

// Multi-Asset cluster topology
function buildMultiAssetPositions(nodes, edges) {
  const positions = {};
  const assetNodes = nodes.filter((node) => node.type === "ASSET");

  const clusterRadius =
    assetNodes.length <= 3 ? 3.8 : assetNodes.length <= 6 ? 4.9 : 5.8;

  const centers = {};

  assetNodes.forEach((asset, index) => {
    const angle = -Math.PI / 2 + (index / Math.max(assetNodes.length, 1)) * Math.PI * 2;
    const center = [
      Math.cos(angle) * clusterRadius,
      Math.sin(angle) * clusterRadius,
      index % 2 === 0 ? 0.3 : -0.3,
    ];
    centers[asset.id] = center;
    positions[asset.id] = center;
  });

  const owner = {};
  assetNodes.forEach((asset) => {
    owner[asset.id] = asset.id;
  });

  let changed = true;
  let passes = 0;
  while (changed && passes < 8) {
    changed = false;
    passes += 1;
    edges.forEach((edge) => {
      if (owner[edge.source] && !owner[edge.target]) {
        owner[edge.target] = owner[edge.source];
        changed = true;
      }
    });
  }

  assetNodes.forEach((asset, assetIndex) => {
    const center = centers[asset.id];
    const clusterNodes = nodes.filter((n) => owner[n.id] === asset.id && n.id !== asset.id);

    const byType = {
      SERVICE: clusterNodes.filter((n) => n.type === "SERVICE"),
      THREAT: clusterNodes.filter((n) => n.type === "THREAT"),
      RISK: clusterNodes.filter((n) => n.type === "RISK"),
      RECOMMENDATION: clusterNodes.filter((n) => n.type === "RECOMMENDATION"),
    };

    const placeCluster = (items, radius, zOffset, phase) => {
      items.forEach((item, index) => {
        const angle = phase + (index / Math.max(items.length, 1)) * Math.PI * 2;
        positions[item.id] = [
          center[0] + Math.cos(angle) * radius,
          center[1] + Math.sin(angle) * radius,
          center[2] + zOffset,
        ];
      });
    };

    const phase = assetIndex * 0.7;
    placeCluster(byType.SERVICE, 0.95, 0.15, phase);
    placeCluster(byType.THREAT, 1.45, -0.1, phase + Math.PI / 6);
    placeCluster(byType.RISK, 1.9, 0.1, phase + Math.PI / 4);
    placeCluster(byType.RECOMMENDATION, 2.3, -0.15, phase + Math.PI / 3);
  });

  return positions;
}

// Camera controller that glides towards selected node or camera presets
function CameraRig({ cameraPreset, focusTarget, controlsRef }) {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (focusTarget) {
      currentTarget.current.set(...focusTarget);
    } else {
      currentTarget.current.set(0, 0, 0);
    }
  }, [focusTarget]);

  useEffect(() => {
    if (cameraPreset === "overview") {
      camera.position.set(0, 0, 10.5);
    } else if (cameraPreset === "topdown") {
      camera.position.set(0, 13, 0.1);
    } else if (cameraPreset === "isometric") {
      camera.position.set(7.5, 6.5, 8.5);
    }
  }, [cameraPreset, camera]);

  useFrame(() => {
    if (controlsRef.current && controlsRef.current.target.distanceTo(currentTarget.current) > 0.005) {
      controlsRef.current.target.lerp(currentTarget.current, 0.08);
      controlsRef.current.update();
    }
  });

  return null;
}

function FullGraphScene({
  graph,
  selectedNode,
  onSelectNode,
  activeAttackPath,
  simulationRunning,
  cameraPreset,
  layerFilter = "ALL", // ALL, ASSET, SERVICE, THREAT, RISK, RECOMMENDATION
  isSpinning = true,
  spinSpeed = 0.35,
  onRegisterZoomControls,
}) {
  const controlsRef = useRef();
  const graphGroupRef = useRef();

  // Smooth continuous diagram spinning around Y axis
  useFrame((_, delta) => {
    if (isSpinning && graphGroupRef.current) {
      graphGroupRef.current.rotation.y += delta * spinSpeed;
    }
  });

  const activeGraph = useMemo(() => {
    if (graph?.nodes?.length) return graph;
    return {
      nodes: [
        { id: "asset-1", type: "ASSET", label: "Core Twin", sublabel: "127.0.0.1" },
        { id: "srv-80", type: "SERVICE", label: "80/tcp", sublabel: "HTTP" },
        { id: "srv-5432", type: "SERVICE", label: "5432/tcp", sublabel: "PostgreSQL" },
        { id: "thr-1", type: "THREAT", label: "WEB_SERVICE", sublabel: "LOW", severity: "LOW" },
        { id: "thr-2", type: "THREAT", label: "DATABASE_SERVICE", sublabel: "MEDIUM", severity: "MEDIUM" },
        { id: "risk-1", type: "RISK", label: "Risk 57", sublabel: "MEDIUM", severity: "MEDIUM" },
        { id: "rec-1", type: "RECOMMENDATION", label: "P2 - HIGH", sublabel: "Isolate DB" },
      ],
      edges: [
        { source: "asset-1", target: "srv-80", type: "HAS_SERVICE" },
        { source: "asset-1", target: "srv-5432", type: "HAS_SERVICE" },
        { source: "srv-80", target: "thr-1", type: "HAS_THREAT" },
        { source: "srv-5432", target: "thr-2", type: "HAS_THREAT" },
        { source: "thr-2", target: "risk-1", type: "ASSESSED_AS" },
        { source: "risk-1", target: "rec-1", type: "MITIGATED_BY" },
      ],
    };
  }, [graph]);

  const assetCount = useMemo(
    () => (activeGraph.nodes || []).filter((n) => n.type === "ASSET").length,
    [activeGraph]
  );
  const multiAsset = assetCount > 1;

  const positions = useMemo(
    () =>
      multiAsset
        ? buildMultiAssetPositions(activeGraph.nodes || [], activeGraph.edges || [])
        : buildSingleAssetPositions(activeGraph.nodes || []),
    [activeGraph, multiAsset]
  );

  const focusPosition = useMemo(() => {
    if (selectedNode && positions[selectedNode.id]) {
      return positions[selectedNode.id];
    }
    return null;
  }, [selectedNode, positions]);

  useEffect(() => {
    if (onRegisterZoomControls) {
      onRegisterZoomControls({
        zoomIn: () => {
          if (!controlsRef.current) return;
          const cam = controlsRef.current.object;
          const target = controlsRef.current.target;
          const offset = new THREE.Vector3().subVectors(cam.position, target);
          offset.multiplyScalar(0.72); // Move 28% closer
          if (offset.length() > 2.2) {
            cam.position.copy(target).add(offset);
            controlsRef.current.update();
          }
        },
        zoomOut: () => {
          if (!controlsRef.current) return;
          const cam = controlsRef.current.object;
          const target = controlsRef.current.target;
          const offset = new THREE.Vector3().subVectors(cam.position, target);
          offset.multiplyScalar(1.35); // Move 35% further away
          if (offset.length() < 42.0) {
            cam.position.copy(target).add(offset);
            controlsRef.current.update();
          }
        },
        resetZoom: () => {
          if (!controlsRef.current) return;
          const cam = controlsRef.current.object;
          controlsRef.current.target.set(0, 0, 0);
          cam.position.set(0, 0, multiAsset ? 16 : 10.5);
          controlsRef.current.update();
        },
      });
    }
  }, [multiAsset]);

  return (
    <>
      <CameraRig cameraPreset={cameraPreset} focusTarget={focusPosition} controlsRef={controlsRef} />

      <ambientLight intensity={0.7} />
      <pointLight position={[6, 8, 9]} intensity={18} color="#00f0ff" distance={30} />
      <pointLight position={[-6, -6, 7]} intensity={14} color="#8b5cf6" distance={30} />
      <pointLight position={[0, -5, -4]} intensity={12} color="#00ff9d" distance={25} />

      <Stars radius={50} depth={20} count={320} factor={2.0} saturation={0} fade speed={0.5} />
      <CyberGridFloor />

      {/* Continuously Spinning Graph Cluster */}
      <group ref={graphGroupRef}>
        <GyroscopeRings isSpinning={isSpinning} speed={spinSpeed} multiAsset={multiAsset} />

        {/* Graph Edges */}
        {activeGraph.edges.map((edge, idx) => {
          const p1 = positions[edge.source];
          const p2 = positions[edge.target];
          if (!p1 || !p2) return null;

          const isAttackEdge =
            simulationRunning ||
            (activeAttackPath && (edge.type === "HAS_THREAT" || edge.type === "ASSESSED_AS"));

          // Only animate packets along attack edges or primary core edges (max 6) to keep 60fps
          const renderPacket = isAttackEdge || idx < 6;

          return (
            <group key={`${edge.source}-${edge.target}-${idx}`}>
              <Line
                points={[p1, p2]}
                color={edgeColor(edge.type, isAttackEdge)}
                lineWidth={isAttackEdge ? 2.0 : multiAsset ? 0.85 : 1.25}
                transparent
                opacity={isAttackEdge ? 0.9 : multiAsset ? 0.42 : 0.6}
              />
              {renderPacket && (
                <DataPacket
                  start={p1}
                  end={p2}
                  speed={isAttackEdge ? 3.4 : 1.5}
                  color={isAttackEdge ? "#ff0055" : edgeColor(edge.type)}
                  size={isAttackEdge ? 0.08 : 0.05}
                />
              )}
            </group>
          );
        })}

        {/* Graph Nodes */}
        {activeGraph.nodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;

          const isSelected = selectedNode?.id === node.id;
          const isAttackActive =
            simulationRunning && (node.type === "THREAT" || node.type === "SERVICE");

          const dimmed = layerFilter !== "ALL" && node.type !== layerFilter && node.type !== "ASSET";

          return (
            <TwinNode
              key={node.id}
              node={node}
              position={pos}
              multiAsset={multiAsset}
              isSelected={isSelected}
              isAttackActive={isAttackActive}
              dimmed={dimmed}
              onSelect={(n) => onSelectNode(n, pos)}
            />
          );
        })}
      </group>

      <OrbitControls
        ref={controlsRef}
        enableZoom
        enablePan
        autoRotate={false}
        minDistance={3.5}
        maxDistance={multiAsset ? 26 : 16}
      />
    </>
  );
}

export default function NetworkScene({
  graph,
  selectedNode,
  onSelectNode,
  activeAttackPath,
  simulationRunning,
  cameraPreset = "overview",
  layerFilter = "ALL",
  isSpinning = true,
  spinSpeed = 0.35,
  zoomRef,
  onRegisterControls,
}) {
  const multiAsset =
    (graph?.nodes || []).filter((n) => n.type === "ASSET").length > 1;

  const internalZoomRef = useRef({
    zoomIn: () => {},
    zoomOut: () => {},
    resetZoom: () => {},
  });

  const handleRegisterZoom = useCallback(
    (handlers) => {
      internalZoomRef.current = handlers;
      if (zoomRef) {
        zoomRef.current = handlers;
      }
      if (onRegisterControls) {
        onRegisterControls(handlers);
      }
    },
    [zoomRef, onRegisterControls]
  );

  return (
    <div className="network-scene w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{
          position: multiAsset ? [0, 0, 16] : [0, 0, 10],
          fov: multiAsset ? 50 : 45,
        }}
        dpr={[1, 1.25]}
        gl={{ powerPreference: "high-performance", antialias: true, alpha: true }}
      >
        <FullGraphScene
          graph={graph}
          selectedNode={selectedNode}
          onSelectNode={onSelectNode}
          activeAttackPath={activeAttackPath}
          simulationRunning={simulationRunning}
          cameraPreset={cameraPreset}
          layerFilter={layerFilter}
          isSpinning={isSpinning}
          spinSpeed={spinSpeed}
          onRegisterZoomControls={handleRegisterZoom}
        />
      </Canvas>

      {/* Floating 3D In-Diagram Zoom Controls (+ and -) */}
      <div className="absolute bottom-5 right-5 z-20 flex flex-col items-center gap-1.5 bg-slate-950/85 border border-cyan-500/30 p-2 rounded-2xl backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.8)]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            internalZoomRef.current?.zoomIn();
            cyberAudio.playBeep(700, 0.04);
          }}
          className="h-9 w-9 rounded-xl bg-white/5 hover:bg-cyan-400/20 text-cyan-300 hover:text-white flex items-center justify-center font-mono font-bold text-2xl border border-white/10 hover:border-cyan-400/60 transition cursor-pointer active:scale-95 shadow-md"
          title="Zoom In (+)"
        >
          +
        </button>
        <div className="h-[1px] w-5 bg-white/15 my-0.5" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            internalZoomRef.current?.zoomOut();
            cyberAudio.playBeep(500, 0.04);
          }}
          className="h-9 w-9 rounded-xl bg-white/5 hover:bg-cyan-400/20 text-cyan-300 hover:text-white flex items-center justify-center font-mono font-bold text-2xl border border-white/10 hover:border-cyan-400/60 transition cursor-pointer active:scale-95 shadow-md"
          title="Zoom Out (-)"
        >
          &minus;
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            internalZoomRef.current?.resetZoom();
            cyberAudio.playBeep(600, 0.04);
          }}
          className="mt-1 px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-300 text-[10px] font-mono tracking-wider uppercase border border-white/10 transition cursor-pointer"
          title="Reset 3D Camera Zoom"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
