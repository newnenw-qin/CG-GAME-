"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Embers() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const count = 260;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.4) * 4;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((_, delta) => {
    const position = geo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      let y = position.getY(i) + delta * (0.12 + (i % 6) * 0.02);
      if (y > 4.8) y = -4.6;
      position.setY(i, y);
    }
    position.needsUpdate = true;
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#e7b56a"
        size={0.03}
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function EmberField() {
  return (
    <div className="ember-field">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 48 }}
        dpr={[1, 1.4]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      >
        <Embers />
      </Canvas>
    </div>
  );
}
