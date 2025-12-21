import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = ({ status }) => {
  const mesh = useRef(null);
  
  const color = useMemo(() => {
    switch (status) {
      case 'critical': return '#ef4444'; // red-500
      case 'warning': return '#f59e0b'; // amber-500
      default: return '#22d3ee'; // cyan-400
    }
  }, [status]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere ref={mesh} visible args={[1, 100, 200]} scale={2}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        wireframe={false}
      />
    </Sphere>
  );
};

const SystemHealthOrb = ({ status = 'healthy' }) => {
  return (
    <div className="w-full h-48 relative">
       <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color={status === 'critical' ? 'red' : 'blue'} intensity={0.5} />
        <AnimatedSphere status={status} />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-white/20 font-mono text-xs tracking-widest uppercase">System Core</span>
      </div>
    </div>
  );
};

export default SystemHealthOrb;
