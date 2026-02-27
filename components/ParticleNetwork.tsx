"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 140;
const CONNECTION_DISTANCE = 2.6;
const BOUNDS = 6;

function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * BOUNDS * 2,
          (Math.random() - 0.5) * BOUNDS * 2,
          (Math.random() - 0.5) * BOUNDS * 1.5
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.002
        ),
      });
    }
    return arr;
  }, []);

  const linePositions = useMemo(
    () => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6),
    []
  );
  const lineColors = useMemo(
    () => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6),
    []
  );

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));
    geo.setDrawRange(0, 0);
    return geo;
  }, [linePositions, lineColors]);

  useFrame(() => {
    // Mouse parallax
    if (groupRef.current) {
      groupRef.current.rotation.y += (mouseRef.current.x * 0.12 - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (mouseRef.current.y * 0.08 - groupRef.current.rotation.x) * 0.02;
    }

    let lineIndex = 0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];
      p.position.add(p.velocity);

      ["x", "y", "z"].forEach((axis) => {
        const bound = axis === "z" ? BOUNDS * 0.75 : BOUNDS;
        if (Math.abs(p.position[axis as "x" | "y" | "z"]) > bound) {
          p.velocity[axis as "x" | "y" | "z"] *= -1;
        }
      });

      dummy.position.copy(p.position);
      dummy.scale.setScalar(0.03);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dist = p.position.distanceTo(particles[j].position);
        if (dist < CONNECTION_DISTANCE) {
          const alpha = 1 - dist / CONNECTION_DISTANCE;
          const idx = lineIndex * 6;

          linePositions[idx] = p.position.x;
          linePositions[idx + 1] = p.position.y;
          linePositions[idx + 2] = p.position.z;
          linePositions[idx + 3] = particles[j].position.x;
          linePositions[idx + 4] = particles[j].position.y;
          linePositions[idx + 5] = particles[j].position.z;

          // Cyan-purple gradient based on position
          const t = (p.position.x + BOUNDS) / (BOUNDS * 2);
          const r = (0.0 * (1 - t) + 0.69 * t) * alpha;
          const g = (0.898 * (1 - t) + 0.149 * t) * alpha;
          const b = (1.0 * (1 - t) + 1.0 * t) * alpha;
          lineColors[idx] = r;
          lineColors[idx + 1] = g;
          lineColors[idx + 2] = b;
          lineColors[idx + 3] = r;
          lineColors[idx + 4] = g;
          lineColors[idx + 5] = b;

          lineIndex++;
        }
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    lineGeometry.setDrawRange(0, lineIndex * 2);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.5} />
      </instancedMesh>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.12} />
      </lineSegments>
    </group>
  );
}

export default function ParticleNetwork() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none opacity-35">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
