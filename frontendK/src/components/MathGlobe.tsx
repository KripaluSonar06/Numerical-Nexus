import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

const MathGlobe = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const symbolsRef = useRef<THREE.Group>(null);
  
  const symbols = useMemo(() => ['Σ', 'π', '∫', 'e', 'Lₙ', '∞', '√', 'φ', 'δ', 'λ'], []);

  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
      globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      
      // Pulsing glow effect
      const material = globeRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.2 + Math.sin(state.clock.elapsedTime) * 0.1;
    }
    
    if (symbolsRef.current) {
      symbolsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group>
      {/* Main Globe */}
      <Sphere ref={globeRef} args={[1.2, 32, 32]}>
        <meshStandardMaterial
          color="#4f46e5"
          emissive="#00d9ff"
          emissiveIntensity={0.2}
          wireframe
          transparent
          opacity={0.6}
        />
      </Sphere>

      {/* Orbiting Symbols */}
      <group ref={symbolsRef}>
        {symbols.map((symbol, i) => {
          const angle = (i / symbols.length) * Math.PI * 2;
          const radius = 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (Math.random() - 0.5) * 1.5;
          
          return (
            <Text
              key={symbol}
              position={[x, y, z]}
              fontSize={0.3}
              color="#00d9ff"
              anchorX="center"
              anchorY="middle"
            >
              {symbol}
            </Text>
          );
        })}
      </group>

      {/* Lighting */}
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d9ff" />
      <ambientLight intensity={0.3} />
    </group>
  );
};

export default MathGlobe;
