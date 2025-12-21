import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Stars } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const GlobePoints = (props) => {
  const ref = useRef();
  // Generate 5000 points on a sphere radius 1.2
  const sphere = random.inSphere(new Float32Array(5000), { radius: 1.2 });

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#06b6d4" // Cyan-500
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const ActiveBeams = () => {
    // Simulated active connections "shooting" out
    const group = useRef();
    return (
        <group ref={group}>
            {[...Array(5)].map((_, i) => (
                <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                    <cylinderGeometry args={[0.002, 0.002, 3, 3]} />
                    <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
                </mesh>
            ))}
        </group>
    )
}

export default function HolographicGlobe() {
  return (
    <div className="w-full h-full min-h-[300px] relative rounded-2xl overflow-hidden bg-[#0A0A0B]/50">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Global Ingestion</span>
        </div>
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <fog attach="fog" args={['#0A0A0B', 1, 4]} />
        <GlobePoints />
        <ActiveBeams />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
